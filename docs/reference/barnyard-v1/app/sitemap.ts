import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/cafe";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/spaces", "/host", "/shoot", "/bowl", "/press", "/menu", "/visit"];
  const lastModified = new Date("2026-09-14");
  return routes.map((r) => ({
    url: `${siteUrl}${r}`,
    lastModified,
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : r === "/host" || r === "/shoot" || r === "/bowl" ? 0.9 : 0.7,
  }));
}
