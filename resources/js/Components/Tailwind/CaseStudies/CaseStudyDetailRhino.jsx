import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const getCaseStudyImage = (imgName) => {
    if (!imgName) return null;
    if (typeof imgName === "string" && imgName.trim()) {
        if (imgName.startsWith("data:") || imgName.startsWith("/") || imgName.startsWith("http")) return imgName;
        return `/storage/images/case_study/${imgName}`;
    }
    return null;
};

const getYTVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

const CaseStudyDetailRhino = ({ data, items = [], currentCaseStudy = null, onViewUpdate, generals = [] }) => {
    const [openFaq, setOpenFaq] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [isWhatsappOpen, setIsWhatsappOpen] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const whatsappRef = useRef(null);

    const caseStudy = currentCaseStudy ||
        data?.CaseStudy ||
        data?.Case ||
        data?.slug ||
        (Array.isArray(items) && items.length > 0 ? items[0] : null) ||
        (data?.name ? data : null);

    useEffect(() => {
        if (caseStudy && onViewUpdate) onViewUpdate(caseStudy);
    }, [caseStudy?.id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (whatsappRef.current && !whatsappRef.current.contains(event.target)) {
                setIsWhatsappOpen(false);
            }
        };
        if (isWhatsappOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isWhatsappOpen]);

    if (!caseStudy) return null;

    const parseArray = (field) => {
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') {
            try { return JSON.parse(field); } catch (e) { return []; }
        }
        return [];
    };

    const indicators = parseArray(caseStudy.indicators);
    const strengths = parseArray(caseStudy.strengths);
    const steps = parseArray(caseStudy.steps);
    const faqs = parseArray(caseStudy.faqs);

    const advisorsGeneral = generals?.find?.(g => g.correlative === "whatsapp_advisors")?.value;
    let advisors = [];
    if (Array.isArray(advisorsGeneral)) advisors = advisorsGeneral;
    else if (typeof advisorsGeneral === "string") { try { advisors = JSON.parse(advisorsGeneral); } catch (e) { advisors = []; } }
    if (!advisors.length) {
        const singlePhone = generals?.find?.(g => g.correlative === "phone_whatsapp" || g.correlative === "whatsapp")?.value || "51999999999";
        advisors = [{ name: "Asesor Comercial", phone: singlePhone, position: "Atención al Cliente" }];
    }

    const handleCotizarClick = (e) => {
        if (advisors.length > 1) {
            e.preventDefault();
            setIsWhatsappOpen(!isWhatsappOpen);
        } else if (advisors.length === 1) {
            const adv = advisors[0];
            const phone = String(adv.phone || adv.number || '').replace(/[^0-9]/g, '');
            const msg = adv.message || `¡Hola! Deseo cotizar un servicio similar al caso de éxito: ${caseStudy.name}`;
            window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank');
        }
    };

    const bgImageUrl = getCaseStudyImage(caseStudy.background_image) || getCaseStudyImage(caseStudy.image);
    const videoId = getYTVideoId(caseStudy.video_url);
    console.log("caseStudy", caseStudy)

    return (
        <div className="min-h-screen bg-page-background text-white font-paragraph">
            {/* ── 1. HERO SECTION (ESTILO SERVICE & PROJECT RHINO) ──────────────────── */}
            <section className="relative overflow-hidden pt-28 md:pt-36 pb-16 md:pb-24 bg-dark min-h-[70dvh] flex items-center">
                {bgImageUrl && (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <img src={bgImageUrl} alt={caseStudy.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-page-background via-page-background/50 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                )}
                <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10 w-full">
                    <div className="max-w-4xl">


                        <h1 className="text-5xl md:text-5xl lg:text-8xl  font-title text-primary mb-6">
                            {caseStudy.name}
                        </h1>



                        {caseStudy.summary ? (
                            <p className="text-white/80 text-base md:text-lg lg:text-xl mb-8 max-w-3xl font-light ">
                                {caseStudy.summary}
                            </p>
                        ) : caseStudy.description ? (
                            <div className="text-white text-base md:text-lg lg:text-xl mb-8 max-w-3xl font-light ">
                                "{caseStudy.description}"
                            </div>
                        ) : null}

                        {/* Metadatos Rápidos */}
                        <div className="flex flex-col lg:flex-row flex-wrap lg:items-center gap-6 mb-8 text-white/70 text-sm md:text-base border-t border-white/10 pt-6">
                            {caseStudy.client && (
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-building text-primary"></i>
                                    <strong>Cliente:</strong> {caseStudy.client}
                                </div>
                            )}
                            {caseStudy.project?.name && (
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-folder text-primary"></i>
                                    <strong>Proyecto:</strong> {caseStudy.project.name}
                                </div>
                            )}
                            {caseStudy.author && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <i className="fas fa-user-tie text-primary"></i>
                                    <strong>Autor / Cargo:</strong> {caseStudy.author}
                                </div>
                            )}
                        </div>

                        {/* Botones de Acción Estilo Rhino */}
                        <div className="relative flex flex-wrap items-center gap-4 pt-2" ref={whatsappRef}>
                            <button
                                type="button"
                                onClick={handleCotizarClick}
                                className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-dark font-bold px-7 py-3 md:py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 text-base cursor-pointer"
                            >
                                <i className="fab fa-whatsapp text-xl"></i> Cotizar Proyecto Similar
                            </button>
                            <a
                                href="/contacto"
                                className="inline-flex items-center gap-3 border border-white/20 text-white hover:bg-white/10 font-semibold px-7 py-3 md:py-3.5 rounded-full transition-all duration-300 text-base"
                            >
                                <i className="fas fa-envelope text-lg"></i> Contáctanos
                            </a>
                            {videoId && (
                                <button
                                    type="button"
                                    onClick={() => setIsVideoOpen(true)}
                                    className="inline-flex items-center gap-3 border border-primary/40 text-primary hover:bg-primary/10 font-semibold px-7 py-3.5 rounded-full transition-all duration-300 text-base cursor-pointer"
                                >
                                    <i className="fas fa-play-circle text-xl"></i> Ver Video Demostrativo
                                </button>
                            )}

                            {/* Dropdown de Asesores WhatsApp */}
                            <AnimatePresence>
                                {isWhatsappOpen && advisors.length > 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute left-0 top-full mt-3 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                                        style={{ minWidth: '300px', maxWidth: '340px' }}
                                    >
                                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                                            <h3 className="font-bold text-base">Cotizar con un Asesor</h3>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                                            {advisors.map((adv, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => {
                                                        const phone = String(adv.phone || adv.number || '').replace(/[^0-9]/g, '');
                                                        window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(adv.message || `Hola, me interesa el caso: ${caseStudy.name}`)}`, '_blank');
                                                        setIsWhatsappOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-green-50 transition-colors text-left cursor-pointer"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">{adv.name?.charAt(0)?.toUpperCase()}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-900 text-sm truncate">{adv.name}</p>
                                                        <p className="text-xs text-gray-500 truncate">{adv.position}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. INDICADORES Y MÉTRICAS RÁPIDAS (SWIPER ESTILO RHINO) ─────────────── */}
            {indicators.length > 0 && (
                <section className="bg-page-background text-white py-8 md:py-12 border-y border-white/10 overflow-hidden font-paragraph relative z-20">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative">
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={24}
                            slidesPerView={1}
                            loop={indicators.length > 1}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 24 },
                                1024: { slidesPerView: Math.min(3, indicators.length), spaceBetween: 32 },
                                1280: { slidesPerView: Math.min(4, indicators.length), spaceBetween: 36 },
                            }}
                            className="w-full"
                        >
                            {indicators.map((ind, idx) => {
                                const indImg = getCaseStudyImage(ind.image) || (ind.image && (ind.image.startsWith('data:') || ind.image.startsWith('/') || ind.image.startsWith('http')) ? ind.image : null);
                                return (
                                    <SwiperSlide key={idx}>
                                        <div className="flex items-center gap-4 group/card py-2 h-full">
                                            <div className="relative min-w-14 min-h-14 max-w-14 max-h-14 md:min-w-16 md:min-h-16 md:max-w-16 md:max-h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-300 group-hover/card:bg-primary/20 group-hover/card:border-primary/40 overflow-hidden">
                                                <div className="relative z-10 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                                                    {indImg ? (
                                                        <img
                                                            src={indImg}
                                                            alt={ind.name || 'Indicador'}
                                                            className="w-full h-full object-contain transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <i className={`${ind.icon || 'fas fa-chart-line'} text-primary text-xl md:text-2xl transition-transform duration-300 group-hover/card:scale-110`}></i>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <span className="text-white font-title text-xl md:text-3xl block group-hover/card:text-primary transition-colors">
                                                    {ind.name}
                                                </span>
                                                {ind.description && (
                                                    <p className="text-white text-sm md:text-base block mt-1 font-light line-clamp-3 whitespace-pre-line">
                                                        {ind.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </section>
            )}

            {/* ── 3. ANTES VS DESPUÉS (BLOQUE COMPARATIVO DE TRANSFORMACIÓN) ─────────── */}
            {(caseStudy.before || caseStudy.after) && (
                <section className="py-12 md:py-20 bg-page-background text-white border-b border-white/10 relative overflow-hidden font-paragraph">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10">
                        <div className="max-w-3xl mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                Transformación Medible
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-8xl font-title text-white">
                                Antes vs. <span className="text-primary block md:inline font-title">Después</span>
                            </h2>
                            <p className="mt-4 text-base md:text-lg lg:text-xl text-white font-light max-w-xl">
                                Comparativa cuantitativa entre el estado inicial y el rendimiento optimizado.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                            {/* EL ANTES */}
                            {caseStudy.before && (
                                <div className="group relative flex flex-col p-6 md:p-8 rounded-2xl border border-danger/30 bg-danger/5 hover:border-danger/50 transition-all duration-300">
                                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center mb-6 flex-shrink-0 text-danger">
                                        <i className="fas fa-exclamation-triangle text-xl md:text-2xl"></i>
                                    </div>
                                    <span className="text-xs uppercase font-bold  text-danger mb-1">Situación Inicial</span>
                                    <h3 className="text-xl md:text-3xl font-title text-white mb-3">
                                        El Desafío (Antes)
                                    </h3>
                                    <p className="text-white/80 text-sm md:text-base font-light whitespace-pre-line ">
                                        {caseStudy.before}
                                    </p>
                                </div>
                            )}

                            {/* EL DESPUÉS */}
                            {caseStudy.after && (
                                <div className="group relative flex flex-col p-6 md:p-8 rounded-2xl border border-success/30 bg-success/5 hover:border-success/50 transition-all duration-300">
                                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center mb-6 flex-shrink-0 text-success">
                                        <i className="fas fa-check-circle text-xl md:text-2xl"></i>
                                    </div>
                                    <span className="text-xs uppercase font-bold  text-success mb-1">Resultado Optimizado</span>
                                    <h3 className="text-xl md:text-3xl font-title text-white mb-3">
                                        El Logro (Después)
                                    </h3>
                                    <p className="text-white/80 text-sm md:text-base font-light whitespace-pre-line ">
                                        {caseStudy.after}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ── 4. RETO Y SOLUCIÓN (CHALLENGE & SOLUTION DETALLADO) ──────────────────── */}
            {(caseStudy.challenge || caseStudy.solution) && (
                <section className="py-12 md:py-20 bg-page-background text-white border-b border-white/10 relative z-20">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                            {caseStudy.challenge && (
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                        Problemática Técnica
                                    </div>
                                    <h3 className="text-4xl md:text-5xl lg:text-8xl mb-6 font-title text-white">
                                        El <span className="text-primary block md:inline font-title">Reto</span>
                                    </h3>
                                    <div
                                        className="text-white/80 text-base md:text-lg prose prose-invert max-w-none [&_p]:mb-4 [&_strong]:text-white [&_strong]:font-semibold"
                                        dangerouslySetInnerHTML={{ __html: caseStudy.challenge }}
                                    />
                                </div>
                            )}

                            {caseStudy.solution && (
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                        Arquitectura & Estrategia
                                    </div>
                                    <h3 className="text-4xl md:text-5xl lg:text-8xl mb-6 font-title text-white">
                                        La <span className="text-primary block md:inline font-title">Solución</span>
                                    </h3>
                                    <div
                                        className="text-white/80 text-base md:text-lg prose prose-invert max-w-none [&_p]:mb-4 [&_strong]:text-white [&_strong]:font-semibold"
                                        dangerouslySetInnerHTML={{ __html: caseStudy.solution }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ── 5. FORTALEZAS DEL CASO (ESTILO RHINO STRENGTHS) ────────────────────── */}
            {strengths.length > 0 && (
                <section className="py-12 md:py-20 bg-page-background text-white border-b border-white/10 relative overflow-hidden font-paragraph">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10">
                        <div className="max-w-3xl mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                Factores Clave del Éxito
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-8xl font-title text-white">
                                Diferenciales de <span className="text-primary block md:inline font-title">la implementación</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {strengths.map((str, idx) => {
                                const strImg = getCaseStudyImage(str.image) || (str.image && (str.image.startsWith('data:') || str.image.startsWith('/') || str.image.startsWith('http')) ? str.image : null);
                                return (
                                    <div
                                        key={idx}
                                        className="group relative flex flex-col p-6 md:p-8 rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5"
                                    >
                                        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/15 flex items-center justify-center mb-6 flex-shrink-0 transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/40">
                                            {strImg ? (
                                                <img
                                                    src={strImg}
                                                    alt={str.name || 'Fortaleza'}
                                                    className="w-7 h-7 md:w-8 md:h-8 object-contain transition-transform duration-300 group-hover:scale-110"
                                                />
                                            ) : (
                                                <i className={`${str.icon || 'fas fa-shield-alt'} text-primary text-xl md:text-2xl transition-transform duration-300 group-hover:scale-110`}></i>
                                            )}
                                        </div>

                                        <h3 className="text-xl md:text-3xl font-title text-white mb-3 group-hover:text-primary transition-colors">
                                            {str.name}
                                        </h3>

                                        {str.description && (
                                            <p className="text-white text-sm md:text-base font-light whitespace-pre-line">
                                                {str.description}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ── 6. PROCESO DE TRABAJO (ACORDEÓN CON IMAGEN DINÁMICA DE ETAPAS) ──────── */}
            {steps.length > 0 && (
                <section className="py-12 md:py-20 bg-page-background border-b border-white/10 relative overflow-hidden font-paragraph">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10">
                        <div className="max-w-3xl mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                Metodología de Trabajo
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-8xl font-title text-white">
                                Nuestro proceso en <span className="text-primary block md:inline font-title">etapas claras</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                            {/* Columna Izquierda (7 cols): Acordeón */}
                            <div className="lg:col-span-7 space-y-4">
                                {steps.map((st, idx) => {
                                    const isActive = activeStep === idx;
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => setActiveStep(idx)}
                                            className={`cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden ${isActive
                                                ? "bg-white/[0.06] border-primary/50 shadow-xl shadow-primary/10"
                                                : "bg-transparent border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between p-5 md:p-6 select-none">
                                                <div className="flex items-center gap-4">
                                                    <span className={`font-title font-bold text-xl md:text-3xl transition-colors ${isActive ? "text-primary" : "text-white/40"}`}>
                                                        {st.step_number || `0${idx + 1}`}
                                                    </span>
                                                    <h3 className="font-title text-xl md:text-3xl text-white">
                                                        {st.name}
                                                    </h3>
                                                </div>
                                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${isActive ? "border-primary text-primary rotate-180 bg-primary/10" : "border-white/20 text-white/50"}`}>
                                                    <i className="fas fa-chevron-down text-xs md:text-sm"></i>
                                                </div>
                                            </div>

                                            <AnimatePresence initial={false}>
                                                {isActive && st.description && (
                                                    <motion.div
                                                        key="content"
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-5 pb-5 md:px-6 md:pb-6 text-white text-base md:text-lg font-light whitespace-pre-line border-t border-white/5 pt-4">
                                                            {st.description}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Columna Derecha (5 cols): Imagen de Etapa */}
                            <div className="lg:col-span-5">
                                {(() => {
                                    const currentStep = steps[activeStep] || steps[0];
                                    const stepImg = getCaseStudyImage(currentStep?.image) || (currentStep?.image && (currentStep.image.startsWith('data:') || currentStep.image.startsWith('/') || currentStep.image.startsWith('http')) ? currentStep.image : null);
                                    return (
                                        <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center shadow-2xl">
                                            {stepImg ? (
                                                <img
                                                    src={stepImg}
                                                    alt={currentStep?.name}
                                                    className="w-full h-full object-cover transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="text-center p-8">
                                                    <i className="fas fa-tasks text-primary text-5xl mb-4"></i>
                                                    <h4 className="font-title text-2xl text-white mb-2">{currentStep?.name}</h4>
                                                    <p className="text-sm text-white/60 font-light">{currentStep?.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── 7. TESTIMONIO DEL CLIENTE (SOCIAL PROOF) ────────────────────────────── */}
            {caseStudy.description && (
                <section className="py-12 md:py-20 bg-page-background text-white border-b border-white/10 relative">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0">
                        <div className="max-w-4xl mx-auto p-8 md:p-14 rounded-3xl border border-primary/30 bg-white/5 relative overflow-hidden text-center backdrop-blur-md">
                            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center mx-auto mb-6">
                                <i className="fas fa-quote-left text-2xl"></i>
                            </div>
                            <blockquote className="text-xl md:text-2xl lg:text-3xl font-title text-white mb-6 italic ">
                                "{caseStudy.description}"
                            </blockquote>
                            {caseStudy.author && (
                                <div>
                                    <h4 className="text-base md:text-lg lg:text-xl font-bold text-primary font-title">{caseStudy.author}</h4>
                                    {caseStudy.client && <p className="text-sm text-white/60 font-paragraph">{caseStudy.client}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ── 8. PREGUNTAS FRECUENTES (FAQS) CENTRADAS CON BOTÓN CTA (ESTILO SERVICE RHINO) ── */}
            {faqs.length > 0 && (
                <section className="py-10 md:py-12 bg-page-background text-white relative overflow-hidden font-paragraph">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10">
                        {/* Header Centrado de Sección Estilo Rhino */}
                        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                Preguntas Frecuentes
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-title text-white">
                                Respuesta a tus <span className="text-primary font-title">dudas principales</span>
                            </h2>
                            <p className="mt-4 text-base md:text-lg lg:text-xl text-white font-light">
                                Resolvemos tus inquietudes sobre la implementación, tecnologías y entregables de este caso.
                            </p>
                        </div>

                        {/* Lista Acordeón Centrada de FAQs */}
                        <div className="max-w-4xl mx-auto space-y-4">
                            {faqs.map((faq, idx) => {
                                const isOpen = openFaq === idx;
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className={`cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                                            ? "bg-white/[0.06] border-primary/50 shadow-xl shadow-primary/10"
                                            : "bg-transparent border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                                            }`}
                                    >
                                        {/* Pregunta (Cabecera) */}
                                        <div className="flex items-center justify-between p-5 md:p-6 select-none">
                                            <div className="flex items-center gap-4 pr-4">
                                                <span className={`font-title font-bold text-lg md:text-2xl transition-colors ${isOpen ? "text-primary" : "text-white/40"
                                                    }`}>
                                                    {String(idx + 1).padStart(2, '0')}
                                                </span>
                                                <h3 className="font-title text-lg md:text-2xl text-white font-medium">
                                                    {faq.question}
                                                </h3>
                                            </div>
                                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border flex-shrink-0 transition-all duration-300 ${isOpen ? "border-primary text-primary rotate-180 bg-primary/10" : "border-white/20 text-white/50"
                                                }`}>
                                                <i className="fas fa-chevron-down text-xs md:text-sm"></i>
                                            </div>
                                        </div>

                                        {/* Respuesta expandible ultra fluida */}
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    key="faq-answer"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-5 pb-5 md:px-6 md:pb-6 text-white text-base md:text-lg font-light whitespace-pre-line border-t border-white/5 pt-4">
                                                        {faq.answer}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Botón de Acción CTA para Preguntas Frecuentes */}
                        <div className="mt-12 text-center">
                            <button
                                type="button"
                                onClick={handleCotizarClick}
                                className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-dark font-bold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 text-base cursor-pointer"
                            >
                                <i className="fab fa-whatsapp text-xl"></i>
                                ¿Tienes más dudas? Cotiza con un asesor
                            </button>
                        </div>
                    </div>
                </section>
            )}



            {/* ── 10. MODAL DE VIDEO YOUTUBE ────────────────────────────────────────── */}
            <AnimatePresence>
                {isVideoOpen && videoId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
                        onClick={() => setIsVideoOpen(false)}
                    >
                        <div
                            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                title="Video Demostrativo del Caso"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CaseStudyDetailRhino;
