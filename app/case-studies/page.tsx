import CaseStudiesGrid from "@/components/sections/CaseStudiesGrid"
import CTASection from "@/components/sections/CTASection"
import { getCaseStudies } from "@/lib/sheets"

export const revalidate = 300

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies()

  return (
    <main id="main-content" role="main">
      <CaseStudiesGrid caseStudies={caseStudies} />
      <CTASection />
    </main>
  )
}
