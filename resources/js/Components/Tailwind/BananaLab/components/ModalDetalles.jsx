
import { useState } from "react"

export default function ModalDetalles({ isOpen, onClose, onContinue, detallesLibro }) {
  const [detalles, setDetalles] = useState(
    detallesLibro || {
      nombreCompleto: "Momentos que no quiero olvidar",
      paginas: "24 páginas",
      tapa: "Tapa Dura Personalizable",
      acabado: "Mate",
    },
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-purple-50 rounded-lg max-w-md w-full p-6 mx-4">
        <h2 className="text-2xl font-bold">
          Libro Personalizado
          <br />
          «Buenos Deseos de Matrimonio»
        </h2>

        <p className="text-sm mt-2 mb-6">
          El libro es de 22×22 cm, de tapa dura que tiene un diseño especial de boda personalizable para agregar una
          foto o imagen, nombres y fecha del evento. En su interior viene con 50 páginas de papel couché de 170 grs. en
          blanco para que los invitados puedan escribir sus mensajes.
        </p>

        <div className="bg-white rounded-lg p-5 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nombre completo</label>
            <div className="text-lg">{detalles.nombreCompleto}</div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Páginas</label>
            <div className="text-lg">{detalles.paginas}</div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tapa</label>
            <div className="text-lg">{detalles.tapa}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Acabado de la tapa</label>
            <div className="text-lg">{detalles.acabado}</div>
          </div>
        </div>

        <button
          className="w-full py-3 bg-primary  text-white rounded-full font-medium hover:bg-purple-600 transition-colors"
          onClick={onContinue}
        >
          Continuar editado
        </button>
      </div>
    </div>
  )
}
