import { promises as fs } from "fs";
import path from "path";
import { COLLECTIONS, type CollectionKey } from "./cms";
import { getMongoClient, getDbName, hasMongo } from "./mongodb";

/**
 * Persistence for CMS collections. Uses MongoDB when MONGODB_URI is set,
 * otherwise a JSON file under <project>/data/. Both expose the same shape:
 * one ordered array of items per collection key.
 */

type ContentDoc = { _id: string; items: unknown[] };

const MONGO_COLLECTION = "content";
const DATA_DIR = path.join(process.cwd(), "data");

/* ---------------- MongoDB ---------------- */

async function mongoColl() {
  const client = await getMongoClient();
  return client.db(getDbName()).collection<ContentDoc>(MONGO_COLLECTION);
}

async function mongoRead(key: CollectionKey): Promise<unknown[]> {
  const doc = await (await mongoColl()).findOne({ _id: key });
  return doc?.items ?? [...COLLECTIONS[key]];
}

async function mongoWrite(key: CollectionKey, items: unknown[]): Promise<void> {
  await (await mongoColl()).updateOne({ _id: key }, { $set: { items } }, { upsert: true });
}

async function mongoReset(key: CollectionKey): Promise<unknown[]> {
  await (await mongoColl()).deleteOne({ _id: key });
  return [...COLLECTIONS[key]];
}

/* ---------------- JSON file fallback ---------------- */

async function fileRead(key: CollectionKey): Promise<unknown[]> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${key}.json`), "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* missing/invalid → defaults */
  }
  return [...COLLECTIONS[key]];
}

async function fileWrite(key: CollectionKey, items: unknown[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, `${key}.json`), JSON.stringify(items, null, 2), "utf8");
}

async function fileReset(key: CollectionKey): Promise<unknown[]> {
  try {
    await fs.unlink(path.join(DATA_DIR, `${key}.json`));
  } catch {
    /* already default */
  }
  return [...COLLECTIONS[key]];
}

/* ---------------- public API ---------------- */

export async function readCollection(key: CollectionKey): Promise<unknown[]> {
  if (hasMongo()) {
    try {
      return await mongoRead(key);
    } catch (err) {
      console.error("[cms] Mongo read failed, using defaults:", err);
      return [...COLLECTIONS[key]];
    }
  }
  return fileRead(key);
}

export async function writeCollection(key: CollectionKey, items: unknown[]): Promise<void> {
  if (hasMongo()) return mongoWrite(key, items);
  return fileWrite(key, items);
}

export async function resetCollection(key: CollectionKey): Promise<unknown[]> {
  if (hasMongo()) return mongoReset(key);
  return fileReset(key);
}

export function backend(): "mongodb" | "file" {
  return hasMongo() ? "mongodb" : "file";
}
