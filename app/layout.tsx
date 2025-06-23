import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"
import './globals.css'

export const metadata: Metadata = {
  title: 'Taha Rawjani',
  description: 'Created by Taha Rawjani',
  generator: 'Taha Rawjani',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
