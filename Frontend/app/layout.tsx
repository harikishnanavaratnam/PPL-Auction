import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'PPL - Pongal Premiere League Cricket Auction',
  description: 'Live cricket auction platform for PPL with real-time bidding, team management, and player selection.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/Icons/PPL.png',
        type: 'image/png',
      },
      {
        url: '/Icons/PPL.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/Icons/PPL.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: '/Icons/PPL.png',
    shortcut: '/Icons/PPL.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
