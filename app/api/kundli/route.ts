import { NextResponse } from "next/server";
import { CITIES } from "@/lib/calculators";
import { computeKundli, chartSvgDataUri, RASHIS, PLANET_COLORS, isPlanetRetrograde } from "@/lib/vedic";
import * as A from "astronomy-engine";

export const dynamic = "force-dynamic";

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

function degStr(lon: number): string {
  const d = ((lon % 30) + 30) % 30;
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  return `${deg}°${String(min).padStart(2, "0")}'`;
}

const PLANET_BODY_MAP: Record<string, A.Body | null> = {
  "सूर्य": A.Body.Sun, "चंद्र": A.Body.Moon, "मंगल": A.Body.Mars,
  "बुध": A.Body.Mercury, "गुरु": A.Body.Jupiter, "शुक्र": A.Body.Venus,
  "शनि": A.Body.Saturn, "राहु": null, "केतु": null,
};

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

    // Gochar (current transit) — use true UTC→IST conversion so server TZ doesn't matter
    const ist = new Date(Date.now() + 5.5 * 3600 * 1000);
    const g = computeKundli({
      day: ist.getUTCDate(), month: ist.getUTCMonth() + 1, year: ist.getUTCFullYear(),
      hour: ist.getUTCHours(), min: ist.getUTCMinutes(), lat, lon, tzone: 5.5,
    });

    // Gochar chart framed on NATAL lagna (house-1 = birth ascendant)
    const gocharForChart = { ...g, asc_rashi: k.asc_rashi, ascendant_lon: k.ascendant_lon };

    // Build gochar planet table with correct transit positions
    const gocharPlanets = g.planets.map((p) => {
      const nakIdx = Math.floor(p.lon / (360 / 27)) % 27;
      // House relative to natal lagna
      const houseRelNatal = ((p.rashi - k.asc_rashi + 12) % 12) + 1;
      const isNode = p.name === "राहु" ? "rahu" : p.name === "केतु" ? "ketu" : null;
      const retro = isPlanetRetrograde(PLANET_BODY_MAP[p.name], isNode, ist);
      return {
        name: p.name,
        rashi: RASHIS[p.rashi],
        house: houseRelNatal,
        degree: degStr(p.lon),
        nakshatra: NAKSHATRAS[nakIdx],
        retrograde: retro,
        color: PLANET_COLORS[p.name] || "#2a1b0e",
      };
    });

    return NextResponse.json({
      ok: true,
      kundali: k,
      chart: chartSvgDataUri(k, "D1", "#a01414"),
      d9: chartSvgDataUri(k, "D9", "#a01414"),     // Navamsa — UI only
      gochar: chartSvgDataUri(gocharForChart, "D1", "#1a5276"),
      gocharPlanets,
    });
  } catch (e) {
    return NextResponse.json({ error: "calc_error", message: (e as Error).message }, { status: 500 });
  }
}
