"use client"

import { Button } from "@/components/ui/button"
import "@/lib/GSAPAnimations"
import { caseStudies } from "@/lib/caseStudies"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger, SplitText } from "gsap/all"
import { Sparkles } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"
import { SectionHeading } from "../shared/SectionHeading"
import { Marquee } from "../shared/marquee"

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const caseStudiesRef = useRef(null)

  useGSAP(() => {
    const headingElement = heroRef?.current?.querySelector("h1")
    if (headingElement) {
      SplitText.create(headingElement, {
        type: "lines, words",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.words, {
            duration: 0.6,
            y: 10,
            opacity: 0.5,
            filter: "blur(6px)",
            autoAlpha: 0,
            stagger: 0.06,
          })
        },
      })
    }

    if (heroRef?.current && caseStudiesRef?.current) {
      gsap.effects.fadeUpOnScroll(caseStudiesRef.current, {
        start: "top 80%",
        duration: 0.8,
        markers: false,
      })
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div className="item-center flex flex-col flex-nowrap p-5">
      <div
        ref={heroRef}
        className="hero space-y-4 pt-30 pb-8 md:pt-24 md:pb-14 md:text-center lg:pt-30 lg:pb-16"
      >
        <SectionHeading
          badge="AI Strategy & Development"
          heading="Cutting-edge Software, Engineered End to End"
          description="We design and build scalable digital products — mobile, web, and AI — that help businesses grow faster, innovate effectively, and stay competitive across the US, UK and Europe."
          icon={Sparkles}
          size="lg"
          align="center"
          as="h1"
          className="heading mx-auto max-w-4/5"
          headingClassName="md:mx-auto md:w-2.5/3 leading-tight"
          showDescriptionToScreenReaders={true}
        />

        <div
          aria-label="Call to action buttons"
          className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-center"
        >
          <Button
            aria-describedby="founder-cta-description"
            type="button"
            className="cursor-pointer"
          >
            Talk to our founder
          </Button>
          <Button
            aria-describedby="case-studies-cta-description"
            type="button"
            className="cursor-pointer"
            variant={"outline"}
          >
            View Case Studios
          </Button>
        </div>

        <div
          className="relative"
          role="region"
          aria-label="Our trusted clients"
        >
          <h2 className="sr-only!">{`Companies We've Helped Transform`}</h2>
          <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-12 bg-linear-to-r from-gray-50 via-gray-50/90 to-transparent md:w-48"></div>

          {/* Right fade gradient */}
          <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-12 bg-linear-to-l from-gray-50 via-gray-50/90 to-transparent md:w-48"></div>

          <Marquee pauseOnHover className="mt-14">
            {caseStudies.map((caseStudy, index) => (
              <div
                key={`${caseStudy.name}-${index}`}
                className="group mx-1 shrink-0 cursor-pointer md:mx-4"
              >
                <div className="relative flex h-16 items-center justify-center p-4 transition-all duration-300 ease-in-out">
                  <Image
                    src={caseStudy.logo_src}
                    alt={`${caseStudy.project_title} logo`}
                    className={`max-h-full max-w-full object-contain opacity-80 grayscale filter transition-all duration-300 ease-in-out hover:opacity-100 hover:brightness-110 hover:grayscale-0`}
                    loading="lazy"
                    decoding="async"
                    width={100}
                    height={80}
                  />
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  )
}
