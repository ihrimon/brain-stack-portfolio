import CaseStudyDetails from "@/components/sections/CaseStudyDetails"
import CTASection from "@/components/sections/CTASection"
import { getCaseStudies } from "@/lib/sheets"
import { notFound } from "next/navigation"

export const revalidate = 300

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies()
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }))
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const caseStudies = await getCaseStudies()
  const caseStudy = caseStudies.find((item) => item.slug === slug)

  if (!caseStudy) {
    notFound()
  }

  const related = caseStudy.relatedProjects
    .map((relatedSlug) => caseStudies.find((item) => item.slug === relatedSlug))
    .filter((item): item is (typeof caseStudies)[number] => Boolean(item))

  return (
    <main id="main-content" role="main">
      <CaseStudyDetails caseStudy={caseStudy} related={related} />
      <CTASection />
    </main>
  )
}
