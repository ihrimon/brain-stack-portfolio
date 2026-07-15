import AboutSection from "@/components/sections/AboutSection"
import BlogSection from "@/components/sections/BlogSection"
import CTASection from "@/components/sections/CTASection"
import EngineeringProcess from "@/components/sections/EngineeringProcess"
import HeroSection from "@/components/sections/HeroSection"
import ProjectsSection from "@/components/sections/ProjectsSection"
import ProjectVideoSection from "@/components/sections/ProjectVideoSection"
import ServicesSection from "@/components/sections/ServicesSection"
import TeamSection from "@/components/sections/TeamSection"
import TestimonialSection from "@/components/sections/TestimonialSection"

export const revalidate = 300

export default async function HomePage() {
  return (
    <main id="main-content" role="main">
      <HeroSection />
      <ProjectVideoSection />
      <AboutSection />
      <ProjectsSection />
      <ServicesSection />
      <EngineeringProcess />
      <TestimonialSection />
      <TeamSection />
      <BlogSection />
      <CTASection />
    </main>
  )
}
