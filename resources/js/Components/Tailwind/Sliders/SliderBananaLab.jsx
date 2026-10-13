import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const SliderBananaLab = ({ items, data }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const buttonsRef = useRef([]);

    const buttonVariants = {
        hover: {
            scale: 1.1,
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
            transition: { duration: 0.3 }
        },
        tap: {
            scale: 0.95
        }
    };

    useEffect(() => {
        buttonsRef.current.forEach((button) => {
            if (button) adjustTextColor(button);
        });
    }, [items]);

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.realIndex);
    };

    return (
        <div
            id={data?.element_id || null}
            className="px-primary mx-auto my-6 font-paragraph 2xl:px-0 2xl:max-w-7xl"
        >
            <div className="relative">
                <Swiper
                    navigation={{
                        prevEl: ".custom-prev",
                        nextEl: ".custom-next",
                    }}
                    slidesPerView={3}
                    spaceBetween={30}
                    loop={true}
                    breakpoints={{
                        0: { slidesPerView: 1, spaceBetween: 10 },
                        640: { slidesPerView: 1, spaceBetween: 10 },
                        1024: { slidesPerView: 1, spaceBetween: 0 },
                    }}
                    modules={[Navigation, Pagination]}
                    onSlideChange={handleSlideChange}
                >
                    {items.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="w-full aspect-square lg:aspect-[16/7] rounded-3xl bg-sections-color relative flex flex-col overflow-hidden">
                                <img
                                    src={`/storage/images/slider/${item.bg_image || "undefined"}`}
                                    alt={item.name}
                                    loading={index === 0 ? "eager" : "lazy"}
                                    fetchPriority={index === 0 ? "high" : "auto"}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) =>
                                    (e.target.src =
                                        "/api/cover/thumbnail/null")
                                    }
                                />

                                <div className="relative z-10 p-5 py-8 max-w-[80%] lg:max-w-2xl lg:px-16 lg:flex lg:items-center lg:h-full">
                                    <div className="flex flex-col gap-5 items-start">
                                        <h2
                                            className=" text-2xl md:text-4xl font-semibold lg:text-5xl"
                                            style={{ textShadow: "0 0 20px rgba(0, 0, 0, .25)" }}
                                        >
                                            {item.name}
                                        </h2>

                                        <p
                                            className="my-2 text-neutral-light text-sm md:text-base"
                                            style={{ textShadow: "0 0 20px rgba(0, 0, 0, .25)" }}
                                        >
                                            {item.description}
                                        </p>

                                        <a
                                            href={item.button_link}
                                            ref={(el) => (buttonsRef.current[index] = el)}
                                            className="bg-primary z-50 my-1 w-7/12 h-11 flex items-center justify-center rounded-full text-white text-sm font-semibold lg:w-max lg:px-10 transition-transform duration-300 hover:scale-105 active:scale-95"
                                        >
                                            {item.button_text}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Paginacion personalizada */}
                <div className="absolute bottom-4 z-50 left-1/2 -translate-x-1/2 flex justify-center gap-2 mt-10 lg:hidden">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            aria-label={`Ir al slide ${index + 1}`}
                            className={`rounded-full transition-all duration-300 ${index === activeIndex ? "bg-primary scale-110" : "bg-white opacity-60 hover:opacity-100"} w-[16px] h-[16px]`}
                        />
                    ))}
                </div>

                {/* Botones de navegación personalizados */}
                <div className="hidden lg:flex absolute bottom-10 right-10 z-50 gap-4">
                    <button
                        type="button"
                        aria-label="Slide anterior"
                        className="custom-prev cursor-pointer h-14 w-14 flex items-center justify-center bg-primary brightness-125 text-white hover:brightness-100 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95"
                    >
                        <ChevronLeft />
                    </button>

                    <button
                        type="button"
                        aria-label="Slide siguiente"
                        className="custom-next cursor-pointer h-14 w-14 flex items-center justify-center bg-primary brightness-125 text-white hover:brightness-100 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SliderBananaLab;
