import { cn } from "@/lib/utils"

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 pt-12 sm:px-6 sm:pt-14 md:px-10 md:pt-16 lg:px-12 lg:pt-20",
        className
      )}
    >
      {children}
    </div>
  )
}
