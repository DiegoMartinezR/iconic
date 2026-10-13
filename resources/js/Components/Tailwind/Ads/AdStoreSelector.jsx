import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { MapPin, Truck, X } from "lucide-react";
import {
    STORE_MODE_NACIONAL,
    getStoreMode,
    setStoreMode,
} from "../../../Utils/StoreMode";

/**
 * Modal de selección de modo de compra en la primera visita.
 * Solo aparece si el visitante aún no tiene `selected_store_code` en la cookie.
 * El registro se conserva 30 días; después vuelve a preguntar.
 */
const AdStoreSelector = ({ data, stores }) => {
    const [open, setOpen] = useState(false);
    const [delayMs] = useState(() => (data?.seconds ?? 1) * 1000);

    const storeList = (stores || []).filter((store) => store?.slug);
    const enabled = data?.enabled !== false && storeList.length > 0;

    useEffect(() => {
        if (!enabled) return;
        if (typeof window === "undefined") return;
        if (getStoreMode()) return;

        const timer = setTimeout(() => setOpen(true), delayMs);
        return () => clearTimeout(timer);
    }, [enabled, delayMs]);

    const choose = (code) => {
        setStoreMode(code);
        setOpen(false);
    };

    if (!enabled) return null;

    const options = [
        ...storeList.map((store) => ({
            code: store.slug,
            title: store.name,
            description:
                data?.label_local ||
                "Retira en tienda o reserva con stock disponible.",
            icon: MapPin,
            extra: store.address || null,
        })),
        {
            code: STORE_MODE_NACIONAL,
            title: data?.title_nacional || "Envío a todo el Perú",
            description:
                data?.label_nacional ||
                "Compra por el enlace oficial y recibe en tu domicilio.",
            icon: Truck,
            extra: null,
        },
    ];

    return (
        <ReactModal
            isOpen={open}
            shouldCloseOnOverlayClick={data?.close_overlay === true}
            shouldCloseOnEsc={data?.close_overlay === true}
            onRequestClose={() => setOpen(false)}
            contentLabel="Elige dónde comprar"
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white w-[92%] max-w-3xl outline-none shadow-2xl"
            overlayClassName="fixed inset-0 bg-neutral-dark/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        >
            <div className="relative">
                {data?.close_overlay === true ? (
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-neutral-dark transition-colors"
                        aria-label="Cerrar"
                    >
                        <X size={20} />
                    </button>
                ) : null}

                <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
                    <h2 className="text-2xl md:text-3xl font-title font-black uppercase text-neutral-dark">
                        {data?.title || "¿Dónde quieres comprar?"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
                        {data?.description ||
                            "Elige tu tienda y te mostramos solo los productos con stock disponible."}
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 p-8">
                    {options.map(({ code, title, description, icon: Icon, extra }) => (
                        <button
                            key={code}
                            type="button"
                            onClick={() => choose(code)}
                            className="group text-left border border-gray-200 hover:border-primary p-6 transition-colors duration-300 bg-white hover:bg-page-background"
                        >
                            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <Icon size={20} />
                            </span>
                            <span className="block font-title font-bold uppercase text-neutral-dark group-hover:text-primary transition-colors duration-300">
                                {title}
                            </span>
                            <span className="block text-sm text-gray-500 mt-2 leading-relaxed">
                                {description}
                            </span>
                            {extra ? (
                                <span className="block text-[11px] text-gray-400 mt-3 uppercase tracking-wider">
                                    {extra}
                                </span>
                            ) : null}
                        </button>
                    ))}
                </div>

                {data?.note ? (
                    <p className="px-8 pb-8 text-center text-[11px] text-gray-400 uppercase tracking-wider">
                        {data.note}
                    </p>
                ) : null}
            </div>
        </ReactModal>
    );
};

export default AdStoreSelector;
