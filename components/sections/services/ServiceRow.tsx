"use client"

import { ServiceContent } from "@/components/sections/services/ServiceContent"
import { ServiceVisual } from "@/components/sections/services/ServiceVisual"
import type { ServiceOffering } from "@/lib/data/shared-types"
import { forwardRef, useImperativeHandle, useRef } from "react"

export interface ServiceRowHandle {
  root: HTMLDivElement | null
}

interface ServiceRowProps {
  item: ServiceOffering
  index: number
  priority?: boolean
}

export const ServiceRow = forwardRef<ServiceRowHandle, ServiceRowProps>(
  function ServiceRow({ item, index, priority }, ref) {
    const rootRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      get root() {
        return rootRef.current
      },
    }))

    return (
      <div
        ref={rootRef}
        className="mx-auto grid w-full max-w-400 grid-cols-1 items-start gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 border border-gray-100"
      >
        <ServiceContent item={item} index={index} />
        <ServiceVisual title={item.title} index={index} priority={priority} />
      </div>
    )
  }
)
