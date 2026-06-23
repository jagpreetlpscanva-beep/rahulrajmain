import { MongoClient } from "mongodb";

/**
 * Cached MongoDB client. The promise is stored on `globalThis` so it is reused
 * across hot-reloads in dev and across serverless invocations in production
 * (avoids exhausting connections). The client is only created when a
 * MONGODB_URI is configured — otherwise the app falls back to the file store.
 */

declare global {
  // eslint-disable-next-line no-var
  var _rrMongoClient: Promise<MongoClient> | undefined;
}

export function hasMongo(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export function getDbName(): string {
  return process.env.MONGODB_DB || "rahulraj";
}

export function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");
  if (!global._rrMongoClient) {
    // On some local machines, antivirus/firewall TLS inspection presents a
    // certificate Node can't verify ("unable to verify the first certificate").
    // Set MONGODB_TLS_INSECURE=true to relax verification for local dev only.
    const insecureTls = process.env.MONGODB_TLS_INSECURE === "true";
    global._rrMongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      ...(insecureTls ? { tls: true, tlsAllowInvalidCertificates: true } : {}),
    }).connect();
  }
  return global._rrMongoClient;
}
