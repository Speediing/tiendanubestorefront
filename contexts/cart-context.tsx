"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

export interface CartItem {
  id: number
  name: string
  price: string | number
  quantity: number
  image?: string
}

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

interface CartContextType {
  cartItems: CartItem[]
  isCartOpen: boolean
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  setIsCartOpen: (open: boolean) => void
  cartItemsCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_ITEMS_STORAGE_KEY = 'tiendanube_cart_items'
const CART_OPEN_STORAGE_KEY = 'tiendanube_cart_open'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  useEffect(() => {
    try {
      const storedCartItems = localStorage.getItem(CART_ITEMS_STORAGE_KEY)
      const storedCartOpen = localStorage.getItem(CART_OPEN_STORAGE_KEY)
      
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems))
      }
      
      if (storedCartOpen === 'true') {
        setIsCartOpen(true)
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])
  
  useEffect(() => {
    try {
      localStorage.setItem(CART_ITEMS_STORAGE_KEY, JSON.stringify(cartItems))
    } catch (error) {
      console.error('Error saving cart items to localStorage:', error)
    }
  }, [cartItems])
  
  useEffect(() => {
    try {
      localStorage.setItem(CART_OPEN_STORAGE_KEY, isCartOpen.toString())
    } catch (error) {
      console.error('Error saving cart open state to localStorage:', error)
    }
  }, [isCartOpen])

  const addToCart = (product: Product, quantity: number = 1) => {
    const productName = typeof product.name === "string" ? product.name : Object.values(product.name)[0]
    const variantId = product.variants?.[0]?.id || product.id
    const productPrice = product.variants?.[0]?.price || product.price
    const productImage = product.images?.[0]?.src

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === variantId)
      if (existingItem) {
        return prev.map((item) => 
          item.id === variantId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        )
      }
      return [...prev, { 
        id: variantId, 
        name: productName, 
        price: productPrice, 
        quantity, 
        image: productImage 
      }]
    })
    
    setIsCartOpen(true)
  }

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    
    setCartItems((prev) => 
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      setIsCartOpen,
      cartItemsCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
