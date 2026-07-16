/**
 * Local Vedic astrology engine — no external API, free forever.
 *
 * Uses `astronomy-engine` (MIT, pure JS) for accurate Sun/Moon/planet ecliptic
 * longitudes and rise/set times, then derives Panchang + Kundli using the
 * standard Lahiri ayanamsa (same sidereal system Prokerala / most Indian sites
 * use, ayanamsa #1). Runs entirely on the server — no credits, no rate limits.
 */
import * as A from "astronomy-engine";

const DEG = Math.PI / 180;
const norm360 = (x: number) => ((x % 360) + 360) % 360;

/* ---------------- reference tables ---------------- */

export const RASHIS = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
  "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena",
];
const RASHI_LORD = [
  "Mangal", "Shukra", "Budh", "Chandra", "Surya", "Budh",
  "Shukra", "Mangal", "Guru", "Shani", "Shani", "Guru",
];
const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];
// Nakshatra lords repeat in the Vimshottari order (9), starting Ketu.
const NAK_LORD_CYCLE = ["Ketu", "Shukra", "Surya", "Chandra", "Mangal", "Rahu", "Guru", "Shani", "Budh"];
const TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
  "Trayodashi", "Chaturdashi", "Purnima",
];
const YOGAS = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
  "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
  "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana",
  "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
  "Brahma", "Indra", "Vaidhriti",
];
const KARANA_MOVABLE = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"];
const KARANA_FIXED = ["Shakuni", "Chatushpada", "Naga", "Kimstughna"];

/* weekday-indexed (0=Sun..6=Sat) part number (1..8) of the day for each kaal */
const RAHU_PART = [8, 2, 7, 5, 6, 4, 3];
const GULIKA_PART = [7, 6, 5, 4, 3, 2, 1];
const YAMA_PART = [5, 4, 3, 2, 1, 7, 6];

/* ---------------- astronomy helpers ---------------- */

function julianCenturies(date: Date): number {
  return A.MakeTime(date).tt / 36525;
}

/** Lahiri ayanamsa (deg): 23.8531° at J2000 + 50.2388"/yr. */
function ayanamsa(date: Date): number {
  const years = A.MakeTime(date).tt / 365.25;
  return 23.8531 + years * (50.2388 / 3600);
}

/** mean obliquity of the ecliptic (deg) */
function obliquity(date: Date): number {
  const T = julianCenturies(date);
  return 23.439291 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;
}

/** tropical geocentric ecliptic longitude (deg) of a body at `date` */
function tropLon(body: A.Body, date: Date): number {
  if (body === A.Body.Sun) return norm360(A.SunPosition(date).elon);
  if (body === A.Body.Moon) return norm360(A.EclipticGeoMoon(date).lon);
  const v = A.GeoVector(body, date, true);
  return norm360(A.Ecliptic(v).elon);
}

/** mean lunar ascending node (Rahu), tropical longitude (deg) */
function rahuTropLon(date: Date): number {
  const T = julianCenturies(date);
  return norm360(125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000);
}

const sidereal = (tropical: number, date: Date) => norm360(tropical - ayanamsa(date));

/* ---------------- time formatting ---------------- */

function localHM(date: Date, tz: number): { h: number; m: number } {
  const d = new Date(date.getTime() + tz * 3600 * 1000);
  return { h: d.getUTCHours(), m: d.getUTCMinutes() };
}
function fmtTime(date: Date | null, tz: number): string {
  if (!date) return "—";
  const { h, m } = localHM(date, tz);
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")} ${ap}`;
}
const fmtRange = (a: Date, b: Date, tz: number) => `${fmtTime(a, tz)} - ${fmtTime(b, tz)}`;

/* ---------------- Panchang ---------------- */

export interface PanchangInput {
  day: number; month: number; year: number; hour?: number; min?: number;
  lat: number; lon: number; tzone?: number;
}

