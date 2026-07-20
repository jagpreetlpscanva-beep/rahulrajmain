import { NextResponse } from "next/server";
import { newId } from "@/lib/cms";
import {
  addConsultation,
  consultationsByMobile,
  searchConsultations,
  consultationsToday,
  getConsultation,
  readConsultations,
  type Consultation,
} from "@/lib/prescriptions";

export const dynamic = "force-dynamic";

/** POST — save a consultation (append-only). No admin login needed. */
export async function POST(req: Request) {
  let b: Partial<Consultation> = {};
  try {
    b = await req.json();
  } catch {
    /* ignore */
  }
  if (!b.patientName || !b.mobile) {
    return NextResponse.json({ error: "Patient name and mobile are required" }, { status: 400 });
  }

  const c: Consultation = {
    id: newId("rx"),
    patientName: String(b.patientName).trim(),
    mobile: String(b.mobile).trim(),
    gender: String(b.gender || ""),
    dob: String(b.dob || ""),
    tob: String(b.tob || ""),
    place: String(b.place || ""),
    astrologer: String(b.astrologer || "Dr. Rahul Raj"),
    mahadasha: String(b.mahadasha || ""),
    antardasha: String(b.antardasha || ""),
    pratyantar: String(b.pratyantar || ""),
    dosha: String(b.dosha || ""),
    yog: String(b.yog || ""),
    kundali: b.kundali ?? null,
    rows: Array.isArray(b.rows) ? b.rows : [],
    gemstones: Array.isArray(b.gemstones) ? b.gemstones : [],
    notes: String(b.notes || ""),
    createdAt: new Date().toISOString(),
  };

  try {
    await addConsultation(c);
  } catch {
    return NextResponse.json({ error: "Could not save consultation" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: c.id });
}

/** GET ?id= | ?q=name-or-mobile | ?mobile= | ?today=1 — patient history. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const q = url.searchParams.get("q");
  const mobile = url.searchParams.get("mobile");
  const today = url.searchParams.get("today");
  const all = url.searchParams.get("all");
  if (id) return NextResponse.json({ ok: true, consultation: await getConsultation(id) });
  if (today) return NextResponse.json({ ok: true, consultations: await consultationsToday() });
  if (all) return NextResponse.json({ ok: true, consultations: (await readConsultations()).slice(0, 500) });
  if (q) return NextResponse.json({ ok: true, consultations: await searchConsultations(q) });
  if (mobile) return NextResponse.json({ ok: true, consultations: await consultationsByMobile(mobile) });
  return NextResponse.json({ error: "Provide id, q, mobile, today or all" }, { status: 400 });
}
