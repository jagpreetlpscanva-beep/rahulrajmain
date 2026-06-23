import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

/**
 * Authenticated file upload (images + videos). Saves to /public/uploads and
 * returns a public URL like /uploads/<name>. Works on a Node host with a
 * writable disk. For serverless hosting, swap the write below for a storage
 * bucket (S3 / Cloudinary) and return its URL — nothing else changes.
 */

export const dynamic = "force-dynamic";

const MAX_BYTES = 200 * 1024 * 1024; // 200 MB
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
    return NextResponse.json({ error: "File too large (max 200 MB)" }, { status: 413 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = (path.extname(file.name) || "").toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 10);
  const base =
    file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9-_]+/gi, "-")
      .toLowerCase()
      .slice(0, 40) || "file";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}${ext}`;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), buf);

  return NextResponse.json({ ok: true, url: `/api/uploads/${name}` });
}
