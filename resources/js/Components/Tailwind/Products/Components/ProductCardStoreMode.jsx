import React from "react";
import { MapPin, MessageCircle, Truck } from "lucide-react";
import { CurrencySymbol } from "../../../../Utils/Number2Currency";
import { resolvePurchase, useStoreMode } from "../../../../Utils/StoreMode";

const ProductCardStoreMode = ({ product, item, data = {} }) => {
    const current = product || item || {};
    const { mode } = useStoreMode();
    const info = resolvePurchase(current, mode);
    const whatsapp = data?.whatsapp || data?.phone || "";

    const image = current?.image || current?.images?.[0]?.image || current?.images?.[0]?.url;
    const imageSrc = image
        ? String(image).startsWith("http")
            ? image
            : `/storage/images/item/${image}`
        : "/api/cover/thumbnail/null";

    const detailHref = `/product/${current?.slug || current?.id}`;
    const purchasePrice = Number(info?.price ?? current?.final_price ?? current?.price ?? 0);
    const regularPrice = Number(current?.price ?? purchasePrice);
    const message = encodeURIComponent(
        `Hola, quiero ${info?.isNacional ? "comprar en línea" : "reservar"} "${current?.name}"${info?.storeLabel ? ` en ${info.storeLabel}` : ""}.`,
    );
    const actionHref =
        info?.isNacional && info?.affiliateUrl
            ? info.affiliateUrl
            : whatsapp
                ? `https://wa.me/51${String(whatsapp).replace(/\D/g, "")}?text=${message}`
                : "/contacto";

    return (
        <article className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 h-full ${data?.class_card || ""}`}>
            <a href={detailHref} className="block aspect-square bg-gray-100 overflow-hidden">
                <img
                    src={imageSrc}
                    alt={current?.name}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/api/cover/thumbnail/null";
                    }}
                />
            </a>

            <div className="p-5">
                <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">
                    {current?.category?.name || current?.brand?.name || "Belleza Central"}
                </p>
                <a href={detailHref} className="block">
                    <h3 className="font-semibold text-neutral-dark leading-snug line-clamp-2 min-h-[3rem]">
                        {current?.name}
                    </h3>
                </a>

                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    {info?.isNacional ? <Truck size={14} /> : <MapPin size={14} />}
                    <span>{info?.storeLabel || "Elige tu tienda"}</span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-neutral-dark">
                        {CurrencySymbol()} {purchasePrice.toFixed(2)}
                    </span>
                    {regularPrice > purchasePrice ? (
                        <span className="text-sm text-gray-400 line-through">
                            {CurrencySymbol()} {regularPrice.toFixed(2)}
                        </span>
                    ) : null}
                </div>

                <a
                    href={actionHref}
                    target={info?.isNacional && info?.affiliateUrl ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors ${info?.available
                            ? "bg-primary text-white hover:brightness-95"
                            : "bg-gray-200 text-neutral-dark hover:bg-gray-300"
                        } ${data?.class_button || ""}`}
                >
                    <MessageCircle size={16} />
                    {info?.cta || "Consultar disponibilidad"}
                </a>
            </div>
        </article>
    );
};

export default ProductCardStoreMode;
