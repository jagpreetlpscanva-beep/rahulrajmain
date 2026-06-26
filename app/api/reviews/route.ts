import { NextResponse } from "next/server";
import { readCollection, writeCollection } from "@/lib/contentRepo";
import { newId, type Review } from "@/lib/cms";

/** Public endpoint: visitors submit a review. It is stored as "pending" until
 * an admin approves it from the Reviews tab. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const text = String(body.text ?? "").trim();
  const rating = Math.max(1, Math.min(5, Math.round(Number(body.rating) || 0)));
  if (!name || !text || !rating) {
    return NextResponse.json({ error: "Name, rating and review are required" }, { status: 400 });
  }

  const initials =
    name
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";

  const review: Review = {
    id: newId("rev"),
    name: name.slice(0, 60),
    email: String(body.email ?? "").slice(0, 120) || undefined,
    rating,
    text: text.slice(0, 1000),
    initials,
    status: "pending",
    date: new Date().toISOString().slice(0, 10),
  };

  try {
    const existing = (await readCollection("reviews")) as Review[];
    await writeCollection("reviews", [review, ...existing]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[reviews] submit failed:", err);
    return NextResponse.json({ error: "Could not submit review" }, { status: 500 });
  }
}
