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

/* ---------------- read cache ----------------
   Every page render reads all 14 collections. Without a cache each request
   pays ~14 DB round-trips (measured ~1s warm), so navigating the site felt
   slow. We keep a short in-process cache: repeat reads within TTL are instant,
   and any admin write/reset for that key busts it immediately, so edits made
   on this instance show up right away and others appear within the TTL. */
const CACHE_TTL_MS = 30_000;
const cache = new Map<CollectionKey, { items: unknown[]; ts: number }>();

function cacheGet(key: CollectionKey): unknown[] | null {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL_MS) return hit.items;
  return null;
}
function cacheSet(key: CollectionKey, items: unknown[]) {
  cache.set(key, { items, ts: Date.now() });
}
function cacheBust(key: CollectionKey) {
  cache.delete(key);
}

/* ---------------- public API ---------------- */

export async function readCollection(key: CollectionKey): Promise<unknown[]> {
  const cached = cacheGet(key);
  if (cached) return cached;

  let items: unknown[];
  if (hasMongo()) {
    try {
      items = await mongoRead(key);
    } catch (err) {
      console.error("[cms] Mongo read failed, using defaults:", err);
      return [...COLLECTIONS[key]]; // don't cache a failure
    }
  } else {
    items = await fileRead(key);
  }
  cacheSet(key, items);
  return items;
}

export async function writeCollection(key: CollectionKey, items: unknown[]): Promise<void> {
  cacheBust(key);
  if (hasMongo()) await mongoWrite(key, items);
  else await fileWrite(key, items);
  cacheSet(key, items); // reflect the new value immediately on this instance
}

export async function resetCollection(key: CollectionKey): Promise<unknown[]> {
  cacheBust(key);
  const items = hasMongo() ? await mongoReset(key) : await fileReset(key);
  cacheSet(key, items);
  return items;
}

export function backend(): "mongodb" | "file" {
  return hasMongo() ? "mongodb" : "file";
}
