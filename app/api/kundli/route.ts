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
    return NextResponse.json({
      ok: true,
      kundali: k,
      chart: chartSvgDataUri(k, "D1", "#a01414"),
    });
  } catch (e) {
    return NextResponse.json({ error: "calc_error", message: (e as Error).message }, { status: 500 });
  }
}
