import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Timestamps are unix seconds; Drizzle hands them back as Date.
const createdAt = () =>
  integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`);
const updatedAt = () =>
  integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date());

export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  // Paths relative to storage/uploads, e.g. "avatars/abc.jpg"
  avatar: text("avatar"),
  cvFile: text("cv_file"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  instagramUrl: text("instagram_url"),
  websiteUrl: text("website_url"),
  isAvailable: integer("is_available", { mode: "boolean" }).notNull().default(true),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export type Profile = typeof profiles.$inferSelect;

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export type User = typeof users.$inferSelect;

export const sessions = sqliteTable(
  "sessions",
  {
    // sha256 of the cookie token, so a leaked table can't be replayed.
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("sessions_user_id_idx").on(t.userId)],
);

export const projects = sqliteTable(
  "projects",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    /** One or two sentences for the card. */
    summary: text("summary").notNull(),
    /** Longer write-up for the detail view; paragraphs separated by newlines. */
    details: text("details"),
    technologies: text("technologies", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
    // Paths relative to storage/uploads.
    coverImage: text("cover_image"),
    gallery: text("gallery", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
    demoUrl: text("demo_url"),
    repoUrl: text("repo_url"),
    /** Paper, journal article or DOI. */
    publicationUrl: text("publication_url"),
    /** "YYYY-MM" */
    completedOn: text("completed_on"),
    isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
    isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("projects_listing_idx").on(t.isPublished, t.sortOrder)],
);

export type Project = typeof projects.$inferSelect;

export const certificates = sqliteTable(
  "certificates",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    issuer: text("issuer").notNull(),
    /** One of CERTIFICATE_KINDS. */
    kind: text("kind").notNull(),
    /** "YYYY-MM" */
    issuedOn: text("issued_on").notNull(),
    expiresOn: text("expires_on"),
    credentialId: text("credential_id"),
    credentialUrl: text("credential_url"),
    // Path relative to storage/uploads.
    image: text("image"),
    skills: text("skills", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
    isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("certificates_listing_idx").on(t.isPublished, t.issuedOn)],
);

export type Certificate = typeof certificates.$inferSelect;

export const posts = sqliteTable(
  "posts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    /** One of BLOG_CATEGORIES. */
    category: text("category").notNull(),
    /** Short lead for lists and meta description; generated from content when empty. */
    excerpt: text("excerpt"),
    /** Markdown. */
    content: text("content").notNull(),
    // Path relative to storage/uploads.
    coverImage: text("cover_image"),
    tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
    isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
    /** "YYYY-MM-DD"; shown as the post date. */
    publishedOn: text("published_on").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("posts_listing_idx").on(t.isPublished, t.publishedOn)],
);

export type Post = typeof posts.$inferSelect;

export const messages = sqliteTable(
  "messages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject"),
    body: text("body").notNull(),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [index("messages_inbox_idx").on(t.isRead, t.createdAt)],
);

export type Message = typeof messages.$inferSelect;
