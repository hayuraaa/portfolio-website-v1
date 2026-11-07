/**
 * Applies pending migrations and exits. The Docker image runs this before the server
 * starts, so no request can ever hit a table that doesn't exist yet.
 */
try {
  process.loadEnvFile(".env");
} catch {
  // In Docker the environment comes from compose, not a file.
}

const { runMigrations } = await import("../src/db/migrate.ts");
await runMigrations();
console.log("Database is up to date.");
process.exit(0);
