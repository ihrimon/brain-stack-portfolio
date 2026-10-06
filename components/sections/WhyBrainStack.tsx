import type { AboutFeaturesData } from "@/lib/data/about-page"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import { ArrowUpRight, Sparkle, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface WhyBrainStackProps {
  features: AboutFeaturesData
}

// Bento tiles share one quiet surface; exactly one tile ("Reliable &
// Future-ready") carries the signal color, so the grid has a single focal
// point instead of competing panels.
const tile = "rounded-3xl border border-line bg-paper-2 p-6 sm:p-8"

export default function WhyBrainStack({ features }: WhyBrainStackProps) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className={tile}>
                <h3 className="text-xl font-medium tracking-tight text-ink sm:text-2xl">
                  {features.plan.title}
                </h3>
                <p className="mt-2 text-sm text-ink-2 sm:text-base">{features.plan.description}</p>

                <div className="mt-8 rounded-2xl border border-line bg-paper p-6">
                  <div className="flex items-center justify-between">
                    <span className="h-6 w-8 rounded-[3px] bg-linear-to-br from-ink/60 to-ink/20" />
                    <span className="text-2xl font-medium text-ink-2">$</span>
                  </div>
                  <p className="mt-8 flex items-center gap-2 font-mono text-[11px] tracking-wide text-ink-2">
                    <span className="size-1.5 shrink-0 rounded-full bg-signal" />
                    {features.plan.note}
                  </p>
                </div>
              </div>

              <div className={tile}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-signal">
                    {Array.from({ length: features.rating.stars }).map((_, index) => (
                      <Star key={index} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-ink">
                    {features.rating.score}
                    <span className="text-ink-2">/5.0</span>
                  </p>
                </div>

                <p className="mt-6 text-[clamp(2.5rem,4vw,3.5rem)] leading-none font-medium tracking-[-0.04em] text-ink">
                  {features.rating.count}
                </p>
                <p className="mt-2 text-sm text-ink-2">{features.rating.title}</p>

                <div className="mt-8 flex -space-x-3">
                  {features.rating.avatars.map((src) => (
                    <div
                      key={src}
                      className="relative size-12 overflow-hidden rounded-full border-2 border-paper-2"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              <div className={`${tile} flex flex-col justify-between`}>
                <div>
                  <p className="text-4xl font-medium tracking-[-0.04em] text-ink">
                    {features.support.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-2">{features.support.subtitle}</p>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex w-fit items-center gap-2 rounded-full border border-line bg-paper px-3 py-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-signal text-[10px] font-semibold text-signal-ink">
                      AI
                    </span>
                    <span className="text-xs text-ink">Hey there!</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-full px-3 py-2">
                    <span className="text-xs text-ink-2">{features.support.message}</span>
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-line text-xs text-ink-2">
                      +
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative flex min-h-40 items-end overflow-hidden rounded-3xl bg-signal p-6 sm:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-static-white/15 blur-2xl"
                />
                <h3 className="relative text-xl leading-tight font-medium tracking-tight text-signal-ink sm:text-2xl">
                  {features.reliable.title}
                </h3>
              </div>

              <div className={tile}>
                <h3 className="text-lg font-medium tracking-tight text-ink sm:text-xl">
                  {features.stack.title}
                </h3>
                <p className="mt-1 text-sm text-ink-2">{features.stack.description}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {features.stack.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-ink-2"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`${tile} relative flex flex-col justify-between overflow-hidden sm:p-10`}>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-signal/15 blur-3xl"
            />

            <div className="relative">
              <h3 className="max-w-xs text-2xl leading-[1.05] font-medium tracking-[-0.03em] text-ink sm:text-3xl">
                {features.strategy.title}
              </h3>

              <ul className="mt-8 divide-y divide-line border-y border-line">
                {features.strategy.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 py-3 text-sm text-ink sm:text-base">
                    <Sparkle className="size-4 shrink-0 text-signal" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={features.strategy.button.href}
              data-cursor="magnetic"
              className="relative mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-xs font-semibold tracking-wide text-paper uppercase transition-colors duration-300 hover:bg-signal hover:text-signal-ink"
            >
              {features.strategy.button.label}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
