"use client"

import { cn } from "@/lib/utils/cn"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useId } from "react"

interface CircleViewButtonProps {
  label?: string
  className?: string
}

export function CircleViewButton({
  label = "VIEW FULL PROJECT • VIEW FULL PROJECT • ",
  className,
}: CircleViewButtonProps) {
  const pathId = useId()

  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-10 flex scale-75 items-center justify-center opacity-0 transition-all duration-500 ease-out group-hover/card:scale-100 group-hover/card:opacity-100",
        className
      )}
    >
      <span className="relative flex size-20 items-center justify-center rounded-full bg-white text-black shadow-2xl">
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity }}
        >
          <defs>
            <path
              id={pathId}
              fill="none"
              d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
            />
          </defs>
          <text className="fill-black text-[8.5px] font-semibold tracking-widest uppercase">
            <textPath href={`#${pathId}`}>{label}</textPath>
          </text>
        </motion.svg>

        <ArrowUpRight className="size-6" />
      </span>
    </span>
  )
}
