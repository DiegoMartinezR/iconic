import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import CardProductTwenty from "./Components/CardProductTwenty";
import ProductCardSelector from "./ProductCardSelector";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

// ProductSwiperTwenty: carrusel en móvil/tablet + grilla 4x2 en desktop,
// con estética fashion limpia sobre bg-primary.
const ProductSwiperTwenty = ({ items, data, setCart, cart }) => {
    if (!items || items.length === 0) return null;

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const bgClass = data?.bg_class || "bg-primary";
    const textClass = data?.text_class || "text-white";

    // Primeros 8 productos para la grilla desktop (4x2)
    const gridItems = items.slice(0, 8);

    const renderCard = (product, index) => {
        if (!data?.type_card_product || data?.type_card_product === "CardProductTwenty" || data?.type_card_product === "twenty") {
            return (
                <CardProductTwenty
                    product={product}
                    setCart={setCart}
                    cart={cart}
                    data={data}
                />
            );
        }
        return (
            <ProductCardSelector
                cardType={data.type_card_product}
                product={product}
                setCart={setCart}
                cart={cart}
                data={data}
            />
        );
    };

    return (
        <section
            id={data?.element_id || null}
            className={`relative overflow-hidden ${bgClass} ${data?.class_container || ""}`}
        >
            <div className="relative z-10 py-10 md:py-16">
                <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">

                    {/* Header */}
                    <div className="mb-6 md:mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                            {data?.badge && (
                                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase text-white">
                                    {data?.badge}
                                </span>
                            )}

                            <h2
                                className={`mt-3 ${textClass} uppercase font-black leading-[0.95] ${data?.class_title || "text-4xl sm:text-5xl lg:text-6xl"}`}
                            >
                                <TextWithHighlight text={data?.title || "Destacados"} color="text-twenty" className="" />
                            </h2>

                            {data?.description && (
                                <p className="mt-3 max-w-md text-sm md:text-[15px] text-white/70">
                                    {data.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                ref={prevRef}
                                className="hidden w-10 h-10 flex items-center justify-center rounded-full border border-white/25 text-white hover:bg-white hover:text-primary hover:border-white transition-all duration-300"
                                aria-label="Anterior"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                ref={nextRef}
                                className="hidden w-10 h-10 flex items-center justify-center rounded-full border border-white/25 text-white hover:bg-white hover:text-primary hover:border-white transition-all duration-300"
                                aria-label="Siguiente"
                            >
                                <ChevronRight size={18} />
                            </button>

                            {data?.show_link_catalog !== false && data?.link_catalog && (
                                <a
                                    href={data.link_catalog}
                                    className="group hidden lg:inline-flex items-center gap-2 bg-white text-primary pl-5 pr-4 py-2.5 rounded-full text-xs font-bold uppercase hover:bg-white/90 transition-all duration-300 shadow-lg"
                                >
                                    Ver catálogo
                                    <ArrowRight
                                        size={14}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Móvil y tablet: Swiper */}
                    <div className="hidden">
                        <Swiper
                            modules={[Autoplay, A11y, Keyboard, Navigation]}
                            spaceBetween={12}
                            slidesPerView={2}
                            loop={data?.loop !== false}
                            observer={true}
                            observeParents={true}
                            watchSlidesProgress={true}
                            autoplay={
                                data?.autoplay !== false
                                    ? { delay: 4500, disableOnInteraction: false }
                                    : false
                            }
                            navigation={{
                                prevEl: prevRef.current,
                                nextEl: nextRef.current,
                            }}
                            onBeforeInit={(swiper) => {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                            }}
                            breakpoints={{
                                0: { slidesPerView: 2, spaceBetween: 12 },
                                480: { slidesPerView: 2, spaceBetween: 14 },
                                768: { slidesPerView: 3, spaceBetween: 16 },
                            }}
                            className="w-full !py-2"
                        >
                            {items.map((product, index) => (
                                <SwiperSlide key={`${product.id}-${index}`} className="h-auto">
                                    {renderCard(product, index)}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Desktop: grilla 4x2 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 xl:gap-6">
                        {gridItems.map((product, index) => (
                            <div key={`grid-${product.id}-${index}`} className="h-full">
                                {renderCard(product, index)}
                            </div>
                        ))}
                    </div>

                    {/* Bottom catalog link (móvil y tablet) */}
                    {data?.show_link_catalog !== false &&
                        data?.link_catalog && (
                            <div className="text-center mt-8 lg:hidden">
                                <a
                                    href={data.link_catalog}
                                    className="group inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full text-xs font-bold uppercase hover:bg-white/90 transition-all duration-300 shadow-lg"
                                >
                                    Ver todo el catálogo
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        )}
                </div>
            </div>
        </section>
    );
};

export default ProductSwiperTwenty;
