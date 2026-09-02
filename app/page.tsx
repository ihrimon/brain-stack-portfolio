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
