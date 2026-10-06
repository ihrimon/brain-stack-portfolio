"use server"

import { MAX_ATTACHMENT_BYTES } from "@/lib/constants/contact"
import { siteConfig } from "@/lib/metadata"
import { formatBytes } from "@/lib/utils/format-bytes"
import nodemailer from "nodemailer"

export interface ContactFormState {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Partial<
    Record<"name" | "email" | "message" | "attachment" | "company", string>
  >
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

function buildEmailHtml(params: {
  name: string
  email: string
  company: string | null
  budget: string
  services: string
  message: string
  attachmentSummary: string | null
}): string {
  const { name, email, company, budget, services, message, attachmentSummary } = params

  const detailRows = [
    ["Name", name],
    ...(company ? [["Company", company]] : []),
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
          <p style="margin: 4px 0 0; color: #2f5bff; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">
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
            Sent from the contact form at ${siteConfig.url.replace(/^https?:\/\//, "")} — reply to this email to respond directly to ${escapeHtml(email)}.
          </p>
        </div>
      </div>
    </div>
  `
}

/**
 * Validates and delivers a contact-form submission by email via Gmail SMTP
 * (nodemailer), authenticated with GMAIL_USER / GMAIL_APP_PASSWORD (see
 * .env.local). GMAIL_USER doubles as the delivery address — swapping either
 * is a credentials-only change, no code change needed.
 *
 * Deliberately no spam protection (honeypot) or rate limiting here — plain
 * "fill the form, get an email" functionality by design for now. Revisit
 * when spam becomes an actual problem, not preemptively.
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()
  const budget = String(formData.get("budget") ?? "").trim()
  const services = formData.getAll("services").map(String)
  const attachment = formData.get("attachment")
  const hasAttachment = attachment instanceof File && attachment.size > 0

  // Only the About page's project-inquiry form submits a "company" field —
  // the main contact form doesn't collect one. `formData.has` distinguishes
  // "field wasn't submitted at all" from "field was submitted empty", so
  // the main contact form's submissions aren't affected by this validation.
  const companyFieldSubmitted = formData.has("company")
  const company = String(formData.get("company") ?? "").trim()

  // Deliberately no name/email/message content here — a submission's PII
  // shouldn't sit in server logs indefinitely. This line just confirms a
  // submission was received, for debugging delivery failures.
  console.log("[contact] Form submission received", {
    hasAttachment,
    servicesCount: services.length,
  })

  const fieldErrors: NonNullable<ContactFormState["fieldErrors"]> = {}
  if (!name) fieldErrors.name = "Please enter your name."
  if (!email || !isValidEmail(email)) {
    fieldErrors.email = "Please enter a valid email address."
  }
  if (!message || message.length < 10) {
    fieldErrors.message = "Tell us a little more about your project (at least 10 characters)."
  }
  if (companyFieldSubmitted && !company) {
    fieldErrors.company = "Please enter your company name."
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
        ...(company ? [`Company: ${company}`] : []),
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
        company: company || null,
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
