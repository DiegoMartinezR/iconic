import React, { useEffect, useRef, useState } from "react";
import {
    ShoppingCart,
    Store,
    Home,
    Phone,
    CircleUserRound,
    ChevronDown,
    CheckSquare,
    Plus,
    ChevronUp,
    CircleCheckIcon,
    ChevronLeft,
    Share2,
    CheckCircle2,
    ChevronRight,
    Truck,
    X,
    ZoomIn,
    Quote,
} from "lucide-react";
import ItemsRest from "../../../Actions/ItemsRest";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Pagination, Thumbs, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import General from "../../../Utils/General";
import ReactModal from "react-modal";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import CartModalSelector from "../Components/CartModalSelector";
import ProductSwiperTwenty from "../Products/ProductSwiperTwenty";
import { usePageContext } from "../../../Contexts/PageContext";

// Fly-to-Cart: creates a DOM element and moves it along a bezier curve
// using requestAnimationFrame. Zero dependencies, zero CSS injection.
const flyToCart = (originRect, destRect, imageUrl, onDone) => {
    if (!originRect || !destRect) { onDone(); return; }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x0 = originRect.left + originRect.width / 2;
    const y0 = originRect.top + originRect.height / 2;
    const x1 = destRect.left + destRect.width / 2;
    const y1 = destRect.top + destRect.height / 2;
    const dist = Math.hypot(x1 - x0, y1 - y0);
    if (dist < 20) { onDone(); return; }

    // Control point: arc above the midpoint.
    const cpx = (x0 + x1) / 2;
    const cpy = Math.min(y0, y1) - Math.min(150, dist * 0.2);

    // Build element.
    const el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = `
        position:fixed; z-index:99999; pointer-events:none;
        width:64px; height:64px; border-radius:50%;
        left:0; top:0; will-change:transform;
        box-shadow:0 8px 28px rgba(0,0,0,0.35);
        border:2px solid #fff; background:#111;
        transition:none;
    `;

    if (imageUrl) {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.draggable = false;
        img.style.cssText = "width:100%;height:100%;border-radius:50%;object-fit:cover;";
        img.onerror = () => img.remove();
        el.appendChild(img);
    } else {
        el.innerHTML = '<svg style="margin:22px" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
    }

    document.body.appendChild(el);

    const DURATION = Math.max(700, Math.min(1200, dist * 1.2));
    const start = performance.now();

    const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (now) => {
        const elapsed = now - start;
        const raw = Math.min(elapsed / DURATION, 1);
        const t = ease(raw);

        // Quadratic bezier interpolation.
        const u = 1 - t;
        const cx = u * u * x0 + 2 * u * t * cpx + t * t * x1;
        const cy = u * u * y0 + 2 * u * t * cpy + t * t * y1;

        // Scale: small → full → tiny.
        const scale = raw < 0.12 ? 0.5 + raw * 4.17 : 1 - raw * 0.88;
        // Opacity: fade in fast, fade out at end.
        const opacity = raw > 0.78 ? Math.max(0, 1 - (raw - 0.78) / 0.22) : (raw < 0.08 ? raw * 12.5 : 1);

        el.style.left = cx + "px";
        el.style.top = cy + "px";
        el.style.transform = `translate(-50%,-50%) scale(${scale})`;
        el.style.opacity = opacity;

        if (raw < 1) {
            requestAnimationFrame(tick);
        } else {
            el.remove();
            onDone();
        }
    };

    requestAnimationFrame(tick);
};

const WhatsAppIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
    </svg>
);

// Ordena los valores de un atributo según su configuración (sort_order).
// Soporta texto (A-Z / Z-A con orden natural), números (mayor/menor)
// y lista personalizada (custom_order del atributo).
const sortAttributeValues = (values, sortOrder, customOrder) => {
    const list = [...values];
    const toNumber = (v) => {
        const n = parseFloat(v);
        return Number.isNaN(n) ? null : n;
    };
    switch (sortOrder) {
        case "asc":
            return list.sort((a, b) =>
                String(a.value).localeCompare(String(b.value), "es", { numeric: true, sensitivity: "base" }),
            );
        case "desc":
            return list.sort((a, b) =>
                String(b.value).localeCompare(String(a.value), "es", { numeric: true, sensitivity: "base" }),
            );
        case "numeric_asc":
            return list.sort((a, b) => {
                const na = toNumber(a.value);
                const nb = toNumber(b.value);
                if (na === null && nb === null) return 0;
                if (na === null) return 1;
                if (nb === null) return -1;
                return na - nb;
            });
        case "numeric_desc":
            return list.sort((a, b) => {
                const na = toNumber(a.value);
                const nb = toNumber(b.value);
                if (na === null && nb === null) return 0;
                if (na === null) return 1;
                if (nb === null) return -1;
                return nb - na;
            });
        case "custom": {
            const order = (Array.isArray(customOrder) ? customOrder : [])
                .map((v) => String(v).trim().toLowerCase());
            if (order.length === 0) return list;
            const rank = (v) => {
                const idx = order.indexOf(String(v?.value ?? "").trim().toLowerCase());
                return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
            };
            return list.sort((a, b) => rank(a) - rank(b));
        }
        default:
            return list;
    }
};

const getVariantAttributes = (v) => {
    if (!v) return [];
    const vAttrs = Array.isArray(v.attributes)
        ? [...v.attributes]
        : Object.values(v.attributes || {});

    if (v.color && !vAttrs.some((a) => (a.name || a.slug || "").toLowerCase() === "color")) {
        vAttrs.push({ name: "Color", value: v.color });
    }
    if ((v.size || v.talla) && !vAttrs.some((a) => ["size", "talla"].includes((a.name || a.slug || "").toLowerCase()))) {
        vAttrs.push({ name: "Talla", value: v.size || v.talla });
    }
    if (v.texture && !vAttrs.some((a) => (a.name || a.slug || "").toLowerCase() === "textura")) {
        vAttrs.push({ name: "Textura", value: v.texture });
    }
    return vAttrs;
};

