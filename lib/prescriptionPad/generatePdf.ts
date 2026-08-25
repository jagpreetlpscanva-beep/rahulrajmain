"use client";

// pdf-lib / @pdf-lib/fontkit ship transpiled async code that references the
// global `regeneratorRuntime`; importing this polyfill defines it.
import "regenerator-runtime/runtime";

/**
 * Prescription Pad PDF generator (millimetre-accurate, matches the physical pad).
 *
 * - "digital": pad scan as full-page background + dynamic data overlaid in the
 *   exact measured areas. Used for Save / Share.
 * - "print": NO background — only the dynamic data at the same coordinates, so
 *   it lines up when printed onto the pre-printed pad. Print at 100% Actual Size.
 *
 * All coordinates come from ./config.ts (mm). Nothing is hardcoded here.
 */

import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import {
  PAGE,
  CALIBRATION,
  PATIENT_BLOCK,
  PRINT_PATIENT_SHIFT_XMM,
  PRINT_PATIENT_SHIFT_YMM,
  KUNDALI_BOX,
  KUNDALI_PLANET,
  PRINT_KUNDALI_PLANET_SCALE,
  PRINT_KUNDALI_SHIFT_XMM,
  KUNDALI_HOUSE_NUMBER,
  HOUSE_CENTERS,
  DASHA_FIELDS,
  DASHA_MAX_WIDTH_MM,
  PRINT_DASHA_SHIFT_XMM,
  PRINT_DASHA_SHIFT_YMM,
  PRINT_TODAY_DATE,
  PRINT_MAHA_SPLIT_MM,
  SIGNATURE,
  ANUSHTHAN_PRINT_LIMIT,
  REMEDY_BLOCK,
  GEMSTONE_BLOCK,
  ANUSHTHAN_TABLE,
  SECTION_HEADING_COLOR,
  NOTES_FIELD,
  PLANET_COLORS,
  DEFAULT_TEXT_COLOR,
  STONE_HI,
  METAL_HI,
  FINGER_HI,
  DAY_HI,
  MM_TO_PT,
  type PdfMode,
} from "./config";

const mm = (v: number) => v * MM_TO_PT;

export type PdfPlanet = { name: string; abbr: string; house: number; degree: number };
export type PdfRemedyRow = { planet: string; remedyLines: string[]; notes: string };
export type PdfGemRow = { planet: string; stone: string; weight: string; metal: string; finger: string; day: string; rudraksha?: string; price?: string };
export type PdfSection = { id: string; title: string; enabled: boolean; col1?: string; col2?: string; col3?: string };
export type PdfAnushthanRow = { title: string; purpose: string; dakshina: string };

export interface SelectedGemstonePayload {
  gemstoneId: string;
  gemstoneName: string;
  selectedWeight: string;
  selectedPrice: number;
  quality?: string;
}

export interface PrescriptionPdfData {
  patientName: string;
  mobile: string;
  gender: string;
  dob: string; // DD/MM/YYYY
  tob: string;
  place: string;
  date: string; // DD/MM/YYYY
  astrologer: string;
  mahadasha: string;
  antardasha: string;
  pratyantar: string;
  dosha: string;
  yog: string;
  /** Planets to place inside the pad's pre-printed Kundali box (no grid is drawn). */
  planets: PdfPlanet[];
  /** Ascendant (Lagna) rashi index (0=Mesha..11=Meena), from the SAME computeKundli()
   *  result shown on screen. House-1 always shows this rashi's own number, and the
   *  rest follow in order — matching the on-screen chart exactly (never recalculated
   *  separately here). Falls back to 0 (Mesha) only for legacy callers that omit it. */
  ascRashi?: number;
  remedyRows: PdfRemedyRow[];
  gemRows: PdfGemRow[];
  /** Admin-defined gemstone selected via RemedyPicker */
  selectedGemstone?: SelectedGemstonePayload;
  /** Admin-defined section order + on/off (both digital & print). Falls back to
   *  anushthan → remedies → gemstones when not provided. */
  sections?: PdfSection[];
  anushthanRows?: PdfAnushthanRow[];
  /** Editable patient-block labels keyed by their padLabels key (falls back to
   *  the built-in Hindi default when absent). */
  labels?: Record<string, string>;
  notes: string;
}

