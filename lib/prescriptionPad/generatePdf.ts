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
  REMEDY_TABLE,
  GEMSTONE_BLOCK,
  NOTES_FIELD,
  PLANET_COLORS,
  DEFAULT_TEXT_COLOR,
  MM_TO_PT,
  type PdfMode,
} from "./config";

const mm = (v: number) => v * MM_TO_PT;

export type PdfPlanet = { name: string; abbr: string; house: number; degree: number };
export type PdfRemedyRow = { planet: string; remedyLines: string[]; notes: string };
export type PdfGemRow = { planet: string; stone: string; weight: string; metal: string; finger: string; day: string; mantra: string };

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
  page.drawText(text, {
    x,
    y,
    size: opts.size ?? 9,
    font,
    color: rgb((opts.color ?? DEFAULT_TEXT_COLOR).r, (opts.color ?? DEFAULT_TEXT_COLOR).g, (opts.color ?? DEFAULT_TEXT_COLOR).b),
  });
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

  // ---- dasha / dosha / yog (values after the printed labels) ----
  drawText(page, font, data.mahadasha, DASHA_FIELDS.mahadasha.xMm, DASHA_FIELDS.mahadasha.yMm, mode, { size: DASHA_FIELDS.mahadasha.fontSize });
  drawText(page, font, data.antardasha, DASHA_FIELDS.antardasha.xMm, DASHA_FIELDS.antardasha.yMm, mode, { size: DASHA_FIELDS.antardasha.fontSize });
  drawText(page, font, data.pratyantar, DASHA_FIELDS.pratyantar.xMm, DASHA_FIELDS.pratyantar.yMm, mode, { size: DASHA_FIELDS.pratyantar.fontSize });
  drawText(page, font, data.dosha, DASHA_FIELDS.dosha.xMm, DASHA_FIELDS.dosha.yMm, mode, { size: DASHA_FIELDS.dosha.fontSize });
  drawText(page, font, data.yog, DASHA_FIELDS.yog.xMm, DASHA_FIELDS.yog.yMm, mode, { size: DASHA_FIELDS.yog.fontSize });

  // ---- remedies table (ग्रह | उपाय | टिप्पणी) ----
  const t = REMEDY_TABLE;
  if (data.remedyRows.length > 0) {
    const { x: hx, y: hyTop } = pt(t.startXMm, t.startYMm, mode);
    page.drawRectangle({
      x: hx,
      y: hyTop - mm(t.headerHeightMm),
      width: mm(t.widthMm),
      height: mm(t.headerHeightMm),
      color: rgb(t.headerFillColor.r, t.headerFillColor.g, t.headerFillColor.b),
    });
    const headerLabelYMm = t.startYMm + t.headerHeightMm - t.headerHeightMm / 2 - 1.5;
    drawText(page, font, "ग्रह", t.startXMm + t.columns.planet.offsetXMm + 2, headerLabelYMm, mode, { size: t.headerFontSize });
    drawText(page, font, "उपाय", t.startXMm + t.columns.remedy.offsetXMm + 2, headerLabelYMm, mode, { size: t.headerFontSize });
    drawText(page, font, "टिप्पणी", t.startXMm + t.columns.notes.offsetXMm + 2, headerLabelYMm, mode, { size: t.headerFontSize });

    let cursorYMm = t.startYMm + t.headerHeightMm + 4;
    for (const row of data.remedyRows) {
      const color = PLANET_COLORS[row.planet] ?? DEFAULT_TEXT_COLOR;
      const remedyLines = row.remedyLines.flatMap((line) => wrapText(font, `• ${line}`, t.columns.remedy.widthMm - 4, t.fontSize));
      const notesLines = wrapText(font, row.notes, t.columns.notes.widthMm - 4, t.fontSize);
      const rowLines = Math.max(1, remedyLines.length, notesLines.length);
      const rowHeightMm = Math.max(t.rowMinHeightMm, rowLines * t.lineHeightMm);

      drawText(page, font, row.planet, t.startXMm + t.columns.planet.offsetXMm + 2, cursorYMm, mode, { size: t.fontSize, color });
      remedyLines.forEach((line, i) =>
        drawText(page, font, line, t.startXMm + t.columns.remedy.offsetXMm + 2, cursorYMm + i * t.lineHeightMm, mode, { size: t.fontSize })
      );
      notesLines.forEach((line, i) =>
        drawText(page, font, line, t.startXMm + t.columns.notes.offsetXMm + 2, cursorYMm + i * t.lineHeightMm, mode, { size: t.fontSize })
      );
      cursorYMm += rowHeightMm;
    }
  }

  // ---- gemstones ----
  data.gemRows.forEach((g, i) => {
    const color = PLANET_COLORS[g.planet] ?? DEFAULT_TEXT_COLOR;
    const line = `रत्न: ${g.planet} — ${g.stone} · ${g.weight} · ${g.metal} · ${g.finger} · ${g.day} · मंत्र: ${g.mantra}`;
    drawText(page, font, line, GEMSTONE_BLOCK.startXMm, GEMSTONE_BLOCK.startYMm + i * GEMSTONE_BLOCK.rowHeightMm, mode, { size: GEMSTONE_BLOCK.fontSize, color });
  });

  // ---- notes ----
  if (data.notes) {
    const lines = wrapText(font, `टिप्पणी: ${data.notes}`, NOTES_FIELD.widthMm, NOTES_FIELD.fontSize);
    lines.forEach((line, i) => drawText(page, font, line, NOTES_FIELD.xMm, NOTES_FIELD.yMm + i * NOTES_FIELD.lineHeightMm, mode, { size: NOTES_FIELD.fontSize }));
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
