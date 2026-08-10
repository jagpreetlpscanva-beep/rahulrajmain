import { NextResponse } from "next/server";
import { CITIES } from "@/lib/calculators";
import { computeKundli, computePanchang, chartSvgDataUri, RASHIS } from "@/lib/vedic";

export const dynamic = "force-dynamic";

const VAAR = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
const LORD_HI: Record<string, string> = {
  Ketu: "केतु", Shukra: "शुक्र", Surya: "सूर्य", Chandra: "चंद्र", Mangal: "मंगल",
  Rahu: "राहु", Guru: "गुरु", Shani: "शनि", Budh: "बुध",
};
const NAK_SPAN = 360 / 27;
const pada = (lon: number) => Math.floor((lon % NAK_SPAN) / (NAK_SPAN / 4)) + 1;
const deg = (lon: number) => { const d = ((lon % 30) + 30) % 30; const dd = Math.floor(d); const mm = Math.floor((d - dd) * 60); return `${dd}°${String(mm).padStart(2, "0")}'`; };

/** POST { dob, tob, place, lat?, lon?, tzone? } → complete Vedic birth horoscope. */
export async function POST(req: Request) {
  let b: Record<string, string | number> = {};
  try { b = await req.json(); } catch { /* ignore */ }

  const dob = String(b.dob || "");
  const tob = String(b.tob || "12:00");
  const [y, m, d] = dob.split("-").map(Number);
  const [hh, mm] = tob.split(":").map(Number);
  if (!y || !m || !d) return NextResponse.json({ error: "invalid_birth", message: "सही जन्म तिथि व समय भरें।" }, { status: 400 });

  let lat = Number(b.lat), lon = Number(b.lon), tzone = Number(b.tzone) || 5.5;
  if (!lat || !lon) {
    const city = CITIES.find((c) => c.name.toLowerCase() === String(b.place || "").toLowerCase())
      ?? CITIES.find((c) => c.name === "Lucknow") ?? CITIES[0];
    lat = city.lat; lon = city.lon; tzone = city.tzone;
  }

  try {
    const k = computeKundli({ day: d, month: m, year: y, hour: hh || 0, min: mm || 0, lat, lon, tzone });
    const pan = computePanchang({ day: d, month: m, year: y, lat, lon, tzone });

    const moon = k.planets.find((p) => p.name === "चंद्र");
    const sun = k.planets.find((p) => p.name === "सूर्य");
    const tithiName: string = pan.tithi.details.tithi_name;
    const paksha = tithiName.startsWith("Krishna") || tithiName.includes("कृष्ण") ? "कृष्ण पक्ष" : "शुक्ल पक्ष";

    const planets = k.planets.map((p) => ({
      name: p.name,
      rashi: p.sign,
      house: p.house,
      degree: deg(p.lon),
      nakshatra: p.nakshatra,
      pada: pada(p.lon),
    }));

    const houses = Array.from({ length: 12 }, (_, i) => ({
      house: i + 1,
      rashi: RASHIS[(k.asc_rashi + i) % 12],
    }));

    return NextResponse.json({
      ok: true,
      meta: {
        dob, tob, place: String(b.place || ""),
        lat: Number(lat.toFixed(4)), lon: Number(lon.toFixed(4)), tzone, ayanamsa: "लाहिरी (Lahiri)",
      },
      panchang: {
        tithi: tithiName.replace("Shukla", "शुक्ल").replace("Krishna", "कृष्ण"),
        vaar: VAAR[new Date(y, m - 1, d).getDay()],
        paksha,
        nakshatra: k.nakshatra,
        pada: k.charan,
        nakshatra_lord: LORD_HI[k.nakshatra_lord] || k.nakshatra_lord,
        yoga: pan.yog.details.yog_name,
        karana: pan.karan.details.karan_name,
        sunrise: pan.sunrise, sunset: pan.sunset,
      },
      moon: { rashi: moon?.sign ?? "", degree: deg(moon?.lon ?? 0), nakshatra: k.nakshatra, pada: k.charan },
      sun: { rashi: sun?.sign ?? "", degree: deg(sun?.lon ?? 0) },
      lagna: { rashi: k.ascendant, degree: deg(k.ascendant_lon) },
      planets,
      houses,
      dasha: k.dasha,
      dosha: k.doshaStr,
      yog: k.yogStr,
      chart: chartSvgDataUri(k, "D1", "#a01414"),
      navamsa: chartSvgDataUri(k, "D9", "#1f4e79"),
    });
  } catch (e) {
    return NextResponse.json({ error: "calc_error", message: (e as Error).message }, { status: 500 });
  }
}
