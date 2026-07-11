"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import { contactData } from "@/lib/data/contact"
import "@/lib/GSAPAnimations"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Mail, MapPin, Phone } from "lucide-react"
import { useRef } from "react"

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll([titleRef.current, descRef.current])
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-brand-dark py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="max-w-3xl">
          <SectionBadge>Get In Touch</SectionBadge>

          <h2
            ref={titleRef}
            className="mt-8 max-w-2xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
          >
            Ready to build something great together
          </h2>

          <p
            ref={descRef}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
          >
            Have a project in mind or just want to say hello? Reach out and
            our team will get back to you within one business day.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="flex gap-4 rounded-2xl border border-white/10 p-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Mail className="size-5 text-white" />
            </div>
            <div>
              <p className="text-xs tracking-wider text-white/50 uppercase">
                Send Us Mail
              </p>
              <a
                href={`mailto:${contactData.email}`}
                className="mt-1 block font-medium text-white hover:underline"
              >
                {contactData.email}
              </a>
            </div>
          </div>

          <div className="flex gap-4 rounded-2xl border border-white/10 p-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Phone className="size-5 text-white" />
            </div>
            <div>
              <p className="text-xs tracking-wider text-white/50 uppercase">
                {contactData.phoneHours}
              </p>
              <a
                href={`tel:${contactData.phone.replace(/[^+\d]/g, "")}`}
                className="mt-1 block font-medium text-white hover:underline"
              >
                {contactData.phone}
              </a>
            </div>
          </div>

          <div className="flex gap-4 rounded-2xl border border-white/10 p-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <MapPin className="size-5 text-white" />
            </div>
            <div>
              <p className="text-xs tracking-wider text-white/50 uppercase">
                Visit Office
              </p>
              <p className="mt-1 font-medium text-white">
                {contactData.address.line1}
                <br />
                {contactData.address.line2}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3">
          {contactData.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`Follow us on ${social.label}`}
              className="flex size-11 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white uppercase transition-colors hover:bg-white/20"
              data-cursor="magnetic"
            >
              {social.glyph}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
