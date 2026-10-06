"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { HeadingSection } from "@/components/common/HeadingSection"
import "@/lib/animations/gsap-animations"
import type { FoundersData } from "@/lib/data/home-page"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowUpRight, BookOpen, Network, User } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"

interface FoundersSectionProps {
  data: FoundersData
}

// lucide-react ships no brand/logo icons, so the LinkedIn glyph is drawn
// directly (path from the MIT-licensed simple-icons set).
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export default function FoundersSection({ data }: FoundersSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll(titleRef.current)
    },
    { scope: sectionRef }
  )

  return (
    <section id="founders" ref={sectionRef} className="py-20 sm:py-28">
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <HeadingSection
          badge={data.badge}
          title={data.title}
          titleRef={titleRef}
          description={data.description}
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {data.members.map((member) => (
            <article
              key={member.name}
              // Phones: one stack (photo → identity → story).
              // md (one card per row): photo with name/title/connect below it
              // on the left, the story (bio → skills) on the right.
              // lg (two cards side by side): photo beside the identity block,
              // the story full width underneath.
              className="group grid gap-x-8 gap-y-6 rounded-3xl bg-paper-2 p-5 sm:p-8 md:grid-cols-[minmax(0,17rem)_1fr] md:grid-rows-[auto_1fr] md:[grid-template-areas:'photo_story'_'identity_story'] lg:grid-cols-[10rem_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-6 lg:gap-y-8 lg:[grid-template-areas:'photo_identity'_'story_story']"
            >
              <div className="relative aspect-square w-full max-w-80 overflow-hidden rounded-2xl bg-paper md:max-w-none md:[grid-area:photo] lg:aspect-auto lg:h-full lg:min-h-40">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-[center_20%] grayscale transition-[filter,scale] duration-700 ease-premium group-hover:scale-[1.04] group-hover:grayscale-0"
                  sizes="(min-width: 1024px) 160px, (min-width: 768px) 272px, 100vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>

              {/* Identity card: name, designation and the connect row share one
                  panel. On lg it stretches to the photo's height, so the two
                  sit side by side as aligned blocks. */}
              <div className="flex flex-col rounded-2xl bg-paper p-5 md:[grid-area:identity] lg:self-stretch">
                <h3 className="text-2xl leading-tight font-medium tracking-[-0.03em] text-ink sm:text-3xl">
                  {member.name}
                </h3>
                <span className="mt-3 mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] tracking-wider text-ink-2 uppercase">
                  <User className="size-3.5 text-signal" />
                  {member.title}
                </span>

                <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">
                      Let&apos;s Connect
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-ink-2">
                      Open to collaboration and new projects.
                    </p>
                  </div>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="me noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="group/cta relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover"
                  >
                    {/* LinkedIn mark at rest; on hover it slides out up-right and
                        an arrow slides in from the bottom-left. */}
                    <LinkedinIcon className="size-4 transition-transform duration-500 ease-premium group-hover/cta:translate-x-6 group-hover/cta:-translate-y-6" />
                    <ArrowUpRight
                      aria-hidden="true"
                      className="absolute size-4.5 -translate-x-6 translate-y-6 transition-transform duration-500 ease-premium group-hover/cta:translate-x-0 group-hover/cta:translate-y-0"
                    />
                  </a>
                </div>
              </div>

              <div className="flex flex-col md:pt-2 md:[grid-area:story] lg:pt-0">
                <p className="text-[15px] leading-relaxed text-ink-2">
                  {member.bio}
                </p>
                <p className="mt-5 text-[15px] leading-relaxed font-medium text-ink">
                  {member.shortBio}
                </p>

                {/* mt-auto on lg: both cards end their skills on one line. */}
                <div className="mt-8 lg:mt-auto lg:pt-8">
                  <div className="border-t border-line pt-6">
                    <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-ink-2 uppercase">
                      <BookOpen className="size-3.5 text-signal" />
                      Core Skills
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <blockquote className="mt-20 flex flex-col items-start gap-8 border-t border-line pt-10 lg:flex-row lg:items-center lg:gap-10">
          <Network
            aria-hidden="true"
            className="size-12 shrink-0 text-signal"
          />
          <p className="max-w-xl text-xl leading-snug tracking-tight text-ink sm:text-2xl">
            {data.footnote}
          </p>
          {/* ml-auto pins the button to the row's right edge, opposite the icon. */}
          <div className="shrink-0 lg:ml-auto">
            <PrimaryButton href="/contact">
              Let&apos;s Work Together
            </PrimaryButton>
          </div>
        </blockquote>
      </div>
    </section>
  )
}
