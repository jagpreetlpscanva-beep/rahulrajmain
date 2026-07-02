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

/** Extra astrologyapi endpoints used by on-page tools (not shown as cards). */
export const EXTRA_ENDPOINTS = ["astro_details", "geo_details"];

/** Endpoint prefixes the proxy is allowed to call (guards against abuse). */
export const ALLOWED_ENDPOINTS = [...CALCULATORS.map((c) => c.endpoint), ...EXTRA_ENDPOINTS];

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
  { name: "Ludhiana", lat: 30.901, lon: 75.8573, tzone: 5.5 },
  { name: "Agra", lat: 27.1767, lon: 78.0081, tzone: 5.5 },
  { name: "Meerut", lat: 28.9845, lon: 77.7064, tzone: 5.5 },
  { name: "Ghaziabad", lat: 28.6692, lon: 77.4538, tzone: 5.5 },
  { name: "Noida", lat: 28.5355, lon: 77.391, tzone: 5.5 },
  { name: "Gurugram", lat: 28.4595, lon: 77.0266, tzone: 5.5 },
  { name: "Faridabad", lat: 28.4089, lon: 77.3178, tzone: 5.5 },
  { name: "Prayagraj (Allahabad)", lat: 25.4358, lon: 81.8463, tzone: 5.5 },
  { name: "Gorakhpur", lat: 26.7606, lon: 83.3732, tzone: 5.5 },
  { name: "Bareilly", lat: 28.367, lon: 79.4304, tzone: 5.5 },
  { name: "Aligarh", lat: 27.8974, lon: 78.088, tzone: 5.5 },
  { name: "Moradabad", lat: 28.8386, lon: 78.7733, tzone: 5.5 },
  { name: "Jodhpur", lat: 26.2389, lon: 73.0243, tzone: 5.5 },
  { name: "Udaipur", lat: 24.5854, lon: 73.7125, tzone: 5.5 },
  { name: "Kota", lat: 25.2138, lon: 75.8648, tzone: 5.5 },
  { name: "Gwalior", lat: 26.2183, lon: 78.1828, tzone: 5.5 },
  { name: "Jabalpur", lat: 23.1815, lon: 79.9864, tzone: 5.5 },
  { name: "Raipur", lat: 21.2514, lon: 81.6296, tzone: 5.5 },
  { name: "Ranchi", lat: 23.3441, lon: 85.3096, tzone: 5.5 },
  { name: "Jamshedpur", lat: 22.8046, lon: 86.2029, tzone: 5.5 },
  { name: "Dhanbad", lat: 23.7957, lon: 86.4304, tzone: 5.5 },
  { name: "Guwahati", lat: 26.1445, lon: 91.7362, tzone: 5.5 },
  { name: "Bhubaneswar", lat: 20.2961, lon: 85.8245, tzone: 5.5 },
  { name: "Cuttack", lat: 20.4625, lon: 85.8828, tzone: 5.5 },
  { name: "Visakhapatnam", lat: 17.6868, lon: 83.2185, tzone: 5.5 },
  { name: "Vijayawada", lat: 16.5062, lon: 80.648, tzone: 5.5 },
  { name: "Coimbatore", lat: 11.0168, lon: 76.9558, tzone: 5.5 },
  { name: "Madurai", lat: 9.9252, lon: 78.1198, tzone: 5.5 },
  { name: "Tiruchirappalli", lat: 10.7905, lon: 78.7047, tzone: 5.5 },
  { name: "Kochi", lat: 9.9312, lon: 76.2673, tzone: 5.5 },
  { name: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366, tzone: 5.5 },
  { name: "Kozhikode", lat: 11.2588, lon: 75.7804, tzone: 5.5 },
  { name: "Mysuru", lat: 12.2958, lon: 76.6394, tzone: 5.5 },
  { name: "Mangaluru", lat: 12.9141, lon: 74.856, tzone: 5.5 },
  { name: "Hubli", lat: 15.3647, lon: 75.124, tzone: 5.5 },
  { name: "Nashik", lat: 19.9975, lon: 73.7898, tzone: 5.5 },
  { name: "Aurangabad", lat: 19.8762, lon: 75.3433, tzone: 5.5 },
  { name: "Nagercoil", lat: 8.1833, lon: 77.4119, tzone: 5.5 },
  { name: "Vadodara", lat: 22.3072, lon: 73.1812, tzone: 5.5 },
  { name: "Rajkot", lat: 22.3039, lon: 70.8022, tzone: 5.5 },
  { name: "Dehradun", lat: 30.3165, lon: 78.0322, tzone: 5.5 },
  { name: "Haridwar", lat: 29.9457, lon: 78.1642, tzone: 5.5 },
  { name: "Shimla", lat: 31.1048, lon: 77.1734, tzone: 5.5 },
  { name: "Srinagar", lat: 34.0837, lon: 74.7973, tzone: 5.5 },
  { name: "Jammu", lat: 32.7266, lon: 74.857, tzone: 5.5 },
  { name: "Siliguri", lat: 26.7271, lon: 88.3953, tzone: 5.5 },
  { name: "Durgapur", lat: 23.5204, lon: 87.3119, tzone: 5.5 },
  { name: "Ajmer", lat: 26.4499, lon: 74.6399, tzone: 5.5 },
  { name: "Bikaner", lat: 28.0229, lon: 73.3119, tzone: 5.5 },
  { name: "Jhansi", lat: 25.4484, lon: 78.5685, tzone: 5.5 },
];
