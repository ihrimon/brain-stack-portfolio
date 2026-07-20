import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import type { ServiceOffering } from "@/lib/data/shared-types"
import { Check } from "lucide-react"

interface ServiceDetailsProps {
  item: ServiceOffering
}

export function ServiceDetails({ item }: ServiceDetailsProps) {
  return (
    <div className="grid gap-10 border-t border-white/10 pt-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
      <div>
        <h4 className="text-sm font-medium tracking-widest text-white/40 uppercase">
          About {item.title}
        </h4>

        {item.fullDescription && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
            {item.fullDescription}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {item.features && item.features.length > 0 && (
          <ul className="flex flex-col gap-3">
            {item.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 text-white/70"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-brand-primary">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        )}

        <PrimaryButton href="/contact" className="w-fit">
          Start Your Project
        </PrimaryButton>
      </div>
    </div>
  )
}