/** Returns the shape Panchang.tsx's parsePanchang() already understands. */
export function computePanchang(p: PanchangInput) {
  const tz = p.tzone ?? 5.5;
  const obs = new A.Observer(p.lat, p.lon, 60);
  // Instant of local midnight, as UTC, to anchor the day's rise/set search.
  const startUTC = new Date(Date.UTC(p.year, p.month - 1, p.day, 0, 0, 0) - tz * 3600 * 1000);

  const sr = A.SearchRiseSet(A.Body.Sun, obs, +1, startUTC, 1.2);
  const sunriseDate = sr ? sr.date : new Date(startUTC.getTime() + 6 * 3600 * 1000);
  const ss = A.SearchRiseSet(A.Body.Sun, obs, -1, sunriseDate, 1.2);
  const sunsetDate = ss ? ss.date : new Date(sunriseDate.getTime() + 12 * 3600 * 1000);
  const mr = A.SearchRiseSet(A.Body.Moon, obs, +1, startUTC, 1.2);
  const ms = A.SearchRiseSet(A.Body.Moon, obs, -1, startUTC, 1.2);

  // Panchang elements at sunrise (standard).
  const at = sunriseDate;
  const sunT = tropLon(A.Body.Sun, at);
  const moonT = tropLon(A.Body.Moon, at);
  const sunS = sidereal(sunT, at);
  const moonS = sidereal(moonT, at);

  const tithiIdx = Math.floor(norm360(moonT - sunT) / 12); // 0..29
  const paksha = tithiIdx < 15 ? "Shukla" : "Krishna";
  const tithiName = tithiIdx === 29 ? "Amavasya" : `${paksha} ${TITHIS[tithiIdx % 15]}`;

  const nakIdx = Math.floor(moonS / (360 / 27)) % 27;
  const yogaIdx = Math.floor(norm360(sunS + moonS) / (360 / 27)) % 27;

  // Karana: 60 half-tithis across the lunar month.
  const half = Math.floor(norm360(moonT - sunT) / 6); // 0..59
  let karanaName: string;
  if (half === 0) karanaName = "Kimstughna";
  else if (half >= 57) karanaName = KARANA_FIXED[half - 57]; // 57,58,59 -> Shakuni,Chatushpada,Naga
  else karanaName = KARANA_MOVABLE[(half - 1) % 7];

  // Rahu / Gulika / Yamaganda / Abhijit from the daytime span.
  const wd = new Date(sunriseDate.getTime() + tz * 3600 * 1000).getUTCDay();
  const dayLen = sunsetDate.getTime() - sunriseDate.getTime();
  const part = dayLen / 8;
  const seg = (n1: number) => {
    const s = new Date(sunriseDate.getTime() + (n1 - 1) * part);
    return fmtRange(s, new Date(s.getTime() + part), tz);
  };
  const mu = dayLen / 15;
  const abhStart = new Date(sunriseDate.getTime() + 7 * mu);
  const abhijit = fmtRange(abhStart, new Date(abhStart.getTime() + mu), tz);

  return {
    tithi: { details: { tithi_name: tithiName } },
    nakshatra: { details: { nak_name: NAKSHATRAS[nakIdx] } },
    yog: { details: { yog_name: YOGAS[yogaIdx] } },
    karan: { details: { karan_name: karanaName } },
    sunrise: fmtTime(sunriseDate, tz),
    sunset: fmtTime(sunsetDate, tz),
    moonrise: fmtTime(mr ? mr.date : null, tz),
    moonset: fmtTime(ms ? ms.date : null, tz),
    rahukaal: seg(RAHU_PART[wd]),
    gulika: seg(GULIKA_PART[wd]),
    yamghanta: seg(YAMA_PART[wd]),
    abhijit_muhurta: abhijit,
  };
}

/* ---------------- Kundli ---------------- */

export interface KundliInput {
  day: number; month: number; year: number; hour?: number; min?: number;
  lat: number; lon: number; tzone?: number;
}

/** UTC instant of the given local birth date-time. */
function birthInstant(p: KundliInput): Date {
  const tz = p.tzone ?? 5.5;
  return new Date(Date.UTC(p.year, p.month - 1, p.day, p.hour ?? 12, p.min ?? 0, 0) - tz * 3600 * 1000);
}

/** sidereal ascendant longitude (deg) */
function ascendant(date: Date, lat: number, lon: number): number {
  const gstHours = A.SiderealTime(date); // Greenwich apparent sidereal time (hours)
  const ramc = norm360((gstHours + lon / 15) * 15); // local sidereal time in degrees
  const eps = obliquity(date) * DEG;
  const phi = lat * DEG;
  const t = ramc * DEG;
  let lambda = Math.atan2(Math.cos(t), -(Math.sin(t) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))) / DEG;
  lambda = norm360(lambda);
  return sidereal(lambda, date);
}

const PLANETS: { key: string; abbr: string; body?: A.Body; node?: "rahu" | "ketu" }[] = [
  { key: "Sun", abbr: "Su", body: A.Body.Sun },
  { key: "Moon", abbr: "Mo", body: A.Body.Moon },
  { key: "Mars", abbr: "Ma", body: A.Body.Mars },
  { key: "Mercury", abbr: "Me", body: A.Body.Mercury },
  { key: "Jupiter", abbr: "Ju", body: A.Body.Jupiter },
  { key: "Venus", abbr: "Ve", body: A.Body.Venus },
  { key: "Saturn", abbr: "Sa", body: A.Body.Saturn },
  { key: "Rahu", abbr: "Ra", node: "rahu" },
  { key: "Ketu", abbr: "Ke", node: "ketu" },
];

