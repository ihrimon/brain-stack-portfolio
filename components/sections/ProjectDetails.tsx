import { ParallaxImage } from "@/components/animations/ParallaxImage"
import { portfolioData } from "@/data/portfolio"

type Project = (typeof portfolioData.projects)[number]

interface ProjectDetailsProps {
  project: Project
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  const detailRows = [
    { label: "Service:", value: project.service },
    { label: "Client:", value: project.client },
    { label: "Industry:", value: project.industry },
    { label: "Date:", value: project.date },
  ]

  const [primaryImage, secondaryImage, tertiaryImage, ...restImages] =
    project.images

  return (
    <>
      <section className="bg-brand-dark pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-400 px-5 sm:px-8">
          <h1 className="max-w-6xl text-4xl leading-[0.95] font-semibold tracking-tight text-white sm:text-6xl md:text-[84px]">
            {project.title}
          </h1>

          <div className="mt-16 grid gap-10 sm:mt-24 lg:grid-cols-2 lg:gap-16">
            <div className="divide-y divide-white/10 border-t border-white/10">
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[110px_1fr] gap-4 py-5 sm:grid-cols-[140px_1fr]"
                >
                  <span className="text-sm text-white/50">{row.label}</span>
                  <span className="text-sm font-semibold text-white sm:text-base">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <p className="max-w-xl text-2xl leading-relaxed text-white/60">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-dark pb-20 sm:pb-28">
        <ParallaxImage
          src={project.thumbnailImage}
          alt={project.title}
          priority
          sizes="100vw"
          wrapperClassName="aspect-video w-full max-w-full bg-neutral-900"
        />
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-400 px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[200px_1fr] lg:gap-12">
            <span className="text-xs font-medium tracking-widest uppercase">
              Problem Statement
            </span>

            <p className="max-w-4xl text-2xl leading-snug font-medium text-neutral-400 sm:text-4xl">
              {project.problemStatement}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-dark py-20 sm:py-28">
        <div className="mx-auto max-w-400 px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <h2 className="max-w-md text-3xl leading-tight font-medium tracking-tight text-white sm:text-4xl">
              {project.solution.title}
            </h2>

            <div className="max-w-xl">
              <p className="text-base leading-relaxed text-white/60">
                {project.solution.description}
              </p>

              <ul className="mt-6 space-y-2">
                {project.solution.services.map((service) => (
                  <li key={service} className="text-base text-white">
                    + {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-dark pb-20 sm:pb-28">
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:grid-rows-2 lg:h-160">
          <ParallaxImage
            src={primaryImage}
            alt={`${project.title} showcase 1`}
            sizes="(min-width: 1024px) 58vw, 100vw"
            wrapperClassName="aspect-4/3 w-full max-w-full bg-neutral-900 lg:aspect-auto lg:col-span-7 lg:row-span-2"
          />

          <ParallaxImage
            src={secondaryImage}
            alt={`${project.title} showcase 2`}
            sizes="(min-width: 1024px) 42vw, 100vw"
            wrapperClassName="aspect-4/3 w-full max-w-full bg-neutral-900 lg:aspect-auto lg:col-span-5"
          />

          <ParallaxImage
            src={tertiaryImage}
            alt={`${project.title} showcase 3`}
            sizes="(min-width: 1024px) 42vw, 100vw"
            wrapperClassName="aspect-4/3 w-full max-w-full bg-neutral-900 lg:aspect-auto lg:col-span-5"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {restImages.map((image, index) => (
            <ParallaxImage
              key={image + index}
              src={image}
              alt={`${project.title} showcase ${index + 4}`}
              sizes="(min-width: 1024px) 33vw, 100vw"
              wrapperClassName="aspect-4/3 w-full max-w-full bg-neutral-900"
            />
          ))}
        </div>
      </section>
    </>
  )
}
