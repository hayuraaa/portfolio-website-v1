import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MailIcon } from "@/components/icons";
import { findMessage } from "@/lib/messages";
import { requireUser } from "@/lib/session";
import { DeleteItem } from "../../delete-item";
import { deleteMessage, markUnread } from "../actions";
import { MarkRead } from "./mark-read";

export const instant = false;

export const metadata: Metadata = { title: "Pesan" };

const dateFormat = new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Jakarta" });

export default async function MessagePage({ params }: PageProps<"/admin/messages/[id]">) {
  await requireUser();
  const { id } = await params;
  const message = await findMessage(Number(id));
  if (!message) notFound();

  const replySubject = `Re: ${message.subject ?? "pesan dari portofolio"}`;
  const replyHref = `mailto:${message.email}?subject=${encodeURIComponent(replySubject)}`;

  return (
    <div className="max-w-3xl pb-16">
      {!message.isRead && <MarkRead id={message.id} />}
      <Link href="/admin/messages" className="text-sm text-ink-soft hover:text-ink">
        ← Pesan masuk
      </Link>

      <article className="mt-6 rounded-2xl border border-rule bg-paper-raised">
        <header className="border-b border-rule p-6">
          <h1 className="font-serif text-3xl font-medium">{message.subject ?? "(tanpa subjek)"}</h1>
          <p className="mt-3 text-sm">
            <span className="font-medium">{message.name}</span>{" "}
            <a href={`mailto:${message.email}`} className="text-ink-soft underline-offset-4 hover:underline">
              &lt;{message.email}&gt;
            </a>
          </p>
          <p className="mt-1 font-mono text-xs text-ink-faint">{dateFormat.format(message.createdAt)}</p>
        </header>
        <div className="p-6 leading-relaxed whitespace-pre-wrap">{message.body}</div>
        <footer className="flex flex-wrap gap-2 border-t border-rule p-4">
          <a href={replyHref} className="btn-primary text-sm">
            <MailIcon className="size-4" />
            Balas via email
          </a>
          <form action={markUnread}>
            <input type="hidden" name="id" value={message.id} />
            <button type="submit" className="btn-secondary text-sm">
              Tandai belum dibaca
            </button>
          </form>
        </footer>
      </article>

      <DeleteItem id={message.id} title={`pesan dari ${message.name}`} noun="pesan" note="Pesan dihapus permanen." action={deleteMessage} />
    </div>
  );
}
