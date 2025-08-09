"use client"

import { useCart } from "../contexts/cart-context"

export function CartButton() {
  const { setIsCartOpen, cartItemsCount } = useCart()

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative group flex items-center space-x-3 bg-white/90 hover:bg-white border border-stone-200 px-6 py-3 rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <svg className="w-5 h-5 text-stone-600 group-hover:text-stone-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 4l0 4M16 4l0 4M3 8h18l-2 11H5L3 8z" />
      </svg>
      <span className="font-medium text-stone-700 group-hover:text-stone-900">Carrito</span>
      {cartItemsCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-stone-800 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-scale-in">
          {cartItemsCount}
        </span>
      )}
    </button>
  )
}
