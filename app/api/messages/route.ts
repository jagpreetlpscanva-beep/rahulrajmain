import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import {
  readMessages,
  addMessage,
  setMessageStatus,
  deleteMessage,
  type ContactMessage,
} from "@/lib/messages";
import { newId } from "@/lib/cms";

export const dynamic = "force-dynamic";

async function isAuthed(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return verifyToken(token);
}

/** POST — public: submit a contact-form message. */
export async function POST(req: Request) {
  let body: Record<string, string> = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }

  const name = String(body.name || "").trim();
  const message = String(body.message || "").trim();
  if (!name || !message) {
    return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
  }

  const msg: ContactMessage = {
    id: newId("msg"),
    name,
    email: String(body.email || "").trim() || undefined,
    phone: String(body.phone || "").trim() || undefined,
    subject: String(body.subject || "").trim() || undefined,
    message,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  try {
    await addMessage(msg);
  } catch {
    return NextResponse.json({ error: "Could not send your message" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: msg.id });
}

/** GET — admin: list messages. */
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await readMessages());
}

/** PATCH — admin: mark a message read/new. */
export async function PATCH(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { id?: string; status?: ContactMessage["status"] } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }
  return NextResponse.json(await setMessageStatus(body.id, body.status));
}

/** DELETE — admin: remove a message. */
export async function DELETE(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { id?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  return NextResponse.json(await deleteMessage(body.id));
}
