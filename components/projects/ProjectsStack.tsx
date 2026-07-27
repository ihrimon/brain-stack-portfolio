import { ProjectCard } from "@/components/projects/ProjectCard"
import { chunk, type ProjectStackItem } from "@/lib/projects"

interface ProjectsStackProps {
  items: ProjectStackItem[]
}

const ROW_SIZE = 2

export function ProjectsStack({ items }: ProjectsStackProps) {
  const rows = chunk(items, ROW_SIZE)

  return (
    <div className="relative">
      {rows.map((row, rowIndex) => (
        <div
          key={row.map((item) => item.id).join("-")}
          className="relative w-full py-10 lg:py-16"
        >
          <div className="relative mx-auto grid max-w-400 grid-cols-2 gap-3 px-5 sm:gap-6 sm:px-8">
            {row.map((item, itemIndex) => {
              const index = rowIndex * ROW_SIZE + itemIndex

              return <ProjectCard key={item.id} item={item} priority={index < 2} />
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
