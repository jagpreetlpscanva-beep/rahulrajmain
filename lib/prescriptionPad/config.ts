/**
 * PRESCRIPTION PAD — PDF CONFIG (single source of truth, all in mm)
 * =================================================================
 * Coordinates are measured in millimetres from the TOP-LEFT of the physical
 * pad (the way you measure with a ruler). generatePdf.ts converts to pdf-lib's
 * bottom-left points. Tune here only — never hardcode coords elsewhere.
 *
 * Master measurements provided for the real pad:
 *   Page 202 × 290 · Kundali box 13,65 (54×54) · Patient 72,66 (75×46)
 *   Mahadasha 150,68 (50×40) · Remedies 5,140 (192×102) · Footer 0,195 (202×48)
 */

export const MM_TO_PT = 2.83464567;
const mm = (v: number) => v * MM_TO_PT;

/** Physical page — the real pad size. Print at 100% Actual Size (never Fit). */
export const PAGE = {
  widthMm: 202,
  heightMm: 290,
  get widthPt() { return mm(this.widthMm); },
  get heightPt() { return mm(this.heightMm); },
  /** Scan of the pre-printed pad — drawn only in "digital" mode, never printed. */
  backgroundImagePath: "/prescription/pad-template.jpeg",
};

/** Printer nudge applied to every field in "print" mode only (mm). */
export const CALIBRATION = { offsetXMm: 0, offsetYMm: 0 };

export type Box = { xMm: number; yMm: number; widthMm: number; heightMm: number };

/* ---- Patient details (typed into the centre area: 72,66 · 75×46) ---- */
export const PATIENT_BLOCK = { xMm: 73, yMm: 71, lineHeightMm: 6, fontSize: 9 };

/* ---- Lagna Kundali box (13,65 · 54×54). The pad ALREADY has the printed grid —
       we do NOT draw a grid, only place planets at the house centres below. ---- */
export const KUNDALI_BOX: Box = { xMm: 13, yMm: 65, widthMm: 54, heightMm: 54 };
export const KUNDALI_PLANET = { fontSize: 11.5, lineMm: 4.3 };
/** House centres as fractions of the box (North-Indian layout, house1 = top diamond). */
export const HOUSE_CENTERS: Record<number, [number, number]> = {
  1: [0.5, 0.24], 2: [0.25, 0.11], 3: [0.11, 0.25], 4: [0.25, 0.5], 5: [0.11, 0.75],
  6: [0.25, 0.89], 7: [0.5, 0.76], 8: [0.75, 0.89], 9: [0.89, 0.75], 10: [0.75, 0.5],
  11: [0.89, 0.25], 12: [0.75, 0.11],
};

/* ---- Mahadasha / Antardasha / etc — values after the printed labels.
       Same left edge (xMm) + equal 9mm vertical spacing. ---- */
const DASHA_X = 168;
const DASHA_FS = 8.5;              // max size — auto-shrinks to stay inside the block
export const DASHA_MAX_WIDTH_MM = 32; // 168 → ~200 (page edge), value must fit here
export const DASHA_FIELDS = {
  mahadasha: { xMm: DASHA_X, yMm: 67, fontSize: DASHA_FS },
  antardasha: { xMm: DASHA_X, yMm: 76, fontSize: DASHA_FS },
  pratyantar: { xMm: DASHA_X, yMm: 85, fontSize: DASHA_FS },
  dosha: { xMm: DASHA_X, yMm: 94, fontSize: DASHA_FS },
  yog: { xMm: DASHA_X, yMm: 103, fontSize: DASHA_FS },
};

/* ---- Remedies (5,140 · 192×102) — one block per planet, NOT a table.
       Heading (planet name, coloured) sits on its own line; remedies +
       notes flow indented below it. Cursor is fully dynamic — nothing
       here is a fixed per-planet Y, only the starting point of the
       first block and the safe boundaries used for page-break checks. ---- */
