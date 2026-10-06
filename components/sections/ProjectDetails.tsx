import { ParallaxImage } from "@/components/animations/ParallaxImage"
import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { ProjectTile } from "@/components/projects/ProjectTile"
import type { CaseStudyProject, Project, ProjectMetrics } from "@/lib/data/projects"
import { cn } from "@/lib/utils/cn"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import Image from "next/image"
import type { ReactNode } from "react"

interface ProjectDetailsProps {
  project: Project
  related: Project[]
}

const metricLabels: Record<keyof ProjectMetrics, string> = {
  performance: "Performance",
  seo: "SEO",
  accessibility: "Accessibility",
  bestPractices: "Best Practices",
}

// ---- Editorial building blocks (co.design-style) ---------------------------

// Gutters are margins (not padding) so section hairlines stop at the
// content edge instead of running to the viewport edge.
// Same 1232px content width as `max-w-site` + padding elsewhere.
const container = "mx-4 max-w-[calc(var(--container-site)-3rem)] lg:mx-6 min-[1280px]:mx-auto"
const monoLabel = "font-mono text-[11px] tracking-wider text-ink-2 uppercase"

/** A hairline-topped 12-column row: mono label on the left, content right. */
function Chapter({
  label,
  children,
  as: Label = "h2",
}: {
  label: string
  children: ReactNode
  as?: "h2" | "span"
}) {
  return (
    <section className="py-16 sm:py-24">
      <div className={cn(container, "grid gap-8 border-t border-line pt-8 lg:grid-cols-12 lg:gap-8")}>
        <Label className={cn(monoLabel, "lg:col-span-3")}>{label}</Label>
        <div className="lg:col-span-8 lg:col-start-5">{children}</div>
      </div>
    </section>
  )
}

function BulletList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-4 py-4 text-base leading-relaxed text-ink-2">
          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-signal" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function NumberedList({ items }: { items: readonly string[] }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {items.map((item, index) => (
        <li key={item} className="grid grid-cols-[3rem_1fr] gap-4 py-5 text-base leading-relaxed text-ink">
          <span className="font-mono text-[11px] tracking-wider text-ink-2">
            {String(index + 1).padStart(2, "0")}
          </span>
          {item}
        </li>
      ))}
    </ol>
  )
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] tracking-wide text-ink-2">
      {children}
    </span>
  )
}

// ---------------------------------------------------------------------------

