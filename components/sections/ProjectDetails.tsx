import { ParallaxImage } from "@/components/animations/ParallaxImage"
import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { SectionBadge } from "@/components/common/SectionBadge"
import type { Project } from "@/lib/data/projects-page"
import Image from "next/image"
import Link from "next/link"

interface ProjectDetailsProps {
  project: Project
  related: Project[]
}

const metricLabels: Record<keyof NonNullable<Project["metrics"]>, string> = {
  performance: "Performance",
  seo: "SEO",
  accessibility: "Accessibility",
  bestPractices: "Best Practices",
}

export default function ProjectDetails({ project, related }: ProjectDetailsProps) {
  const detailRows = [
    { label: "Service:", value: project.service },
    { label: "Client:", value: project.client },
    { label: "Industry:", value: project.industry },
    { label: "Date:", value: project.date },
    { label: "Duration:", value: project.duration },
    { label: "Status:", value: project.status },
  ].filter((row) => Boolean(row.value))

  const [primaryImage, secondaryImage, tertiaryImage, ...restImages] = project.gallery

  return (
    <>
      <section className="bg-brand-dark pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-400 px-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <SectionBadge>{project.category}</SectionBadge>

            {project.liveUrl && (
              <PrimaryButton href={project.liveUrl}>Visit Live Site</PrimaryButton>
            )}
          </div>

          <h1 className="mt-8 max-w-6xl text-4xl leading-[0.95] font-semibold tracking-tight text-white sm:text-6xl md:text-[76px]">
            {project.title}
          </h1>

          <div className="mt-16 grid gap-10 sm:mt-24 lg:grid-cols-2 lg:gap-50">
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
              {project.overview}
            </p>
          </div>

          {project.technologies.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white sm:text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-brand-dark pb-20 sm:pb-28">
        <ParallaxImage
          src={project.heroImage}
          alt={project.title}
          priority
          sizes="100vw"
          wrapperClassName="aspect-[16/7] w-full max-w-full bg-neutral-900"
        />
      </section>

      {project.challenge && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-400 px-5 sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[200px_1fr] lg:gap-12">
              <span className="text-xs font-medium tracking-widest uppercase">
                The Challenge
              </span>

              <div>
                {project.challenge.title && (
                  <p className="max-w-4xl text-2xl leading-snug font-medium text-neutral-400 sm:text-4xl">
                    {project.challenge.title}
                  </p>
                )}

                <p className="mt-6 max-w-3xl text-base leading-relaxed text-neutral-500 sm:text-lg">
                  {project.challenge.description}
                </p>

                {(project.challenge.painPoints.length > 0 ||
                  project.challenge.businessImpact.length > 0) && (
                  <div className="mt-10 grid gap-10 sm:grid-cols-2">
                    {project.challenge.painPoints.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold tracking-widest uppercase">
                          Pain Points
                        </h3>
                        <ul className="mt-4 space-y-3">
                          {project.challenge.painPoints.map((point) => (
                            <li
                              key={point}
                              className="flex gap-3 text-base leading-relaxed text-neutral-500"
                            >
                              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neutral-400" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.challenge.businessImpact.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold tracking-widest uppercase">
                          Business Impact
                        </h3>
                        <ul className="mt-4 space-y-3">
                          {project.challenge.businessImpact.map((impact) => (
                            <li
                              key={impact}
                              className="flex gap-3 text-base leading-relaxed text-neutral-500"
                            >
                              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neutral-400" />
                              {impact}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {project.goals.length > 0 && (
        <section className="bg-brand-dark py-20 sm:py-28">
          <div className="mx-auto max-w-400 px-5 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-[200px_1fr] lg:gap-12">
              <h2 className="text-xs font-medium tracking-widest text-white/60 uppercase">
                Project Goals
              </h2>

              <ul className="grid gap-4 sm:grid-cols-2">
                {project.goals.map((goal, index) => (
                  <li
                    key={goal}
                    className="flex gap-4 rounded-2xl border border-white/10 p-5 text-base leading-relaxed text-white/70"
                  >
                    <span className="text-sm font-semibold text-white/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-400 px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <h2 className="max-w-md text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
              {project.solution.title}
            </h2>

            <div className="max-w-xl">
              <p className="text-base leading-relaxed text-neutral-500">
                {project.solution.description}
              </p>

              <ul className="mt-6 space-y-2">
                {project.solution.highlights.map((highlight) => (
                  <li key={highlight} className="text-base">
                    + {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {project.workflow.length > 0 && (
        <section className="bg-brand-dark py-20 sm:py-28">
          <div className="mx-auto max-w-400 px-5 sm:px-8">
            <h2 className="max-w-2xl text-3xl leading-tight font-medium tracking-tight text-white sm:text-4xl">
              How We Built It
            </h2>

            <div className="mt-12 divide-y divide-white/10 border-t border-white/10">
              {project.workflow.map((step, index) => (
                <div
                  key={step.title}
                  className="grid gap-4 py-8 sm:grid-cols-[100px_1fr] sm:gap-8"
                >
                  <span className="text-sm font-semibold text-white/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="text-lg font-semibold text-white sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/60">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(project.tools.length > 0 || project.architecture.length > 0) && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-400 px-5 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
              {project.tools.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold tracking-widest uppercase">Tools</h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-white/10 dark:text-white/70"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.architecture.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold tracking-widest uppercase">
                    Architecture
                  </h3>
                  <ul className="mt-5 space-y-2">
                    {project.architecture.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-relaxed text-neutral-500"
                      >
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-neutral-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {(project.features.length > 0 || project.uiHighlights.length > 0) && (
        <section className="bg-brand-dark py-20 sm:py-28">
          <div className="mx-auto max-w-400 px-5 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              {project.features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                    Key Features
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {project.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-base text-white/70"
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-white/40" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.uiHighlights.length > 0 && (
                <div>
                  <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                    UI Highlights
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {project.uiHighlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-center gap-3 text-base text-white/70"
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-white/40" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {project.developmentProcess.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-400 px-5 sm:px-8">
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
              Development Process
            </h2>

            <div className="mt-10 flex flex-wrap gap-3">
              {project.developmentProcess.map((stage, index) => (
                <div
                  key={stage}
                  className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium dark:border-white/10"
                >
                  <span className="text-xs text-neutral-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {stage}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(project.challengesFaced.length > 0 || project.solutionsImplemented.length > 0) && (
        <section className="bg-brand-dark py-20 sm:py-28">
          <div className="mx-auto max-w-400 px-5 sm:px-8">
            <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
              Engineering Challenges & Fixes
            </h2>

            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
              {project.challengesFaced.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold tracking-widest text-white/50 uppercase">
                    Challenges Faced
                  </h3>
                  <ul className="mt-5 space-y-4">
                    {project.challengesFaced.map((challenge) => (
                      <li key={challenge} className="text-base leading-relaxed text-white/70">
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.solutionsImplemented.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold tracking-widest text-white/50 uppercase">
                    Solutions Implemented
                  </h3>
                  <ul className="mt-5 space-y-4">
                    {project.solutionsImplemented.map((solution) => (
                      <li key={solution} className="text-base leading-relaxed text-white/70">
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {(project.results.length > 0 || project.metrics) && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-400 px-5 sm:px-8">
            <div className="grid gap-16 lg:grid-cols-2">
              {project.results.length > 0 && (
                <div>
                  <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">Results</h2>
                  <ul className="mt-6 space-y-3">
                    {project.results.map((result) => (
                      <li key={result} className="flex gap-3 text-base leading-relaxed">
                        <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neutral-400" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.metrics && (
                <div>
                  <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
                    Quality Metrics
                  </h2>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {(
                      Object.keys(project.metrics) as Array<keyof NonNullable<Project["metrics"]>>
                    ).map((key) => (
                      <div
                        key={key}
                        className="rounded-2xl border border-neutral-200 p-5 dark:border-white/10"
                      >
                        <span className="text-2xl font-semibold">
                          {project.metrics?.[key]}
                        </span>
                        <p className="mt-1 text-xs tracking-widest text-neutral-400 uppercase">
                          {metricLabels[key]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {project.testimonial && (
        <section className="bg-brand-dark py-20 sm:py-28">
          <div className="mx-auto max-w-400 px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-2xl leading-relaxed text-white sm:text-3xl">
                &ldquo;{project.testimonial.quote}&rdquo;
              </p>

              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="relative size-12 overflow-hidden rounded-full bg-neutral-800">
                  {project.testimonial.image && (
                    <Image
                      src={project.testimonial.image}
                      alt={project.testimonial.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  )}
                </div>

                <div className="text-left">
                  <p className="text-sm font-semibold text-white">
                    {project.testimonial.name}
                  </p>
                  <p className="text-xs text-white/50">
                    {project.testimonial.role}
                    {project.testimonial.company ? `, ${project.testimonial.company}` : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {(project.lessonsLearned.length > 0 || project.nextSteps.length > 0) && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-400 px-5 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              {project.lessonsLearned.length > 0 && (
                <div>
                  <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
                    Lessons Learned
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {project.lessonsLearned.map((lesson) => (
                      <li key={lesson} className="text-base leading-relaxed text-neutral-500">
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.nextSteps.length > 0 && (
                <div>
                  <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">Next Steps</h2>
                  <ul className="mt-6 space-y-3">
                    {project.nextSteps.map((step) => (
                      <li key={step} className="text-base leading-relaxed text-neutral-500">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="bg-brand-dark pb-20 sm:pb-28">
        <div className="mb-8 grid grid-cols-1 gap-8 lg:h-160 lg:grid-cols-12 lg:grid-rows-2">
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

        {restImages.length > 0 && (
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
        )}
      </section>

      {related.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-400 px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
                More Projects
              </h2>

              <PrimaryButton href="/projects">View All Projects</PrimaryButton>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/projects/${item.slug}`}
                  className="group/related block overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10"
                  data-cursor="magnetic"
                >
                  <div className="relative aspect-16/9 overflow-hidden">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/related:scale-105"
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                      {item.category}
                    </span>
                    <h3 className="mt-2 text-xl font-medium">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
