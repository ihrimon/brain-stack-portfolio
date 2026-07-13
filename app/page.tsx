import AboutSection from "@/components/sections/AboutSection"
import BlogSection from "@/components/sections/BlogSection"
import CaseStudiesSection from "@/components/sections/CaseStudiesSection"
import CTASection from "@/components/sections/CTASection"
import EngineeringProcess from "@/components/sections/EngineeringProcess"
import HeroSection from "@/components/sections/HeroSection"
import PortfolioSection from "@/components/sections/PortfolioSection"
import ProjectVideoSection from "@/components/sections/ProjectVideoSection"
import ServicesSection from '@/components/sections/ServicesSection'
import TeamSection from "@/components/sections/TeamSection"
import TestimonialSection from "@/components/sections/TestimonialSection"
import { getCaseStudies } from "@/lib/sheets"

export const revalidate = 300

export default async function HomePage() {
  const caseStudies = await getCaseStudies()

  return (
    <main id="main-content" role="main">
      <HeroSection />
      <ProjectVideoSection />
      <AboutSection />
      <PortfolioSection />
      <ServicesSection />
      <CaseStudiesSection caseStudies={caseStudies} />
      <EngineeringProcess />
      <TestimonialSection />
      <TeamSection />
      <BlogSection />
      <CTASection />
    </main>
  )
}
