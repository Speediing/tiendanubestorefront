import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/cart-context'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

// Nota: No podemos obtener el nombre de la tienda dinámicamente aquí porque
// los metadatos se generan en tiempo de compilación, no en tiempo de ejecución.
// Para actualizar esto dinámicamente, necesitaríamos usar generateMetadata.
export const metadata: Metadata = {
  title: 'Tienda Online | Diseño Contemporáneo',
  description: 'Descubre nuestra colección exclusiva de productos de diseño contemporáneo',
  generator: 'v0.dev',
  keywords: ['diseño', 'contemporáneo', 'exclusivo', 'calidad premium'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <style>{`
html {
  --font-sans: ${inter.style.fontFamily};
  --font-serif: ${playfair.style.fontFamily};
}
        `}</style>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased bg-gradient-to-br from-stone-50 via-neutral-50 to-stone-100 min-h-screen">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
