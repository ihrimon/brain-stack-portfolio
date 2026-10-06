/** Shared styling/markup between ContactForm.tsx and ProjectInquiry.tsx —
 * the two forms that submit through lib/actions/contact.ts's Server Action
 * and render its per-field validation errors the same way. */
export const fieldClassName =
  "w-full border-b border-line bg-transparent py-3 text-ink placeholder:text-ink-2/70 outline-none transition-colors duration-300 focus:border-signal"

/** Mono field label, matching the site's system labels. */
export const labelClassName = "font-mono text-[11px] tracking-wider text-ink-2 uppercase"

interface FieldErrorProps {
  message?: string
}

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null

  return (
    <p role="alert" className="mt-2 text-sm text-red-400">
      {message}
    </p>
  )
}
