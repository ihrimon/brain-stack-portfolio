import { aboutFeaturesData as features } from "@/lib/data/about-page"
import { ArrowUpRight, Sparkle, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function WhyBrainStack() {
  return (
    <section className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="rounded-3xl bg-neutral-900 p-6 sm:p-8">
                <h3 className="text-xl font-medium text-white sm:text-2xl">
                  {features.plan.title}
                </h3>
                <p className="mt-2 text-sm text-white/50 sm:text-base">
                  {features.plan.description}
                </p>

                <div className="mt-8 rounded-xl bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <span className="h-6 w-8 rounded-[3px] bg-linear-to-br from-amber-300 to-amber-500" />
                    <span className="text-2xl font-semibold text-white/70">
                      $
                    </span>
                  </div>

                  <p className="mt-8 flex items-center gap-2 text-xs text-white/60">
                    <span className="size-1.5 shrink-0 rounded-full bg-white/50" />
                    {features.plan.note}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-neutral-900 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: features.rating.stars }).map(
                      (_, index) => (
                        <Star key={index} className="size-4 fill-current" />
                      )
                    )}
                  </div>

                  <p className="text-sm font-medium text-white">
                    {features.rating.score}
                    <span className="text-white/40">/5.0</span>
                  </p>
                </div>

                <p className="mt-2 text-sm text-white/50">
                  {features.rating.count} {features.rating.title}
                </p>

                <div className="mt-10 flex -space-x-3">
                  {features.rating.avatars.map((src) => (
                    <div
                      key={src}
                      className="relative size-12 overflow-hidden rounded-full border-2 border-neutral-900"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              <div className="flex flex-col justify-between rounded-3xl bg-neutral-900 p-6">
                <div>
                  <p className="text-3xl font-semibold text-white">
                    {features.support.title}
                  </p>
                  <p className="mt-1 text-sm text-white/50">
                    {features.support.subtitle}
                  </p>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex w-fit items-center gap-2 rounded-full bg-white/5 px-3 py-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-accent text-[10px] font-semibold text-white">
                      AI
                    </span>
                    <span className="text-xs text-white/70">Hey there!</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 rounded-full px-3 py-2">
                    <span className="text-xs text-white/40">
                      {features.support.message}
                    </span>
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs text-white/60">
                      +
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative flex min-h-40 items-end overflow-hidden rounded-3xl bg-linear-to-br from-neutral-800 to-neutral-950 p-6">
                <h3 className="text-lg font-semibold text-white sm:text-xl">
                  {features.reliable.title}
                </h3>
              </div>

              <div className="rounded-3xl bg-neutral-900 p-6">
                <h3 className="text-lg font-semibold text-white sm:text-xl">
                  {features.stack.title}
                </h3>
                <p className="mt-1 text-sm text-white/50">
                  {features.stack.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {features.stack.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full px-3 py-1 text-xs text-white/70"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-neutral-900 p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-brand-accent/20 blur-3xl"
            />

            <div className="relative">
              <h3 className="max-w-xs text-2xl leading-tight font-medium text-white sm:text-3xl">
                {features.strategy.title}
              </h3>

              <ul className="mt-8 space-y-3">
                {features.strategy.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-white/70 sm:text-base"
                  >
                    <Sparkle className="size-4 shrink-0 text-white/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={features.strategy.button.href}
              data-cursor="magnetic"
              className="relative mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-semibold tracking-wide text-black uppercase transition-colors duration-300 hover:bg-white/90"
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
