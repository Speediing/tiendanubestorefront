"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useCart } from "../contexts/cart-context"

interface Product {
  id: number
  name: { [key: string]: string } | string
  price: string
  images: Array<{
    id: number
    src: string
    alt: string
  }>
  variants: Array<{
    id: number
    price: string
  }>
}

interface HeroSliderProps {
  products: Product[]
}

export function HeroSlider({ products }: HeroSliderProps) {
  const { addToCart } = useCart()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const featuredProducts = products.filter(product => 
    product.images && product.images.length > 0
  ).slice(0, 5)
  
  const getProductName = (name: { [key: string]: string } | string) => {
    if (typeof name === "string") return name
    return name.es || name.pt || Object.values(name)[0] || "Producto destacado"
  }
  
  const formatPrice = (price: string) => {
    const numPrice = Number.parseFloat(price)
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(numPrice)
  }
  
  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setCurrentIndex(index)
    
    setTimeout(() => {
      setIsTransitioning(false)
    }, 600)
  }, [isTransitioning])
  
  const goToNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % featuredProducts.length
    goToSlide(newIndex)
  }, [currentIndex, featuredProducts.length, goToSlide])
  
  const goToPrev = useCallback(() => {
    const newIndex = (currentIndex - 1 + featuredProducts.length) % featuredProducts.length
    goToSlide(newIndex)
  }, [currentIndex, featuredProducts.length, goToSlide])
  
  useEffect(() => {
    if (featuredProducts.length <= 1) return
    
    const interval = setInterval(() => {
      goToNext()
    }, 6000)
    
    return () => clearInterval(interval)
  }, [goToNext, featuredProducts.length])
  
  if (featuredProducts.length === 0) {
    return null
  }
  
  return (
    <div className="relative overflow-hidden mb-20 h-[450px] md:h-[500px] bg-gradient-to-br from-stone-50 to-stone-100/50">
      {/* Increased horizontal padding to move content more to the left */}
      <div className="max-w-5xl mx-auto h-full px-8 md:px-12">
        <div className="relative h-full flex items-center">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id}
              className={`absolute inset-0 transition-all duration-500 ease-out transform
                ${index === currentIndex 
                  ? 'opacity-100 translate-x-0' 
                  : index < currentIndex 
                    ? 'opacity-0 -translate-x-full' 
                    : 'opacity-0 translate-x-full'
                }`}
            >
              {/* Increased gap and adjusted padding to create more space between text and image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 h-full items-center">
                {/* Removed right padding to allow text to move further left */}
                <div className="flex flex-col justify-center space-y-8">
                  <div className="space-y-4">
                    <Link href={`/product/${product.id}`}>
                      {/* Added whitespace-nowrap to force single line display */}
                      <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight leading-tight hover:text-gray-700 transition-colors cursor-pointer whitespace-nowrap">
                        {getProductName(product.name)}
                      </h1>
                    </Link>
                    <div className="w-12 h-px bg-gray-300"></div>
                  </div>
                  <div className="text-2xl md:text-3xl font-medium text-black">
                    {formatPrice(product.variants?.[0]?.price || product.price)}
                  </div>
                  <div className="pt-2 flex space-x-4">
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-white text-gray-900 border border-gray-300 px-10 py-4 text-sm font-medium transition-all hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm rounded-md"
                    >
                      Añadir al carrito
                    </button>
                    <Link href={`/product/${product.id}`}>
                      <button className="bg-gray-900 text-white border border-gray-900 px-10 py-4 text-sm font-medium transition-all hover:bg-gray-800 hover:shadow-sm rounded-md">
                        Ver detalles
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <Link href={`/product/${product.id}`}>
                      <img 
                        src={product.images[0].src || "/placeholder.svg"} 
                        alt={product.images[0].alt || getProductName(product.name)}
                        className="w-full h-auto object-contain max-h-[350px] max-w-[350px] hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={goToPrev}
          className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-700 p-4 transition-all hover:bg-white/50 rounded-full"
          aria-label="Producto anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button 
          onClick={goToNext}
          className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-700 p-4 transition-all hover:bg-white/50 rounded-full"
          aria-label="Siguiente producto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      {/* moved pagination dots lower and added more spacing */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-4">
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all w-2.5 h-2.5 rounded-full
              ${index === currentIndex 
                ? 'bg-gray-800 scale-110' 
                : 'bg-gray-300 hover:bg-gray-500'
              }`}
            aria-label={`Ir al producto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
