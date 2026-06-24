import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { head } from "@vercel/blob";

/**
 * Serves uploaded files saved by /api/upload (stored outside /public so they
 * survive on a running Node server). Supports HTTP range requests so uploaded
 * videos can stream/seek.
 */

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/x-m4v",
  ".pdf": "application/pdf",
};

export async function GET(req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  if (name.includes("/") || name.includes("..") || name.includes("\\")) {
    return new NextResponse("Bad request", { status: 400 });
  }

  const type = MIME[path.extname(name).toLowerCase()] || "application/octet-stream";

  // Production / Vercel: redirect to the blob's CDN URL (fast — browser loads
  // bytes directly from the CDN instead of streaming them through this function).
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const meta = await head(`uploads/${name}`);
      return NextResponse.redirect(meta.downloadUrl, 302);
    } catch {
      return new NextResponse("Not found", { status: 404 });
    }
  }

  const filePath = path.join(UPLOAD_DIR, name);

  let stat;
  try {
    stat = await fs.stat(filePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const range = req.headers.get("range");

  if (range) {
    const m = /bytes=(\d+)-(\d*)/.exec(range);
    if (m) {
      const start = Number(m[1]);
      const end = m[2] ? Number(m[2]) : stat.size - 1;
      if (start <= end && end < stat.size) {
        const size = end - start + 1;
        const fh = await fs.open(filePath, "r");
        try {
          const buf = Buffer.alloc(size);
          await fh.read(buf, 0, size, start);
          return new NextResponse(buf, {
            status: 206,
            headers: {
              "Content-Type": type,
              "Content-Length": String(size),
              "Content-Range": `bytes ${start}-${end}/${stat.size}`,
              "Accept-Ranges": "bytes",
            },
          });
        } finally {
          await fh.close();
        }
      }
    }
  }

  const data = await fs.readFile(filePath);
  return new NextResponse(data, {
    status: 200,
    headers: {
      "Content-Type": type,
      "Content-Length": String(stat.size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
