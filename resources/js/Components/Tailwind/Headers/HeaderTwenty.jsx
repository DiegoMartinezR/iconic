import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import {
    CircleUser,
    DoorClosed,
    Search,
    ShoppingCart,
    XIcon,
    User,
    Settings,
    Home,
} from "lucide-react";
import CartModalSelector from "../Components/CartModalSelector";
import Logout from "../../../Actions/Logout";
import MobileMenuTwenty from "./Components/MobileMenuTwenty";
import ProfileImage from "./Components/ProfileImage";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import TopBar from "../TopBar";
import Menu from "../Menu";

// HeaderTwenty: bg-primary, text-white, formas redondeadas (estilo Twenty moda)
const HeaderTwenty = ({
    items,
    data,
    cart,
    setCart,
    isUser,
    pages,
    generals = [],
}) => {
    const phoneWhatsappObj = generals.find(
        (item) => item.correlative === "phone_whatsapp"
    );
    const messageWhatsappObj = generals.find(
        (item) => item.correlative === "message_whatsapp"
    );

    const phoneWhatsapp = phoneWhatsappObj?.description ?? null;
    const messageWhatsapp = messageWhatsappObj?.description ?? null;

    const [modalOpen, setModalOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [searchMobile, setSearchMobile] = useState(false);
    const [search, setSearch] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFixed, setIsFixed] = useState(false);

    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const suggestionItemsRef = useRef([]);

    const menuRef = useRef(null);
    const searchRef = useRef(null);
    const mobileSearchInputRef = useRef(null);
    const desktopSearchInputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const mobileSearchModalRef = useRef(null);
    const searchTimeoutRef = useRef(null);
    const suggestionRefs = useRef([]);

    const totalCount = cart.reduce((acc, item) => Number(acc) + Number(item.quantity), 0);

    // Reacción al Fly-to-Cart: bounce sutil del icono cuando el vuelo llega.
    const cartBump = useAnimation();
    const badgeMounted = useRef(false);
    useEffect(() => {
        badgeMounted.current = true;
    }, []);
    useEffect(() => {
        const onBump = () => {
            try {
                if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
                cartBump.start({
                    scale: [1, 1.15, 1],
                    x: [0, -4, 4, -2, 0],
                    transition: { duration: 0.35, ease: "easeOut" },
                });
            } catch {
                // noop
            }
        };
        window.addEventListener("twenty:cart-bump", onBump);
        return () => window.removeEventListener("twenty:cart-bump", onBump);
    }, [cartBump]);

    const shouldHideMobileSearch = () => {
        try {
            const currentPath = window.location.pathname || '';
            return ['/cart', '/checkout'].some(route => currentPath.includes(route));
        } catch {
            return false;
        }
    };

    const fetchSearchSuggestions = async (query) => {
        if (!query.trim() || query.length < 2) {
            setSearchSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        setIsLoadingSuggestions(true);
        try {
            const response = await fetch('/api/items/paginate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                body: JSON.stringify({
                    take: 8, skip: 0,
                    filter: [['name', 'contains', query], 'or', ['summary', 'contains', query], 'or', ['description', 'contains', query], 'or', ['sku', 'contains', query]],
                    requireTotalCount: false,
                    with: 'category,brand'
                })
            });
            if (!response.ok) throw new Error('Error en la búsqueda');
            const data = await response.json();
            if (data.status === 200 && Array.isArray(data.data)) {
                setSearchSuggestions(data.data);
                setShowSuggestions(data.data.length > 0);
            } else {
                setSearchSuggestions([]);
                setShowSuggestions(false);
            }
        } catch {
            setSearchSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const handleSearchChange = (value) => {
        setSearch(value);
        setSelectedSuggestionIndex(-1);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => fetchSearchSuggestions(value), 300);
    };

    const clearSuggestions = () => {
        setShowSuggestions(false);
        setSearchSuggestions([]);
        setSelectedSuggestionIndex(-1);
    };

    const selectSuggestion = (suggestion) => {
        if (!suggestion) return;
        clearSuggestions();
        setSearchMobile(false);
        const targetSlug = suggestion.slug || suggestion.id;
        const url = targetSlug ? `/product/${targetSlug}` : `/catalogo?search=${encodeURIComponent(suggestion.name)}`;
        window.location.href = url;
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
            if (searchRef.current && !searchRef.current.contains(event.target) && !search.trim()) setSearchMobile(false);

            const isInsideDesktopSuggestions = suggestionsRef.current && suggestionsRef.current.contains(event.target);
            const isInsideDesktopInput = desktopSearchInputRef.current && desktopSearchInputRef.current.contains(event.target);
            const isInsideMobileModal = mobileSearchModalRef.current && mobileSearchModalRef.current.contains(event.target);

            if (!isInsideDesktopSuggestions && !isInsideDesktopInput && !isInsideMobileModal) {
                clearSuggestions();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [search]);

    useEffect(() => {
        const handleScroll = () => setIsFixed(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (searchMobile || openMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [searchMobile, openMenu]);

    // La BottomBar móvil puede pedir abrir el buscador vía evento
    useEffect(() => {
        const openSearch = () => {
            setSearchMobile(true);
            setTimeout(() => mobileSearchInputRef.current?.focus(), 150);
        };
        window.addEventListener("twenty:open-search", openSearch);
        return () => window.removeEventListener("twenty:open-search", openSearch);
    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                if (showSuggestions) clearSuggestions();
                else if (searchMobile) { setSearchMobile(false); setSearch(""); }
            }
        };
        if (searchMobile || showSuggestions) document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [searchMobile, showSuggestions]);

    useEffect(() => {
        return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
    }, []);

    useEffect(() => {
        if (selectedSuggestionIndex >= 0 && suggestionRefs.current[selectedSuggestionIndex] && suggestionsRef.current) {
            suggestionRefs.current[selectedSuggestionIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [selectedSuggestionIndex]);

    const menuVariants = {
        hidden: { opacity: 0, y: -10, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } },
        exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }
    };

    const menuItems = [
        { icon: <User size={16} />, label: "Mi Perfil", href: "/profile" },
        { icon: <ShoppingCart size={16} />, label: "Mis Pedidos", href: "/customer/dashboard" },
        { icon: <Settings size={16} />, label: "Configuración", href: "/account" },
        { icon: <DoorClosed size={16} />, label: "Cerrar Sesión", onClick: Logout }
    ];

    function scrollToSuggestion(index) {
        const container = suggestionsRef.current;
        const el = suggestionItemsRef.current[index];
        if (!container || !el) return;
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        if (elRect.top < containerRect.top) container.scrollTop -= (containerRect.top - elRect.top);
        else if (elRect.bottom > containerRect.bottom) container.scrollTop += (elRect.bottom - containerRect.bottom);
    }

    const handleKeyDown = (e) => {
        if (!showSuggestions || searchSuggestions.length === 0) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => { const next = prev < searchSuggestions.length - 1 ? prev + 1 : prev; setTimeout(() => scrollToSuggestion(next), 0); return next; });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => { const next = prev > 0 ? prev - 1 : 0; setTimeout(() => scrollToSuggestion(next), 0); return next; });
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < searchSuggestions.length) selectSuggestion(searchSuggestions[selectedSuggestionIndex]);
                else if (search.trim()) handleFormSubmit(e);
                break;
            case 'Escape': setShowSuggestions(false); break;
            default: break;
        }
    };

    const SearchSuggestions = ({ suggestions, isLoading, onSelect, selectedIndex }) => {
        if (!showSuggestions) return null;
        const highlightMatches = (text, searchQuery) => {
            if (!text || !searchQuery) return text;
            const searchWords = searchQuery.trim().toLowerCase().split(/\s+/).filter(w => w.length >= 2);
            const pattern = new RegExp(`(${searchWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
            const parts = text.split(pattern);
            return parts.map((part, index) => {
                const isMatch = searchWords.some(word => part.toLowerCase() === word);
                if (isMatch) return <strong key={index} className="font-bold text-white underline underline-offset-2">{part}</strong>;
                return <span key={index}>{part}</span>;
            });
        };
        return (
            <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 border border-white/15 shadow-2xl z-[60] max-h-80 overflow-y-auto mt-2 rounded-2xl bg-primary text-white overflow-hidden"
            >
                {isLoading ? (
                    <div className="p-4 text-center text-white/70">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Buscando...
                        </div>
                    </div>
                ) : suggestions.length > 0 ? (
                    <ul className="py-2">
                        {suggestions.map((suggestion, index) => (
                            <li key={suggestion.id} ref={el => suggestionItemsRef.current[index] = el} className="px-2">
                                <button
                                    data-suggestion-button
                                    onMouseDown={e => { e.preventDefault(); e.stopPropagation(); setTimeout(() => onSelect(suggestion), 0); }}
                                    className={`w-full px-3 py-2.5 text-left transition-all duration-200 flex items-center gap-3 rounded-xl hover:bg-white/10 ${index === selectedIndex ? 'bg-white/15' : ''}`}
                                    type="button"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 overflow-hidden rounded-xl bg-white/10">
                                        {suggestion.image ? (
                                            <img src={`/api/items/media/${suggestion.image}`} alt={suggestion.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/50"><Search size={16} /></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate text-white">{highlightMatches(suggestion.name, search)}</div>
                                        {suggestion.category && <div className="text-xs uppercase tracking-wide truncate text-white/60">{suggestion.category.name}</div>}
                                        {suggestion.final_price > 0 && <div className="text-sm font-semibold text-white">{CurrencySymbol()} {parseFloat(suggestion.final_price).toFixed(2)}</div>}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-4 text-center text-white/60">No se encontraron productos</div>
                )}
            </motion.div>
        );
    };

    let isCustomer = false;
    let dashboardUrl = '/admin/home';
    if (isUser && Array.isArray(isUser.roles)) {
        const roleNames = isUser.roles.map(r => r.name?.toLowerCase());
        isCustomer = !roleNames.includes('admin') && !roleNames.includes('root') && !roleNames.includes('provider');
        if (roleNames.includes('provider')) dashboardUrl = '/provider/home';
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        clearSuggestions();
        if (search.trim()) window.location.href = `/catalogo?search=${encodeURIComponent(search.trim())}`;
        return false;
    };

    const handleMobileSearch = (event) => {
        event.preventDefault();
        clearSuggestions();
        if (search.trim()) { setSearchMobile(false); window.location.href = `/catalogo?search=${encodeURIComponent(search.trim())}`; }
        return false;
    };

    // Twenty bg: bg-primary siempre
    const bgHeader = data?.backgroundColor || 'bg-primary';

    return (
        <header id={data?.element_id || null} className="relative w-full z-[100]">
            {data?.type_topbar && data.type_topbar !== 'none' && (
                <div className="w-full transition-all duration-300">
                    <TopBar which={data.type_topbar} data={data} items={items} generals={generals} cart={cart} setCart={setCart} isUser={isUser} pages={pages} />
                </div>
            )}

            <div className={`w-full transition-all duration-300 ${isFixed ? 'fixed top-0 left-0 right-0 shadow-xl shadow-black/10 z-[100]' : 'relative z-[100]'} ${bgHeader}`}>
                <div className={`px-primary 2xl:px-0 2xl:max-w-7xl mx-auto text-white transition-all duration-300 ${isFixed ? 'py-3 md:py-3' : 'py-3'}`}>
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2 z-[51]">
                            <img
                                src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                                alt={Global.APP_NAME}
                                className={`h-8 sm:h-9 md:h-14 object-contain object-center ${data?.class_logo || ""}`}
                                onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/logo-bk.svg"; }}
                            />
                        </a>

                        {/* Mobile Header Right Icons (Search, User, Cart, Hamburger) */}
                        <div className="flex md:hidden items-center gap-1">
                            {/* Search Icon Button */}
                            {!shouldHideMobileSearch() && (
                                <button
                                    type="button"
                                    aria-label="Buscar"
                                    onClick={() => {
                                        setSearchMobile(true);
                                        setTimeout(() => mobileSearchInputRef.current?.focus(), 150);
                                    }}
                                    className="flex items-center justify-center w-10 h-10 text-white hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <Search size={22} />
                                </button>
                            )}

                            {data?.showLoginCart && (
                                <>
                                    {/* User / Profile Icon */}
                                    {isUser ? (
                                        <div ref={menuRef} className="relative flex items-center">
                                            <button
                                                aria-label="user"
                                                className="flex items-center transition-all duration-300 relative group text-white hover:text-white/80 p-1"
                                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                            >
                                                <div className="relative transform group-hover:scale-105 transition-transform duration-200">
                                                    {isUser.uuid ? (
                                                        <div className="relative">
                                                            <ProfileImage
                                                                uuid={isUser.uuid}
                                                                name={isUser.name}
                                                                lastname={isUser.lastname}
                                                                className="!w-6 !h-6 rounded-full object-cover border border-white/70"
                                                                classCircleUser="text-white border-white"
                                                            />
                                                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-white border border-primary rounded-full animate-pulse">
                                                                <div className="w-full h-full bg-white rounded-full"></div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="relative">
                                                            <CircleUser className="text-white" width="1.375rem" height="1.375rem" />
                                                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-white border border-primary rounded-full animate-pulse">
                                                                <div className="w-full h-full bg-white rounded-full"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>

                                            <AnimatePresence>
                                                {isMenuOpen && (
                                                    <motion.div
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        variants={menuVariants}
                                                        className="absolute z-[100] top-full right-0 border border-white/15 shadow-2xl mt-2 w-52 rounded-2xl bg-primary text-white overflow-hidden"
                                                    >
                                                        <div className="p-3">
                                                            <ul className="space-y-2">
                                                                {isCustomer ? (
                                                                    menuItems.map((item, index) => (
                                                                        <li key={index}>
                                                                            {item.onClick ? (
                                                                                <button
                                                                                    aria-label="menu-items"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        e.stopPropagation();
                                                                                        setIsMenuOpen(false);
                                                                                        setTimeout(() => item.onClick(), 150);
                                                                                    }}
                                                                                    className="flex w-full items-center gap-3 text-sm transition-all duration-300 p-2 rounded-xl text-white/85 hover:bg-white/10 hover:text-white"
                                                                                >
                                                                                    {item.icon}<span>{item.label}</span>
                                                                                </button>
                                                                            ) : (
                                                                                <a
                                                                                    href={item.href}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        setIsMenuOpen(false);
                                                                                    }}
                                                                                    className="flex items-center gap-3 text-sm transition-all duration-300 p-2 rounded-xl text-white/85 hover:bg-white/10 hover:text-white"
                                                                                >
                                                                                    {item.icon}<span>{item.label}</span>
                                                                                </a>
                                                                            )}
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <>
                                                                        <li>
                                                                            <a
                                                                                href={dashboardUrl}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setIsMenuOpen(false);
                                                                                }}
                                                                                className="flex items-center gap-3 text-sm transition-all duration-300 p-2 rounded-xl text-white/85 hover:bg-white/10 hover:text-white"
                                                                            >
                                                                                <Home size={16} /><span>Dashboard</span>
                                                                            </a>
                                                                        </li>
                                                                        <li>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    e.stopPropagation();
                                                                                    setIsMenuOpen(false);
                                                                                    setTimeout(() => Logout(), 150);
                                                                                }}
                                                                                className="flex w-full items-center gap-3 text-sm transition-all duration-300 p-2 rounded-xl text-white/85 hover:bg-white/10 hover:text-white"
                                                                            >
                                                                                <DoorClosed size={16} /><span>Cerrar Sesión</span>
                                                                            </button>
                                                                        </li>
                                                                    </>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <a href="/iniciar-sesion" aria-label={`Iniciar Sesión - ${Global.APP_NAME}`} className="flex items-center justify-center w-10 h-10 text-white hover:bg-white/10 rounded-full transition-colors">
                                            <CircleUser className="text-white" width="1.375rem" height="1.375rem" />
                                        </a>
                                    )}

                                    {/* Cart Icon (destino móvil del Fly-to-Cart) */}
                                    <button
                                        aria-label="Carrito"
                                        data-twenty-cart-target="mobile"
                                        onClick={() => setModalOpen(true)}
                                        className="flex items-center justify-center relative w-10 h-10 text-white hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <motion.span animate={cartBump} className="flex items-center justify-center">
                                            <ShoppingCart width="1.375rem" height="1.375rem" />
                                        </motion.span>
                                        <motion.span
                                            key={totalCount}
                                            initial={badgeMounted.current ? { scale: 0.4, opacity: 0 } : false}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                            className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-4 h-4 px-1 bg-white text-primary rounded-full text-[9px] font-bold leading-none"
                                        >
                                            {totalCount}
                                        </motion.span>
                                    </button>
                                </>
                            )}

                            {/* Hamburger Menu Button */}
                            <button
                                aria-label="Menú"
                                onClick={() => setOpenMenu(!openMenu)}
                                className="flex items-center justify-center bg-white text-primary w-10 h-10 transition-all duration-300 rounded-full hover:bg-white/90 shadow-lg"
                            >
                                {!openMenu ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M10 5H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4 19H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <XIcon size={20} />
                                )}
                            </button>
                        </div>

                        {/* Search Bar - Desktop */}
                        <div className="hidden md:block relative w-full max-w-lg xl:max-w-xl mx-auto">
                            <form onSubmit={handleFormSubmit} role="search">
                                <input
                                    ref={desktopSearchInputRef}
                                    type="search"
                                    name="search"
                                    placeholder={`${data?.input_search_placeholder || 'Estoy buscando...'}`}
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => { if (search.trim().length >= 2) fetchSearchSuggestions(search); }}
                                    className="w-full pr-14 py-3.5 pl-6 border border-white/25 font-normal text-sm focus:ring-0 focus:outline-none rounded-full bg-white/15 text-white placeholder:text-white/60 shadow-lg shadow-black/10 backdrop-blur focus:bg-white/20 focus:border-white/40"
                                    enterKeyHint="search"
                                    inputMode="search"
                                    autoComplete="on"
                                    role="searchbox"
                                    aria-label={`${data?.input_search_placeholder || 'Estoy buscando...'}`}
                                />
                                <button type="submit" className="absolute right-1.5 top-1/2 transform -translate-y-1/2 p-2.5 text-primary hover:scale-105 transition-all duration-300 rounded-full bg-white hover:bg-white/90 shadow" aria-label="Buscar">
                                    <Search />
                                </button>
                            </form>
                            <AnimatePresence>
                                <SearchSuggestions suggestions={searchSuggestions} isLoading={isLoadingSuggestions} onSelect={selectSuggestion} selectedIndex={selectedSuggestionIndex} />
                            </AnimatePresence>
                        </div>

                        {/* Account and Cart - Desktop */}
                        {data?.showLoginCart ? (
                            <div className="hidden md:flex items-center gap-4 relative text-sm text-white">
                                <div ref={menuRef}>
                                    {isUser ? (
                                        <button aria-label="user" className="flex items-center gap-2 pr-6 transition-all duration-300 relative group text-white hover:text-white/80" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                            <div className="relative transform group-hover:scale-105 transition-transform duration-200">
                                                {isUser.uuid ? (
                                                    <div className="relative">
                                                        <ProfileImage uuid={isUser.uuid} name={isUser.name} lastname={isUser.lastname} className="w-8 h-8 rounded-full object-cover border-2 border-white/80 shadow" classCircleUser="text-white border-white" />
                                                        <div className="absolute -bottom-[-0.115rem] -right-0.5 w-3.5 h-3.5 bg-white border-2 border-primary rounded-full animate-pulse"><div className="w-full h-full bg-white rounded-full animate-ping opacity-75 absolute"></div><div className="w-full h-full bg-white rounded-full"></div></div>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <CircleUser className="text-white" />
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white border-2 border-primary rounded-full animate-pulse"><div className="w-full h-full bg-white rounded-full animate-ping opacity-75 absolute"></div><div className="w-full h-full bg-white rounded-full"></div></div>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="hidden md:inline text-[10px] lg:text-sm uppercase">{isUser.name}</span>
                                        </button>
                                    ) : (
                                        <a href="/iniciar-sesion" aria-label={`Iniciar Sesión - ${Global.APP_NAME}`} className="flex items-center gap-2 text-white hover:text-white/80 transition-colors duration-300">
                                            <CircleUser className="text-white" />
                                            <span className="hidden md:inline text-[10px] lg:text-sm uppercase">Iniciar Sesión</span>
                                        </a>
                                    )}

                                    <AnimatePresence>
                                        {isMenuOpen && (
                                            <motion.div initial="hidden" animate="visible" exit="exit" variants={menuVariants} className="absolute z-[100] top-full left-0 bg-primary shadow-2xl border border-white/15 rounded-2xl w-52 mt-2 overflow-hidden">
                                                <div className="p-4">
                                                    <ul className="space-y-4">
                                                        {isCustomer ? (
                                                            menuItems.map((item, index) => (
                                                                <li key={index}>
                                                                    {item.onClick ? (
                                                                        <button aria-label="menu-items" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(false); setTimeout(() => item.onClick(), 150); }} className="flex w-full items-center gap-3 text-white/85 text-sm hover:bg-white/10 hover:text-white transition-all duration-300 p-2 rounded-xl">
                                                                            {item.icon}<span>{item.label}</span>
                                                                        </button>
                                                                    ) : (
                                                                        <a href={item.href} onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} className="flex items-center gap-3 text-white/85 text-sm hover:bg-white/10 hover:text-white transition-all duration-300 p-2 rounded-xl">
                                                                            {item.icon}<span>{item.label}</span>
                                                                        </a>
                                                                    )}
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <>
                                                                <li><a href={dashboardUrl} onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} className="flex items-center gap-3 text-white/85 text-sm hover:bg-white/10 hover:text-white transition-all duration-300 p-2 rounded-xl"><Home size={16} /><span>Dashboard</span></a></li>
                                                                <li><button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(false); setTimeout(() => Logout(), 150); }} className="flex w-full items-center gap-3 text-white/85 text-sm hover:bg-white/10 hover:text-white transition-all duration-300 p-2 rounded-xl"><DoorClosed size={16} /><span>Cerrar Sesión</span></button></li>
                                                            </>
                                                        )}
                                                    </ul>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button aria-label="cart" data-twenty-cart-target="desktop" onClick={() => setModalOpen(true)} className="flex items-center gap-2 relative transition-colors duration-300 text-white hover:text-white/80">
                                    <motion.span animate={cartBump} className="flex items-center gap-2">
                                        <ShoppingCart />
                                        <span className="hidden xl:inline text-[10px] lg:text-sm uppercase">Mi Carrito</span>
                                    </motion.span>
                                    <motion.span
                                        key={totalCount}
                                        initial={badgeMounted.current ? { scale: 0.4, opacity: 0 } : false}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                        className="absolute -right-6 -top-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-sans bg-white text-primary rounded-full font-bold leading-none"
                                    >
                                        {totalCount}
                                    </motion.span>
                                </button>
                            </div>
                        ) : (
                            <a aria-label="primary-button" className="bg-white text-primary hidden lg:block px-6 py-2.5 font-bold hover:bg-white/90 transition-colors duration-300 rounded-full uppercase text-sm"
                                target="_blank" rel="noopener noreferrer"
                                href={phoneWhatsapp && messageWhatsapp ? `https://api.whatsapp.com/send?phone=${encodeURIComponent(phoneWhatsapp)}&text=${encodeURIComponent(messageWhatsapp)}` : "#"}>
                                Haz tu pedido
                            </a>
                        )}
                    </div>
                </div>

                {/* Mobile Fullscreen Search Modal Overlay */}
                <AnimatePresence>
                    {searchMobile && (
                        <motion.div
                            ref={mobileSearchModalRef}
                            data-twenty-search-modal="true"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[120] bg-primary/95 backdrop-blur-xl text-white p-4 flex flex-col md:hidden"
                        >
                            <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/20">
                                <div className="flex-1 relative">
                                    <form onSubmit={handleMobileSearch} role="search" className="relative w-full">
                                        <input
                                            ref={mobileSearchInputRef}
                                            type="search"
                                            name="search"
                                            placeholder={data?.input_search_placeholder || "Buscar en TWENTY..."}
                                            value={search}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="w-full pr-10 py-3 pl-10 border border-white/25 bg-white/10 text-white text-sm focus:outline-none focus:bg-white/15 focus:border-white/40 rounded-full placeholder:text-white/50 shadow-lg"
                                            autoFocus
                                            enterKeyHint="search"
                                            inputMode="search"
                                            autoComplete="off"
                                        />
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white" size={18} />
                                        {search && (
                                            <button
                                                type="button"
                                                onClick={() => { setSearch(""); clearSuggestions(); }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white p-1"
                                                aria-label="Limpiar búsqueda"
                                            >
                                                <XIcon size={16} />
                                            </button>
                                        )}
                                    </form>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setSearchMobile(false); clearSuggestions(); }}
                                    className="bg-white/10 hover:bg-white/20 p-2 text-white transition-colors rounded-full"
                                    aria-label="Cerrar búsqueda"
                                >
                                    <XIcon size={20} />
                                </button>
                            </div>

                            {/* Search Results / Suggestions list in Mobile Modal */}
                            <div className="flex-1 overflow-y-auto mt-4 space-y-3">
                                {isLoadingSuggestions ? (
                                    <div className="p-6 text-center text-white/70 flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Buscando productos...</span>
                                    </div>
                                ) : searchSuggestions.length > 0 ? (
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-white/50 mb-3 font-semibold">Resultados</p>
                                        <div className="space-y-2">
                                            {searchSuggestions.map((suggestion) => (
                                                <button
                                                    key={suggestion.id}
                                                    type="button"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        selectSuggestion(suggestion);
                                                    }}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        selectSuggestion(suggestion);
                                                    }}
                                                    className="w-full p-3 text-left flex items-center gap-3 bg-white/5 hover:bg-white/15 border border-white/10 rounded-2xl transition-colors cursor-pointer"
                                                >
                                                    <div className="w-14 h-14 bg-white/10 flex-shrink-0 overflow-hidden rounded-xl flex items-center justify-center">
                                                        {suggestion.image ? (
                                                            <img
                                                                src={`/api/items/media/${suggestion.image}`}
                                                                alt={suggestion.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        ) : (
                                                            <Search size={20} className="text-white/40" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-sm truncate text-white">{suggestion.name}</div>
                                                        {suggestion.category && <div className="text-xs text-white truncate">{suggestion.category.name}</div>}
                                                        {suggestion.final_price > 0 && (
                                                            <div className="text-sm font-bold text-white mt-0.5">
                                                                {CurrencySymbol()} {parseFloat(suggestion.final_price).toFixed(2)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : search.trim().length >= 2 ? (
                                    <div className="p-8 text-center text-white">No se encontraron productos para "{search}"</div>
                                ) : (
                                    <div className="p-8 text-center text-white text-sm">Empieza a escribir para buscar productos...</div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {openMenu && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                            <MobileMenuTwenty
                                pages={pages}
                                items={items}
                                onClose={() => setOpenMenu(false)}
                                onSearch={() => {
                                    setOpenMenu(false);
                                    setSearchMobile(true);
                                    setTimeout(() => mobileSearchInputRef.current?.focus(), 150);
                                }}
                                data={data}
                                isUser={isUser}
                                generals={generals}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {data?.type_menu && data.type_menu !== 'none' && !isFixed && (
                    <Menu which={data.type_menu} data={data} items={items} generals={generals} cart={cart} setCart={setCart} isUser={isUser} pages={pages} />
                )}
            </div>

            <CartModalSelector
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </header>
    );
};

export default HeaderTwenty;
