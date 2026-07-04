import { NextResponse } from "next/server";
import { ALLOWED_ENDPOINTS } from "@/lib/calculators";
import { prokeralaGet, prokeralaChartSvg, toProkeralaDatetime } from "@/lib/prokerala";

export const dynamic = "force-dynamic";

const ASTROLOGYAPI_BASE = "https://json.astrologyapi.com/v1/";

/** These logical endpoint names (used by the frontend) now run on Prokerala
 *  instead of astrologyapi.com — Panchang + Kundli/chart generation. */
const PROKERALA_ENDPOINTS = new Set(["advanced_panchang", "astro_details", "horo_chart_image/D1", "horo_chart_image/D9"]);

type Payload = {
  day?: number; month?: number; year?: number; hour?: number; min?: number;
  lat?: number; lon?: number; tzone?: number;
};

function coords(p: Payload) {
  return `${p.lat},${p.lon}`;
}

/** pull a value out of Prokerala's nested {name:..} / {en:..} / array shapes */
function name(v: unknown): string | undefined {
  if (!v) return undefined;
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return name(v[0]);
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    return (o.name as string) ?? (o.en as string) ?? undefined;
  }
  return undefined;
}

/** Prokerala returns ISO like "2026-07-04T05:21:13+05:30" — show the local
 *  wall-clock time (already in the location's timezone), e.g. "5:21 AM". */
function fmtTime(v: unknown): string | undefined {
  if (typeof v !== "string" || !v.trim()) return undefined;
  const iso = v.match(/T(\d{2}):(\d{2})/);
  const plain = v.match(/^(\d{1,2}):(\d{2})/);
  const m = iso ?? plain;
  if (!m) return v;
  const hh = Number(m[1]);
  const mm = m[2];
  const ap = hh >= 12 ? "PM" : "AM";
  const h12 = ((hh + 11) % 12) + 1;
  return `${h12}:${mm} ${ap}`;
}

/** {start,end} -> "5:21 AM - 6:45 AM". Prokerala v2 nests the window under
 *  period: [{ start, end }]; older shapes put start/end directly on the object. */
function asRange(v: unknown): string | undefined {
  if (!v) return undefined;
  if (typeof v === "string") return fmtTime(v);
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (Array.isArray(o.period) && o.period[0]) return asRange(o.period[0]);
    const s = o.start ?? o.start_time ?? o.starttime;
    const e = o.end ?? o.end_time ?? o.endtime;
    if (s && e) return `${fmtTime(s) ?? s} - ${fmtTime(e) ?? e}`;
  }
  return undefined;
}

/** Try several possible key spellings (Prokerala's naming isn't fully consistent
 *  across accounts/versions), then fall back to scanning any inauspicious/
 *  auspicious period arrays for an entry whose name matches. */
function findPeriod(raw: Record<string, unknown>, keyCandidates: string[], nameMatch: RegExp): string | undefined {
  for (const k of keyCandidates) {
    const v = asRange(raw[k]);
    if (v) return v;
  }
  for (const listKey of ["inauspicious_period", "auspicious_period", "muhurat", "muhurta"]) {
    const list = raw[listKey];
    if (Array.isArray(list)) {
      const hit = list.find((it) => nameMatch.test(String((it as Record<string, unknown>)?.name ?? "")));
      const v = asRange(hit);
      if (v) return v;
    }
  }
  return undefined;
}

// Panchang for a given city+date is identical for everyone, so cache the
// normalized result server-side. This means Prokerala is hit at most once per
// city/day (per serverless instance) instead of on every visitor's page load —
// which is what was tripping the free-tier rate limit (429). TTL 6h.
const panchangCache = new Map<string, { data: unknown; ts: number }>();
const PANCHANG_TTL_MS = 6 * 60 * 60 * 1000;

