// Gated media route: screenshots and clips live outside /public and are only served
// to visitors holding a valid case-study session.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { hasAccess } from "@/lib/case-study-access";

const DIR = path.join(process.cwd(), "app", "work", "when-should-the-ai-speak", "_media");
const HEADERS = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

export async function GET(req: Request, ctx: { params: Promise<{ name: string }> }) {
  if (!(await hasAccess())) return new Response("Not found", { status: 404 });
  const { name } = await ctx.params;
  const m = /^[a-z0-9-]+\.(jpg|mp4)$/.exec(name);
  if (!m) return new Response("Not found", { status: 404 });
  try {
    const file = await readFile(path.join(DIR, name));
    if (m[1] === "jpg") {
      return new Response(new Uint8Array(file), { headers: { ...HEADERS, "Content-Type": "image/jpeg" } });
    }
    // Video: honour byte ranges (Safari requires them).
    const size = file.byteLength;
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") ?? "");
    if (range) {
      const start = range[1] ? Number(range[1]) : 0;
      const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      if (start > end || start >= size) {
        return new Response(null, { status: 416, headers: { ...HEADERS, "Content-Range": `bytes */${size}` } });
      }
      return new Response(new Uint8Array(file.subarray(start, end + 1)), {
        status: 206,
        headers: { ...HEADERS, "Content-Type": "video/mp4", "Accept-Ranges": "bytes", "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
      });
    }
    return new Response(new Uint8Array(file), {
      headers: { ...HEADERS, "Content-Type": "video/mp4", "Accept-Ranges": "bytes", "Content-Length": String(size) },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
