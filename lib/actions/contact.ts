"use server"

import { MAX_ATTACHMENT_BYTES } from "@/lib/constants/contact"
import nodemailer from "nodemailer"

export interface ContactFormState {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Partial<Record<"name" | "email" | "message" | "attachment", string>>
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

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

function buildEmailHtml(params: {
  name: string
  email: string
  budget: string
  services: string
  message: string
  attachmentSummary: string | null
}): string {
  const { name, email, budget, services, message, attachmentSummary } = params

  const detailRows = [
    ["Name", name],
    ["Email", email],
    ["Budget", budget],
    ["Services", services],
    ...(attachmentSummary ? [["Attachment", attachmentSummary]] : []),
  ]

  return `
    <div style="margin: 0; padding: 32px 16px; background-color: #f4f4f7; font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e5ea;">
        <div style="background-color: #0b0b0f; padding: 24px 28px;">
          <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700;">Brain Stack Studio</p>
          <p style="margin: 4px 0 0; color: #22d3ee; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">
            New project inquiry
          </p>
        </div>

        <div style="padding: 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
            ${detailRows
              .map(
                ([label, value], index) => `
              <tr style="${index > 0 ? "border-top: 1px solid #f0f0f3;" : ""}">
                <td style="padding: 10px 0; width: 110px; vertical-align: top; font-size: 13px; font-weight: 600; color: #6b6b76;">
                  ${label}
                </td>
                <td style="padding: 10px 0; font-size: 14px; color: #17171a;">
                  ${escapeHtml(value)}
                </td>
              </tr>
            `
              )
              .join("")}
          </table>

          <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #6b6b76; text-transform: uppercase; letter-spacing: 0.04em;">
            Message
          </p>
          <div style="background-color: #f8f8fa; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #17171a; white-space: pre-wrap;">${escapeHtml(message)}</div>
        </div>

        <div style="padding: 16px 28px; background-color: #f8f8fa; border-top: 1px solid #f0f0f3;">
          <p style="margin: 0; font-size: 12px; color: #9a9aa3;">
            Sent from the contact form at brainstackstudio.netlify.app — reply to this email to respond directly to ${escapeHtml(email)}.
          </p>
        </div>
      </div>
    </div>
  `
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
  // Honeypot: real users never see or fill this field (kept off-screen,
  // out of the tab order, and named/tagged to be ignored by autofill and
  // password-manager extensions — see the matching input in
  // ContactForm.tsx). A bot that fills every field on the page will fill
  // this one too — silently accept without doing anything.
  const honeypot = String(formData.get("hp_check") ?? "").trim()
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
  const hasAttachment = attachment instanceof File && attachment.size > 0

  console.log("[contact] Form submission received:", {
    name,
    email,
    message,
    budget: budget || null,
    services,
    attachment: hasAttachment
      ? {
          name: (attachment as File).name,
          size: formatBytes((attachment as File).size),
          type: (attachment as File).type || "unknown",
        }
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
  if (hasAttachment && (attachment as File).size > MAX_ATTACHMENT_BYTES) {
    fieldErrors.attachment = `That file is too large — please attach something under ${formatBytes(MAX_ATTACHMENT_BYTES)}.`
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

  // Any file type is accepted — image, video, audio, PDF, docs, plain text,
  // etc. — nodemailer attaches raw bytes with whatever contentType the
  // browser reported, no per-type handling needed.
  const attachments: NonNullable<Parameters<typeof client.sendMail>[0]["attachments"]> = []
  if (hasAttachment) {
    const file = attachment as File
    attachments.push({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || undefined,
    })
  }

  const budgetText = budget || "Not specified"
  const servicesText = services.length > 0 ? services.join(", ") : "Not specified"
  const attachmentSummary = hasAttachment
    ? `${(attachment as File).name} (${formatBytes((attachment as File).size)})`
    : null

  try {
    await client.sendMail({
      from: `"Brain Stack Studio Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Budget: ${budgetText}`,
        `Services: ${servicesText}`,
        ...(attachmentSummary ? [`Attachment: ${attachmentSummary}`] : []),
        "",
        "Message:",
        message,
      ].join("\n"),
      html: buildEmailHtml({
        name,
        email,
        budget: budgetText,
        services: servicesText,
        message,
        attachmentSummary,
      }),
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
