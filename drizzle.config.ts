import { defineConfig } from "drizzle-kit";

try {
  process.loadEnvFile(".env");
} catch {}

export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "file:storage/portfolio.db" },
});
