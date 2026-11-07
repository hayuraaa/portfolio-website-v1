/**
 * Creates an admin account, or resets the password if the email already exists.
 *
 *   npm run admin:create
 *
 * Prompts for name, email, and password. For non-interactive use set
 * ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD instead.
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { eq } from "drizzle-orm";

try {
  process.loadEnvFile(".env");
} catch {
  // In Docker the environment comes from compose, not a file.
}

const { db } = await import("../src/db/index.ts");
const { runMigrations } = await import("../src/db/migrate.ts");
await runMigrations();
const { users, sessions } = await import("../src/db/schema.ts");
const { hashPassword } = await import("../src/lib/password.ts");

const rl = createInterface({ input: stdin, output: stdout });

/** Ctrl+C while a question is open: leave quietly instead of dumping a stack trace. */
async function ask(question: string) {
  try {
    return await rl.question(question);
  } catch {
    stdout.write("\nDibatalkan.\n");
    process.exit(130);
  }
}

/** Reads a line without echoing it. Needs a real terminal (stdin in raw mode). */
function askHidden(question: string) {
  return new Promise<string>((resolve) => {
    let input = "";
    stdout.write(question);
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    stdin.resume();

    const done = () => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write("\n");
    };

    const onData = (chunk: string) => {
      for (const ch of chunk) {
        if (ch === "\r" || ch === "\n") {
          done();
          return resolve(input);
        }
        if (ch === "\u0003") {
          done();
          stdout.write("Dibatalkan.\n");
          process.exit(130);
        }
        if (ch === "\u007f" || ch === "\b") {
          input = input.slice(0, -1);
        } else if (ch >= " ") {
          input += ch;
        }
      }
    };

    stdin.on("data", onData);
  });
}

const email = (process.env.ADMIN_EMAIL ?? (await ask("Email: "))).trim().toLowerCase();
const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
if (existing) console.log(`Akun ${email} sudah ada; password-nya akan diganti.`);

const name =
  process.env.ADMIN_NAME ?? (existing ? existing.name : (await ask("Nama: ")).trim() || "Admin");

// readline must let go of stdin before we switch it to raw mode.
rl.close();

let password = process.env.ADMIN_PASSWORD;
if (!password) {
  if (!stdin.isTTY) {
    console.error("Tidak ada terminal untuk mengetik password. Set ADMIN_PASSWORD, atau jalankan langsung di terminal.");
    process.exit(1);
  }
  password = await askHidden("Password (min. 10 karakter, tidak tampil saat diketik): ");
  const again = await askHidden("Ulangi password: ");
  if (password !== again) {
    console.error("Password tidak sama.");
    process.exit(1);
  }
}

if (!email.includes("@") || password.length < 10) {
  console.error("Email harus valid dan password minimal 10 karakter.");
  process.exit(1);
}

const passwordHash = await hashPassword(password);

if (existing) {
  await db.update(users).set({ name, passwordHash }).where(eq(users.id, existing.id));
  // A password reset signs out every open session.
  await db.delete(sessions).where(eq(sessions.userId, existing.id));
  console.log(`Password untuk ${email} diperbarui.`);
} else {
  await db.insert(users).values({ name, email, passwordHash });
  console.log(`Akun admin ${email} dibuat.`);
}

process.exit(0);
