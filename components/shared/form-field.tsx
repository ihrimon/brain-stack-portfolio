/** Shared styling/markup between ContactForm.tsx and ProjectInquiry.tsx —
 * the two forms that submit through lib/actions/contact.ts's Server Action
 * and render its per-field validation errors the same way. */
export const fieldClassName =
  "w-full border-b border-white/15 bg-transparent py-3 text-white placeholder:text-white/30 outline-none transition-colors duration-300 focus:border-white/50"

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
