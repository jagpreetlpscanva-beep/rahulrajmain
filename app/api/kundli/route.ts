import { NextResponse } from "next/server";
import { CITIES } from "@/lib/calculators";
import { computeKundli, chartSvgDataUri } from "@/lib/vedic";

export const dynamic = "force-dynamic";

/**
 * Generate an accurate Lagna Kundali for the prescription pad.
 * Body: { dob: "YYYY-MM-DD", tob: "HH:MM", place: string, lat?, lon?, tzone? }
 * Returns the full kundali JSON (lagna + every planet's house) and a red
 * North-Indian chart (data URI) to drop straight into the pad.
 */
export async function POST(req: Request) {
  let b: Record<string, string | number> = {};
  try {
    b = await req.json();
  } catch {
    /* ignore */
  }

  const dob = String(b.dob || "");
  const tob = String(b.tob || "12:00");
  const [y, m, d] = dob.split("-").map(Number);
  const [hh, mm] = tob.split(":").map(Number);
  if (!y || !m || !d) {
    return NextResponse.json({ error: "invalid_birth", message: "Valid date of birth required." }, { status: 400 });
  }

  // Coordinates: explicit lat/lon win, else look up the named place, else Lucknow.
  let lat = Number(b.lat);
  let lon = Number(b.lon);
  let tzone = Number(b.tzone) || 5.5;
  if (!lat || !lon) {
    const city = CITIES.find((c) => c.name.toLowerCase() === String(b.place || "").toLowerCase()) ?? CITIES.find((c) => c.name === "Lucknow") ?? CITIES[0];
    lat = city.lat;
    lon = city.lon;
    tzone = city.tzone;
  }

  try {
    const k = computeKundli({ day: d, month: m, year: y, hour: hh || 0, min: mm || 0, lat, lon, tzone });
    // Gochar (current transit) at the same place — astrologer reference only.
    // IMPORTANT: build the "now" wall-clock in IST from the true UTC instant so it
    // is correct no matter what timezone the server runs in (Vercel = UTC). Reading
    // new Date().getHours() on a UTC server gave a gochar 5.5h in the past (wrong).
    const ist = new Date(Date.now() + 5.5 * 3600 * 1000);
    const g = computeKundli({
      day: ist.getUTCDate(), month: ist.getUTCMonth() + 1, year: ist.getUTCFullYear(),
      hour: ist.getUTCHours(), min: ist.getUTCMinutes(), lat, lon, tzone: 5.5,
    });
    // Gochar chart must be framed on the NATAL lagna (house-1 = birth ascendant),
    // with today's planets dropped into their houses relative to it — NOT on the
    // current time-of-day ascendant (which changes every ~2 hrs and is meaningless).
    const gocharChart = { ...g, asc_rashi: k.asc_rashi, ascendant_lon: k.ascendant_lon };
    return NextResponse.json({
      ok: true,
      kundali: k,
      chart: chartSvgDataUri(k, "D1", "#a01414"),
      d9: chartSvgDataUri(k, "D9", "#a01414"),     // Navamsa — UI only
      gochar: chartSvgDataUri(gocharChart, "D1", "#1a5276"), // Gochar over natal lagna
    });
  } catch (e) {
    return NextResponse.json({ error: "calc_error", message: (e as Error).message }, { status: 500 });
  }
}
