"use client"

import { useState } from "react"
import Link from "next/link"
import { CategoriesSection } from "./categories-section"
import { useCart } from "../contexts/cart-context"
import type { Product, Category } from "./storefront"

interface StorefrontClientProps {
  products: Product[]
  categories: Category[]
}

export function StorefrontClient({ products, categories }: StorefrontClientProps) {
  const { addToCart } = useCart()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const formatPrice = (price: string | number | undefined) => {
    if (!price) return "$0,00"
    const numPrice = typeof price === "string" ? parseFloat(price) : price
    return `$${numPrice.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const filteredProducts = selectedCategoryId 
    ? products.filter(product => 
        product.categories?.includes(selectedCategoryId) ||
        !product.categories
      )
    : products

  const getSelectedCategoryName = () => {
    if (!selectedCategoryId) return null
    const category = categories.find(cat => cat.id === selectedCategoryId)
    if (!category) return null
    
    const name = category.name
    if (typeof name === "string") return name
    return name.es || Object.values(name)[0] || 'Categoría'
  }

  return (
    <>
      <section className="py-16 animate-slide-up">
        <div className="max-w-7xl mx-auto px-6">
          <CategoriesSection 
            categories={categories} 
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </div>
      </section>

      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold gradient-text mb-4">
              {selectedCategoryId 
                ? `Productos en ${getSelectedCategoryName()}`
                : 'Nuestra Colección'
              }
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              {selectedCategoryId
                ? `Explora nuestra selección de productos en la categoría ${getSelectedCategoryName()}`
                : 'Descubre productos cuidadosamente seleccionados que combinan diseño excepcional con funcionalidad premium'
              }
            </p>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">
                {selectedCategoryId 
                  ? `No hay productos en la categoría ${getSelectedCategoryName()}`
                  : 'Productos en camino'
                }
              </h3>
              <p className="text-stone-600">
                {selectedCategoryId
                  ? 'Prueba seleccionando otra categoría'
                  : 'Estamos preparando nuestra colección exclusiva para ti'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 hover:border-stone-200 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {product.images?.[0] && (
                    <Link href={`/product/${product.id}`}>
                      <div className="aspect-square mb-6 overflow-hidden rounded-xl bg-stone-50 p-4 cursor-pointer">
                        <img
                          src={product.images[0].src || "/placeholder.svg"}
                          alt={product.images[0].alt}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="space-y-4">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-stone-900 text-lg leading-tight hover:text-stone-700 transition-colors cursor-pointer">
                        {typeof product.name === "string" ? product.name : Object.values(product.name)[0]}
                      </h3>
                    </Link>
                    <p className="text-2xl font-bold text-black">
                      {formatPrice(product.variants?.[0]?.price || product.price)}
                    </p>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 hover:border-stone-300 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
                    >
                      Añadir al Carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
