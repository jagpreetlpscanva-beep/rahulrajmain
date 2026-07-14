import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { readBookings, addBooking, setBookingStatus, deleteBooking, type Booking } from "@/lib/bookings";
import { notifyBookingWhatsApp } from "@/lib/notify";
import { readCollection, writeCollection } from "@/lib/contentRepo";
import { newId, type Slot } from "@/lib/cms";

export const dynamic = "force-dynamic";

async function isAuthed(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return verifyToken(token);
}

/** POST — public: create a booking (and mark the chosen slot booked). */
export async function POST(req: Request) {
  let body: Record<string, string> = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  // mark the slot booked, if one was chosen
  let slotDate = body.slotDate;
  let slotTime = body.slotTime;
  if (body.slotId) {
    try {
      const slots = (await readCollection("slots")) as Slot[];
      const slot = slots.find((s) => s.id === body.slotId);
      if (slot) {
        if (slot.booked) {
          return NextResponse.json({ error: "That slot was just taken. Please pick another." }, { status: 409 });
        }
        slotDate = slot.date;
        slotTime = slot.time;
        await writeCollection(
          "slots",
          slots.map((s) => (s.id === body.slotId ? { ...s, booked: true } : s))
        );
      }
    } catch {
      /* slot store unavailable — continue without locking */
    }
  }

  const booking: Booking = {
    id: newId("bk"),
    itemType: String(body.itemType || "consultation"),
    itemId: String(body.itemId || ""),
    itemTitle: String(body.itemTitle || ""),
    amount: String(body.amount || ""),
    slotId: body.slotId || undefined,
    slotDate,
    slotTime,
    name,
    phone,
    email: String(body.email || "").trim() || undefined,
    coupon: String(body.coupon || "").trim() || undefined,
    paid: String(body.paid) === "true",
    paymentMethod: body.paymentMethod === "cash" ? "cash" : body.paymentMethod === "online" ? "online" : undefined,
    paymentId: String(body.paymentId || "").trim() || undefined,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  try {
    await addBooking(booking);
  } catch {
    return NextResponse.json({ error: "Could not save your booking" }, { status: 500 });
  }

  // Notify the owner on WhatsApp (free CallMeBot). Best-effort — a failed/absent
  // alert must never fail the booking itself.
  try {
    await notifyBookingWhatsApp(booking);
  } catch {
    /* ignore */
  }

  return NextResponse.json({ ok: true, id: booking.id });
}

/** GET — admin: list bookings. */
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await readBookings());
}

/** PATCH — admin: update a booking's status. */
export async function PATCH(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { id?: string; status?: Booking["status"] } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }
  return NextResponse.json(await setBookingStatus(body.id, body.status));
}

/** DELETE — admin: remove a booking. */
export async function DELETE(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { id?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  return NextResponse.json(await deleteBooking(body.id));
}
