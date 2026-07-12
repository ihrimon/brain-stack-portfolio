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

export default function HomePage() {
  return (
    <main id="main-content" role="main">
      <HeroSection />
      <ProjectVideoSection />
      <AboutSection />
      <PortfolioSection />
      <ServicesSection />
      <CaseStudiesSection />
      <EngineeringProcess />
      <TestimonialSection />
      <TeamSection />
      <BlogSection />
      <CTASection />
    </main>
  )
}
