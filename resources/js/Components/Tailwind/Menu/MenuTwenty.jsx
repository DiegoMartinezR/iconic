import { ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Global from "../../../Utils/Global";
import tagsItemsRest from "../../../Utils/Services/tagsItemsRest";

// MenuTwenty: clon de MenuMicjc con estilo Twenty
// bg-primary, text-white, píldoras y tarjetas redondeadas, overlay oscuro
const MenuTwenty = ({ pages = [], items = [], data, visible = false }) => {
    // Twenty: sobre bg-primary, formas redondeadas
    const isDark = true;
    const roundedNull = false;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const subPrevRef = useRef(null);
    const subNextRef = useRef(null);
    const [tags, setTags] = useState([]);
    const [currentTagIndex, setCurrentTagIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
        }
        document.addEventListener("pointerdown", handleClickOutside);
        return () => document.removeEventListener("pointerdown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (items && items.length > 0) {
            const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
            if (!activeCategory || !sorted.find(x => x.slug === activeCategory.slug)) setActiveCategory(sorted[0]);
        }
    }, [items]);

    const [overlayTop, setOverlayTop] = useState(0);

    useEffect(() => {
        if (isMenuOpen) {
            if (menuRef.current) setOverlayTop(menuRef.current.getBoundingClientRect().bottom);
            // Bloquear scroll del body manteniendo el scrollbar visible (sin layout shift)
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.documentElement.style.overflow = 'hidden';
            document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
            return () => {
                document.documentElement.style.overflow = '';
                document.documentElement.style.paddingRight = '';
            };
        }
    }, [isMenuOpen]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await tagsItemsRest.getTags();
                if (response?.data) {
                    const activeTags = response.data.filter(tag =>
                        tag.promotional_status === 'permanent' || tag.promotional_status === 'active' && tag.menu === "1" || tag.menu === 1
                    ).sort((a, b) => {
                        if (a.promotional_status === 'active' && b.promotional_status !== 'active') return -1;
                        if (b.promotional_status === 'active' && a.promotional_status !== 'active') return 1;
                        return a.name.localeCompare(b.name);
                    });
                    setTags(activeTags);
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        if (tags.length > 2 && window.innerWidth < 1024) {
            const interval = setInterval(() => {
                setCurrentTagIndex(prev => { const next = prev + 2; return next >= tags.length ? 0 : next; });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [tags.length]);

    const isMobile = window.innerWidth < 1024;
    const shouldShowMenu = isMobile ? (visible && tags.length > 0) : true;
    const showOnlyTagsMobile = tags.length > 0 && isMobile && visible;

    if (!shouldShowMenu) return null;

    const sortedCategories = items ? [...items].sort((a, b) => a.name.localeCompare(b.name)) : [];

    return (
        <>
            {/* Overlay oscuro */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300"
                    style={{ top: `${overlayTop}px` }}
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <nav
                id={data?.element_id || null}
                className="w-full relative border-b border-white/10 z-50 font-paragraph text-white bg-primary"
                style={data?.backgroundColor ? { backgroundColor: data.backgroundColor } : {}}
                ref={menuRef}
            >
                <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto">
                    {showOnlyTagsMobile ? (
                        <div className="w-full py-3">
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-3 h-10">
                                    {tags.slice(currentTagIndex, currentTagIndex + 2).map((tag, index) => {
                                        const actualIndex = currentTagIndex + index;
                                        return (
                                            <a
                                                key={`${tag.id}-${actualIndex}`}
                                                href={`/catalogo?tag=${tag.id}`}
                                                title={tag.description || tag.name}
                                                aria-label={`Ir a ${tag.name}`}
                                                className="group relative overflow-hidden border border-white/20 shadow-sm transition-all duration-300 active:scale-[0.98] rounded-full"
                                                style={{ background: `linear-gradient(135deg, ${tag.background_color || '#3b82f6'}, ${tag.background_color || '#3b82f6'}dd)` }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent"></div>
                                                <div className="relative h-full flex items-center justify-center px-4">
                                                    <div className="flex items-center gap-2 text-center justify-center">
                                                        {tag.icon ? (
                                                            <img src={`/storage/images/tag/${tag.icon}`} alt={tag.name} className="w-5 h-5 object-contain filter brightness-0 invert" onError={(e) => e.target.src = "/api/cover/thumbnail/null"} />
                                                        ) : (
                                                            <Tag size={16} style={{ color: tag.text_color || '#ffffff' }} />
                                                        )}
                                                        <span className="text-xs font-bold truncate max-w-[120px]" style={{ color: tag.text_color || '#ffffff' }}>{tag.name}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                                {tags.length > 2 && (
                                    <div className="flex justify-center mt-2.5 gap-1.5">
                                        {Array.from({ length: Math.ceil(tags.length / 2) }).map((_, i) => (
                                            <button key={i} onClick={() => setCurrentTagIndex(i * 2)} className={`h-1.5 rounded-full transition-all duration-300 ${Math.floor(currentTagIndex / 2) === i ? 'bg-white w-6' : 'bg-white/40 w-1.5 hover:bg-white/70'}`} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between h-auto pb-2">
                            <div className="flex items-center gap-8">
                                {data?.showCategories !== false && (
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className={`flex items-center gap-2.5 px-6 py-2 font-semibold text-sm tracking-wide normal-case transition-all duration-300 rounded-full ${isMenuOpen
                                            ? "bg-white text-primary shadow-lg"
                                            : "text-white border-transparent hover:bg-white/10"
                                            }`}
                                    >
                                        <span>Categorías</span>
                                        <ChevronDown size={14} className={`transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`} />
                                    </button>
                                )}

                                <ul className="flex items-center gap-1">
                                    {pages.filter(page => page.menuable).map((page) => (
                                        <li key={page.path}>
                                            <a href={page.path} className="relative block px-4 py-2 font-semibold text-sm tracking-wide transition-all duration-200 rounded-full text-white hover:text-white hover:bg-white/10">
                                                {page.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {tags.length > 0 && (
                                <ul className="flex items-center gap-2">
                                    {tags.map((tag) => (
                                        <li key={tag.id}>
                                            <a
                                                href={`/catalogo?tag=${tag.id}`}
                                                className="group flex items-center gap-1.5 px-3.5 py-1.5 font-bold text-xs transition-all duration-300 border hover:-translate-y-0.5 hover:shadow rounded-full"
                                                style={{
                                                    backgroundColor: `${tag.background_color || '#3b82f6'}20`,
                                                    color: tag.text_color || '#ffffff',
                                                    borderColor: `${tag.background_color || '#3b82f6'}50`,
                                                }}
                                                title={tag.description || tag.name}
                                                aria-label={`Ir a ${tag.name}`}
                                            >
                                                {tag.icon ? (
                                                    <img src={`/storage/images/tag/${tag.icon}`} alt={tag.name} className="w-3.5 h-3.5 object-contain filter brightness-0 invert" onError={(e) => (e.target.src = "/api/cover/thumbnail/null")} />
                                                ) : <Tag size={12} />}
                                                <span>{tag.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Mega Menú Dropdown */}
                {isMenuOpen && !isMobile && (
                    <div className="absolute left-0 right-0 top-[100%] w-full border-b border-white/10 shadow-[0_25px_50px_rgba(0,0,0,0.35)] z-50 animate-in fade-in slide-in-from-top-1 duration-200 bg-primary text-white  overflow-hidden">
                        <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto flex items-stretch overflow-hidden">
                            {/* Panel Izquierdo */}
                            <div className="w-1/4 shrink-0 border-r border-white/10 pr-4 py-4 space-y-1.5 overflow-y-auto max-h-[60dvh]">
                                {sortedCategories.map((category) => {
                                    const isActive = activeCategory?.slug === category.slug;
                                    return (
                                        <button
                                            key={category.slug}
                                            onMouseEnter={() => setActiveCategory(category)}
                                            onClick={() => setActiveCategory(category)}
                                            className={`w-full relative px-3.5 py-2.5 transition-all duration-200 flex items-center justify-between font-semibold text-[13px] group rounded-full border ${isActive
                                                ? "bg-white/15 text-white border-white/25 shadow backdrop-blur"
                                                : "bg-transparent text-white/70 border-transparent hover:bg-white/10 hover:text-white"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span className="truncate">{category.name}</span>
                                            </div>
                                            <ChevronRight size={14} className={`shrink-0 transition-all duration-200 ${isActive ? "opacity-100" : "opacity-0 -ml-4 group-hover:opacity-60 group-hover:ml-0"}`} />
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Panel Derecho */}
                            <div className="w-3/4 p-5 bg-primary min-w-0">
                                <div>
                                    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4">
                                        <h3 className="font-paragraph font-semibold text-lg tracking-wide normal-case text-white truncate">{activeCategory?.name}</h3>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <button
                                                ref={subPrevRef}
                                                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white hover:text-primary transition-all duration-300"
                                                aria-label="Subcategorías anteriores"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            <button
                                                ref={subNextRef}
                                                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white hover:text-primary transition-all duration-300"
                                                aria-label="Subcategorías siguientes"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                            <a
                                                href={`/catalogo?category=${activeCategory?.slug}`}
                                                className="group text-sm font-paragraph font-bold text-primary bg-white hover:bg-white/90 hidden sm:flex items-center gap-1.5 px-4 py-3 transition-all duration-200 rounded-full shadow"
                                            >
                                                <span>Ver todos</span>
                                                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                            </a>
                                        </div>
                                    </div>

                                    {activeCategory?.subcategories && activeCategory.subcategories.length > 0 ? (
                                        <Swiper
                                            key={activeCategory?.slug}
                                            modules={[Navigation, A11y, Keyboard]}
                                            spaceBetween={12}
                                            slidesPerView={5}
                                            observer={true}
                                            observeParents={true}
                                            watchSlidesProgress={true}
                                            loop={true}
                                            navigation={{
                                                prevEl: subPrevRef.current,
                                                nextEl: subNextRef.current,
                                            }}
                                            onBeforeInit={(swiper) => {
                                                swiper.params.navigation.prevEl = subPrevRef.current;
                                                swiper.params.navigation.nextEl = subNextRef.current;
                                            }}
                                            breakpoints={{
                                                0: { slidesPerView: 3, spaceBetween: 10 },
                                                1024: { slidesPerView: 4, spaceBetween: 12 },
                                                1280: { slidesPerView: 4, spaceBetween: 12 },
                                            }}
                                            className="w-full"
                                        >
                                            {activeCategory.subcategories.map((sub) => (
                                                <SwiperSlide key={sub.slug} className="h-auto">
                                                    <a
                                                        href={`/catalogo?subcategory=${sub.slug}`}
                                                        className="group flex flex-col h-full  transition-all duration-300  text-white"
                                                    >
                                                        <div className="w-full aspect-[3/4] overflow-hidden relative shrink-0 rounded-xl bg-white/5">
                                                            <img src={sub.image ? `/storage/images/sub_category/${sub.image}` : "/api/cover/thumbnail/null"} alt={sub.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.onerror = null; e.target.src = "/api/cover/thumbnail/null"; }} />
                                                        </div>
                                                        <div className="px-1 text-center pt-2 pb-0.5">
                                                            <span className="font-paragraph font-semibold text-sm leading-tight line-clamp-2 block text-white/85 group-hover:text-white">{sub.name}</span>
                                                        </div>
                                                    </a>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    ) : (
                                        <div className="py-10 text-center font-medium text-sm text-white/50">
                                            No hay subcategorías registradas en esta sección.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default MenuTwenty;
