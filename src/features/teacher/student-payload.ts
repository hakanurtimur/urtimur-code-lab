import {
  normalizeStudentUsername,
  validateStudentPassword,
  validateStudentUsername,
} from "@/features/auth/student-identity";
import { getTotalCurriculumWeeks } from "@/features/curriculum/get-lesson";

export type CreateStudentPayload = {
  name: string;
  username: string;
  password: string;
};

export type UpdateStudentPayload = {
  name?: string;
  username?: string;
  password?: string;
  active?: boolean;
  maxUnlockedWeekOrder?: number;
};

export function parseCreateStudentPayload(value: unknown): CreateStudentPayload {
  if (!value || typeof value !== "object") throw new Error("Geçersiz öğrenci verisi.");
  const input = value as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const username = typeof input.username === "string" ? normalizeStudentUsername(input.username) : "";
  const password = typeof input.password === "string" ? input.password : "";

  if (name.length < 2 || name.length > 80) throw new Error("Öğrenci adı 2–80 karakter olmalı.");
  if (!validateStudentUsername(username)) throw new Error("Kullanıcı adı 3–32 karakter olmalı.");
  if (!validateStudentPassword(password)) throw new Error("Şifre en az 6 karakter olmalı.");

  return { name, username, password };
}

export function parseUpdateStudentPayload(value: unknown): UpdateStudentPayload {
  if (!value || typeof value !== "object") throw new Error("Geçersiz öğrenci verisi.");
  const input = value as Record<string, unknown>;
  const result: UpdateStudentPayload = {};

  if ("name" in input) {
    const name = typeof input.name === "string" ? input.name.trim() : "";
    if (name.length < 2 || name.length > 80) throw new Error("Öğrenci adı 2–80 karakter olmalı.");
    result.name = name;
  }

  if ("username" in input) {
    const username = typeof input.username === "string" ? normalizeStudentUsername(input.username) : "";
    if (!validateStudentUsername(username)) throw new Error("Kullanıcı adı 3–32 karakter olmalı.");
    result.username = username;
  }

  if ("password" in input && input.password !== "") {
    const password = typeof input.password === "string" ? input.password : "";
    if (!validateStudentPassword(password)) throw new Error("Yeni şifre en az 6 karakter olmalı.");
    result.password = password;
  }

  if ("active" in input) {
    if (typeof input.active !== "boolean") throw new Error("Aktiflik değeri geçersiz.");
    result.active = input.active;
  }

  if ("maxUnlockedWeekOrder" in input) {
    const totalWeeks = getTotalCurriculumWeeks();
    const weekOrder = input.maxUnlockedWeekOrder;
    if (
      typeof weekOrder !== "number" ||
      !Number.isInteger(weekOrder) ||
      weekOrder < 1 ||
      weekOrder > totalWeeks
    ) {
      throw new Error(`Açık hafta 1–${totalWeeks} arasında olmalı.`);
    }
    result.maxUnlockedWeekOrder = weekOrder;
  }

  return result;
}
