import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

// SliderTwenty: misma funcionalidad de SliderInteractive (loop, autoplay,
// drag touch/mouse, overlays por slide, contenido por slide, botones),
// con UI streetwear full-bleed: título gigante abajo-izquierda, botón
// blanco, flechas laterales cuadradas y paginación de dashes.
const SliderTwenty = ({ items, data, generals = [] }) => {
    // Animación Ken Burns de imagen
    const hasAnimation =
        data?.animation_slider === "true" ||
        data?.animation_slider === "si" ||
        data?.animation_slider === true;

    const imageVariants = hasAnimation
        ? {
            initial: { scale: 1, opacity: 1 },
            animate: {
                scale: [1, 1.2, 1],
                x: [1, -50, 1],
                opacity: 1,
                transition: { duration: 20, repeat: Infinity, repeatType: "loop" },
            },
            exit: { scale: 1, opacity: 1, transition: { duration: 0.1 } },
        }
        : {
            initial: { scale: 1, opacity: 1 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 1, opacity: 1, transition: { duration: 0.1 } },
        };

    // Animaciones de textos
    const titleVariants = {
        initial: { opacity: 0, y: 40, scale: 0.98 },
        animate: {
            opacity: 1, y: 0, scale: 1,
            transition: { duration: 0.55, delay: 0.15, ease: "easeOut" },
        },
        exit: {
            opacity: 0, y: -20, scale: 0.98,
            transition: { duration: 0.3, ease: "easeInOut" },
        },
    };

    const descriptionVariants = {
        initial: { opacity: 0, y: 25 },
        animate: {
            opacity: 1, y: 0,
            transition: { duration: 0.5, delay: 0.3, ease: "easeOut" },
        },
        exit: { opacity: 0, y: -15, transition: { duration: 0.25, ease: "easeInOut" } },
    };

    const buttonsVariants = {
        initial: { opacity: 0, y: 30 },
        animate: {
            opacity: 1, y: 0,
            transition: { duration: 0.5, delay: 0.45, ease: "easeOut" },
        },
        exit: { opacity: 0, y: 15, transition: { duration: 0.2, ease: "easeInOut" } },
    };

    const containerVariants = {
        initial: {},
        animate: { transition: { staggerChildren: 0.1 } },
        exit: {},
    };

    // Parse boolean/string option for toggles
    const parseBool = (value, defaultValue = false) => {
        if (value === true || value === "true" || value === "si" || value === "yes" || value === 1 || value === "1") return true;
        if (value === false || value === "false" || value === "no" || value === 0 || value === "0") return false;
        return defaultValue;
    };

    const infiniteLoop = parseBool(data?.infiniteLoop, true);
    const showNavigation = parseBool(data?.showNavigation, true);
    const showPagination = parseBool(data?.showPagination, true);

    const [currentIndex, setCurrentIndex] = useState(1);
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentTranslate = useRef(0);

    // Ordenar items por order_index de menor a mayor antes de reasignar índices
    const sortedItems =
        items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) || [];
    const duplicatedItems = [
        sortedItems[sortedItems.length - 1],
        ...sortedItems,
        sortedItems[0],
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % duplicatedItems.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? duplicatedItems.length - 1 : prevIndex - 1,
        );
    };

    // Helper para saber si el evento fue sobre un botón o enlace
    const isEventOnButtonOrLink = (e) => {
        let el = e.target;
        while (el) {
            if (el.tagName === "A" || el.tagName === "BUTTON") return true;
            el = el.parentElement;
        }
        return false;
    };

    // Handle touch events for mobile
    const handleTouchStart = (e) => {
        if (isEventOnButtonOrLink(e)) return;
        isDragging.current = true;
        startX.current = e.touches[0].pageX;
        sliderRef.current.style.transition = "none";
    };

    const handleTouchMove = (e) => {
        if (!isDragging.current) return;
        const deltaX = e.touches[0].pageX - startX.current;
        currentTranslate.current =
            -currentIndex * 100 + (deltaX / window.innerWidth) * 100;
        sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
    };

    const handleTouchEnd = (e) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        sliderRef.current.style.transition = "transform 0.5s ease-in-out";
        const threshold = 20;
        const deltaX = Math.abs(
            (currentTranslate.current + currentIndex * 100) *
            (window.innerWidth / 100),
        );
        if (deltaX > threshold) {
            if (currentTranslate.current > -currentIndex * 100) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            setCurrentIndex(currentIndex);
        }
        sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    // Mouse events for desktop
    const handleMouseDown = (e) => {
        if (isEventOnButtonOrLink(e)) return;
        isDragging.current = true;
        startX.current = e.pageX;
        sliderRef.current.style.transition = "none";
        e.preventDefault(); // Prevenir selección de texto
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const deltaX = e.pageX - startX.current;
        currentTranslate.current =
            -currentIndex * 100 + (deltaX / window.innerWidth) * 100;
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
        }
    };

    const handleMouseUp = (e) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        if (!sliderRef.current) return;

        sliderRef.current.style.transition = "transform 0.5s ease-in-out";
        const threshold = 50;
        const deltaX = Math.abs(
            (currentTranslate.current + currentIndex * 100) *
            (window.innerWidth / 100),
        );
        if (deltaX > threshold) {
            if (currentTranslate.current > -currentIndex * 100) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        currentTranslate.current = 0;
    };

    const handleMouseLeave = (e) => {
        if (isDragging.current) {
            handleMouseUp(e);
        }
    };

    // Manejo seguro del autoplay
    useEffect(() => {
        if (!infiniteLoop) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [infiniteLoop, currentIndex]);

    // Efecto para manejar el loop infinito sin saltos bruscos ni parpadeos dobles
    useEffect(() => {
        if (currentIndex === 0) {
            const timer = setTimeout(() => {
                if (!sliderRef.current) return;
                sliderRef.current.style.transition = "none";
                setCurrentIndex(duplicatedItems.length - 2);
                sliderRef.current.style.transform = `translateX(-${(duplicatedItems.length - 2) * 100}%)`;
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (sliderRef.current) {
                            sliderRef.current.style.transition = "transform 0.5s ease-in-out";
                        }
                    });
                });
            }, 500);
            return () => clearTimeout(timer);
        } else if (currentIndex === duplicatedItems.length - 1) {
            const timer = setTimeout(() => {
                if (!sliderRef.current) return;
                sliderRef.current.style.transition = "none";
                setCurrentIndex(1);
                sliderRef.current.style.transform = `translateX(-100%)`;
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (sliderRef.current) {
                            sliderRef.current.style.transition = "transform 0.5s ease-in-out";
                        }
                    });
                });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, duplicatedItems.length]);

    const buttonsRef = useRef([]);

    useEffect(() => {
        buttonsRef.current.forEach((button) => {
            if (button) adjustTextColor(button);
        });
    }, [sortedItems]);

    if (!sortedItems || sortedItems.length === 0) return null;

    return (
        <div
            id={data?.element_id || null}
            className={`relative w-full aspect-square md:aspect-auto mx-auto bg-black ${data?.class_slider_section || ""}`}
        >
            <div
                className={`overflow-hidden relative h-auto aspect-square md:aspect-auto  md:h-[92dvh] md:min-h-[600px] md:max-h-[calc(100dvh-18dvh)] ${isDragging.current ? "cursor-grabbing" : "cursor-grab"} ease ${data?.class_slider || ""}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ userSelect: "none" }}
            >
                <div
                    ref={sliderRef}
                    className="flex h-full"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: "transform 0.5s ease-in-out",
                    }}
                >
                    {duplicatedItems.map((item, index) =>
                        !item ? null : (
                            <div
                                key={`slide-${index}`}
                                className="w-full h-full flex-shrink-0 relative"
                            >
                                <AnimatePresence>
                                    {currentIndex === index && (
                                        <>
                                            {/* Desktop Image */}
                                            <motion.img
                                                key={`image-desktop-${index}`}
                                                src={`/storage/images/slider/${item.bg_image || "undefined"}`}
                                                alt={item.name || "Banner Twenty"}
                                                loading="eager"
                                                fetchpriority="high"
                                                decoding="async"
                                                width="1920"
                                                height="900"
                                                className={`hidden md:block absolute inset-0 h-full w-full object-cover ${data?.imageBgPosition || "object-center"} z-0`}
                                                variants={imageVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "/api/cover/thumbnail/null"; }}
                                            />
                                            {/* Mobile Image */}
                                            <motion.img
                                                key={`image-mobile-${index}`}
                                                src={`/storage/images/slider/${item.bg_image_mobile || item.bg_image || "undefined"}`}
                                                alt={item.name || "Banner Mobile Twenty"}
                                                loading="eager"
                                                fetchpriority="high"
                                                decoding="async"
                                                width="768"
                                                height="1024"
                                                className={`block md:hidden absolute inset-0 h-full w-full object-cover ${data?.imageBgPosition || "object-center"} z-0`}
                                                variants={imageVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "/api/cover/thumbnail/null"; }}
                                            />
                                        </>
                                    )}
                                </AnimatePresence>

                                {/* Viñeta cinematográfica base */}
                                <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/15 to-black/40"></div>

                                {/* Overlays personalizados por slide (como SliderInteractive) */}
                                {item?.show_overlay !== false &&
                                    item?.show_overlay !== 0 && (
                                        <div
                                            className="absolute inset-0 z-[2]"
                                            style={{
                                                background: `linear-gradient(${item?.overlay_direction === "to-r"
                                                    ? "to right"
                                                    : item?.overlay_direction === "to-l"
                                                        ? "to left"
                                                        : item?.overlay_direction === "to-t"
                                                            ? "to top"
                                                            : item?.overlay_direction === "to-b"
                                                                ? "to bottom"
                                                                : item?.overlay_direction === "to-tr"
                                                                    ? "to top right"
                                                                    : item?.overlay_direction === "to-tl"
                                                                        ? "to top left"
                                                                        : item?.overlay_direction === "to-br"
                                                                            ? "to bottom right"
                                                                            : item?.overlay_direction === "to-bl"
                                                                                ? "to bottom left"
                                                                                : "to bottom"
                                                    }, ${item?.overlay_color || "#000000"}${Math.round(
                                                        (item?.overlay_opacity ?? 50) * 2.55,
                                                    )
                                                        .toString(16)
                                                        .padStart(2, "0")}, transparent)`,
                                            }}
                                        ></div>
                                    )}

                                {item?.show_content !== false &&
                                    item?.show_content !== 0 &&
                                    item?.show_content !== "0" &&
                                    item?.show_content !== "false" && (
                                        <div className={`absolute inset-0 z-[3] ${data?.class_slider_container || ""}`}>
                                            <div className="h-full w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto flex flex-col justify-end pb-16 md:pb-24">
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={`content-${currentIndex}-${item.name}`}
                                                        variants={containerVariants}
                                                        initial="initial"
                                                        animate="animate"
                                                        exit="exit"
                                                        className="max-w-3xl"
                                                    >
                                                        <motion.h2
                                                            variants={titleVariants}
                                                            className={`font-title font-bold uppercase leading-[0.95]  text-white text-4xl sm:text-6xl md:text-7xl xl:text-8xl ${data?.class_title || ""}`}
                                                            style={{
                                                                color: item.title_color || "#FFFFFF",
                                                                textShadow: "0 2px 30px rgba(0,0,0,.45)",
                                                            }}
                                                        >
                                                            <TextWithHighlight text={item.name} color="" />
                                                        </motion.h2>
                                                        {item.description && (
                                                            <motion.p
                                                                variants={descriptionVariants}
                                                                className={`mt-3 md:mt-4 text-white/85 text-sm md:text-lg max-w-xl font-paragraph ${data?.class_description || ""}`}
                                                                style={{
                                                                    color: item.description_color || undefined,
                                                                    textShadow: "0 1px 16px rgba(0,0,0,.5)",
                                                                }}
                                                            >
                                                                {item.description}
                                                            </motion.p>
                                                        )}
                                                        {((item.button_text && item.button_link) ||
                                                            (item.secondary_button_text && item.secondary_button_link)) && (
                                                                <motion.div
                                                                    variants={buttonsVariants}
                                                                    className="mt-6 md:mt-8 flex flex-row flex-wrap items-center gap-3 md:gap-4"
                                                                >
                                                                    {item.button_text && item.button_link && (
                                                                        <a
                                                                            href={item.button_link}
                                                                            title={item.button_text}
                                                                            aria-label={`${item.button_text} - Slide ${index + 1}`}
                                                                            target={item?.button_new_tab ? "_blank" : "_self"}
                                                                            rel={item?.button_new_tab ? "noopener noreferrer" : undefined}
                                                                            ref={(el) => (buttonsRef.current[index] = el)}
                                                                            className={`inline-flex items-center gap-2.5 bg-white px-7 py-3.5 text-xs font-bold uppercase  text-black transition-all duration-300 hover:bg-white/85 hover:gap-4 rounded-full ${data?.class_button_primary || ""}`}
                                                                            onClick={(e) => { e.stopPropagation(); }}
                                                                            onMouseDown={(e) => e.stopPropagation()}
                                                                            onTouchStart={(e) => e.stopPropagation()}
                                                                        >
                                                                            {item.button_text}
                                                                            <ArrowRight size={14} strokeWidth={2.5} />
                                                                        </a>
                                                                    )}

                                                                    {/* Botón Secundario */}
                                                                    {item.secondary_button_text && item.secondary_button_link && (
                                                                        <a
                                                                            href={item.secondary_button_link}
                                                                            title={item.secondary_button_text}
                                                                            aria-label={`${item.secondary_button_text} - Slide ${index + 1}`}
                                                                            target={item?.secondary_button_new_tab ? "_blank" : "_self"}
                                                                            rel={item?.secondary_button_new_tab ? "noopener noreferrer" : undefined}
                                                                            className="inline-flex items-center gap-2 border-2 border-white/70 px-7 py-3 text-xs font-bold uppercase  text-white transition-all duration-300 hover:bg-white hover:text-black rounded-full"
                                                                            onClick={(e) => { e.stopPropagation(); }}
                                                                            onMouseDown={(e) => e.stopPropagation()}
                                                                            onTouchStart={(e) => e.stopPropagation()}
                                                                        >
                                                                            {item.secondary_button_text}
                                                                        </a>
                                                                    )}
                                                                </motion.div>
                                                            )}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ),
                    )}
                </div>
            </div>

            {/* Flechas laterales */}
            {showNavigation && (
                <>
                    <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Slide anterior"
                        title="Slide anterior"
                        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-10 md:h-10 hidden sm:flex items-center justify-center bg-black/60 text-white transition-all duration-300 hover:bg-black hover:scale-105"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Siguiente slide"
                        title="Siguiente slide"
                        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-10 md:h-10 hidden sm:flex items-center justify-center bg-black/60 text-white transition-all duration-300 hover:bg-black hover:scale-105"
                    >
                        <ChevronRight size={18} />
                    </button>
                </>
            )}

            {/* Paginación dashes abajo-derecha */}
            {showPagination && (
                <div className="absolute bottom-6 right-[5%] z-30 flex items-center gap-1.5">
                    {sortedItems.map((_, index) => (
                        <button
                            key={`dot-${index}`}
                            type="button"
                            aria-label={`Ir al slide ${index + 1}`}
                            title={`Ir al slide ${index + 1}`}
                            onClick={() => setCurrentIndex(index + 1)}
                            className={`h-[3px] transition-all duration-300 ${currentIndex === index + 1
                                ? "w-6 bg-white"
                                : "w-2 bg-white/40 hover:bg-white/70"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SliderTwenty;
