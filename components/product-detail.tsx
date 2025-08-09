import { ProductGallery } from "./product-gallery"
import { AddToCartSection } from "./add-to-cart-section"
import { type Product } from "../contexts/cart-context"

interface ProductDetailProps {
  product: Product
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

export function ProductDetail({ product }: ProductDetailProps) {
  const getProductName = (name: { [key: string]: string } | string) => {
    if (typeof name === "string") return name
    return name.es || name.pt || Object.values(name)[0] || "Producto"
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Galería de imágenes - Ahora un componente cliente */}
        <div className="lg:col-span-2 space-y-4">
          <ProductGallery images={product.images} productName={getProductName(product.name)} />
        </div>

        {/* Información del producto */}
        <div className="lg:col-span-3 space-y-6 lg:pl-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3">
              {getProductName(product.name)}
            </h1>
            
            <div className="flex items-baseline space-x-4 mb-5">
              <span className="text-2xl md:text-3xl font-bold text-black">
                {formatPrice(product.variants?.[0]?.price || product.price)}
              </span>
              {product.compare_price &&
                Number.parseFloat(product.compare_price) >
                  Number.parseFloat(product.variants?.[0]?.price || product.price) && (
                  <span className="text-lg md:text-xl text-stone-500 line-through">
                    {formatPrice(product.compare_price)}
                  </span>
                )}
            </div>

            {/* Descripción del producto */}
            {getProductDescription(product.description) && (
              <div className="bg-stone-50 rounded-xl p-5 mb-6 border border-stone-100">
                <h3 className="text-lg font-semibold text-stone-900 mb-2">Descripción</h3>
                <div className="prose prose-stone max-w-none">
                  <p className="text-stone-700 text-base leading-relaxed whitespace-pre-line">
                    {getProductDescription(product.description)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controles de cantidad y agregar al carrito - Ahora un componente cliente */}
          <AddToCartSection product={product} />

          {/* Información adicional */}
          {product.variants?.[0]?.stock_quantity !== undefined && (
            <div className="text-sm text-stone-600 mt-4 border-t border-stone-100 pt-4">
              Stock disponible: {product.variants[0].stock_quantity} unidades
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
