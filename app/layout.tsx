import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Vibe Pro - Digital Agency & Creative Solutions',
  description: 'Transform your business with cutting-edge digital solutions. Professional web development, branding, and marketing services.',
  keywords: ['digital agency', 'web development', 'creative solutions', 'branding'],
  metadataBase: new URL('https://vibepro.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vibepro.com',
    siteName: 'Vibe Pro',
    title: 'Vibe Pro - Digital Agency',
    description: 'Transform your business with cutting-edge digital solutions',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vibe Pro',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
