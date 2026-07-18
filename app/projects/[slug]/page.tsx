import { JsonLd } from "@/components/common/JsonLd"
import ProjectDetails from "@/components/sections/ProjectDetails"
import { generateProjectMetadata } from "@/lib/metadata"
import { generateProjectSchema } from "@/lib/structured-data"
import { getProjects } from "@/lib/utils/sheets/projects"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const revalidate = 300

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const projects = await getProjects()
  const project = projects.find((item) => item.slug === slug)

  if (!project) return {}

  return generateProjectMetadata(project.title, project.overview, project.slug, project.heroImage)
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const projects = await getProjects()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    notFound()
  }

  const related =
    project.kind === "case-study"
      ? project.relatedProjects
          .map((relatedSlug) => projects.find((item) => item.slug === relatedSlug))
          .filter((item): item is (typeof projects)[number] => Boolean(item))
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
