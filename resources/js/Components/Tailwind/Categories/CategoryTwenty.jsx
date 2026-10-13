import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import CardCategoryTwenty from "./Components/CardCategoryTwenty";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const CategoryTwenty = ({ items, data }) => {
    if (!items || items.length === 0) return null;

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const bgClass = data?.bg_class || "bg-primary";
    const textClass = data?.text_class || "text-white";

    return (
        <section
            id={data?.element_id || null}
            className={`relative overflow-hidden ${bgClass} ${data?.class_container || ""}`}
        >
            <div className="relative z-10 py-10 md:py-16">
                <div className=" mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">

                    {/* Header layout */}
                    <div className="mb-6 md:mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        {/* Left: eyebrow + title */}
                        <div className="relative min-w-0">
                            {data?.badge && (
                                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase text-white">
                                    {data?.badge || "Explora por categoría"}
                                </span>
                            )}

                            <h2
                                className={`mt-3 ${textClass} uppercase font-black leading-[0.95] ${data?.class_title || "text-4xl sm:text-5xl lg:text-6xl"}`}
                            >
                                <TextWithHighlight text={data?.title || "Shop by category"} color="text-twenty" className="" />
                            </h2>

                            {data?.description && (
                                <p className="text-white/70 mt-3 max-w-md text-sm md:text-[15px]">
                                    {data.description}
                                </p>
                            )}
                        </div>

                        {/* Right: nav arrows */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                ref={prevRef}
                                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/25 text-white hover:bg-white hover:text-primary hover:border-white transition-all duration-300"
                                aria-label="Anterior"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                ref={nextRef}
                                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/25 text-white hover:bg-white hover:text-primary hover:border-white transition-all duration-300"
                                aria-label="Siguiente"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Swiper */}
                    <div className="relative">
                        <Swiper
                            modules={[Autoplay, A11y, Keyboard, Navigation]}
                            spaceBetween={10}
                            slidesPerView={2}
                            loop={data?.loop !== false}
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
                                0: { slidesPerView: 3, spaceBetween: 12 },
                                640: { slidesPerView: 4, spaceBetween: 16 },
                                1024: { slidesPerView: 5, spaceBetween: 20 },
                                1280: { slidesPerView: 6, spaceBetween: 24 },
                            }}
                            className="w-full !py-2 !px-2"
                        >
                            {items.map((category, index) => (
                                <SwiperSlide key={`${category.id}-${index}`} className="h-auto">
                                    <CardCategoryTwenty category={category} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CategoryTwenty;
