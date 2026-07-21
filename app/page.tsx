// import AboutSection from "@/components/sections/AboutSection"
import BlogSection from "@/components/sections/BlogSection"
import { JsonLd } from "@/components/common/JsonLd"
import CTASection from "@/components/sections/CTASection"
import EngineeringProcess from "@/components/sections/EngineeringProcess"
import HeroSection from "@/components/sections/HeroSection"
import ProjectsSection from "@/components/sections/ProjectsSection"
import ProjectVideoSection from "@/components/sections/ProjectVideoSection"
import ServicesSection from "@/components/sections/ServicesSection"
import TeamSection from "@/components/sections/TeamSection"
import TestimonialSection from "@/components/sections/TestimonialSection"
import { generatePageMetadata } from "@/lib/metadata"
import { generateWebPageSchema } from "@/lib/structured-data"
import { getAboutData } from "@/lib/utils/sheets/about"
import { getBlogPosts } from "@/lib/utils/sheets/blog"
import { getHomeData } from "@/lib/utils/sheets/home"
import { getProjects } from "@/lib/utils/sheets/projects"
import AboutSection from '@/components/sections/AboutSection'

export const revalidate = 300
export const metadata = generatePageMetadata("home")

export default async function HomePage() {
  const [home, about, projects, posts] = await Promise.all([
    getHomeData(),
    getAboutData(),
    getProjects(),
    getBlogPosts(),
  ])

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
          <HeroSection data={home.heroBanner} />
          <AboutSection data={home.whoWeAre} />
        </div>
        <ProjectVideoSection data={home.projectVideo} />
        <ProjectsSection projects={projects} />
        <ServicesSection data={home.services} />
        <EngineeringProcess data={home.process} />
        <TestimonialSection data={home.testimonials} />
        <TeamSection data={about.team} />
        <BlogSection posts={posts} />
        <CTASection data={home.cta} />
      </main>
    </>
  )
}
