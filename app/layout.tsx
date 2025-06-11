import type { Metadata } from 'next'
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
      <body>{children}</body>
    </html>
  )
}
