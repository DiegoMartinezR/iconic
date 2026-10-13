import React from "react";
import { motion } from "framer-motion";

const CardCategoryTwenty = ({ category }) => {
    if (!category) return null;

    const goToCategory = (e) => {
        e.preventDefault();
        window.location.href = `/catalogo?category=${category.slug}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative cursor-pointer w-full flex flex-col items-center text-center"
            onClick={goToCategory}
        >
            {/* Circular image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/15 transition-all duration-500 group-hover:ring-2 group-hover:ring-white/70 group-hover:shadow-2xl group-hover:shadow-black/40">
                <img
                    src={category.image ? `/storage/images/category/${category.image}` : "/api/cover/thumbnail/null"}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/cover/thumbnail/null";
                    }}
                />
                {/* Hover veil + arrow */}
                <div className="absolute inset-0 rounded-full bg-black/0 transition-all duration-500 group-hover:bg-black/35 flex items-center justify-center">
                    <span className="w-11 h-11 rounded-full bg-white text-primary flex items-center justify-center opacity-0 scale-75 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </span>
                </div>
            </div>

            {/* Name */}
            <h3 className="mt-3 md:mt-4 text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-white/85 group-hover:text-white transition-colors line-clamp-1">
                {category.name}
            </h3>
            <span className="mt-1.5 block h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-8"></span>
        </motion.div>
    );
};

export default CardCategoryTwenty;
