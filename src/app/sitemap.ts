import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getAllProjects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticPaths = ["", "/projects", "/about", "/math", "/contact"];
  const projectPaths = getAllProjects().map((p) => `/projects/${p.slug}`);
  const paths = [...staticPaths, ...projectPaths];

  return paths.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
