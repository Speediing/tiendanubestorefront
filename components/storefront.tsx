import { HeroSlider } from "./hero-slider"
import { Cart } from "./cart"
import { Footer } from "./footer"
import { Header } from "./header"
import { CategoriesSection } from "./categories-section"
import { StorefrontClient } from "./storefront-client"

export interface Product {
  id: number
  name: string | Record<string, string>
  price?: string | number
  variants?: Array<{
    id: number
    price: string | number
  }>
  images?: Array<{
    src: string
    alt?: string
  }>
  categories?: number[]
  description?: string | Record<string, string>
}

export interface Category {
  id: number
  name: string | Record<string, string>
  products_count?: number
  image?: {
    src: string
  }
}

export interface CartItem {
  id: number
  name: string
  price: string | number
  quantity: number
  image?: string
}

export interface StorefrontProps {
  initialProducts: Product[]
  initialCategories: Category[]
  storeName?: string
}

export function Storefront({ initialProducts, initialCategories, storeName = "Mi Tienda" }: StorefrontProps) {
  const safeInitialProducts = Array.isArray(initialProducts) ? initialProducts : []
  const safeInitialCategories = Array.isArray(initialCategories) ? initialCategories : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-neutral-50 to-stone-100">
      {/* Using reusable Header component */}
      <Header storeName={storeName} />

      <main className="relative">
        <section className="relative py-12 animate-fade-in">
          <div className="max-w-7xl mx-auto px-6">
            <HeroSlider products={safeInitialProducts} />
          </div>
        </section>
        
        <StorefrontClient 
          products={safeInitialProducts}
          categories={safeInitialCategories}
        />
      </main>
      
      <Footer storeName={storeName} />

      <Cart />
    </div>
  )
}

export default Storefront
