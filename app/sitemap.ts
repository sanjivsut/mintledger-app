import type { MetadataRoute } from "next";
import { CALCULATORS } from "@/lib/calculators-meta";

const BASE = "https://mintledger.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/about", "/calculators"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const calcRoutes = CALCULATORS.map((c) => ({
    url: `${BASE}/calculators/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...calcRoutes];
}
