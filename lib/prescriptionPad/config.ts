/**
 * PRESCRIPTION PAD — PDF CONFIG (single source of truth)
 * =========================================================
 * Every coordinate used to draw the Prescription Pad PDF lives in this file.
 * Nothing else in the app should hardcode an x/y/width/height for the pad.
 *
 * Units: points (pt), 1mm = 2.83464567 pt, 1in = 72pt. Origin (0,0) is the
 * BOTTOM-LEFT of the page (pdf-lib convention). Helper `fromTopLeft()` below
 * lets you enter coordinates measured from the TOP-LEFT of the page (the way
 * you'd usually measure off a printed pad with a ruler), which is more
 * intuitive when calibrating against a physical sheet.
 *
 * ============ TODO WHEN YOU SEND THE PHYSICAL PAD ============
 * 1. Set PAGE.widthMm / PAGE.heightMm to the exact pad size.
 * 2. Put the scanned pad image at PAGE.backgroundImagePath (used only in
 *    "digital" mode — never printed).
 * 3. Re-measure every box below (in mm, from the top-left corner of the
 *    sheet) and update the numbers. Everything is grouped by section so it's
 *    a straightforward find-and-replace once you have a ruler/scan on hand.
 * 4. Use CALIBRATION.offsetXMm / offsetYMm to nudge ALL print-mode output at
 *    once if your printer feeds the pad slightly off — no need to touch any
 *    individual field.
 * ================================================================
 */

export const MM_TO_PT = 2.83464567;
const mm = (v: number) => v * MM_TO_PT;

/** Physical page. Defaults to A4 portrait — replace with the pad's real size. */
export const PAGE = {
  widthMm: 210,
  heightMm: 297,
  get widthPt() {
    return mm(this.widthMm);
  },
  get heightPt() {
    return mm(this.heightMm);
  },
  /** Full-bleed scan/photo of the pre-printed pad. Only drawn in "digital" mode. */
  backgroundImagePath: "/prescription/pad-template.jpg",
};

/**
 * Printer calibration. Added to every fixed coordinate ONLY in "print" mode
 * (digital PDFs are self-contained with their own background, so they don't
 * need this). Positive X moves content right, positive Y moves content down.
 * Tune these two numbers per-printer instead of touching field coordinates.
 */
export const CALIBRATION = {
  offsetXMm: 0,
  offsetYMm: 0,
};

/** Convert a coordinate measured from the TOP-LEFT of the page (mm) into a
 *  pdf-lib bottom-left-origin point coordinate (pt). `heightMm` is the box's
 *  own height (needed because pdf-lib draws text from its baseline, not its
 *  top) — pass 0 for single-line fields anchored at their top edge. */
export function fromTopLeft(xMm: number, yMm: number) {
  return { x: mm(xMm), y: mm(PAGE.heightMm - yMm) };
}

export type Box = { xMm: number; yMm: number; widthMm: number; heightMm: number };

/* ------------------------------------------------------------------ */
/* Letterhead / static identification fields (top of pad)              */
/* ------------------------------------------------------------------ */
export const HEADER_FIELDS = {
  patientName: { xMm: 20, yMm: 34, fontSize: 10 },
  mobile: { xMm: 95, yMm: 34, fontSize: 10 },
  gender: { xMm: 150, yMm: 34, fontSize: 10 },
  dob: { xMm: 20, yMm: 41, fontSize: 10 },
  tob: { xMm: 95, yMm: 41, fontSize: 10 },
  place: { xMm: 150, yMm: 41, fontSize: 10 },
  date: { xMm: 20, yMm: 48, fontSize: 10 },
  astrologer: { xMm: 95, yMm: 48, fontSize: 10 },
};

/* ------------------------------------------------------------------ */
/* Kundali box — the chart is drawn ONLY inside this pre-printed box.  */
/* Chart image is scaled to fit while preserving aspect ratio, so it   */
/* never bleeds outside the printed border.                           */
/* ------------------------------------------------------------------ */
export const KUNDALI_BOX: Box = { xMm: 20, yMm: 58, widthMm: 78, heightMm: 78 };

