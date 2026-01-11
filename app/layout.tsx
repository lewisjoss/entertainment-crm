import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Entertainment CRM',
  description: 'CRM for UK Entertainment Company - Performers Booking Gigs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
