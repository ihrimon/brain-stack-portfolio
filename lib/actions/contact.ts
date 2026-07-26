"use server"

import nodemailer from "nodemailer"

export interface ContactFormState {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Lazily created once per warm server instance and reused across
// submissions, rather than reconnecting to Gmail on every request.
let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  if (transporter) return transporter

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) return null

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  })
  return transporter
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/**
 * Validates and delivers a contact-form submission by email via Gmail SMTP
 * (nodemailer), authenticated with GMAIL_USER / GMAIL_APP_PASSWORD (see
 * .env.local). GMAIL_USER currently points at a testing inbox
 * (ihrimon147@gmail.com) and doubles as the delivery address — swapping it
 * to the real business inbox later is a credentials-only change, no code
 * change needed.
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot: real users never see or fill this field (kept off-screen and
  // out of the tab order in the form). A bot that fills every field on the
  // page will fill this one too — silently accept without doing anything.
  const honeypot = String(formData.get("company") ?? "").trim()
  if (honeypot) {
    console.log(
      `[contact] Honeypot field was filled ("${honeypot}") — treating as bot, not delivering.`
    )
    return { status: "success" }
  }

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()
  const budget = String(formData.get("budget") ?? "").trim()
  const services = formData.getAll("services").map(String)
  const attachment = formData.get("attachment")

  console.log("[contact] Form submission received:", {
    name,
    email,
    message,
    budget: budget || null,
    services,
    attachment:
      attachment instanceof File && attachment.size > 0
        ? { name: attachment.name, size: attachment.size, type: attachment.type }
        : null,
  })

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

  const client = getTransporter()
  if (!client) {
    console.error(
      "[contact] GMAIL_USER or GMAIL_APP_PASSWORD is not set — cannot deliver submission."
    )
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again shortly.",
    }
  }

  const attachments: NonNullable<Parameters<typeof client.sendMail>[0]["attachments"]> = []
  if (attachment instanceof File && attachment.size > 0) {
    attachments.push({
      filename: attachment.name,
      content: Buffer.from(await attachment.arrayBuffer()),
      contentType: attachment.type || undefined,
    })
  }

  const detailRows = [
    ["Name", name],
    ["Email", email],
    ["Budget", budget || "Not specified"],
    ["Services", services.length > 0 ? services.join(", ") : "Not specified"],
  ]

  try {
    await client.sendMail({
      from: `"Brain Stack Studio" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      text: [
        ...detailRows.map(([label, value]) => `${label}: ${value}`),
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <table style="font-family: sans-serif; font-size: 14px;" cellpadding="4">
          ${detailRows
            .map(
              ([label, value]) =>
                `<tr><td><strong>${label}</strong></td><td>${escapeHtml(value)}</td></tr>`
            )
            .join("")}
        </table>
        <p style="font-family: sans-serif; font-size: 14px;"><strong>Message:</strong></p>
        <p style="font-family: sans-serif; font-size: 14px; white-space: pre-wrap;">${escapeHtml(message)}</p>
      `,
      attachments,
    })
  } catch (error) {
    console.error("[contact] Failed to send submission email:", error)
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again shortly.",
    }
  }

  return { status: "success" }
}
