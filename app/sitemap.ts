import type { MetadataRoute } from "next";

const siteUrl = "https://www.base-ai.co.jp";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/news", "/contact"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.6,
  }));
}
