import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Creates a Razorpay order. Credentials come from env — never hard-coded. */
export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "not_configured", message: "Online payment is being set up. Please try cash or contact us." },
      { status: 503 }
    );
  }

  let body: { amount?: number } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  const rupees = Math.round(Number(body.amount) || 0);
  if (rupees <= 0) {
    return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  try {
    const r = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: rupees * 100, currency: "INR", receipt: `rcpt_${Date.now()}` }),
      cache: "no-store",
    });
    const data = await r.json();
    if (!r.ok) {
      return NextResponse.json({ error: "order_failed", data }, { status: 502 });
    }
    // keyId is safe to send to the browser (it's the public checkout key)
    return NextResponse.json({ orderId: data.id, amount: data.amount, currency: data.currency, keyId });
  } catch {
    return NextResponse.json({ error: "network_error" }, { status: 502 });
  }
}