function planetSiderealLon(p: { body?: A.Body; node?: "rahu" | "ketu" }, date: Date): number {
  if (p.node === "rahu") return sidereal(rahuTropLon(date), date);
  if (p.node === "ketu") return sidereal(norm360(rahuTropLon(date) + 180), date);
  return sidereal(tropLon(p.body!, date), date);
}

const nakLord = (nakIdx: number) => NAK_LORD_CYCLE[nakIdx % 9];

/** Core kundli details (matches KundaliGenerator.tsx pick() keys) + planet list. */
export function computeKundli(p: KundliInput) {
  const at = birthInstant(p);
  const ascLon = ascendant(at, p.lat, p.lon);
  const ascRashi = Math.floor(ascLon / 30) % 12;

  const moonS = planetSiderealLon({ body: A.Body.Moon }, at);
  const moonRashi = Math.floor(moonS / 30) % 12;
  const moonNak = Math.floor(moonS / (360 / 27)) % 27;
  const moonPada = Math.floor((moonS % (360 / 27)) / (360 / 108)) + 1;

  const planets = PLANETS.map((pl) => {
    const lon = planetSiderealLon(pl, at);
    const rashi = Math.floor(lon / 30) % 12;
    const nak = Math.floor(lon / (360 / 27)) % 27;
    return {
      name: pl.key, abbr: pl.abbr, lon, rashi,
      house: ((rashi - ascRashi + 12) % 12) + 1,
      sign: RASHIS[rashi], nakshatra: NAKSHATRAS[nak], nakshatra_lord: nakLord(nak),
    };
  });

  return {
    ascendant: RASHIS[ascRashi],
    ascendant_lon: ascLon,
    asc_rashi: ascRashi,
    sign: RASHIS[moonRashi],
    nakshatra: NAKSHATRAS[moonNak],
    nakshatra_lord: nakLord(moonNak),
    sign_lord: RASHI_LORD[moonRashi],
    charan: moonPada,
    planets,
  };
}

/* ---------------- North-Indian chart SVG ---------------- */

/** navamsa (D9) sign index for a sidereal longitude */
function navamsaSign(lon: number): number {
  const sign = Math.floor(lon / 30) % 12;
  const nav = Math.floor((lon % 30) / (10 / 3)); // 0..8 (3°20' each)
  const mod = sign % 3;
  const start = mod === 0 ? sign : mod === 1 ? (sign + 8) % 12 : (sign + 4) % 12;
  return (start + nav) % 12;
}

/**
 * North-Indian (diamond) chart as an SVG data URI. `division` D1 uses each
 * planet's rashi; D9 uses its navamsa sign. House 1 (top diamond) = ascendant.
 */
export function chartSvgDataUri(k: ReturnType<typeof computeKundli>, division: "D1" | "D9", color = "#c8902c"): string {
  const ascSign = division === "D1" ? k.asc_rashi : navamsaSign(k.ascendant_lon);
  // sign occupying each of the 12 houses (house1 = ascSign, going forward)
  const signInHouse = (h: number) => ((ascSign + h - 1) % 12);
  // planets grouped by house
  const byHouse: Record<number, string[]> = {};
  for (const pl of k.planets) {
    const sign = division === "D1" ? pl.rashi : navamsaSign(pl.lon);
    const house = ((sign - ascSign + 12) % 12) + 1;
    (byHouse[house] ||= []).push(pl.abbr);
  }

  const S = 400;
  // centres for the 12 houses of a North-Indian chart (house1 top-centre, anticlockwise)
  const c: Record<number, [number, number]> = {
    1: [200, 90], 2: [100, 40], 3: [40, 100], 4: [100, 200], 5: [40, 300],
    6: [100, 360], 7: [200, 310], 8: [300, 360], 9: [360, 300], 10: [300, 200],
    11: [360, 100], 12: [300, 40],
  };
  const lines = [
    `M0 0 H${S} V${S} H0 Z`,
    `M0 0 L${S / 2} ${S / 2} L0 ${S} M${S} 0 L${S / 2} ${S / 2} L${S} ${S}`,
    `M${S / 2} 0 L0 ${S / 2} L${S / 2} ${S} L${S} ${S / 2} Z`,
  ];
  let inner = "";
  for (let h = 1; h <= 12; h++) {
    const [x, y] = c[h];
    inner += `<text x="${x}" y="${y - 8}" font-size="11" fill="${color}" opacity="0.75" text-anchor="middle">${signInHouse(h) + 1}</text>`;
    const ps = byHouse[h] || [];
    inner += `<text x="${x}" y="${y + 12}" font-size="15" font-weight="bold" fill="#3d2817" text-anchor="middle">${ps.join(" ")}</text>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
    <rect width="${S}" height="${S}" fill="none"/>
    <g fill="none" stroke="${color}" stroke-width="1.5">${lines.map((d) => `<path d="${d}"/>`).join("")}</g>
    ${inner}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
