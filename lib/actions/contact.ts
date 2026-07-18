"use server"

export interface ContactFormState {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validates and accepts a contact-form submission. No delivery provider has
 * been chosen yet (email vs. SMTP vs. a Sheets "Leads" tab — see
 * docs/architecture-audit.md P1 and docs/roadmap.md), so submissions that
 * pass validation are logged, not delivered. Wire the TODO below to the
 * chosen provider once that decision is made.
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot: real users never see or fill this field (kept off-screen and
  // out of the tab order in the form). A bot that fills every field on the
  // page will fill this one too — silently accept without doing anything.
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "success" }
  }

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()
  const budget = String(formData.get("budget") ?? "").trim()
  const services = formData.getAll("services").map(String)

  const fieldErrors: NonNullable<ContactFormState["fieldErrors"]> = {}
  if (!name) fieldErrors.name = "Please enter your name."
  if (!email || !isValidEmail(email)) {
    fieldErrors.email = "Please enter a valid email address."
  }
  if (!message || message.length < 10) {
    fieldErrors.message = "Tell us a little more about your project (at least 10 characters)."
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors }
  }

  // TODO(delivery): pick a provider (Resend / SMTP / append to a Sheets
  // "Leads" tab) and replace this log line with the real send/store call.
  console.warn("[contact] Submission validated but not delivered — no backend configured yet.", {
    name,
    email,
    budget: budget || null,
    services,
    messageLength: message.length,
  })

  return { status: "success" }
}
