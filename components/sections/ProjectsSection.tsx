"use client"

import { ProjectsStack } from "@/components/projects/ProjectsStack"
import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import { projectsData, type Project } from "@/lib/data/projects-page"
import { toProjectStackItems } from "@/lib/projects"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"
import Link from "next/link"
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
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-30">
            <SectionBadge>{projectsData.badge}</SectionBadge>

            <h2
              ref={titleRef}
              className="max-w-3xl text-3xl leading-tight font-medium tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              {projectsData.title}
            </h2>
          </div>

          <Link
            href="/projects"
            data-cursor="magnetic"
            className="group/link inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-background hover:text-foreground"
          >
            View All Projects
            <Image
              src="/icons/arrow-right.svg"
              alt=""
              width={16}
              height={16}
              className="invert transition-transform duration-300 group-hover/link:translate-x-1"
            />
          </Link>
        </div>
      </div>

      <div className="mt-16">
        <ProjectsStack items={items} />
      </div>
    </section>
  )
}
