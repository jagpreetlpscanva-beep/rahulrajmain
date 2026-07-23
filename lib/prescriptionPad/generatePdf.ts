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
  KUNDALI_BOX,
  KUNDALI_PLANET,
  HOUSE_CENTERS,
  DASHA_FIELDS,
  DASHA_MAX_WIDTH_MM,
  REMEDY_TABLE,
  GEMSTONE_BLOCK,
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
export type PdfGemRow = { planet: string; stone: string; weight: string; metal: string; finger: string; day: string; mantra: string; rudraksha?: string };

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
  remedyRows: PdfRemedyRow[];
  gemRows: PdfGemRow[];
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
  const pLines: [string, string][] = [
    ["यजमान:", data.patientName],
    ["मोबाइल:", data.mobile],
    ["लिंग:", data.gender],
    ["जन्म:", `${data.dob} ${data.tob}`.trim()],
    ["स्थान:", data.place],
    ["दिनांक:", data.date],
    ["ज्योतिषी:", data.astrologer],
  ];
  pLines.forEach(([label, val], i) => {
    if (!val) return;
    drawText(page, font, `${label} ${val}`, PB.xMm, PB.yMm + i * PB.lineHeightMm, mode, { size: PB.fontSize });
  });

  // ---- planets INSIDE the pad's pre-printed Kundali box (NO grid drawn) ----
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
      const wMm = font.widthOfTextAtSize(label, KUNDALI_PLANET.fontSize) / MM_TO_PT;
      const color = PLANET_COLORS[p.name] ?? DEFAULT_TEXT_COLOR;
      drawText(page, font, label, cxMm - wMm / 2, startYMm + i * KUNDALI_PLANET.lineMm, mode, { size: KUNDALI_PLANET.fontSize, color });
    });
  }

  // ---- dasha / dosha / yog — bold, biggest size that still fits inside the block ----
  const dfit = (val: string, f: { xMm: number; yMm: number; fontSize: number }) =>
    drawTextFit(page, font, val, f.xMm, f.yMm, DASHA_MAX_WIDTH_MM, mode, f.fontSize, 6);
  dfit(data.mahadasha, DASHA_FIELDS.mahadasha);
  dfit(data.antardasha, DASHA_FIELDS.antardasha);
  dfit(data.pratyantar, DASHA_FIELDS.pratyantar);
  dfit(data.dosha, DASHA_FIELDS.dosha);
  dfit(data.yog, DASHA_FIELDS.yog);

  // ---- remedies table (ग्रह | उपाय | टिप्पणी) — clean, bordered, aligned ----
  const t = REMEDY_TABLE;
  let gemTopMm = GEMSTONE_BLOCK.startYMm; // gemstones flow AFTER the table (no overlap)
  if (data.remedyRows.length > 0) {
    const pad = t.cellPadMm;
    const border = rgb(t.borderColor.r, t.borderColor.g, t.borderColor.b);
    const lineAt = (x1: number, y1: number, x2: number, y2: number) => {
      const a = pt(x1, y1, mode), b = pt(x2, y2, mode);
      page.drawLine({ start: { x: a.x, y: a.y }, end: { x: b.x, y: b.y }, thickness: 0.6, color: border });
    };
    const colPlanetX = t.startXMm + t.columns.planet.offsetXMm;
    const colRemedyX = t.startXMm + t.columns.remedy.offsetXMm;
    const colNotesX = t.startXMm + t.columns.notes.offsetXMm;

    // measure every row first (so borders can span the exact height)
    const meta = data.remedyRows.map((row) => {
      const remedyLines = row.remedyLines.flatMap((l) => wrapText(font, `• ${l}`, t.columns.remedy.widthMm - 2 * pad, t.fontSize));
      const notesLines = wrapText(font, row.notes, t.columns.notes.widthMm - 2 * pad, t.fontSize);
      const n = Math.max(1, remedyLines.length, notesLines.length);
      const h = Math.max(t.rowMinHeightMm, n * t.lineHeightMm + 2 * pad);
      return { row, remedyLines, notesLines, h };
    });
    const totalH = t.headerHeightMm + meta.reduce((s, m) => s + m.h, 0);
    const xL = t.startXMm, xR = t.startXMm + t.widthMm, yT = t.startYMm, yB = t.startYMm + totalH;

    // full-width yellow header fill
    const hp = pt(xL, yT, mode);
    page.drawRectangle({ x: hp.x, y: hp.y - mm(t.headerHeightMm), width: mm(t.widthMm), height: mm(t.headerHeightMm), color: rgb(t.headerFillColor.r, t.headerFillColor.g, t.headerFillColor.b) });

    // outer border + full-height column dividers + header underline
    lineAt(xL, yT, xR, yT); lineAt(xL, yB, xR, yB);
    lineAt(xL, yT, xL, yB); lineAt(xR, yT, xR, yB);
    lineAt(colRemedyX, yT, colRemedyX, yB); lineAt(colNotesX, yT, colNotesX, yB);
    lineAt(xL, yT + t.headerHeightMm, xR, yT + t.headerHeightMm);

    // header labels — vertically centred in the band
    const headBase = yT + t.headerHeightMm / 2 + t.headerFontSize / MM_TO_PT / 3;
    drawText(page, font, "ग्रह", colPlanetX + pad, headBase, mode, { size: t.headerFontSize });
    drawText(page, font, "उपाय", colRemedyX + pad, headBase, mode, { size: t.headerFontSize });
    drawText(page, font, "टिप्पणी", colNotesX + pad, headBase, mode, { size: t.headerFontSize });

    // body rows
    let cy = yT + t.headerHeightMm;
    meta.forEach((m, idx) => {
      const base = cy + pad + t.fontSize / MM_TO_PT; // baseline of the first line
      const color = PLANET_COLORS[m.row.planet] ?? DEFAULT_TEXT_COLOR;
      drawText(page, font, m.row.planet, colPlanetX + pad, base, mode, { size: t.fontSize, color });
      m.remedyLines.forEach((l, i) => drawText(page, font, l, colRemedyX + pad, base + i * t.lineHeightMm, mode, { size: t.fontSize }));
      m.notesLines.forEach((l, i) => drawText(page, font, l, colNotesX + pad, base + i * t.lineHeightMm, mode, { size: t.fontSize }));
      cy += m.h;
      if (idx < meta.length - 1) lineAt(xL, cy, xR, cy); // row divider
    });
    gemTopMm = yB + 5; // start gemstones just below the table
  }

  // ---- gemstones (in Hindi, each with a small colour gem marker) ----
  const hi = (map: Record<string, string>, v: string) => map[v] ?? v;
  const weightHi = (w: string) => w.replace(/ratti/i, "रत्ती");
  data.gemRows.forEach((g, i) => {
    const color = PLANET_COLORS[g.planet] ?? DEFAULT_TEXT_COLOR;
    const rowYMm = gemTopMm + i * GEMSTONE_BLOCK.rowHeightMm;
    // small round "gem" in its traditional colour, before the line
    const r = GEMSTONE_BLOCK.iconMm / 2;
    const cc = pt(GEMSTONE_BLOCK.startXMm + r, rowYMm - 1.2, mode);
    page.drawCircle({ x: cc.x, y: cc.y, size: mm(r), color: rgb(color.r, color.g, color.b) });
    page.drawCircle({ x: cc.x, y: cc.y, size: mm(r), borderColor: rgb(0.25, 0.25, 0.25), borderWidth: 0.4 });
    const rud = g.rudraksha ? ` · रुद्राक्ष: ${g.rudraksha}` : "";
    const line = `रत्न: ${g.planet} — ${hi(STONE_HI, g.stone)} · ${weightHi(g.weight)} · ${hi(METAL_HI, g.metal)} · ${hi(FINGER_HI, g.finger)} · ${hi(DAY_HI, g.day)} · मंत्र: ${g.mantra}${rud}`;
    drawText(page, font, line, GEMSTONE_BLOCK.startXMm + GEMSTONE_BLOCK.iconMm + 2, rowYMm, mode, { size: GEMSTONE_BLOCK.fontSize, color });
  });

  // ---- notes (flows just below the gemstones) ----
  if (data.notes) {
    const notesTopMm = gemTopMm + data.gemRows.length * GEMSTONE_BLOCK.rowHeightMm + 3;
    const lines = wrapText(font, `टिप्पणी: ${data.notes}`, NOTES_FIELD.widthMm, NOTES_FIELD.fontSize);
    lines.forEach((line, i) => drawText(page, font, line, NOTES_FIELD.xMm, notesTopMm + i * NOTES_FIELD.lineHeightMm, mode, { size: NOTES_FIELD.fontSize }));
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
