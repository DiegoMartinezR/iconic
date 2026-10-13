

export default function CardBanana({ producto, onClick }) {
  return (
    <a
    href="/canva2"
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(producto.id)}
    >
      <div className="aspect-square relative">
        <img src={producto.imagen || "/placeholder.svg"} alt={producto.titulo} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm md:text-base">{producto.titulo}</h3>
        <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">{producto.descripcion}</p>
      </div>
    </a>
  )
}
