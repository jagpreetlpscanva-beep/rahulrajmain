import { NextResponse } from "next/server";
import { ALLOWED_ENDPOINTS } from "@/lib/calculators";

export const dynamic = "force-dynamic";

const BASE = "https://json.astrologyapi.com/v1/";

/**
 * Proxy to astrologyapi.com. Keeps the API credentials server-side.
 * Body: { endpoint: string, payload: object }
 * The endpoint must match (or extend, for path params like the daily-horoscope
 * sign) one of the allow-listed calculator endpoints.
 */
export async function POST(req: Request) {
  const userId = process.env.ASTROLOGY_API_USER_ID;
  const apiKey = process.env.ASTROLOGY_API_KEY;

  if (!userId || !apiKey) {
    return NextResponse.json(
      { error: "not_configured", message: "Calculators are being set up. Please check back soon." },
      { status: 503 }
    );
  }

  let body: { endpoint?: string; payload?: Record<string, unknown> } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }

  const endpoint = String(body.endpoint || "").replace(/^\/+/, "");
  const ok = ALLOWED_ENDPOINTS.some((e) => endpoint === e || endpoint.startsWith(`${e}/`));
  if (!endpoint || !ok) {
    return NextResponse.json({ error: "invalid_endpoint" }, { status: 400 });
  }

  const auth = Buffer.from(`${userId}:${apiKey}`).toString("base64");

  try {
    const r = await fetch(BASE + endpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        "Accept-Language": "en",
      },
      body: JSON.stringify(body.payload || {}),
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
