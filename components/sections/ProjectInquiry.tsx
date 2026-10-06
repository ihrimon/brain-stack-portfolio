"use client"

import { FieldError, fieldClassName, labelClassName } from "@/components/shared/form-field"
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
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <div className="grid gap-16 border-t border-line pt-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-between">
            <h2 className="max-w-lg heading-section text-ink">
              {inquiry.title}
            </h2>

            <div className="mt-16 lg:mt-0">
              <p className="font-mono text-[11px] tracking-wider text-ink-2 uppercase">
                Our Office
              </p>
              <p className="mt-2 text-ink">
                {contactData.address.line1}
              </p>

              <div className="mt-6 space-y-1 text-ink">
                <a
                  href={`mailto:${contactData.email}`}
                  className="block wrap-break-word hover:text-signal-text"
                >
                  {contactData.email}
                </a>
                <a
                  href={`tel:${contactData.phone.replace(/[^+\d]/g, "")}`}
                  className="block hover:text-signal-text"
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
                    className="flex items-center gap-1 font-mono text-[11px] tracking-wider text-ink uppercase transition-colors duration-300 hover:text-signal-text"
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
            className="rounded-3xl border border-line bg-paper-2 p-6 sm:p-10"
          >
            <div>
              <label htmlFor="inquiry-name" className={labelClassName}>
                Full Name <span className="text-signal-text">*</span>
              </label>
              <input
                required
                type="text"
                id="inquiry-name"
                name="name"
                placeholder="Your full name"
                aria-invalid={Boolean(state.fieldErrors?.name)}
                className={fieldClassName}
              />
              <FieldError message={state.fieldErrors?.name} />
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="inquiry-company" className={labelClassName}>
                  Company Name <span className="text-signal-text">*</span>
                </label>
                <input
                  required
                  type="text"
                  id="inquiry-company"
                  name="company"
                  placeholder="Ex. Tesla Inc"
                  aria-invalid={Boolean(state.fieldErrors?.company)}
                  className={fieldClassName}
                />
                <FieldError message={state.fieldErrors?.company} />
              </div>

              <div>
                <label htmlFor="inquiry-email" className={labelClassName}>
                  Email <span className="text-signal-text">*</span>
                </label>
                <input
                  required
                  type="email"
                  id="inquiry-email"
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
                <label htmlFor="inquiry-services" className={labelClassName}>
                  Service Required <span className="text-signal-text">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    id="inquiry-services"
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
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-ink-2" />
                </div>
              </div>

              <div>
                <label htmlFor="inquiry-budget" className={labelClassName}>
                  Project Budget <span className="text-signal-text">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    id="inquiry-budget"
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
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-ink-2" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <label htmlFor="inquiry-message" className={labelClassName}>
                Message <span className="text-signal-text">*</span>
              </label>
              <textarea
                required
                id="inquiry-message"
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
              className="mt-10 w-full cursor-pointer rounded-full bg-signal py-4 text-sm font-semibold tracking-widest text-signal-ink uppercase transition-colors duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending
                ? "Sending..."
                : state.status === "success"
                  ? "Message Sent"
                  : "Send Inquiry"}
            </button>

            {state.status === "success" && (
              <p className="mt-4 text-center text-sm text-ink-2">
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
