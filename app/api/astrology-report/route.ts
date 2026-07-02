import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE = "https://json.astrologyapi.com/v1/";

/**
 * Generate a personalised Vedic report from astrologyapi.com. Assembles a few
 * report endpoints into one document, in the requested language (Hindi by
 * default). Credentials stay server-side.
 */
export async function POST(req: Request) {
  const userId = process.env.ASTROLOGY_API_USER_ID;
  const apiKey = process.env.ASTROLOGY_API_KEY;
  if (!userId || !apiKey) {
    return NextResponse.json({ error: "not_configured", message: "Report service is being set up." }, { status: 503 });
  }

  let body: Record<string, number | string> = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  const lang = String(body.lang || "hi");
  const payload = {
    day: Number(body.day), month: Number(body.month), year: Number(body.year),
    hour: Number(body.hour) || 0, min: Number(body.min) || 0,
    lat: Number(body.lat), lon: Number(body.lon), tzone: Number(body.tzone) || 5.5,
  };

  const auth = Buffer.from(`${userId}:${apiKey}`).toString("base64");
  const call = async (endpoint: string) => {
    try {
      const r = await fetch(BASE + endpoint, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json", "Accept-Language": lang },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      if (!r.ok) return null;
      return await r.json();
    } catch {
      return null;
    }
  };

  const [astro, ascendant, characteristics] = await Promise.all([
    call("astro_details"),
    call("general_ascendant_report"),
    call("personal_characteristics"),
  ]);

  if (!astro && !ascendant && !characteristics) {
    return NextResponse.json({ error: "generation_failed", message: "Could not generate the report. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, lang, data: { astro, ascendant, characteristics } });
}
