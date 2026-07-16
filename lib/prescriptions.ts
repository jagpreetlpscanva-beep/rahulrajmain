import { promises as fs } from "fs";
import path from "path";
import { getMongoClient, getDbName, hasMongo } from "./mongodb";

/**
 * Prescription consultations store. Holds patient details + generated Kundali +
 * selected remedies + gemstone for each visit. One patient (mobile) can have
 * unlimited consultations; old ones are never overwritten (append-only).
 * MongoDB when configured, else a JSON file (same pattern as bookings).
 */

export interface RemedyRow {
  planet: string;
  problem: string;
  remedies: string[];
  notes: string;
}

export interface GemstonePick {
  planet: string;
  stone: string;
  weight: string;
  metal: string;
  finger: string;
  day: string;
  mantra: string;
}

export interface Consultation {
  id: string;
  patientName: string;
  mobile: string;
  gender: string;
  dob: string;
  tob: string;
  place: string;
  astrologer: string;
  // Panchang / dasha lines from the pad (right column)
  mahadasha: string;
  antardasha: string;
  pratyantar: string;
  dosha: string;
  yog: string;
  kundali: unknown; // full computeKundli() JSON — lagna + every planet's house
  rows: RemedyRow[];
  gemstone: GemstonePick | null;
  notes: string;
  createdAt: string;
}

type Doc = { _id: string; items: Consultation[] };
const DOC_ID = "consultations";
const FILE = path.join(process.cwd(), "data", "consultations.json");

async function mongoColl() {
  const client = await getMongoClient();
  return client.db(getDbName()).collection<Doc>("content");
}

export async function readConsultations(): Promise<Consultation[]> {
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

async function writeConsultations(items: Consultation[]): Promise<void> {
  if (hasMongo()) {
    await (await mongoColl()).updateOne({ _id: DOC_ID }, { $set: { items } }, { upsert: true });
    return;
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(items, null, 2), "utf8");
}

export async function addConsultation(c: Consultation): Promise<void> {
  const all = await readConsultations();
  await writeConsultations([c, ...all]); // newest first, never overwrite
}

export async function consultationsByMobile(mobile: string): Promise<Consultation[]> {
  const digits = mobile.replace(/\D/g, "").slice(-10);
  if (!digits) return [];
  return (await readConsultations()).filter((c) => c.mobile.replace(/\D/g, "").slice(-10) === digits);
}

export async function getConsultation(id: string): Promise<Consultation | null> {
  return (await readConsultations()).find((c) => c.id === id) ?? null;
}
