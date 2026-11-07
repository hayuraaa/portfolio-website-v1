import path from "node:path";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from ".";

/** Applies any pending SQL files in drizzle/. Safe to run on every start. */
export async function runMigrations() {
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
}
