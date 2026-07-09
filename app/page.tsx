import HeroSection from "@/components/sections/HeroSection"
import ProcessSection from "@/components/sections/ProcessSection"
import ServicesSection from "@/components/sections/ServicesSection"

export default function HomePage() {
  return (
    <main id="main-content" role="main">
      <div className="mx-auto max-w-7xl">
        <HeroSection />
        {/* <ProcessSection /> */}
      </div>
      <ServicesSection />
      {/* <div className="mx-auto max-w-6xl">
        <MissionSection />
        <WhyChooseSection />
        <ProcessSection />
        <CapabilitiesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </div> */}
    </main>
  )
}
