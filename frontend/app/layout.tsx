import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Send Rakhi to USA | Rakhi Delivery & Gift Combos Online',
    template: '%s | Usa Rakhi - Rakhi Delivery USA'
  },
  description: 'Send Rakhi to USA from India with fast delivery. Shop Rakhi, chocolates, flowers and premium gift combos for your brother. Rakhi delivery USA with same day options.',
  keywords: [
    'Send Rakhi to USA',
    'Rakhi delivery USA',
    'Rakhi gifts USA',
    'Rakhi from India to USA',
    'Rakhi courier USA',
    'Indian festival gifts USA',
    'Raksha Bandhan gifts USA',
    'Rakhi for brother USA',
    'Indian Rakhi online USA',
    'Rakhi gift combos USA'
  ],
  authors: [{ name: 'Usa Rakhi' }],
  creator: 'Usa Rakhi',
  publisher: 'Usa Rakhi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://usarakhi.com',
    title: 'Send Rakhi to USA | Rakhi Delivery & Gift Combos Online',
    description: 'Send Rakhi to USA from India with fast delivery. Shop Rakhi, chocolates, flowers and premium gift combos for your brother.',
    images: [
      {
        url: '/images/og-rakhi-usa.jpg',
        width: 1200,
        height: 630,
        alt: 'Send Rakhi to USA - Premium Rakhi Delivery Service',
      },
    ],
    siteName: 'Usa Rakhi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Send Rakhi to USA | Rakhi Delivery & Gift Combos Online',
    description: 'Send Rakhi to USA from India with fast delivery. Shop Rakhi, chocolates, flowers and premium gift combos for your brother.',
    images: ['/images/og-rakhi-usa.jpg'],
    creator: '@usarakhi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://usarakhi.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}