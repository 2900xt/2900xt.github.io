import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"
import CursorTrail from './components/ui/CursorTrail'
import MagneticCursor from './components/ui/MagneticCursor'
import './globals.css'

export const metadata: Metadata = {
  title: 'Taha Rawjani',
  description: 'Created by Taha Rawjani',
  generator: 'Taha Rawjani',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <MagneticCursor />
        {/* <CursorTrail /> */}
        {children}
        <Analytics />
      </body>
    </html>
  )
}
