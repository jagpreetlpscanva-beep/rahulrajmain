import { NextResponse } from "next/server";
import { ALLOWED_ENDPOINTS } from "@/lib/calculators";
import { computePanchang, computeKundli, chartSvgDataUri } from "@/lib/vedic";

export const dynamic = "force-dynamic";

const ASTROLOGYAPI_BASE = "https://json.astrologyapi.com/v1/";

/** Endpoints computed locally (lib/vedic.ts) — free forever, no external API,
 *  no credits, no rate limits: Panchang + Kundli details + chart images. */
const LOCAL_ENDPOINTS = new Set(["advanced_panchang", "astro_details", "horo_chart_image/D1", "horo_chart_image/D9"]);

type Payload = {
  day?: number; month?: number; year?: number; hour?: number; min?: number;
  lat?: number; lon?: number; tzone?: number;
};

function hasBirth(p: Payload): boolean {
  return !!p.year && !!p.month && !!p.day && typeof p.lat === "number" && typeof p.lon === "number";
}

/**
 * Body: { endpoint: string, payload: object, lang?: "hi"|"en" }
 * Panchang + Kundli/chart endpoints -> local Vedic engine (free).
 * Everything else (Manglik, Kaal Sarp, Numerology, Daily Horoscope, etc.) -> astrologyapi.com.
 */
export async function POST(req: Request) {
  let body: { endpoint?: string; payload?: Record<string, unknown>; lang?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }

  const endpoint = String(body.endpoint || "").replace(/^\/+/, "");
  const payload = (body.payload || {}) as Payload;
  // Language for astrologyapi report text ("hi" => Hindi). Defaults to English
  // so existing callers are unaffected; the calculators pass "hi".
  const lang = body.lang === "hi" ? "hi" : "en";

  // ---- Local Vedic engine (Panchang + Kundli) ----
  if (LOCAL_ENDPOINTS.has(endpoint)) {
    if (!hasBirth(payload)) {
      return NextResponse.json({ error: "invalid_payload", message: "Birth date/place required." }, { status: 400 });
    }
    try {
      const p = {
        day: payload.day!, month: payload.month!, year: payload.year!,
        hour: payload.hour ?? 12, min: payload.min ?? 0,
        lat: payload.lat!, lon: payload.lon!, tzone: payload.tzone ?? 5.5,
      };
      let data: unknown;
      if (endpoint === "advanced_panchang") {
        data = computePanchang(p);
      } else if (endpoint === "astro_details") {
        const k = computeKundli(p);
        data = {
          ascendant: k.ascendant, sign: k.sign, nakshatra: k.nakshatra,
          nakshatra_lord: k.nakshatra_lord, sign_lord: k.sign_lord, charan: k.charan,
        };
      } else {
        const k = computeKundli(p);
        data = { svg: chartSvgDataUri(k, endpoint.endsWith("D9") ? "D9" : "D1") };
      }
      return NextResponse.json({ ok: true, data });
    } catch (e) {
      return NextResponse.json({ error: "calc_error", message: (e as Error).message }, { status: 500 });
    }
  }

  // ---- astrologyapi.com path (all other calculators) ----
  const userId = process.env.ASTROLOGY_API_USER_ID;
  const apiKey = process.env.ASTROLOGY_API_KEY;

  if (!userId || !apiKey) {
    return NextResponse.json(
      { error: "not_configured", message: "Calculators are being set up. Please check back soon." },
      { status: 503 }
    );
  }

  const ok = ALLOWED_ENDPOINTS.some((e) => endpoint === e || endpoint.startsWith(`${e}/`));
  if (!endpoint || !ok) {
    return NextResponse.json({ error: "invalid_endpoint" }, { status: 400 });
  }

  const auth = Buffer.from(`${userId}:${apiKey}`).toString("base64");

  try {
    const r = await fetch(ASTROLOGYAPI_BASE + endpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        "Accept-Language": lang,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await r.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!r.ok) {
      return NextResponse.json(
        { error: "api_error", status: r.status, data },
        { status: r.status === 401 ? 502 : r.status }
      );
    }
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ error: "network_error", message: "Could not reach the astrology service." }, { status: 502 });
  }
}
