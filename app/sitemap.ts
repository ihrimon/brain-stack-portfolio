import { blogsData } from "@/lib/data/blog-page"
import { projectsData } from "@/lib/data/projects"
import { siteConfig } from "@/lib/metadata"
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = projectsData.projects
  const posts = blogsData.posts

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    // `date` is a bare year ("2024") on most entries, or null on a few —
    // `new Date("2024")` parses fine; omit `lastModified` entirely when
    // there's nothing to parse rather than falling back to `new Date()`
    // (which would incorrectly claim every undated project was just
    // modified today, on every build).
    ...(project.date ? { lastModified: new Date(project.date) } : {}),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.publishDate),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes, ...postRoutes]
}
