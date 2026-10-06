import { cn } from "@/lib/utils/cn"

interface DiagonalPatternProps {
  className?: string
}

export function DiagonalPattern({ className }: DiagonalPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 opacity-50",
        className
      )}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, color-mix(in oklab, var(--color-white) 6%, transparent) 0px, color-mix(in oklab, var(--color-white) 6%, transparent) 1px, transparent 1px, transparent 14px)",
      }}
    />
  )
}
