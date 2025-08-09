"use client"

import { useState } from "react"
import { useCart } from "../contexts/cart-context"

export function Cart() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: string) => {
    const numPrice = Number.parseFloat(price)
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(numPrice)
  }

  const getTotalPrice = () => {
    const total = cartItems.reduce((sum, item) => {
      return sum + Number.parseFloat(item.price) * item.quantity
    }, 0)
    return formatPrice(total.toString())
  }

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cartItems }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el checkout');
      }
      
      // Redirigir al usuario a la URL de checkout de TiendaNube
      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error('Error durante el checkout:', err);
      setError(err instanceof Error ? err.message : 'Error al procesar el checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-base font-medium text-gray-900">
            Carrito ({getTotalItems()})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  {/* Replaced with minimalist cart icon */}
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 4l0 4M16 4l0 4M3 8h18l-2 11H5L3 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Tu carrito está vacío</h3>
                <p className="text-gray-500 text-xs">Añade algunos productos para comenzar</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                      {item.image && (
                        <div className="w-16 h-16 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg?height=64&width=64&query=product"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight mb-0.5 line-clamp-1">{item.name}</h4>
                        <p className="text-sm text-black mb-2">{formatPrice(item.price)}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-medium transition-colors"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-medium transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t bg-white px-4 py-3 mt-auto">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">Total</span>
                  <span className="text-base font-bold text-gray-900">{getTotalPrice()}</span>
                </div>

                {error && (
                  <div className="mb-3 p-2 bg-red-50 text-red-700 rounded text-xs">
                    {error}
                  </div>
                )}

                {/* Cambiado color ámbar por blanco minimalista */}
                <button 
                  onClick={handleCheckout}
                  disabled={isLoading || cartItems.length === 0}
                  className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 py-2.5 rounded font-medium transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    "Finalizar Compra"
                  )}
                </button>
                
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full mt-2 text-gray-600 hover:text-gray-900 py-2 text-sm font-medium transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
