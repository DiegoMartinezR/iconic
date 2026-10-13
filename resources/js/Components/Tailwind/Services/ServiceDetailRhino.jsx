import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

/**
 * ServiceDetailRhino
 *
 * Vista de detalle de servicio tipo Landing Page para Rhino Technology.
 * Renderiza los datos del servicio en 8 secciones, aprovechando:
 * - data.name / data.summary         → Hero
 * - data.image                       → Hero image
 * - data.content_blocks (BlockNote)  → Bloques avanzados (metricas, comparativa, proceso, CTA)
 * - data.features                    → Grid de caracteristicas
 * - data.faqs                        → FAQ Accordion
 * - data.linkvideo                   → Video demo
 */

const getServiceImage = (imgName) => {
    if (!imgName) return null;
    if (typeof imgName === "string" && imgName.trim()) {
        if (imgName.startsWith("data:") || imgName.startsWith("/") || imgName.startsWith("http")) return imgName;
        return `/storage/images/service/${imgName}`;
    }
    return null;
};

// ─── Utilidad: renderizar bloques BlockNote ───────────────────────────────────
const renderBlock = (block, idx) => {
    if (!block) return null;
    const { type, content, props, children } = block;

    const getInlineText = (inlineArr) => {
        if (!Array.isArray(inlineArr)) return "";
        return inlineArr.map((c, i) => {
            if (c.type === "text") {
                let el = c.text;
                if (c.styles?.bold) el = <strong key={i}>{el}</strong>;
                if (c.styles?.italic) el = <em key={i}>{el}</em>;
                if (c.styles?.underline) el = <u key={i}>{el}</u>;
                if (c.styles?.code) el = <code key={i}>{el}</code>;
                return el;
            }
            if (c.type === "link") return <a key={i} href={c.href} target="_blank" rel="noopener noreferrer">{getInlineText(c.content)}</a>;
            return null;
        });
    };

    switch (type) {
        case "heading":
            const level = props?.level || 2;
            const HeadingTag = `h${level}`;
            const headingClass = level === 1
                ? "text-3xl md:text-4xl font-title text-white mb-4"
                : level === 2
                    ? "text-2xl font-title text-white mb-3"
                    : "text-xl font-title text-white mb-2";
            return <HeadingTag key={idx} className={headingClass}>{getInlineText(content)}</HeadingTag>;

        case "paragraph":
            return (
                <p key={idx} className="text-white/80 mb-3 ">
                    {getInlineText(content)}
                </p>
            );

        case "bulletListItem":
            return (
                <li key={idx} className="text-white/80 mb-1 flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{getInlineText(content)}</span>
                    {children?.length > 0 && (
                        <ul className="ml-4 mt-1">
                            {children.map((child, ci) => renderBlock(child, ci))}
                        </ul>
                    )}
                </li>
            );

        case "numberedListItem":
            return (
                <li key={idx} className="text-white/80 mb-1 flex items-start gap-2">
                    <span className="text-primary font-bold min-w-[1.5rem]">{idx + 1}.</span>
                    <span>{getInlineText(content)}</span>
                </li>
            );

        case "table":
            const rows = content?.rows || [];
            return (
                <div key={idx} className="overflow-x-auto mb-6">
                    <table className="w-full text-sm border-collapse">
                        <tbody>
                            {rows.map((row, ri) => (
                                <tr key={ri} className={ri === 0 ? "bg-primary/20" : ri % 2 === 0 ? "bg-white/5" : "bg-white/0"}>
                                    {row.cells.map((cell, ci) => {
                                        const Tag = ri === 0 ? "th" : "td";
                                        return (
                                            <Tag key={ci} className="border border-white/10 px-4 py-2 text-white/90">
                                                {getInlineText(cell)}
                                            </Tag>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );

        case "image":
            return (
                <div key={idx} className="mb-6">
                    <img
                        src={block.props?.url}
                        alt={block.props?.caption || ""}
                        className="w-full rounded-xl object-cover"
                    />
                    {block.props?.caption && (
                        <p className="text-center text-white text-sm mt-2">{block.props.caption}</p>
                    )}
                </div>
            );

        case "checkListItem":
            return (
                <li key={idx} className="flex items-center gap-2 mb-1 text-white/80">
                    <span className={`text-lg ${block.props?.checked ? "text-success" : "text-white/30"}`}>
                        {block.props?.checked ? "✓" : "○"}
                    </span>
                    <span className={block.props?.checked ? "line-through opacity-60" : ""}>
                        {getInlineText(content)}
                    </span>
                </li>
            );

        default:
            // Fallback: mostrar como parrafo
            if (content && content.length > 0) {
                return (
                    <p key={idx} className="text-white/80 mb-3">
                        {getInlineText(content)}
                    </p>
                );
            }
            return null;
    }
};

// Agrupar bloques en listas coherentes
const renderBlocks = (blocks) => {
    if (!Array.isArray(blocks) || blocks.length === 0) return null;
    const elements = [];
    let i = 0;

    while (i < blocks.length) {
        const current = blocks[i];
        if (current.type === "bulletListItem" || current.type === "numberedListItem") {
            const listType = current.type;
            const Tag = listType === "bulletListItem" ? "ul" : "ol";
            const listItems = [];
            while (i < blocks.length && blocks[i].type === listType) {
                listItems.push(renderBlock(blocks[i], i));
                i++;
            }
            elements.push(<Tag key={`list-${i}`} className="mb-4 pl-4 space-y-1">{listItems}</Tag>);
        } else {
            elements.push(renderBlock(current, i));
            i++;
        }
    }
    return elements;
};

// ─── Componente Principal ────────────────────────────────────────────────────
const ServiceDetailRhino = ({ data, items = [], currentService = null, onViewUpdate, generals = [] }) => {
    const [openFaq, setOpenFaq] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [activeStrengthSlide, setActiveStrengthSlide] = useState(0);
    const [isWhatsappOpen, setIsWhatsappOpen] = useState(false);
    const whatsappRef = useRef(null);
    const swiperStrengthRef = useRef(null);
    const service = currentService || data;

    useEffect(() => {
        if (service && onViewUpdate) onViewUpdate(service);
    }, [service?.id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (whatsappRef.current && !whatsappRef.current.contains(event.target)) {
                setIsWhatsappOpen(false);
            }
        };
        if (isWhatsappOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isWhatsappOpen]);

    if (!service) return null;

    const faqs = Array.isArray(service.faqs) ? service.faqs : [];
    const features = Array.isArray(service.features) ? service.features : [];
    const contentBlocks = Array.isArray(service.content_blocks) ? service.content_blocks : [];
    const indicators = Array.isArray(service.indicators) ? service.indicators : [];
    const strengths = Array.isArray(service.strengths) ? service.strengths : [];
    const steps = Array.isArray(service.steps) ? service.steps : [];

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
            const msg = adv.message || `¡Hola! Deseo cotizar el servicio: ${service.name}`;
            window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank');
        }
    };

    const bgImageUrl = getServiceImage(service.background_image) || getServiceImage(service.image);

    return (
        <div className="min-h-screen bg-page-background text-white">
            <section className="relative overflow-hidden pt-28 md:pt-36 pb-16 md:pb-24 bg-dark min-h-[60dvh] lg:min-h-[70dvh] flex items-center">
                {bgImageUrl && (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <img src={bgImageUrl} alt={service.name} className="w-full h-full object-cover " />
                        {/* Gradiente superior para contraste con el Header */}
                        <div className="absolute inset-0 bg-gradient-to-t from-page-background via-page-background/10 to-transparent pointer-events-none" />
                    </div>
                )}
                <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10 w-full">
                    <div className="max-w-4xl">
                        {service.category?.name && (
                            <div className="inline-flex items-center gap-2 bg-primary/15 text-primary border border-primary/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-6 backdrop-blur-md">
                                <span>›</span> Servicios / {service.category.name}
                            </div>
                        )}
                        <h1 className="text-5xl md:text-5xl lg:text-8xl font-title  text-primary  mb-6 ">{service.name}</h1>
                        {service.description ? (
                            <div className="text-white text-base md:text-lg lg:text-xl  mb-8 prose prose-invert max-w-none [&_p]:mb-4 [&_strong]:text-white [&_strong]:font-semibold" dangerouslySetInnerHTML={{ __html: service.description }} />
                        ) : service.summary ? (
                            <p className="text-white text-base md:text-lg lg:text-xl  mb-8 max-w-3xl ">{service.summary}</p>
                        ) : null}
                        <div className="relative flex flex-wrap items-center gap-4 pt-2" ref={whatsappRef}>
                            <button type="button" onClick={handleCotizarClick} className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-dark font-bold px-7 py-3 lg:py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 text-base cursor-pointer">
                                <i className="fab fa-whatsapp text-xl"></i> Cotizar Proyecto
                            </button>
                            <a href="/contacto" className="inline-flex items-center gap-3 border border-white/20 text-white hover:bg-white/10 font-semibold px-7 py-3 lg:py-3.5 rounded-full transition-all duration-300 text-base">
                                <i className="fas fa-envelope text-lg"></i> Contáctanos
                            </a>
                            {service.linkvideo?.[0]?.url && (
                                <a href={service.linkvideo[0].url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border border-white/20 text-white hover:bg-white/10 font-semibold px-7 py-3 lg:py-3.5 rounded-full transition-all duration-300 text-base">
                                    <i className="fas fa-play-circle text-lg"></i> Ver Demo
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
            {/* ── 2. INDICADORES / MÉTRICAS RÁPIDAS (ESTILO INDICATOR RHINO) ───────────── */}
            {indicators.length > 0 && (
                <section className="bg-page-background text-white py-8 md:py-12 border-y border-white/10 overflow-hidden font-paragraph relative z-20">
                    <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative">
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={24}
                            slidesPerView={1.5}
                            loop={indicators.length > 1}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 24,
                                },
                                1024: {
                                    slidesPerView: Math.min(3, indicators.length),
                                    spaceBetween: 32,
                                },
                                1280: {
                                    slidesPerView: Math.min(4, indicators.length),
                                    spaceBetween: 36,
                                },
                            }}
                            className="w-full"
                        >
                            {indicators.map((ind, idx) => {
                                const indImg = getServiceImage(ind.image) || (ind.image && (ind.image.startsWith('data:') || ind.image.startsWith('/') || ind.image.startsWith('http')) ? ind.image : null);
                                return (
                                    <SwiperSlide key={idx}>
                                        <div className="flex items-center gap-4 group/card py-2 h-full">
                                            {/* Contenedor de Icono/Imagen Circular estilo Rhino */}
                                            <div className="relative min-w-14 min-h-14 max-w-14 max-h-14 md:min-w-16 md:min-h-16 md:max-w-16 md:max-h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-300 group-hover/card:bg-primary/20 group-hover/card:border-primary/40 overflow-hidden">
                                                <div className="relative z-10 min-w-7 min-h-7 md:min-w-8 md:min-h-8 max-w-7 max-h-7 md:max-w-8 md:max-h-8 flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                                                    {indImg ? (
                                                        <img
                                                            src={indImg}
                                                            alt={ind.name || 'Indicador'}
                                                            className="w-full h-full object-contain transition-transform duration-300 "
                                                        />
                                                    ) : (
                                                        <i className={`${ind.icon || 'fas fa-chart-line'} text-primary text-xl md:text-2xl transition-transform duration-300 group-hover/card:scale-110`}></i>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Información de texto */}
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
            {/* ── 3. FORTALEZAS / RAZONES PARA ELEGIRNOS (ESTILO RHINO) ───────────────── */}
            {strengths.length > 0 && (
                <section className="py-12 md:py-20 bg-page-background text-white border-t border-white/10 relative overflow-hidden font-paragraph">
                    <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10">
                        {/* Header de Sección Estilo Rhino */}
                        <div className="max-w-3xl mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                Por qué elegirnos
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-8xl font-title text-white ">
                                Razones para elegir <span className="text-primary block md:inline font-title">nuestro servicio</span>
                            </h2>
                            <p className="mt-4 text-base md:text-lg lg:text-xl text-white font-light max-w-xl">
                                Fortalezas técnicas y diferenciales competitivos orientados al éxito de tu proyecto.
                            </p>
                        </div>

                        {/* Grid de Cards LIMPIAS (Desktop: hidden md:grid) */}
                        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {strengths.map((str, idx) => {
                                const strImg = getServiceImage(str.image) || (str.image && (str.image.startsWith('data:') || str.image.startsWith('/') || str.image.startsWith('http')) ? str.image : null);
                                return (
                                    <div
                                        key={idx}
                                        className="group relative flex flex-col p-6 md:p-8 rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5 h-full"
                                    >
                                        {/* Icono / Imagen Circular sin fondo recargado */}
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

                                        {/* Título de la fortaleza */}
                                        <h3 className="text-xl md:text-3xl font-title text-white mb-3 group-hover:text-primary transition-colors">
                                            {str.name}
                                        </h3>

                                        {/* Descripción en blanco limpio y legible */}
                                        {str.description && (
                                            <p className="text-white text-sm md:text-base font-light whitespace-pre-line">
                                                {str.description}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Slider Swiper con Paginación Estilo HeroRhino (Solo Mobile: block md:hidden) */}
                        <div className="block md:hidden">
                            <Swiper
                                onSwiper={(swiper) => { swiperStrengthRef.current = swiper; }}
                                onSlideChange={(swiper) => setActiveStrengthSlide(swiper.realIndex)}
                                modules={[Autoplay]}
                                spaceBetween={16}
                                slidesPerView={1}
                                centeredSlides={false}
                                loop={strengths.length > 1}
                                autoplay={{
                                    delay: 4000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                className="w-full [&_.swiper-wrapper]:!items-stretch flex flex-col"
                            >
                                {strengths.map((str, idx) => {
                                    const strImg = getServiceImage(str.image) || (str.image && (str.image.startsWith('data:') || str.image.startsWith('/') || str.image.startsWith('http')) ? str.image : null);
                                    return (
                                        <SwiperSlide key={idx} className="!h-auto flex flex-col">
                                            <div className="flex-1 flex flex-col p-6 rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-300 bg-white/[0.02] h-full">
                                                {/* Icono / Imagen Circular */}
                                                <div className="relative w-14 h-14 rounded-full bg-white/5 border border-white/15 flex items-center justify-center mb-5 flex-shrink-0 transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/40">
                                                    {strImg ? (
                                                        <img
                                                            src={strImg}
                                                            alt={str.name || 'Fortaleza'}
                                                            className="w-7 h-7 object-contain transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <i className={`${str.icon || 'fas fa-shield-alt'} text-primary text-xl transition-transform duration-300 group-hover:scale-110`}></i>
                                                    )}
                                                </div>

                                                {/* Título de la fortaleza */}
                                                <h3 className="text-xl font-title text-white mb-3 group-hover:text-primary transition-colors">
                                                    {str.name}
                                                </h3>

                                                {/* Descripción */}
                                                {str.description && (
                                                    <p className="text-white text-sm font-light whitespace-pre-line flex-1">
                                                        {str.description}
                                                    </p>
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>

                            {/* Paginación idéntica a HeroRhino.jsx */}
                            {strengths.length > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    {strengths.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => swiperStrengthRef.current?.slideToLoop(idx)}
                                            aria-label={`Ir al slide ${idx + 1}`}
                                            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${activeStrengthSlide === idx
                                                    ? 'w-8 bg-primary shadow-md'
                                                    : 'w-2.5 bg-white/30 hover:bg-white/60'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Botón de Acción CTA para Fortalezas */}
                        <div className="mt-12 text-center">
                            <button
                                type="button"
                                onClick={handleCotizarClick}
                                className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-dark font-bold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 text-base cursor-pointer"
                            >
                                <i className="fab fa-whatsapp text-xl"></i>
                                Cotizar este servicio ahora
                            </button>
                        </div>
                    </div>
                </section>
            )}
            {/* ── 4. PROCESO DE TRABAJO / ACCORDION CON IMAGEN DINÁMICA DE ETAPAS ───────────── */}
            {steps.length > 0 && (
                <section className="py-10 md:py-12 bg-page-background border-t border-white/10 relative overflow-hidden font-paragraph">
                    <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10">
                        {/* Header de Sección Estilo Rhino */}
                        <div className="max-w-3xl mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                Proceso de Trabajo
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-8xl font-title text-white ">
                                Nuestro método en <span className="text-primary block md:inline font-title">etapas claras</span>
                            </h2>
                            <p className="mt-4 text-base md:text-lg lg:text-xl text-white font-light max-w-xl">
                                Guía paso a paso para garantizar la máxima calidad y entrega eficiente en cada proyecto.
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
                                            {/* Cabecera del ítem de acordeón */}
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

                                            {/* Contenido expandible del acordeón ultra fluido */}
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

                            {/* Columna Derecha (5 cols): Visualización de Imagen Dinámica de la Etapa Seleccionada (Aspect Square 1/1) */}
                            <div className="lg:col-span-5">
                                {(() => {
                                    const currentStep = steps[activeStep] || steps[0];
                                    const stepImg = getServiceImage(currentStep?.image) || (currentStep?.image && (currentStep.image.startsWith('data:') || currentStep.image.startsWith('/') || currentStep.image.startsWith('http')) ? currentStep.image : null);
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

            {/* ── 5. PREGUNTAS FRECUENTES (FAQS) CENTRADAS CON BOTÓN CTA ─────────────────── */}
            {faqs.length > 0 && (
                <section className="py-10 md:py-12 bg-page-background  relative overflow-hidden font-paragraph">
                    <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10">
                        {/* Header Centrado de Sección Estilo Rhino */}
                        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                Preguntas Frecuentes
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-title text-white">
                                Respuesta a tus <span className="text-primary font-title">dudas principales</span>
                            </h2>
                            <p className="mt-4 text-base md:text-lg lg:text-xl text-white font-light">
                                Resolvemos tus inquietudes sobre nuestros servicios, procesos de trabajo y entregables.
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

export default ServiceDetailRhino;
