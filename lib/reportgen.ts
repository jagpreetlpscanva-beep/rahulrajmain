/**
 * Server-side report generation from astrologyapi.com. Each paid report maps to
 * the planets/houses that matter for that topic (e.g. Career = Sun/Saturn/
 * Mercury), so a "Career Report" pulls genuinely career-relevant analysis.
 * We build our OWN branded Hindi document from the JSON (keeps our branding).
 */

const BASE = "https://json.astrologyapi.com/v1/";

export interface BirthInput {
  day: number; month: number; year: number;
  hour: number; min: number; lat: number; lon: number; tzone: number;
}

export interface GeneratedReport {
  title: string;
  astro: Record<string, unknown> | null;
  sections: { heading: string; items: string[] }[];
  generatedAt: string;
}

const PLANET_HI: Record<string, string> = {
  sun: "सूर्य", moon: "चंद्र", mars: "मंगल", mercury: "बुध",
  jupiter: "गुरु (बृहस्पति)", venus: "शुक्र", saturn: "शनि", rahu: "राहु", ketu: "केतु",
};

/** report id -> { title, planets relevant to that topic } */
const REPORT_MAP: Record<string, { title: string; planets: string[] }> = {
  "report-1": { title: "Career & Business Report", planets: ["sun", "saturn", "mercury"] },
  "report-2": { title: "Marriage & Love Report", planets: ["venus", "jupiter", "mars"] },
  "report-3": { title: "Health & Wellness Report", planets: ["sun", "moon", "mars"] },
  "report-4": { title: "Wealth & Finance Report", planets: ["jupiter", "venus", "mercury"] },
  "report-5": { title: "Personalized Fortune Report", planets: ["moon", "jupiter", "sun"] },
  "report-6": { title: "Education & Child Report", planets: ["mercury", "jupiter", "moon"] },
};

function toStrings(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string" && x.trim());
  if (typeof v === "string" && v.trim()) return [v];
  return [];
}

export async function generateReport(reportId: string, title: string, birth: BirthInput): Promise<GeneratedReport | null> {
  const userId = process.env.ASTROLOGY_API_USER_ID;
  const apiKey = process.env.ASTROLOGY_API_KEY;
  if (!userId || !apiKey) return null;

  const cfg = REPORT_MAP[reportId] ?? { title, planets: ["sun", "moon", "jupiter"] };
  const auth = Buffer.from(`${userId}:${apiKey}`).toString("base64");
  const call = async (endpoint: string) => {
    try {
      const r = await fetch(BASE + endpoint, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json", "Accept-Language": "hi" },
        body: JSON.stringify(birth),
        cache: "no-store",
      });
      if (!r.ok) return null;
      return await r.json();
    } catch {
      return null;
    }
  };

  const [astro, ascendant, ...houseReports] = await Promise.all([
    call("astro_details"),
    call("general_ascendant_report"),
    ...cfg.planets.map((p) => call(`general_house_report/planet/${p}`)),
  ]);

  const sections: { heading: string; items: string[] }[] = [];

  const ascItems = toStrings(ascendant?.report);
  if (ascItems.length) sections.push({ heading: "लग्न व स्वभाव", items: ascItems });

  cfg.planets.forEach((p, i) => {
    const rep = houseReports[i];
    const items = toStrings(rep?.house_report ?? rep?.report);
    if (items.length) sections.push({ heading: `${PLANET_HI[p] ?? p} का प्रभाव`, items });
  });

  if (!astro && sections.length === 0) return null;

  return {
    title: cfg.title || title,
    astro: (astro as Record<string, unknown>) ?? null,
    sections,
    generatedAt: new Date().toISOString(),
  };
}
