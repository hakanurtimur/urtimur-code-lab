import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { studentEmailFromUsername } from "@/features/auth/student-identity";
import { parseUpdateStudentPayload } from "@/features/teacher/student-payload";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { requireTeacher, TeacherAuthError } from "@/lib/firebase/require-teacher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ uid: string }> };

function errorResponse(error: unknown) {
  if (error instanceof TeacherAuthError) return NextResponse.json({ error: error.message }, { status: error.status });
  const message = error instanceof Error ? error.message : "İşlem tamamlanamadı.";
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code.includes("email-already-exists")) {
    return NextResponse.json({ error: "Bu kullanıcı adı zaten kullanılıyor." }, { status: 409 });
  }
  const status = code.includes("user-not-found") ? 404 : 400;
  return NextResponse.json({ error: message }, { status });
}

async function deleteProgress(uid: string) {
  const db = getAdminDb();
  const progress = await db.collection("students").doc(uid).collection("progress").get();
  const chunks = [];
  for (let index = 0; index < progress.docs.length; index += 400) chunks.push(progress.docs.slice(index, index + 400));
  for (const chunk of chunks) {
    const batch = db.batch();
    chunk.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    await requireTeacher(request);
    const { uid } = await context.params;
    const payload = parseUpdateStudentPayload(await request.json());
    const targetUser = await getAdminAuth().getUser(uid);
    if (targetUser.customClaims?.role !== "student") {
      return NextResponse.json({ error: "Hedef hesap öğrenci hesabı değil." }, { status: 400 });
    }
    const authUpdates: { email?: string; password?: string; displayName?: string; disabled?: boolean } = {};
    const profileUpdates: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };

    if (payload.name !== undefined) {
      authUpdates.displayName = payload.name;
      profileUpdates.name = payload.name;
    }
    if (payload.username !== undefined) {
      authUpdates.email = studentEmailFromUsername(payload.username);
      profileUpdates.username = payload.username;
      profileUpdates.usernameNormalized = payload.username;
    }
    if (payload.password !== undefined) authUpdates.password = payload.password;
    if (payload.active !== undefined) {
      authUpdates.disabled = !payload.active;
      profileUpdates.active = payload.active;
    }
    if (payload.maxUnlockedWeekOrder !== undefined) {
      profileUpdates.maxUnlockedWeekOrder = payload.maxUnlockedWeekOrder;
    }

    const auth = getAdminAuth();
    if (Object.keys(authUpdates).length) await auth.updateUser(uid, authUpdates);
    await getAdminDb().collection("students").doc(uid).set(profileUpdates, { merge: true });
    if (payload.active === false || payload.password !== undefined) {
      await auth.revokeRefreshTokens(uid);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: Context) {
  try {
    await requireTeacher(request);
    const { uid } = await context.params;
    const db = getAdminDb();
    const targetUser = await getAdminAuth().getUser(uid);
    if (targetUser.customClaims?.role !== "student") {
      return NextResponse.json({ error: "Hedef hesap öğrenci hesabı değil." }, { status: 400 });
    }

    await deleteProgress(uid);
    await Promise.all([
      db.collection("liveSessions").doc(uid).delete().catch(() => undefined),
      db.collection("students").doc(uid).delete(),
      getAdminAuth().deleteUser(uid),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
