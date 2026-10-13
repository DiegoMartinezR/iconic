import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const BlogSectionTwenty = ({ data, items = [] }) => {
    if (!items || items.length === 0) return null;

    // Limit to exactly the first 3 posts
    const latestPosts = items.slice(0, 3);

    // Date formatting helper
    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(
                dateString.includes("T") ? dateString : `${dateString}T00:00:00`
            );
            return isNaN(date.getTime())
                ? dateString
                : date.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                });
        } catch (e) {
            return dateString;
        }
    };

    // Text extraction helper to strip HTML and limit characters
    const extractText = (html, maxLength = 100) => {
        if (!html) return "";
        const text = html.replace(/<[^>]+>/g, "").trim();
        return text.length > maxLength
            ? text.substring(0, maxLength) + "..."
            : text;
    };

    // Estimate read time based on word count
    const calculateReadTime = (content) => {
        if (!content) return "3 min";
        const wordsPerMinute = 200;
        const text = content.replace(/<[^>]+>/g, "").trim();
        const wordCount = text.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} min`;
    };

    const bgClass = data?.bg_class || "bg-primary";
    const textClass = data?.text_class || "text-white";

    const goToPost = (slug) => {
        window.location.href = `/post/${slug}`;
    };

    const CategoryChip = ({ name, className = "" }) => {
        if (!name) return null;
        return (
            <span className={`inline-block bg-white px-2.5 py-1 text-[10px] font-bold uppercase text-black ${className}`}>
                {name}
            </span>
        );
    };

    const Meta = ({ post, light = false }) => (
        <p className={`text-[11px] uppercase ${light ? "text-white/75" : "text-white/55"}`}>
            {formatDate(post.post_date || post.created_at)}
            <span className="mx-2">·</span>
            {calculateReadTime(post.description)} de lectura
        </p>
    );

    const ReadLink = ({ slug, children = "Leer artículo" }) => (
        <button
            onClick={(e) => {
                e.stopPropagation();
                goToPost(slug);
            }}
            className="group/link mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase text-white transition-colors hover:text-white/70"
        >
            {children}
            <ArrowRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-1" />
        </button>
    );

    return (
        <section
            id={data?.element_id || null}
            className={`relative overflow-hidden py-10 md:py-16 ${bgClass} ${data?.class_section || ""}`}
        >
            {/* Pagination dashes */}
            <style>{`
                .blog-twenty-swiper .swiper-pagination-bullet {
                    background: #ffffff !important;
                    opacity: 0.35;
                    width: 8px;
                    height: 3px;
                    border-radius: 0;
                    transition: all 0.3s ease;
                }
                .blog-twenty-swiper .swiper-pagination-bullet-active {
                    opacity: 1 !important;
                    background: #ffffff !important;
                    width: 24px;
                    border-radius: 0;
                }
            `}</style>

            <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl relative z-10">
                {/* Header */}
                <div className="mb-6 md:mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase text-white">
                            {data?.badge || "Novedades y estilo"}
                        </span>

                        <h2
                            className={`mt-3 ${textClass} uppercase font-black leading-[0.95] ${data?.class_title || "text-4xl sm:text-5xl lg:text-6xl"}`}
                        >
                            <TextWithHighlight text={data?.title || "Nuestro *Blog*"} color="text-twenty" className="" />
                        </h2>

                        {data?.description && (
                            <p className="mt-3 max-w-md text-sm md:text-[15px] text-white/70">
                                {data.description}
                            </p>
                        )}
                    </div>

                    {data?.link_blog && (
                        <a
                            href={data.link_blog}
                            className="group hidden sm:inline-flex shrink-0 items-center gap-2 border border-white/25 px-5 py-2.5 rounded-full text-xs font-bold uppercase text-white hover:bg-white hover:text-primary transition-all duration-300"
                        >
                            Ver blog
                            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                    )}
                </div>

                {/* Móvil y tablet: Swiper con peek */}
                <div className="block lg:hidden">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={14}
                        slidesPerView={1.12}
                        loop={true}
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            0: { slidesPerView: 1.12, spaceBetween: 14 },
                            640: { slidesPerView: 2.15, spaceBetween: 16 },
                        }}
                        className="w-full !pb-10 blog-twenty-swiper"
                    >
                        {items.map((post, index) => {
                            const postUrl = post.slug;
                            return (
                                <SwiperSlide key={post.id || index} className="h-auto">
                                    <article
                                        className="group cursor-pointer h-full"
                                        onClick={() => goToPost(postUrl)}
                                    >
                                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/5">
                                            <img
                                                src={post.image ? `/storage/images/post/${post.image}` : "/api/cover/thumbnail/null"}
                                                alt={post.name}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/api/cover/thumbnail/null";
                                                }}
                                            />
                                            {post.category && (
                                                <div className="absolute left-0 top-0 z-10">
                                                    <CategoryChip name={post.category.name} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-4">
                                            <Meta post={post} />
                                            <h3 className="mt-2 text-base font-bold text-white leading-snug line-clamp-2">
                                                {post.name}
                                            </h3>
                                            <p className="mt-1 text-[13px] text-white/60 line-clamp-2 leading-relaxed">
                                                {extractText(post.summary || post.description, 100)}
                                            </p>
                                            <ReadLink slug={postUrl} />
                                        </div>
                                    </article>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {data?.link_blog && (
                        <div className="text-center mt-2 sm:hidden">
                            <a
                                href={data.link_blog}
                                className="group inline-flex items-center gap-2 border border-white/25 px-6 py-3 rounded-full text-xs font-bold uppercase text-white hover:bg-white hover:text-primary transition-all duration-300"
                            >
                                Ver todo el blog
                                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                            </a>
                        </div>
                    )}
                </div>

                {/* Desktop editorial */}
                <div className="hidden lg:grid grid-cols-12 gap-6 xl:gap-8 items-stretch">
                    {/* Featured post */}
                    {latestPosts[0] && (() => {
                        const post = latestPosts[0];
                        return (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="group relative cursor-pointer col-span-7 overflow-hidden bg-white/5 min-h-[440px] xl:min-h-[500px] flex"
                                onClick={() => goToPost(post.slug)}
                            >
                                <img
                                    src={post.image ? `/storage/images/post/${post.image}` : "/api/cover/thumbnail/null"}
                                    alt={post.name}
                                    loading="lazy"
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/api/cover/thumbnail/null";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

                                {post.category && (
                                    <div className="absolute left-5 top-5 z-10">
                                        <CategoryChip name={post.category.name} />
                                    </div>
                                )}

                                <div className="relative z-10 mt-auto p-7">
                                    <Meta post={post} light />
                                    <h3 className="mt-2 text-3xl xl:text-4xl font-black text-white leading-[1.05] line-clamp-2">
                                        {post.name}
                                    </h3>
                                    <p className="mt-2 text-sm text-white/70 line-clamp-2 max-w-xl">
                                        {extractText(post.summary || post.description, 140)}
                                    </p>
                                    <ReadLink slug={post.slug} />
                                </div>
                            </motion.article>
                        );
                    })()}

                    {/* Secondary posts */}
                    <div className="col-span-5 flex flex-col gap-6">
                        {latestPosts.slice(1, 3).map((post, index) => (
                            <motion.article
                                key={post.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                                className="group cursor-pointer flex gap-5 flex-1 min-h-0"
                                onClick={() => goToPost(post.slug)}
                            >
                                <div className="relative w-40 xl:w-52 shrink-0 overflow-hidden bg-white/5">
                                    <img
                                        src={post.image ? `/storage/images/post/${post.image}` : "/api/cover/thumbnail/null"}
                                        alt={post.name}
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/api/cover/thumbnail/null";
                                        }}
                                    />
                                </div>

                                <div className="min-w-0 flex flex-col justify-center py-1">
                                    <Meta post={post} />
                                    <h4 className="mt-2 text-lg font-bold text-white leading-snug line-clamp-2">
                                        {post.name}
                                    </h4>
                                    <p className="mt-1.5 text-[13px] text-white/60 line-clamp-2 leading-relaxed">
                                        {extractText(post.summary || post.description, 110)}
                                    </p>
                                    <ReadLink slug={post.slug} />
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogSectionTwenty;
