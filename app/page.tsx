import BlogSection from "@/components/sections/BlogSection"
import { JsonLd } from "@/components/common/JsonLd"
import CTASection from "@/components/sections/CTASection"
import EngineeringProcess from "@/components/sections/EngineeringProcess"
import FaqSection from "@/components/sections/FaqSection"
import FoundersSection from "@/components/sections/FoundersSection"
import HeroSection from "@/components/sections/HeroSection"
import ProjectsSection from "@/components/sections/ProjectsSection"
import ProjectVideoSection from "@/components/sections/ProjectVideoSection"
import TeamSection from "@/components/sections/TeamSection"
import WhatWeDoSection from "@/components/sections/WhatWeDoSection"
import { generatePageMetadata } from "@/lib/metadata"
import { generateWebPageSchema } from "@/lib/structured-data"
import WhoWeAreSection from "@/components/sections/WhoWeAreSection"
import {
  ctaData,
  faqData,
  foundersData,
  processData,
  projectVideoData,
  servicesData,
  whoWeAreData,
} from "@/lib/data/home-page"
import { teamMembersData } from "@/lib/data/about-page"
import { projectsData } from "@/lib/data/projects"
import { blogsData } from "@/lib/data/blog-page"

// Data is sourced from the local lib/data/*.ts files below, not the Google
// Sheets CMS — re-wire to lib/utils/sheets/* once updated sheet data is
// ready to go live.
export const metadata = generatePageMetadata("home")

export default function HomePage() {
  return (
    <>
      <JsonLd data={generateWebPageSchema("home")} />
      <main id="main-content" role="main">
        {/*
          Hero and About share one background video: both are direct
          children of this `relative` element so the video's `sticky`
          layer (rendered by HeroSection) stays pinned for their combined
          scroll height and releases exactly when About ends. See
          HeroSection.tsx for the layer structure.
        */}
        <div className="relative">
          <HeroSection />
          <WhoWeAreSection data={whoWeAreData} />
        </div>
        <FoundersSection data={foundersData} />
        <ProjectVideoSection data={projectVideoData} />
        <ProjectsSection projects={projectsData.projects} />
        <WhatWeDoSection data={servicesData} />
        <EngineeringProcess data={processData} />
        <TeamSection data={teamMembersData} />
        <BlogSection posts={blogsData.posts} />
        <FaqSection data={faqData} />
        <CTASection data={ctaData} />
      </main>
    </>
  )
}
