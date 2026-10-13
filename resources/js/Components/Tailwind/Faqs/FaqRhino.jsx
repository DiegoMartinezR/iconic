import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const FaqRhino = ({ data, faqs = [] }) => {
    // Starts with the first FAQ expanded (index 0) if available
    const [openFaq, setOpenFaq] = useState(0);

    if (!faqs || faqs.length === 0) {
        return null;
    }

    return (
        <section
            id={data?.element_id || "faq-rhino"}
            className={`bg-page-background text-white font-paragraph py-10 lg:py-12 ${data?.class_section || ""}`}
        >
            <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10">
                {/* Header Centrado de Sección Estilo ServiceDetailRhino */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                        Preguntas Frecuentes
                    </div>

                    <h2
                        className={`text-4xl md:text-5xl lg:text-8xl font-title text-white leading-tight ${data?.class_title || ""}`}
                    >
                        <TextWithHighlight
                            text={data?.title || "Respuesta a tus *dudas principales*"}
                            className="font-title"
                            color="bg-primary"
                        />
                    </h2>

                    {data?.description ? (
                        <p
                            className={`mt-4 text-lg md:text-xl text-white font-light ${data?.class_description || ""}`}
                        >
                            {data.description}
                        </p>
                    ) : (
                        <p className="mt-4 text-lg md:text-xl text-white font-light">
                            Resolvemos tus inquietudes sobre nuestros servicios, procesos de trabajo y entregables.
                        </p>
                    )}
                </div>

                {/* Lista Acordeón Centrada de FAQs (Estilo exacto ServiceDetailRhino) */}
                <div className="max-w-4xl mx-auto space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openFaq === idx;
                        return (
                            <div
                                key={faq.id || idx}
                                onClick={() => setOpenFaq(isOpen ? null : idx)}
                                className={`cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                                    ? "bg-white/[0.06] border-primary/50 shadow-xl shadow-primary/10"
                                    : "bg-transparent border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                                    } ${data?.class_card_container || ""}`}
                            >
                                {/* Pregunta (Cabecera) */}
                                <div className="flex items-center justify-between p-5 md:p-6 select-none">
                                    <div className="flex items-center gap-4 pr-4">
                                        <span
                                            className={`font-title font-bold text-lg md:text-2xl transition-colors ${isOpen
                                                ? "text-primary"
                                                : "text-white/40"
                                                }`}
                                        >
                                            {String(idx + 1).padStart(2, "0")}
                                        </span>
                                        <h3
                                            className={`font-title text-lg md:text-2xl text-white font-medium ${data?.class_faq_question || ""}`}
                                        >
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <div
                                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border flex-shrink-0 transition-all duration-300 ${isOpen
                                            ? "border-primary text-primary rotate-180 bg-primary/10"
                                            : "border-white/20 text-white/50"
                                            }`}
                                    >
                                        <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                </div>

                                {/* Respuesta expandible ultra fluida */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            key="faq-answer"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                duration: 0.35,
                                                ease: [0.25, 1, 0.5, 1],
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div
                                                className={`px-5 pb-5 md:px-6 md:pb-6 text-white text-base md:text-lg font-light whitespace-pre-line border-t border-white/5 pt-4 ${data?.class_faq_answer || ""}`}
                                            >
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FaqRhino;
