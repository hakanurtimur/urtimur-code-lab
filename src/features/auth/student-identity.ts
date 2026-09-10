const TURKISH_ASCII_MAP: Record<string, string> = {
  ç: "c", Ç: "c",
  ğ: "g", Ğ: "g",
  ı: "i", İ: "i", I: "i",
  ö: "o", Ö: "o",
  ş: "s", Ş: "s",
  ü: "u", Ü: "u",
};

export function normalizeStudentUsername(value: string): string {
  return value
    .trim()
    .split("")
    .map((character) => TURKISH_ASCII_MAP[character] ?? character)
    .join("")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "")
    .slice(0, 32);
}

export function studentEmailFromUsername(value: string): string {
  return `${normalizeStudentUsername(value)}@students.urtimur.local`;
}

export function validateStudentUsername(value: string): boolean {
  const normalized = normalizeStudentUsername(value);
  return /^[a-z0-9][a-z0-9_-]{1,30}[a-z0-9]$/.test(normalized);
}

export function validateStudentPassword(value: string): boolean {
  return value.length >= 6 && value.length <= 72;
}
