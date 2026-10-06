"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import { FieldError, fieldClassName } from "@/components/shared/form-field"
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact"
import { contactData, MAX_ATTACHMENT_BYTES } from "@/lib/constants/contact"
import { cn } from "@/lib/utils/cn"
import { formatBytes } from "@/lib/utils/format-bytes"
import { Mail, MapPin, Paperclip, Phone, X } from "lucide-react"
import { useActionState, useEffect, useRef, useState } from "react"

const initialState: ContactFormState = { status: "idle" }

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
    <section className="pt-8 pb-20 sm:pb-28">
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 max-w-2xl lg:col-span-7">
            <SectionBadge>Start a Project</SectionBadge>

            <h2 className="mt-8 heading-section text-ink">
              Tell us what you need
            </h2>

            <form ref={formRef} action={formAction} noValidate className="mt-12">
              {services.map((service) => (
                <input key={service} type="hidden" name="services" value={service} />
              ))}
              <input type="hidden" name="budget" value={budget ?? ""} />

              <div>
                <p className="font-mono text-[11px] tracking-wider text-ink-2 uppercase">
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
                          ? "border-signal bg-signal text-signal-ink"
                          : "border-line text-ink-2 hover:border-ink hover:text-ink"
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
                  aria-label="Your name"
                  aria-invalid={Boolean(state.fieldErrors?.name)}
                  className={fieldClassName}
                />
                <FieldError message={state.fieldErrors?.name} />
              </div>

              <div className="mt-10">
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email"
                  aria-label="Email"
                  aria-invalid={Boolean(state.fieldErrors?.email)}
                  className={fieldClassName}
                />
                <FieldError message={state.fieldErrors?.email} />
              </div>

              <div className="mt-10">
                <textarea
                  required
                  name="message"
                  rows={3}
                  placeholder="Tell us about your project"
                  aria-label="Tell us about your project"
                  aria-invalid={Boolean(state.fieldErrors?.message)}
                  className={`${fieldClassName} resize-none`}
                />
                <FieldError message={state.fieldErrors?.message} />
              </div>

              <div className="mt-12">
                <p className="font-mono text-[11px] tracking-wider text-ink-2 uppercase">Project budget (USD)</p>

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
                          ? "border-signal bg-signal text-signal-ink"
                          : "border-line text-ink-2 hover:border-ink hover:text-ink"
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
                  aria-label="Add attachment"
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
                    className="inline-flex cursor-pointer items-center gap-2 border-b border-ink/40 pb-0.5 text-sm font-medium text-ink transition-colors duration-300 hover:border-signal hover:text-signal-text"
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
                      className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-ink/10 text-ink-2 transition-colors duration-300 hover:bg-ink/20 hover:text-ink"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                <p className="mt-2 font-mono text-[11px] text-ink-2">
                  Any file type, up to {formatBytes(MAX_ATTACHMENT_BYTES)}.
                </p>

                <FieldError
                  message={attachmentError || state.fieldErrors?.attachment}
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                data-cursor="magnetic"
                className="mt-12 cursor-pointer rounded-full bg-signal px-9 py-4 text-sm font-semibold tracking-wide text-signal-ink uppercase transition-colors duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Sending..." : state.status === "success" ? "Request Sent" : "Send request"}
              </button>

              {state.status === "success" && (
                <p className="mt-4 text-sm text-ink-2">
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

          <div className="flex min-w-0 flex-col gap-4 lg:col-span-4 lg:col-start-9">
            <div className="flex gap-4 rounded-3xl border border-line bg-paper-2 p-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-signal/10">
                <Mail className="size-5 text-signal" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[11px] tracking-wider text-ink-2 uppercase">
                  Send Us Mail
                </p>
                <a
                  href={`mailto:${contactData.email}`}
                  className="mt-1 block font-medium wrap-break-word text-ink transition-colors duration-300 hover:text-signal-text"
                >
                  {contactData.email}
                </a>
              </div>
            </div>

            <div className="flex gap-4 rounded-3xl border border-line bg-paper-2 p-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-signal/10">
                <Phone className="size-5 text-signal" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[11px] tracking-wider text-ink-2 uppercase">
                  {contactData.phoneHours}
                </p>
                <a
                  href={`tel:${contactData.phone.replace(/[^+\d]/g, "")}`}
                  className="mt-1 block font-medium wrap-break-word text-ink transition-colors duration-300 hover:text-signal-text"
                >
                  {contactData.phone}
                </a>
              </div>
            </div>

            <div className="flex gap-4 rounded-3xl border border-line bg-paper-2 p-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-signal/10">
                <MapPin className="size-5 text-signal" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[11px] tracking-wider text-ink-2 uppercase">
                  Visit Office
                </p>
                <p className="mt-1 font-medium wrap-break-word text-ink">
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
                  className="flex size-11 items-center justify-center rounded-full border border-line text-xs font-semibold text-ink uppercase transition-colors duration-300 hover:border-signal hover:bg-signal hover:text-signal-ink"
                  data-cursor="magnetic"
                >
                  <span aria-hidden="true">{social.glyph}</span>
                  <span className="sr-only">Follow us on {social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
