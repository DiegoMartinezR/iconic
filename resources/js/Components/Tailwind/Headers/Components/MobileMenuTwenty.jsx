import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronDown, User, LogOut, Search } from "lucide-react";
import Global from "../../../../Utils/Global";
import Logout from "../../../../Actions/Logout";

export default function MobileMenuTwenty({
    pages = [],
    items = [],
    onClose,
    onSearch,
    data,
    isUser,
    generals = []
}) {
    const [activeTab, setActiveTab] = useState("menu"); // "menu" | "categories"
    const [expandedCategory, setExpandedCategory] = useState(null);

    const phoneWhatsappObj = generals?.find((item) => item.correlative === "phone_whatsapp");
    const messageWhatsappObj = generals?.find((item) => item.correlative === "message_whatsapp");
    const phoneWhatsapp = phoneWhatsappObj?.description ?? null;
    const messageWhatsapp = messageWhatsappObj?.description ?? null;

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [onClose]);

    // Sort categories
    const sortedCategories = [...items].sort((a, b) => {
        if (data?.type_order === 'order_index') {
            return (a.order_index || 0) - (b.order_index || 0);
        }
        return (a.name || '').localeCompare(b.name || '', 'es', { sensitivity: 'base' });
    });

    const toggleCategory = (catId) => {
        setExpandedCategory(prev => prev === catId ? null : catId);
    };

    const menuPages = pages.filter(page => page.menuable);

    return (
        <div className="fixed inset-0 z-[120] bg-primary text-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
                <a href="/" onClick={onClose} className="flex items-center gap-2">
                    <img
                        src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                        alt={Global.APP_NAME}
                        className="h-8 object-contain"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/logo-bk.svg"; }}
                    />
                </a>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    aria-label="Cerrar menú"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Search shortcut */}
            <div className="px-5 pb-3">
                <button
                    type="button"
                    onClick={() => {
                        if (onSearch) {
                            onSearch();
                        } else {
                            onClose();
                            window.location.href = "/catalogo";
                        }
                    }}
                    className="w-full flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white/60"
                >
                    <Search size={16} className="shrink-0" />
                    <span>Buscar productos...</span>
                </button>
            </div>

            {/* Segmented tabs */}
            <div className="px-5 pb-3">
                <div className="flex rounded-full bg-black/20 p-1">
                    <button
                        onClick={() => setActiveTab("menu")}
                        className={`flex-1 py-2.5 text-center text-xs font-bold uppercase rounded-full transition-all duration-300 ${activeTab === "menu" ? "bg-white text-primary shadow" : "text-white/60"
                            }`}
                    >
                        Navegación
                    </button>
                    <button
                        onClick={() => setActiveTab("categories")}
                        className={`flex-1 py-2.5 text-center text-xs font-bold uppercase rounded-full transition-all duration-300 ${activeTab === "categories" ? "bg-white text-primary shadow" : "text-white/60"
                            }`}
                    >
                        Categorías ({items.length})
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-5">
                {activeTab === "menu" && (
                    <nav className="rounded-3xl border border-white/10 bg-white/[0.04] p-2">
                        {menuPages.map((page, index) => (
                            <a
                                key={index}
                                href={page.path}
                                onClick={onClose}
                                className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold hover:bg-white/10 transition-colors"
                            >
                                <span>{page.name}</span>
                                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                                    <ChevronRight size={14} className="text-white/60" />
                                </span>
                            </a>
                        ))}
                        {menuPages.length === 0 && (
                            <p className="px-4 py-6 text-center text-sm text-white/50">
                                Sin páginas en el menú
                            </p>
                        )}
                    </nav>
                )}

                {activeTab === "categories" && (
                    <div className="space-y-2.5">
                        {sortedCategories.map((category) => {
                            const hasSub = Array.isArray(category.subcategories) && category.subcategories.length > 0;
                            const isExpanded = expandedCategory === category.id;

                            return (
                                <div
                                    key={category.id}
                                    className={`rounded-2xl border overflow-hidden transition-colors ${isExpanded ? "border-white/25 bg-white/10" : "border-white/10 bg-white/[0.04]"}`}
                                >
                                    <div className="flex items-center gap-2 p-2 pl-4">
                                        <a
                                            href={`/catalogo?category=${category.slug || category.id}`}
                                            onClick={onClose}
                                            className="flex-1 py-2 text-sm font-semibold truncate"
                                        >
                                            {category.name}
                                        </a>

                                        {hasSub ? (
                                            <button
                                                onClick={() => toggleCategory(category.id)}
                                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isExpanded ? "bg-white text-primary" : "bg-white/10 text-white"}`}
                                                aria-label="Expandir subcategorías"
                                            >
                                                <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                                            </button>
                                        ) : (
                                            <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                                                <ChevronRight size={14} className="text-white/50" />
                                            </span>
                                        )}
                                    </div>

                                    {/* Subcategories Accordion */}
                                    {hasSub && isExpanded && (
                                        <div className="px-2 pb-2 space-y-1">
                                            {category.subcategories.map((subcat) => (
                                                <a
                                                    key={subcat.id}
                                                    href={`/catalogo?subcategory=${subcat.slug}`}
                                                    onClick={onClose}
                                                    className="flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                                                >
                                                    <span className="truncate">{subcat.name}</span>
                                                    <ChevronRight size={13} className="text-white/30 shrink-0" />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Bottom Actions Footer */}
            <div className="border-t border-white/10 px-5 py-4 bg-black/20">
                {isUser ? (
                    <div className="grid grid-cols-2 gap-2.5">
                        <a
                            href="/profile"
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-white text-primary text-xs font-bold uppercase transition-colors"
                        >
                            <User size={15} />
                            <span>Mi Perfil</span>
                        </a>
                        <button
                            onClick={() => {
                                onClose();
                                Logout();
                            }}
                            className="flex items-center justify-center gap-2 py-3 px-3 rounded-full border border-white/25 text-xs font-bold uppercase transition-colors"
                        >
                            <LogOut size={15} />
                            <span>Salir</span>
                        </button>
                    </div>
                ) : (
                    <a
                        href="/iniciar-sesion"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-white text-primary font-bold text-xs uppercase transition-colors"
                    >
                        <User size={15} />
                        <span>Iniciar Sesión / Registrarse</span>
                    </a>
                )}
            </div>
        </div>
    );
}
