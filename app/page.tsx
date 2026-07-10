import AboutSection from "@/components/sections/AboutSection"
import EngineeringProcess from "@/components/sections/EngineeringProcess"
import HeroSection from "@/components/sections/HeroSection"
import PortfolioSection from "@/components/sections/PortfolioSection"
import ServicesSection from '@/components/sections/ServicesSection'
import TestimonialSection from "@/components/sections/TestimonialSection"

export default function HomePage() {
  return (
    <main id="main-content" role="main">
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <ServicesSection />
      <EngineeringProcess />
      <TestimonialSection />
    </main>
  )
}
