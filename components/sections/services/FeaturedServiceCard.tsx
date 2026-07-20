import type { ServiceOffering } from "@/lib/data/shared-types"
import { resolveIcon } from "@/lib/utils/icons"
import Image from "next/image"
import { forwardRef } from "react"
import { PrimaryButton } from "@/components/buttons/PrimaryButton"

interface FeaturedServiceCardProps {
  item: ServiceOffering
}

// forwardRef so ServiceCarousel can crossfade this exact DOM node when the
// active service changes, without ServicesSection needing to know that
// detail — see ServiceCarousel.tsx.
export const FeaturedServiceCard = forwardRef<
  HTMLDivElement,
  FeaturedServiceCardProps
>(function FeaturedServiceCard({ item }, ref) {
  const Icon = resolveIcon(item.icon)

  return (
    <div
      ref={ref}
      data-featured-card
      className="relative flex aspect-4/3 w-full flex-col justify-end overflow-hidden rounded-3xl bg-neutral-800 p-8 will-change-transform lg:aspect-auto lg:min-h-125 sm:p-10"
    >
      {item.image && (
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 65vw, 90vw"
          priority
        />
      )}
      <div
        className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6">
        <span className="flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
          <Icon className="size-5 text-white" />
        </span>

        <div>
          <h3 className="text-3xl font-medium text-white sm:text-4xl">
            {item.title}
          </h3>

          {item.shortDescription && (
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              {item.shortDescription}
            </p>
          )}
        </div>

        {item.technologies && item.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-md"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {item.buttonLabel && item.buttonHref && (
          <PrimaryButton href={item.buttonHref} className="mt-2 w-fit">
            {item.buttonLabel}
          </PrimaryButton>
        )}
      </div>
    </div>
  )
})
