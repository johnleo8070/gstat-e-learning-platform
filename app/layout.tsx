import type { Metadata } from 'next'
import { Nunito, Comic_Neue } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ProfessorWhiskersAI } from '@/components/professor-whiskers-ai'
import './globals.css'

const nunito = Nunito({ subsets: ["latin"], variable: "--font-sans" });
const comicNeue = Comic_Neue({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-display" });

export const metadata: Metadata = {
  title: 'GSTAT eLearning Platform - Fun Digital Learning for Kids',
  description: 'Fun digital learning platform for kids ages 2-7 featuring Professor Whiskers, interactive lessons, games, and progress tracking.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${comicNeue.variable} font-sans antialiased`}>
        {children}
        <ProfessorWhiskersAI />
        <Analytics />
      </body>
    </html>
  )
}
