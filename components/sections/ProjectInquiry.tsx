"use client"

import { contactData } from "@/lib/data/contact"
import { aboutPageData } from "@/lib/data/aboutPage"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import { useState, type FormEvent } from "react"

const { inquiry } = aboutPageData

const fieldClassName =
  "w-full border-b border-white/15 bg-transparent py-3 text-white placeholder:text-white/30 outline-none transition-colors duration-300 focus:border-white/50"

export default function ProjectInquiry() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    event.currentTarget.reset()
  }

  return (
    <section className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-between">
            <h2 className="max-w-lg text-4xl leading-tight font-semibold tracking-tight text-white sm:text-5xl">
              {inquiry.heading}
            </h2>

            <div className="mt-16 lg:mt-0">
              <p className="text-sm font-semibold tracking-widest text-white uppercase">
                Our Office
              </p>
              <p className="mt-2 text-white/50">
                {contactData.address.line1}
                <br />
                {contactData.address.line2}
              </p>

              <div className="mt-6 space-y-1 text-white/50">
                <a
                  href={`mailto:${contactData.email}`}
                  className="block hover:text-white"
                >
                  {contactData.email}
                </a>
                <a
                  href={`tel:${contactData.phone.replace(/[^+\d]/g, "")}`}
                  className="block hover:text-white"
                >
                  {contactData.phone}
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                {contactData.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    data-cursor="magnetic"
                    className="flex items-center gap-1 text-sm font-semibold tracking-widest text-white uppercase transition-colors duration-300 hover:text-white/60"
                  >
                    {social.label}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white/5 p-8 sm:p-10"
          >
            <div>
              <label className="text-xs font-semibold tracking-widest text-white uppercase">
                Full Name <span className="text-white/40">*</span>
              </label>
              <input
                required
                type="text"
                name="name"
                placeholder="Your full name"
                className={fieldClassName}
              />
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold tracking-widest text-white uppercase">
                  Company Name <span className="text-white/40">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="company"
                  placeholder="Ex. Tesla Inc"
                  className={fieldClassName}
                />
              </div>

              <div>
                <label className="text-xs font-semibold tracking-widest text-white uppercase">
                  Email <span className="text-white/40">*</span>
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="your@example.com"
                  className={fieldClassName}
                />
              </div>
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold tracking-widest text-white uppercase">
                  Service Required <span className="text-white/40">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    name="service"
                    defaultValue=""
                    className={`${fieldClassName} appearance-none pr-8`}
                  >
                    <option value="" disabled className="bg-neutral-900">
                      Select Your Service
                    </option>
                    {inquiry.serviceOptions.map((option) => (
                      <option key={option} value={option} className="bg-neutral-900">
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-white/40" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold tracking-widest text-white uppercase">
                  Project Budget <span className="text-white/40">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    name="budget"
                    defaultValue=""
                    className={`${fieldClassName} appearance-none pr-8`}
                  >
                    <option value="" disabled className="bg-neutral-900">
                      Select Your Range
                    </option>
                    {inquiry.budgetOptions.map((option) => (
                      <option key={option} value={option} className="bg-neutral-900">
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-white/40" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <label className="text-xs font-semibold tracking-widest text-white uppercase">
                Message <span className="text-white/40">*</span>
              </label>
              <textarea
                required
                name="message"
                rows={3}
                placeholder="Tell us more about your idea"
                className={`${fieldClassName} resize-none`}
              />
            </div>

            <button
              type="submit"
              data-cursor="magnetic"
              className="mt-10 w-full cursor-pointer rounded-full bg-white py-4 text-sm font-semibold tracking-widest text-black uppercase transition-colors duration-300 hover:bg-white/90"
            >
              {submitted ? "Message Sent" : "Send Inquiry"}
            </button>

            {submitted && (
              <p className="mt-4 text-center text-sm text-white/50">
                Thanks for reaching out — we&apos;ll get back to you within one
                business day.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
