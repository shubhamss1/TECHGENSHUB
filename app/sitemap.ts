import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages = ["", "/tools", "/pricing", "/about", "/contact", "/privacy-policy", "/terms"];
  // Only live tools are listed; "coming soon" pages are kept out of search results.
  const liveTools = TOOLS.filter((tool) => tool.status === "live").map((tool) => `/tools/${tool.slug}`);
  return [...pages, ...liveTools].map((path) => ({ url: `${SITE_URL}${path}`, lastModified }));
}
