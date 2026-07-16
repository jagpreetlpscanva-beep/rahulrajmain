import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { newId } from "@/lib/cms";
import {
  addConsultation,
  consultationsByMobile,
  getConsultation,
  type Consultation,
} from "@/lib/prescriptions";

export const dynamic = "force-dynamic";

async function isAuthed(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return verifyToken(token);
}

/** POST — save a consultation (append-only). Admin only. */
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    gemstone: b.gemstone ?? null,
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

/** GET ?mobile= or ?id= — search patient history / open a consultation. Admin only. */
export async function GET(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const mobile = url.searchParams.get("mobile");
  if (id) return NextResponse.json({ ok: true, consultation: await getConsultation(id) });
  if (mobile) return NextResponse.json({ ok: true, consultations: await consultationsByMobile(mobile) });
  return NextResponse.json({ error: "Provide id or mobile" }, { status: 400 });
}
