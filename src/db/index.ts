import { mkdirSync } from "node:fs";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const DATABASE_URL = process.env.DATABASE_URL ?? "file:storage/portfolio.db";

function createDbClient() {
  if (DATABASE_URL.startsWith("file:")) {
    mkdirSync(path.dirname(path.resolve(DATABASE_URL.slice("file:".length))), { recursive: true });
  }
  const client = createClient({ url: DATABASE_URL });
  // WAL lets readers and the writer work at the same time; SQLite leaves FKs off unless asked.
  client.execute("PRAGMA journal_mode = WAL").catch(() => {});
  client.execute("PRAGMA foreign_keys = ON").catch(() => {});
  client.execute("PRAGMA busy_timeout = 5000").catch(() => {});
  return client;
}

const globalForDb = globalThis as unknown as { dbClient?: Client };

// Reuse the client across hot reloads in dev.
const client = globalForDb.dbClient ?? createDbClient();
if (process.env.NODE_ENV !== "production") globalForDb.dbClient = client;

export const db = drizzle(client, { schema });
