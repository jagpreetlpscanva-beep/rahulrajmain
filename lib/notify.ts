import type { Booking } from "./bookings";

/**
 * Owner WhatsApp alerts via CallMeBot (free, server-side, no paid gateway).
 *
 * One-time setup by the owner:
 *   1. Save +34 644 51 95 23 in contacts (CallMeBot).
 *   2. WhatsApp it: "I allow callmebot to send me messages"
 *   3. It replies with an API key.
 *   4. Set env vars: CALLMEBOT_PHONE (owner's number, e.g. +919415312590)
 *      and CALLMEBOT_APIKEY.
 *
 * Only sends to the owner's own opted-in number, which is exactly what a
 * "new booking" alert needs. If the env vars are missing it silently no-ops
 * so bookings never fail because of notifications.
 */

function rupees(amount: string): string {
  const n = String(amount || "").replace(/[^\d.]/g, "");
  return n ? `₹${n}` : (amount || "—");
}

export function bookingAlertText(b: Booking): string {
  const lines = [
    "🔔 *Nayi Booking!*",
    `Service: ${b.itemTitle || b.itemType}`,
    `Naam: ${b.name}`,
    `Phone: ${b.phone}`,
  ];
  if (b.slotDate || b.slotTime) lines.push(`Slot: ${b.slotDate ?? ""} ${b.slotTime ?? ""}`.trim());
  lines.push(`Amount: ${rupees(b.amount)}`);
  const pay = b.paid
    ? b.paymentMethod === "cash"
      ? "Cash (consultation par)"
      : "Online PAID ✅"
    : b.paymentMethod === "cash"
    ? "Cash (consultation par)"
    : "Pending";
  lines.push(`Payment: ${pay}`);
  if (b.email) lines.push(`Email: ${b.email}`);
  lines.push(`ID: ${b.id}`);
  return lines.join("\n");
}

/** Fire a WhatsApp alert to the owner (CallMeBot). Never throws. */
export async function notifyBookingWhatsApp(b: Booking): Promise<boolean> {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return false;

  const url =
    "https://api.callmebot.com/whatsapp.php?" +
    new URLSearchParams({ phone, apikey, text: bookingAlertText(b) }).toString();

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function bookingEmailHtml(b: Booking): string {
  const row = (k: string, v?: string) =>
    v ? `<tr><td style="padding:6px 12px;color:#8a6d3b;font-weight:600">${k}</td><td style="padding:6px 12px;color:#222">${v}</td></tr>` : "";
  const pay = b.paid
    ? b.paymentMethod === "cash"
      ? "Cash (consultation par)"
      : "Online PAID ✅"
    : b.paymentMethod === "cash"
    ? "Cash (consultation par)"
    : "Pending";
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e7d8b6;border-radius:12px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#e0b45c,#c8902c);padding:16px 20px;color:#2a1b0e">
      <div style="font-size:18px;font-weight:800">🔔 Nayi Booking!</div>
      <div style="font-size:13px;opacity:.85">Dr. Rahul Raj — astrorahulraj.in</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${row("Service", b.itemTitle || b.itemType)}
      ${row("Naam", b.name)}
      ${row("Phone", b.phone)}
      ${row("Email", b.email)}
      ${row("Slot", [b.slotDate, b.slotTime].filter(Boolean).join(" "))}
      ${row("Amount", rupees(b.amount))}
      ${row("Payment", pay)}
      ${row("Coupon", b.coupon)}
      ${row("Booking ID", b.id)}
      ${row("Time", new Date(b.createdAt).toLocaleString("en-IN"))}
    </table>
    <div style="padding:12px 20px;background:#faf4e8;color:#8a6d3b;font-size:12px">
      Yeh alert har nayi booking par automatic aata hai.
    </div>
  </div>`;
}

/** Email the owner about a new booking (Resend HTTP API). Never throws. */
export async function notifyBookingEmail(b: Booking): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_ALERT_EMAIL;
  if (!apiKey || !to) return false;
  const from = process.env.BOOKING_ALERT_FROM || "Rahul Raj Astro <onboarding@resend.dev>";

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()).filter(Boolean),
        subject: `🔔 Nayi Booking: ${b.itemTitle || b.itemType} — ${b.name}`,
        html: bookingEmailHtml(b),
        text: bookingAlertText(b),
      }),
      signal: ctrl.signal,
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** Notify the owner of a new booking via every configured channel (best-effort). */
export async function notifyNewBooking(b: Booking): Promise<void> {
  await Promise.allSettled([notifyBookingWhatsApp(b), notifyBookingEmail(b)]);
}
