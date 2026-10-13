import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import testimonieImage from "./images/testimonieImage.png";
import HtmlContent from "../../Utils/HtmlContent";
import em from "../../Utils/em";

const Testimonies = ({ testimonies, background = "#fbbf24", details }) => {
    return (
        <section
            className={`grid md:grid-cols-5 gap-8`}
            style={{ backgroundColor: background }}
        >
            <div className="col-span-full md:col-span-2 w-full flex items-center justify-center order-last md:order-first">
                <div className="relative flex grow justify-center md:justify-start p-[5%] pb-0 md:p-0 md:px-[5%]  md:h-[calc(100%+64px)] md:-mt-16">
                    <img
                        src={testimonieImage}
                        alt="testimony"
                        className="object-contain object-center md:object-left-bottom lg:object-bottom w-full max-w-md"
                        style={{ aspectRatio: 1.125 }}
                        onError={(e) =>
                            (e.target.src = "/assets/resources/cover-404.svg")
                        }
                    />
                </div>
            </div>

            <div className="col-span-full md:col-span-3 p-[5%] w-full flex flex-col items-center order-first md:order-last">
                <div className="flex flex-col justify-center items-center max-w-full text-center md:text-left">
                    {details?.["testimonies.title"] && (
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-tight text-gray-900">
                            {em(details?.["testimonies.title"])}
                        </h2>
                    )}
                    {details?.["testimonies.description"] && (
                        <div className="mt-2 text-sm leading-5 text-center text-gray-700">
                            {em(details?.["testimonies.description"])}
                        </div>
                    )}
                </div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    autoplay={{
                        delay: 3000, // Cambia el tiempo según sea necesario
                        disableOnInteraction: false,
                    }}
                    pagination={{ clickable: true }}
                    spaceBetween={20}
                    className="mt-8 w-full"
                >
                    {testimonies.map((testimony, index) => (
                        <SwiperSlide key={index} className="text-center">
                            <div className="text-lg font-medium text-gray-900">
                                {em(testimony.description)}
                            </div>
                            <div className="flex flex-col mt-4 items-center">
                                {testimony.image && (
                                    <img
                                        src={`/storage/images/testimonies/${testimony.image}`}
                                        alt="testimony"
                                        className="w-16 h-16 object-cover object-center rounded-full"
                                        onError={(e) =>
                                            (e.target.src = `https://ui-avatars.com/api/?name=${testimony.name}&color=7F9CF5&background=EBF4FF`)
                                        }
                                    />
                                )}
                                <div className="text-base font-semibold leading-6 text-gray-900 mt-2">
                                    <span className="text-pink-600">
                                        {testimony.name},
                                    </span>{" "}
                                    {testimony.country}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Testimonies;
