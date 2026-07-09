import HeroSection from "@/components/sections/HeroSection"
import ProcessSection from "@/components/sections/ProcessSection"

export default function HomePage() {
  return (
    <main id="main-content" role="main">
      <div className="mx-auto max-w-6xl">
        <HeroSection />
        {/* <ProcessSection /> */}
        {/* <ServicesSection />
        <MissionSection />
        <WhyChooseSection />
        <ProcessSection />
        <CapabilitiesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection /> */}
      </div>
    </main>
  )
}
