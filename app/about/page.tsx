import AboutApproach from "@/components/sections/AboutApproach"
import AboutStats from "@/components/sections/AboutStats"
import AboutTeamSection from "@/components/sections/AboutTeamSection"
import { JsonLd } from "@/components/common/JsonLd"
import MissionHero from "@/components/sections/MissionHero"
import ProjectInquiry from "@/components/sections/ProjectInquiry"
import WhyBrainStack from "@/components/sections/WhyBrainStack"
import { generatePageMetadata } from "@/lib/metadata"
import { generateWebPageSchema } from "@/lib/structured-data"
import { getAboutData } from "@/lib/utils/sheets/about"

export const revalidate = 300
export const metadata = generatePageMetadata("about")

export default async function AboutPage() {
  const about = await getAboutData()

  return (
    <>
      <JsonLd data={generateWebPageSchema("about")} />
      <main id="main-content" role="main">
        <MissionHero data={about.mission} />
        <AboutStats stats={about.stats} />
        <WhyBrainStack features={about.features} />
        <AboutApproach approach={about.approach} />
        <AboutTeamSection data={about.team} />
        <ProjectInquiry inquiry={about.inquiry} />
      </main>
    </>
  )
}
