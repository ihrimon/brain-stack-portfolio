// "use client"

// import "@/lib/GSAPAnimations"
// import { getLenis } from "@/lib/lenis"
// import { cn } from "@/lib/utils"
// import { useGSAP } from "@gsap/react"
// import gsap from "gsap"
// import { ScrollTrigger } from "gsap/all"
// import { Pause, Play, X } from "lucide-react"
// import { useEffect, useLayoutEffect, useRef, useState } from "react"

// gsap.registerPlugin(ScrollTrigger)

// export default function ProjectVideo() {
//   const sectionRef = useRef<HTMLDivElement>(null)
//   const boxRef = useRef<HTMLDivElement>(null)
//   const videoRef = useRef<HTMLVideoElement>(null)

//   const closeButtonRef = useRef<HTMLButtonElement>(null)

//   const [isFullscreen, setIsFullscreen] = useState(false)
//   const [isPlaying, setIsPlaying] = useState(true)
//   const userClosedRef = useRef(false)
//   const growTriggerRef = useRef<ScrollTrigger | null>(null)

//   // The close button is a fixed-position sibling (not a child of box) so its
//   // own size stays constant regardless of box's scale tween. Its top/left is
//   // synced imperatively from box's real bounding rect, offset just past the
//   // top-right corner, so it always reads as sitting outside the video —
//   // whether box is mid-grow, fully expanded, or shrinking back on close.
//   const syncCloseButtonPosition = () => {
//     const box = boxRef.current
//     const button = closeButtonRef.current
//     if (!box || !button) return

//     const rect = box.getBoundingClientRect()
//     button.style.top = `${rect.top - 12}px`
//     button.style.left = `${rect.right + 12}px`
//   }

//   useGSAP(
//     () => {
//       if (!sectionRef.current || !boxRef.current || !videoRef.current) return

//       const video = videoRef.current
//       const box = boxRef.current
//       const HANDOFF = "top 20%"

//       // Stage 1: grows from a small preview (scale 0.5) up to its natural
//       // size (scale 1) as the section scrolls into view.
//       gsap.fromTo(
//         box,
//         { scale: 0.5 },
//         {
//           scale: 1,
//           ease: "none",
//           scrollTrigger: {
//             trigger: sectionRef.current,
//             start: "top 85%",
//             end: HANDOFF,
//             scrub: true,
//           },
//         }
//       )

//       // Stage 2: once it's reached its natural size, the box pins in place
//       // (stuck on screen). Scrolling further first holds briefly at scale 1,
//       // then continues growing on to the modal size (1.5x) while still
//       // pinned — that final size is what fits the whole video as a modal.
//       // Only once fully grown does the modal "open" (dark backdrop, close
//       // button, unmuted audio); scrolling back up reverses it.
//       const growTl = gsap.timeline({
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: HANDOFF,
//           end: "+=100%",
//           scrub: true,
//           pin: box,
//           pinSpacing: true,
//           onLeave: () => {
//             if (!userClosedRef.current) {
//               setIsFullscreen(true)
//               // Detach the box from the pin's own (top-aligned) position math
//               // and lock it dead-center in the viewport on both axes, so the
//               // modal reads as centered "from all sides" regardless of where
//               // it happened to sit in the document when the pin engaged.
//               gsap.set(box, {
//                 position: "fixed",
//                 top: "50%",
//                 left: "50%",
//                 xPercent: -50,
//                 yPercent: -50,
//               })
//             }
//           },
//           onEnterBack: () => {
//             userClosedRef.current = false
//             setIsFullscreen(false)
//             gsap.set(box, { clearProps: "position,top,left,xPercent,yPercent" })
//           },
//         },
//       })

//       growTl
//         .to(box, { scale: 1, duration: 0.4, ease: "none" })
//         .to(box, { scale: 1.2, duration: 0.2, ease: "none" })
//         .to(box, { scale: 1.35, duration: 0.2, ease: "none" })
//         .to(box, { scale: 1.5, duration: 0.2, ease: "none" })

//       growTriggerRef.current = growTl.scrollTrigger ?? null

//       // Autoplay/pause based on overall section visibility.
//       ScrollTrigger.create({
//         trigger: sectionRef.current,
//         start: "top 80%",
//         end: "bottom 20%",
//         onEnter: () => video.play().catch(() => {}),
//         onEnterBack: () => video.play().catch(() => {}),
//         onLeave: () => video.pause(),
//         onLeaveBack: () => video.pause(),
//       })

//       return () => {
//         ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
//       }
//     },
//     { scope: sectionRef }
//   )

