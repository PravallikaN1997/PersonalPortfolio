import type { MetadataRoute } from "next";

const base = "https://pravallikan.vercel.app";

// Password-protected case studies are left out on purpose.
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/play", "/work/ascent", "/work/clara"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
