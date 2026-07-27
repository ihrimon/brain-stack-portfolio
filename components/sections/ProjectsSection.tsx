"use client"

import { ProjectsStack } from "@/components/projects/ProjectsStack"
import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { HeadingSection } from "@/components/common/HeadingSection"
import "@/lib/animations/gsap-animations"
import { projectsData, type Project } from "@/lib/data/projects"
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
      <div className="mx-auto max-w-400 px-5 sm:px-8 mb-16 md:mb-0">
        <HeadingSection
          badge={projectsData.badge}
          title={projectsData.title}
          titleRef={titleRef}
          description={projectsData.description}
        />
      </div>

      <div className="mt-16">
        <ProjectsStack items={items} />
      </div>

      <div className="mt-16 flex justify-center">
        <PrimaryButton href="/projects">View All Projects</PrimaryButton>
      </div>
    </section>
  )
}
