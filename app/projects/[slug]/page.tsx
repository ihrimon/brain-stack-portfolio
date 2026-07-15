import ProjectDetails from "@/components/sections/ProjectDetails"
import { projectsData } from "@/lib/data/projects-page"
import { notFound } from "next/navigation"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projectsData.projects.map((project) => ({ slug: project.slug }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = projectsData.projects.find((item) => item.slug === slug)

  if (!project) {
    notFound()
  }

  const related = project.relatedProjects
    .map((relatedSlug) => projectsData.projects.find((item) => item.slug === relatedSlug))
    .filter((item): item is (typeof projectsData.projects)[number] => Boolean(item))

  return (
    <main id="main-content" role="main">
      <ProjectDetails project={project} related={related} />
    </main>
  )
}
