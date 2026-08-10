"use client";

// pdf-lib ships transpiled async code referencing global regeneratorRuntime.
import "regenerator-runtime/runtime";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

/**
 * Generic multi-page Hindi report PDF (reuses the same pdf-lib + Devanagari font
 * stack as the prescription pad). One document model → real, selectable-text PDF
 * with automatic pagination, embedded Kundali charts and remedy lists. Used by
 * both the Kundali Milan and Birth Child Kundali reports (single source of truth).
 */

const A4 = { w: 210, h: 297 };
const MM = 2.83464567;
const mm = (v: number) => v * MM;
const MARGIN = 14;
const MAROON = rgb(0.63, 0.08, 0.08);
const GOLD = rgb(0.75, 0.55, 0.12);
const INK = rgb(0.13, 0.13, 0.13);
const GREY = rgb(0.4, 0.4, 0.4);
const HEADER_FILL = rgb(0.98, 0.93, 0.82);

export type ReportBlock =
  | { type: "heading"; text: string }
  | { type: "kv"; rows: [string, string][]; cols?: number }
  | { type: "table"; cols: string[]; rows: string[][]; widths?: number[] }
  | { type: "image"; png: Uint8Array; widthMm: number; caption?: string; center?: boolean }
  | { type: "two-images"; a: { png: Uint8Array; caption: string }; b: { png: Uint8Array; caption: string }; widthMm: number }
  | { type: "list"; title?: string; items: string[] }
  | { type: "note"; text: string }
  | { type: "spacer"; mm: number };

export interface ReportDoc {
  brandTitle: string;    // clinic/astrologer header
  brandSub?: string;
  title: string;         // e.g. कुंडली मिलान
  blocks: ReportBlock[];
  footer?: string;
}

