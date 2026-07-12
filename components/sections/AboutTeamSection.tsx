import { teamData } from "@/lib/data/team"
import Image from "next/image"

export default function AboutTeamSection() {
  return (
    <section className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-end lg:gap-16">
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            {teamData.description}
          </p>

          <h2 className="text-4xl leading-tight font-bold tracking-tight text-white uppercase sm:text-5xl md:text-6xl lg:text-right">
            {teamData.title}
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
          {teamData.members.map((member) => (
            <div key={member.name}>
              <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
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
