import CaseStudyDetails from "@/components/sections/CaseStudyDetails"
import CTASection from "@/components/sections/CTASection"
import { caseStudiesData } from "@/lib/data/caseStudies"
import { notFound } from "next/navigation"

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return caseStudiesData.map((caseStudy) => ({ slug: caseStudy.slug }))
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const caseStudy = caseStudiesData.find((item) => item.slug === slug)

  if (!caseStudy) {
    notFound()
  }

  return (
    <main id="main-content" role="main">
      <CaseStudyDetails caseStudy={caseStudy} />
      <CTASection />
    </main>
  )
}
