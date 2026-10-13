import React from "react";
import { motion } from "framer-motion";
import { CurrencySymbol } from "../../../../Utils/Number2Currency";
import ItemsRest from "../../../../Actions/ItemsRest";

const itemsRest = new ItemsRest();

const CardProductTwenty = ({ product }) => {
    if (!product) return null;

    const goToDetail = async (e) => {
        e.preventDefault();
        try {
            await itemsRest.updateClicks({ id: product.id });
        } catch (err) {}
        window.location.href = `/product/${product.slug}`;
    };

    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const hasDiscount = discount > 0 && discount < price;
    const finalPrice = hasDiscount ? discount : price;
    const discountPercentage = hasDiscount ? Math.round(((price - discount) / price) * 100) : 0;
    // Porcentaje siempre con 2 dígitos mínimos para armonía visual (09%, 28%)
    const discountLabel = String(discountPercentage).padStart(2, "0");
    // Tags reales marcados para tarjeta. OJO: Laravel serializa la
    // relación `cardTags` como `card_tags` en el JSON (snake_case).
    const cardTags = (product.cardTags ?? product.card_tags ?? product.tags ?? []).filter(
        (tag) => tag && (tag.show_in_card == 1 || tag.show_in_card === true),
    );
    const cardTag = cardTags.length > 0 ? cardTags[0] : null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ duration: 0.35 }}
            className="group cursor-pointer"
            onClick={goToDetail}
        >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                <img
                    src={product.image ? `/storage/images/item/${product.image}` : "/api/cover/thumbnail/null"}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/cover/thumbnail/null";
                    }}
                />
                {/* Badges: descuento + tag real al costado */}
                {(hasDiscount || cardTag) && (
                    <div className="absolute left-0 top-0 z-10 flex items-start gap-1">
                        {hasDiscount && (
                            <span className="block bg-red-600 px-2 py-1 text-[10px] font-bold tracking-wide text-white">
                                -{discountLabel}%
                            </span>
                        )}
                        {cardTag && (
                            <span
                                className="block px-2 py-1 text-[10px] font-bold tracking-wide"
                                style={{
                                    backgroundColor: cardTag.background_color || "#ffffff",
                                    color: cardTag.text_color || "#000000",
                                }}
                            >
                                {cardTag.name}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="pt-3">
                <h3 className="truncate text-[13px] font-bold uppercase tracking-wide text-white">
                    {product.name}
                </h3>
                <p className="mt-0.5 truncate text-[11px] text-white/50">
                    {product.category?.name || product.subcategory?.name || ""}
                </p>
                <p className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-bold text-white">
                        {CurrencySymbol()} {finalPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className="text-[11px] text-white/40 line-through">
                            {CurrencySymbol()} {price.toFixed(2)}
                        </span>
                    )}
                </p>
            </div>
        </motion.div>
    );
};

export default CardProductTwenty;
