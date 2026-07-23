import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import type { ServiceOffering } from "@/lib/data/shared-types"

interface ServiceContentProps {
  item: ServiceOffering
  index: number
}

/**
 * Text pane for the desktop services stack. On `lg`+, ServicesStack.tsx
 * renders exactly one of these at a time (for the currently-active index)
 * inside a box that's pinned via ScrollTrigger for the whole scroll through
 * every service — so this component never itself moves or re-mounts mid
 * transition, it just swaps which item's text it's showing.
 *
 * `h-full flex flex-col justify-center` vertically centers the text within
 * the grid row's height (ServicesStack.tsx no longer sets `items-start` on
 * that grid, so this cell stretches to match the image column's fixed
 * height) — every service gets the same box height, so centering within it
 * lands in roughly the same spot each time rather than drifting per item.
 * See ServiceVisual.tsx for the half that's meant to visibly change
 * instead, and ServiceRow.tsx, which pairs this with a visual for the plain
 * mobile/reduced-motion fallback list, where content renders in normal flow.
 */
export function ServiceContent({ item, index }: ServiceContentProps) {
  return (
    <div className="flex h-full flex-col justify-center">
      <span className="text-sm font-medium tracking-widest text-white/40">
        {String(index + 1).padStart(2, "0")}
      </span>

      <h3 className="mt-4 text-3xl leading-tight font-medium tracking-tight text-white sm:text-4xl md:text-5xl">
        {item.title}
      </h3>

      <div className="mt-6 h-px w-16 bg-brand-primary" aria-hidden="true" />

      {item.shortDescription && (
        <p className="mt-6 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
          {item.shortDescription}
        </p>
      )}

      {item.items && item.items.length > 0 && (
        <p className="mt-6 max-w-md text-2xl leading-relaxed text-white">
          {item.items.join(" — ")}
        </p>
      )}

      {item.buttonLabel && item.buttonHref && (
        <PrimaryButton
          href={item.buttonHref}
          variant='outline'
          className="mt-8 w-fit"
        >
          {item.buttonLabel}
        </PrimaryButton>
      )}
    </div>
  )
}
