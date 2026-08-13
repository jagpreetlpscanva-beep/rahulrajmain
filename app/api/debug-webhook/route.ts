import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.BOOKING_WEBHOOK_URL;

  if (!url) {
    return NextResponse.json({ envVarPresent: false, message: "BOOKING_WEBHOOK_URL is not set in this deployment" });
  }

  const testPayload = {
    event: "debug_test",
    bookingId: "debug-test-id",
    name: "Debug Test",
    phone: "919936546223",
    email: "",
    service: "Debug",
    itemType: "consultation",
    slotDate: "",
    slotTime: "",
    amount: 0,
    amountText: "₹0",
    paid: false,
    paymentMethod: "",
    coupon: "",
    createdAt: new Date().toISOString(),
    summary: "This is a debug test hit from /api/debug-webhook",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
      cache: "no-store",
    });
    const text = await res.text().catch(() => "");
    return NextResponse.json({
      envVarPresent: true,
      urlUsed: url,
      n8nStatus: res.status,
      n8nOk: res.ok,
      n8nResponseBody: text,
    });
  } catch (err: unknown) {
    return NextResponse.json({
      envVarPresent: true,
      urlUsed: url,
      fetchError: err instanceof Error ? err.message : String(err),
    });
  }
}
