import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE = "https://json.astrologyapi.com/v1/";

/**
 * Proxy to astrologyapi.com's PDF Report product, in Hindi, with our branding.
 * The exact endpoint depends on the account's plan, so it's set via env
 * (ASTROLOGY_PDF_ENDPOINT) — no guessing / wasted API credits. Credentials and
 * branding stay server-side. Returns { pdf_url }.
 */
export async function POST(req: Request) {
  const userId = process.env.ASTROLOGY_API_USER_ID;
  const apiKey = process.env.ASTROLOGY_API_KEY;
  const endpoint = (process.env.ASTROLOGY_PDF_ENDPOINT || "").replace(/^\/+/, "");
  if (!userId || !apiKey || !endpoint) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: Record<string, number | string> = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }

  const payload = {
    day: Number(body.day), month: Number(body.month), year: Number(body.year),
    hour: Number(body.hour) || 0, min: Number(body.min) || 0,
    lat: Number(body.lat), lon: Number(body.lon), tzone: Number(body.tzone) || 5.5,
    name: String(body.name || ""),
    gender: String(body.gender || "male"),
    place: String(body.place || ""),
    // white-label branding baked into the PDF
    company_name: "Dr. Rahul Raj — Vedic Astrologer",
    company_info: "astrorahulraj.in · +91 94153 12590 · LDA Colony, Lucknow",
    logo_url: "https://astrorahulraj.in/brand/logo.png",
    domain_url: "astrorahulraj.in",
    company_contact_no: "+91 94153 12590",
    company_email: "hello@rahulrajastrologer.com",
    footer_text: "© Dr. Rahul Raj Astro · astrorahulraj.in",
  };

  const auth = Buffer.from(`${userId}:${apiKey}`).toString("base64");
  try {
    const r = await fetch(BASE + endpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        "Accept-Language": "hi", // Hindi report
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return NextResponse.json({ error: "pdf_failed", detail: data }, { status: 502 });
    }
    const pdfUrl = data?.pdf_url || data?.pdfUrl || data?.report_url || data?.url || null;
    if (!pdfUrl) {
      return NextResponse.json({ error: "no_pdf_url", detail: data }, { status: 502 });
    }
    return NextResponse.json({ ok: true, pdf_url: pdfUrl });
  } catch {
    return NextResponse.json({ error: "network_error" }, { status: 502 });
  }
}
