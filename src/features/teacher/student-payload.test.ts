import { describe, expect, it } from "vitest";
import { parseCreateStudentPayload, parseUpdateStudentPayload } from "./student-payload";

describe("student payload validation", () => {
  it("normalizes a valid student create payload", () => {
    expect(parseCreateStudentPayload({ name: " Ege Yılmaz ", username: " EGE 01 ", password: "robot42" })).toEqual({
      name: "Ege Yılmaz",
      username: "ege-01",
      password: "robot42",
    });
  });

  it("rejects a short password", () => {
    expect(() => parseCreateStudentPayload({ name: "Ege", username: "ege01", password: "12345" })).toThrow("Şifre en az 6 karakter olmalı.");
  });

  it("allows a partial update without forcing a password change", () => {
    expect(parseUpdateStudentPayload({ active: false, password: "" })).toEqual({ active: false });
  });
});
