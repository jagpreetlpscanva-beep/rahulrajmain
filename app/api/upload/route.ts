import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

/**
 * Authenticated file upload (images + videos).
 *
 * - On Vercel (BLOB_READ_WRITE_TOKEN set): stores the file in Vercel Blob and
 *   returns its public https URL. The filesystem is read-only on Vercel, so
 *   this is required for uploads to work in production.
 * - Locally (no token): saves to <project>/uploads and serves it back via
 *   /api/uploads/<name>.
 */

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
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}${ext}`;

  try {
    // Production / Vercel.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        // Public store → permanent public CDN URL (fastest, no server round-trip).
        const blob = await put(`uploads/${name}`, file, {
          access: "public",
          contentType: file.type || undefined,
        });
        return NextResponse.json({ ok: true, url: blob.url });
      } catch {
        // Private store → store privately, serve via our /api/uploads redirect.
        await put(`uploads/${name}`, file, {
          access: "private",
          contentType: file.type || undefined,
        });
        return NextResponse.json({ ok: true, url: `/api/uploads/${name}` });
      }
    }

    // On Vercel without a Blob store, the disk is read-only — fail clearly.
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
    const buf = Buffer.from(await file.arrayBuffer());
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), buf);
    return NextResponse.json({ ok: true, url: `/api/uploads/${name}` });
  } catch (err) {
    console.error("[upload] failed:", err);
    const msg = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      { error: `Storage error: ${msg}` },
      { status: 500 }
    );
  }
}
