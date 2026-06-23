import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isCollectionKey } from "@/lib/cms";
import { readCollection, writeCollection, resetCollection } from "@/lib/contentRepo";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

async function isAuthed(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return verifyToken(token);
}

/**
 * Content API.
 *   GET    /api/content/:key  → current items (seed defaults if never edited)
 *   PUT    /api/content/:key  → replace items   (admin save)
 *   DELETE /api/content/:key  → reset to seed defaults
 *
 * Storage is MongoDB when MONGODB_URI is set, otherwise a local JSON file.
 * Both are handled by lib/contentRepo.
 */

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ key: string }> }) {
  const { key } = await ctx.params;
  if (!isCollectionKey(key)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }
  return NextResponse.json(await readCollection(key));
}

export async function PUT(req: Request, ctx: { params: Promise<{ key: string }> }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { key } = await ctx.params;
  if (!isCollectionKey(key)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Expected an array" }, { status: 400 });
  }
  try {
    await writeCollection(key, body);
  } catch (err) {
    console.error("[cms] save failed:", err);
    return NextResponse.json(
      { error: "Save failed", detail: (err as Error).message },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, count: body.length });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ key: string }> }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { key } = await ctx.params;
  if (!isCollectionKey(key)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }
  return NextResponse.json(await resetCollection(key));
}
