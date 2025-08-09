export function PromoBanner() {
  return (
    <div className="bg-gradient-to-r from-[#f8f5f0] to-[#e8e0d8] text-[#4a4a4a] py-3 px-4 border-b border-[#e8e0d8]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="font-medium text-center md:text-left">
          <span className="font-bold">¡OFERTA ESPECIAL!</span> 20% de descuento en tu primera compra con el código: <span className="font-bold">BIENVENIDO20</span>
        </p>
        <a href="#" className="mt-2 md:mt-0 bg-[#d0e8d0] text-[#4a4a4a] px-4 py-1 rounded-full text-sm font-medium hover:bg-[#c0d8c0] transition-colors">
          Ver ofertas
        </a>
      </div>
    </div>
  )
}
