import type { DecodedIdToken } from "firebase-admin/auth";
import { getAdminAuth } from "./admin";

export class TeacherAuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.name = "TeacherAuthError";
    this.status = status;
  }
}

export async function requireTeacher(request: Request): Promise<DecodedIdToken> {
  const authorization = request.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) {
    throw new TeacherAuthError("Öğretmen oturumu gerekli.", 401);
  }

  const idToken = authorization.slice("Bearer ".length).trim();
  if (!idToken) throw new TeacherAuthError("Öğretmen oturumu gerekli.", 401);

  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    if (decoded.role !== "teacher") {
      throw new TeacherAuthError("Bu işlem için öğretmen yetkisi gerekli.", 403);
    }
    return decoded;
  } catch (error) {
    if (error instanceof TeacherAuthError) throw error;
    throw new TeacherAuthError("Öğretmen oturumu doğrulanamadı.", 401);
  }
}
