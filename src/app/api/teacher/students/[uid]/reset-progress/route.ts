import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { requireTeacher, TeacherAuthError } from "@/lib/firebase/require-teacher";

type Context = { params: Promise<{ uid: string }> };

export async function POST(request: Request, context: Context) {
  try {
    await requireTeacher(request);
    const { uid } = await context.params;
    const targetUser = await getAdminAuth().getUser(uid);
    if (targetUser.customClaims?.role !== "student") {
      return NextResponse.json({ error: "Hedef hesap öğrenci hesabı değil." }, { status: 400 });
    }
    const db = getAdminDb();
    const studentRef = db.collection("students").doc(uid);
    const snapshot = await studentRef.collection("progress").get();

    for (let index = 0; index < snapshot.docs.length; index += 400) {
      const batch = db.batch();
      snapshot.docs.slice(index, index + 400).forEach((document) => batch.delete(document.ref));
      await batch.commit();
    }

    const cleanup = db.batch();
    cleanup.delete(db.collection("liveSessions").doc(uid));
    cleanup.set(
      studentRef,
      {
        currentLessonId: FieldValue.delete(),
        currentWeekId: FieldValue.delete(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    await cleanup.commit();

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof TeacherAuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: error instanceof Error ? error.message : "İlerleme sıfırlanamadı." }, { status: 400 });
  }
}
