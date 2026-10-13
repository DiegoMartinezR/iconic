import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const getProjectImage = (imgName) => {
    if (!imgName) return null;
    if (typeof imgName === "string" && imgName.trim()) {
        if (imgName.startsWith("data:") || imgName.startsWith("/") || imgName.startsWith("http")) return imgName;
        return `/storage/images/project/${imgName}`;
    }
    return null;
};

const getIndicatorImage = (imgName) => {
    if (!imgName) return null;
    if (typeof imgName === "string" && imgName.trim()) {
        if (imgName.startsWith("data:") || imgName.startsWith("/") || imgName.startsWith("http")) return imgName;
        return `/storage/images/indicator/${imgName}`;
    }
    return null;
};

const getTechImage = (imgName) => {
    if (!imgName) return null;
    if (typeof imgName === "string" && imgName.trim()) {
        if (imgName.startsWith("data:") || imgName.startsWith("/") || imgName.startsWith("http")) return imgName;
        return `/storage/images/technology/${imgName}`;
    }
    return null;
};

const ProjectDetailRhino = ({ data, items = [], currentProject = null, onViewUpdate, generals = [] }) => {
    const [openFaq, setOpenFaq] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [isWhatsappOpen, setIsWhatsappOpen] = useState(false);
    const whatsappRef = useRef(null);
    const project = currentProject || data;

    useEffect(() => {
        if (project && onViewUpdate) onViewUpdate(project);
    }, [project?.id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (whatsappRef.current && !whatsappRef.current.contains(event.target)) {
                setIsWhatsappOpen(false);
            }
        };
        if (isWhatsappOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isWhatsappOpen]);

    if (!project) return null;

    const faqs = Array.isArray(project.faqs) ? project.faqs : [];
    const technologies = Array.isArray(project.technologies) ? project.technologies : [];
    const indicators = Array.isArray(project.indicators) ? project.indicators : [];
    const strengths = Array.isArray(project.strengths) ? project.strengths : [];
    const steps = Array.isArray(project.steps) ? project.steps : [];
    const gallery = Array.isArray(project.images) ? project.images : [];

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
            const msg = adv.message || `¡Hola! Deseo cotizar un proyecto similar a: ${project.name}`;
            window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank');
        }
    };

    const bgImageUrl = getProjectImage(project.background_image) || getProjectImage(project.image) || '/assets/img/noimage/no_img.jpg';

    return (
        <div className="min-h-screen bg-page-background text-white">
            <section className="relative overflow-hidden pt-28 md:pt-36 pb-16 md:pb-24 bg-dark min-h-[70dvh] flex items-center">
                {bgImageUrl && (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <img src={bgImageUrl} alt={project.name} className="w-full h-full object-cover " />
                        <div className="absolute inset-0 bg-gradient-to-t from-page-background via-page-background/60 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                )}
                <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10 w-full">
                    <div className="max-w-4xl">

                        <h1 className="text-5xl md:text-5xl lg:text-8xl font-title text-primary mb-6 ">{project.name}</h1>
                        {project.summary && (
                            <p className="text-white text-base md:text-lg lg:text-xl mb-8 max-w-3xl ">{project.summary}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-6 mb-8 text-white/70 text-sm md:text-base">
                            {project.client && (
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-user-tie text-primary"></i> <strong>Cliente:</strong> {project.client}
                                </div>
                            )}
                            {project.location && (
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-map-marker-alt text-primary"></i> <strong>Ubicación:</strong> {project.location}
                                </div>
                            )}
                            {project.date && (
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-calendar-alt text-primary"></i> <strong>Fecha:</strong> {new Date(project.date).toLocaleDateString()}
                                </div>
                            )}
                        </div>

                        <div className="relative flex flex-wrap items-center gap-4 pt-2" ref={whatsappRef}>
                            <button type="button" onClick={handleCotizarClick} className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-dark font-bold px-7 py-3 lg:py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 text-base cursor-pointer">
                                <i className="fab fa-whatsapp text-xl"></i> Cotizar Proyecto Similar
                            </button>
                            <a href="/contacto" className="inline-flex items-center gap-3 border border-white/20 text-white hover:bg-white/10 font-semibold px-7 py-3 lg:py-3.5 rounded-full transition-all duration-300 text-base">
                                <i className="fas fa-envelope text-lg"></i> Contáctanos
                            </a>
                            {project.website_url && (
                                <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border border-white/20 text-white hover:bg-white/10 font-semibold px-7 py-3.5 rounded-full transition-all duration-300 text-base">
                                    <i className="fas fa-external-link-alt text-lg"></i> Visitar Web
                                </a>
                            )}
                            {project.video_url && (
                                <a href={project.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border border-white/20 text-white hover:bg-white/10 font-semibold px-7 py-3.5 rounded-full transition-all duration-300 text-base">
                                    <i className="fas fa-play-circle text-lg"></i> Ver Video
                                </a>
                            )}
                            <AnimatePresence>
                                {isWhatsappOpen && advisors.length > 1 && (
                                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute left-0 top-full mt-3 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100" style={{ minWidth: '300px', maxWidth: '340px' }}>
                                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                                            <h3 className="font-bold text-base">Cotizar con un Asesor</h3>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                                            {advisors.map((adv, idx) => (
                                                <button key={idx} type="button" onClick={() => { const phone = String(adv.phone || adv.number || '').replace(/[^0-9]/g, ''); window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(adv.message || 'Hola')}`, '_blank'); setIsWhatsappOpen(false); }} className="w-full flex items-center gap-3 p-3 hover:bg-green-50 transition-colors text-left cursor-pointer">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">{adv.name?.charAt(0)?.toUpperCase()}</div>
                                                    <div className="flex-1 min-w-0"><p className="font-semibold text-gray-900 text-sm truncate">{adv.name}</p><p className="text-xs text-gray-500 truncate">{adv.position}</p></div>
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

            {/* OVERVIEW / DESCRIPTION */}
            {project.description && (
                <section className="py-10 md:py-12 bg-page-background text-white border-y border-white/10 relative z-20">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl md:text-5xl lg:text-8xl mb-4 font-title text-white ">
                                Descripción <span className="text-primary block md:inline font-title"> del Proyecto</span>
                            </h2>
                            <div className="text-white/80 text-base md:text-lg lg:text-xl prose prose-invert max-w-none mx-auto [&_p]:mb-4 [&_strong]:text-white [&_strong]:font-semibold text-left md:text-center" dangerouslySetInnerHTML={{ __html: project.description }} />
                        </div>
                    </div>
                </section>
            )}

            {/* CHALLENGE & SOLUTION */}
            {(project.challenge || project.solution) && (
                <section className="py-12 md:py-12 bg-page-background text-white relative z-20 border-b border-white/10">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                            {project.challenge && (
                                <div>
                                    <h3 className="text-4xl md:text-5xl lg:text-8xl mb-4 font-title text-white ">
                                        El <span className="text-primary block md:inline font-title">Reto</span>
                                    </h3>
                                    <div className="text-white/80 text-base md:text-lg prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: project.challenge }} />
                                </div>
                            )}
                            {project.solution && (
                                <div>
                                    <h3 className="text-4xl md:text-5xl lg:text-8xl mb-4 font-title text-white ">
                                        La <span className="text-primary block md:inline font-title">Solución</span>
                                    </h3>
                                    <div className="text-white/80 text-base md:text-lg prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: project.solution }} />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}



            {/* INDICADORES / METRICAS RÁPIDAS */}
            {indicators.length > 0 && (
                <section className="bg-page-background text-white py-8 md:py-12 border-b border-white/10 overflow-hidden font-paragraph relative z-20">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative">
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={24}
                            slidesPerView={1}
                            loop={indicators.length > 1}
                            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 24 },
                                1024: { slidesPerView: Math.min(3, indicators.length), spaceBetween: 32 },
                                1280: { slidesPerView: Math.min(4, indicators.length), spaceBetween: 36 },
                            }}
                            className="w-full"
                        >
                            {indicators.map((ind, idx) => {
                                const indImg = getIndicatorImage(ind.image);
                                return (
                                    <SwiperSlide key={idx}>
                                        <div className="flex items-center gap-4 group/card py-2 h-full">
                                            <div className="relative min-w-14 min-h-14 max-w-14 max-h-14 md:min-w-16 md:min-h-16 md:max-w-16 md:max-h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-300 group-hover/card:bg-primary/20 group-hover/card:border-primary/40 overflow-hidden">
                                                <div className="relative z-10 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                                                    {indImg ? (
                                                        <img src={indImg} alt={ind.name || 'Indicador'} className="w-full h-full object-contain transition-transform duration-300 " />
                                                    ) : (
                                                        <i className={`${ind.icon || 'fas fa-chart-line'} text-primary text-xl md:text-2xl transition-transform duration-300 group-hover/card:scale-110`}></i>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <span className="text-white font-title text-xl md:text-3xl block  group-hover/card:text-primary transition-colors">
                                                    {ind.name}
                                                </span>
                                                {ind.description && (
                                                    <p className="text-white text-sm md:text-base block mt-1 font-light  line-clamp-3 whitespace-pre-line">
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

            {/* FORTALEZAS / RAZONES PARA ELEGIRNOS */}
            {strengths.length > 0 && (
                <section className="py-12 md:py-12 bg-page-background text-white border-b border-white/10 relative overflow-hidden font-paragraph">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10">
                        <div className="max-w-3xl mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                Fortalezas del Proyecto
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-8xl font-title text-white ">
                                Resultados <span className="text-primary block md:inline font-title">Destacados</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {strengths.map((str, idx) => {
                                const strImg = getIndicatorImage(str.image);
                                return (
                                    <div key={idx} className="group relative flex flex-col p-6 md:p-8 rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5">
                                        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/15 flex items-center justify-center mb-6 flex-shrink-0 transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/40">
                                            {strImg ? (
                                                <img src={strImg} alt={str.name || 'Fortaleza'} className="w-7 h-7 md:w-8 md:h-8 object-contain transition-transform duration-300 group-hover:scale-110" />
                                            ) : (
                                                <i className={`${str.icon || 'fas fa-shield-alt'} text-primary text-xl md:text-2xl transition-transform duration-300 group-hover:scale-110`}></i>
                                            )}
                                        </div>
                                        <h3 className="text-xl md:text-3xl font-title text-white mb-3 group-hover:text-primary transition-colors ">{str.name}</h3>
                                        {str.description && (
                                            <p className="text-white text-sm md:text-base font-light whitespace-pre-line">{str.description}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* TECHNOLOGIES */}
            {technologies.length > 0 && (
                <section className="py-12 md:py-16 bg-page-background/50 border-b border-white/10 relative">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 text-center">
                        <h2 className="text-4xl md:text-5xl lg:text-8xl mb-4 font-title text-white ">
                            Stack <span className="text-primary block md:inline font-title"> Tecnológico</span>
                        </h2>
                        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                            {technologies.map((tech, idx) => {
                                const techImg = getTechImage(tech.icon);
                                return (
                                    <div key={idx} className="flex flex-col items-center gap-3 group">
                                        <div className="h-12 w-auto md:h-16 md:w-auto flex items-center justify-center p-3 transition-all duration-300 group-hover:scale-110 ">
                                            {techImg ? (
                                                <img src={techImg} alt={tech.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                                            ) : (
                                                <span className="text-xl font-bold text-white/50">{tech.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        {/* <span className="text-sm md:text-base font-semibold text-white/70 group-hover:text-white transition-colors">{tech.name}</span> */}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ── 4. PROCESO DE TRABAJO (STEPS) ────────────────────────────────────────── */}
            {steps.length > 0 && (
                <section className="py-10 md:py-12 bg-dark relative overflow-hidden font-paragraph">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10">
                        {/* Header de Sección Estilo Rhino */}
                        <div className="max-w-3xl mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                Proceso de Trabajo
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-8xl font-title text-white ">
                                Nuestro método en <span className="text-primary block md:inline font-title">etapas claras</span>
                            </h2>
                            <p className="mt-4 text-base md:text-lg lg:text-xl text-white font-light max-w-xl">
                                Guía paso a paso para garantizar la máxima calidad y entrega eficiente en este proyecto.
                            </p>
                        </div>

                        {/* Layout de 2 Columnas: Acordeón a la izquierda e Imagen dinámica a la derecha */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                            {/* Columna Izquierda (7 cols): Lista Acordeón interactiva */}
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
                                                    <span className={`font-title font-bold text-xl md:text-3xl transition-colors ${isActive ? "text-primary" : "text-white/40"
                                                        }`}>
                                                        {st.step_number || `0${idx + 1}`}
                                                    </span>
                                                    <h3 className="font-title text-xl md:text-3xl  text-white">
                                                        {st.name}
                                                    </h3>
                                                </div>
                                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${isActive ? "border-primary text-primary rotate-180 bg-primary/10" : "border-white/20 text-white/50"
                                                    }`}>
                                                    <i className="fas fa-chevron-down text-xs md:text-sm"></i>
                                                </div>
                                            </div>

                                            <AnimatePresence initial={false}>
                                                {isActive && st.description && (
                                                    <motion.div
                                                        key="content"
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-5 pb-5 md:px-6 md:pb-6 text-white text-base md:text-lg font-light  whitespace-pre-line border-t border-white/5 pt-4">
                                                            {st.description}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Columna Derecha (5 cols): Visualización de Imagen Dinámica de la Etapa Seleccionada */}
                            <div className="lg:col-span-5">
                                {(() => {
                                    const currentStep = steps[activeStep] || steps[0];
                                    const stepImg = getProjectImage(currentStep?.image) || (currentStep?.image && (currentStep.image.startsWith('data:') || currentStep.image.startsWith('/') || currentStep.image.startsWith('http')) ? currentStep.image : null);
                                    return (
                                        <div className="sticky top-28 w-full">
                                            <div className="relative w-full aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden shadow-2xl group">
                                                <AnimatePresence mode="wait">
                                                    {stepImg ? (
                                                        <motion.img
                                                            key={activeStep}
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 1.05 }}
                                                            transition={{ duration: 0.35 }}
                                                            src={stepImg}
                                                            alt={currentStep?.name || 'Etapa del proceso'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <motion.div
                                                            key={activeStep}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-primary/10 via-white/[0.02] to-transparent"
                                                        >
                                                            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 text-primary text-3xl font-extrabold font-title">
                                                                {currentStep?.step_number || `0${activeStep + 1}`}
                                                            </div>
                                                            <h4 className="font-title text-2xl font-bold text-white mb-2">{currentStep?.name}</h4>
                                                            {currentStep?.description && (
                                                                <p className="text-white text-sm max-w-xs line-clamp-3">{currentStep.description}</p>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent pointer-events-none" />
                                                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs font-title text-white">
                                                    <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full font-bold">
                                                        Etapa {currentStep?.step_number || `0${activeStep + 1}`} de {String(steps.length).padStart(2, '0')}
                                                    </span>
                                                    <span className="truncate max-w-[180px] font-semibold">{currentStep?.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Botón de Acción CTA para Proceso de Trabajo */}
                        <div className="mt-12 text-center">
                            <button
                                type="button"
                                onClick={handleCotizarClick}
                                className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-dark font-bold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 text-base cursor-pointer"
                            >
                                <i className="fab fa-whatsapp text-xl"></i>
                                Iniciar mi proyecto con este método
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* GALERÍA DE IMÁGENES */}
            {gallery.length > 0 && (
                <section className="py-12 md:py-12 bg-page-background text-white border-b border-white/10 relative overflow-hidden font-paragraph">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10">
                        <div className="max-w-3xl mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                Galería
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-8xl font-title text-white ">
                                Vistazo del <span className="text-primary block md:inline font-title">Proyecto</span>
                            </h2>
                        </div>
                        <Swiper
                            modules={[Autoplay, Pagination, Navigation]}
                            spaceBetween={24}
                            slidesPerView={1}
                            loop={gallery.length > 1}
                            navigation
                            pagination={{ clickable: true, dynamicBullets: true }}
                            autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 24 },
                                1024: { slidesPerView: 3, spaceBetween: 32 },
                            }}
                            className="w-full pb-14"
                        >
                            {gallery.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 shadow-lg group relative cursor-pointer">
                                        <img src={`/storage/images/project/${img.image}`} alt="Galería" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <i className="fas fa-search-plus text-3xl text-white"></i>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>
            )}

            {/* ── 5. PREGUNTAS FRECUENTES (FAQS) CENTRADAS CON BOTÓN CTA ─────────────────── */}
            {faqs.length > 0 && (
                <section className="py-10 md:py-12 bg-page-background  relative overflow-hidden font-paragraph">
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
                                Resolvemos tus inquietudes sobre nuestros proyectos, procesos de trabajo y entregables.
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
        </div>
    );
};

export default ProjectDetailRhino;