//   // Block interaction with the rest of the page while the modal is open.
//   // Lenis drives scroll itself (independent of native scroll/overflow), so
//   // it has to be stopped explicitly or the page keeps smooth-scrolling
//   // underneath the "blocking" modal.
//   useEffect(() => {
//     document.body.style.overflow = isFullscreen ? "hidden" : ""

//     const lenis = getLenis()
//     if (isFullscreen) {
//       lenis?.stop()
//     } else {
//       lenis?.start()
//     }

//     return () => {
//       document.body.style.overflow = ""
//       lenis?.start()
//     }
//   }, [isFullscreen])

//   // Unmute once the video opens as a modal; mute again in the small inline preview.
//   useEffect(() => {
//     const video = videoRef.current
//     if (!video) return
//     video.muted = !isFullscreen
//   }, [isFullscreen])

//   // Anchor the close button to box's real corner the instant it mounts
//   // (useLayoutEffect so there's no one-frame flash at a stale position),
//   // and keep it in sync if the viewport is resized while open.
//   useLayoutEffect(() => {
//     if (!isFullscreen) return
//     syncCloseButtonPosition()
//     window.addEventListener("resize", syncCloseButtonPosition)
//     return () => window.removeEventListener("resize", syncCloseButtonPosition)
//   }, [isFullscreen])

//   const closeFullscreen = () => {
//     userClosedRef.current = true

//     const box = boxRef.current
//     const trigger = growTriggerRef.current
//     if (!box) {
//       setIsFullscreen(false)
//       return
//     }

//     // Release the pin outright instead of rewinding scroll back into its
//     // start — rewinding left the user back at the top of the same 100vh
//     // pinned range, forcing them to scroll all the way back through it
//     // before reaching the next section (the "stuck" bug). Killing it here
//     // collapses that reserved scroll distance immediately, so the page is
//     // simply free to continue from wherever the user already is.
//     trigger?.kill()
//     growTriggerRef.current = null

//     // The kill() above reverts box to its pre-pin inline styles, so the
//     // centered-fixed override has to be (re)applied after, not before —
//     // it keeps the box locked dead-center on screen while it shrinks.
//     gsap.set(box, {
//       position: "fixed",
//       top: "50%",
//       left: "50%",
//       xPercent: -50,
//       yPercent: -50,
//     })

//     gsap.to(box, {
//       scale: 1,
//       duration: 0.6,
//       ease: "power3.inOut",
//       onUpdate: syncCloseButtonPosition,
//       onComplete: () => {
//         gsap.set(box, { clearProps: "position,top,left,xPercent,yPercent" })
//         setIsFullscreen(false)
//         ScrollTrigger.refresh()
//       },
//     })
//   }

//   const toggleVideo = () => {
//     const video = videoRef.current
//     if (!video) return

//     if (video.paused) {
//       video.play().catch(() => {})
//     } else {
//       video.pause()
//     }
//   }

//   return (
//     <>
//       <div className="px-5 mb-28">
//         {/*
//           sectionRef's child list must stay stable (just `box`, always) —
//           GSAP's pin mechanism reparents `box` into its own spacer div, and
//           if React also has to add/remove conditional siblings in this same
//           parent (the backdrop, the close button) the two DOM-mutation
//           systems collide (`insertBefore`/`removeChild` on stale node
//           references). So the fullscreen-only overlay and close button are
//           rendered as siblings of this whole block instead, never sharing a
//           parent with the pinned element.
//         */}
//         <div
//           ref={sectionRef}
//           className="relative flex items-start justify-center"
//           style={{ height: "160vh" }}
//         >
//           <div
//             ref={boxRef}
//             className="group relative z-100 mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
//           >
//             <video
//               ref={videoRef}
//               className={cn(
//                 "h-full w-full",
//                 isFullscreen ? "bg-black object-contain" : "object-cover"
//               )}
//               muted
//               loop
//               playsInline
//               autoPlay
//               onPlay={() => setIsPlaying(true)}
//               onPause={() => setIsPlaying(false)}
//             >
//               <source src="/short.mp4" type="video/mp4" />
//             </video>

