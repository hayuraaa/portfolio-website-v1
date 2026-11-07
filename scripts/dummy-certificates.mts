/**
 * Fills the certificates table with placeholder entries so the page can be previewed.
 * Every dummy row has a credential ID starting with "DUMMY-" and an example.com link.
 *
 *   npm run dummy:certificates            add them (skips if already there)
 *   npm run dummy:certificates -- --remove   delete them again
 *
 * Remove them before going live.
 */
import { like } from "drizzle-orm";

try {
  process.loadEnvFile(".env");
} catch {
  // In Docker the environment comes from compose, not a file.
}

const { db } = await import("../src/db/index.ts");
const { runMigrations } = await import("../src/db/migrate.ts");
const { certificates } = await import("../src/db/schema.ts");
await runMigrations();

const isDummy = like(certificates.credentialId, "DUMMY-%");

if (process.argv.includes("--remove")) {
  const removed = await db.delete(certificates).where(isDummy).returning({ id: certificates.id });
  console.log(`Removed ${removed.length} dummy certificates.`);
  process.exit(0);
}

const existing = await db.select({ id: certificates.id }).from(certificates).where(isDummy).limit(1);
if (existing.length) {
  console.log("Dummy certificates are already there. Use --remove first to recreate them.");
  process.exit(0);
}

const rows = [
  { title: "TensorFlow Developer Certificate", issuer: "Google", kind: "Certification", issuedOn: "2025-03", expiresOn: "2028-03", skills: ["TensorFlow", "Deep Learning", "Python"] },
  { title: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", kind: "Certification", issuedOn: "2025-01", expiresOn: "2028-01", skills: ["AWS", "Cloud"] },
  { title: "Belajar Machine Learning untuk Pemula", issuer: "Dicoding Indonesia", kind: "Course", issuedOn: "2024-11", expiresOn: "2027-11", skills: ["Machine Learning", "Python"] },
  { title: "Menjadi Back-End Developer Expert", issuer: "Dicoding Indonesia", kind: "Course", issuedOn: "2024-08", expiresOn: "2027-08", skills: ["Node.js", "REST API", "Testing"] },
  { title: "Deep Learning Specialization", issuer: "DeepLearning.AI", kind: "Course", issuedOn: "2024-06", expiresOn: null, skills: ["Neural Networks", "CNN", "Sequence Models"] },
  { title: "Juara 2 Hackathon Data Kesehatan", issuer: "Contoh Penyelenggara Hackathon", kind: "Award", issuedOn: "2024-04", expiresOn: null, skills: ["Data Analysis", "Pitching"] },
  { title: "Google Data Analytics Professional Certificate", issuer: "Google", kind: "Course", issuedOn: "2023-09", expiresOn: null, skills: ["SQL", "Tableau", "R"] },
  { title: "Best Paper Award", issuer: "Contoh Konferensi Informatika", kind: "Award", issuedOn: "2023-07", expiresOn: null, skills: ["Research", "Computer Vision"] },
  { title: "Belajar Membuat Aplikasi Web dengan React", issuer: "Dicoding Indonesia", kind: "Course", issuedOn: "2023-03", expiresOn: "2026-03", skills: ["React", "JavaScript"] },
  { title: "Intro to Machine Learning", issuer: "Kaggle", kind: "Course", issuedOn: "2022-11", expiresOn: null, skills: ["scikit-learn", "Pandas"] },
  { title: "Oracle Database SQL Certified Associate", issuer: "Oracle", kind: "Certification", issuedOn: "2022-05", expiresOn: "2024-05", skills: ["SQL", "Oracle"] },
];

await db.insert(certificates).values(
  rows.map((r, i) => ({
    ...r,
    credentialId: `DUMMY-${String(i + 1).padStart(3, "0")}`,
    credentialUrl: "https://example.com/verify",
    image: null,
    isPublished: true,
  })),
);

console.log(`Added ${rows.length} dummy certificates.`);
process.exit(0);
