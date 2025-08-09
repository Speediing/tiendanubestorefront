"use client"

import Link from "next/link"

interface Product {
  id: number
  name: { [key: string]: string } | string
  description: { [key: string]: string } | string
  handle: { [key: string]: string } | string
  price: string
  compare_price: string
  images: Array<{
    id: number
    src: string
    alt: string
  }>
  variants: Array<{
    id: number
    price: string
    stock_quantity: number
  }>
}

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const getProductName = (name: { [key: string]: string } | string) => {
    if (typeof name === "string") return name
    return name.es || name.pt || Object.values(name)[0] || "Unnamed Product"
  }

  const getProductDescription = (description: { [key: string]: string } | string) => {
    if (typeof description === "string") return stripHtmlTags(description)
    const desc = description.es || description.pt || Object.values(description)[0] || ""
    return stripHtmlTags(desc)
  }

  const formatPrice = (price: string) => {
    const numPrice = Number.parseFloat(price)
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(numPrice)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">No products available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product.id} className="group">
          {/* Hacer la imagen clicable para ir a la página de detalle */}
          <Link href={`/product/${product.id}`}>
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4 group-hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].src || "/placeholder.svg?height=400&width=400&query=product"}
                  alt={product.images[0].alt || getProductName(product.name)}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </Link>

          <div className="space-y-2">
            {/* Hacer el título clicable también */}
            <Link href={`/product/${product.id}`}>
              <h3 className="font-medium text-gray-900 text-lg leading-tight hover:text-gray-700 transition-colors cursor-pointer">
                {getProductName(product.name)}
              </h3>
            </Link>

            {getProductDescription(product.description) && (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {getProductDescription(product.description)}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <div className="text-xl font-semibold text-gray-900">
                  {formatPrice(product.variants?.[0]?.price || product.price)}
                </div>
                {product.compare_price &&
                  Number.parseFloat(product.compare_price) >
                    Number.parseFloat(product.variants?.[0]?.price || product.price) && (
                    <div className="text-sm text-gray-500 line-through">{formatPrice(product.compare_price)}</div>
                  )}
              </div>

              <button
                onClick={() => onAddToCart(product)}
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-6 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
