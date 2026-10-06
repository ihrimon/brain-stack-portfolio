import { LazyBrain3D } from "@/components/animations/LazyBrain3D"
// CTA buttons are commented out below — restore these imports with them.
// import { PrimaryButton } from "@/components/buttons/PrimaryButton"
// import { ArrowUpRight } from "lucide-react"
// import Link from "next/link"
import { HeroTitle } from "@/components/sections/hero/HeroTitle"
import { ServiceTerminal } from "@/components/sections/hero/ServiceTerminal"
import { heroBannerData, heroMetrics } from "@/lib/data/hero"
import { servicesData } from "@/lib/data/services"
import { cn } from "@/lib/utils/cn"
import type { CSSProperties } from "react"

/** Staggered entrance slot, consumed by the `.rise-*` classes in globals.css. */
const delay = (i: number) => ({ "--i": i }) as CSSProperties

// Supporting content starts rising once the headline has mostly landed.
const AFTER_TITLE = 9

export default function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Backdrop: a soft pool of the signal color plus a real 3D brain
          (holographic point cloud) that turns toward the pointer anywhere
          over the hero. Kept at a moderate opacity and edge-faded so the
          centered copy always reads. It loads only once the page is idle,
          so it never competes with the headline's LCP or hydration. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-40%] left-1/2 size-[75vw] max-w-300 -translate-x-1/2 rounded-full bg-signal/15 blur-[120px] light:bg-signal/8" />
        {/* Exactly one screen tall, so the brain sits at the center of the
            first viewport. The whole brain stays visible; only a band
            behind the paragraph is dimmed so the copy stays crisp. */}
        <div className="absolute top-0 left-1/2 h-svh w-[min(120vw,1400px)] -translate-x-1/2 opacity-80 mask-[linear-gradient(to_bottom,black_25%,rgb(0_0_0/0.3)_30%,rgb(0_0_0/0.3)_46%,black_52%)] light:opacity-90">
          <LazyBrain3D className="mask-[radial-gradient(ellipse_55%_60%_at_50%_50%,black_45%,transparent_85%)]" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-site px-4 lg:px-6">
        {/* Centered stack — headline → paragraph → service terminal — sized
            to fit the first viewport and centered within it. */}
        <div className="flex min-h-svh flex-col items-center justify-center pt-[clamp(5rem,11vh,7rem)] pb-[clamp(1rem,3vh,2rem)] text-center">
          <HeroTitle
            titles={heroBannerData.title}
            highlights={heroBannerData.highlight}
            className="max-w-[12em] text-[clamp(2.5rem,min(4.6vw,7.5vh),5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-ink capitalize"
          />

          {/* rise-up (not rise-fade): on phones this paragraph is the LCP
              element, so it must be visible from the first frame. */}
          <p
            className="rise-up mt-[clamp(1rem,2.5vh,1.75rem)] max-w-2xl text-lg leading-relaxed text-ink/80 sm:text-xl [@media(max-height:820px)]:sm:text-lg"
            style={delay(AFTER_TITLE)}
          >
            {heroBannerData.description}
          </p>

          {/* CTA buttons — temporarily commented out.
          <div
            className="rise-fade mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
            style={delay(AFTER_TITLE + 1)}
          >
            <PrimaryButton href={heroBannerData.button.href}>
              {heroBannerData.button.label}
            </PrimaryButton>
            <Link
              href={heroBannerData.secondaryButton.href}
              data-cursor="magnetic"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink"
            >
              <span className="relative">
                {heroBannerData.secondaryButton.label}
                <span className="absolute inset-x-0 -bottom-1 h-px bg-ink/30 transition-colors duration-500 ease-premium group-hover:bg-ink" />
              </span>
              <ArrowUpRight className="size-4 transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          */}

          <ServiceTerminal
            services={servicesData.items}
            className="rise-fade mt-[clamp(1.5rem,3.5vh,2.5rem)] w-full max-w-2xl text-left"
          />
        </div>

        {/* Proof strip */}
        <dl
          className="rise-fade grid grid-cols-1 border-t border-line pb-10 sm:grid-cols-3"
          style={delay(AFTER_TITLE + 2)}
        >
          {heroMetrics.map((metric, index) => (
            <div
              key={metric.title}
              className={cn(
                "flex flex-col gap-2 py-6 sm:py-8",
                index > 0 && "border-t border-line sm:border-t-0 sm:border-l sm:pl-8"
              )}
            >
              <dt className="font-mono text-xs tracking-wider text-ink-2 uppercase sm:text-sm">
                {metric.title}
              </dt>
              {/* Number and its caption share a vertical center. */}
              <dd className="flex items-center gap-4">
                <span className="text-5xl font-medium tracking-tight text-ink tabular-nums">
                  {metric.value}
                  <span className="text-signal">{metric.suffix}</span>
                </span>
                <span className="max-w-[24ch] text-sm leading-snug text-ink-2 lg:text-base">
                  {metric.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
