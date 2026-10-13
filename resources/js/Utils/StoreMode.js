import { useEffect, useState } from "react";

/**
 * Modo de tienda (modelo híbrido Belleza Central)
 *
 * - Cookie: selected_store_code (30 días)
 * - Valores: slug de la tienda física (ej. "pichanaki") o "nacional"
 * - "nacional" no es una tienda: es el modo de compra por enlace oficial.
 */

export const STORE_MODE_COOKIE = "selected_store_code";
export const STORE_MODE_NACIONAL = "nacional";
export const STORE_MODE_EVENT = "belleza:store-mode";
const STORE_MODE_DAYS = 30;

const readCookie = (name) => {
    if (typeof document === "undefined") return "";
    const match = document.cookie.match(
        new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"),
    );
    return match ? decodeURIComponent(match[1]) : "";
};

const writeCookie = (name, value, days) => {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
        value,
    )}; expires=${expires}; path=/; SameSite=Lax`;
};

/** Modo actual ("" si el visitante aún no eligió). */
export const getStoreMode = () => (readCookie(STORE_MODE_COOKIE) || "").toLowerCase();

/** Guarda el modo y notifica a cards, detalle y filtros. */
export const setStoreMode = (code) => {
    const value = (code || "").toLowerCase();
    writeCookie(STORE_MODE_COOKIE, value, STORE_MODE_DAYS);
    if (typeof window !== "undefined") {
        window.dispatchEvent(
            new CustomEvent(STORE_MODE_EVENT, { detail: { code: value } }),
        );
    }
    return value;
};

/** Suscripción al modo de tienda. */
export const useStoreMode = (fallback = "") => {
    const [mode, setMode] = useState(() => getStoreMode() || fallback);

    useEffect(() => {
        const sync = (event) => {
            const code =
                event?.detail?.code || getStoreMode() || fallback;
            setMode(code);
        };

        sync();
        window.addEventListener(STORE_MODE_EVENT, sync);
        window.addEventListener("focus", sync);
        return () => {
            window.removeEventListener(STORE_MODE_EVENT, sync);
            window.removeEventListener("focus", sync);
        };
    }, [fallback]);

    const choose = (code) => setMode(setStoreMode(code));

    return { mode, isNacional: mode === STORE_MODE_NACIONAL, choose };
};

/** Fila de item_stores que corresponde al modo elegido. */
export const getStoreRow = (item, mode) => {
    const rows = item?.item_stores || item?.itemStores || [];
    if (!rows?.length) return null;
    if (!mode || mode === STORE_MODE_NACIONAL) return null;
    return (
        rows.find((row) => row?.store?.slug === mode) ||
        rows.find((row) => row?.store_id === mode) ||
        null
    );
};

/**
 * Estado de compra de un producto según el modo:
 * - nacional: solo enlace oficial (no hay stock local)
 * - local: disponible si hay stock > 0 en esa tienda
 */
export const resolvePurchase = (item, mode) => {
    const affiliateUrl = item?.affiliate_url || null;
    const basePrice = Number(item?.final_price ?? item?.price ?? 0) || 0;

    if (mode === STORE_MODE_NACIONAL) {
        return {
            mode,
            isNacional: true,
            available: Boolean(affiliateUrl),
            stock: null,
            price: basePrice,
            storeLabel: "Envío nacional",
            storeSlug: null,
            affiliateUrl,
            cta: "Comprar en línea",
        };
    }

    const row = getStoreRow(item, mode);

    if (!row) {
        return {
            mode,
            isNacional: false,
            available: false,
            stock: 0,
            price: basePrice,
            storeLabel: null,
            storeSlug: mode || null,
            affiliateUrl,
            cta: "Consultar disponibilidad",
        };
    }

    const stock = Number(row.stock) || 0;
    const price = Number(row.price) || basePrice;

    return {
        mode,
        isNacional: false,
        available: stock > 0,
        stock,
        price,
        storeLabel: row?.store?.name || null,
        storeSlug: row?.store?.slug || mode || null,
        affiliateUrl,
        cta: stock > 0 ? "Reservar en tienda" : "Agotado en esta tienda",
    };
};
