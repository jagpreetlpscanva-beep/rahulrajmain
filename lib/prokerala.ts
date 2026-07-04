/**
 * Prokerala API client (server-only). Used for Panchang + Kundli chart generation.
 * OAuth2 client_credentials flow — token cached in-memory (~1hr validity).
 * Credentials: PROKERALA_CLIENT_ID / PROKERALA_CLIENT_SECRET (set in .env.local).
 */

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getProkeralaToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const clientId = process.env.PROKERALA_CLIENT_ID;
  const clientSecret = process.env.PROKERALA_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("not_configured");
  }

  const res = await fetch("https://api.prokerala.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`prokerala_token_failed_${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Call a Prokerala v2 astrology JSON endpoint. Returns parsed JSON `data` field.
 *  Retries on 429 (rate limit) / 503 with backoff — Prokerala's free tier limits
 *  concurrent requests, so a transient 429 shouldn't fail the whole panchang. */
export async function prokeralaGet(
  path: string,
  params: Record<string, string>,
  retries = 2
): Promise<unknown> {
  const token = await getProkeralaToken();
  const qs = new URLSearchParams(params).toString();
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://api.prokerala.com${path}?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if ((res.status === 429 || res.status === 503) && attempt < retries) {
      await sleep(700 * (attempt + 1));
      continue;
    }
    const text = await res.text();
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }
    if (!res.ok) {
      const err = new Error(`prokerala_api_error_${res.status}`) as Error & { data?: unknown };
      err.data = json;
      throw err;
    }
    return (json as { data?: unknown }).data ?? json;
  }
}

/** Call the Prokerala chart endpoint (returns raw SVG text, not JSON). */
export async function prokeralaChartSvg(params: Record<string, string>): Promise<string> {
  const token = await getProkeralaToken();
  const qs = new URLSearchParams({ ...params, format: "svg" }).toString();
  const res = await fetch(`https://api.prokerala.com/v2/astrology/chart?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`prokerala_chart_error_${res.status}: ${text}`);
  }
  return res.text();
}

/** Build Prokerala `coordinates` + ISO `datetime` params from day/month/year/hour/min/lat/lon/tzone. */
export function toProkeralaDatetime(p: {
  day: number; month: number; year: number; hour: number; min: number; tzone: number;
}): string {
  const tzSign = p.tzone >= 0 ? "+" : "-";
  const tzAbs = Math.abs(p.tzone);
  const tzH = String(Math.floor(tzAbs)).padStart(2, "0");
  const tzM = String(Math.round((tzAbs % 1) * 60)).padStart(2, "0");
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}T${String(
    p.hour
  ).padStart(2, "0")}:${String(p.min).padStart(2, "0")}:00${tzSign}${tzH}:${tzM}`;
}
