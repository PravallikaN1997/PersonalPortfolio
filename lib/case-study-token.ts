// Pure helpers (no Next.js imports) so they can be unit-tested.
// Used only on the server.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const VERSION = "v1";

function mac(secret: string, payload: string) {
  return createHmac("sha256", secret).update(payload).digest();
}

/** Token format: v1.<expiresAtMs>.<base64url HMAC-SHA256>. Nothing secret is inside it. */
export function signToken(secret: string, expiresAtMs: number): string {
  const payload = `${VERSION}.${expiresAtMs}`;
  return `${payload}.${mac(secret, payload).toString("base64url")}`;
}

export function verifyToken(
  secret: string,
  token: string | undefined | null,
  nowMs: number = Date.now(),
): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== VERSION) return false;
  const expiresAt = Number(parts[1]);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= nowMs) return false;
  const given = Buffer.from(parts[2], "base64url");
  const expected = mac(secret, `${VERSION}.${parts[1]}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Constant-time comparison (hashes both sides first so lengths never leak). */
export function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
