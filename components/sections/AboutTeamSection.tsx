import { SectionBadge } from "@/components/common/SectionBadge"
import { teamData } from "@/lib/data/team"
import Image from "next/image"

export default function AboutTeamSection() {
  return (
    <section className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="max-w-2xl">
          <SectionBadge>Creative Members</SectionBadge>

          <h2 className="mt-8 text-4xl leading-tight font-bold tracking-tight text-white uppercase sm:text-5xl md:text-6xl">
            {teamData.title}
          </h2>

        </div>

        <div className="mt-16 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
          {teamData.members.map((member) => (
            <div key={member.name}>
              <div className="relative aspect-4/5 overflow-hidden  bg-neutral-900">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 45vw"
                />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                {member.name}
              </h3>
              <p className="text-sm text-white/50">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