/** Rasterise an SVG data-URI chart to PNG bytes (pdf-lib can't embed SVG). */
export async function svgToPng(svgDataUri: string, size = 760): Promise<Uint8Array> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error("chart image load failed"));
    img.src = svgDataUri;
  });
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, 0, 0, size, size);
  const dataUrl = canvas.toDataURL("image/png");
  const b64 = dataUrl.split(",")[1];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function generateReportPdf(doc: ReportDoc): Promise<Blob> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const fontBytes = await fetch("/fonts/NotoSansDevanagari.ttf").then((r) => {
    if (!r.ok) throw new Error("font load failed");
    return r.arrayBuffer();
  });
  const font: PDFFont = await pdf.embedFont(fontBytes, { subset: true });

  let page = pdf.addPage([mm(A4.w), mm(A4.h)]);
  let y = A4.h - MARGIN; // top-down mm cursor

  const yTo = (topMm: number) => mm(A4.h - topMm); // top-mm -> pdf-lib bottom-up pt
  const contentW = A4.w - MARGIN * 2;

  const wrap = (text: string, maxWmm: number, size: number): string[] => {
    const words = String(text).split(/\s+/);
    const lines: string[] = []; let line = "";
    for (const w of words) {
      const t = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(t, size) / MM > maxWmm && line) { lines.push(line); line = w; }
      else line = t;
    }
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  };

  const drawText = (t: string, xMm: number, topMm: number, size: number, color = INK, bold = false) => {
    if (!t) return;
    const x = mm(xMm), yy = yTo(topMm);
    page.drawText(t, { x, y: yy, size, font, color });
    if (bold) page.drawText(t, { x: x + 0.3, y: yy, size, font, color });
  };

  const newPage = () => { page = pdf.addPage([mm(A4.w), mm(A4.h)]); y = A4.h - MARGIN; drawHeader(false); };
  const need = (h: number) => { if (y - h < MARGIN + 6) newPage(); };

  function drawHeader(first: boolean) {
    page.drawRectangle({ x: 0, y: yTo(MARGIN + 16), width: mm(A4.w), height: mm(16), color: HEADER_FILL });
    drawText(doc.brandTitle, MARGIN, MARGIN + 6, 13, MAROON, true);
    if (doc.brandSub) drawText(doc.brandSub, MARGIN, MARGIN + 11.5, 8, GREY);
    if (first) {
      drawText(doc.title, MARGIN, MARGIN + 24, 16, MAROON, true);
      y = MARGIN + 30;
    } else {
      y = MARGIN + 20;
    }
  }

  drawHeader(true);

  for (const b of doc.blocks) {
    if (b.type === "spacer") { y -= b.mm; continue; }

    if (b.type === "heading") {
      need(12);
      y += 2;
      drawText(b.text, MARGIN, y + 4.5, 12.5, MAROON, true);
      page.drawLine({ start: { x: mm(MARGIN), y: yTo(y + 6.5) }, end: { x: mm(A4.w - MARGIN), y: yTo(y + 6.5) }, thickness: 0.6, color: GOLD });
      y += 9;
      continue;
    }

    if (b.type === "note") {
      const lines = wrap(b.text, contentW, 8);
      need(lines.length * 4.2 + 2);
      lines.forEach((l) => { drawText(l, MARGIN, y + 3.2, 8, GREY); y += 4.2; });
      y += 1;
      continue;
    }

    if (b.type === "kv") {
      const cols = b.cols ?? 2;
      const colW = contentW / cols;
      for (let i = 0; i < b.rows.length; i += cols) {
        need(6.5);
        for (let c = 0; c < cols; c++) {
          const row = b.rows[i + c];
          if (!row) continue;
          const x = MARGIN + c * colW;
          drawText(row[0] + ":", x, y + 4, 8.5, MAROON, true);
          const lblW = font.widthOfTextAtSize(row[0] + ": ", 8.5) / MM;
          drawText(row[1], x + lblW + 1, y + 4, 8.5, INK);
        }
        y += 6.2;
      }
      y += 1;
      continue;
    }

    if (b.type === "table") {
      const n = b.cols.length;
      const widths = b.widths ?? b.cols.map(() => contentW / n);
      const rowH = 6.6, headH = 7;
      // header
      need(headH + rowH);
      let x = MARGIN;
      b.cols.forEach((c, i) => {
        page.drawRectangle({ x: mm(x), y: yTo(y + headH), width: mm(widths[i]), height: mm(headH), color: HEADER_FILL, borderColor: GOLD, borderWidth: 0.5 });
        drawText(c, x + 1.5, y + headH - 1.8, 8, MAROON, true);
        x += widths[i];
      });
      y += headH;
      // rows
      for (const r of b.rows) {
        need(rowH);
        x = MARGIN;
        r.forEach((cell, i) => {
          page.drawRectangle({ x: mm(x), y: yTo(y + rowH), width: mm(widths[i]), height: mm(rowH), borderColor: rgb(0.8, 0.75, 0.6), borderWidth: 0.4 });
          const fit = wrap(cell, widths[i] - 2, 8)[0];
          drawText(fit, x + 1.5, y + rowH - 1.8, 8, INK);
          x += widths[i];
        });
        y += rowH;
      }
      y += 2;
      continue;
    }

    if (b.type === "list") {
      if (b.title) { need(7); drawText(b.title, MARGIN, y + 4, 10, MAROON, true); y += 6; }
      b.items.forEach((it, idx) => {
        const lines = wrap(`${idx + 1}. ${it}`, contentW - 4, 9);
        need(lines.length * 4.6);
        lines.forEach((l, li) => { drawText(l, MARGIN + (li ? 4 : 0), y + 3.4, 9, INK); y += 4.6; });
      });
      y += 1;
      continue;
    }

    if (b.type === "image") {
      const embed = await pdf.embedPng(b.png);
      const wMm = b.widthMm, hMm = (embed.height / embed.width) * wMm;
      need(hMm + (b.caption ? 6 : 2));
      if (b.caption) { drawText(b.caption, MARGIN, y + 3.5, 9, MAROON, true); y += 5; }
      const x = b.center ? (A4.w - wMm) / 2 : MARGIN;
      page.drawImage(embed, { x: mm(x), y: yTo(y + hMm), width: mm(wMm), height: mm(hMm) });
      y += hMm + 3;
      continue;
    }

    if (b.type === "two-images") {
      const ea = await pdf.embedPng(b.a.png);
      const eb = await pdf.embedPng(b.b.png);
      const wMm = b.widthMm;
      const hMm = (ea.height / ea.width) * wMm;
      const gap = contentW - wMm * 2;
      need(hMm + 7);
      drawText(b.a.caption, MARGIN, y + 3.5, 9, MAROON, true);
      drawText(b.b.caption, MARGIN + wMm + gap, y + 3.5, 9, MAROON, true);
      y += 5;
      page.drawImage(ea, { x: mm(MARGIN), y: yTo(y + hMm), width: mm(wMm), height: mm(hMm) });
      page.drawImage(eb, { x: mm(MARGIN + wMm + gap), y: yTo(y + hMm), width: mm(wMm), height: mm(hMm) });
      y += hMm + 3;
      continue;
    }
  }

  // footer on every page
  const total = pdf.getPageCount();
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    const foot = doc.footer || "";
    p.drawText(foot, { x: mm(MARGIN), y: mm(8), size: 7.5, font, color: GREY });
    const pn = `पृष्ठ ${i + 1} / ${total}`;
    const pw = font.widthOfTextAtSize(pn, 7.5) / MM;
    p.drawText(pn, { x: mm(A4.w - MARGIN - pw), y: mm(8), size: 7.5, font, color: GREY });
  });

  const bytes = await pdf.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

/** Download / open / share helpers (reused across reports). */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Share a PDF via the Web Share API when supported; else download. Returns how it was handled. */
export async function shareOrDownloadPdf(blob: Blob, filename: string): Promise<"shared" | "downloaded" | "cancelled"> {
  const file = new File([blob], filename, { type: "application/pdf" });
  const navAny = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
  if (typeof navigator !== "undefined" && navAny.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] } as ShareData);
      return "shared";
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return "cancelled";
      // fall through to download
    }
  }
  downloadBlob(blob, filename);
  return "downloaded";
}
