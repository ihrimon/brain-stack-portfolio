"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import { contactData } from "@/lib/constants/contact"
import { cn } from "@/lib/utils/cn"
import { Mail, MapPin, Paperclip, Phone } from "lucide-react"
import { useRef, useState, type FormEvent } from "react"

const fieldClassName =
  "w-full border-b border-white/15 bg-transparent py-3 text-white placeholder:text-white/30 outline-none transition-colors duration-300 focus:border-white/50"

export default function ContactForm() {
  const [services, setServices] = useState<string[]>([])
  const [budget, setBudget] = useState<string | null>(null)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleService = (service: string) => {
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service]
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    setServices([])
    setBudget(null)
    setAttachment(null)
    event.currentTarget.reset()
  }

  return (
    <section className="bg-brand-dark py-20 sm:py-18">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div className="max-w-2xl">
            <SectionBadge>Start a Project</SectionBadge>

            <h2 className="mt-8 text-3xl leading-tight font-medium tracking-tight text-white sm:text-4xl">
              Tell us what you need
            </h2>

            <form onSubmit={handleSubmit} className="mt-12">
              <div>
                <p className="text-base text-white/70">
                  I&apos;m interested in&hellip;
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {contactData.serviceOptions.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      data-cursor="magnetic"
                      className={cn(
                        "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300",
                        services.includes(service)
                          ? "border-white bg-white text-black"
                          : "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                      )}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-12">
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className={fieldClassName}
                />
              </div>

              <div className="mt-10">
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={fieldClassName}
                />
              </div>

              <div className="mt-10">
                <textarea
                  required
                  name="message"
                  rows={3}
                  placeholder="Tell us about your project"
                  className={`${fieldClassName} resize-none`}
                />
              </div>

              <div className="mt-12">
                <p className="text-base text-white/70">Project budget (USD)</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {contactData.budgetOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setBudget(option)}
                      data-cursor="magnetic"
                      className={cn(
                        "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300",
                        budget === option
                          ? "border-white bg-white text-black"
                          : "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-12">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="attachment"
                  className="sr-only"
                  onChange={(event) =>
                    setAttachment(event.target.files?.[0] ?? null)
                  }
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  data-cursor="magnetic"
                  className="inline-flex cursor-pointer items-center gap-2 border-b border-white/40 pb-0.5 text-sm font-semibold text-white transition-colors duration-300 hover:border-white/70"
                >
                  <Paperclip className="size-4" />
                  {attachment ? attachment.name : "Add attachment"}
                </button>
              </div>

              <button
                type="submit"
                data-cursor="magnetic"
                className="mt-12 cursor-pointer rounded-full border border-white/30 px-8 py-3 text-sm font-medium text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
              >
                {submitted ? "Request Sent" : "Send request"}
              </button>

              {submitted && (
                <p className="mt-4 text-sm text-white/50">
                  Thanks for reaching out — we&apos;ll get back to you within
                  one business day.
                </p>
              )}
            </form>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex gap-4 rounded-3xl border border-white/10 p-6">
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

            <div className="flex gap-4 rounded-3xl border border-white/10 p-6">
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

            <div className="flex gap-4 rounded-3xl border border-white/10 p-6">
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

            <div className="flex items-center gap-3">
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
        </div>
      </div>
    </section>
  )
}
