import { processData } from "@/lib/data/process"
import { cn } from "@/lib/utils"
import Link from "next/link"

const accentClasses = ["bg-brand-secondary", "bg-brand-accent", "bg-brand-primary"]

export default function EngineeringProcess() {
  return (
    <section id="process" className="relative overflow-hidden bg-brand-dark py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 hidden h-64 w-64 opacity-40 sm:block"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-24 left-13 hidden size-2 rounded-full bg-brand-accent sm:block"
      />

      <div className="relative mx-auto max-w-400 px-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-2xl">
            <span className="w-fit rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white sm:text-sm">
              {processData.badge}
            </span>

            <h2 className="mt-6 text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl">
              {processData.title}
            </h2>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
              {processData.description}
            </p>
          </div>

          <Link
            href="/contact"
            className="mt-2 flex items-center gap-3 text-sm font-medium text-white hover:text-white/80"
            data-cursor="magnetic"
          >
            <span className="h-px w-10 bg-white/40" />
            Let&apos;s Work Together
          </Link>
        </div>

        <div className="relative mt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-16 top-28 hidden border-t border-dashed border-white/15 lg:block"
          >
            <span className="absolute top-0 left-1/3 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500" />
            <span className="absolute top-0 left-2/3 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {processData.items.map((item, index) => (
              <div
                key={item.title}
                className={cn(
                  "relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 p-8",
                  index === 1 && "lg:-translate-y-10"
                )}
              >
                <div
                  aria-hidden="true"
                  className="absolute top-6 right-6 grid grid-cols-3 grid-rows-2 gap-1 opacity-90"
                >
                  <span
                    className={cn(
                      "col-start-2 row-start-1 size-3 rounded-[3px]",
                      accentClasses[index % accentClasses.length]
                    )}
                  />
                  <span
                    className={cn(
                      "col-start-3 row-start-1 size-3 rounded-[3px]",
                      accentClasses[index % accentClasses.length]
                    )}
                  />
                  <span
                    className={cn(
                      "col-start-1 row-start-2 size-3 rounded-[3px]",
                      accentClasses[index % accentClasses.length]
                    )}
                  />
                  <span
                    className={cn(
                      "col-start-2 row-start-2 size-3 rounded-[3px]",
                      accentClasses[index % accentClasses.length]
                    )}
                  />
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-medium tracking-wide text-white">
                  <item.icon className="size-3.5" />
                  STEP : {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-6 text-2xl font-medium text-white">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
                  {item.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
