import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

const FiltersScraping = ({ title, options, onFilterChange }) => {
    const [expanded, setExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAll, setShowAll] = useState(false);

    const toggleExpand = () => setExpanded(!expanded);
    const filteredOptions = options
        .filter(
            (option, index, self) =>
                index === self.findIndex((o) => o.label === option.label) // Elimina duplicados
        )
        .filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const displayedOptions = showAll
        ? filteredOptions
        : filteredOptions.slice(0, 5);

    return (
        <div className="mb-6">
            <button
                onClick={toggleExpand}
                className="flex items-center justify-between w-full mb-4"
            >
                <span className="font-medium">{title}</span>
                <ChevronDown
                    className={`h-5 w-5 transform transition-transform ${
                        expanded ? "" : "-rotate-180"
                    }`}
                />
            </button>
            {expanded && (
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar"
                            className="w-full px-4 pl-10 py-3 border customtext-neutral-dark border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0 transition-all duration-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="space-y-3">
                        {displayedOptions.map((option, index) => (
                            <label
                                key={index}
                                className="flex items-center space-x-3"
                            >
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    onChange={() =>
                                        onFilterChange(option.label)
                                    }
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                        {filteredOptions.length > 5 && (
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="text-blue-500 hover:underline"
                            >
                                {showAll ? "Ver menos" : "Ver más"}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FiltersScraping;