async function handlePanchang(payload: Payload) {
  const datetime = toProkeralaDatetime({
    day: payload.day!, month: payload.month!, year: payload.year!,
    hour: payload.hour ?? 6, min: payload.min ?? 0, tzone: payload.tzone ?? 5.5,
  });
  const cacheKey = `${coords(payload)}:${datetime.slice(0, 10)}`;
  const hit = panchangCache.get(cacheKey);
  if (hit && Date.now() - hit.ts < PANCHANG_TTL_MS) return hit.data;

  const params = { ayanamsa: "1", coordinates: coords(payload), datetime, la: "en" };
  // The basic panchang endpoint has tithi/nakshatra/sunrise etc. but NOT the
  // Rahu/Gulika/Yamaganda/Abhijit windows — those live in the (in)auspicious
  // period endpoints. Fetch sequentially (not in parallel) so the free tier's
  // concurrency limit doesn't 429; the two extras are best-effort.
  const raw = (await prokeralaGet("/v2/astrology/panchang", params)) as Record<string, unknown>;
  const inaus = (await prokeralaGet("/v2/astrology/inauspicious-period", params).catch(() => ({}))) as Record<string, unknown>;
  const aus = (await prokeralaGet("/v2/astrology/auspicious-period", params).catch(() => ({}))) as Record<string, unknown>;

  // Merge the muhurat lists so findPeriod() can match Rahu/Gulika/Yamaganda/Abhijit by name.
  const periods: Record<string, unknown> = {
    ...raw,
    inauspicious_period: (inaus as { muhurat?: unknown })?.muhurat ?? inaus,
    auspicious_period: (aus as { muhurat?: unknown })?.muhurat ?? aus,
  };
  const gulika = findPeriod(periods, ["gulika_kaal", "gulikai_kaal", "gulika_kaalam", "gulikakalam"], /gulik/i);
  const yamghanta = findPeriod(periods, ["yamaganda_kaal", "yama_gandam", "yamagandam", "yamaganda_kaalam"], /yama/i);

  const result = {
    tithi: { details: { tithi_name: name(raw.tithi) } },
    nakshatra: { details: { nak_name: name(raw.nakshatra) } },
    yog: { details: { yog_name: name(raw.yoga) } },
    karan: { details: { karan_name: name(raw.karana) } },
    sunrise: fmtTime(raw.sunrise) ?? raw.sunrise,
    sunset: fmtTime(raw.sunset) ?? raw.sunset,
    moonrise: fmtTime(raw.moonrise) ?? raw.moonrise,
    moonset: fmtTime(raw.moonset) ?? raw.moonset,
    rahukaal: findPeriod(periods, ["rahu_kaal", "rahu_kaalam", "rahukaal"], /rahu/i),
    gulika,
    yamghanta,
    abhijit_muhurta: findPeriod(periods, ["abhijit_muhurat", "abhijit_muhurta", "abhijeet_muhurat"], /abhijit|abhijeet/i),
  };
  panchangCache.set(cacheKey, { data: result, ts: Date.now() });
  return result;
}

async function handleAstroDetails(payload: Payload) {
  const datetime = toProkeralaDatetime({
    day: payload.day!, month: payload.month!, year: payload.year!,
    hour: payload.hour ?? 12, min: payload.min ?? 0, tzone: payload.tzone ?? 5.5,
  });
  const raw = (await prokeralaGet("/v2/astrology/kundli", {
    ayanamsa: "1",
    coordinates: coords(payload),
    datetime,
    la: "en",
  })) as Record<string, unknown>;

  // Normalize into the flat shape KundaliGenerator.tsx's pick() expects.
  const nak = raw.nakshatra_details as Record<string, unknown> | undefined;
  return {
    ascendant: name((raw as Record<string, unknown>).lagna) ?? name((nak as any)?.chandra_rasi),
    sign: name((nak as any)?.chandra_rasi) ?? name((raw as any).chandra_rasi),
    nakshatra: name((nak as any)?.nakshatra) ?? name((raw as any).nakshatra),
    nakshatra_lord: name(((nak as any)?.nakshatra as any)?.lord),
    sign_lord: name(((nak as any)?.chandra_rasi as any)?.lord),
    charan: (nak as any)?.nakshatra?.pada,
    tithi: undefined,
    yog: undefined,
    karan: undefined,
    _raw: raw,
  };
}

async function handleChart(div: "D1" | "D9", payload: Payload) {
  const datetime = toProkeralaDatetime({
    day: payload.day!, month: payload.month!, year: payload.year!,
    hour: payload.hour ?? 12, min: payload.min ?? 0, tzone: payload.tzone ?? 5.5,
  });
  const svg = await prokeralaChartSvg({
    ayanamsa: "1",
    coordinates: coords(payload),
    datetime,
    chart_type: div === "D1" ? "rasi" : "navamsa",
    chart_style: "north-indian",
  });
  // KundaliGenerator.tsx reads cjson?.data?.svg — feed it as a data: URI so <img src> works directly.
  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return { svg: dataUri };
}

/**
 * Body: { endpoint: string, payload: object }
 * Panchang + Kundli/chart endpoints -> Prokerala (one-time credits).
 * Everything else (Manglik, Kaal Sarp, Numerology, Daily Horoscope, etc.) -> astrologyapi.com, unchanged.
 */
export async function POST(req: Request) {
  let body: { endpoint?: string; payload?: Record<string, unknown> } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }

  const endpoint = String(body.endpoint || "").replace(/^\/+/, "");
  const payload = (body.payload || {}) as Payload;

  // ---- Prokerala path (Panchang + Kundli) ----
  if (PROKERALA_ENDPOINTS.has(endpoint)) {
    if (!process.env.PROKERALA_CLIENT_ID || !process.env.PROKERALA_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "not_configured", message: "Kundli/Panchang service is being set up. Please check back soon." },
        { status: 503 }
      );
    }
    try {
      let data: unknown;
      if (endpoint === "advanced_panchang") data = await handlePanchang(payload);
      else if (endpoint === "astro_details") data = await handleAstroDetails(payload);
      else data = await handleChart(endpoint.endsWith("D9") ? "D9" : "D1", payload);
      return NextResponse.json({ ok: true, data });
    } catch (e) {
      const err = e as Error & { data?: unknown };
      return NextResponse.json(
        { error: "api_error", message: err.message, data: err.data },
        { status: 502 }
      );
    }
  }

  // ---- astrologyapi.com path (all other calculators, unchanged) ----
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
        "Accept-Language": "en",
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