/** top-left mm -> pdf-lib bottom-left pt, applying print-mode calibration. */
function pt(xMm: number, yMm: number, mode: PdfMode) {
  const ox = mode === "print" ? CALIBRATION.offsetXMm : 0;
  const oy = mode === "print" ? CALIBRATION.offsetYMm : 0;
  return { x: mm(xMm + ox), y: mm(PAGE.heightMm - (yMm + oy)) };
}

function drawText(
  page: PDFPage,
  font: PDFFont,
  text: string,
  xMm: number,
  yMm: number,
  mode: PdfMode,
  opts: { size?: number; color?: { r: number; g: number; b: number } } = {}
) {
  if (!text) return;
  const { x, y } = pt(xMm, yMm, mode);
  const size = opts.size ?? 9;
  const color = rgb((opts.color ?? DEFAULT_TEXT_COLOR).r, (opts.color ?? DEFAULT_TEXT_COLOR).g, (opts.color ?? DEFAULT_TEXT_COLOR).b);
  // synthetic bold — draw a few times with tiny offsets for a heavier, attractive stroke
  page.drawText(text, { x, y, size, font, color });
  page.drawText(text, { x: x + 0.4, y, size, font, color });
  page.drawText(text, { x, y: y + 0.4, size, font, color });
}

/** Draw text shrinking the font (down to minSize) so it never spills past maxWidthMm. */
function drawTextFit(
  page: PDFPage, font: PDFFont, text: string, xMm: number, yMm: number, maxWidthMm: number,
  mode: PdfMode, maxSize: number, minSize: number, color?: { r: number; g: number; b: number }
) {
  if (!text) return;
  let size = maxSize;
  while (size > minSize && font.widthOfTextAtSize(text, size) / MM_TO_PT > maxWidthMm) size -= 0.25;
  drawText(page, font, text, xMm, yMm, mode, { size, color });
}

