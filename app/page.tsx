// import { JsonLd } from "@/components/common/JsonLd"
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
// import { generateWebPageSchema } from "@/lib/structured-data"
import dynamic from "next/dynamic"
const CTASection = dynamic(() => import("@/components/sections/CTASection"))
const FoundersSection = dynamic(
  () => import("@/components/sections/FoundersSection")
)
const WhatWeDoSection = dynamic(
  () => import("@/components/sections/WhatWeDoSection")
)
const WhoWeAreSection = dynamic(
  () => import("@/components/sections/WhoWeAreSection")
)
const HeroSection = dynamic(() => import("@/components/sections/HeroSection"))
const BlogSection = dynamic(() => import("@/components/sections/BlogSection"))
const FaqSection = dynamic(() => import("@/components/sections/FaqSection"))
const HowWeWorkSection = dynamic(
  () => import("@/components/sections/HowWeWorkSection")
)
const ProjectsSection = dynamic(
  () => import("@/components/sections/ProjectsSection")
)
const ProjectVideoSection = dynamic(
  () => import("@/components/sections/ProjectVideoSection")
)
const TeamSection = dynamic(() => import("@/components/sections/TeamSection"))

export const metadata = generatePageMetadata("home")

export default function HomePage() {
  return (
    <>
      {/* <JsonLd data={generateWebPageSchema("home")} /> */}
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
