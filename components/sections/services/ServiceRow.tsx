"use client"

import { ServiceContent } from "@/components/sections/services/ServiceContent"
import { ServiceVisual } from "@/components/sections/services/ServiceVisual"
import type { ServiceOffering } from "@/lib/data/shared-types"

interface ServiceRowProps {
  item: ServiceOffering
  index: number
  priority?: boolean
}

export function ServiceRow({ item, index, priority }: ServiceRowProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
      <ServiceContent item={item} index={index} />
      <ServiceVisual title={item.title} index={index} priority={priority} />
    </div>
  )
}
