import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { CartFavProvider } from '@/contexts/CartFavContext'
import './globals.css'

const font = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'San Vicente — Impresión 3D Profesional',
  description: 'Catálogo digital de impresión 3D profesional. Regalos, decoración, macetas, llaveros y más.',
  keywords: ['impresión 3D', 'catálogo 3D', 'San Vicente', 'regalos personalizados', 'decoración 3D'],
  authors: [{ name: '3D San Vicente' }],
  openGraph: {
    title: 'San Vicente — Impresión 3D Profesional',
    description: 'Catálogo digital de impresión 3D profesional. Regalos, decoración, macetas, llaveros y más.',
    type: 'website',
    locale: 'es_AR',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={font.variable} suppressHydrationWarning>
      <body className={`${font.className} antialiased min-h-dvh`} style={{ backgroundColor: '#FFFFFF', color: '#1A1A1A' }}>
        <CartFavProvider>
          {children}
        </CartFavProvider>
      </body>
    </html>
  )
}