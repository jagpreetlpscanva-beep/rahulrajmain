import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

/**
 * Authenticated file upload (images + videos).
 * Raster images are compressed/resized to a small WebP so they load fast
 * everywhere. SVGs and videos are stored unchanged.
 *
 * - On Vercel (BLOB_READ_WRITE_TOKEN set): stores in Vercel Blob (public CDN).
 * - Locally: saves to <project>/uploads, served via /api/uploads/<name>.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function POST(req: Request) {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 50 MB)" }, { status: 413 });
  }

  const ext = (path.extname(file.name) || "").toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 10);
  const base =
    file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9-_]+/gi, "-")
      .toLowerCase()
      .slice(0, 40) || "file";
  const baseName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}`;

  // Compress raster images → small WebP. Leave SVG/GIF/video untouched.
  let body: Buffer | File = file;
  let name = `${baseName}${ext}`;
  let contentType = file.type || "application/octet-stream";
  if (/^image\/(jpeg|jpg|png|webp|avif)$/.test(file.type)) {
    try {
      const input = Buffer.from(await file.arrayBuffer());
      body = await sharp(input)
        .rotate()
        .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      name = `${baseName}.webp`;
      contentType = "image/webp";
    } catch {
      body = file; // sharp failed — keep original
    }
  }

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`uploads/${name}`, body, { access: "public", contentType });
        return NextResponse.json({ ok: true, url: blob.url });
      } catch {
        await put(`uploads/${name}`, body, { access: "private", contentType });
        return NextResponse.json({ ok: true, url: `/api/uploads/${name}` });
      }
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "Blob storage is not connected. In Vercel: Storage → Create Database → Blob → Connect to this project, then redeploy.",
        },
        { status: 500 }
      );
    }

    // Local dev: write to disk
    const diskBuf = body instanceof Buffer ? body : Buffer.from(await file.arrayBuffer());
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), diskBuf);
    return NextResponse.json({ ok: true, url: `/api/uploads/${name}` });
  } catch (err) {
    console.error("[upload] failed:", err);
    const msg = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: `Storage error: ${msg}` }, { status: 500 });
  }
}
