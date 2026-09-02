import { JsonLd } from "@/components/common/JsonLd"
import ProjectDetails from "@/components/sections/ProjectDetails"
import { projectsData, type Project } from "@/lib/data/projects"
import { generateProjectMetadata } from "@/lib/metadata"
import { generateProjectSchema } from "@/lib/structured-data"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

// See app/page.tsx for why this is explicit rather than implicit — same
// reasoning applies here alongside generateStaticParams below.
export const dynamic = "force-static"

export function generateStaticParams() {
  return projectsData.projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projectsData.projects.find((item) => item.slug === slug)

  if (!project) return {}

  return generateProjectMetadata(project.title, project.overview, project.slug, project.heroImage)
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const projects: Project[] = projectsData.projects
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    notFound()
  }

  const related =
    project.kind === "case-study"
      ? project.relatedProjects
          .map((relatedSlug) => projects.find((item) => item.slug === relatedSlug))
          .filter((item): item is Project => Boolean(item))
      : []

  return (
    <>
      <JsonLd data={generateProjectSchema(project)} />
      <main id="main-content" role="main">
        <ProjectDetails project={project} related={related} />
      </main>
    </>
  )
}
