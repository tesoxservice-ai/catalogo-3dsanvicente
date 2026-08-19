import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display:  'swap',
  weight:   ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: '3D San Vicente — Catálogo 2026',
  description:
    'Catálogo digital de impresión 3D profesional. Regalos, decoración, macetas, llaveros y más.',
  keywords: [
    'impresión 3D',
    'catálogo 3D',
    'San Vicente',
    'regalos personalizados',
    'decoración 3D',
    'macetas impresas',
    'llaveros 3D',
  ],
  authors: [{ name: '3D San Vicente' }],
  openGraph: {
    title:       '3D San Vicente — Catálogo 2026',
    description: 'Catálogo digital de impresión 3D profesional. Regalos, decoración, macetas, llaveros y más.',
    type:        'website',
    locale:      'es_AR',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={inter.variable}
      suppressHydrationWarning
    >
      <body
        className={`
          ${inter.className}
          bg-[#0A0A0A]
          text-[#F8F8F8]
          antialiased
          min-h-dvh
        `}
      >
        {children}
      </body>
    </html>
  )
}