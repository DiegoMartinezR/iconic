import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const AboutTwenty = ({ data, filteredData, items }) => {
    const aboutuses = items;
    const history = items?.find(
        (item) => item.correlative === "section-historia",
    );
    const values = items?.find(
        (item) => item.correlative === "section-valores",
    );
    const mision = items?.find((item) => item.correlative === "section-mision");
    const vision = items?.find((item) => item.correlative === "section-vision");

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const [strengths, setStrengths] = useState([]);

    // Fetch strengths from API matching MiBalon layout logic
    useEffect(() => {
        if (strengths.length > 0) return;

        fetch("/api/strengths")
            .then((res) => res.json())
            .then((data) => setStrengths(data))
            .catch((err) => console.error("Error loading strengths:", err));
    }, [aboutuses, strengths.length]);

    const Eyebrow = ({ children }) => (
        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase text-white">
            {children}
        </span>
    );

    const cleanHtml = (html) => html?.replace(/<p><br><\/p>/g, "") || "";

    return (
        <main
            id={data?.element_id || null}
            className="min-h-screen bg-primary px-primary 2xl:px-0 mx-auto w-full py-12 md:py-20 text-white"
        >
            <div className="2xl:max-w-7xl mx-auto">
                {/* Hero image */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mb-10 md:mb-14"
                >
                    <motion.div
                        variants={fadeInUp}
                        className="w-full rounded-[2rem] overflow-hidden bg-white/5"
                    >
                        <img
                            src={`/storage/images/aboutus/${history?.image}`}
                            onError={(e) =>
                                (e.target.src = "/api/cover/thumbnail/null")
                            }
                            alt={history?.title}
                            className="w-full h-[320px] sm:h-[420px] lg:h-[560px] object-cover transition-transform duration-700 hover:scale-[1.02]"
                        />
                    </motion.div>
                </motion.section>

                {/* Title */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.5 }}
                    className="mb-8 md:mb-10 text-center"
                >
                    <motion.div variants={fadeInUp} className="flex flex-col items-center">

                        <motion.h2
                            variants={fadeInUp}
                            className={`mt-4 text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[0.95] max-w-5xl mx-auto ${data?.class_title || ""}`}
                        >
                            <TextWithHighlight
                                text={history?.title}
                                className=""
                            />
                        </motion.h2>
                    </motion.div>
                </motion.section>

                {/* Description - Historia */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mb-14 md:mb-20"
                >
                    <motion.div variants={fadeInUp}>
                        {(() => {
                            const textLength =
                                history?.description?.replace(/<[^>]*>/g, "")
                                    ?.length || 0;
                            const isLongText = textLength > 500;

                            if (isLongText) {
                                return (
                                    <div
                                        className="columns-1 lg:columns-2 gap-8 lg:gap-12 text-white/70 text-sm md:text-[15px] leading-relaxed prose prose-invert max-w-none ql-editor [&>*]:break-inside-avoid"
                                        dangerouslySetInnerHTML={{
                                            __html: cleanHtml(history?.description),
                                        }}
                                    />
                                );
                            } else {
                                return (
                                    <div className="max-w-3xl mx-auto text-center">
                                        <div
                                            className="text-white/70 text-sm md:text-base leading-relaxed prose prose-invert max-w-none ql-editor"
                                            dangerouslySetInnerHTML={{
                                                __html: cleanHtml(history?.description),
                                            }}
                                        />
                                    </div>
                                );
                            }
                        })()}
                    </motion.div>
                </motion.section>

                {/* Valores / Fortalezas */}
                {values && (
                    <>
                        <motion.section
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, amount: 0.5 }}
                            className="mb-8 md:mb-10 text-center"
                        >
                            <motion.div variants={fadeInUp} className="flex flex-col items-center">

                                <motion.h2
                                    variants={fadeInUp}
                                    className={`mt-4 text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[0.95] max-w-4xl mx-auto ${data?.class_title || ""}`}
                                >
                                    <TextWithHighlight
                                        text={values?.title}
                                        className=""
                                    />
                                </motion.h2>
                            </motion.div>
                        </motion.section>

                        {/* Pagination dashes */}
                        <style>{`
                            .about-strengths-swiper .swiper-pagination-bullet {
                                background: #ffffff !important;
                                opacity: 0.35;
                                width: 8px;
                                height: 3px;
                                border-radius: 0;
                                transition: all 0.3s ease;
                            }
                            .about-strengths-swiper .swiper-pagination-bullet-active {
                                opacity: 1 !important;
                                background: #ffffff !important;
                                width: 24px;
                                border-radius: 0;
                            }
                        `}</style>

                        <motion.section
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={staggerContainer}
                            className="mb-14 md:mb-20"
                        >
                            {/* Mobile & tablet swiper with peek */}
                            <div className="block lg:hidden">
                                <Swiper
                                    modules={[Autoplay, Pagination]}
                                    spaceBetween={14}
                                    slidesPerView={1.15}
                                    loop={true}
                                    pagination={{ clickable: true }}
                                    autoplay={{
                                        delay: 3500,
                                        disableOnInteraction: false,
                                    }}
                                    breakpoints={{
                                        0: { slidesPerView: 1.15, spaceBetween: 14 },
                                        640: { slidesPerView: 2.15, spaceBetween: 16 },
                                    }}
                                    className="w-full !pb-10 about-strengths-swiper"
                                >
                                    {strengths?.map((item, index) => (
                                        <SwiperSlide key={index} className="h-auto">
                                            <StrengthCard item={item} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            {/* Desktop grid: fortalezas + imagen central + fortalezas */}
                            <div className="hidden lg:grid grid-cols-3 gap-6 xl:gap-8 items-stretch">
                                {/* Primera columna */}
                                <motion.div
                                    className="flex flex-col gap-6 justify-between"
                                    variants={fadeInUp}
                                >
                                    {strengths?.slice(0, 2).map((item, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex-1"
                                            variants={fadeInUp}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                        >
                                            <StrengthCard item={item} />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Imagen central */}
                                <motion.div
                                    className="flex flex-col items-center justify-center h-full"
                                    variants={fadeInUp}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.15 }}
                                >
                                    <div className="w-full h-full rounded-[2rem] overflow-hidden bg-white/5">
                                        <img
                                            src={`/storage/images/aboutus/${values?.image}`}
                                            onError={(e) =>
                                                (e.target.src = "/api/cover/thumbnail/null")
                                            }
                                            alt={values?.title}
                                            className="w-full h-full min-h-[350px] lg:min-h-[450px] object-cover transition-transform duration-700 hover:scale-[1.02]"
                                        />
                                    </div>
                                </motion.div>

                                {/* Segunda columna */}
                                <motion.div
                                    className="flex flex-col gap-6 justify-between"
                                    variants={fadeInUp}
                                >
                                    {strengths?.slice(2, 4).map((item, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex-1"
                                            variants={fadeInUp}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: (index + 2) * 0.1 }}
                                        >
                                            <StrengthCard item={item} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.section>
                    </>
                )}

                {/* Mision / Vision */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                    className="pb-4 md:pb-8"
                >
                    <motion.div
                        variants={staggerContainer}
                        className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center"
                    >
                        <motion.div
                            variants={fadeInUp}
                            className="w-full rounded-[2rem] overflow-hidden bg-white/5"
                        >
                            <img
                                src={`/storage/images/aboutus/${vision?.image || mision?.image}`}
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                                alt={vision?.title || mision?.title}
                                className="w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] object-cover transition-transform duration-700 hover:scale-[1.02]"
                            />
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col justify-center"
                        >
                            {mision && (
                                <div className="py-7 md:py-9 border-t border-white/10 first:border-t-0 first:pt-0">

                                    <motion.h3 className={`mt-4 text-3xl md:text-4xl text-white font-black uppercase leading-none ${data?.class_title || ""}`}>
                                        <TextWithHighlight
                                            text={mision?.title}
                                            className=""
                                        />
                                    </motion.h3>
                                    <motion.div
                                        className="mt-3 text-white/70 text-sm md:text-[15px] leading-relaxed prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: mision?.description,
                                        }}
                                    />
                                </div>
                            )}

                            {vision && (
                                <div className="py-7 md:py-9 border-t border-white/10">

                                    <motion.h3 className={`mt-4 text-3xl md:text-4xl text-white font-black uppercase leading-none ${data?.class_title || ""}`}>
                                        <TextWithHighlight
                                            text={vision?.title}
                                            className=""
                                        />
                                    </motion.h3>
                                    <motion.div
                                        className="mt-3 text-white/70 text-sm md:text-[15px] leading-relaxed prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: vision?.description,
                                        }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.section>
            </div>
        </main>
    );
};

const StrengthCard = ({ item }) => {
    if (!item) return null;
    return (
        <div className="group rounded-2xl bg-white/[0.04] border border-white/10 p-6 h-full transition-colors duration-300 hover:bg-white/[0.07] hover:border-white/20">
            <div className="rounded-full bg-white/10 w-12 h-12 flex items-center justify-center mb-5">
                <img
                    src={`/storage/images/strength/${item?.image}`}
                    alt={item?.name}
                    loading="lazy"
                    className="w-6 h-6 object-contain"
                    onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                />
            </div>
            <h3 className="text-sm font-bold uppercase text-white">
                {item?.name}
            </h3>
            <p className="mt-2 text-white/60 text-[13px] leading-relaxed">
                {item?.description}
            </p>
        </div>
    );
};

export default AboutTwenty;
