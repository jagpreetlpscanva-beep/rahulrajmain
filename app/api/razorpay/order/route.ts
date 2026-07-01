import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Create a Razorpay order. Credentials come from env (never the client). */
export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: { amount?: number; name?: string; phone?: string; item?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }

  const rupees = Number(body.amount);
  if (!rupees || rupees <= 0) {
    return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  try {
    const r = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(rupees * 100), // paise
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: {
          name: String(body.name || ""),
          phone: String(body.phone || ""),
          item: String(body.item || ""),
        },
      }),
      cache: "no-store",
    });
    const order = await r.json();
    if (!r.ok) {
      return NextResponse.json({ error: "order_failed", detail: order }, { status: 502 });
    }
    return NextResponse.json({
      ok: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId, // public key id — safe to expose to the checkout
    });
  } catch {
    return NextResponse.json({ error: "network_error" }, { status: 502 });
  }
}