export const REMEDY_BLOCK = {
  startXMm: 6,
  startYMm: 142,
  widthMm: 190,
  indentMm: 6,
  headingFontSize: 10.5,
  bodyFontSize: 8.5,
  lineHeightMm: 4.3,
  headingLineHeightMm: 6,
  blockGapMm: 5, // 4–6mm vertical gap between planet sections
  /** page 1's remedies area is boxed on the pre-printed pad (140→242mm) — stay inside it. */
  bottomLimitMm: 238,
  /** overflow pages are plain (no pre-printed template), so they use almost the full sheet. */
  continuationTopMm: 20,
  continuationBottomMm: 270,
};

/* ---- Gemstones — just above the footer, each with a small colour gem marker ---- */
export const GEMSTONE_BLOCK = { startXMm: 6, startYMm: 176, rowHeightMm: 6, fontSize: 8, iconMm: 3.4 };

/* ---- Free-text notes (bottom of the remedies area, above the footer) ---- */
export const NOTES_FIELD = { xMm: 6, yMm: 190, widthMm: 190, fontSize: 7.5, lineHeightMm: 3.6 };

/* ---- Gemstone term → Hindi (astrologer's saved data is usually English) ---- */
export const STONE_HI: Record<string, string> = {
  "Ruby (Manik)": "माणिक", "Pearl (Moti)": "मोती", "Red Coral (Moonga)": "मूंगा",
  "Emerald (Panna)": "पन्ना", "Yellow Sapphire (Pukhraj)": "पुखराज", "Diamond (Heera)": "हीरा",
  "Blue Sapphire (Neelam)": "नीलम", "Hessonite (Gomed)": "गोमेद", "Cat's Eye (Lehsunia)": "लहसुनिया",
};
export const METAL_HI: Record<string, string> = {
  "Gold": "सोना", "Silver": "चांदी", "Copper": "तांबा",
  "Gold / Copper": "सोना/तांबा", "Copper / Gold": "तांबा/सोना", "Silver / Platinum": "चांदी/प्लैटिनम",
};
export const FINGER_HI: Record<string, string> = {
  "Ring Finger": "अनामिका", "Little Finger": "कनिष्ठा", "Index Finger": "तर्जनी", "Middle Finger": "मध्यमा",
};
export const DAY_HI: Record<string, string> = {
  "Sunday": "रविवार", "Monday": "सोमवार", "Tuesday": "मंगलवार", "Wednesday": "बुधवार",
  "Thursday": "गुरुवार", "Friday": "शुक्रवार", "Saturday": "शनिवार",
};

/* ---- Traditional planet colours (RGB 0-1). Keyed by BOTH English & Hindi. ---- */
const C = {
  sun: { r: 0.89, g: 0.4, b: 0.1 },
  moon: { r: 0.36, g: 0.42, b: 0.55 },
  mars: { r: 0.8, g: 0.13, b: 0.13 },
  mercury: { r: 0.1, g: 0.56, b: 0.24 },
  jupiter: { r: 0.72, g: 0.52, b: 0.04 },
  venus: { r: 0.75, g: 0.15, b: 0.64 },
  saturn: { r: 0.1, g: 0.14, b: 0.32 },
  rahu: { r: 0.33, g: 0.33, b: 0.33 },
  ketu: { r: 0.48, g: 0.29, b: 0.12 },
};
export const PLANET_COLORS: Record<string, { r: number; g: number; b: number }> = {
  Sun: C.sun, "सूर्य": C.sun,
  Moon: C.moon, "चंद्र": C.moon, "चन्द्र": C.moon,
  Mars: C.mars, "मंगल": C.mars,
  Mercury: C.mercury, "बुध": C.mercury,
  Jupiter: C.jupiter, "गुरु": C.jupiter,
  Venus: C.venus, "शुक्र": C.venus,
  Saturn: C.saturn, "शनि": C.saturn,
  Rahu: C.rahu, "राहु": C.rahu,
  Ketu: C.ketu, "केतु": C.ketu,
};
export const DEFAULT_TEXT_COLOR = { r: 0.13, g: 0.13, b: 0.13 };

export type PdfMode = "digital" | "print";
