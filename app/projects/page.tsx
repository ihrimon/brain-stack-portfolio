import { JsonLd } from "@/components/common/JsonLd"
import CTASection from "@/components/sections/CTASection"
import ProjectsGridSection from "@/components/sections/ProjectsGridSection"
import { ctaData } from "@/lib/data/cta"
import { projectsData } from "@/lib/data/projects"
import { generatePageMetadata } from "@/lib/metadata"
import { generateWebPageSchema } from "@/lib/structured-data"

// See app/page.tsx for why this is explicit rather than implicit.
export const dynamic = "force-static"

export const metadata = generatePageMetadata("projects")

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={generateWebPageSchema("projects")} />
      <main id="main-content" role="main">
        <ProjectsGridSection projects={projectsData.projects} />
        <CTASection data={ctaData} />
      </main>
    </>
  )
}
