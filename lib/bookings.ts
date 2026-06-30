import { promises as fs } from "fs";
import path from "path";
import { getMongoClient, getDbName, hasMongo } from "./mongodb";

/**
 * Bookings store. Kept separate from the public content collections because it
 * holds customer details (name/phone), so reads are admin-only. Uses MongoDB
 * when configured, otherwise a JSON file.
 */

export interface Booking {
  id: string;
  itemType: string; // consultation | report | course | pooja
  itemId: string;
  itemTitle: string;
  amount: string;
  slotId?: string;
  slotDate?: string;
  slotTime?: string;
  name: string;
  phone: string;
  email?: string;
  paid: boolean;
  /** How the customer chose to pay. "cash" only applies to offline consultations. */
  paymentMethod?: "cash" | "online";
  status: "new" | "completed" | "cancelled";
  createdAt: string;
}

type Doc = { _id: string; items: Booking[] };
const DOC_ID = "bookings";
const FILE = path.join(process.cwd(), "data", "bookings.json");

async function mongoColl() {
  const client = await getMongoClient();
  return client.db(getDbName()).collection<Doc>("content");
}

export async function readBookings(): Promise<Booking[]> {
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

async function writeBookings(items: Booking[]): Promise<void> {
  if (hasMongo()) {
    await (await mongoColl()).updateOne({ _id: DOC_ID }, { $set: { items } }, { upsert: true });
    return;
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(items, null, 2), "utf8");
}

export async function addBooking(b: Booking): Promise<void> {
  const all = await readBookings();
  await writeBookings([b, ...all]);
}

export async function setBookingStatus(id: string, status: Booking["status"]): Promise<Booking[]> {
  const all = await readBookings();
  const next = all.map((b) => (b.id === id ? { ...b, status } : b));
  await writeBookings(next);
  return next;
}

export async function deleteBooking(id: string): Promise<Booking[]> {
  const next = (await readBookings()).filter((b) => b.id !== id);
  await writeBookings(next);
  return next;
}
