import type { Project } from "@/lib/data/projects-page"

export const PROJECTS_STACK_MAX = 8

export interface ProjectStackItem {
  id: string
  slug: string
  title: string
  year: string | null
  category: string
  liveUrl: string | null
  thumbnail: string
}

/**
 * Maps the shared case-study `Project` model down to the lean view-model
 * the stacked gallery actually renders — keeps the projects/ components
 * decoupled from the ~30-field case-study shape (workflow, metrics,
 * testimonial, etc.) since only a handful of fields are ever shown here.
 * This is also the single seam where a future video/lottie asset would
 * plug in (add a field to `Project`, branch on it here) — `ProjectMedia`
 * itself stays generic and never imports `Project`.
 */
export function toProjectStackItems(projects: Project[]): ProjectStackItem[] {
  return projects.slice(0, PROJECTS_STACK_MAX).map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    year: project.date,
    category: project.category,
    liveUrl: project.liveUrl,
    thumbnail: project.thumbnail,
  }))
}

export function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size))
  }
  return rows
}
