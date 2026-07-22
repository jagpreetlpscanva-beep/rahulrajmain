"use client";

// pdf-lib / @pdf-lib/fontkit ship transpiled async code that references the
// global `regeneratorRuntime`; importing this polyfill defines it and fixes
// the "regeneratorRuntime is not defined" crash during PDF generation.
import "regenerator-runtime/runtime";

/**
 * Prescription Pad PDF generator.
 *
 * - "digital" mode: full pad artwork (background) + all dynamic fields.
 *   Used for Save / WhatsApp / Email share.
 * - "print" mode: NO background — only the dynamic fields, positioned with
 *   the exact same coordinates (+ CALIBRATION offset) so the sheet lines up
 *   on a pre-printed physical pad.
 *
 * Page is emitted at the exact PAGE.widthMm x PAGE.heightMm size with no
 * scaling — the browser/PDF viewer should print this at "Actual size / 100%".
 *
 * All positions/colors/sizes come from ./config.ts — nothing here should be
 * a hardcoded coordinate.
 */

import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import {
  PAGE,
  CALIBRATION,
  HEADER_FIELDS,
  KUNDALI_BOX,
  DASHA_FIELDS,
  PLANET_TABLE,
  REMEDY_TABLE,
  GEMSTONE_BLOCK,
  NOTES_FIELD,
  PLANET_COLORS,
  DEFAULT_TEXT_COLOR,
  MM_TO_PT,
  type PdfMode,
} from "./config";

const mm = (v: number) => v * MM_TO_PT;

export type PdfPlanetRow = { name: string; sign: string; degree: string; house: string | number; nakshatra: string };
export type PdfRemedyRow = { planet: string; remedyLines: string[]; notes: string };
export type PdfGemRow = { planet: string; stone: string; weight: string; metal: string; finger: string; day: string; mantra: string };

export interface PrescriptionPdfData {
  patientName: string;
  mobile: string;
  gender: string;
  dob: string; // already formatted DD/MM/YYYY
  tob: string;
  place: string;
  date: string; // already formatted DD/MM/YYYY
  astrologer: string;
  mahadasha: string;
  antardasha: string;
  pratyantar: string;
  dosha: string;
  yog: string;
  /** Chart image as a PNG/JPEG data URI (SVG must be rasterized before calling this). */
  chartImageDataUri: string | null;
  planets: PdfPlanetRow[];
  remedyRows: PdfRemedyRow[];
  gemRows: PdfGemRow[];
  notes: string;
}

/** Rasterize an SVG data-uri (e.g. the kundali chart) to a PNG data-uri via canvas.
 *  Must run in the browser. `targetPx` controls output resolution (kept high for print). */
export async function rasterizeSvgDataUri(svgDataUri: string, targetPx = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetPx;
      canvas.height = targetPx;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no 2d context"));
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetPx, targetPx);
      ctx.drawImage(img, 0, 0, targetPx, targetPx);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = svgDataUri;
  });
}

