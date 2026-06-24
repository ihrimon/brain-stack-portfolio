import { DM_Sans, Geist_Mono } from "next/font/google"

import { ThemeProvider } from "@/components/theme/theme-provider"
import { cn } from "@/lib/utils"
import "./globals.css"
import { Metadata } from 'next'

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Brain Stack",
  description:
    "A modern, premium, and enterprise-grade portfolio website for Brain Stack, showcasing software engineering, AI development, digital transformation, and technology consulting services.",
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        dmSans.variable
      )}
    >
      <body className="">
        <ThemeProvider>{children}
        </ThemeProvider>
      </body>
    </html>
  )
}
