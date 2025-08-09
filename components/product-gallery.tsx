"use client"

import { useState } from "react"

interface ProductGalleryProps {
  images: Array<{
    id: number
    src: string
    alt: string
  }> | undefined
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  return (
    <>
      <div className="aspect-square bg-stone-50 rounded-2xl overflow-hidden border border-stone-100">
        {images && images.length > 0 ? (
          <img
            src={images[selectedImageIndex].src || "/placeholder.svg"}
            alt={images[selectedImageIndex].alt || productName}
            className="w-full h-full object-contain p-6"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-24 h-24 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images && images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedImageIndex
                  ? "border-stone-400"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </>
  )
}
