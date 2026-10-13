import React, { useState, useRef, useEffect, useMemo } from "react";
import { ArrowUpRight, Clock, ChevronLeft, ChevronRight, ChevronDown, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";

/**
 * BlogRhino
 *
 * Vista completa de Blog para Rhino Technology.
 * Funcionalidad idéntica a BlogMicjc (paginación, filtros de categoría REST, ordenamiento, post destacado + listado).
 * UI y diseño heredados de BlogSectionRhino (estética oscura bg-page-background, acentos primary electric, typography font-title).
 */

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
                month: "short",
                year: "numeric",
            });
    } catch (e) {
        return dateString;
    }
};

const extractText = (html, maxLength = 120) => {
    if (!html) return "";
    const text = html.replace(/<[^>]+>/g, "").trim();
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
};

const calculateReadTime = (content) => {
    if (!content) return "3 min";
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]+>/g, "").trim();
    const wordCount = text.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min`;
};

const getPostImage = (post) => {
    if (!post) return "/assets/img/noimage/no_img.jpg";
    const img = post.image || post.url_image || post.banner;
    if (typeof img === "string" && img) {
        return img.startsWith("/") || img.startsWith("http")
            ? img
            : `/storage/images/post/${img}`;
    }
    return "/assets/img/noimage/no_img.jpg";
};

const getCategoryName = (cat) => {
    if (!cat) return "Novedades Tech";
    if (typeof cat === "object") return cat.name || cat.alias || cat.title || "Novedades Tech";
    return String(cat);
};

const BlogRhino = ({
    data = {},
    postsLatest = [],
    filterProps = {},
}) => {
    // Extraer propiedades globales pasadas desde Blog.jsx
    const {
        categories = [],
        activeCategory = "all",
        setActiveCategory = () => { },
        sortOption = "newest",
        setSortOption = () => { },
        currentPage = 1,
        setCurrentPage = () => { },
        filteredPosts = [],
        listLoading = false,
        totalPosts = 0,
        gridPostsPerPage = 6,
    } = filterProps;

    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortDropdownRef = useRef(null);

    const [activeFeaturedSlide, setActiveFeaturedSlide] = useState(0);
    const swiperFeaturedRef = useRef(null);

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const categoryDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    const selectedCategoryLabel = useMemo(() => {
        if (activeCategory === "all") {
            return `Todas las publicaciones (${totalPosts})`;
        }
        const cat = categories.find((c) => c.id === activeCategory);
        return cat ? cat.name : "Categoría";
    }, [activeCategory, categories, totalPosts]);

    const sortOptions = [
        { value: "newest", label: "Más Recientes" },
        { value: "oldest", label: "Más Antiguos" },
        { value: "title-asc", label: "Título A-Z" },
        { value: "title-desc", label: "Título Z-A" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 24, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    // Variables de paginación
    const totalPages = Math.ceil(totalPosts / gridPostsPerPage);
    const startIndex = (currentPage - 1) * gridPostsPerPage + 1;
    const endIndex = Math.min(currentPage * gridPostsPerPage, totalPosts);

    // Layout variables para el top featured (4 posts más recientes pasados por Blog.jsx)
    const safePostsLatest = Array.isArray(postsLatest) ? postsLatest : [];
    const hasEnoughForFeatured = safePostsLatest.length >= 2;
    const featuredPost = safePostsLatest.length > 0 ? safePostsLatest[0] : null;
    const secondaryPosts = hasEnoughForFeatured ? safePostsLatest.slice(1, 4) : [];
    const gridPosts = filteredPosts;

    return (
        <section
            id={data?.element_id || "blog"}
            className={`relative  bg-page-background text-white overflow-hidden font-paragraph min-h-screen ${data?.class || data?.class_section || "py-10 md:py-12"}`}
        >
            <div className="max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10 space-y-16">

                {/* Section Header */}
                {data?.title || data?.description && (
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div className="space-y-3 max-w-3xl">
                            {data?.title && (
                                <h1 className="text-4xl md:text-5xl lg:text-8xl font-title text-white">
                                    <TextWithHighlight
                                        text={data?.title || "Nuestro *Blog* e Ideas de Ingeniería"}
                                        color="bg-primary"
                                        className="font-title"
                                    />
                                </h1>
                            )}
                            {data?.description && (
                                <p className="text-white/70 text-base md:text-lg font-light">
                                    {data.description}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-16"
                >
                    {/* Top Featured UI (Mobile: Swiper, Desktop: 1 Grande Izquierda + 3 Apilados Derecha) */}
                    {featuredPost && (
                        <>
                            {/* Mobile Swiper (block md:hidden) */}
                            <div className="block md:hidden">
                                <Swiper
                                    onSwiper={(swiper) => { swiperFeaturedRef.current = swiper; }}
                                    onSlideChange={(swiper) => setActiveFeaturedSlide(swiper.realIndex)}
                                    modules={[Autoplay]}
                                    spaceBetween={16}
                                    slidesPerView={1}
                                    loop={safePostsLatest.length > 1}
                                    autoplay={{
                                        delay: 4000,
                                        disableOnInteraction: false,
                                        pauseOnMouseEnter: true,
                                    }}
                                    className="w-full [&_.swiper-wrapper]:!items-stretch flex flex-col"
                                >
                                    {safePostsLatest.map((post, idx) => (
                                        <SwiperSlide key={post.id || idx} className="!h-auto flex flex-col">
                                            <article className="group flex flex-col h-full rounded-3xl border border-white/10 bg-white/[0.02] hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-500 shadow-2xl backdrop-blur-md overflow-hidden">
                                                {/* Image Frame */}
                                                <div className="relative w-full aspect-[16/10] overflow-hidden flex-shrink-0 bg-white/[0.01]">
                                                    <img
                                                        src={getPostImage(post)}
                                                        alt={post.title || post.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/assets/img/noimage/no_img.jpg";
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-page-background/90 via-transparent to-transparent opacity-80" />
                                                </div>

                                                {/* Text Details */}
                                                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                                                    <div className="space-y-3">
                                                        <span className="font-mono text-xs font-bold text-primary uppercase px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
                                                            {getCategoryName(post.category)}
                                                        </span>
                                                        <h3 className="text-xl font-title text-white group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                                            {post.title || post.name}
                                                        </h3>
                                                        <p className="text-xs text-white/70 font-light line-clamp-3">
                                                            {extractText(
                                                                post.extract || post.summary || post.description || "",
                                                                150
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs text-white/40">
                                                        <span>{formatDate(post.post_date || post.created_at)}</span>
                                                        <div className="flex items-center gap-1.5 text-primary/80">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span>{calculateReadTime(post.description)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {/* Paginación estilo HeroRhino */}
                                {safePostsLatest.length > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-6">
                                        {safePostsLatest.map((_, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => swiperFeaturedRef.current?.slideToLoop(idx)}
                                                aria-label={`Ir al slide ${idx + 1}`}
                                                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${activeFeaturedSlide === idx
                                                    ? "w-8 bg-primary shadow-md"
                                                    : "w-2.5 bg-white/30 hover:bg-white/60"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Desktop Grid Layout (hidden md:grid) */}
                            <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                                {/* LEFT COLUMN: Large Featured Post */}
                                <motion.div variants={itemVariants} className="h-full">
                                    <article className="h-full">
                                        <a
                                            href={`/post/${featuredPost.slug || featuredPost.id}`}
                                            className="group flex flex-col h-full rounded-3xl transition-all duration-500 shadow-2xl backdrop-blur-md overflow-hidden"
                                        >
                                            {/* Image Frame */}
                                            <div className="relative w-full aspect-[16/10] overflow-hidden flex-shrink-0 bg-white/[0.01]">
                                                <img
                                                    src={getPostImage(featuredPost)}
                                                    alt={featuredPost.title || featuredPost.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "/assets/img/noimage/no_img.jpg";
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-page-background/90 via-transparent to-transparent opacity-80" />
                                            </div>

                                            {/* Text Details */}
                                            <div className="p-8 md:p-10 flex flex-col flex-grow justify-between space-y-6">
                                                <div className="space-y-4">
                                                    <span className="font-mono text-xs font-bold text-primary uppercase px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
                                                        {getCategoryName(featuredPost.category)}
                                                    </span>
                                                    <h3 className="text-2xl md:text-3xl font-title text-white group-hover:text-primary transition-colors duration-300">
                                                        {featuredPost.title || featuredPost.name}
                                                    </h3>
                                                    <p className="text-sm md:text-base text-white/70 font-light line-clamp-3">
                                                        {extractText(
                                                            featuredPost.extract || featuredPost.summary || featuredPost.description || "",
                                                            220
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between pt-6 border-t border-white/10 font-mono text-xs text-white/40">
                                                    <span>{formatDate(featuredPost.post_date || featuredPost.created_at)}</span>
                                                    <div className="flex items-center gap-1.5 text-primary/80">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>{calculateReadTime(featuredPost.description)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </article>
                                </motion.div>

                                {/* RIGHT COLUMN: 3 Stacked Horizontal Cards */}
                                <div className="flex flex-col justify-between h-full gap-6">
                                    {secondaryPosts.map((post, index) => (
                                        <motion.div key={post.id || index} variants={itemVariants} className="w-full flex-grow">
                                            <article className="group h-full">
                                                <a
                                                    href={`/post/${post.slug || post.id}`}
                                                    className="flex flex-col sm:flex-row h-full rounded-3xl transition-all duration-500 shadow-xl backdrop-blur-md overflow-hidden gap-5 items-center"
                                                >
                                                    <div className="relative w-full sm:w-[42%] aspect-[16/10] sm:aspect-auto sm:h-full rounded-2xl overflow-hidden bg-white/[0.01] shrink-0">
                                                        <img
                                                            src={getPostImage(post)}
                                                            alt={post.title || post.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "/assets/img/noimage/no_img.jpg";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-between flex-grow w-full sm:w-[58%] h-full py-2 pr-4">
                                                        <div className="space-y-2">
                                                            <span className="font-mono text-[10px] md:text-xs font-bold text-primary uppercase block">
                                                                {getCategoryName(post.category)}
                                                            </span>
                                                            <h4 className="text-base md:text-xl font-title text-white group-hover:text-primary transition-colors line-clamp-2">
                                                                {post.title || post.name}
                                                            </h4>
                                                            <p className="text-xs md:text-sm text-white/70 font-light line-clamp-2">
                                                                {extractText(post.extract || post.summary || post.description || "", 100)}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 font-mono text-[11px] text-white/40">
                                                            <span>{formatDate(post.post_date || post.created_at)}</span>
                                                            <div className="flex items-center gap-1 text-primary/80">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{calculateReadTime(post.description)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </article>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Section Controls & Filters Bar */}
                    <div className="pt-16 pb-0 border-t border-white/10">
                        <h2 className="font-title text-4xl md:text-4xl lg:text-5xl text-white font-bold mb-8">
                            <TextWithHighlight
                                text={data?.title_all || "Revisa todas nuestras *publicaciones*"}
                                className="font-title"
                                color="bg-primary"
                            />
                        </h2>

                        <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between pb-8">
                            {/* Desktop Category Filter Pills (hidden md:flex) */}
                            <div className="hidden md:flex flex-wrap items-center gap-3 flex-grow">
                                <button
                                    type="button"
                                    onClick={() => { setActiveCategory("all"); setCurrentPage(1); }}
                                    className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase transition-all duration-300 cursor-pointer ${activeCategory === "all"
                                        ? "bg-primary text-dark shadow-lg shadow-primary/20 scale-105"
                                        : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                                        }`}
                                >
                                    Todas ({totalPosts})
                                </button>

                                {categories.map((cat) => {
                                    const isSelected = activeCategory === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => { setActiveCategory(cat.id); setCurrentPage(1); }}
                                            className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase transition-all duration-300 cursor-pointer ${isSelected
                                                ? "bg-primary text-dark shadow-lg shadow-primary/20 scale-105"
                                                : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Custom Category Dropdown Select (Solo Mobile: block md:hidden) */}
                            <div className="relative w-full block md:hidden" ref={categoryDropdownRef}>
                                <label className="block text-[10px] font-mono text-primary font-bold uppercase tracking-wider mb-1.5 ml-1">
                                    Filtrar por Categoría
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                    className={`w-full flex items-center justify-between px-5 py-3 rounded-full text-xs font-bold uppercase transition-all duration-300 cursor-pointer border ${activeCategory !== "all"
                                        ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10"
                                        : "bg-white/5 hover:bg-white/10 border-white/20 text-white"
                                        }`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <span className="truncate">{selectedCategoryLabel}</span>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className={`shrink-0 transition-transform duration-300 ${isCategoryDropdownOpen ? "rotate-180 text-primary" : "text-white/60"
                                            }`}
                                    />
                                </button>

                                {/* Options List Menu */}
                                {isCategoryDropdownOpen && (
                                    <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#0F1420]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl space-y-1 max-h-72 overflow-y-auto">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActiveCategory("all");
                                                setCurrentPage(1);
                                                setIsCategoryDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all text-left cursor-pointer ${activeCategory === "all"
                                                ? "bg-primary text-dark font-extrabold shadow-md"
                                                : "text-white/80 hover:bg-white/10 hover:text-white"
                                                }`}
                                        >
                                            <span className="truncate">Todas las publicaciones</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${activeCategory === "all" ? "bg-dark/20 text-dark" : "bg-white/10 text-white/60"
                                                }`}>
                                                {totalPosts}
                                            </span>
                                        </button>

                                        {categories.map((cat) => {
                                            const isSelected = activeCategory === cat.id;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveCategory(cat.id);
                                                        setCurrentPage(1);
                                                        setIsCategoryDropdownOpen(false);
                                                    }}
                                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all text-left cursor-pointer ${isSelected
                                                        ? "bg-primary text-dark font-extrabold shadow-md"
                                                        : "text-white/80 hover:bg-white/10 hover:text-white"
                                                        }`}
                                                >
                                                    <span className="truncate">{cat.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Sort Dropdown estilo Rhino Dark */}
                            <div className="relative w-full sm:w-64 shrink-0" ref={sortDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="w-full flex items-center justify-between px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 text-xs md:text-sm font-bold text-white transition-all duration-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                                >
                                    <span>
                                        {sortOptions.find((opt) => opt.value === sortOption)?.label || "Ordenar por"}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-300 ${isSortOpen ? "rotate-180 text-primary" : ""}`} />
                                </button>

                                {isSortOpen && (
                                    <div className="absolute right-0 mt-2 w-full z-50 rounded-2xl bg-[#0F1420] border border-white/15 shadow-2xl overflow-hidden backdrop-blur-xl py-1.5 animate-in fade-in zoom-in-95 duration-150">
                                        {sortOptions.map((opt) => {
                                            const isSelected = sortOption === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setSortOption(opt.value);
                                                        setCurrentPage(1);
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-xs md:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${isSelected
                                                        ? "bg-primary text-dark font-bold"
                                                        : "text-white/80 hover:text-white hover:bg-white/10"
                                                        }`}
                                                >
                                                    <span>{opt.label}</span>
                                                    {isSelected && <Check className="w-4 h-4 text-dark shrink-0" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Total Count Info */}
                        <div className="text-white/50 text-xs md:text-sm font-mono mb-0">
                            Mostrando {totalPosts > 0 ? `${startIndex}-${endIndex} de ${totalPosts}` : "0"} artículos
                        </div>
                    </div>

                    {/* Filtered Grid */}
                    {listLoading ? (
                        <div className="flex justify-center py-10 lg:py-12">
                            <Loading />
                        </div>
                    ) : gridPosts.length === 0 ? (
                        <div className="py-10 lg:py-12 text-center">
                            <NoResults />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                            {gridPosts.map((post, index) => (
                                <motion.div key={`grid-${post.id || index}`} variants={itemVariants} className="h-full">
                                    <article className="h-full">
                                        <a
                                            href={`/post/${post.slug || post.id}`}
                                            className="group flex flex-col h-full rounded-3xl border border-white/10 bg-white/[0.02] hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-500 shadow-2xl backdrop-blur-md overflow-hidden"
                                        >
                                            <div className="relative w-full aspect-[16/10] overflow-hidden flex-shrink-0 bg-white/[0.01]">
                                                <img
                                                    src={getPostImage(post)}
                                                    alt={post.title || post.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "/assets/img/noimage/no_img.jpg";
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-page-background/90 via-transparent to-transparent opacity-80" />
                                            </div>
                                            <div className="p-8 flex flex-col flex-grow justify-between space-y-6">
                                                <div className="space-y-3">
                                                    <span className="font-mono text-xs font-bold text-primary uppercase px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
                                                        {getCategoryName(post.category)}
                                                    </span>
                                                    <h4 className="text-xl font-title text-white group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                                        {post.title || post.name}
                                                    </h4>
                                                    <p className="text-sm text-white/70 font-light line-clamp-3">
                                                        {extractText(post.extract || post.summary || post.description || "", 150)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs text-white/40">
                                                    <span>{formatDate(post.post_date || post.created_at)}</span>
                                                    <div className="flex items-center gap-1.5 text-primary/80">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>{calculateReadTime(post.description)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </article>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 pt-12">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="w-12 h-12 rounded-full border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-300 cursor-pointer"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            type="button"
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`w-12 h-12 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${currentPage === pageNumber
                                                ? "bg-primary text-dark border border-primary shadow-lg shadow-primary/20"
                                                : "border border-white/10 text-white hover:border-primary hover:text-primary hover:bg-primary/10"
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                } else if (
                                    pageNumber === currentPage - 2 ||
                                    pageNumber === currentPage + 2
                                ) {
                                    return (
                                        <span key={pageNumber} className="px-2 flex items-center text-white/40 font-bold">
                                            ...
                                        </span>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="w-12 h-12 rounded-full border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-300 cursor-pointer"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogRhino;
