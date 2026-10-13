import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const FaqTwenty = ({ data, faqs }) => {
    // Starts with the first FAQ expanded if there is one
    const [expandedFaqs, setExpandedFaqs] = useState(new Set([faqs?.[0]?.id]));

    const toggleFaq = (id) => {
        const newExpanded = new Set(expandedFaqs);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedFaqs(newExpanded);
    };

    if (!faqs || faqs.length === 0) {
        return null;
    }

    return (
        <section
            id={data?.element_id || "faq-twenty"}
            className={`bg-primary py-10 md:py-16 text-white ${data?.class_section || ""}`}
        >
            <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div className="text-center mb-8 md:mb-10 flex flex-col items-center">
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase text-white">
                        {data?.badge || "¿Tienes dudas?"}
                    </span>
                    <h2
                        className={`mt-3 uppercase font-black leading-[0.95] text-white text-4xl sm:text-5xl ${data?.class_title || ""}`}
                    >
                        <TextWithHighlight
                            text={data?.title || "Preguntas *frecuentes*"}
                            className=""
                            color="text-white"
                        />
                    </h2>
                    {data?.description && (
                        <p
                            className={`mt-3 text-sm md:text-[15px] text-white/60 max-w-2xl mx-auto leading-relaxed ${data?.class_description || ""}`}
                        >
                            {data.description}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-3 md:gap-4 max-w-4xl mx-auto">
                    {faqs.map((faq, index) => {
                        const isExpanded = expandedFaqs.has(faq.id);
                        return (
                            <motion.div
                                key={faq.id}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.05,
                                }}
                                className={`rounded-2xl border bg-white/[0.04] overflow-hidden transition-colors duration-300 ${isExpanded ? "border-white/25 bg-white/[0.06]" : "border-white/10 hover:border-white/20"} ${data?.class_card_container || ""}`}
                            >
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left focus:outline-none group"
                                >
                                    <h3
                                        className={`text-[15px] md:text-lg font-bold text-white leading-snug ${data?.class_faq_question || ""}`}
                                    >
                                        {faq.question}
                                    </h3>
                                    <span
                                        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? "bg-white text-primary" : "bg-white/10 text-white group-hover:bg-white/20"}`}
                                    >
                                        {isExpanded ? (
                                            <Minus className="w-4 h-4" />
                                        ) : (
                                            <Plus className="w-4 h-4" />
                                        )}
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {isExpanded && faq.answer && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                duration: 0.25,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                                                <p
                                                    className={`text-white text-base leading-relaxed pt-3 border-t border-white/10 ${data?.class_faq_answer || ""}`}
                                                >
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FaqTwenty;
