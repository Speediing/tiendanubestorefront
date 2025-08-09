import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/product-detail"
import { Cart } from "@/components/cart"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

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

async function getProduct(id: string): Promise<Product | null> {
  try {
    const { GET } = await import("@/app/api/products/[id]/route")
    const mockRequest = new Request(`http://localhost:3000/api/products/${id}`)
    const response = await GET(mockRequest, { params: { id } })
    
    if (!response.ok) {
      return null
    }
    
    const product = await response.json()
    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

async function getStoreInfo() {
  try {
    const { GET } = await import("@/app/api/store/route")
    const mockRequest = new Request("http://localhost:3000/api/store")
    const response = await GET(mockRequest)
    
    if (!response.ok) {
      return { name: "Mi Tienda" }
    }
    
    const storeInfo = await response.json()
    return storeInfo
  } catch (error) {
    console.error("Error fetching store info:", error)
    return { name: "Mi Tienda" }
  }
}


import { ProductPageClient } from "@/components/product-page-client"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  const storeInfo = await getStoreInfo()
  
  if (!product) {
    notFound()
  }

  const storeName = typeof storeInfo.name === "string" 
    ? storeInfo.name 
    : storeInfo.name?.es || Object.values(storeInfo.name || {})[0] || "Mi Tienda"

  return <ProductPageClient product={product} storeName={storeName} />
}
