import { Footer } from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import CapabilitiesSection from "@/components/sections/CapabilitiesSection"
import CTASection from "@/components/sections/CTASection"
import FAQSection from "@/components/sections/FaqSection"
import HeroSection from "@/components/sections/HeroSection"
import MissionSection from "@/components/sections/MissionSection"
import ProcessSection from "@/components/sections/ProcessSection"
import ServicesSection from "@/components/sections/ServicesSection"
import TestimonialsSection from "@/components/sections/TestimonialSection"
import WhyChooseSection from "@/components/sections/WhyChooseUs"

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <HeroSection />
        <ServicesSection />
        <MissionSection />
        <WhyChooseSection />
        <ProcessSection />
        <CapabilitiesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
