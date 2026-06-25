import CapabilitiesSection from "@/components/sections/CapabilitiesSection"
import CTASection from "@/components/sections/CTASection"
import FAQSection from "@/components/sections/FaqSection"
import HeroSection from "@/components/sections/HeroSection"
import MissionSection from "@/components/sections/MissionSection"
import ProcessSection from "@/components/sections/ProcessSection"
import ServicesSection from "@/components/sections/ServicesSection"
import TestimonialsSection from "@/components/sections/TestimonialSection"
import VideoSection from "@/components/sections/VideoSectioni"
import WhyChooseSection from "@/components/sections/WhyChooseUs"

export default function HomePage() {
  return (
    <main id="main-content" role="main">
      <div className="mx-auto max-w-6xl">
        <HeroSection />
        <VideoSection src='/short.mp4'/>
        <ServicesSection />
        <MissionSection />
        <WhyChooseSection />
        <ProcessSection />
        <CapabilitiesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </div>
    </main>
  )
}
