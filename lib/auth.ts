import crypto from "crypto";

/**
 * Minimal, dependency-free admin auth. A login checks the password against
 * ADMIN_PASSWORD and issues an HMAC-signed, HttpOnly session cookie. Protected
 * API routes verify the cookie server-side, so the admin and the write API
 * can't be used without logging in.
 */

export const COOKIE_NAME = "rr_admin";
export const COOKIE_MAX_AGE = 60 * 60 * 12; // 12 hours

function username(): string {
  return process.env.ADMIN_USERNAME || "admin";
}
function password(): string {
  return process.env.ADMIN_PASSWORD || "rahul2026";
}
function secret(): string {
  return process.env.ADMIN_SECRET || "dev-insecure-secret-change-me";
}

function safeEqual(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function checkCredentials(user: string, pass: string): boolean {
  // evaluate both to keep timing roughly constant
  const okUser = safeEqual(user, username());
  const okPass = safeEqual(pass, password());
  return okUser && okPass;
}

export function createToken(): string {
  const payload = String(Date.now() + COOKIE_MAX_AGE * 1000); // expiry ms
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyToken(token?: string | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && exp > Date.now();
}
