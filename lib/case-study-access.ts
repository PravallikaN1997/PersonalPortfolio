// Server-side access control for the flagship case study.
// Never import this file from a Client Component.
import { cookies, headers } from "next/headers";
import { connection } from "next/server";
import { passwordMatches, signToken, verifyToken } from "@/lib/case-study-token";

export const CASE_STUDY_PATH = "/work/ownership-and-progress";
// One password unlocks every case study, so the session cookie is sent to all of /work.
const COOKIE_PATH = "/work";

/** Only these pages may be returned to after unlocking. */
const PROTECTED = ["/work/ownership-and-progress", "/work/when-should-the-ai-speak"];
export function safeReturn(to: unknown): string {
  return typeof to === "string" && PROTECTED.includes(to) ? to : CASE_STUDY_PATH;
}
const COOKIE_NAME = "cs_ownership_access";
const SESSION_SECONDS = 60 * 60 * 12; // 12 hours

/** Both variables are required. If either is missing, access is denied (fail closed). */
function config() {
  const password = process.env.CASE_STUDY_PASSWORD;
  const secret = process.env.CASE_STUDY_SESSION_SECRET;
  if (!password || !secret || secret.length < 32) return null;
  return { password, secret };
}

export function isConfigured() {
  return config() !== null;
}

export function checkPassword(input: string) {
  const c = config();
  return c !== null && passwordMatches(input, c.password);
}

export async function hasAccess(): Promise<boolean> {
  const c = config();
  if (!c) return false;
  // Access depends on the request and on the current time, so never prerender it.
  await connection();
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return verifyToken(c.secret, token);
}

export async function grantAccess() {
  const c = config();
  if (!c) throw new Error("Case study access is not configured.");
  const expiresAt = Date.now() + SESSION_SECONDS * 1000;
  (await cookies()).set(COOKIE_NAME, signToken(c.secret, expiresAt), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: COOKIE_PATH,
    maxAge: SESSION_SECONDS,
  });
}

// Best-effort brute-force slowdown. In-memory, so it is per server instance only.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILURES = 5;
const failures = new Map<string, number[]>();

export async function clientKey() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

function recent(key: string) {
  const now = Date.now();
  const list = (failures.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  failures.set(key, list);
  return list;
}

export function isLockedOut(key: string) {
  return recent(key).length >= MAX_FAILURES;
}

export function recordFailure(key: string) {
  recent(key).push(Date.now());
}

export function clearFailures(key: string) {
  failures.delete(key);
}
