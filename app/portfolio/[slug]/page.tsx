import ProjectDetails from "@/components/sections/ProjectDetails"
import { portfolioData } from "@/data/portfolio"
import { notFound } from "next/navigation"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return portfolioData.projects.map((project) => ({ slug: project.slug }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = portfolioData.projects.find((item) => item.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <main id="main-content" role="main">
      <ProjectDetails project={project} />
    </main>
  )
}
