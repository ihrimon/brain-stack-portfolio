import { JsonLd } from "@/components/common/JsonLd"
import BlogSection from "@/components/sections/BlogSection"
import CTASection from "@/components/sections/CTASection"
import FaqSection from "@/components/sections/FaqSection"
import FoundersSection from "@/components/sections/FoundersSection"
import HeroSection from "@/components/sections/HeroSection"
import HowWeWorkSection from "@/components/sections/HowWeWorkSection"
import ProjectsSection from "@/components/sections/ProjectsSection"
import ProjectVideoSection from "@/components/sections/ProjectVideoSection"
import TeamSection from "@/components/sections/TeamSection"
import WhatWeDoSection from "@/components/sections/WhatWeDoSection"
import WhoWeAreSection from "@/components/sections/WhoWeAreSection"
import { teamMembersData } from "@/lib/data/about-page"
import { blogsData } from "@/lib/data/blog-page"
import {
  ctaData,
  faqData,
  foundersData,
  projectVideoData,
  servicesData,
  whoWeAreData,
} from "@/lib/data/home-page"
import { processData } from "@/lib/data/process"
import { projectsData } from "@/lib/data/projects"
import { generatePageMetadata } from "@/lib/metadata"
import { generateWebPageSchema } from "@/lib/structured-data"

// All content is imported directly from lib/data/*.ts (no fetch, no ISR) —
// `force-static` makes that a build-time guarantee rather than an implicit
// side effect of "nothing dynamic happens to be used yet": if a dynamic API
// (cookies, headers, a per-request fetch) is ever accidentally introduced,
// the build fails here instead of silently making the route dynamic.
export const dynamic = "force-static"

export const metadata = generatePageMetadata("home")

export default function HomePage() {
  return (
    <>
      <JsonLd data={generateWebPageSchema("home")} />
      <main id="main-content" role="main">
        <div className="relative">
          <HeroSection />
        </div>
        <WhoWeAreSection data={whoWeAreData} />
        <ProjectVideoSection data={projectVideoData} />
        <FoundersSection data={foundersData} />
        <WhatWeDoSection data={servicesData} />
        <ProjectsSection projects={projectsData.projects} />
        <HowWeWorkSection data={processData} />
        <TeamSection data={teamMembersData} />
        <BlogSection posts={blogsData.posts} />
        <FaqSection data={faqData} />
        <CTASection data={ctaData} />
      </main>
    </>
  )
}
