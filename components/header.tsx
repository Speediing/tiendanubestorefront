import Link from "next/link"
import { CartButton } from "./cart-button"

interface HeaderProps {
  storeName?: string
}

export function Header({ storeName = "Mi Tienda" }: HeaderProps) {
  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <h1 className="text-3xl font-serif font-bold gradient-text cursor-pointer">{storeName}</h1>
            </Link>
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-stone-600 hover:text-stone-900 font-medium transition-colors duration-200">Inicio</Link>
              <a href="#" className="text-stone-600 hover:text-stone-900 font-medium transition-colors duration-200">Productos</a>
              <a href="#" className="text-stone-600 hover:text-stone-900 font-medium transition-colors duration-200">Categorías</a>
              <a href="#" className="text-stone-600 hover:text-stone-900 font-medium transition-colors duration-200">Contacto</a>
            </nav>
          </div>
          
          <CartButton />
        </div>
      </div>
    </header>
  )
}
