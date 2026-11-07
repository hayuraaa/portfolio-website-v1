import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { requireUser } from "@/lib/session";
import { toFormData } from "../form-data";
import { PostForm } from "../post-form";

export const instant = false;

export const metadata: Metadata = { title: "Tulisan baru" };

export default async function NewPostPage() {
  await requireUser();
  await connection();
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" });

  return (
    <div className="max-w-4xl pb-28">
      <Link href="/admin/blog" className="text-sm text-ink-soft hover:text-ink">
        ← Semua tulisan
      </Link>
      <h1 className="mt-3 mb-8 font-serif text-4xl font-medium tracking-tight">Tulisan baru</h1>
      <PostForm initial={toFormData(null, today)} />
    </div>
  );
}
