import AboutApproach from "@/components/sections/AboutApproach"
import AboutStats from "@/components/sections/AboutStats"
import AboutTeamSection from "@/components/sections/AboutTeamSection"
import { JsonLd } from "@/components/common/JsonLd"
import MissionHero from "@/components/sections/MissionHero"
import ProjectInquiry from "@/components/sections/ProjectInquiry"
import WhyBrainStack from "@/components/sections/WhyBrainStack"
import {
  aboutApproachData,
  aboutFeaturesData,
  aboutInquiryData,
  aboutMissionData,
  aboutStatsData,
  teamMembersData,
} from "@/lib/data/about-page"
import { generatePageMetadata } from "@/lib/metadata"
import { generateWebPageSchema } from "@/lib/structured-data"

export const metadata = generatePageMetadata("about")

export default function AboutPage() {
  return (
    <>
      <JsonLd data={generateWebPageSchema("about")} />
      <main id="main-content" role="main">
        <MissionHero data={aboutMissionData} />
        <AboutStats stats={aboutStatsData} />
        <WhyBrainStack features={aboutFeaturesData} />
        <AboutApproach approach={aboutApproachData} />
        <AboutTeamSection data={teamMembersData} />
        <ProjectInquiry inquiry={aboutInquiryData} />
      </main>
    </>
  )
}
