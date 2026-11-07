import { readFile } from "node:fs/promises";
import path from "node:path";

// Uploaded files live outside public/ so files added from the admin panel
// are served without a rebuild.
const UPLOADS = path.resolve(process.cwd(), "storage/uploads");

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

export async function GET(_req: Request, ctx: RouteContext<"/media/[...path]">) {
  const { path: segments } = await ctx.params;
  const file = path.resolve(UPLOADS, ...segments);
  const type = TYPES[path.extname(file).toLowerCase()];

  if (!file.startsWith(UPLOADS + path.sep) || !type) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const body = await readFile(file);
    return new Response(body, {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
