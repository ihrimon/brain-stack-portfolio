import AboutApproach from "@/components/sections/AboutApproach"
import AboutStats from "@/components/sections/AboutStats"
import AboutTeamSection from "@/components/sections/AboutTeamSection"
import MissionHero from "@/components/sections/MissionHero"
import ProjectInquiry from "@/components/sections/ProjectInquiry"
import WhyBrainStack from "@/components/sections/WhyBrainStack"

export default function AboutPage() {
  return (
    <main id="main-content" role="main">
      <MissionHero />
      <AboutStats />
      <WhyBrainStack />
      <AboutApproach />
      <ProjectInquiry />
      <AboutTeamSection />
    </main>
  )
}
