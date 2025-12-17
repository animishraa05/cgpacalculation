import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Grade Calculator",
  description: "Calculate your SGPA and percentage",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-mono antialiased ${jetbrainsMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}