import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

import "swiper/css";

/**
 * AboutRhino
 *
 * Componente Sobre Nosotros tipo Landing Page para Rhino Technology.
 * Renderiza dinámicamente las secciones según los correlativos definidos en DB (Admin/About.jsx):
 * - section-hero     : Hero Principal
 * - section-historia : Nuestra Historia
 * - section-mision   : Misión
 * - section-vision   : Visión
 * - section-valores  : Valores & Fortalezas
 * - section-equipo   : Nuestro Equipo
 * - section-cta      : Call to Action Final
 *
 * Estrictamente dinámico: sin arreglos ni datos simulados por defecto.
 */

const getAboutUsImage = (imgName) => {
    if (!imgName) return null;
    if (typeof imgName === "string" && imgName.trim()) {
        if (
            imgName.startsWith("data:") ||
            imgName.startsWith("/") ||
            imgName.startsWith("http")
        )
            return imgName;
        return `/storage/images/aboutus/${imgName}`;
    }
    return null;
};

const getStrengthImage = (imgName) => {
    if (!imgName) return null;
    if (typeof imgName === "string" && imgName.trim()) {
        if (
            imgName.startsWith("data:") ||
            imgName.startsWith("/") ||
            imgName.startsWith("http")
        )
            return imgName;
        return `/storage/images/strength/${imgName}`;
    }
    return null;
};