function wrapText(font: PDFFont, text: string, maxWidthMm: number, size: number): string[] {
  const maxWidthPt = mm(maxWidthMm);
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const trial = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(trial, size) > maxWidthPt && line) {
      lines.push(line);
      line = w;
    } else {
      line = trial;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function generatePrescriptionPdf(data: PrescriptionPdfData, mode: PdfMode): Promise<Blob> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const page = doc.addPage([PAGE.widthPt, PAGE.heightPt]); // exact physical size, no scaling

  // Devanagari-capable font (Helvetica cannot encode Hindi and would throw).
  let font: PDFFont;
  try {
    const fontBytes = await fetch("/fonts/NotoSansDevanagari.ttf").then((r) => {
      if (!r.ok) throw new Error("font fetch failed");
      return r.arrayBuffer();
    });
    font = await doc.embedFont(fontBytes, { subset: true });
  } catch (err) {
    throw new Error("Devanagari font (/fonts/NotoSansDevanagari.ttf) load nahi ho paya. " + String(err));
  }

  // ---- background (digital mode only) ----
  if (mode === "digital") {
    try {
      const bgRes = await fetch(PAGE.backgroundImagePath);
      if (bgRes.ok) {
        const bgBytes = new Uint8Array(await bgRes.arrayBuffer());
        const isPng = PAGE.backgroundImagePath.toLowerCase().endsWith(".png");
        const bgImg = isPng ? await doc.embedPng(bgBytes) : await doc.embedJpg(bgBytes);
        page.drawImage(bgImg, { x: 0, y: 0, width: PAGE.widthPt, height: PAGE.heightPt });
      }
    } catch {
      /* background missing — continue */
    }
  }

  // ---- patient details (centre area, labelled lines) ----
  const PB = PATIENT_BLOCK;
  const L = (key: string, fallback: string) => data.labels?.[key] ?? fallback;
  // Print pad: only नाम / जन्म / स्थान / ज्योतिषी (no mobile, gender or date —
  // today's date is shown top-right instead). Digital PDF keeps all fields.
  const pLines: [string, string][] = mode === "print"
    ? [
        [`${L("plabel_name", "नाम")}:`, data.patientName],
        [`${L("plabel_birth", "जन्म")}:`, `${data.dob} ${data.tob}`.trim()],
        [`${L("plabel_place", "स्थान")}:`, data.place],
        [`${L("plabel_astrologer", "ज्योतिषी")}:`, data.astrologer],
      ]
    : [
        [`${L("plabel_yajman", "यजमान")}:`, data.patientName],
        [`${L("plabel_mobile", "मोबाइल")}:`, data.mobile],
        [`${L("plabel_gender", "लिंग")}:`, data.gender],
        [`${L("plabel_birth", "जन्म")}:`, `${data.dob} ${data.tob}`.trim()],
        [`${L("plabel_place", "स्थान")}:`, data.place],
        [`${L("plabel_date", "दिनांक")}:`, data.date],
        [`${L("plabel_astrologer", "ज्योतिषी")}:`, data.astrologer],
      ];
  // Print mode nudges the whole patient block into its printed area (off the pad's
  // gemstone pictures); digital keeps the exact measured position (shift = 0).
  const pShiftX = mode === "print" ? PRINT_PATIENT_SHIFT_XMM : 0;
  const pShiftY = mode === "print" ? PRINT_PATIENT_SHIFT_YMM : 0;
  pLines.forEach(([label, val], i) => {
    if (!val) return;
    drawText(page, font, `${label} ${val}`, PB.xMm + pShiftX, PB.yMm + i * PB.lineHeightMm + pShiftY, mode, { size: PB.fontSize });
  });

  // ---- planets INSIDE the pad's pre-printed Kundali box (NO grid drawn) ----
  // Print mode enlarges the labels ~25% (bolder on the pad) WITHOUT moving the
  // house centres; digital keeps the original size. Vertical stacking (lineMm)
  // is unchanged so planets stay inside their houses.
  const planetSize = mode === "print" ? KUNDALI_PLANET.fontSize * PRINT_KUNDALI_PLANET_SCALE : KUNDALI_PLANET.fontSize;
  const planetShiftX = mode === "print" ? PRINT_KUNDALI_SHIFT_XMM : 0;
  // Rashi numbers in every house (fixed box positions, not shifted with planets).
  // Same rule as the on-screen chart (lib/vedic.ts chartSvgDataUri): house 1 shows
  // the Lagna's own rashi number, the rest follow in order — e.g. Lagna=5 ->
  // 5,6,7,8,9,10,11,12,1,2,3,4. Uses data.ascRashi from the SAME computeKundli()
  // result as the screen; NEVER recalculated independently for the PDF.
  const HN = KUNDALI_HOUSE_NUMBER;
  const ascRashi = data.ascRashi ?? 0;
  for (let h = 1; h <= 12; h++) {
    const [fx, fy] = HOUSE_CENTERS[h];
    const cxMm = KUNDALI_BOX.xMm + fx * KUNDALI_BOX.widthMm;
    const cyMm = KUNDALI_BOX.yMm + fy * KUNDALI_BOX.heightMm;
    const rashiNum = ((ascRashi + (h - 1)) % 12) + 1;
    const label = String(rashiNum);
    const wMm = font.widthOfTextAtSize(label, HN.fontSize) / MM_TO_PT;
    drawText(page, font, label, cxMm - wMm / 2, cyMm + HN.dyMm, mode, { size: HN.fontSize, color: HN.color });
  }
  const byHouse: Record<number, PdfPlanet[]> = {};
  for (const p of data.planets) (byHouse[p.house] ||= []).push(p);
  for (let h = 1; h <= 12; h++) {
    const arr = byHouse[h];
    if (!arr || arr.length === 0) continue;
    const [fx, fy] = HOUSE_CENTERS[h];
    const cxMm = KUNDALI_BOX.xMm + fx * KUNDALI_BOX.widthMm;
    const cyMm = KUNDALI_BOX.yMm + fy * KUNDALI_BOX.heightMm;
    // stack multiple planets vertically, centred on the house point
    const startYMm = cyMm - ((arr.length - 1) * KUNDALI_PLANET.lineMm) / 2;
    arr.forEach((p, i) => {
      const label = `${p.abbr} ${p.degree}°`;
      const wMm = font.widthOfTextAtSize(label, planetSize) / MM_TO_PT;
      const color = PLANET_COLORS[p.name] ?? DEFAULT_TEXT_COLOR;
      drawText(page, font, label, cxMm - wMm / 2 + planetShiftX, startYMm + i * KUNDALI_PLANET.lineMm, mode, { size: planetSize, color });
    });
  }

  // ---- dasha / dosha / yog — bold, biggest size that still fits inside the block ----
  // Print mode nudges the whole dasha column left to sit on the pad's printed
  // labels; digital PDF is unaffected (shift = 0).
  const dashaShift = mode === "print" ? PRINT_DASHA_SHIFT_XMM : 0;
  const dashaShiftY = mode === "print" ? PRINT_DASHA_SHIFT_YMM : 0;
  const dfit = (val: string, f: { xMm: number; yMm: number; fontSize: number }) =>
    drawTextFit(page, font, val, f.xMm + dashaShift, f.yMm + dashaShiftY, DASHA_MAX_WIDTH_MM, mode, f.fontSize, 6);

  if (mode === "print") {
    // Only date on the print pad: today's date, top-right above the Mahadasha column.
    drawText(page, font, `${L("plabel_date", "दिनांक")}: ${data.date}`, DASHA_FIELDS.mahadasha.xMm + dashaShift, PRINT_TODAY_DATE.yMm, mode, { size: PRINT_TODAY_DATE.fontSize });
    // Mahadasha split: planet name above the printed label, "till <date>" below it.
    const mf = DASHA_FIELDS.mahadasha;
    const m = data.mahadasha.match(/^(.*?)\s*\(\s*till\s*(.*?)\)\s*$/i);
    const planet = (m ? m[1] : data.mahadasha).trim();
    const till = m ? `till ${m[2].trim()}` : "";
    drawTextFit(page, font, planet, mf.xMm + dashaShift, mf.yMm + dashaShiftY - PRINT_MAHA_SPLIT_MM, DASHA_MAX_WIDTH_MM, mode, mf.fontSize, 6);
    if (till) drawTextFit(page, font, till, mf.xMm + dashaShift, mf.yMm + dashaShiftY + PRINT_MAHA_SPLIT_MM, DASHA_MAX_WIDTH_MM, mode, mf.fontSize - 1, 6);
  } else {
    dfit(data.mahadasha, DASHA_FIELDS.mahadasha);
  }
  dfit(data.antardasha, DASHA_FIELDS.antardasha);
  dfit(data.pratyantar, DASHA_FIELDS.pratyantar);
  dfit(data.dosha, DASHA_FIELDS.dosha);
  dfit(data.yog, DASHA_FIELDS.yog);

  // ---- flowing content area: Anushthan / Remedies / Gemstones, in the admin
  //      order (data.sections), each skipped when disabled. A single cursor
  //      advances by the ACTUAL height drawn, so sections never overlap and a
  //      full page starts a fresh sheet before drawing (never mid-block). ----
  const rb = REMEDY_BLOCK;
  type Cursor = { page: PDFPage; yMm: number; pageIndex: number };
  const cursor: Cursor = { page, yMm: rb.startYMm, pageIndex: 0 };

  const bottomLimitFor = (pageIndex: number) => (pageIndex === 0 ? rb.bottomLimitMm : rb.continuationBottomMm);

  /** Start a new (blank) page if `neededMm` of content won't fit before the safe bottom edge. */
  const ensureSpace = (neededMm: number) => {
    if (cursor.yMm + neededMm <= bottomLimitFor(cursor.pageIndex)) return;
    const overflowPage = doc.addPage([PAGE.widthPt, PAGE.heightPt]);
    cursor.page = overflowPage;
    cursor.yMm = rb.continuationTopMm;
    cursor.pageIndex += 1;
  };

  const hi = (map: Record<string, string>, v: string) => map[v] ?? v;
  const weightHi = (w: string) => w.replace(/ratti/i, "रत्ती");

  type C = { r: number; g: number; b: number };
  const fillRect = (pg: PDFPage, xMm: number, yTopMm: number, wMm: number, hMm: number, fill?: C, border?: C) => {
    const p = pt(xMm, yTopMm + hMm, mode); // bottom-left of the rect
    pg.drawRectangle({
      x: p.x, y: p.y, width: mm(wMm), height: mm(hMm),
      color: fill ? rgb(fill.r, fill.g, fill.b) : undefined,
      borderColor: border ? rgb(border.r, border.g, border.b) : undefined,
      borderWidth: border ? 0.5 : 0,
    });
  };

  // -- Remedies: one block per planet (heading + indented, wrapped body) --
  const drawRemedies = () => {
    data.remedyRows.forEach((row) => {
      const remedyLines = row.remedyLines.flatMap((l) => wrapText(font, `• ${l}`, rb.widthMm - rb.indentMm, rb.bodyFontSize));
      const notesLines = row.notes ? wrapText(font, `टिप्पणी: ${row.notes}`, rb.widthMm - rb.indentMm, rb.bodyFontSize) : [];
      const bodyLines = [...remedyLines, ...notesLines];
      const blockHeightMm = rb.headingLineHeightMm + bodyLines.length * rb.lineHeightMm;
      ensureSpace(blockHeightMm);
      const color = PLANET_COLORS[row.planet] ?? DEFAULT_TEXT_COLOR;
      drawText(cursor.page, font, row.planet, rb.startXMm, cursor.yMm, mode, { size: rb.headingFontSize, color });
      cursor.yMm += rb.headingLineHeightMm;
      bodyLines.forEach((line) => {
        drawText(cursor.page, font, line, rb.startXMm + rb.indentMm, cursor.yMm, mode, { size: rb.bodyFontSize });
        cursor.yMm += rb.lineHeightMm;
      });
      cursor.yMm += rb.blockGapMm;
    });
  };

  // -- Gemstones: dynamic RemedyPicker gemstone selection + standard gem rows --
  const drawGemstones = () => {
    if (data.selectedGemstone) {
      ensureSpace(GEMSTONE_BLOCK.rowHeightMm * 2);
      const { gemstoneName, selectedWeight, selectedPrice, quality } = data.selectedGemstone;
      const qualStr = quality ? ` (${quality})` : "";
      const selectedLine = `अनुशंसित रत्न: ${gemstoneName} · ${selectedWeight}${qualStr} · मूल्य: ₹${selectedPrice}`;
      drawText(cursor.page, font, selectedLine, GEMSTONE_BLOCK.startXMm, cursor.yMm, mode, {
        size: GEMSTONE_BLOCK.fontSize + 1,
        color: SECTION_HEADING_COLOR,
      });
      cursor.yMm += GEMSTONE_BLOCK.rowHeightMm + 2;
    }

    data.gemRows.forEach((g) => {
      ensureSpace(GEMSTONE_BLOCK.rowHeightMm);
      const color = PLANET_COLORS[g.planet] ?? DEFAULT_TEXT_COLOR;
      const rowYMm = cursor.yMm;
      const r = GEMSTONE_BLOCK.iconMm / 2;
      const cc = pt(GEMSTONE_BLOCK.startXMm + r, rowYMm - 1.2, mode);
      cursor.page.drawCircle({ x: cc.x, y: cc.y, size: mm(r), color: rgb(color.r, color.g, color.b) });
      cursor.page.drawCircle({ x: cc.x, y: cc.y, size: mm(r), borderColor: rgb(0.25, 0.25, 0.25), borderWidth: 0.4 });
      const rud = g.rudraksha ? ` · रुद्राक्ष: ${g.rudraksha}` : "";
      const price = g.price ? ` · मूल्य: ${g.price}` : "";
      const line = `रत्न: ${g.planet} — ${hi(STONE_HI, g.stone)} · ${weightHi(g.weight)} · ${hi(METAL_HI, g.metal)} · ${hi(FINGER_HI, g.finger)} · ${hi(DAY_HI, g.day)}${rud}${price}`;
      drawText(cursor.page, font, line, GEMSTONE_BLOCK.startXMm + GEMSTONE_BLOCK.iconMm + 2, rowYMm, mode, { size: GEMSTONE_BLOCK.fontSize, color });
      cursor.yMm += GEMSTONE_BLOCK.rowHeightMm;
    });
  };

  // -- Anushthan: editable-title + bordered 3-column table (name/purpose/dakshina) --
  const drawAnushthan = (sec: PdfSection) => {
    // Only the first N selected anushthan are printed on the pad.
    const rows = (data.anushthanRows ?? []).slice(0, ANUSHTHAN_PRINT_LIMIT);
    if (rows.length === 0) return;
    const T = ANUSHTHAN_TABLE;
    const x0 = rb.startXMm, w = rb.widthMm;
    const w1 = w * T.col1FracW, w2 = w * T.col2FracW, w3 = w - w1 - w2;
    const cols = [
      { x: x0, w: w1, label: sec.col1 || "अनुष्ठान" },
      { x: x0 + w1, w: w2, label: sec.col2 || "उद्देश्य" },
      { x: x0 + w1 + w2, w: w3, label: sec.col3 || "दक्षिणा" },
    ];
    const totalH = rb.headingLineHeightMm + T.headerHeightMm + rows.length * T.rowHeightMm + 2;
    ensureSpace(totalH);
    const pg = cursor.page;
    // section title (editable from admin)
    drawText(pg, font, sec.title || "अनुष्ठान", x0, cursor.yMm, mode, { size: T.headingFontSize, color: SECTION_HEADING_COLOR });
    cursor.yMm += rb.headingLineHeightMm;
    // header row
    const headerTop = cursor.yMm;
    cols.forEach((c) => {
      fillRect(pg, c.x, headerTop, c.w, T.headerHeightMm, T.headerFillColor, T.borderColor);
      drawText(pg, font, c.label, c.x + T.cellPadMm, headerTop + T.headerHeightMm - T.cellPadMm, mode, { size: T.headerFontSize });
    });
    cursor.yMm += T.headerHeightMm;
    // data rows
    rows.forEach((rrow) => {
      const rowTop = cursor.yMm;
      const vals = [rrow.title, rrow.purpose, rrow.dakshina];
      cols.forEach((c, ci) => {
        fillRect(pg, c.x, rowTop, c.w, T.rowHeightMm, undefined, T.borderColor);
        drawText(pg, font, vals[ci] ?? "", c.x + T.cellPadMm, rowTop + T.rowHeightMm - T.cellPadMm, mode, { size: T.cellFontSize });
      });
      cursor.yMm += T.rowHeightMm;
    });
    cursor.yMm += T.afterGapMm; // 5–8mm clear space before the next section (gemstones)
  };

  const defaultSections: PdfSection[] = [
    { id: "anushthan", title: "अनुष्ठान", enabled: true },
    { id: "remedies", title: "उपाय", enabled: true },
    { id: "gemstones", title: "रत्न", enabled: true },
  ];
  const sections = data.sections && data.sections.length ? data.sections : defaultSections;
  for (const sec of sections) {
    if (sec.enabled === false) continue;
    if (sec.id === "remedies") drawRemedies();
    else if (sec.id === "gemstones") drawGemstones();
    else if (sec.id === "anushthan") drawAnushthan(sec);
  }

  // ---- notes (flows just below the last section, same cursor) ----
  if (data.notes) {
    const lines = wrapText(font, `टिप्पणी: ${data.notes}`, NOTES_FIELD.widthMm, NOTES_FIELD.fontSize);
    ensureSpace(lines.length * NOTES_FIELD.lineHeightMm);
    lines.forEach((line, i) => drawText(cursor.page, font, line, NOTES_FIELD.xMm, cursor.yMm + i * NOTES_FIELD.lineHeightMm, mode, { size: NOTES_FIELD.fontSize }));
    cursor.yMm += lines.length * NOTES_FIELD.lineHeightMm;
  }

  // ---- permanent astrologer signature (EVERY PDF: print/save/share/whatsapp) ----
  // Auto-loaded from /public each time (no upload/selection). Placed on page 1,
  // bottom-right just above the "संपर्क समय" footer. Transparency preserved and
  // height scaled proportionally. `no-store` = a replaced file is picked up next time.
  try {
    const sigRes = await fetch(SIGNATURE.path, { cache: "no-store" });
    if (sigRes.ok) {
      const sigBytes = new Uint8Array(await sigRes.arrayBuffer());
      const sig = await doc.embedPng(sigBytes);
      const wPt = mm(SIGNATURE.widthMm);
      const hPt = sig.height * (wPt / sig.width); // proportional height
      const bl = pt(SIGNATURE.xMm, SIGNATURE.yMm + hPt / MM_TO_PT, mode); // top-left → bottom-left
      page.drawImage(sig, { x: bl.x, y: bl.y, width: wPt, height: hPt });
    }
  } catch {
    /* signature file not present yet — skip silently */
  }

  const bytes = await doc.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

/** Trigger a browser download of a generated PDF blob. */
export function downloadPdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Open a generated PDF blob in a new tab. */
export function openPdfInNewTab(blob: Blob) {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}
