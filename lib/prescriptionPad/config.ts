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
export const KUNDALI_PLANET = { fontSize: 9, lineMm: 3.4 };
/** House centres as fractions of the box (North-Indian layout, house1 = top diamond). */
export const HOUSE_CENTERS: Record<number, [number, number]> = {
  1: [0.5, 0.24], 2: [0.25, 0.11], 3: [0.11, 0.25], 4: [0.25, 0.5], 5: [0.11, 0.75],
  6: [0.25, 0.89], 7: [0.5, 0.76], 8: [0.75, 0.89], 9: [0.89, 0.75], 10: [0.75, 0.5],
  11: [0.89, 0.25], 12: [0.75, 0.11],
};

/* ---- Mahadasha / Antardasha / etc — values after the printed labels.
       Same left edge (xMm) + equal 9mm vertical spacing. ---- */
const DASHA_X = 170;
const DASHA_FS = 7;
export const DASHA_FIELDS = {
  mahadasha: { xMm: DASHA_X, yMm: 67, fontSize: DASHA_FS },
  antardasha: { xMm: DASHA_X, yMm: 76, fontSize: DASHA_FS },
  pratyantar: { xMm: DASHA_X, yMm: 85, fontSize: DASHA_FS },
  dosha: { xMm: DASHA_X, yMm: 94, fontSize: DASHA_FS },
  yog: { xMm: DASHA_X, yMm: 103, fontSize: DASHA_FS },
};

/* ---- Remedies table (5,140 · 192×102) — clean bordered table ---- */
export const REMEDY_TABLE = {
  startXMm: 6,
  startYMm: 142,
  widthMm: 190,
  headerHeightMm: 7,
  rowMinHeightMm: 7,
  lineHeightMm: 3.8,
  cellPadMm: 2.2,
  fontSize: 8,
  headerFontSize: 8.5,
  headerFillColor: { r: 1, g: 0.94, b: 0.68 },
  borderColor: { r: 0.55, g: 0.48, b: 0.4 },
  columns: {
    planet: { offsetXMm: 0, widthMm: 30 },
    remedy: { offsetXMm: 30, widthMm: 110 },
    notes: { offsetXMm: 140, widthMm: 50 },
  },
};

/* ---- Gemstones — printed just below the remedies table ---- */
export const GEMSTONE_BLOCK = { startXMm: 6, startYMm: 232, rowHeightMm: 5, fontSize: 8 };

/* ---- Free-text notes (bottom of the remedies area) ---- */
export const NOTES_FIELD = { xMm: 6, yMm: 248, widthMm: 190, fontSize: 8, lineHeightMm: 4 };

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
