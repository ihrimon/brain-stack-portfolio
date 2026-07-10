import AboutSection from "@/components/sections/AboutSection"
import HeroSection from "@/components/sections/HeroSection"
import ServicesSection from '@/components/sections/ServicesSection'

export default function HomePage() {
  return (
    <main id="main-content" role="main">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
    </main>
  )
}
