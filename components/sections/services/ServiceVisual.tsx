import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import Image from "next/image"

// Only 4 image pairs (8 assets) exist for 5 services — the last item cycles
// back to the first pair rather than needing a 5th unique pair shot.
const IMAGE_PAIRS = [
  ["/images/services/service-1.avif", "/images/services/service-2.avif"],
  ["/images/services/service-3.avif", "/images/services/service-4.avif"],
  ["/images/services/service-5.avif", "/images/services/service-6.avif"],
  ["/images/services/service-7.avif", "/images/services/service-8.avif"],
] as const

const IMAGE_HEIGHT = "h-[320px] sm:h-[400px] lg:h-[500px]"

interface ServiceVisualProps {
  title: string
  index: number
  priority?: boolean
}

/**
 * Two full-size images side by side (not layered/overlapping), equal
 * height, the second one offset down from the top of the first. No
 * max-width cap — this fills whatever width its container (the desktop
 * sliding window or the mobile row's grid cell, both in ServicesStack.tsx)
 * gives it. Whatever that container is needs to reserve at least
 * image-height-plus-offset of vertical room, or the offset image's bottom
 * edge gets clipped.
 */
export function ServiceVisual({ title, index, priority }: ServiceVisualProps) {
  const [front, back] = IMAGE_PAIRS[index % IMAGE_PAIRS.length]

  return (
    <div data-service-visual className="flex w-full items-start gap-4 sm:gap-6">
      <div
        className={`relative w-1/2 overflow-hidden rounded-3xl shadow-2xl ${IMAGE_HEIGHT}`}
      >
        <Image
          src={front}
          alt={title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 32vw, 46vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
        />
      </div>

      <div
        className={`relative mt-8 w-1/2 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 sm:mt-12 lg:mt-14 ${IMAGE_HEIGHT}`}
      >
        <Image
          src={back}
          alt=""
          fill
          sizes="(min-width: 1024px) 32vw, 46vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
        />
      </div>
    </div>
  )
}
