/**
 * Catalog of free calculators backed by astrologyapi.com (https://www.astrologyapi.com).
 * The API base is https://json.astrologyapi.com/v1/<endpoint> with HTTP Basic auth
 * (userId : apiKey). Credentials live in env (ASTROLOGY_API_USER_ID / ASTROLOGY_API_KEY)
 * and are only used server-side via /api/astrology — never exposed to the browser.
 *
 * Plain TS (no "use client") so both the page/form and the API route can import it.
 */

export type CalcInput = "birth" | "sign" | "match" | "numero";

export interface CalcDef {
  id: string;
  endpoint: string; // astrologyapi.com endpoint (relative to /v1/)
  title: string;
  desc: string;
  icon: string; // emoji/glyph for the card
  input: CalcInput;
}

export const CALCULATORS: CalcDef[] = [
  { id: "kundli", endpoint: "birth_details", title: "Kundli / Birth Chart", desc: "Your core birth details, sign, nakshatra & more.", icon: "🪔", input: "birth" },
  { id: "planets", endpoint: "planets", title: "Planetary Positions", desc: "Where every planet sat at the moment you were born.", icon: "🪐", input: "birth" },
  { id: "ascendant", endpoint: "general_ascendant_report", title: "Ascendant (Lagna) Report", desc: "What your rising sign says about your nature.", icon: "⬆️", input: "birth" },
  { id: "matching", endpoint: "match_ashtakoot_points", title: "Kundli Matching", desc: "Ashtakoot Guna Milan compatibility for marriage.", icon: "💞", input: "match" },
  { id: "horoscope", endpoint: "sun_sign_prediction/daily", title: "Daily Horoscope", desc: "Today's prediction for your zodiac sign.", icon: "☀️", input: "sign" },
  { id: "numerology", endpoint: "numero_table", title: "Numerology", desc: "Your destiny & life-path numbers from name + birth date.", icon: "🔢", input: "numero" },
  { id: "manglik", endpoint: "manglik", title: "Manglik Dosha", desc: "Check whether Mangal Dosha is present in your chart.", icon: "🔴", input: "birth" },
  { id: "kalsarp", endpoint: "kalsarp_details", title: "Kaal Sarp Dosha", desc: "Find out if Kaal Sarp Dosha affects you.", icon: "🐍", input: "birth" },
  { id: "sadhesati", endpoint: "sadhesati_current_status", title: "Sade Sati Status", desc: "Is Shani's Sade Sati running for you right now?", icon: "🪐", input: "birth" },
  { id: "panchang", endpoint: "basic_panchang", title: "Panchang", desc: "Tithi, nakshatra, yoga & karan for a date/place.", icon: "📜", input: "birth" },
  { id: "gemstone", endpoint: "basic_gem_suggestion", title: "Gemstone Suggestion", desc: "The right gemstones to strengthen your chart.", icon: "💎", input: "birth" },
  { id: "rudraksha", endpoint: "rudraksha_suggestion", title: "Rudraksha Suggestion", desc: "Rudraksha recommended for your planetary balance.", icon: "📿", input: "birth" },
];

/** Endpoint prefixes the proxy is allowed to call (guards against abuse). */
export const ALLOWED_ENDPOINTS = CALCULATORS.map((c) => c.endpoint);

export const ZODIAC_SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
] as const;

/** A small set of cities so users don't need to know lat/lon/timezone (all IST 5.5). */
export const CITIES: { name: string; lat: number; lon: number; tzone: number }[] = [
  { name: "Delhi", lat: 28.6139, lon: 77.209, tzone: 5.5 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777, tzone: 5.5 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639, tzone: 5.5 },
  { name: "Chennai", lat: 13.0827, lon: 80.2707, tzone: 5.5 },
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946, tzone: 5.5 },
  { name: "Hyderabad", lat: 17.385, lon: 78.4867, tzone: 5.5 },
  { name: "Pune", lat: 18.5204, lon: 73.8567, tzone: 5.5 },
  { name: "Ahmedabad", lat: 23.0225, lon: 72.5714, tzone: 5.5 },
  { name: "Jaipur", lat: 26.9124, lon: 75.7873, tzone: 5.5 },
  { name: "Lucknow", lat: 26.8467, lon: 80.9462, tzone: 5.5 },
  { name: "Kanpur", lat: 26.4499, lon: 80.3319, tzone: 5.5 },
  { name: "Indore", lat: 22.7196, lon: 75.8577, tzone: 5.5 },
  { name: "Ujjain", lat: 23.1765, lon: 75.7885, tzone: 5.5 },
  { name: "Bhopal", lat: 23.2599, lon: 77.4126, tzone: 5.5 },
  { name: "Patna", lat: 25.5941, lon: 85.1376, tzone: 5.5 },
  { name: "Varanasi", lat: 25.3176, lon: 82.9739, tzone: 5.5 },
  { name: "Nagpur", lat: 21.1458, lon: 79.0882, tzone: 5.5 },
  { name: "Surat", lat: 21.1702, lon: 72.8311, tzone: 5.5 },
  { name: "Chandigarh", lat: 30.7333, lon: 76.7794, tzone: 5.5 },
  { name: "Amritsar", lat: 31.634, lon: 74.8723, tzone: 5.5 },
];
