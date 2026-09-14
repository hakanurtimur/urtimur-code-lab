import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { requireTeacher, TeacherAuthError } from "@/lib/firebase/require-teacher";

type Context = { params: Promise<{ uid: string; lessonId: string }> };

export async function POST(request: Request, context: Context) {
  try {
    await requireTeacher(request);
    const { uid, lessonId } = await context.params;
    const targetUser = await getAdminAuth().getUser(uid);
    if (targetUser.customClaims?.role !== "student") {
      return NextResponse.json({ error: "Hedef hesap öğrenci hesabı değil." }, { status: 400 });
    }

    await getAdminDb().collection("students").doc(uid).collection("progress").doc(lessonId).set({
      lessonId,
      completed: true,
      completedAt: FieldValue.serverTimestamp(),
      practiceCompleted: true,
      challengeCompleted: true,
      miniCompleted: true,
      currentStage: "mini",
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof TeacherAuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Ders tamamlanamadı." }, { status: 400 });
  }
}
