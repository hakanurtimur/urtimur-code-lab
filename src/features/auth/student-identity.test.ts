import { describe, expect, it } from "vitest";
import {
  normalizeStudentUsername,
  studentEmailFromUsername,
  validateStudentPassword,
  validateStudentUsername,
} from "./student-identity";

describe("student identity helpers", () => {
  it("normalizes Turkish characters and spaces into a safe username", () => {
    expect(normalizeStudentUsername("  Çağrı Öğrenci  ")).toBe("cagri-ogrenci");
    expect(normalizeStudentUsername("EGE_01!")).toBe("ege_01");
  });

  it("creates an internal auth email without exposing email UX", () => {
    expect(studentEmailFromUsername("EGE_01")).toBe("ege_01@students.urtimur.local");
  });

  it("validates supported usernames", () => {
    expect(validateStudentUsername("ege_01")).toBe(true);
    expect(validateStudentUsername("ab")).toBe(false);
    expect(validateStudentUsername("_ege")).toBe(true);
  });

  it("requires 6-72 character passwords", () => {
    expect(validateStudentPassword("robot42")).toBe(true);
    expect(validateStudentPassword("12345")).toBe(false);
    expect(validateStudentPassword("a".repeat(73))).toBe(false);
  });
});
