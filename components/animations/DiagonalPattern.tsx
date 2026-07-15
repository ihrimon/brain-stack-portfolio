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
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 14px)",
      }}
    />
  )
}
