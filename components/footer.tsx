import Link from 'next/link'

interface FooterProps {
  storeName?: string
}

export function Footer({ storeName = "Mi Tienda" }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Store name and copyright */}
          <div className="text-center md:text-left">
            <p className="text-gray-600 text-sm">
              © 2025 {storeName}. Todos los derechos reservados.
            </p>
          </div>
          
          {/* Quick links */}
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Inicio
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Productos
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Contacto
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
