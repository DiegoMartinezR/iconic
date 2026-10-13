"use client"

export default function ModalVistaPrevia({ isOpen, onClose, onContinue, paginaActual = 3 }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-purple-50 rounded-lg max-w-4xl w-full p-6 mx-4 relative">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">
            Libro Personalizado
            <br />
            «Buenos Deseos de Matrimonio»
          </h2>

          <a
          href="/cart"
            className="bg-purple-500 text-white px-4 py-2 rounded-full font-medium hover:bg-purple-600 transition-colors"
            onClick={onContinue}
          >
            Continuar editado
          </a>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md mb-6">
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-[2/1] bg-gray-100 flex rounded-lg overflow-hidden">
              {/* Libro abierto */}
              <div className="w-1/2 h-full bg-gray-50 shadow-inner flex items-center justify-center">
                <div className="w-full h-full bg-white"></div>
              </div>
              <div className="w-1/2 h-full bg-gray-50 shadow-inner flex items-center justify-center">
                <div className="w-full h-full bg-white"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">Páginas</div>
          <div className="flex items-center gap-2">
            <button className="p-1 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <span>
              Pág. {paginaActual} - {paginaActual + 1}
            </span>
            <button className="p-1 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
