import { promises as fs } from "fs";
import path from "path";
import { getMongoClient, getDbName, hasMongo } from "./mongodb";

/**
 * Contact-form messages store. Holds visitor enquiries submitted from the
 * Contact page, so reads are admin-only. Uses MongoDB when configured,
 * otherwise a JSON file (mirrors the bookings store).
 */

export interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "new" | "read";
  createdAt: string;
}

type Doc = { _id: string; items: ContactMessage[] };
const DOC_ID = "messages";
const FILE = path.join(process.cwd(), "data", "messages.json");

async function mongoColl() {
  const client = await getMongoClient();
  return client.db(getDbName()).collection<Doc>("content");
}

export async function readMessages(): Promise<ContactMessage[]> {
  try {
    if (hasMongo()) {
      const doc = await (await mongoColl()).findOne({ _id: DOC_ID });
      return doc?.items ?? [];
    }
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeMessages(items: ContactMessage[]): Promise<void> {
  if (hasMongo()) {
    await (await mongoColl()).updateOne({ _id: DOC_ID }, { $set: { items } }, { upsert: true });
    return;
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(items, null, 2), "utf8");
}

export async function addMessage(m: ContactMessage): Promise<void> {
  const all = await readMessages();
  await writeMessages([m, ...all]);
}

export async function setMessageStatus(
  id: string,
  status: ContactMessage["status"]
): Promise<ContactMessage[]> {
  const all = await readMessages();
  const next = all.map((m) => (m.id === id ? { ...m, status } : m));
  await writeMessages(next);
  return next;
}

export async function deleteMessage(id: string): Promise<ContactMessage[]> {
  const next = (await readMessages()).filter((m) => m.id !== id);
  await writeMessages(next);
  return next;
}
