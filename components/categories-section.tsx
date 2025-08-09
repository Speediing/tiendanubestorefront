interface Category {
  id: number
  name: { [key: string]: string } | string
  handle: string
  parent?: number
  subcategories?: Category[]
  products_count?: number
  image?: {
    src: string
    alt?: string
  }
}

interface CategoriesSectionProps {
  categories: Category[]
  selectedCategoryId?: number | null
  onSelectCategory: (categoryId: number | null) => void
}

export function CategoriesSection({ 
  categories = [], 
  selectedCategoryId = null,
  onSelectCategory 
}: CategoriesSectionProps) {
  
  // Función para obtener el nombre de la categoría (maneja tanto strings como objetos)
  const getCategoryName = (name: { [key: string]: string } | string): string => {
    if (typeof name === 'string') return name
    // Si es un objeto, intentamos obtener el nombre en español, o el primer valor disponible
    return name['es'] || Object.values(name)[0] || 'Categoría'
  }
  
  return (
    <div className="my-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Explora nuestras categorías</h2>
      {categories.length === 0 ? (
        <p className="text-center text-[#6b6b6b]">Cargando categorías...</p>
      ) : (
        <>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => onSelectCategory(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategoryId === null 
                  ? 'bg-stone-800 text-white' 
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              Ver todos
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className={`bg-white border rounded-xl p-4 text-center transition-all cursor-pointer hover-scale ${
                  selectedCategoryId === category.id 
                    ? 'border-stone-400 shadow-md' 
                    : 'border-[#e8e0d8] hover:shadow-lg'
                }`}
                onClick={() => onSelectCategory(category.id)}
              >
                <h3 className="font-medium text-base mb-1">{getCategoryName(category.name)}</h3>
                <p className="text-[#6b6b6b] text-sm">
                  {category.products_count !== undefined ? category.products_count : 0} productos
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
