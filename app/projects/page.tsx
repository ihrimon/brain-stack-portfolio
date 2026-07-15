import CTASection from "@/components/sections/CTASection"
import ProjectsGridSection from "@/components/sections/ProjectsGridSection"
import { getHomeData } from "@/lib/utils/sheets/home"
import { getProjects } from "@/lib/utils/sheets/projects"

export const revalidate = 300

export default async function ProjectsPage() {
  const [projects, home] = await Promise.all([getProjects(), getHomeData()])

  return (
    <main id="main-content" role="main">
      <ProjectsGridSection projects={projects} />
      <CTASection data={home.cta} />
    </main>
  )
}
