import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

function CategoriesScraping({ items }) {


    return (
        <div className="px-primary mx-auto py-6  font-dont-general">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h2 className="text-[32px] font-bold">Comprar por categorías</h2>
                <div className="flex gap-2">
                    <button className="py-1 px-2 rounded-lg   hover:bg-primary transition-colors">
                        <ChevronLeft width="1rem" />
                    </button>
                    <button className="py-1 px-2 rounded-lg   hover:bg-primary transition-colors">
                        <ChevronRight width="1rem" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((category, index) => (
                    <div
                        key={index}
                        className="cursor-pointer px-4 bg-white flex gap-4 items-center rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:bg-secondary  transition-all duration-300"
                    >
                        <div className="aspect-square relative ">
                            <img
                                src={`/storage/images/categorie/${category.image}`}
                                alt={category.name}
                                className="w-[120px] h-[120px] object-contain"
                            />
                        </div>
                        <div className="p-4  ">
                            <h3 className="font-bold mb-1">{category.name}</h3>
                            <a
                                href="#"
                                className="customtext-neutral-light hover:customtext-primary text-xs font-medium transition-colors duration-300"
                            >
                                Ver más
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoriesScraping;