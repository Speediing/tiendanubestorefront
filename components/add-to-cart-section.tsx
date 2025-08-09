"use client"

import { useState } from "react"
import { useCart, type Product } from "../contexts/cart-context"

interface AddToCartSectionProps {
  product: Product
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setQuantity(1)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center space-x-4">
        <label htmlFor="quantity" className="text-stone-700 font-medium w-24">
          Cantidad:
        </label>
        <div className="flex items-center border border-stone-200 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            -
          </button>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 text-center py-2 border-0 focus:ring-0"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 px-6 rounded-xl font-medium text-lg transition-colors duration-200"
      >
        Añadir al Carrito
      </button>
    </div>
  )
}