const ProductDetailTwenty = ({
    item,
    data,
    setCart,
    cart,
    generals,
    favorites,
    setFavorites,
    onViewUpdate,
}) => {
    const pageCtx = usePageContext();
    const itemsRest = new ItemsRest();
    const [quantity, setQuantity] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedSpecificationMain, setExpanded] = useState(false);
    const [isAdvisorDropdownOpen, setIsAdvisorDropdownOpen] = useState(false);
    const [whatsappAction, setWhatsappAction] = useState("consult"); // 'consult' o 'quote'
    const [deliveryPolicyModalOpen, setDeliveryPolicyModalOpen] =
        useState(false);
    const [variantsForSelectedGroup, setVariantsForSelectedGroup] = useState(
        [],
    );
    const [isLoadingVariants, setIsLoadingVariants] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(item);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [showAllSpecs, setShowAllSpecs] = useState(false);
    const [relationsItems, setRelationsItems] = useState([]);
    const [isAddedToCart, setIsAddedToCart] = useState(false);

    useEffect(() => {
        pageCtx?.setHideFloatingWhatsApp?.(true);
        return () => {
            pageCtx?.setHideFloatingWhatsApp?.(false);
        };
    }, []);
    useEffect(() => {
        if (selectedVariant?.slug) {
            const segments = window.location.pathname.split("/").filter(Boolean);
            if (segments.length >= 2) {
                const prefix = segments[0];
                const newPath = `/${prefix}/${selectedVariant.slug}`;
                if (window.location.pathname !== newPath) {
                    window.history.replaceState(null, "", newPath);
                }
            } else if (window.location.pathname !== `/product/${selectedVariant.slug}`) {
                window.history.replaceState(null, "", `/product/${selectedVariant.slug}`);
            }
        }

        if (selectedVariant) {
            const maxQty = selectedVariant.stock_unlimited ? 99 : (selectedVariant.stock || 0);
            if (maxQty <= 0) {
                setQuantity(0);
            } else if (quantity > maxQty) {
                setQuantity(maxQty);
            } else if (quantity === 0) {
                setQuantity(1);
            }
        }
    }, [selectedVariant?.id, selectedVariant?.slug]);

    const productosRelacionados = async (item) => {
        try {
            const request = {
                id: item?.id,
                related_filter: data?.related_filter || 'category',
                related_limit: data?.related_limit || 10,
                is_master: 1
            };
            const response = await itemsRest.productsRelations(request);
            if (!response) return;
            setRelationsItems(Object.values(response).filter((x) => x.is_master));
        } catch (error) {
            return;
        }
    };

    // Zoom State
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZoomEnabled, setIsZoomEnabled] = useState(false);
    const [activeImage, setActiveImage] = useState(null);
    const imageRef = useRef(null);
    const mobileImageRef = useRef(null);

    const launchFlight = (product, btnEl) => {
        try {
            if (typeof window === "undefined") return;
            if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
                window.dispatchEvent(new CustomEvent("twenty:cart-bump"));
                return;
            }

            // Origin: the button that was clicked.
            let originRect = null;
            try {
                if (btnEl) originRect = btnEl.getBoundingClientRect();
            } catch { /* noop */ }
            if (!originRect || originRect.width <= 0) {
                try {
                    const vw = window.innerWidth;
                    const imgEl = vw < 768 ? mobileImageRef.current : imageRef.current;
                    originRect = imgEl?.getBoundingClientRect?.();
                } catch { /* noop */ }
            }
            if (!originRect || originRect.width <= 0) {
                window.dispatchEvent(new CustomEvent("twenty:cart-bump"));
                return;
            }

            // Destination: cart icon in header.
            let destRect = null;
            try {
                const els = document.querySelectorAll("[data-twenty-cart-target]");
                for (let i = 0; i < els.length; i++) {
                    const r = els[i].getBoundingClientRect();
                    if (r.width > 0 && r.height > 0) { destRect = r; break; }
                }
            } catch { /* noop */ }
            if (!destRect) {
                window.dispatchEvent(new CustomEvent("twenty:cart-bump"));
                return;
            }

            // Image URL.
            const rawImg = activeImage?.url || activeImage || product?.image;
            const imgName = rawImg?.url || rawImg;
            const imageUrl = imgName ? `/storage/images/item/${imgName}` : null;

            // Launch the fly.
            flyToCart(originRect, destRect, imageUrl, () => {
                window.dispatchEvent(new CustomEvent("twenty:cart-bump"));
            });
        } catch {
            window.dispatchEvent(new CustomEvent("twenty:cart-bump"));
        }
    };

    // Merge parent item's brand/category as fallback — child variants often
    // don't carry these fields, causing them to flash and disappear.
    const currentProduct = selectedVariant
        ? {
            ...selectedVariant,
            brand: selectedVariant.brand || item?.brand,
            category: selectedVariant.category || item?.category,
        }
        : item;
    const advisors = General.whatsapp_advisors || [];

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: currentProduct?.name,
                    text: currentProduct?.description?.replace(/<[^>]*>/g, ""),
                    url: window.location.href,
                })
                .catch(() => {
                    // Fallback
                });
        } else {
            navigator.clipboard.writeText(window.location.href);
            Swal.fire({
                title: "Enlace copiado",
                text: "El enlace del producto ha sido copiado al portapapeles.",
                icon: "success",
                confirmButtonText: "Entendido",
                customClass: {
                    popup: "rounded-3xl border border-white/15 bg-primary text-white uppercase text-xs",
                    confirmButton:
                        "rounded-full border border-white bg-white text-primary hover:bg-white/90 transition-all  text-xs py-2 px-4",
                },
            });
        }
    };

    const handleWhatsAppClick = (actionType) => {
        setWhatsappAction(actionType);
        const message = actionType === "quote"
            ? `¡Hola! Me gustaría cotizar este producto: ${currentProduct?.name}\n\nCantidad: ${quantity} unidades\n\n¿Podrían enviarme más información y precios?`
            : `¡Hola! Tengo dudas sobre: ${currentProduct?.name}`;

        if (advisors && advisors.length > 1) {
            setIsAdvisorDropdownOpen(true);
        } else {
            const defaultPhone = generals?.find(
                (g) => g.correlative === "phone_whatsapp"
            )?.description;
            const phone = advisors?.[0]?.phone || defaultPhone;
            if (phone) {
                window.open(
                    `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`,
                    "_blank"
                );
            } else {
                Swal.fire({
                    title: "WhatsApp no disponible",
                    text: "No se ha configurado un número de contacto.",
                    icon: "warning",
                    confirmButtonColor: "#000000",
                    customClass: {
                        popup: "rounded-3xl border border-white/15 bg-primary text-white uppercase text-xs",
                        confirmButton: "rounded-full border border-white bg-white text-primary hover:bg-white/90 transition-all  text-xs py-2 px-4"
                    }
                });
            }
        }
    };

    const deliveryPolicy =
        generals?.find((g) => g.correlative === "delivery_policy")
            ?.description || "Políticas de envío no disponibles.";

    useEffect(() => {
        if (currentProduct?.image) {
            setActiveImage(currentProduct.image);
        }
    }, [currentProduct?.id]);

    useEffect(() => {
        if (item?.id) {
            productosRelacionados(item);
            setSelectedVariant(item);

            // Notifica la vista del producto al padre
            if (onViewUpdate) onViewUpdate(item);

            const initialVariants = Array.from(
                new Map([item, ...(item.variants || [])].map((v) => [v.id, v])).values()
            );
            setVariantsForSelectedGroup(initialVariants);

            const initialAttributes = {};
            const itemAttrs = getVariantAttributes(item);

            if (itemAttrs.length > 0) {
                itemAttrs.forEach((attr) => {
                    const attrName = attr.name || attr.slug;
                    const value = attr.pivot?.value || attr.value;
                    if (value) {
                        initialAttributes[attrName] = {
                            value,
                            itemId: item.id,
                            item: item,
                        };
                    }
                });
            }
            setSelectedAttributes(initialAttributes);

            if (item.agrupador) {
                setIsLoadingVariants(true);
                fetch(`/api/items/variants/${item.agrupador}`)
                    .then((res) => res.json())
                    .then((data) => {
                        const variantsData = Array.isArray(data)
                            ? data
                            : Object.values(data || {});
                        const allVariants = [item, ...(item.variants || []), ...variantsData];
                        const uniqueVariants = Array.from(
                            new Map(allVariants.map((v) => [v.id, v])).values(),
                        );
                        setVariantsForSelectedGroup(uniqueVariants);

                        const sellableVariants = uniqueVariants.filter(
                            (v) => !v.is_master && v.id !== item.id,
                        );

                        if (sellableVariants.length > 0 && item.is_master) {
                            const first = sellableVariants[0];
                            setSelectedVariant(first);
                            const newAttrs = {};
                            const firstAttrs = getVariantAttributes(first);

                            if (firstAttrs.length > 0) {
                                firstAttrs.forEach((a) => {
                                    const aName = a.name || a.slug;
                                    const aVal = a.pivot?.value || a.value;
                                    if (aVal) {
                                        newAttrs[aName] = {
                                            value: aVal,
                                            itemId: first.id,
                                            item: first,
                                        };
                                    }
                                });
                            }
                            setSelectedAttributes(newAttrs);
                        }
                    })
                    .catch((err) => {
                        console.error("ProductDetailTwenty: Error fetching variants:", err);
                    })
                    .finally(() => setIsLoadingVariants(false));
            }
        }
    }, [item]);

    const onAddClicked = (product, btnEl) => {
        const hasMultipleVariants = variantsForSelectedGroup.length > 1;
        const totalRequiredAttributes = group?.allAttributes?.length || 0;
        const totalSelectedAttributes = Object.keys(selectedAttributes).length;

        if (
            (hasMultipleVariants &&
                (totalSelectedAttributes < totalRequiredAttributes ||
                    (item.is_master && product.id === item.id))) ||
            product.is_master
        ) {
            Swal.fire({
                title: "Seleccione las opciones",
                text: "Por favor, seleccione todas las opciones disponibles (color, talla, etc.) antes de continuar.",
                icon: "info",
                confirmButtonColor: "#000000",
                customClass: {
                    popup: "rounded-3xl border border-white/15 bg-primary text-white uppercase text-xs",
                    confirmButton:
                        "rounded-full border border-white bg-white text-primary hover:bg-white/90 transition-all  text-xs py-2 px-4",
                },
            });
            return;
        }

        if (!product.stock_unlimited) {
            const currentStock = product.stock || 0;
            if (currentStock <= 0) {
                Swal.fire({
                    title: "Producto Agotado",
                    text: "Este producto se encuentra agotado.",
                    icon: "warning",
                    confirmButtonColor: "#000000"
                });
                return;
            }
            if (currentStock < quantity) {
                Swal.fire({
                    title: "Stock Insuficiente",
                    text: `No hay suficiente stock disponible. Stock disponible: ${currentStock}`,
                    icon: "warning",
                    confirmButtonColor: "#000000"
                });
                return;
            }
        }

        const newCart = [...cart];
        const index = newCart.findIndex((x) => x.id === product.id);
        if (index === -1) {
            newCart.push({ ...product, quantity });
        } else {
            if (!product.stock_unlimited) {
                const currentStock = product.stock || 0;
                const newQty = newCart[index].quantity + quantity;
                if (newQty > currentStock) {
                    Swal.fire({
                        title: "Stock Insuficiente",
                        text: `No puedes agregar más de este producto. Stock total disponible: ${currentStock}. Ya tienes ${newCart[index].quantity} en el carrito.`,
                        icon: "warning",
                        confirmButtonColor: "#000000"
                    });
                    return;
                }
            }
            newCart[index].quantity += quantity;
        }
        setCart(newCart);
        // Fly-to-Cart: el carrito ya se actualizó; el vuelo es decorativo.
        launchFlight(product, btnEl);
        // setModalOpen(true);
        setIsAddedToCart(true);
        setTimeout(() => {
            setIsAddedToCart(false);
        }, 2200);
        /*setTimeout(() => {
            setModalOpen(false);
        }, 1200);*/
    };

    const handleAttributeSelect = (attrName, valueData) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [attrName]: valueData,
        }));
        if (valueData.item) {
            setSelectedVariant(valueData.item);
        }
    };

    const isValueAvailable = (attrName, valueToCheck, group) => {
        return group.variants.some((variant) => {
            const variantAttrs = getVariantAttributes(variant);

            const hasThisValue = variantAttrs?.some((attr) => {
                const name = attr.name || attr.slug;
                const value = attr.pivot?.value || attr.value;
                return name === attrName && value === valueToCheck;
            });

            if (!hasThisValue) return false;

            for (const [selectedAttrName, selectedValueData] of Object.entries(
                selectedAttributes,
            )) {
                if (selectedAttrName === attrName) continue;
                const hasSelectedAttr = variantAttrs?.some((attr) => {
                    const name = attr.name || attr.slug;
                    const value = attr.pivot?.value || attr.value;
                    return (
                        name === selectedAttrName &&
                        value === selectedValueData.value
                    );
                });
                if (!hasSelectedAttr) return false;
            }
            return true;
        });
    };

    const findBestMatchingVariant = (attrName, valueData, group) => {
        const candidates = group.variants.filter((v) => {
            const vAttrs = getVariantAttributes(v);
            return vAttrs?.some(
                (a) =>
                    (a.name || a.slug) === attrName &&
                    (a.pivot?.value || a.value) === valueData.value,
            );
        });

        if (candidates.length === 0) return null;

        const scoredCandidates = candidates.map((v) => {
            let score = 0;
            const vAttrs = getVariantAttributes(v);

            Object.entries(selectedAttributes).forEach(([selName, selData]) => {
                if (selName === attrName) return;
                const matches = vAttrs?.some(
                    (a) =>
                        (a.name || a.slug) === selName &&
                        (a.pivot?.value || a.value) === selData.value,
                );
                if (matches) score++;
            });
            return { variant: v, score };
        });

        scoredCandidates.sort((a, b) => b.score - a.score);
        return scoredCandidates[0].variant;
    };

    const handleZoomClick = (e) => {
        if (!isZoomEnabled && e && imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomPosition({
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y)),
            });
        }
        setIsZoomEnabled(!isZoomEnabled);
    };

    const handleMouseMove = (e) => {
        if (!isZoomEnabled) return;
        if (imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomPosition({
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y)),
            });
        }
    };

    const handleMouseLeave = () => {
        setIsZoomEnabled(false);
    };

    const group =
        variantsForSelectedGroup.length > 0
            ? {
                variants: variantsForSelectedGroup,
                allAttributes: Array.from(
                    new Set(
                        variantsForSelectedGroup.flatMap((v) => {
                            const vAttrs = getVariantAttributes(v);
                            return vAttrs.map((a) => a.name || a.slug);
                        }),
                    ),
                ).map((name) => {
                    const values = [];
                    variantsForSelectedGroup.forEach((v) => {
                        const vAttrs = getVariantAttributes(v);
                        const attr = vAttrs.find(
                            (a) => (a.name || a.slug) === name,
                        );
                        if (attr) {
                            const value = attr.pivot?.value || attr.value;
                            if (!values.find((val) => val.value === value)) {
                                values.push({ value, itemId: v.id, item: v });
                            }
                        }
                    });
                    const attributeModel = variantsForSelectedGroup
                        .map((v) => getVariantAttributes(v))
                        .flat()
                        .find((a) => (a.name || a.slug) === name);
                    return {
                        name,
                        attribute: attributeModel,
                        values: sortAttributeValues(values, attributeModel?.sort_order, attributeModel?.custom_order),
                    };
                }),
            }
            : null;

    const twentySectionTitleClass =
        "text-xl md:text-2xl font-black uppercase text-white border-b border-white/10 pb-4 mb-6 flex items-center justify-between";
    const twentyButtonClass =
        "w-full py-4 text-sm uppercase font-bold transition-all duration-300 rounded-full active:scale-[0.98]";
    const twentyPrimaryBtn = `${twentyButtonClass} bg-white text-primary hover:bg-white/90 border border-white shadow-lg`;
    const twentySecondaryBtn = `${twentyButtonClass} border border-white/20 bg-white/5 text-white hover:border-white/50 hover:bg-white/10`;
    const twentyWhatsappBtn = `${twentyButtonClass} bg-success text-black hover:bg-success/90 flex items-center justify-center gap-2 font-bold`;
    const hasValidPrice =
        (currentProduct?.final_price && parseFloat(currentProduct.final_price) > 0) ||
        (currentProduct?.price && parseFloat(currentProduct.price) > 0);

    const generalSpecifications = (
        Array.isArray(currentProduct?.specifications) &&
            currentProduct.specifications.length > 0
            ? currentProduct.specifications
            : Array.isArray(item?.specifications)
                ? item.specifications
                : []
    ).filter((s) => s.type === "general" || !s.type);

    return (
        <main className="bg-primary min-h-screen text-white pt-2 md:pt-16 ">
            {/* Custom Swiper Pagination Styles for Twenty theme */}
            <style>{`
                .product-twenty-swiper .swiper-pagination {
                    bottom: 12px !important;
                }
                .product-twenty-swiper .swiper-pagination-bullet {
                    background: #ffffff !important;
                    opacity: 0.35;
                    transition: all 0.3s ease;
                    border-radius: 0px !important;
                    width: 8px;
                    height: 3px;
                    margin: 0 3px !important;
                }
                .product-twenty-swiper .swiper-pagination-bullet-active {
                    opacity: 1 !important;
                    background: #ffffff !important;
                    width: 24px;
                    border-radius: 0px !important;
                }
            `}</style>
            <div className=" px-primary 2xl:px-0 mx-auto 2xl:max-w-7xl">
                {/* Desktop View */}
                <article
                    itemScope={true}
                    itemType="https://schema.org/Product"
                    className="hidden md:grid grid-cols-12 gap-8 lg:gap-12"
                >
                    {/* Left Column: Images */}
                    <div className="col-span-12 lg:col-span-7 flex gap-6">
                        {/* Gallery Thumbnails */}
                        <div className="w-20 space-y-4 shrink-0">
                            {[
                                currentProduct?.image,
                                ...(Array.isArray(currentProduct?.images)
                                    ? currentProduct.images
                                    : Object.values(
                                        currentProduct?.images || {},
                                    )),
                            ]
                                .filter((img, idx, self) => {
                                    const url = img?.url || img;
                                    return (
                                        url &&
                                        self.findIndex(
                                            (i) => (i?.url || i) === url,
                                        ) === idx
                                    );
                                })
                                .map((img, i) => {
                                    const imgUrl = img?.url || img;
                                    const isActive =
                                        (activeImage?.url || activeImage) ===
                                        imgUrl;
                                    return (
                                        <div
                                            key={i}
                                            role="button"
                                            aria-label={`Ver imagen ${i + 1} de ${currentProduct?.name || 'producto'}`}
                                            onClick={() =>
                                                setActiveImage(imgUrl)
                                            }
                                            className={`aspect-square border p-1 bg-white/5 cursor-pointer transition-all rounded-xl ${isActive ? "border-white" : "border-white/10 hover:border-white/40"}`}
                                        >
                                            <img
                                                src={`/storage/images/item/${imgUrl}`}
                                                alt={`${currentProduct?.name || item?.name || 'Producto'} - Vista ${i + 1}`}
                                                className="w-full h-full object-contain object-top"
                                                onError={(e) =>
                                                    (e.target.src = "/api/cover/thumbnail/null")
                                                }
                                            />
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Main Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 border aspect-square max-h-min border-white/10 p-2 bg-white/5 overflow-hidden relative rounded-3xl hover:border-white/30 transition-colors duration-500"
                        >
                            <div
                                ref={imageRef}
                                className="aspect-square bg-white/5 cursor-zoom-in relative overflow-hidden rounded-2xl"
                                onClick={handleZoomClick}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={
                                            activeImage?.url ||
                                            activeImage ||
                                            currentProduct?.image
                                        }
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: 1,
                                            scale: isZoomEnabled ? 1.5 : 1,
                                        }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeInOut",
                                        }}
                                        src={`/storage/images/item/${activeImage?.url || activeImage || currentProduct?.image}`}
                                        alt={currentProduct?.name || item?.name || "Imagen principal del producto"}
                                        itemProp="image"
                                        className="w-full h-full object-contain object-top"
                                        style={
                                            isZoomEnabled
                                                ? {
                                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                }
                                                : {}
                                        }
                                        onError={(e) =>
                                            (e.target.src = "/api/cover/thumbnail/null")
                                        }
                                    />
                                </AnimatePresence>

                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    {!isZoomEnabled && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShare();
                                            }}
                                            className="bg-primary/80 text-white p-3 hover:bg-white hover:text-primary transition-all border border-white/10 rounded-full"
                                        >
                                            <Share2 className="w-5 h-5 stroke-[1.5]" />
                                        </button>
                                    )}
                                    {!isZoomEnabled && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setZoomPosition({ x: 50, y: 50 });
                                                setIsZoomEnabled(true);
                                            }}
                                            className="bg-white text-primary p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            <ZoomIn className="w-5 h-5 stroke-[1.5]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Info */}
                    <section className="col-span-12 lg:col-span-5 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="space-y-3">
                                <span itemProp="brand" itemScope={true} itemType="https://schema.org/Brand" className="text-xs  uppercase  text-white/50 block">
                                    <span itemProp="name">{currentProduct?.brand?.name ||
                                        currentProduct?.category?.name}</span>
                                </span>
                                <h1 itemProp="name" className={`text-4xl lg:text-6xl font-black  text-white ${data?.class_title || ""}`}>
                                    <TextWithHighlight
                                        text={currentProduct?.name}
                                        className="font-black"

                                    />
                                </h1>
                                <p className="text-xs   text-white/40">
                                    SKU: <span itemProp="sku">{currentProduct?.sku}</span>
                                </p>
                            </div>

                            <div itemProp="offers" itemScope={true} itemType="https://schema.org/Offer" className="flex items-center gap-6 py-2 border-y border-white/10">
                                <meta itemProp="priceCurrency" content="PEN" />
                                <link itemProp="availability" href={(currentProduct?.stock_unlimited || currentProduct?.stock > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
                                <span className="text-4xl lg:text-5xl font-black text-white">
                                    {CurrencySymbol()}{" "}
                                    <span itemProp="price" content={currentProduct?.final_price || currentProduct?.price}>{currentProduct?.final_price}</span>
                                </span>
                                {currentProduct?.price >
                                    currentProduct?.final_price && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg text-white line-through  ">
                                                {CurrencySymbol()}{" "}
                                                {currentProduct?.price}
                                            </span>
                                            <span className="text-xs bg-white text-primary font-bold px-2.5 py-1 rounded-full">
                                                -{Number(currentProduct?.discount_percent).toFixed(0)}% OFF
                                            </span>
                                        </div>
                                    )}
                            </div>

                            {/* Variants Selection */}
                            {isLoadingVariants ? (
                                <div className="flex items-center gap-2 text-xs  uppercase  animate-pulse text-white/50">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                    Actualizando Variantes...
                                </div>
                            ) : (
                                group?.allAttributes?.length > 0 && (
                                    <div className="space-y-6">
                                        {group.allAttributes.map((attrData) => (
                                            <div
                                                key={attrData.name}
                                                className="space-y-3"
                                            >
                                                <h3 className="text-xs  uppercase  text-white/50">
                                                    {attrData.name}
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {attrData.values.map(
                                                        (val, idx) => {
                                                            const isSelected =
                                                                selectedAttributes[
                                                                    attrData.name
                                                                ]?.value === val.value;
                                                            const isAvailable =
                                                                attrData.attribute?.is_parent ||
                                                                isValueAvailable(
                                                                    attrData.name,
                                                                    val.value,
                                                                    group,
                                                                );
                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    disabled={!isAvailable}
                                                                    onClick={() => {
                                                                        const matching =
                                                                            findBestMatchingVariant(
                                                                                attrData.name,
                                                                                val,
                                                                                group,
                                                                            );
                                                                        if (matching) {
                                                                            setSelectedVariant(matching);
                                                                            const newAttrs = {};
                                                                            getVariantAttributes(matching).forEach((a) => {
                                                                                newAttrs[a.name || a.slug] = {
                                                                                    value: a.pivot?.value || a.value,
                                                                                    item: matching,
                                                                                };
                                                                            });
                                                                            setSelectedAttributes(newAttrs);
                                                                        } else {
                                                                            handleAttributeSelect(attrData.name, val);
                                                                        }
                                                                    }}
                                                                    className={`px-4 py-2.5 rounded-full text-xs uppercase transition-all border
                                                                        ${isSelected ? "bg-white text-primary border-white shadow" : isAvailable ? "bg-white/5 text-white border-white/20 hover:border-white/50" : "bg-white/5 text-white/25 border-white/10 cursor-not-allowed line-through opacity-60"}
                                                                    `}
                                                                >
                                                                    {val.value}
                                                                </button>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}

                            {/* Purchase Actions */}
                            <div className="space-y-6 pt-4">
                                {hasValidPrice && (
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <span className="text-xs  uppercase  text-white/60">
                                            Cantidad
                                        </span>
                                        <div className="flex items-center gap-6 border border-white/15 rounded-full px-4 py-1.5">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="text-lg font-bold hover:text-white/60 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="text-sm w-4 text-center text-white">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    const maxQty = currentProduct?.stock_unlimited ? 99 : (currentProduct?.stock || 0);
                                                    setQuantity(Math.min(maxQty, quantity + 1));
                                                }}
                                                className="text-lg font-bold hover:text-white/60 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {(() => {
                                    const hasMultipleVariants = variantsForSelectedGroup.length > 1;
                                    const totalRequiredAttributes = group?.allAttributes?.length || 0;
                                    const totalSelectedAttributes = Object.keys(selectedAttributes).length;
                                    const isFullySelected = !(
                                        (hasMultipleVariants &&
                                            (totalSelectedAttributes < totalRequiredAttributes ||
                                                (item.is_master && currentProduct.id === item.id))) ||
                                        currentProduct.is_master
                                    );

                                    const showBuy = data?.buyButton !== false && hasValidPrice;
                                    const showCart = data?.cartButton !== false && hasValidPrice;
                                    const showWhatsApp = data?.show_whatsapp === true;
                                    const whatsappType = data?.quoteButton === true ? "quote" : "consult";
                                    const isOutOfStock = !currentProduct?.stock_unlimited && (currentProduct?.stock <= 0 || !currentProduct?.stock);

                                    return (
                                        <div className="space-y-4">
                                            {isOutOfStock ? (
                                                <button
                                                    disabled
                                                    className={`${twentySecondaryBtn} opacity-50 cursor-not-allowed w-full`}
                                                >
                                                    Agotado
                                                </button>
                                            ) : (
                                                (showBuy || showCart) && (
                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                        {showBuy && (
                                                            <button
                                                                disabled={!isFullySelected}
                                                                onClick={() => {
                                                                    onAddClicked(currentProduct);
                                                                    if (isFullySelected) {
                                                                        window.location.href = "/cart";
                                                                    }
                                                                }}
                                                                className={`${twentyPrimaryBtn} ${!isFullySelected ? "opacity-50 cursor-not-allowed" : ""}`}
                                                            >
                                                                Comprar ahora
                                                            </button>
                                                        )}
                                                        {showCart && (
                                                            <button
                                                                disabled={!isFullySelected}
                                                                onClick={(e) => onAddClicked(currentProduct, e.currentTarget)}
                                                                className={`${twentySecondaryBtn} ${!isFullySelected ? "opacity-50 cursor-not-allowed" : ""}`}
                                                            >
                                                                Al Carrito
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            )}

                                            {showWhatsApp && (
                                                <button
                                                    onClick={() => handleWhatsAppClick(whatsappType)}
                                                    className={twentyWhatsappBtn}
                                                >
                                                    <WhatsAppIcon className="w-5 h-5" />
                                                    <span>
                                                        {whatsappType === "quote"
                                                            ? "Solicitar Cotización"
                                                            : "WhatsApp de Contacto"}
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </motion.div>
                    </section>

                    {/* Specifications & Description — only render sections with content */}
                    {(() => {
                        const hasDesc = !!(currentProduct?.description || item?.description);
                        const hasSpecs = generalSpecifications.length > 0;
                        // Don't render the whole block if neither section has content
                        if (!hasDesc && !hasSpecs) return null;
                        // When only one section exists it should span full width
                        const colClass = (hasDesc && hasSpecs)
                            ? "grid-cols-1 lg:grid-cols-2"
                            : "grid-cols-1";
                        return (
                            <div className={`col-span-12 grid ${colClass} gap-12 border-t border-white/10 pt-10 mt-6`}>
                                {/* Description */}
                                {hasDesc && (
                                    <section className="text-left">
                                        <h2 className={twentySectionTitleClass}>
                                            <span>Descripción</span>
                                            <Plus size={14} className="opacity-40" />
                                        </h2>
                                        <div
                                            itemProp="description"
                                            className="text-sm lg:text-base  text-white prose prose-invert max-w-none prose-p: prose-headings:text-white"
                                            dangerouslySetInnerHTML={{
                                                __html: currentProduct?.description || item?.description,
                                            }}
                                        />
                                    </section>
                                )}

                                {/* Specifications */}
                                {hasSpecs && (
                                    <section className="text-left">
                                        <h2 className={twentySectionTitleClass}>
                                            <span>{hasDesc ? "Especificaciones" : "Especificaciones"}</span>
                                            <Plus size={14} className="opacity-40" />
                                        </h2>
                                        <div className="grid grid-cols-1 gap-3">
                                            {generalSpecifications.slice(0, 10).map((spec, i) => (
                                                <div
                                                    key={i}
                                                    className="border-b border-white/5 pb-3.5 flex items-center justify-between "
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] text-white/30 w-4">
                                                            {(i + 1).toString().padStart(2, "0")}
                                                        </span>
                                                        <span className="text-xs uppercase text-white/60">
                                                            {spec.title || "Característica"}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs uppercase text-white">
                                                        {spec.description || spec.value}
                                                    </span>
                                                </div>
                                            ))}

                                            <AnimatePresence>
                                                {showAllSpecs && generalSpecifications.length > 10 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="overflow-hidden grid grid-cols-1 gap-3"
                                                    >
                                                        {generalSpecifications.slice(10).map((spec, i) => (
                                                            <div
                                                                key={i + 10}
                                                                className="border-b border-white/5 pb-3.5 flex items-center justify-between "
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-[10px] text-white/30 w-4">
                                                                        {(i + 11).toString().padStart(2, "0")}
                                                                    </span>
                                                                    <span className="text-xs uppercase text-white/60">
                                                                        {spec.title || "Característica"}
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs uppercase text-white">
                                                                    {spec.description || spec.value}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {generalSpecifications.length > 10 && (
                                                <button
                                                    onClick={() => setShowAllSpecs(!showAllSpecs)}
                                                    className="mt-2 flex items-center gap-2 text-[10px]  uppercase  text-white/50 hover:text-white transition-colors"
                                                >
                                                    <span>
                                                        {showAllSpecs
                                                            ? "Ver menos especificaciones"
                                                            : "Ver más especificaciones"}
                                                    </span>
                                                    <motion.div
                                                        animate={{ rotate: showAllSpecs ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <ChevronDown size={10} />
                                                    </motion.div>
                                                </button>
                                            )}
                                        </div>
                                    </section>
                                )}
                            </div>
                        );
                    })()}

                    {/* Policy Section */}
                    {data?.showDeliveryPolicy !== false && (
                        <div className="col-span-12 mt-6">
                            <div
                                onClick={() => setDeliveryPolicyModalOpen(true)}
                                className="group bg-white/[0.04] text-white py-7 px-6 md:px-8 flex items-center justify-between cursor-pointer border border-white/10 hover:border-white/25 transition-all duration-500 rounded-3xl text-left"
                            >
                                <div className="flex items-center gap-8">
                                    <Truck className="w-12 h-12 stroke-[1] text-white/40" />
                                    <div>
                                        <h4 className="text-2xl font-black uppercase text-white">
                                            Políticas de Envío
                                        </h4>
                                        <p className="text-xs  uppercase  text-white/40 mt-1">
                                            Entregas seguras y tiempos estimados
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px]   hidden sm:block">
                                        DETALLES
                                    </span>
                                    <ChevronRight className="w-8 h-8 transform group-hover:translate-x-2 transition-transform stroke-[1]" />
                                </div>
                            </div>
                        </div>
                    )}
                </article>

                {/* Mobile View */}
                <div className="md:hidden space-y-2 pb-0 text-left">
                    {/* Volver atrás */}
                    <div className="px-2">
                        <button
                            type="button"
                            aria-label="Volver atrás"
                            onClick={() => {
                                try {
                                    if (window.history.length > 1) window.history.back();
                                    else window.location.href = data?.link_catalog || "/catalogo";
                                } catch {
                                    window.location.href = data?.link_catalog || "/catalogo";
                                }
                            }}
                            className="inline-flex items-center gap-1.5 py-0 pr-3 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white active:scale-95 transition"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Volver
                        </button>
                    </div>
                    <div className="md:hidden space-y-10 pb-0 text-left">

                        <div className="space-y-6">
                            <div className="border-0 border-white/10 lg:pb-6 px-2">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="space-y-1">
                                        <span className="text-xs   text-white/40 block">
                                            SKU: {currentProduct?.sku}
                                        </span>
                                        <span className="text-xs  uppercase  text-white/60">
                                            {currentProduct?.brand?.name || "PREMIUM"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleShare}
                                        aria-label="Compartir producto"
                                        className="p-3 bg-white/10 border border-white/15 text-white rounded-full"
                                    >
                                        <Share2 className="w-4 h-4 stroke-[1.5]" />
                                    </button>
                                </div>
                                <h2 className="text-xl font-black uppercase   mb-0 text-white">
                                    {currentProduct?.name}
                                </h2>
                                <div className="hidden lg:flex items-baseline gap-4 ">
                                    <span className="text-3xl font-black uppercase text-white">
                                        {CurrencySymbol()}{" "}
                                        {currentProduct?.final_price}
                                    </span>
                                    {currentProduct?.price >
                                        currentProduct?.final_price && (
                                            <span className="text-base text-white/30 line-through ">
                                                {CurrencySymbol()}{" "}
                                                {currentProduct?.price}
                                            </span>
                                        )}
                                </div>
                            </div>

                            {/* Slider Mobile */}
                            <div ref={mobileImageRef} className="border border-white/10 p-2 bg-white/5 rounded-3xl overflow-hidden">
                                <Swiper
                                    modules={[Pagination, Navigation, Autoplay]}
                                    pagination={{ clickable: true }}
                                    grabCursor={true}
                                    autoplay={{
                                        delay: 4000,
                                        disableOnInteraction: false,
                                    }}
                                    className="aspect-[3/4] product-twenty-swiper"
                                >
                                    {[
                                        currentProduct?.image,
                                        ...(Array.isArray(currentProduct?.images)
                                            ? currentProduct.images
                                            : Object.values(
                                                currentProduct?.images || {},
                                            )),
                                    ]
                                        .filter((img, idx, self) => {
                                            const url = img?.url || img;
                                            return url && self.findIndex((i) => (i?.url || i) === url) === idx;
                                        })
                                        .map((img, i) => (
                                            <SwiperSlide key={i}>
                                                <img
                                                    src={`/storage/images/item/${img?.url || img}`}
                                                    alt={`${currentProduct?.name || item?.name || 'Producto'} - imagen ${i + 1}`}
                                                    className="w-full h-full object-cover object-top"
                                                    onError={(e) =>
                                                        (e.target.src = "/api/cover/thumbnail/null")
                                                    }
                                                />
                                            </SwiperSlide>
                                        ))}
                                </Swiper>
                            </div>
                        </div>

                        {/* Attributes selection Mobile */}
                        <div className="space-y-6 px-2">
                            {group?.allAttributes?.map((attrData) => (
                                <div key={attrData.name} className="space-y-3">
                                    <h3 className="text-xs uppercase text-white/50">
                                        {attrData.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {attrData.values.map((val, idx) => {
                                            const isSelected =
                                                selectedAttributes[attrData.name]?.value === val.value;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        const matching =
                                                            findBestMatchingVariant(
                                                                attrData.name,
                                                                val,
                                                                group,
                                                            );
                                                        if (matching) {
                                                            setSelectedVariant(matching);
                                                            const newAttrs = {};
                                                            getVariantAttributes(matching).forEach((a) => {
                                                                newAttrs[a.name || a.slug] = {
                                                                    value: a.pivot?.value || a.value,
                                                                    item: matching,
                                                                };
                                                            });
                                                            setSelectedAttributes(newAttrs);
                                                        } else {
                                                            handleAttributeSelect(attrData.name, val);
                                                        }
                                                    }}
                                                    className={`px-4 py-2.5 rounded-full text-xs uppercase border transition-all ${isSelected ? "bg-white text-primary border-white shadow" : "bg-white/5 text-white border-white/20"}`}
                                                >
                                                    {val.value}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile Description & Specifications */}
                        {(() => {
                            const hasDesc = !!(currentProduct?.description || item?.description);
                            const hasSpecs = generalSpecifications.length > 0;
                            if (!hasDesc && !hasSpecs) return null;
                            return (
                                <div className="space-y-10 px-2 border-t border-white/10 pt-10">
                                    {hasDesc && (
                                        <section>
                                            <h2 className="text-xs uppercase text-white/50 mb-4">
                                                Descripción
                                            </h2>
                                            <div
                                                itemProp="description"
                                                className="text-xs text-white prose prose-invert max-w-none"
                                                dangerouslySetInnerHTML={{
                                                    __html: currentProduct?.description || item?.description,
                                                }}
                                            />
                                        </section>
                                    )}
                                    {hasSpecs && (
                                        <section>
                                            <h2 className="text-xs uppercase text-white/50 mb-4">
                                                Especificaciones
                                            </h2>
                                            <div className="space-y-3.5">
                                                {generalSpecifications.map((spec, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex flex-col justify-start items-start border-b border-white/5 pb-3"
                                                    >
                                                        <span className="text-xs block text-white/60">
                                                            {spec.title || "Factor"}
                                                        </span>
                                                        <span className="text-xs text-white">
                                                            {spec.description || spec.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            );
                        })()}

                        {data?.showDeliveryPolicy !== false && (
                            <div
                                onClick={() => setDeliveryPolicyModalOpen(true)}
                                className="border border-white/10 rounded-2xl py-5 flex justify-between items-center bg-white/[0.04] mx-2 active:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-4 pl-4">
                                    <Truck className="w-8 h-8 stroke-[1] text-white/60" />
                                    <span className="text-xs  uppercase  text-white">
                                        Política de Envío
                                    </span>
                                </div>
                                <ChevronRight className="w-6 h-6 stroke-[1] text-white/40 pr-4" />
                            </div>
                        )}

                        {/* Mobile Floating Bottom Bar */}
                        {(() => {
                            const showBuy = data?.buyButton !== false && hasValidPrice;
                            const showCart = data?.cartButton !== false && hasValidPrice;
                            const showWhatsApp = data?.show_whatsapp === true;
                            const whatsappType = data?.quoteButton === true ? "quote" : "consult";

                            if (!showBuy && !showCart && !showWhatsApp) return null;

                            const isOutOfStock = !currentProduct?.stock_unlimited && (currentProduct?.stock <= 0 || !currentProduct?.stock);

                            const hasMultipleVariants = variantsForSelectedGroup.length > 1;
                            const totalRequiredAttributes = group?.allAttributes?.length || 0;
                            const totalSelectedAttributes = Object.keys(selectedAttributes).length;
                            const isFullySelected = !(
                                (hasMultipleVariants &&
                                    (totalSelectedAttributes < totalRequiredAttributes ||
                                        (item.is_master && currentProduct.id === item.id))) ||
                                currentProduct.is_master
                            );

                            return (
                                <>

                                    <div
                                        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-primary border-t border-white/15"
                                        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                                    >
                                        <div className="p-3 sm:p-4 flex items-center gap-3">
                                            {/* Share Button */}
                                            <button
                                                onClick={handleShare}
                                                aria-label="Compartir producto"
                                                className="p-3.5 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center shrink-0 hover:bg-white/20 transition-all active:scale-95"
                                            >
                                                <Share2 className="w-4 h-4 stroke-[1.5]" />
                                            </button>

                                            {/* Main Action Button */}
                                            {isOutOfStock ? (
                                                <button
                                                    disabled
                                                    className="flex-1 py-3.5 bg-white/5 text-white/40 border border-white/10 rounded-full text-xs font-bold uppercase cursor-not-allowed text-center"
                                                >
                                                    Agotado
                                                </button>
                                            ) : (
                                                <div className="flex-1 flex gap-2">
                                                    {(showBuy || showCart) && (
                                                        <motion.button
                                                            disabled={!isFullySelected}
                                                            onClick={(e) => {
                                                                onAddClicked(currentProduct, e.currentTarget);
                                                                /*  if (showBuy && isFullySelected) {
                                                                      window.location.href = "/cart";
                                                                  }*/
                                                            }}
                                                            whileTap={{ scale: 0.95 }}
                                                            animate={
                                                                isAddedToCart
                                                                    ? { scale: [1, 1.08, 1] }
                                                                    : isFullySelected
                                                                        ? {
                                                                            scale: [1, 1.045, 1, 1.045, 1, 1],
                                                                            boxShadow: [
                                                                                "0 0 0 0 rgba(255, 255, 255, 0.5)",
                                                                                "0 0 0 8px rgba(255, 255, 255, 0)",
                                                                                "0 0 0 0 rgba(255, 255, 255, 0.5)",
                                                                                "0 0 0 10px rgba(255, 255, 255, 0)",
                                                                                "0 0 0 0 rgba(255, 255, 255, 0)",
                                                                                "0 0 0 0 rgba(255, 255, 255, 0)",
                                                                            ],
                                                                        }
                                                                        : {}
                                                            }
                                                            transition={
                                                                isAddedToCart
                                                                    ? { duration: 0.4 }
                                                                    : isFullySelected
                                                                        ? {
                                                                            duration: 3,
                                                                            times: [0, 0.08, 0.16, 0.24, 0.32, 1],
                                                                            repeat: Infinity,
                                                                            ease: "easeInOut",
                                                                        }
                                                                        : {}
                                                            }
                                                            className={`relative overflow-hidden flex-1 py-3.5 px-4 font-bold uppercase text-xs sm:text-sm flex items-center justify-center gap-2 rounded-full border-2 transition-colors active:scale-[0.98] ${isAddedToCart
                                                                ? "bg-success text-white border-success shadow-lg shadow-success/30"
                                                                : "bg-white text-primary hover:bg-white/90 border-white shadow-lg"
                                                                } ${!isFullySelected ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        >
                                                            {/* Shimmer sweep effect */}
                                                            {isFullySelected && !isAddedToCart && (
                                                                <motion.div
                                                                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none rounded-full"
                                                                    animate={{ translateX: ["-100%", "200%"] }}
                                                                    transition={{
                                                                        duration: 1.2,
                                                                        repeat: Infinity,
                                                                        repeatDelay: 2.2,
                                                                        ease: "easeInOut",
                                                                    }}
                                                                />
                                                            )}

                                                            <AnimatePresence mode="wait">
                                                                {isAddedToCart ? (
                                                                    <motion.div
                                                                        key="added"
                                                                        initial={{ scale: 0.6, opacity: 0 }}
                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                        exit={{ scale: 0.6, opacity: 0 }}
                                                                        className="flex items-center justify-center gap-2 text-white"
                                                                    >
                                                                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                                        <span className="font-black">¡Agregado!</span>
                                                                    </motion.div>
                                                                ) : (
                                                                    <motion.div
                                                                        key="default"
                                                                        initial={{ scale: 0.9, opacity: 0 }}
                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                        exit={{ scale: 0.9, opacity: 0 }}
                                                                        className="flex items-center justify-center gap-2"
                                                                    >
                                                                        <motion.div
                                                                            animate={
                                                                                isFullySelected
                                                                                    ? { rotate: [0, -12, 12, -12, 0, 0] }
                                                                                    : {}
                                                                            }
                                                                            transition={{
                                                                                duration: 3,
                                                                                times: [0, 0.08, 0.16, 0.24, 0.32, 1],
                                                                                repeat: Infinity,
                                                                                ease: "easeInOut",
                                                                            }}
                                                                        >
                                                                            <ShoppingCart className="w-4 h-4 shrink-0" />
                                                                        </motion.div>
                                                                        <span>
                                                                            {showBuy ? "Comprar" : "Al Carrito"}
                                                                            {hasValidPrice ? ` · ${CurrencySymbol()} ${currentProduct?.final_price || currentProduct?.price}` : ""}
                                                                        </span>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </motion.button>
                                                    )}

                                                    {showWhatsApp && (
                                                        <button
                                                            onClick={() => handleWhatsAppClick(whatsappType)}
                                                            className={`py-3.5 px-4 bg-[#25D366] text-white font-bold uppercase text-xs flex items-center justify-center gap-2 rounded-full hover:bg-[#25D366]/90 transition-all active:scale-[0.98] ${!(showBuy || showCart) ? "flex-1" : ""}`}
                                                        >
                                                            <WhatsAppIcon className="w-4 h-4" />
                                                            {!(showBuy || showCart) && (
                                                                <span>
                                                                    {whatsappType === "quote" ? "Cotizar" : "WhatsApp"}
                                                                    {hasValidPrice ? ` · ${CurrencySymbol()} ${currentProduct?.final_price || currentProduct?.price}` : ""}
                                                                </span>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>

            </div>
            {/* Related Products Carousel */}
            {relationsItems.length > 0 && (
                <div className="lg:mt-16 mb-8 w-full lg:border-t border-white/10">
                    <ProductSwiperTwenty
                        data={{
                            ...data,
                            title: data?.related_title || "También *te puede* interesar",
                            description: data?.related_description,

                            loop: data?.related_loop,
                            autoplay: data?.related_autoplay,
                            type_card_product: data?.related_type_card_product || "CardProductTwenty",
                            type_modal_cart: data?.type_modal_cart,
                        }}
                        items={relationsItems}
                        cart={cart}
                        setCart={setCart}
                    />
                </div>
            )}
            {/* Modals - Twenty Styled */}
            <ReactModal
                isOpen={deliveryPolicyModalOpen}
                onRequestClose={() => setDeliveryPolicyModalOpen(false)}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 outline-none "
                overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-md z-[90]"
            >
                <div className="bg-primary p-6 md:p-10 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh] rounded-3xl border border-white/15 text-left">
                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-4">
                            <Truck className="w-8 h-8 stroke-[1] text-white/40" />
                            <h2 className="text-xl uppercase  text-white">
                                Política de Envío
                            </h2>
                        </div>
                        <button
                            onClick={() => setDeliveryPolicyModalOpen(false)}
                            className="hover:text-white/60 transition-colors"
                        >
                            <X className="w-5 h-5 stroke-[1]" />
                        </button>
                    </div>
                    <div className="prose prose-invert max-w-none text-xs  text-white">
                        <div dangerouslySetInnerHTML={{ __html: deliveryPolicy }} />
                    </div>
                    <button
                        onClick={() => setDeliveryPolicyModalOpen(false)}
                        className="mt-8 w-full py-4 bg-white text-primary font-bold uppercase text-sm hover:bg-white/90 transition-colors rounded-full"
                    >
                        Entendido
                    </button>
                </div>
            </ReactModal>

            {/* Cart Modal - Dynamic */}
            <CartModalSelector
                type_modal_cart="CartModalMiBalon"
                cart={cart}
                data={data}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </main>
    );
};

export default ProductDetailTwenty;
