"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact"
import { contactData, MAX_ATTACHMENT_BYTES } from "@/lib/constants/contact"
import { cn } from "@/lib/utils/cn"
import { Mail, MapPin, Paperclip, Phone, X } from "lucide-react"
import { useActionState, useEffect, useRef, useState } from "react"

const fieldClassName =
  "w-full border-b border-white/15 bg-transparent py-3 text-white placeholder:text-white/30 outline-none transition-colors duration-300 focus:border-white/50"

const initialState: ContactFormState = { status: "idle" }

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ["KB", "MB", "GB"]
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`
}

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [services, setServices] = useState<string[]>([])
  const [budget, setBudget] = useState<string | null>(null)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [attachmentError, setAttachmentError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleAttachmentChange = (file: File | null) => {
    if (file && file.size > MAX_ATTACHMENT_BYTES) {
      setAttachmentError(
        `That file is too large — please attach something under ${formatBytes(MAX_ATTACHMENT_BYTES)}.`
      )
      setAttachment(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    setAttachmentError(null)
    setAttachment(file)
  }

  const clearAttachment = () => {
    setAttachment(null)
    setAttachmentError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const toggleService = (service: string) => {
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service]
    )
  }

  // Resets the form's local UI state (including a real DOM mutation via
  // formRef) when the Server Action reports success — a legitimate effect
  // use case (React's own docs list "resetting a form" under valid reasons
  // to sync to an external result), not a case of missing derived state.
  // This intentionally still trips `react-hooks/set-state-in-effect` — the
  // same accepted trade-off already present in the vendored
  // components/ui/carousel.tsx for the analogous "sync local state to an
  // external API's result" pattern. An alternative using React's
  // adjust-during-render technique was tried and rejected: this project's
  // lint config also flags reading/writing a ref during render, which that
  // pattern requires, and `formRef.current?.reset()` is a genuine DOM
  // mutation that must not run during render regardless.
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset()
      setServices([])
      setBudget(null)
      setAttachment(null)
      setAttachmentError(null)
    }
  }, [state.status])

  return (
    <section className="bg-brand-dark py-20 sm:py-18">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div className="max-w-2xl">
            <SectionBadge>Start a Project</SectionBadge>

            <h2 className="mt-8 text-3xl leading-tight font-medium tracking-tight text-white sm:text-4xl">
              Tell us what you need
            </h2>

            <form ref={formRef} action={formAction} noValidate className="mt-12">
              {/* Honeypot — off-screen and out of the tab order, never visible or
                  reachable for a real user; a bot filling every field fills this too.
                  Named/tagged to avoid semantic autofill matches (a prior field named
                  "company" was being silently filled by browser/extension autofill,
                  which made the honeypot misfire on real submissions). */}
              <input
                type="text"
                name="hp_check"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                data-lpignore="true"
                data-1p-ignore="true"
                className="absolute h-px w-px overflow-hidden opacity-0"
                style={{ left: "-9999px" }}
              />

              {services.map((service) => (
                <input key={service} type="hidden" name="services" value={service} />
              ))}
              <input type="hidden" name="budget" value={budget ?? ""} />

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
                      aria-pressed={services.includes(service)}
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
                  aria-invalid={Boolean(state.fieldErrors?.name)}
                  className={fieldClassName}
                />
                {state.fieldErrors?.name && (
                  <p role="alert" className="mt-2 text-sm text-red-400">
                    {state.fieldErrors.name}
                  </p>
                )}
              </div>

              <div className="mt-10">
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email"
                  aria-invalid={Boolean(state.fieldErrors?.email)}
                  className={fieldClassName}
                />
                {state.fieldErrors?.email && (
                  <p role="alert" className="mt-2 text-sm text-red-400">
                    {state.fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="mt-10">
                <textarea
                  required
                  name="message"
                  rows={3}
                  placeholder="Tell us about your project"
                  aria-invalid={Boolean(state.fieldErrors?.message)}
                  className={`${fieldClassName} resize-none`}
                />
                {state.fieldErrors?.message && (
                  <p role="alert" className="mt-2 text-sm text-red-400">
                    {state.fieldErrors.message}
                  </p>
                )}
              </div>

              <div className="mt-12">
                <p className="text-base text-white/70">Project budget (USD)</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {contactData.budgetOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setBudget(option)}
                      aria-pressed={budget === option}
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
                {/* No `accept` restriction — any file type is welcome
                    (image, video, audio, PDF, docs, plain text, etc). */}
                <input
                  ref={fileInputRef}
                  type="file"
                  name="attachment"
                  className="sr-only"
                  onChange={(event) =>
                    handleAttachmentChange(event.target.files?.[0] ?? null)
                  }
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    data-cursor="magnetic"
                    className="inline-flex cursor-pointer items-center gap-2 border-b border-white/40 pb-0.5 text-sm font-semibold text-white transition-colors duration-300 hover:border-white/70"
                  >
                    <Paperclip className="size-4" />
                    {attachment
                      ? `${attachment.name} (${formatBytes(attachment.size)})`
                      : "Add attachment"}
                  </button>

                  {attachment && (
                    <button
                      type="button"
                      onClick={clearAttachment}
                      aria-label="Remove attachment"
                      data-cursor="magnetic"
                      className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors duration-300 hover:bg-white/20 hover:text-white"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                <p className="mt-2 text-xs text-white/40">
                  Any file type, up to {formatBytes(MAX_ATTACHMENT_BYTES)}.
                </p>

                {(attachmentError || state.fieldErrors?.attachment) && (
                  <p role="alert" className="mt-2 text-sm text-red-400">
                    {attachmentError || state.fieldErrors?.attachment}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                data-cursor="magnetic"
                className="mt-12 cursor-pointer rounded-full border border-white/30 px-8 py-3 text-sm font-medium text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Sending..." : state.status === "success" ? "Request Sent" : "Send request"}
              </button>

              {state.status === "success" && (
                <p className="mt-4 text-sm text-white/50">
                  Thanks for reaching out — we&apos;ll get back to you within
                  one business day.
                </p>
              )}

              {state.status === "error" && state.message && (
                <p role="alert" className="mt-4 text-sm text-red-400">
                  {state.message}
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