/* ------------------------------------------------------------------ */
/* Dasha / dosha / yog block (beside the kundali box)                  */
/* ------------------------------------------------------------------ */
export const DASHA_FIELDS = {
  mahadasha: { xMm: 105, yMm: 62, fontSize: 10 },
  antardasha: { xMm: 105, yMm: 70, fontSize: 10 },
  pratyantar: { xMm: 105, yMm: 78, fontSize: 10 },
  dosha: { xMm: 105, yMm: 86, fontSize: 10 },
  yog: { xMm: 105, yMm: 94, fontSize: 10 },
};

/* ------------------------------------------------------------------ */
/* Planet position table (Graha / Rashi / Ansh / Bhav / Nakshatra)     */
/* ------------------------------------------------------------------ */
export const PLANET_TABLE = {
  startXMm: 20,
  startYMm: 142,
  rowHeightMm: 5.5,
  fontSize: 8.5,
  columns: {
    planet: { offsetXMm: 0, widthMm: 26 },
    sign: { offsetXMm: 26, widthMm: 26 },
    degree: { offsetXMm: 52, widthMm: 22 },
    house: { offsetXMm: 74, widthMm: 14 },
    nakshatra: { offsetXMm: 88, widthMm: 30 },
  },
};

/* ------------------------------------------------------------------ */
/* Remedies table (ग्रह | उपाय | टिप्पणी)                              */
/* ------------------------------------------------------------------ */
export const REMEDY_TABLE = {
  startXMm: 20,
  startYMm: 185,
  widthMm: 170,
  headerHeightMm: 7,
  rowMinHeightMm: 6,
  lineHeightMm: 4.2,
  fontSize: 9,
  headerFontSize: 9.5,
  /** Light-yellow header fill, per spec. */
  headerFillColor: { r: 1, g: 0.95, b: 0.72 },
  columns: {
    planet: { offsetXMm: 0, widthMm: 30 },
    remedy: { offsetXMm: 30, widthMm: 90 },
    notes: { offsetXMm: 120, widthMm: 50 },
  },
};

/* ------------------------------------------------------------------ */
/* Gemstone rows                                                       */
/* ------------------------------------------------------------------ */
export const GEMSTONE_BLOCK = {
  startXMm: 20,
  startYMm: 245,
  rowHeightMm: 6,
  fontSize: 8.5,
};

/* ------------------------------------------------------------------ */
/* Free-text notes                                                     */
/* ------------------------------------------------------------------ */
export const NOTES_FIELD = { xMm: 20, yMm: 275, widthMm: 170, fontSize: 9, lineHeightMm: 4.5 };

/* ------------------------------------------------------------------ */
/* Traditional planet colors (RGB 0-1, for pdf-lib's rgb()).           */
/* ------------------------------------------------------------------ */
export const PLANET_COLORS: Record<string, { r: number; g: number; b: number }> = {
  Sun: { r: 0.93, g: 0.46, b: 0.13 }, // Surya - orange
  Moon: { r: 0.55, g: 0.55, b: 0.58 }, // Chandra - silvery grey
  Mars: { r: 0.82, g: 0.11, b: 0.11 }, // Mangal - red
  Mercury: { r: 0.13, g: 0.55, b: 0.24 }, // Budh - green
  Jupiter: { r: 0.85, g: 0.72, b: 0.05 }, // Guru - yellow
  Venus: { r: 0.87, g: 0.68, b: 0.86 }, // Shukra - light pink/white
  Saturn: { r: 0.07, g: 0.09, b: 0.28 }, // Shani - dark blue/black
  Rahu: { r: 0.28, g: 0.24, b: 0.2 }, // smoky brown
  Ketu: { r: 0.4, g: 0.35, b: 0.3 }, // smoky brown (lighter)
  Miscellaneous: { r: 0.1, g: 0.1, b: 0.1 }, // default ink, not a planet
};
export const DEFAULT_TEXT_COLOR = { r: 0.13, g: 0.13, b: 0.13 };

export type PdfMode = "digital" | "print";
