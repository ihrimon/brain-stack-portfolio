import AgencyBanner from "@/components/sections/AgencyBanner"
import CTASection from "@/components/sections/CTASection"
import ExclusiveServices from "@/components/sections/ExclusiveServices"
import ServiceProcessTimeline from "@/components/sections/ServiceProcessTimeline"
import ServiceSpotlight from "@/components/sections/ServiceSpotlight"
import { getHomeData } from "@/lib/utils/sheets/home"
import { getServiceData } from "@/lib/utils/sheets/service"

export const revalidate = 300

export default async function ServicesPage() {
  const [service, home] = await Promise.all([getServiceData(), getHomeData()])

  return (
    <main id="main-content" role="main">
      <ServiceSpotlight spotlight={service.spotlight} />
      <ServiceProcessTimeline process={service.process} />
      <AgencyBanner banner={service.banner} />
      <ExclusiveServices exclusiveServices={service.exclusiveServices} />
      <CTASection data={home.cta} />
    </main>
  )
}
