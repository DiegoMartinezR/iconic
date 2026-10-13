import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronDown, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";

const FALLBACK_IMG = "/assets/img/noimage/no_img.jpg";

const SelectTwenty = ({ options = [], value, placeholder, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full z-20">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-2 bg-white/10 border border-white/15 hover:border-white/40 hover:bg-white/15 pl-4 pr-3 py-2.5 text-xs text-white transition-all duration-300 rounded-full focus:outline-none"
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 shrink-0 text-white/70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-full bg-primary border border-white/15 shadow-2xl z-30 max-h-60 overflow-y-auto rounded-2xl p-2"
                    >
                        <ul>
                            {options.map((opt) => {
                                const isSelected = opt.value === value;
                                return (
                                    <li key={opt.value}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(opt.value);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full px-3 py-2.5 flex items-center justify-between gap-2 text-left text-xs rounded-xl transition-colors duration-200 hover:bg-white/10 ${isSelected ? "bg-white/15 font-bold text-white" : "text-white/80"
                                                }`}
                                        >
                                            <span className="truncate">{opt.label}</span>
                                            {isSelected && <Check size={14} className="shrink-0" />}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


const BlogTwenty = ({
    data,
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
        gridPostsPerPage = 6
    } = filterProps;

    const sortOptions = [
        { value: "newest", label: "Más Recientes" },
        { value: "oldest", label: "Más Antiguos" },
        { value: "title-asc", label: "Título A-Z" },
        { value: "title-desc", label: "Título Z-A" },
    ];

    // Helper functions (del BlogSectionMicjc)
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 15, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" },
        },
    };

    // Pagination variables
    const totalPages = Math.ceil(totalPosts / gridPostsPerPage);
    const startIndex = (currentPage - 1) * gridPostsPerPage + 1;
    const endIndex = Math.min(currentPage * gridPostsPerPage, totalPosts);

    // Layout variables
    const safePostsLatest = Array.isArray(postsLatest) ? postsLatest : [];
    const hasEnoughForFeatured = safePostsLatest.length >= 2;
    const featuredPost = safePostsLatest.length > 0 ? safePostsLatest[0] : null;
    const secondaryPosts = hasEnoughForFeatured ? safePostsLatest.slice(1, 4) : [];
    const gridPosts = filteredPosts;

    const goToPost = (slug) => {
        window.location.href = `/post/${slug}`;
    };

    const onImgError = (e) => {
        e.target.onerror = null;
        e.target.src = FALLBACK_IMG;
    };

    const CategoryChip = ({ name }) => {
        if (!name) return null;
        return (
            <span className="inline-block bg-white px-2.5 py-1 text-[10px] font-bold uppercase text-black">
                {name}
            </span>
        );
    };

    const Meta = ({ post }) => (
        <p className="text-[11px] uppercase text-white/55">
            {formatDate(post?.created_at || post?.post_date)}
            <span className="mx-2">·</span>
            {calculateReadTime(post?.description)} de lectura
        </p>
    );

    return (
        <section
            id={data?.element_id || null}
            className={`py-10 md:py-16 bg-primary min-h-screen text-white ${data?.class_section || ""}`}
        >
            <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* Header (igual que BlogSectionTwenty) */}
                <div className="mb-6 md:mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                        <h2
                            className={`uppercase font-black leading-[0.95] text-white ${data?.class_title || "text-4xl sm:text-5xl lg:text-6xl"}`}
                        >
                            <TextWithHighlight
                                text={data?.title || "Nuestro *Blog* y Novedades"}
                                className=""
                                color="text-twenty"
                            />
                        </h2>
                        {data?.description && (
                            <p className="mt-3 max-w-md text-sm md:text-[15px] text-white/70">
                                {data.description}
                            </p>
                        )}
                    </div>
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-14 md:space-y-16"
                >
                    {/* Destacados (1 grande + secundarios) */}
                    {featuredPost && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-stretch">
                            {/* Principal */}
                            <motion.div variants={itemVariants} className="lg:col-span-7 h-full">
                                <article
                                    className="group relative cursor-pointer overflow-hidden bg-white/5 min-h-[380px] sm:min-h-[440px] flex h-full"
                                    onClick={() => goToPost(featuredPost.slug)}
                                >
                                    <img
                                        src={featuredPost?.image ? `/storage/images/post/${featuredPost.image}` : FALLBACK_IMG}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={featuredPost?.title || featuredPost?.name}
                                        loading="lazy"
                                        onError={onImgError}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

                                    <div className="absolute left-5 top-5 z-10">
                                        <CategoryChip name={featuredPost?.category?.name} />
                                    </div>

                                    <div className="relative z-10 mt-auto p-6 md:p-7">
                                        <Meta post={featuredPost} />
                                        <h3 className="mt-2 text-2xl md:text-3xl font-black text-white leading-tight line-clamp-2">
                                            {featuredPost.title || featuredPost.name}
                                        </h3>
                                        <p className="mt-2 text-sm text-white/70 line-clamp-2 max-w-xl">
                                            {extractText(featuredPost.extract || featuredPost.summary || featuredPost.description || "", 160)}
                                        </p>
                                    </div>
                                </article>
                            </motion.div>

                            {/* Secundarios */}
                            <div className="lg:col-span-5 flex flex-col gap-6">
                                {secondaryPosts.map((post, index) => (
                                    <motion.div key={post.id || index} variants={itemVariants} className="flex-1 min-h-0">
                                        <article
                                            className="group cursor-pointer flex gap-5 h-full"
                                            onClick={() => goToPost(post.slug)}
                                        >
                                            <div className="relative w-36 sm:w-44 shrink-0 overflow-hidden bg-white/5">
                                                <img
                                                    src={post?.image ? `/storage/images/post/${post.image}` : FALLBACK_IMG}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    alt={post?.title || post?.name}
                                                    loading="lazy"
                                                    onError={onImgError}
                                                />
                                            </div>
                                            <div className="min-w-0 flex flex-col justify-center py-1">
                                                <Meta post={post} />
                                                <h4 className="mt-2 text-base md:text-lg font-bold text-white leading-snug line-clamp-2">
                                                    {post.title || post.name}
                                                </h4>
                                                <p className="mt-1.5 text-[13px] text-white/60 line-clamp-2 leading-relaxed">
                                                    {extractText(post.extract || post.summary || post.description || "", 110)}
                                                </p>
                                            </div>
                                        </article>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filtros */}
                    <div className="pt-12 md:pt-14 border-t border-white/10">
                        <h3 className="text-3xl sm:text-4xl max-w-3xl lg:text-5xl font-black uppercase text-white mb-6">
                            Revisa todas nuestras publicaciones
                        </h3>

                        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                            <p className="hidden lg:block text-white/55 text-xs uppercase">
                                Mostrando {totalPosts > 0 ? `${startIndex}-${endIndex} de ${totalPosts}` : "0"} artículos
                            </p>

                            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                                <div className="w-full sm:w-64">
                                    <SelectTwenty
                                        options={[{ value: "all", label: "Todas las categorías" }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
                                        value={activeCategory}
                                        placeholder="Seleccionar Categoría"
                                        onChange={(val) => { setActiveCategory(val); setCurrentPage(1); }}
                                    />
                                </div>

                                <div className="w-full sm:w-64">
                                    <SelectTwenty
                                        options={sortOptions}
                                        value={sortOption}
                                        placeholder="Ordenar por"
                                        onChange={(val) => { setSortOption(val); setCurrentPage(1); }}
                                    />
                                </div>
                            </div>

                            <p className="lg:hidden text-white/55 text-xs uppercase w-full text-center">
                                Mostrando {totalPosts > 0 ? `${startIndex}-${endIndex} de ${totalPosts}` : "0"} artículos
                            </p>
                        </div>
                    </div>

                    {/* Grilla */}
                    {listLoading ? (
                        <div className="flex justify-center py-24">
                            <Loading />
                        </div>
                    ) : gridPosts.length === 0 ? (
                        <div className="py-24">
                            <NoResults />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 pt-2">
                            {gridPosts.map((post, index) => (
                                <motion.div key={`grid-${post.id || index}`} variants={itemVariants} className="h-full">
                                    <article
                                        className="group cursor-pointer h-full"
                                        onClick={() => goToPost(post.slug)}
                                    >
                                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/5">
                                            <img
                                                src={post?.image ? `/storage/images/post/${post.image}` : FALLBACK_IMG}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                alt={post?.title || post?.name}
                                                loading="lazy"
                                                onError={onImgError}
                                            />
                                            <div className="absolute left-0 top-0 z-10">
                                                <CategoryChip name={post?.category?.name} />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <Meta post={post} />
                                            <h4 className="mt-2 text-base font-bold text-white leading-snug line-clamp-2">
                                                {post.title || post.name}
                                            </h4>
                                            <p className="mt-1 text-[13px] text-white/60 line-clamp-2 leading-relaxed">
                                                {extractText(post.extract || post.summary || post.description || "", 120)}
                                            </p>
                                        </div>
                                    </article>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Paginación */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pt-14">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            aria-label="Página anterior"
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 text-white hover:bg-white hover:text-primary disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="flex gap-1.5">
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
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`min-w-10 h-10 px-2 rounded-full text-xs transition-colors ${currentPage === pageNumber
                                                ? "bg-white text-primary font-bold shadow"
                                                : "border border-white/15 text-white hover:bg-white/10"
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
                                        <span key={pageNumber} className="px-1 flex items-center text-white/30 font-bold">
                                            ...
                                        </span>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            aria-label="Página siguiente"
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 text-white hover:bg-white hover:text-primary disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogTwenty;
