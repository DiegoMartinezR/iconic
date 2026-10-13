import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";
import { CircleUser, User, ShoppingCart, Settings, DoorClosed, Home } from "lucide-react";
import Logout from "../../../Actions/Logout";
import ProfileImage from "../Headers/Components/ProfileImage";

// ─── Iconos SVG ─────────────────────────────────────────────────────────────
const IconHouse = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.50091 10.9673V15.6123C5.45843 17.4397 6.90451 18.9561 8.73191 19.0003H16.2699C18.0973 18.9561 19.5434 17.4397 19.5009 15.6123V10.9673C19.503 9.59674 18.8636 8.30422 17.7729 7.47427L14.7129 5.61927C13.3535 4.79358 11.6474 4.79358 10.2879 5.61927L7.22891 7.47427C6.13826 8.30422 5.49884 9.59674 5.50091 10.9673Z" />
        <path d="M14.6549 15.1832C14.15 15.8667 13.3507 16.27 12.5009 16.27C11.6512 16.27 10.8518 15.8667 10.3469 15.1832" />
    </svg>
);

const IconShirt = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3.5 11V14C3.5 17.7712 3.5 19.6569 4.67157 20.8284C5.84315 22 7.72876 22 11.5 22H12.5C16.2712 22 18.1569 22 19.3284 20.8284C20.5 19.6569 20.5 17.7712 20.5 14V11" stroke="currentColor" stroke-width="1.5"></path> <path d="M9.4998 2H14.4998L15.1515 8.51737C15.338 10.382 13.8737 12 11.9998 12C10.1259 12 8.6616 10.382 8.84806 8.51737L9.4998 2Z" stroke="currentColor" stroke-width="1.5"></path> <path d="M3.32975 5.35133C3.50783 4.46093 3.59687 4.01573 3.77791 3.65484C4.15938 2.89439 4.84579 2.33168 5.66628 2.10675C6.05567 2 6.50969 2 7.41771 2H9.50002L8.77549 9.24527C8.61911 10.8091 7.30318 12 5.73155 12C3.8011 12 2.35324 10.2339 2.73183 8.34093L3.32975 5.35133Z" stroke="currentColor" stroke-width="1.5"></path> <path d="M20.6703 5.35133C20.4922 4.46093 20.4031 4.01573 20.2221 3.65484C19.8406 2.89439 19.1542 2.33168 18.3337 2.10675C17.9443 2 17.4903 2 16.5823 2H14.5L15.2245 9.24527C15.3809 10.8091 16.6968 12 18.2685 12C20.1989 12 21.6468 10.2339 21.2682 8.34093L20.6703 5.35133Z" stroke="currentColor" stroke-width="1.5"></path> <path d="M9.5 21.5V18.5C9.5 17.5654 9.5 17.0981 9.70096 16.75C9.83261 16.522 10.022 16.3326 10.25 16.201C10.5981 16 11.0654 16 12 16C12.9346 16 13.4019 16 13.75 16.201C13.978 16.3326 14.1674 16.522 14.299 16.75C14.5 17.0981 14.5 17.5654 14.5 18.5V21.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path> </g>
    </svg>
);

const IconCart = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="17" cy="20" r="1.5" />
        <path d="M3 3h2l2.6 12.4a1 1 0 0 0 1 .6h8.7a1 1 0 0 0 1-.8L20 8H6" />
    </svg>
);

const IconMagnifier = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
    </svg>
);

