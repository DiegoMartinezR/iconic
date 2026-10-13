import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronDown, ArrowRight, Sparkles, BookOpen, Palette, Layers } from "lucide-react";

const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  },
  item: {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        mass: 0.5
      }
    }
  },
  button: {
    hover: { 
      x: -5,
      backgroundColor: "rgba(243, 244, 246, 0.8)",
      transition: { type: "spring", stiffness: 400 }
    },
    tap: { 
      scale: 0.96,
      transition: { type: "spring", stiffness: 400 }
    }
  },
  formItem: {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      y: -2,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  },
  image: {
    hidden: { opacity: 0, scale: 0.95, rotate: -2 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: 0.3
      }
    },
    hover: {
      scale: 1.02,
      transition: { type: "spring", stiffness: 300 }
    }
  },
  featureIcon: {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.5 + i * 0.1,
        type: "spring",
        stiffness: 300
      }
    })
  }
};

const features = [
  { icon: <BookOpen size={20} />, text: "50 páginas en blanco" },
  { icon: <Palette size={20} />, text: "Personalizable" },
  { icon: <Layers size={20} />, text: "Tapa dura premium" }
];

export default function Canva2() {
    const [formData, setFormData] = useState({
        titulo: "Ejm. Momentos que no quiero...",
        paginas: "24 páginas",
        tapa: "Tapa Dura Personalizable",
        acabado: "Limado",
    });

    return (
        <motion.div 
            className="container mx-auto px-4 py-8 max-w-7xl font-paragraph bg-gradient-to-b from-white to-purple-50 min-h-screen"
            initial="hidden"
            animate="visible"
            variants={animations.container}
        >
            {/* Fondo decorativo */}
            <motion.div 
                className="fixed inset-0 overflow-hidden pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-purple-100 opacity-20"
                        style={{
                            width: Math.random() * 200 + 100,
                            height: Math.random() * 200 + 100,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                        animate={{
                            y: [0, Math.random() * 100 - 50],
                            x: [0, Math.random() * 100 - 50],
                            opacity: [0.2, 0.3, 0.2]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    />
                ))}
            </motion.div>

            {/* Botón Regresar con efecto premium */}
            <motion.button 
                className="flex items-center customtext-primary mb-6 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all z-10 relative"
                variants={animations.button}
                whileHover="hover"
                whileTap="tap"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
            >
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-2 font-medium">Regresar</span>
                <motion.span
                    className="absolute -z-10 inset-0 bg-gradient-to-r from-purple-50 to-white rounded-xl opacity-0"
                    whileHover={{ opacity: 1 }}
                />
            </motion.button>

            {/* Contenedor principal */}
            <div className="md:flex md:gap-10 md:items-start relative z-10">
                {/* Columna de información y formulario */}
                <div className="md:w-1/2">
                    {/* Título y descripción */}
                    <motion.div 
                        className="mb-8"
                        variants={animations.item}
                    >
                        <motion.h1 
                            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ 
                                delay: 0.3,
                                type: "spring",
                                stiffness: 100
                            }}
                        >
                            Libro Personalizado <br className="hidden lg:block" /> «Buenos Deseos de Matrimonio»
                        </motion.h1>
                        
                        <motion.p 
                            className="text-base md:text-lg text-gray-700 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            El libro es de 22×22 cm, de tapa dura que tiene un diseño especial de boda personalizable para agregar una
                            foto o imagen, nombres y fecha del evento. En su interior viene con 50 páginas de papel couché de 170 grs.
                            en blanco para que los invitados puedan escribir sus mensajes.
                        </motion.p>
                        
                        {/* Características destacadas */}
                        <motion.div className="mt-6 flex flex-wrap gap-3">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm"
                                    custom={i}
                                    variants={animations.featureIcon}
                                    whileHover={{ y: -2 }}
                                >
                                    <motion.span whileHover={{ scale: 1.1 }}>
                                        {feature.icon}
                                    </motion.span>
                                    <span className="text-sm font-medium">{feature.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Formulario con efectos mejorados */}
                    <motion.form 
                        className="space-y-6 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white"
                        variants={animations.container}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Título */}
                        <motion.div 
                            className="space-y-2"
                            variants={animations.formItem}
                            whileHover="hover"
                        >
                            <label className="block text-sm font-medium text-gray-700">Título</label>
                            <motion.div className="relative">
                                <motion.input
                                    type="text"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                    className="w-full p-4 bg-purple-50/50 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all border border-purple-100"
                                    whileFocus={{ 
                                        scale: 1.02,
                                        boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.2)",
                                        backgroundColor: "rgba(245, 243, 255, 0.8)"
                                    }}
                                />
                                <motion.span 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <Sparkles size={18} />
                                </motion.span>
                            </motion.div>
                        </motion.div>

                        {/* Páginas */}
                        <motion.div 
                            className="space-y-2"
                            variants={animations.formItem}
                            whileHover="hover"
                        >
                            <label className="block text-sm font-medium text-gray-700">Páginas</label>
                            <motion.div className="relative">
                                <motion.select
                                    value={formData.paginas}
                                    onChange={(e) => setFormData({ ...formData, paginas: e.target.value })}
                                    className="w-full p-4 bg-purple-50/50 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all border border-purple-100 appearance-none"
                                    whileFocus={{ 
                                        scale: 1.02,
                                        boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.2)",
                                        backgroundColor: "rgba(245, 243, 255, 0.8)"
                                    }}
                                >
                                    <option value="24 páginas">24 páginas</option>
                                    <option value="50 páginas">50 páginas</option>
                                    <option value="100 páginas">100 páginas</option>
                                </motion.select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400 pointer-events-none" />
                            </motion.div>
                        </motion.div>

                        {/* Tapa */}
                        <motion.div 
                            className="space-y-2"
                            variants={animations.formItem}
                            whileHover="hover"
                        >
                            <label className="block text-sm font-medium text-gray-700">Tapa</label>
                            <motion.div className="relative">
                                <motion.select
                                    value={formData.tapa}
                                    onChange={(e) => setFormData({ ...formData, tapa: e.target.value })}
                                    className="w-full p-4 bg-purple-50/50 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all border border-purple-100 appearance-none"
                                    whileFocus={{ 
                                        scale: 1.02,
                                        boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.2)",
                                        backgroundColor: "rgba(245, 243, 255, 0.8)"
                                    }}
                                >
                                    <option value="Tapa Dura Personalizable">Tapa Dura Personalizable</option>
                                    <option value="Tapa Blanda">Tapa Blanda</option>
                                </motion.select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400 pointer-events-none" />
                            </motion.div>
                        </motion.div>

                        {/* Acabado de la base */}
                        <motion.div 
                            className="space-y-2"
                            variants={animations.formItem}
                            whileHover="hover"
                        >
                            <label className="block text-sm font-medium text-gray-700">Acabado de la base</label>
                            <motion.div className="relative">
                                <motion.select
                                    value={formData.acabado}
                                    onChange={(e) => setFormData({ ...formData, acabado: e.target.value })}
                                    className="w-full p-4 bg-purple-50/50 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all border border-purple-100 appearance-none"
                                    whileFocus={{ 
                                        scale: 1.02,
                                        boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.2)",
                                        backgroundColor: "rgba(245, 243, 255, 0.8)"
                                    }}
                                >
                                    <option value="Limado">Limado</option>
                                    <option value="Brillante">Brillante</option>
                                    <option value="Mate">Mate</option>
                                </motion.select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400 pointer-events-none" />
                            </motion.div>
                        </motion.div>

                        {/* Botón Crear proyecto con efecto premium */}
                        <motion.div className="pt-4">
                            <motion.a
                                href="/canva3"
                                className="block text-center w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                                whileHover={{ 
                                    scale: 1.02,
                                    boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.4)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    Crear proyecto
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                <motion.span
                                    className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                />
                                <motion.span
                                    className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-70"
                                    animate={{
                                        x: ["0%", "500%"],
                                        y: ["0%", "300%"],
                                        opacity: [0, 0.7, 0]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatDelay: 0.5
                                    }}
                                />
                            </motion.a>
                        </motion.div>
                    </motion.form>
                </div>

                {/* Imagen del libro con efectos premium */}
                <motion.div 
                    className="mt-8 md:mt-0 md:w-1/2 sticky top-6"
                    variants={animations.image}
                    whileHover="hover"
                >
                    <motion.div 
                        className="bg-white rounded-2xl p-6 flex items-center justify-center shadow-2xl border-2 border-white relative overflow-hidden"
                        initial={{ rotate: -2, scale: 0.95 }}
                        animate={{ rotate: 0, scale: 1 }}
                        whileHover={{ 
                            scale: 1.03,
                            boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15)"
                        }}
                    >
                        <img
                            src="/assets/img/backgrounds/resources/default-image.png"
                            alt="Vista previa del libro personalizado"
                            className="max-w-full h-auto max-h-[600px] rounded-lg shadow-md transform transition-transform group-hover:scale-105"
                        />
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity"
                        />
                        <motion.div 
                            className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm flex items-center gap-2"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Sparkles size={16} className="text-purple-500" />
                            <span className="text-sm font-medium">Edición Especial</span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    )
}