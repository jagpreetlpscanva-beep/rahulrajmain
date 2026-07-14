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

/** Fire a WhatsApp alert to the owner. Never throws — returns whether it sent. */
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
