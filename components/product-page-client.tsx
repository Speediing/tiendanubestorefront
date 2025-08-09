"use client"

import { ProductDetail } from "@/components/product-detail"
import { Cart } from "@/components/cart"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/contexts/cart-context"

interface Product {
  id: number
  name: { [key: string]: string } | string
  description: { [key: string]: string } | string
  price: string
  compare_price?: string
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
  categories?: Array<{
    id: number
    name: { [key: string]: string } | string
  }>
}

export function ProductPageClient({ product, storeName }: { product: Product, storeName: string }) {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart()

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-neutral-50 to-stone-100">
      <Header storeName={storeName} />

      <main>
        <ProductDetail product={product} />
      </main>

      <Footer storeName={storeName} />

      <Cart
        items={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  )
}
