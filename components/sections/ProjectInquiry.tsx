"use client"

import { FieldError, fieldClassName } from "@/components/shared/form-field"
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact"
import { contactData } from "@/lib/constants/contact"
import type { AboutInquiryData } from "@/lib/data/about-page"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import { useActionState, useEffect, useRef } from "react"

const initialState: ContactFormState = { status: "idle" }

interface ProjectInquiryProps {
  inquiry: AboutInquiryData
}

export default function ProjectInquiry({ inquiry }: ProjectInquiryProps) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset()
    }
  }, [state.status])

  return (
    <section className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-between">
            <h2 className="max-w-lg text-4xl leading-tight font-semibold tracking-tight text-white sm:text-5xl">
              {inquiry.title}
            </h2>

            <div className="mt-16 lg:mt-0">
              <p className="text-sm font-semibold tracking-widest text-white uppercase">
                Our Office
              </p>
              <p className="mt-2 text-white/50">
                {contactData.address.line1}
              </p>

              <div className="mt-6 space-y-1 text-white/50">
                <a
                  href={`mailto:${contactData.email}`}
                  className="block wrap-break-word hover:text-white"
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
            ref={formRef}
            action={formAction}
            noValidate
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
                aria-invalid={Boolean(state.fieldErrors?.name)}
                className={fieldClassName}
              />
              <FieldError message={state.fieldErrors?.name} />
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
                  aria-invalid={Boolean(state.fieldErrors?.company)}
                  className={fieldClassName}
                />
                <FieldError message={state.fieldErrors?.company} />
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
                  aria-invalid={Boolean(state.fieldErrors?.email)}
                  className={fieldClassName}
                />
                <FieldError message={state.fieldErrors?.email} />
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
                    name="services"
                    defaultValue=""
                    className={`${fieldClassName} appearance-none pr-8`}
                  >
                    <option value="" disabled className="bg-surface-dark">
                      Select Your Service
                    </option>
                    {contactData.serviceOptions.map((option) => (
                      <option
                        key={option}
                        value={option}
                        className="bg-surface-dark"
                      >
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
                    <option value="" disabled className="bg-surface-dark">
                      Select Your Range
                    </option>
                    {contactData.budgetOptions.map((option) => (
                      <option
                        key={option}
                        value={option}
                        className="bg-surface-dark"
                      >
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
                aria-invalid={Boolean(state.fieldErrors?.message)}
                className={`${fieldClassName} resize-none`}
              />
              <FieldError message={state.fieldErrors?.message} />
            </div>

            <button
              type="submit"
              disabled={isPending}
              data-cursor="magnetic"
              className="mt-10 w-full cursor-pointer rounded-full bg-white py-4 text-sm font-semibold tracking-widest text-black uppercase transition-colors duration-300 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending
                ? "Sending..."
                : state.status === "success"
                  ? "Message Sent"
                  : "Send Inquiry"}
            </button>

            {state.status === "success" && (
              <p className="mt-4 text-center text-sm text-white/50">
                Thanks for reaching out — we&apos;ll get back to you within one
                business day.
              </p>
            )}

            {state.status === "error" && state.message && (
              <p role="alert" className="mt-4 text-center text-sm text-red-400">
                {state.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
