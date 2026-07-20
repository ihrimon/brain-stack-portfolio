"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"

interface ServiceControlsProps {
  onPrev: () => void
  onNext: () => void
}

export function ServiceControls({ onPrev, onNext }: ServiceControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous service"
        className="flex size-11 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition-colors duration-300 hover:border-white/30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        data-cursor="magnetic"
      >
        <ArrowLeft className="size-4" />
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next service"
        className="flex size-11 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition-colors duration-300 hover:border-white/30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        data-cursor="magnetic"
      >
        <ArrowRight className="size-4" />
      </button>
    </div>
  )
}
