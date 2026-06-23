import { NextResponse } from "next/server";
import { checkCredentials, createToken, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { username?: string; password?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  if (!body.username || !body.password || !checkCredentials(body.username, body.password)) {
    return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