//             <button
//               type="button"
//               onClick={toggleVideo}
//               aria-label={isPlaying ? "Pause video" : "Play video"}
//               className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
//               data-cursor="magnetic"
//             >
//               <span className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-white/90 text-black shadow-2xl backdrop-blur transition-transform duration-300 hover:scale-110">
//                 {isPlaying ? (
//                   <Pause className="size-6 fill-current" />
//                 ) : (
//                   <Play className="ml-1 size-6 fill-current" />
//                 )}
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {isFullscreen && (
//         <>
//           <div
//             className="fixed inset-0 z-90 bg-black/80 backdrop-blur-sm"
//             aria-hidden="true"
//           />

//           <button
//             ref={closeButtonRef}
//             type="button"
//             onClick={closeFullscreen}
//             aria-label="Close video"
//             className="group fixed z-110 flex size-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition-transform duration-300 hover:scale-110"
//             data-cursor="magnetic"
//           >
//             <span
//               aria-hidden="true"
//               className="absolute inset-0 rounded-full bg-linear-to-br from-white/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100"
//             />
//             <span
//               aria-hidden="true"
//               className="absolute inset-0 scale-100 rounded-full border border-white/40 opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-0"
//             />
//             <X className="relative size-5 transition-transform duration-500 group-hover:rotate-180" />
//           </button>
//         </>
//       )}
//     </>
//   )
// }


"use client"

import "@/lib/GSAPAnimations"
import { getLenis } from "@/lib/lenis"
import { cn } from "@/lib/utils"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { Pause, Play, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

gsap.registerPlugin(ScrollTrigger)

export default function ProjectVideo() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const userClosedRef = useRef(false)

  useGSAP(
    () => {
      if (!sectionRef.current || !boxRef.current || !videoRef.current) return

      const video = videoRef.current

      // Grows from a small preview (scale 0.5) up to its natural size as
      // the section scrolls into view, before the modal takes over.
      gsap.fromTo(
        boxRef.current,
        { scale: 0.5 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "center 60%",
            scrub: true,
          },
        }
      )

      // Autoplay once the section enters the viewport.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => video.play().catch(() => {}),
        onEnterBack: () => video.play().catch(() => {}),
        onLeave: () => video.pause(),
        onLeaveBack: () => video.pause(),
      })

      // Open as a blocking modal once the section crosses viewport center.
      // Only the close button dismisses it — scrolling further doesn't.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "center 60%",
        onEnter: () => {
          if (!userClosedRef.current) setIsFullscreen(true)
        },
        onLeaveBack: () => {
          userClosedRef.current = false
          setIsFullscreen(false)
        },
      })

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    },
    { scope: sectionRef }
  )

  // Block interaction with the rest of the page while the modal is open.
  // Lenis drives scroll itself (independent of native scroll/overflow), so
  // it has to be stopped explicitly or the page keeps smooth-scrolling
  // underneath the "blocking" modal.
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : ""

    const lenis = getLenis()
    if (isFullscreen) {
      lenis?.stop()
    } else {
      lenis?.start()
    }

    return () => {
      document.body.style.overflow = ""
      lenis?.start()
    }
  }, [isFullscreen])

  // Unmute once the video opens as a modal; mute again in the small inline preview.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !isFullscreen
  }, [isFullscreen])

  const closeFullscreen = () => {
    userClosedRef.current = true
    setIsFullscreen(false)
  }

  const toggleVideo = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }

  return (
    <div className="px-5">
      <div
        ref={sectionRef}
        className="relative flex items-start justify-center"
        style={{ height: "160vh" }}
      >
        {isFullscreen && (
          <div
            className="fixed inset-0 z-90 bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />
        )}

        <div
          ref={boxRef}
          className={cn(
            "group overflow-hidden border border-border bg-card shadow-2xl transition-[position,inset,width,height,margin,border-radius] duration-500 ease-in-out",
            isFullscreen
              ? "fixed inset-0 z-100 m-auto rounded-3xl md:h-[80vh] md:w-[99vw] md:max-w-7xl"
              : "relative mx-auto aspect-video w-full max-w-4xl rounded-3xl"
          )}
        >
          <video
            ref={videoRef}
            className={cn(
              "h-full w-full",
              isFullscreen ? "bg-black object-contain" : "object-cover"
            )}
            muted
            loop
            playsInline
            autoPlay
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src="/short.mp4" type="video/mp4" />
          </video>

          <button
            type="button"
            onClick={toggleVideo}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            data-cursor="magnetic"
          >
            <span className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-white/90 text-black shadow-2xl backdrop-blur transition-transform duration-300 hover:scale-110">
              {isPlaying ? (
                <Pause className="size-6 fill-current" />
              ) : (
                <Play className="ml-1 size-6 fill-current" />
              )}
            </span>
          </button>

          {isFullscreen && (
            <button
              type="button"
              onClick={closeFullscreen}
              aria-label="Close video"
              className="absolute top-4 right-4 z-10 flex size-12 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white backdrop-blur hover:border hover:bg-white/20 hover:text-background"
              data-cursor="magnetic"
            >
              <X className="size-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