// BottomBarTwenty: pegada al borde inferior, sin espacios.
// bg-primary en la barra, item activo = pastilla blanca flotante que sobresale.
const BottomBarTwenty = ({ data, cart = [], isUser }) => {
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState("");
    const accountRef = useRef(null);

    // Sincroniza la ruta activa también en navegación SPA (atrás/adelante y
    // visitas desde otros componentes), no solo al montar.
    useEffect(() => {
        const sync = () => {
            try { setCurrentPath(window.location.pathname || ""); } catch { setCurrentPath(""); }
        };
        sync();
        let off;
        try { off = router.on("navigate", sync); } catch { off = null; }
        return () => { if (typeof off === "function") off(); };
    }, []);

    // No mostrar en detalle de producto
    const hideBar = currentPath.includes("/product");

    // Reserva exacta de la altura de la barra para que no tape contenido
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        const apply = () => {
            const hide = window.location.pathname.includes("/product");
            document.body.style.paddingBottom = mq.matches && !hide ? "70px" : "";
        };
        apply();
        if (mq.addEventListener) mq.addEventListener("change", apply);
        return () => {
            document.body.style.paddingBottom = "";
            if (mq.removeEventListener) mq.removeEventListener("change", apply);
        };
    }, [currentPath]);

    useEffect(() => {
        const onEscape = (e) => { if (e.key === "Escape") setIsAccountOpen(false); };
        document.addEventListener("keydown", onEscape);
        return () => document.removeEventListener("keydown", onEscape);
    }, []);

    useEffect(() => {
        const onDown = (e) => {
            if (accountRef.current && !accountRef.current.contains(e.target)) setIsAccountOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("touchstart", onDown);
        return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("touchstart", onDown); };
    }, []);

    const totalCount = cart.reduce((acc, item) => Number(acc) + Number(item.quantity), 0);
    const catalogLink = data?.link_catalog || "/catalogo";

    let isCustomer = false;
    let dashboardUrl = "/admin/home";
    if (isUser && Array.isArray(isUser.roles)) {
        const roleNames = isUser.roles.map((r) => r.name?.toLowerCase());
        isCustomer = !roleNames.includes("admin") && !roleNames.includes("root") && !roleNames.includes("provider");
        if (roleNames.includes("provider")) dashboardUrl = "/provider/home";
    }

    // Mismo menú que HeaderTwenty móvil
    const menuItems = [
        { icon: <User size={16} />, label: "Mi Perfil", href: "/profile" },
        { icon: <ShoppingCart size={16} />, label: "Mis Pedidos", href: "/customer/dashboard" },
        { icon: <Settings size={16} />, label: "Configuración", href: "/account" },
        { icon: <DoorClosed size={16} />, label: "Cerrar Sesión", onClick: Logout },
    ];

    const isActive = (match) => {
        if (match === "home") return currentPath === "/";
        if (match === "catalog") return currentPath.includes("/catalogo");
        if (match === "cart") return currentPath.includes("/cart") || currentPath.includes("/checkout");
        if (match === "account") return ["/profile", "/iniciar-sesion", "/crear-cuenta", "/customer", "/account"].some((r) => currentPath.includes(r));
        return false;
    };

    // Navegación SPA sin recarga: mueve la pastilla al instante (optimista)
    // y viaja con Inertia en vez de recargar todo el documento.
    const navigate = (href) => (e) => {
        if (!href) return;
        // Respetar apertura en pestaña nueva / teclas modificadoras
        if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1)) return;
        try {
            e?.preventDefault();
            const path = new URL(href, window.location.origin).pathname;
            setCurrentPath(path);
            setIsAccountOpen(false);
            if (window.location.pathname !== path) router.visit(href);
        } catch {
            window.location.href = href;
        }
    };

    const handleSearch = () => {
        window.dispatchEvent(new CustomEvent("twenty:open-search"));
        setTimeout(() => {
            if (!document.querySelector("[data-twenty-search-modal]")) {
                try {
                    setCurrentPath(new URL(catalogLink, window.location.origin).pathname);
                    router.visit(catalogLink);
                } catch {
                    window.location.href = catalogLink;
                }
            }
        }, 350);
    };

    const activeHome = isActive("home");
    const activeCatalog = isActive("catalog");
    const activeCart = isActive("cart");
    const activeAccount = isActive("account") || isAccountOpen;

    // ─── Item: sin layoutId (evita el corrimiento lateral). Activo = pastilla ──
    // blanca fija centrada con flex, que sobresale por arriba sin mover la grilla.
    const BarTab = ({ active, label, href, onClick, ariaLabel, badge, children }) => {
        const inner = (
            <span className="relative flex flex-col items-center justify-end w-full min-w-0 h-[70px] pb-[10px]">
                {/* Zona fija del icono: misma altura siempre para que nada se mueva */}
                <span className="relative flex items-start justify-center w-full h-[34px]">
                    {active ? (
                        <motion.span
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 480, damping: 28 }}
                            className="absolute -top-[30px] w-[56px] h-[56px] rounded-full bg-white text-primary flex items-center justify-center shrink-0 shadow-[0_10px_28px_rgba(0,0,0,0.35),0_0_0_5px_rgba(255,255,255,0.12)]"
                        >
                            <span className="relative flex items-center justify-center">
                                {children}
                                {badge > 0 && (
                                    <span className="absolute -top-2 -right-3 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white leading-none">
                                        {badge > 99 ? "99+" : badge}
                                    </span>
                                )}
                            </span>
                        </motion.span>
                    ) : (
                        <motion.span
                            whileTap={{ scale: 0.8 }}
                            className="flex items-center justify-center h-[26px] text-white/60 shrink-0"
                        >
                            <span className="relative flex items-center justify-center">
                                {children}
                                {badge > 0 && (
                                    <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-primary text-[9px] font-black flex items-center justify-center leading-none">
                                        {badge > 99 ? "99+" : badge}
                                    </span>
                                )}
                            </span>
                        </motion.span>
                    )}
                </span>
                <span className={`mt-1 text-[10px] leading-none tracking-wide truncate max-w-full ${active ? "text-white font-bold" : "text-white/55 font-medium"}`}>
                    {label}
                </span>
            </span>
        );

        const cls = "relative flex w-full min-w-0 flex-col items-center focus-visible:outline-none";
        if (href) return <a href={href} onClick={onClick} className={cls} aria-label={ariaLabel || label}>{inner}</a>;
        return <button type="button" onClick={onClick} className={cls} aria-label={ariaLabel || label}>{inner}</button>;
    };

    // ─── Icono de cuenta: mismo ProfileImage del HeaderTwenty ─────────────────
    // Header usa: className="!w-6 !h-6 rounded-full object-cover border border-white/70"
    //             classCircleUser="text-white border-white"
    // Aquí se adapta el color según estado (inactivo = sobre bg-primary → blanco,
    // activo = dentro de pastilla blanca → primary) para que siempre se vea.
    const AccountIcon = ({ active }) => {
        if (isUser?.uuid) {
            return (
                <ProfileImage
                    uuid={isUser.uuid}
                    name={isUser.name}
                    lastname={isUser.lastname}
                    className={active
                        ? "!w-6 !h-6 rounded-full object-cover"
                        : "!w-6 !h-6 rounded-full object-cover border border-white/70"}
                    classCircleUser={active ? "!w-6 !h-6 text-primary" : "!w-6 !h-6 text-white border-white"}
                />
            );
        }
        return <CircleUser size={24} className={active ? "text-primary" : "text-white"} strokeWidth={2} />;
    };

    // ─── Mismo dropdown que HeaderTwenty móvil, solo cambia la posición ─────────
    // Header: absolute top-full right-0 (abre hacia abajo).
    // BottomBar: absolute bottom-full right-0 (abre hacia arriba).
    // Mismo bg-primary, texto blanco, iconos y opciones.
    const renderAccountMenu = () => (
        <AnimatePresence>
            {isAccountOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute z-[100] bottom-full right-1 border border-white/15 shadow-2xl mb-3 w-52 max-w-[70vw] rounded-2xl bg-primary text-white overflow-hidden"
                >
                    <div className="p-3">
                        <ul className="space-y-2">
                            {isCustomer ? (
                                menuItems.map((item, index) => (
                                    <li key={index}>
                                        {item.onClick ? (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setIsAccountOpen(false);
                                                    setTimeout(() => item.onClick(), 150);
                                                }}
                                                className="flex w-full items-center gap-3 text-sm p-2 rounded-xl text-white/85 hover:bg-white/10 hover:text-white transition-all duration-300"
                                            >
                                                {item.icon}<span>{item.label}</span>
                                            </button>
                                        ) : (
                                            <a
                                                href={item.href}
                                                onClick={navigate(item.href)}
                                                className="flex items-center gap-3 text-sm p-2 rounded-xl text-white/85 hover:bg-white/10 hover:text-white transition-all duration-300"
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
                                            onClick={navigate(dashboardUrl)}
                                            className="flex items-center gap-3 text-sm p-2 rounded-xl text-white/85 hover:bg-white/10 hover:text-white transition-all duration-300"
                                        >
                                            <Home size={16} /><span>Dashboard</span>
                                        </a>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setIsAccountOpen(false);
                                                setTimeout(() => Logout(), 150);
                                            }}
                                            className="flex w-full items-center gap-3 text-sm p-2 rounded-xl text-white/85 hover:bg-white/10 hover:text-white transition-all duration-300"
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
    );

    // Oculta en /product/...
    if (hideBar) return null;

    return (
        <nav
            aria-label="Navegación móvil"
            className="fixed bottom-0 left-0 right-0 z-[90] md:hidden"
        >
            {/* Barra pegada: sin márgenes, sin redondeo, bg-primary */}
            <div
                className="bg-primary border-t border-white/15 overflow-visible"
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                <div className="grid grid-cols-4 w-full overflow-visible">
                    <BarTab active={activeHome} label="Inicio" href="/" onClick={navigate("/")} ariaLabel="Inicio">
                        <IconHouse size={32} />
                    </BarTab>

                    <BarTab active={false} label="Buscar" onClick={handleSearch} ariaLabel="Buscar">
                        <IconMagnifier size={28} />
                    </BarTab>

                    <BarTab active={activeCatalog} label="Tienda" href={catalogLink} onClick={navigate(catalogLink)} ariaLabel="Tienda">
                        <IconShirt size={28} />
                    </BarTab>
                    {/* Carrito va a /cart, no abre modal */}
                    <BarTab active={activeCart} label="Carrito" href="/cart" onClick={navigate("/cart")} ariaLabel="Carrito" badge={totalCount}>
                        <IconCart size={32} />
                    </BarTab>

                    {/*
                       <div ref={accountRef} className="relative flex w-full min-w-0 flex-col">
                        {renderAccountMenu()}
                        {isUser ? (
                            <BarTab active={activeAccount} label="Cuenta" onClick={() => setIsAccountOpen(!isAccountOpen)} ariaLabel="Mi cuenta">
                                <AccountIcon active={activeAccount} />
                            </BarTab>
                        ) : (
                            <BarTab active={activeAccount} label="Cuenta" href="/iniciar-sesion" onClick={navigate("/iniciar-sesion")} ariaLabel="Iniciar sesión">
                                <AccountIcon active={activeAccount} />
                            </BarTab>
                        )}
                    </div>
                     */}

                </div>
            </div>
        </nav>
    );
};

export default BottomBarTwenty;
