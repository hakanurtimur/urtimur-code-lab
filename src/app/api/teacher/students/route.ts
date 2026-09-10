import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { studentEmailFromUsername } from "@/features/auth/student-identity";
import { parseCreateStudentPayload } from "@/features/teacher/student-payload";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { requireTeacher, TeacherAuthError } from "@/lib/firebase/require-teacher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function dateValue(value: unknown): string | null {
  return value instanceof Timestamp ? value.toDate().toISOString() : null;
}

function errorResponse(error: unknown) {
  if (error instanceof TeacherAuthError) return NextResponse.json({ error: error.message }, { status: error.status });
  const message = error instanceof Error ? error.message : "İşlem tamamlanamadı.";
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code.includes("email-already-exists")) {
    return NextResponse.json({ error: "Bu kullanıcı adı zaten kullanılıyor." }, { status: 409 });
  }
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request: Request) {
  try {
    await requireTeacher(request);
    const snapshot = await getAdminDb().collection("students").orderBy("name").get();
    const students = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: String(data.name ?? ""),
        username: String(data.username ?? ""),
        active: data.active !== false,
        maxUnlockedWeekOrder: typeof data.maxUnlockedWeekOrder === "number" ? data.maxUnlockedWeekOrder : 1,
        createdAt: dateValue(data.createdAt),
        updatedAt: dateValue(data.updatedAt),
      };
    });
    return NextResponse.json({ students });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  let createdUid: string | null = null;
  try {
    await requireTeacher(request);
    const payload = parseCreateStudentPayload(await request.json());
    const auth = getAdminAuth();
    const db = getAdminDb();

    const user = await auth.createUser({
      email: studentEmailFromUsername(payload.username),
      password: payload.password,
      displayName: payload.name,
      disabled: false,
    });
    createdUid = user.uid;
    await auth.setCustomUserClaims(user.uid, { role: "student" });
    await db.collection("students").doc(user.uid).set({
      name: payload.name,
      username: payload.username,
      usernameNormalized: payload.username,
      active: true,
      maxUnlockedWeekOrder: 1,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { student: { id: user.uid, name: payload.name, username: payload.username, active: true, maxUnlockedWeekOrder: 1, createdAt: null, updatedAt: null } },
      { status: 201 },
    );
  } catch (error) {
    if (createdUid) {
      try { await getAdminAuth().deleteUser(createdUid); } catch { /* rollback best effort */ }
    }
    return errorResponse(error);
  }
}
