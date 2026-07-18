import { siteConfig } from "@/lib/metadata"
import { getBlogPosts } from "@/lib/utils/sheets/blog"
import { getProjects } from "@/lib/utils/sheets/projects"
import type { MetadataRoute } from "next"

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getBlogPosts()])

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
