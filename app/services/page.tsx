import AgencyBanner from "@/components/sections/AgencyBanner"
import { JsonLd } from "@/components/common/JsonLd"
import CTASection from "@/components/sections/CTASection"
import ExclusiveServices from "@/components/sections/ExclusiveServices"
import ServiceProcessTimeline from "@/components/sections/ServiceProcessTimeline"
import ServiceSpotlight from "@/components/sections/ServiceSpotlight"
import { ctaData } from "@/lib/data/cta"
import {
  agencyBannerData,
  exclusiveServicesData,
  serviceProcessData,
  serviceSpotlightData,
} from "@/lib/data/service-page"
import { generatePageMetadata } from "@/lib/metadata"
import { generateWebPageSchema } from "@/lib/structured-data"

// See app/page.tsx for why this is explicit rather than implicit.
export const dynamic = "force-static"

export const metadata = generatePageMetadata("services")

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={generateWebPageSchema("services")} />
      <main id="main-content" role="main">
        <ServiceSpotlight spotlight={serviceSpotlightData} />
        <ServiceProcessTimeline process={serviceProcessData} />
        <AgencyBanner banner={agencyBannerData} />
        <ExclusiveServices exclusiveServices={exclusiveServicesData} />
        <CTASection data={ctaData} />
      </main>
    </>
  )
}
