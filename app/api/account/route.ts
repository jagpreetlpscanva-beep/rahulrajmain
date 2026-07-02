import { NextResponse } from "next/server";
import { readBookings } from "@/lib/bookings";

export const dynamic = "force-dynamic";

/**
 * Public "my account" lookup — returns only the bookings that match the given
 * phone number, so a client can see their own orders/reports. (Phone acts as
 * the login key for now; add OTP once an SMS provider is configured.)
 */
export async function POST(req: Request) {
  let body: { phone?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  const digits = String(body.phone || "").replace(/\D/g, "");
  if (digits.length < 10) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }
  const last10 = digits.slice(-10);

  let all: Awaited<ReturnType<typeof readBookings>> = [];
  try {
    all = await readBookings();
  } catch {
    return NextResponse.json({ ok: true, bookings: [] });
  }

  const mine = all
    .filter((b) => String(b.phone || "").replace(/\D/g, "").slice(-10) === last10)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  return NextResponse.json({ ok: true, bookings: mine });
}
