import React from "react";
import { MapPin, Truck, Phone } from "lucide-react";
import {
    STORE_MODE_NACIONAL,
    useStoreMode,
} from "../../../Utils/StoreMode";

/**
 * Cintillo de modo de compra (modelo híbrido):
 * - Tienda física: stock local por tienda (reserva en tienda).
 * - Envío nacional: compra por enlace oficial del producto.
 *
 * Escribe la cookie selected_store_code (30 días) y emite el evento
 * `belleza:store-mode` para actualizar cards, detalle y filtros.
 */
const TopBarStoreMode = ({ data, stores }) => {
    const { mode, choose } = useStoreMode();
    const storeList = (stores || []).filter((store) => store?.slug);
    const label = data?.label || "Compra en:";
    const showPhone = data?.show_phone !== false;

    const options = [
        ...storeList.map((store) => ({
            code: store.slug,
            label: store.name,
            icon: MapPin,
        })),
        {
            code: STORE_MODE_NACIONAL,
            label: data?.label_nacional || "Envío nacional",
            icon: Truck,
        },
    ];

    return (
        <div
            id={data?.element_id || null}
            className={`bg-primary text-white font-paragraph text-sm ${data?.class_content || "py-2"}`}
        >
            <div className="px-primary 2xl:max-w-7xl 2xl:px-0 mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <span className="font-bold uppercase tracking-widest text-[10px] text-white/70">
                    {label}
                </span>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                    {options.map(({ code, label: optionLabel, icon: Icon }) => {
                        const active = mode === code;
                        return (
                            <button
                                key={code}
                                type="button"
                                onClick={() => choose(code)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 border text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 rounded-full ${
                                    active
                                        ? "bg-accent text-neutral-dark border-accent"
                                        : "bg-transparent text-white border-white/40 hover:border-white"
                                }`}
                            >
                                <Icon size={12} />
                                {optionLabel}
                            </button>
                        );
                    })}
                </div>

                {showPhone && data?.phone ? (
                    <a
                        href={`tel:${data.phone}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/80 hover:text-white"
                    >
                        <Phone size={12} />
                        {data.phone}
                    </a>
                ) : null}
            </div>
        </div>
    );
};

export default TopBarStoreMode;
