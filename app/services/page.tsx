import AgencyBanner from "@/components/sections/AgencyBanner"
import ExclusiveServices from "@/components/sections/ExclusiveServices"
import ServiceProcessTimeline from "@/components/sections/ServiceProcessTimeline"
import ServiceSpotlight from "@/components/sections/ServiceSpotlight"

export default function ServicesPage() {
  return (
    <main id="main-content" role="main">
      <ServiceSpotlight />
      <ServiceProcessTimeline />
      <ExclusiveServices />
      <AgencyBanner />
    </main>
  )
}