export default function ProjectDetails({ project, related }: ProjectDetailsProps) {
  // Deep-dive sections below only exist on full case studies — narrowing
  // once here (rather than repeating `project.kind === "case-study"` at
  // every section) keeps the rest of this component readable.
  const caseStudy: CaseStudyProject | null = project.kind === "case-study" ? project : null

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
      {/* ---- Hero ---------------------------------------------------- */}
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className={container}>
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-line pb-4">
            <span className={monoLabel}>[ {project.category} ]</span>
            {project.liveUrl && (
              <PrimaryButton href={project.liveUrl}>Visit Live Site</PrimaryButton>
            )}
          </div>

          <h1 className="rise-up mt-12 max-w-[9.4em] text-[clamp(3rem,8vw,8.5rem)] leading-[0.92] font-medium tracking-[-0.05em] text-ink sm:mt-16">
            {project.title}
          </h1>

          <div className="mt-16 grid gap-12 sm:mt-24 lg:grid-cols-12 lg:gap-8">
            <dl className="border-t border-line lg:col-span-5">
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line py-4 sm:grid-cols-[9rem_1fr]"
                >
                  <dt className={monoLabel}>{row.label}</dt>
                  <dd className="text-sm font-medium text-ink sm:text-base">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-2xl leading-snug tracking-tight text-ink sm:text-3xl">
                {project.overview}
              </p>

              {project.technologies.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Chip key={tech}>{tech}</Chip>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Cover --------------------------------------------------- */}
      <section className="px-4 lg:px-6">
        <ParallaxImage
          src={project.heroImage}
          alt={project.title}
          priority
          sizes="100vw"
          wrapperClassName="mx-auto aspect-[16/9] w-full max-w-[calc(var(--container-site)-3rem)] overflow-hidden rounded-3xl bg-paper-2 lg:aspect-[16/8]"
        />
      </section>

      {/* ---- Challenge ----------------------------------------------- */}
      {project.challenge && (
        <Chapter label="The Challenge" as="span">
          {project.challenge.title && (
            <p className="max-w-4xl text-2xl leading-tight font-medium tracking-tight text-ink sm:text-4xl">
              {project.challenge.title}
            </p>
          )}

          <p
            className={cn(
              "max-w-3xl leading-relaxed text-ink-2",
              project.challenge.title ? "mt-6 text-lg" : "text-2xl leading-snug tracking-tight text-ink sm:text-3xl"
            )}
          >
            {project.challenge.description}
          </p>

          {(project.challenge.painPoints.length > 0 ||
            project.challenge.businessImpact.length > 0) && (
            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              {project.challenge.painPoints.length > 0 && (
                <div>
                  <h3 className={cn(monoLabel, "mb-4")}>Pain Points</h3>
                  <BulletList items={project.challenge.painPoints} />
                </div>
              )}
              {project.challenge.businessImpact.length > 0 && (
                <div>
                  <h3 className={cn(monoLabel, "mb-4")}>Business Impact</h3>
                  <BulletList items={project.challenge.businessImpact} />
                </div>
              )}
            </div>
          )}
        </Chapter>
      )}

      {caseStudy && caseStudy.goals.length > 0 && (
        <Chapter label="Project Goals">
          <NumberedList items={caseStudy.goals} />
        </Chapter>
      )}

      {/* ---- Solution ------------------------------------------------ */}
      <section className="py-16 sm:py-24">
        <div className={cn(container, "grid gap-10 border-t border-line pt-8 lg:grid-cols-12 lg:gap-8")}>
          <h2 className="max-w-xl text-3xl leading-tight font-medium tracking-tight text-ink sm:text-4xl lg:col-span-6">
            {project.solution.title}
          </h2>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-lg leading-relaxed text-ink-2">{project.solution.description}</p>

            <ul className="mt-8 divide-y divide-line border-y border-line">
              {project.solution.highlights.map((highlight) => (
                <li key={highlight} className="py-3.5 text-base text-ink">
                  <span className="text-signal-text">+</span> {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {caseStudy && caseStudy.workflow.length > 0 && (
        <Chapter label="How We Built It">
          <ol className="divide-y divide-line border-y border-line">
            {caseStudy.workflow.map((step, index) => (
              <li key={step.title} className="grid gap-3 py-8 sm:grid-cols-[4rem_1fr] sm:gap-6">
                <span className="font-mono text-[11px] tracking-wider text-ink-2">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-ink">{step.title}</h3>
                  <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-2">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Chapter>
      )}

      {(project.tools.length > 0 || (caseStudy?.architecture.length ?? 0) > 0) && (
        <section className="py-16 sm:py-24">
          <div className={cn(container, "grid gap-12 border-t border-line pt-8 lg:grid-cols-12 lg:gap-8")}>
            {project.tools.length > 0 && (
              <div className="lg:col-span-4">
                <h3 className={cn(monoLabel, "mb-5")}>Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <Chip key={tool}>{tool}</Chip>
                  ))}
                </div>
              </div>
            )}

            {caseStudy && caseStudy.architecture.length > 0 && (
              <div className="lg:col-span-7 lg:col-start-6">
                <h3 className={cn(monoLabel, "mb-5")}>Architecture</h3>
                <BulletList items={caseStudy.architecture} />
              </div>
            )}
          </div>
        </section>
      )}

      {caseStudy && (caseStudy.features.length > 0 || caseStudy.uiHighlights.length > 0) && (
        <section className="py-16 sm:py-24">
          <div className={cn(container, "grid gap-12 border-t border-line pt-8 lg:grid-cols-2 lg:gap-16")}>
            {caseStudy.features.length > 0 && (
              <div>
                <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">Key Features</h2>
                <BulletList items={caseStudy.features} className="mt-6" />
              </div>
            )}
            {caseStudy.uiHighlights.length > 0 && (
              <div>
                <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">UI Highlights</h2>
                <BulletList items={caseStudy.uiHighlights} className="mt-6" />
              </div>
            )}
          </div>
        </section>
      )}

      {caseStudy && caseStudy.developmentProcess.length > 0 && (
        <Chapter label="Development Process">
          <div className="flex flex-wrap gap-2">
            {caseStudy.developmentProcess.map((stage, index) => (
              <span
                key={stage}
                className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink"
              >
                <span className="font-mono text-[11px] text-ink-2">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {stage}
              </span>
            ))}
          </div>
        </Chapter>
      )}

      {caseStudy &&
        (caseStudy.challengesFaced.length > 0 || caseStudy.solutionsImplemented.length > 0) && (
          <Chapter label="Engineering Challenges & Fixes">
            <div className="grid gap-10 sm:grid-cols-2">
              {caseStudy.challengesFaced.length > 0 && (
                <div>
                  <h3 className={cn(monoLabel, "mb-4")}>Challenges Faced</h3>
                  <BulletList items={caseStudy.challengesFaced} />
                </div>
              )}
              {caseStudy.solutionsImplemented.length > 0 && (
                <div>
                  <h3 className={cn(monoLabel, "mb-4")}>Solutions Implemented</h3>
                  <BulletList items={caseStudy.solutionsImplemented} />
                </div>
              )}
            </div>
          </Chapter>
        )}

      {caseStudy && (caseStudy.results.length > 0 || caseStudy.metrics) && (
        <section className="py-16 sm:py-24">
          <div className={cn(container, "grid gap-16 border-t border-line pt-8 lg:grid-cols-2")}>
            {caseStudy.results.length > 0 && (
              <div>
                <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">Results</h2>
                <BulletList items={caseStudy.results} className="mt-6" />
              </div>
            )}

            {caseStudy.metrics && (
              <div>
                <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">
                  Quality Metrics
                </h2>
                <dl className="mt-6 grid grid-cols-2 border-t border-l border-line">
                  {(Object.keys(caseStudy.metrics) as Array<keyof ProjectMetrics>).map((key) => (
                    <div key={key} className="border-r border-b border-line p-6">
                      <dd className="text-4xl font-medium tracking-tight text-ink tabular-nums">
                        {caseStudy.metrics[key]}
                      </dd>
                      <dt className={cn(monoLabel, "mt-2")}>{metricLabels[key]}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>
      )}

      {caseStudy && caseStudy.testimonial && (
        <section className="py-20 sm:py-32">
          <div className={cn(container, "border-t border-line pt-16")}>
            <figure className="mx-auto max-w-4xl text-center">
              <blockquote className="text-3xl leading-snug font-medium tracking-tight text-ink sm:text-4xl">
                <span className="text-signal">&ldquo;</span>
                {caseStudy.testimonial.quote}
                <span className="text-signal">&rdquo;</span>
              </blockquote>

              <figcaption className="mt-10 flex items-center justify-center gap-4">
                <div className="relative size-12 overflow-hidden rounded-full bg-paper-2">
                  {caseStudy.testimonial.image && (
                    <Image
                      src={caseStudy.testimonial.image}
                      alt={caseStudy.testimonial.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-ink">{caseStudy.testimonial.name}</p>
                  <p className="text-xs text-ink-2">
                    {caseStudy.testimonial.role}
                    {caseStudy.testimonial.company ? `, ${caseStudy.testimonial.company}` : ""}
                  </p>
                </div>
              </figcaption>
            </figure>
          </div>
        </section>
      )}

      {caseStudy && (caseStudy.lessonsLearned.length > 0 || caseStudy.nextSteps.length > 0) && (
        <section className="py-16 sm:py-24">
          <div className={cn(container, "grid gap-12 border-t border-line pt-8 lg:grid-cols-2 lg:gap-16")}>
            {caseStudy.lessonsLearned.length > 0 && (
              <div>
                <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">Lessons Learned</h2>
                <BulletList items={caseStudy.lessonsLearned} className="mt-6" />
              </div>
            )}
            {caseStudy.nextSteps.length > 0 && (
              <div>
                <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">Next Steps</h2>
                <BulletList items={caseStudy.nextSteps} className="mt-6" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---- Gallery: an editorial spread ---------------------------- */}
      <section className="pt-8 pb-20 sm:pb-28">
        <div className={cn(container, "grid gap-4 sm:gap-6 lg:grid-cols-12")}>
          {primaryImage && (
            <ParallaxImage
              src={primaryImage}
              alt={`${project.title} showcase 1`}
              sizes="(min-width: 1024px) 90vw, 100vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              wrapperClassName="aspect-[16/9] w-full overflow-hidden rounded-3xl bg-paper-2 lg:col-span-12"
            />
          )}
          {secondaryImage && (
            <ParallaxImage
              src={secondaryImage}
              alt={`${project.title} showcase 2`}
              sizes="(min-width: 1024px) 55vw, 100vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              wrapperClassName="aspect-4/3 w-full overflow-hidden rounded-3xl bg-paper-2 lg:col-span-7"
            />
          )}
          {tertiaryImage && (
            <ParallaxImage
              src={tertiaryImage}
              alt={`${project.title} showcase 3`}
              sizes="(min-width: 1024px) 40vw, 100vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              wrapperClassName="aspect-4/3 w-full overflow-hidden rounded-3xl bg-paper-2 lg:col-span-5 lg:aspect-auto"
            />
          )}
          {restImages.map((image, index) => (
            <ParallaxImage
              key={image + index}
              src={image}
              alt={`${project.title} showcase ${index + 4}`}
              sizes="(min-width: 1024px) 30vw, 100vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              wrapperClassName="aspect-4/3 w-full overflow-hidden rounded-3xl bg-paper-2 lg:col-span-4"
            />
          ))}
        </div>
      </section>

      {/* ---- More projects ------------------------------------------- */}
      {related.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className={container}>
            <div className="flex flex-wrap items-end justify-between gap-8 border-t border-line pt-8">
              <h2 className="heading-section text-ink">
                More Projects
              </h2>
              <PrimaryButton href="/projects">View All Projects</PrimaryButton>
            </div>

            <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:gap-x-12">
              {related.map((item) => (
                <ProjectTile key={item.slug} project={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
