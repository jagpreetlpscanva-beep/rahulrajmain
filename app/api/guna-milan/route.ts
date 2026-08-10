import { NextResponse } from "next/server";
import { CITIES } from "@/lib/calculators";
import { computeKundli, chartSvgDataUri } from "@/lib/vedic";
import { computeGunaMilan, type MoonPos } from "@/lib/gunaMilan";

export const dynamic = "force-dynamic";

type Person = { dob?: string; tob?: string; place?: string; lat?: number; lon?: number; tzone?: number };

/** Compute one kundli + chart + the Moon's rashi/nakshatra index (for Guna Milan). */
function chartFor(p: Person, color: string) {
  const dob = String(p.dob || "");
  const [y, m, d] = dob.split("-").map(Number);
  const [hh, mm] = String(p.tob || "12:00").split(":").map(Number);
  if (!y || !m || !d) throw new Error("invalid_birth");

  let lat = Number(p.lat), lon = Number(p.lon), tzone = Number(p.tzone) || 5.5;
  if (!lat || !lon) {
    const city = CITIES.find((c) => c.name.toLowerCase() === String(p.place || "").toLowerCase())
      ?? CITIES.find((c) => c.name === "Lucknow") ?? CITIES[0];
    lat = city.lat; lon = city.lon; tzone = city.tzone;
  }

  const k = computeKundli({ day: d, month: m, year: y, hour: hh || 0, min: mm || 0, lat, lon, tzone });
  const moon = k.planets.find((pl) => pl.name === "चंद्र");
  const moonLon = moon?.lon ?? 0;
  const moonPos: MoonPos = {
    moonRashi: Math.floor(moonLon / 30) % 12,
    moonNak: Math.floor(moonLon / (360 / 27)) % 27,
  };
  return { kundali: k, chart: chartSvgDataUri(k, "D1", color), moonPos };
}

/** POST { boy: Person, girl: Person } → both charts + Ashtakoot Guna Milan (out of 36). */
export async function POST(req: Request) {
  let b: { boy?: Person; girl?: Person } = {};
  try { b = await req.json(); } catch { /* ignore */ }

  try {
    const boy = chartFor(b.boy || {}, "#1f4e79");   // blue for boy
    const girl = chartFor(b.girl || {}, "#a01414");  // red for girl
    const milan = computeGunaMilan(boy.moonPos, girl.moonPos);
    return NextResponse.json({
      ok: true,
      boy: { chart: boy.chart, kundali: boy.kundali, moon: boy.moonPos },
      girl: { chart: girl.chart, kundali: girl.kundali, moon: girl.moonPos },
      milan,
    });
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg === "invalid_birth" ? 400 : 500;
    return NextResponse.json({ error: msg, message: "लड़के और लड़की दोनों की सही जन्म तिथि/समय/स्थान भरें।" }, { status });
  }
}
