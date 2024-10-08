import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MainNav } from '@/components/MainNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Park Planner',
  description: 'Plan your Disney park visits',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={inter.className}>
        <header className="border-b">
          <div className="container mx-auto px-4 flex h-16 items-center">
            <MainNav />
          </div>
        </header>
        <main className="container mx-auto px-4">
          {children}
        </main>
      </body>
    </html>
  )
}
