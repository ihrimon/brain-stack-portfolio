"use client"

import { ProjectsStack } from "@/components/projects/ProjectsStack"
import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import { projectsData, type Project } from "@/lib/data/projects-page"
import { toProjectStackItems } from "@/lib/projects"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

interface ProjectsSectionProps {
  projects: Project[]
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const items = toProjectStackItems(projects)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll(titleRef.current)
    },
    { scope: sectionRef }
  )

  return (
    <section id="projects" ref={sectionRef} className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <SectionBadge>{projectsData.badge}</SectionBadge>

        <h2
          ref={titleRef}
          className="mt-8 max-w-3xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
        >
          {projectsData.title}
        </h2>
      </div>

      <div className="mt-16">
        <ProjectsStack items={items} />
      </div>
    </section>
  )
}