const AboutRhino = ({ data = {}, filteredData = {}, items = [], generals = [] }) => {
    const hero =
        items?.find((item) => item.correlative === "section-hero") ||
        items?.[0];
    const historia =
        items?.find((item) => item.correlative === "section-historia");
    const mision =
        items?.find((item) => item.correlative === "section-mision");
    const vision =
        items?.find((item) => item.correlative === "section-vision");
    const valores =
        items?.find((item) => item.correlative === "section-valores");
    const equipo =
        items?.find((item) => item.correlative === "section-equipo");
    const ctaSection =
        items?.find((item) => item.correlative === "section-cta");



    const [strengths, setStrengths] = useState(filteredData?.strengths || []);
    const [isWhatsappOpen, setIsWhatsappOpen] = useState(false);
    const whatsappRef = useRef(null);

    // Cargar fortalezas si existen en la API y no vinieron por props
    useEffect(() => {
        if (strengths.length > 0) return;

        fetch("/api/strengths")
            .then((res) => res.json())
            .then((resData) => {
                if (Array.isArray(resData) && resData.length > 0) {
                    setStrengths(resData);
                }
            })
            .catch(() => { });
    }, [items, strengths.length]);

    // Parseo de Asesores WhatsApp desde generals
    const advisorsGeneral = generals?.find?.(
        (g) => g.correlative === "whatsapp_advisors"
    )?.value;
    let advisors = [];
    if (Array.isArray(advisorsGeneral)) advisors = advisorsGeneral;
    else if (typeof advisorsGeneral === "string") {
        try {
            advisors = JSON.parse(advisorsGeneral);
        } catch (e) {
            advisors = [];
        }
    }
    if (!advisors.length) {
        const singlePhone =
            generals?.find?.(
                (g) =>
                    g.correlative === "phone_whatsapp" ||
                    g.correlative === "whatsapp"
            )?.value || "51999999999";
        advisors = [
            {
                name: "Asesor Comercial",
                phone: singlePhone,
                position: "Atención al Cliente",
            },
        ];
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                whatsappRef.current &&
                !whatsappRef.current.contains(event.target)
            ) {
                setIsWhatsappOpen(false);
            }
        };
        if (isWhatsappOpen)
            document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isWhatsappOpen]);

    const handleCotizarClick = (e) => {
        if (advisors.length > 1) {
            e.preventDefault();
            setIsWhatsappOpen(!isWhatsappOpen);
        } else if (advisors.length === 1) {
            const adv = advisors[0];
            const phone = String(adv.phone || adv.number || "").replace(
                /[^0-9]/g,
                ""
            );
            const msg =
                adv.message ||
                `¡Hola! Deseo cotizar con Rhino Technology.`;
            window.open(
                `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
                    msg
                )}`,
                "_blank"
            );
        }
    };

    const heroImgUrl = getAboutUsImage(hero?.image);

    // Misión y Visión dinámicas
    const purposeSteps = [];
    if (mision && mision.visible !== 0) {
        purposeSteps.push({
            step_number: "01",
            name: mision.title || mision.name || "Nuestra Misión",
            description: mision.description
                ? mision.description.replace(/<[^>]*>/g, "").trim()
                : "",
            htmlDescription: mision.description,
            image: mision.image,
            slogan: mision.slogan,
        });
    }
    if (vision && vision.visible !== 0) {
        purposeSteps.push({
            step_number: String(purposeSteps.length + 1).padStart(2, "0"),
            name: vision.title || vision.name || "Nuestra Visión",
            description: vision.description
                ? vision.description.replace(/<[^>]*>/g, "").trim()
                : "",
            htmlDescription: vision.description,
            image: vision.image,
            slogan: vision.slogan,
        });
    }

    return (
        <div
            id={data?.element_id || "nosotros-rhino"}
            className={`min-h-screen bg-page-background text-white ${data?.class || data?.class_section || ""
                }`}
        >
            {/* ── 1. HERO PRINCIPAL (section-hero) ─────────────────────────────────── */}
            {hero && hero.visible !== 0 && (
                <section className="relative overflow-hidden pt-28 md:pt-36 pb-16 md:pb-24 bg-dark min-h-[70dvh] flex items-center">
                    {heroImgUrl && (
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <img
                                src={heroImgUrl}
                                alt={hero.title || hero.name || "Hero"}
                                className="w-full h-full object-cover opacity-35"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-page-background via-page-background/20 to-transparent pointer-events-none" />
                        </div>
                    )}
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10 w-full">
                        <div className="max-w-4xl">


                            {hero.title && (
                                <h1 className="text-5xl md:text-6xl lg:text-8xl font-title text-white mb-6">
                                    <TextWithHighlight
                                        text={hero.title}
                                        className="font-title"
                                        color="bg-primary"
                                    />
                                </h1>
                            )}

                            {hero.slogan && (
                                <p className="text-primary font-mono text-base md:text-lg lg:text-xl font-bold mb-4 uppercase tracking-wider">
                                    {hero.slogan}
                                </p>
                            )}

                            {hero.description && (
                                <div
                                    className="text-white text-base md:text-lg lg:text-xl mb-8 prose  max-w-none "
                                    dangerouslySetInnerHTML={{
                                        __html: hero.description.replace(
                                            /<p><br><\/p>/g,
                                            ""
                                        ),
                                    }}
                                />
                            )}

                            <div
                                className="relative flex flex-wrap items-center gap-4 pt-2"
                                ref={whatsappRef}
                            >
                                <button
                                    type="button"
                                    onClick={handleCotizarClick}
                                    className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-dark font-bold px-7 py-3 lg:py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 text-base cursor-pointer"
                                >
                                    <i className="fab fa-whatsapp text-xl"></i> Cotizar Proyecto
                                </button>

                                <a
                                    href={hero.link || "/contacto"}
                                    className="inline-flex items-center gap-3 border border-white/20 text-white hover:bg-white/10 font-semibold px-7 py-3 lg:py-3.5 rounded-full transition-all duration-300 text-base"
                                >
                                    <i className="fas fa-envelope text-lg"></i> Contáctanos
                                </a>

                                <AnimatePresence>
                                    {isWhatsappOpen && advisors.length > 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute left-0 top-full mt-3 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                                            style={{ minWidth: "300px", maxWidth: "340px" }}
                                        >
                                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                                                <h3 className="font-bold text-base">
                                                    Cotizar con un Asesor
                                                </h3>
                                            </div>
                                            <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                                                {advisors.map((adv, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => {
                                                            const phone = String(
                                                                adv.phone ||
                                                                adv.number ||
                                                                ""
                                                            ).replace(/[^0-9]/g, "");
                                                            window.open(
                                                                `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
                                                                    adv.message || "Hola"
                                                                )}`,
                                                                "_blank"
                                                            );
                                                            setIsWhatsappOpen(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 p-3 hover:bg-green-50 transition-colors text-left cursor-pointer"
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                                                            {adv.name
                                                                ?.charAt(0)
                                                                ?.toUpperCase()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-gray-900 text-sm truncate">
                                                                {adv.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {adv.position}
                                                            </p>
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
            )}



            {/* ── 3. NUESTRA HISTORIA (section-historia) ─────────────────────────────── */}
            {historia && historia.visible !== 0 && (
                <section className="py-10 md:py-12 bg-page-background text-white border-t border-white/10 relative overflow-hidden font-paragraph">
                    <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10">
                        {historia.name && (
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold backdrop-blur-md">
                                {historia.name}
                            </div>
                        )}

                        {historia.title && (
                            <h2 className="text-4xl md:text-5xl lg:text-8xl font-title text-white">
                                <TextWithHighlight
                                    text={historia.title}
                                    className="font-title"
                                    color="bg-primary"
                                />
                            </h2>
                        )}
                        {/* Columna Derecha: Imagen de Historia */}
                        {historia.image && (
                            <div className="lg:col-span-5 my-4 md:my-10">
                                <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[16/8] rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-2xl group">
                                    <img
                                        src={getAboutUsImage(historia.image)}
                                        alt={historia.title || "Historia"}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/assets/img/noimage/no_img.jpg";
                                        }}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-page-background/90 via-transparent to-transparent pointer-events-none" />
                                </div>
                            </div>
                        )}
                        <div className="grid  gap-12 lg:gap-16 items-center">
                            {/* Columna Izquierda: Texto e Historia */}
                            <div className={`space-y-6 ${historia.image ? 'lg:col-span-12' : 'lg:col-span-12'}`}>


                                {historia.slogan && (
                                    <p className="text-primary font-mono text-base md:text-lg font-semibold">
                                        // {historia.slogan}
                                    </p>
                                )}

                                {historia.description && (
                                    <div
                                        className="text-white text-base md:text-lg font-light leading-relaxed prose prose-invert max-w-none [&_p]:mb-4 [&_strong]:text-white [&_strong]:font-semibold"
                                        dangerouslySetInnerHTML={{
                                            __html: historia.description.replace(
                                                /<p><br><\/p>/g,
                                                ""
                                            ),
                                        }}
                                    />
                                )}
                            </div>


                        </div>
                    </div>
                </section>
            )}

            {/* ── 4. MISIÓN Y VISIÓN (section-mision y section-vision) ──────────────── */}
            {purposeSteps.length > 0 && (
                <section className="py-10 md:py-12 bg-page-background border-t border-white/10 relative overflow-hidden font-paragraph">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10">
                        <div className="max-w-3xl mb-10">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                Propósito Corporativo
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-8xl font-title text-white">
                                Misión & <span className="text-primary block md:inline font-title">Visión</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                            {/* Columna Izquierda (7 cols): Misión y Visión siempre expandidas */}
                            <div className="lg:col-span-7 space-y-6">
                                {purposeSteps.map((st, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-6 space-y-4 shadow-lg"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="font-title font-bold text-xl md:text-3xl text-primary">
                                                {st.step_number}
                                            </span>
                                            <div>
                                                <h3 className="font-title text-xl md:text-3xl text-white">
                                                    {st.name}
                                                </h3>
                                                {st.slogan && (
                                                    <p className="text-xs text-primary font-mono mt-0.5">
                                                        {st.slogan}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-white text-base md:text-lg font-light leading-relaxed prose prose-invert max-w-none  border-t border-white/5">
                                            {st.htmlDescription ? (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: st.htmlDescription,
                                                    }}
                                                />
                                            ) : (
                                                st.description
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Columna Derecha (5 cols): Imagen Fija de Misión / Visión */}
                            <div className="lg:col-span-5">
                                {(() => {
                                    const purposeImg =
                                        getAboutUsImage(mision?.image) ||
                                        getAboutUsImage(vision?.image) ||
                                        heroImgUrl;

                                    return (
                                        <div className="sticky top-28 w-full">
                                            <div className="relative w-full aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden shadow-2xl group">
                                                {purposeImg ? (
                                                    <img
                                                        src={purposeImg}
                                                        alt={mision?.title || vision?.title || "Misión & Visión"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-primary/10 via-white/[0.02] to-transparent">
                                                        <h4 className="font-title text-2xl font-bold text-white mb-2">
                                                            Misión & Visión
                                                        </h4>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── 5. VALORES & FORTALEZAS (section-valores o strengths del backend) ──── */}
            {(valores || strengths.length > 0) && (
                <section className="py-12 md:py-20 bg-page-background text-white border-t border-white/10 relative overflow-hidden font-paragraph">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10">
                        <div className="max-w-3xl mb-12 md:mb-16">
                            {valores?.name && (
                                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                    {valores.name}
                                </div>
                            )}
                            {valores?.title && (
                                <h2 className="text-4xl md:text-5xl lg:text-8xl font-title text-white">
                                    <TextWithHighlight
                                        text={valores.title}
                                        className="font-title"
                                        color="bg-primary"
                                    />
                                </h2>
                            )}
                            {valores?.slogan && (
                                <p className="mt-2 text-primary font-mono text-base font-semibold">
                                    // {valores.slogan}
                                </p>
                            )}
                            {valores?.description && (
                                <div
                                    className="mt-4 text-base md:text-lg lg:text-xl text-white font-light max-w-xl prose prose-invert"
                                    dangerouslySetInnerHTML={{ __html: valores.description }}
                                />
                            )}
                        </div>

                        {strengths.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                                {strengths.map((str, idx) => {
                                    const strImg = getStrengthImage(str.image);
                                    return (
                                        <div
                                            key={idx}
                                            className="group relative flex flex-col p-6 md:p-8 rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5"
                                        >
                                            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/15 flex items-center justify-center mb-6 flex-shrink-0 transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/40">
                                                {strImg ? (
                                                    <img
                                                        src={strImg}
                                                        alt={str.name || "Fortaleza"}
                                                        className="w-7 h-7 md:w-8 md:h-8 object-contain transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <i
                                                        className={`${str.icon || "fas fa-shield-alt"
                                                            } text-primary text-xl md:text-2xl transition-transform duration-300 group-hover:scale-110`}
                                                    ></i>
                                                )}
                                            </div>

                                            {str.name && (
                                                <h3 className="text-xl md:text-3xl font-title text-white mb-3 group-hover:text-primary transition-colors">
                                                    {str.name}
                                                </h3>
                                            )}

                                            {str.description && (
                                                <p className="text-white text-sm md:text-base font-light whitespace-pre-line">
                                                    {str.description}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ── 6. NUESTRO EQUIPO (section-equipo) ─────────────────────────────────── */}
            {equipo && equipo.visible !== 0 && (
                <section className="py-16 md:py-24 bg-page-background border-t border-white/10 relative overflow-hidden font-paragraph">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                            {/* Imagen de Equipo */}
                            {equipo.image && (
                                <div className="lg:col-span-5 order-2 lg:order-1">
                                    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-2xl group">
                                        <img
                                            src={getAboutUsImage(equipo.image)}
                                            alt={equipo.title || "Nuestro Equipo"}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "/assets/img/noimage/no_img.jpg";
                                            }}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-page-background/90 via-transparent to-transparent pointer-events-none" />
                                    </div>
                                </div>
                            )}

                            {/* Contenido de Equipo */}
                            <div className={`space-y-6 order-1 lg:order-2 ${equipo.image ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                                {equipo.name && (
                                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold backdrop-blur-md">
                                        {equipo.name}
                                    </div>
                                )}

                                {equipo.title && (
                                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-title text-white">
                                        <TextWithHighlight
                                            text={equipo.title}
                                            className="font-title"
                                        />
                                    </h2>
                                )}

                                {equipo.slogan && (
                                    <p className="text-primary font-mono text-base md:text-lg font-semibold">
                                        // {equipo.slogan}
                                    </p>
                                )}

                                {equipo.description && (
                                    <div
                                        className="text-white/80 text-base md:text-lg font-light leading-relaxed prose prose-invert max-w-none [&_p]:mb-4 [&_strong]:text-white [&_strong]:font-semibold"
                                        dangerouslySetInnerHTML={{
                                            __html: equipo.description.replace(
                                                /<p><br><\/p>/g,
                                                ""
                                            ),
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── 7. CALL TO ACTION FINAL (section-cta) ────────────────────────────── */}
            {ctaSection && ctaSection.visible !== 0 && (
                <section className="py-16 md:py-24 bg-page-background relative overflow-hidden font-paragraph border-t border-white/10">
                    <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0 relative z-10 text-center max-w-4xl font-paragraph">
                        {ctaSection.name && (
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-6 backdrop-blur-md">
                                {ctaSection.name}
                            </div>
                        )}

                        {ctaSection.title && (
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-title text-white mb-6">
                                <TextWithHighlight
                                    text={ctaSection.title}
                                    className="font-title"
                                />
                            </h2>
                        )}

                        {ctaSection.slogan && (
                            <p className="text-primary font-mono text-base md:text-lg mb-4">
                                // {ctaSection.slogan}
                            </p>
                        )}

                        {ctaSection.description && (
                            <div
                                className="text-white/80 text-base md:text-lg lg:text-xl font-light mb-10 max-w-2xl mx-auto prose prose-invert"
                                dangerouslySetInnerHTML={{
                                    __html: ctaSection.description,
                                }}
                            />
                        )}

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={handleCotizarClick}
                                className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-dark font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 text-base cursor-pointer"
                            >
                                <i className="fab fa-whatsapp text-xl"></i>
                                Cotizar Proyecto
                            </button>
                            <a
                                href={ctaSection.link || "/contacto"}
                                className="inline-flex items-center gap-3 border border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full transition-all duration-300 text-base"
                            >
                                <i className="fas fa-envelope text-lg"></i>
                                Enviar Mensaje
                            </a>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default AboutRhino;
