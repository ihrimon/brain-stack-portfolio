import ProjectDetails from "@/components/sections/ProjectDetails"
import { getProjects } from "@/lib/utils/sheets/projects"
import { notFound } from "next/navigation"

export const revalidate = 300

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({ slug: project.slug }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const projects = await getProjects()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    notFound()
  }

  const related = project.relatedProjects
    .map((relatedSlug) => projects.find((item) => item.slug === relatedSlug))
    .filter((item): item is (typeof projects)[number] => Boolean(item))

  return (
    <main id="main-content" role="main">
      <ProjectDetails project={project} related={related} />
    </main>
  )
}
