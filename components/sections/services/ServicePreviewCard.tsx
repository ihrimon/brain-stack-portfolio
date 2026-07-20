import type { ServiceOffering } from "@/lib/data/shared-types"
import { cn } from "@/lib/utils/cn"
import { resolveIcon } from "@/lib/utils/icons"
import Image from "next/image"

interface ServicePreviewCardProps {
  item: ServiceOffering
  onSelect: () => void
  className?: string
}

export function ServicePreviewCard({
  item,
  onSelect,
  className,
}: ServicePreviewCardProps) {
  const Icon = resolveIcon(item.icon)

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Show ${item.title}`}
      data-cursor="magnetic"
      data-preview-card
      className={cn(
        "group relative flex aspect-3/4 w-24 shrink-0 flex-col justify-end overflow-hidden rounded-2xl bg-neutral-800 p-4 text-left transition-transform duration-300 ease-out will-change-transform focus-visible:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 sm:w-28 lg:aspect-auto lg:h-auto lg:w-full lg:flex-1",
        className
      )}
    >
      {item.image && (
        <Image
          src={item.image}
          alt=""
          fill
          className="object-cover opacity-50 transition-opacity duration-300 group-hover:opacity-70"
          sizes="140px"
        />
      )}
      <div
        className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"
        aria-hidden="true"
      />

      <span className="relative flex size-8 items-center justify-center rounded-lg border border-white/15 bg-white/10 backdrop-blur-md">
        <Icon className="size-3.5 text-white" />
      </span>

      <p className="relative mt-3 text-sm font-medium text-white sm:text-base">
        {item.title}
      </p>
    </button>
  )
}
