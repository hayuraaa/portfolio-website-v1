/**
 * Imports data from the v1 (Laravel) database into v2. Safe to re-run:
 * - the active profile (with avatar/CV if the files exist locally), only if v2 has no profile yet
 * - projects, skipping any whose slug already exists; images are left empty on purpose
 * - blog posts (HTML converted to Markdown), skipping existing slugs; status kept, images left empty
 *
 *   npm run db:seed
 */
import { copyFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

try {
  process.loadEnvFile(".env");
} catch {
  // In Docker the environment comes from compose, not a file.
}

const { db } = await import("../src/db/index.ts");
const { runMigrations } = await import("../src/db/migrate.ts");
await runMigrations();
const { posts, profiles, projects } = await import("../src/db/schema.ts");

const V1_STORAGE = path.resolve(process.env.V1_STORAGE_DIR ?? "");
const UPLOADS = path.resolve("storage/uploads");

async function exists(file: string) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

/** Copies a v1 upload into v2 storage. Returns the stored path, or null if the source is missing. */
async function copyUpload(relative: string | null) {
  if (!relative) return null;
  const from = path.join(V1_STORAGE, relative);
  if (!(await exists(from))) {
    console.warn(`  missing in v1 storage, skipped: ${relative}`);
    return null;
  }
  const to = path.join(UPLOADS, relative);
  await mkdir(path.dirname(to), { recursive: true });
  await copyFile(from, to);
  return relative;
}

const v1 = await mysql.createConnection(process.env.V1_DATABASE_URL!);
const [profileRows] = await v1.query<mysql.RowDataPacket[]>(
  "SELECT * FROM profiles WHERE is_active = 1 ORDER BY updated_at DESC LIMIT 1",
);
const [projectRows] = await v1.query<mysql.RowDataPacket[]>(
  "SELECT * FROM projects ORDER BY sort_order, completed_at DESC, id",
);
const [postRows] = await v1.query<mysql.RowDataPacket[]>("SELECT * FROM blogs ORDER BY published_at, id");
await v1.end();

// --- Profile -----------------------------------------------------------------

const [existingProfile] = await db.select({ id: profiles.id }).from(profiles).limit(1);
const source = profileRows[0];

if (existingProfile) {
  console.log("Profile: v2 already has one, skipped.");
} else if (!source) {
  console.log("Profile: no active profile in v1, skipped.");
} else {
  console.log(`Profile: importing "${source.name}" (v1 id ${source.id})`);
  await db.insert(profiles).values({
    // v1 stored the name with a trailing typo; the old homepage hardcoded the correct one.
    name: "Haris Yunanda",
    title: source.title,
    // v2 keeps one text; v1 had a separate, shorter bio as fallback.
    description: source.description || source.bio,
    email: source.email,
    phone: source.phone,
    location: source.location,
    avatar: await copyUpload(source.avatar),
    cvFile: await copyUpload(source.cv_file),
    githubUrl: source.github_url,
    linkedinUrl: source.linkedin_url,
    twitterUrl: source.twitter_url,
    instagramUrl: source.instagram_url,
    websiteUrl: source.website_url,
    isAvailable: true,
    isActive: true,
  });
}

// --- Projects ----------------------------------------------------------------

/** Re-joins lines that were hard-wrapped mid-sentence (text pasted from PDFs). */
function unwrap(text: string | null) {
  if (!text) return null;
  const lines = text.replace(/\r\n/g, "\n").split("\n").map((l) => l.trim()).filter(Boolean);
  const out: string[] = [];
  for (const line of lines) {
    const prev = out.at(-1);
    const endsSentence = prev !== undefined && (/[.!?:]$/.test(prev) || (/[%)]$/.test(prev) && /^[A-Z]/.test(line)));
    if (prev !== undefined && !endsSentence) out[out.length - 1] = `${prev} ${line}`;
    else out.push(line);
  }
  return out.join("\n") || null;
}

const TECH_FIXES: Record<string, string | null> = {
  PHPa: null, // typo in v1; that project has no PHP in it
  Pytroch: "PyTorch",
  "Jupiter Book": "Jupyter Notebook",
  "HTML 5": "HTML5",
  Github: "GitHub",
};

function cleanTech(raw: unknown) {
  const list: string[] = typeof raw === "string" ? JSON.parse(raw) : Array.isArray(raw) ? raw : [];
  return [...new Set(list.map((t) => (t in TECH_FIXES ? TECH_FIXES[t] : t.trim())).filter((t): t is string => !!t))];
}

/** v1 used the bare GitHub profile as a placeholder for projects without a public repo. */
function repoUrl(url: string | null) {
  if (!url || /^https?:\/\/github\.com\/[^/]+\/?$/.test(url)) return null;
  return url;
}

function month(date: Date | string | null) {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const existingSlugs = new Set((await db.select({ slug: projects.slug }).from(projects)).map((p) => p.slug));
let imported = 0;

for (const [index, row] of projectRows.entries()) {
  if (existingSlugs.has(row.slug)) continue;
  await db.insert(projects).values({
    slug: row.slug,
    title: row.title.trim(),
    category: ["Machine Learning", "Data Analysis"].includes(row.category) ? "AI & Data" : "Web Application",
    summary: unwrap(row.description) ?? "",
    details: unwrap(row.features),
    technologies: cleanTech(row.technologies),
    coverImage: null,
    gallery: [],
    demoUrl: row.demo_url || null,
    repoUrl: repoUrl(row.github_url),
    completedOn: month(row.completed_at),
    isFeatured: !!row.is_featured,
    isPublished: !!row.is_active,
    sortOrder: index + 1,
  });
  imported++;
}

console.log(`Projects: imported ${imported}, skipped ${projectRows.length - imported} existing.`);

// --- Blog posts --------------------------------------------------------------

/** v1 stored simple HTML (<p>, <h2>, <strong>); v2 stores Markdown. */
function htmlToMarkdown(html: string) {
  return html
    .replace(/\r\n/g, "\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n\n## ${t.trim()}\n\n`)
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, (_, _tag, t) => `**${t.trim()}**`)
    .replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, (_, _tag, t) => `*${t.trim()}*`)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => `\n\n${t.trim()}\n\n`)
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function day(date: Date | string | null) {
  const d = date ? new Date(date) : new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const existingPostSlugs = new Set((await db.select({ slug: posts.slug }).from(posts)).map((p) => p.slug));
let importedPosts = 0;

for (const row of postRows) {
  if (existingPostSlugs.has(row.slug)) continue;
  const content = htmlToMarkdown(row.content ?? "");
  const excerpt = (row.excerpt ?? "").trim();
  // Many v1 excerpts were just the opening lines; v2 derives those itself.
  const plainStart = content.replace(/[#*]/g, "").slice(0, 60);
  const keepExcerpt = excerpt && !plainStart.startsWith(excerpt.slice(0, 40));

  await db.insert(posts).values({
    slug: row.slug,
    title: row.title.trim(),
    category: row.category === "Personal" ? "Personal" : "Tech",
    excerpt: keepExcerpt ? excerpt : null,
    content,
    coverImage: null,
    tags: typeof row.tags === "string" ? JSON.parse(row.tags) : (row.tags ?? []),
    isPublished: row.status === "published",
    publishedOn: day(row.published_at),
  });
  importedPosts++;
}

console.log(`Posts: imported ${importedPosts}, skipped ${postRows.length - importedPosts} existing.`);
process.exit(0);
