/**
 * Writes a clean copy of the local database for uploading to the server:
 * one self-contained file (no -wal/-shm), without dummy certificates or login sessions.
 * The local database itself is not changed.
 *
 *   npm run db:export          -> deploy-export/portfolio.db
 */
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@libsql/client";

try {
  process.loadEnvFile(".env");
} catch {}

const source = process.env.DATABASE_URL ?? "file:storage/portfolio.db";
const target = path.resolve("deploy-export/portfolio.db");

await mkdir(path.dirname(target), { recursive: true });
await rm(target, { force: true });

// VACUUM INTO makes a consistent snapshot even while the dev server is running.
const local = createClient({ url: source });
await local.execute({ sql: "VACUUM INTO ?", args: [target] });
local.close();

const copy = createClient({ url: `file:${target}` });
const dummies = await copy.execute("DELETE FROM certificates WHERE credential_id LIKE 'DUMMY-%'");
const sessions = await copy.execute("DELETE FROM sessions");
await copy.execute("VACUUM");
const counts = await copy.execute(`
  SELECT (SELECT count(*) FROM profiles) profiles, (SELECT count(*) FROM users) users,
         (SELECT count(*) FROM projects) projects, (SELECT count(*) FROM certificates) certificates,
         (SELECT count(*) FROM posts) posts, (SELECT count(*) FROM messages) messages`);
copy.close();

console.log(`Wrote ${path.relative(process.cwd(), target)}`);
console.log(`Removed ${dummies.rowsAffected} dummy certificates and ${sessions.rowsAffected} sessions from the copy.`);
console.log("Contents:", counts.rows[0]);
