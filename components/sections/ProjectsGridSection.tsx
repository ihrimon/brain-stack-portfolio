"use client"

import { ProjectTile } from "@/components/projects/ProjectTile"
import { projectsData, type Project } from "@/lib/data/projects"
import { cn } from "@/lib/utils/cn"
import { useMemo, useState } from "react"

const PAGE_SIZE = 9

interface ProjectsGridSectionProps {
  projects: Project[]
}

export default function ProjectsGridSection({
  projects,
}: ProjectsGridSectionProps) {
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(projects.map((project) => project.category))),
    ],
    [projects]
  )

  const [activeTab, setActiveTab] = useState("All")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filteredProjects = useMemo(
    () =>
      activeTab === "All"
        ? projects
        : projects.filter((project) => project.category === activeTab),
    [projects, activeTab]
  )

  const visibleProjects = filteredProjects.slice(0, visibleCount)
  const hasMore = filteredProjects.length > visibleCount

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <section id="projects-grid" className="overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <div className="flex flex-col gap-10 border-b border-line pb-10 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="text-[clamp(2.75rem,7vw,7.5rem)] leading-[0.92] font-medium tracking-[-0.05em] text-ink uppercase">
            {projectsData.title}
          </h1>

          <div
            role="group"
            aria-label="Filter projects"
            className="flex flex-wrap gap-2 lg:max-w-xl lg:justify-end"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleTabChange(category)}
                aria-pressed={activeTab === category}
                data-cursor="magnetic"
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2 font-mono text-[11px] tracking-wider whitespace-nowrap uppercase transition-colors duration-300",
                  activeTab === category
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink-2 hover:border-ink hover:text-ink"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Re-keyed per filter so the CSS entrance replays on every switch.
            Right column is dropped (co.design-style stagger) via the
            `translate` property, which doesn't fight the `.rise-fade`
            transform. */}
        <div
          key={activeTab}
          className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 sm:pb-40 lg:gap-x-12 lg:gap-y-24 sm:[&>*:nth-child(even)]:translate-y-40"
        >
          {visibleProjects.map((project, index) => (
            <ProjectTile
              key={project.id}
              project={project}
              priority={index < 2}
              headingLevel="h2"
              className="rise-fade"
              style={{ "--i": index % PAGE_SIZE } as React.CSSProperties}
            />
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              data-cursor="magnetic"
              className="cursor-pointer rounded-full border border-line px-8 py-3 text-sm font-medium text-ink transition-colors duration-300 hover:border-ink"
            >
              See More...
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
