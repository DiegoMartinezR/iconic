import React from "react";
import { ArrowRight } from "lucide-react";
import ProductCardStoreMode from "./Components/ProductCardStoreMode";

const ProductCardHybrid = ({ data = {}, items = [] }) => {
    return (
        <section
            id={data?.element_id || null}
            className={`bg-page-background ${data?.class_section || "py-12 lg:py-16"}`}
        >
            <div className="px-primary 2xl:max-w-7xl 2xl:px-0 mx-auto">
                <div className="flex items-end justify-between gap-4 mb-8">
                    <div>
                        {data?.subtitle ? (
                            <p className="text-xs uppercase tracking-[0.25em] customtext-primary mb-2">
                                {data.subtitle}
                            </p>
                        ) : null}
                        <h2 className={`text-3xl md:text-4xl font-title font-bold ${data?.class_title || "text-neutral-dark"}`}>
                            {data?.title || "Productos destacados"}
                        </h2>
                    </div>
                    {data?.button_link ? (
                        <a
                            href={data.button_link}
                            className="hidden md:inline-flex items-center gap-2 rounded-full border customborder-neutral-light px-5 py-3 text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
                        >
                            {data?.button_text || "Ver catálogo"}
                            <ArrowRight size={16} />
                        </a>
                    ) : null}
                </div>

                {items.length === 0 ? (
                    <p className="text-center text-gray-400 py-16 italic">
                        No se encontraron productos disponibles.
                    </p>
                ) : (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${data?.class_grid || ""}`}>
                        {items.map((item) => (
                            <ProductCardStoreMode key={item?.id || item?.slug} item={item} data={data} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductCardHybrid;
