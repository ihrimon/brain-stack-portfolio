import { SectionBadge } from "@/components/common/SectionBadge"
import type { TeamMembersData } from "@/lib/data/about-page"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import Image from "next/image"

interface AboutTeamSectionProps {
  data: TeamMembersData
}

export default function AboutTeamSection({ data }: AboutTeamSectionProps) {
  return (
    <section id="team" className="py-20 sm:py-28">
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <div className="grid gap-6 border-t border-line pt-8 lg:grid-cols-[auto_1fr] lg:gap-10">
          <SectionBadge>{data.badge}</SectionBadge>
          <h2 className="max-w-3xl heading-section text-ink uppercase">
            {data.title}
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {data.members.map((member) => (
            <figure key={member.name} className="group">
              {/* Monochrome at rest, color on hover — same as Founders. */}
              <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-paper-2">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale transition-[filter,scale] duration-700 ease-premium group-hover:scale-[1.03] group-hover:grayscale-0"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>

              <figcaption className="mt-4 border-t border-line pt-3">
                <p className="text-lg font-medium tracking-tight text-ink">{member.name}</p>
                <p className="mt-1 font-mono text-[11px] tracking-wider text-ink-2 uppercase">
                  {member.role}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
