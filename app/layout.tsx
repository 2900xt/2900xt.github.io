import './globals.css'

export const metadata = {
  title: 'Taha Rawjani - Portfolio',
  description: 'Taha Rawjani - Software Engineer Portfolio',
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