function dataUriToBytes(dataUri: string): Uint8Array {
  const base64 = dataUri.split(",")[1] ?? "";
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/** Apply calibration offset (print mode only) and flip to pdf-lib's bottom-left origin. */
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

/** Wrap `text` to fit `maxWidthMm` at `size`, returning one string per line. */
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

  // StandardFonts (Helvetica) can only encode Latin text — every Hindi/Devanagari
  // character (patient name, remedies, notes, etc.) would throw inside pdf-lib and
  // silently abort PDF generation. Embed a real Devanagari-capable font instead.
  let font: PDFFont;
  try {
    const fontBytes = await fetch("/fonts/NotoSansDevanagari.ttf").then((r) => {
      if (!r.ok) throw new Error("font fetch failed");
      return r.arrayBuffer();
    });
    font = await doc.embedFont(fontBytes, { subset: true });
  } catch (err) {
    throw new Error(
      "Devanagari font (/fonts/NotoSansDevanagari.ttf) load nahi ho paya — public/fonts/ me file rakhi hai ya nahi check karein. " +
        String(err)
    );
  }
  const fontBold = font; // single variable-font instance covers both; distinct bold weight not required for legibility

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
      // background missing/unavailable — continue without it rather than failing the PDF
    }
  }

  // ---- header fields ----
  drawText(page, font, data.patientName, HEADER_FIELDS.patientName.xMm, HEADER_FIELDS.patientName.yMm, mode, { size: HEADER_FIELDS.patientName.fontSize });
  drawText(page, font, data.mobile, HEADER_FIELDS.mobile.xMm, HEADER_FIELDS.mobile.yMm, mode, { size: HEADER_FIELDS.mobile.fontSize });
  drawText(page, font, data.gender, HEADER_FIELDS.gender.xMm, HEADER_FIELDS.gender.yMm, mode, { size: HEADER_FIELDS.gender.fontSize });
  drawText(page, font, data.dob, HEADER_FIELDS.dob.xMm, HEADER_FIELDS.dob.yMm, mode, { size: HEADER_FIELDS.dob.fontSize });
  drawText(page, font, data.tob, HEADER_FIELDS.tob.xMm, HEADER_FIELDS.tob.yMm, mode, { size: HEADER_FIELDS.tob.fontSize });
  drawText(page, font, data.place, HEADER_FIELDS.place.xMm, HEADER_FIELDS.place.yMm, mode, { size: HEADER_FIELDS.place.fontSize });
  drawText(page, font, data.date, HEADER_FIELDS.date.xMm, HEADER_FIELDS.date.yMm, mode, { size: HEADER_FIELDS.date.fontSize });
  drawText(page, font, data.astrologer, HEADER_FIELDS.astrologer.xMm, HEADER_FIELDS.astrologer.yMm, mode, { size: HEADER_FIELDS.astrologer.fontSize });

  // ---- kundali chart, clipped/scaled to stay inside the printed box ----
  if (data.chartImageDataUri) {
    try {
      const bytes = dataUriToBytes(data.chartImageDataUri);
      const img = data.chartImageDataUri.startsWith("data:image/png") ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
      const boxWPt = mm(KUNDALI_BOX.widthMm);
      const boxHPt = mm(KUNDALI_BOX.heightMm);
      const scale = Math.min(boxWPt / img.width, boxHPt / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      // center inside the box
      const innerXMm = KUNDALI_BOX.xMm + (KUNDALI_BOX.widthMm - drawW / MM_TO_PT) / 2;
      const innerYMm = KUNDALI_BOX.yMm + (KUNDALI_BOX.heightMm - drawH / MM_TO_PT) / 2;
      const { x, y } = pt(innerXMm, innerYMm + drawH / MM_TO_PT, mode); // pt() anchors from top of the drawn image
      page.drawImage(img, { x, y: y, width: drawW, height: drawH });
    } catch {
      // if rasterization failed upstream, silently skip the chart rather than failing the whole PDF
    }
  }

  // ---- dasha / dosha / yog ----
  drawText(page, font, data.mahadasha, DASHA_FIELDS.mahadasha.xMm, DASHA_FIELDS.mahadasha.yMm, mode, { size: DASHA_FIELDS.mahadasha.fontSize });
  drawText(page, font, data.antardasha, DASHA_FIELDS.antardasha.xMm, DASHA_FIELDS.antardasha.yMm, mode, { size: DASHA_FIELDS.antardasha.fontSize });
  drawText(page, font, data.pratyantar, DASHA_FIELDS.pratyantar.xMm, DASHA_FIELDS.pratyantar.yMm, mode, { size: DASHA_FIELDS.pratyantar.fontSize });
  drawText(page, font, data.dosha, DASHA_FIELDS.dosha.xMm, DASHA_FIELDS.dosha.yMm, mode, { size: DASHA_FIELDS.dosha.fontSize });
  drawText(page, font, data.yog, DASHA_FIELDS.yog.xMm, DASHA_FIELDS.yog.yMm, mode, { size: DASHA_FIELDS.yog.fontSize });

  // ---- planet position table ----
  data.planets.forEach((p, i) => {
    const rowYMm = PLANET_TABLE.startYMm + i * PLANET_TABLE.rowHeightMm;
    const color = PLANET_COLORS[p.name] ?? DEFAULT_TEXT_COLOR;
    drawText(page, fontBold, p.name, PLANET_TABLE.startXMm + PLANET_TABLE.columns.planet.offsetXMm, rowYMm, mode, { size: PLANET_TABLE.fontSize, color });
    drawText(page, font, p.sign, PLANET_TABLE.startXMm + PLANET_TABLE.columns.sign.offsetXMm, rowYMm, mode, { size: PLANET_TABLE.fontSize });
    drawText(page, font, p.degree, PLANET_TABLE.startXMm + PLANET_TABLE.columns.degree.offsetXMm, rowYMm, mode, { size: PLANET_TABLE.fontSize });
    drawText(page, font, String(p.house), PLANET_TABLE.startXMm + PLANET_TABLE.columns.house.offsetXMm, rowYMm, mode, { size: PLANET_TABLE.fontSize });
    drawText(page, font, p.nakshatra, PLANET_TABLE.startXMm + PLANET_TABLE.columns.nakshatra.offsetXMm, rowYMm, mode, { size: PLANET_TABLE.fontSize });
  });

  // ---- remedies table (Grah | Upay | Tippani), light-yellow header ----
  if (data.remedyRows.length > 0) {
    const t = REMEDY_TABLE;
    // header background
    const { x: hx, y: hyTop } = pt(t.startXMm, t.startYMm, mode);
    page.drawRectangle({
      x: hx,
      y: hyTop - mm(t.headerHeightMm),
      width: mm(t.widthMm),
      height: mm(t.headerHeightMm),
      color: rgb(t.headerFillColor.r, t.headerFillColor.g, t.headerFillColor.b),
    });
    const headerLabelYMm = t.startYMm + t.headerHeightMm - t.headerHeightMm / 2 - 1.6;
    drawText(page, fontBold, "ग्रह", t.startXMm + t.columns.planet.offsetXMm + 2, headerLabelYMm, mode, { size: t.headerFontSize });
    drawText(page, fontBold, "उपाय", t.startXMm + t.columns.remedy.offsetXMm + 2, headerLabelYMm, mode, { size: t.headerFontSize });
    drawText(page, fontBold, "टिप्पणी", t.startXMm + t.columns.notes.offsetXMm + 2, headerLabelYMm, mode, { size: t.headerFontSize });

    let cursorYMm = t.startYMm + t.headerHeightMm + 4;
    for (const row of data.remedyRows) {
      const color = PLANET_COLORS[row.planet] ?? DEFAULT_TEXT_COLOR;
      const remedyLines = row.remedyLines.flatMap((line) => wrapText(font, `• ${line}`, t.columns.remedy.widthMm - 4, t.fontSize));
      const notesLines = wrapText(font, row.notes, t.columns.notes.widthMm - 4, t.fontSize);
      const rowLines = Math.max(1, remedyLines.length, notesLines.length);
      const rowHeightMm = Math.max(t.rowMinHeightMm, rowLines * t.lineHeightMm);

      drawText(page, fontBold, row.planet, t.startXMm + t.columns.planet.offsetXMm + 2, cursorYMm, mode, { size: t.fontSize, color });
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
    const rowYMm = GEMSTONE_BLOCK.startYMm + i * GEMSTONE_BLOCK.rowHeightMm;
    const color = PLANET_COLORS[g.planet] ?? DEFAULT_TEXT_COLOR;
    const line = `${g.planet} — ${g.stone} · ${g.weight} · ${g.metal} · ${g.finger} · ${g.day} · मंत्र: ${g.mantra}`;
    drawText(page, font, line, GEMSTONE_BLOCK.startXMm, rowYMm, mode, { size: GEMSTONE_BLOCK.fontSize, color });
  });

  // ---- notes ----
  if (data.notes) {
    const lines = wrapText(font, data.notes, NOTES_FIELD.widthMm, NOTES_FIELD.fontSize);
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

/** Open a generated PDF blob in a new tab (for on-screen "actual size" print preview). */
export function openPdfInNewTab(blob: Blob) {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}
