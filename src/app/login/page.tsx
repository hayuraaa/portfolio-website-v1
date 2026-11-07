import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Masuk",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-5 py-16">
      <div aria-hidden className="paper-grid pointer-events-none absolute inset-0" />
      <ThemeToggle className="btn-secondary absolute top-5 right-5 px-2.5! py-2!" />

      <main className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs tracking-wide text-ink-faint uppercase">Admin</p>
          <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">Masuk dulu</h1>
          <p className="mt-2 text-sm text-ink-soft">Untuk mengubah isi portofolio.</p>
        </div>

        <div className="rounded-2xl border border-rule bg-paper-raised p-6 shadow-[0_12px_30px_-20px_rgb(0_0_0/0.35)] sm:p-7">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-ink-soft underline-offset-4 hover:text-ink hover:underline">
            ← Kembali ke situs
          </Link>
        </p>
      </main>
    </div>
  );
}
