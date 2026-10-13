import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Upload, Smartphone, FolderOpen, X, Check, ArrowRight } from "lucide-react";

export default function Canva3() {
  const [files, setFiles] = useState([
    {
      id: 1,
      name: "caballito-playa-amor.jpg",
      size: "24,2 MB",
      progress: 40,
      thumbnail: "/assets/img/backgrounds/resources/default-image.png",
      status: "uploading"
    },
    {
      id: 2,
      name: "aniversario-familiar.jpg",
      size: "18,7 MB",
      progress: 100,
      thumbnail: "/assets/img/backgrounds/resources/default-image.png",
      status: "completed"
    },
    {
      id: 3,
      name: "boda-playa.jpg",
      size: "32,5 MB",
      progress: 15,
      thumbnail: "/assets/img/backgrounds/resources/default-image.png",
      status: "uploading"
    },
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Lógica para manejar archivos...
  };

  const handleFileInputChange = (e) => {
    // Lógica para manejar archivos...
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Botón Regresar - Animación suave */}
      <motion.button 
        className="flex items-center customtext-primary mb-6 p-2 rounded-lg hover:bg-pink-50 transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="ml-1">Regresar</span>
      </motion.button>

      {/* Título y descripción - Animación suave */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <motion.h1 
          className="text-2xl md:text-3xl font-bold mb-3"
          whileHover={{ scale: 1.02 }}
        >
          Sube tus fotos
        </motion.h1>
        <p className="text-sm md:text-base text-gray-700">
          Para obtener mejores resultados, las imágenes deben tener un peso mínimo de 1 MB en formato JPG o PNG.
        </p>
      </motion.div>

      {/* Área de arrastrar y soltar - Sin animación inicial para evitar parpadeo */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 mb-8 transition-colors duration-300 ${
          isDragging ? 'border-pink-400 bg-pink-50' : 'border-pink-200 bg-white'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <motion.div 
              animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Upload size={48} className="text-pink-400" />
            </motion.div>
          </div>
          
          <p className="font-medium mb-2 hidden md:block">
            {isDragging ? "¡Suelta tus archivos aquí!" : "Arrastra y suelta archivos de imagen para subir"}
          </p>
          <p className="text-sm md:text-base mb-6">
            O selecciona documentos desde tu dispositivo para cargarlos.
          </p>

          <div className="flex justify-center gap-6 md:gap-8 mt-6">
            {/* Opción de subir archivos */}
            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.button
                onClick={handleUploadClick}
                className="bg-pink-100 p-4 rounded-full mb-2 hover:bg-pink-200 transition-colors"
              >
                <Upload className="h-6 w-6 customtext-primary" />
              </motion.button>
              <span className="text-sm text-center">Subir imágenes</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                multiple
                accept="image/jpeg,image/png"
              />
            </motion.div>

            {/* Opción de móvil */}
            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="bg-pink-100 p-4 rounded-full mb-2 hover:bg-pink-200 transition-colors">
                <Smartphone className="h-6 w-6 customtext-primary" />
              </button>
              <span className="text-sm text-center">
                Cargar imágenes
                <br />
                desde el teléfono
              </span>
            </motion.div>

            {/* Opción de proyectos */}
            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="bg-pink-100 p-4 rounded-full mb-2 hover:bg-pink-200 transition-colors">
                <FolderOpen className="h-6 w-6 customtext-primary" />
              </button>
              <span className="text-sm text-center">
                Proyectos
                <br />
                existentes
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lista de archivos - Animación solo al agregar/eliminar */}
      <div className="space-y-3 mb-8">
        {files.map((file) => (
          <motion.div 
            key={file.id}
            className={`bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow ${
              file.status === 'completed' ? 'border-l-4 border-green-400' : ''
            }`}
            layout // Esto anima el reordenamiento
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="relative">
              <img
                src={file.thumbnail}
                alt={file.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              {file.status === 'completed' && (
                <motion.div 
                  className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Check size={14} />
                </motion.div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-pink-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${file.progress}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full ${file.progress === 100 ? 'bg-green-400' : 'bg-pink-400'}`}
                  />
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">{file.size}</p>
              <p className={`text-sm font-medium ${
                file.progress === 100 ? 'text-green-500' : 'text-pink-500'
              }`}>
                {file.progress}%
              </p>
            </div>
            
            <motion.button
              onClick={() => removeFile(file.id)}
              className="p-1 text-gray-400 hover:text-pink-500 transition-colors"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={18} />
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Botón Continuar - Animación suave */}
      <motion.div 
        className="flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.a 
          href="/editor" 
          className="bg-primary text-white px-6 py-3 rounded-full font-medium brightness-125 hover:bg-primary hover:brightness-100 transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Continuar
          <ArrowRight className="h-5 w-5" />
        </motion.a>
      </motion.div>
    </div>
  );
}