"use client"

import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"

export function ScrollButton() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.5)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleClick = () => {
    if (scrolled) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={scrolled ? "Scroll back to top" : "Scroll down to next section"}
      className={cn(
        "group fixed right-5 bottom-5 z-50 flex size-12 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-neutral-900/90 text-white shadow-lg backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-neutral-800 sm:right-8 sm:bottom-8 dark:bg-white/10 dark:hover:bg-white/20",
        !scrolled && "animate-bounce hover:animate-none"
      )}
      data-cursor="magnetic"
    >
      {scrolled ? (
        <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-1" />
      ) : (
        <ArrowDown className="size-5 transition-transform duration-300 group-hover:translate-y-1" />
      )}
    </button>
  )
}
