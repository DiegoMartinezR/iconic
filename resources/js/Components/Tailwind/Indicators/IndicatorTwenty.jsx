import React, { useEffect } from "react";
import {
    ShieldCheck,
    Truck,
    CreditCard,
    RefreshCw,
    Award,
    Clock,
    Headphones,
    Package,
    Lock,
    Zap,
    ThumbsUp,
    Heart,
    Star,
    CheckCircle,
    ShoppingBag,
    Send
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const ICON_MAP = {
    ShieldCheck,
    Truck,
    CreditCard,
    RefreshCw,
    Award,
    Clock,
    Headphones,
    Package,
    Lock,
    Zap,
    ThumbsUp,
    Heart,
    Star,
    CheckCircle,
    ShoppingBag,
    Send
};

// Helper to resolve Lucide Icons dynamically from string names
const getIconComponent = (symbolName) => {
    if (!symbolName) return null;

    // Clean string: strip extension if any, e.g. "truck.svg" or "shield_check.png"
    const cleanName = symbolName.split('.')[0]
        .replace(/[-_]([a-z])/g, (g) => g[1].toUpperCase());

    // Capitalize first letter to match PascalCase
    const pascalName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    return ICON_MAP[pascalName] || ICON_MAP[cleanName] || ICON_MAP[symbolName] || null;
};

const IndicatorTwenty = ({ items, data }) => {
    // Inject custom CSS styles for the distressed theme
    useEffect(() => {
        const styleId = "indicator-twenty-styles";
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.textContent = `
                .sticker-card {
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
                    box-shadow: 6px 6px 0px rgba(0,0,0,1);
                    border: 3px solid #000;
                }
                .sticker-card:hover {
                    transform: scale(1.04) rotate(0deg) !important;
                    box-shadow: 12px 12px 0px rgba(0,0,0,1);
                    z-index: 10;
                }
            `;
            document.head.appendChild(style);
        }
        return () => {
            const style = document.getElementById(styleId);
            if (style) style.remove();
        };
    }, []);

    if (!items || items.length === 0) {
        return null;
    }

    // Default sticker rotations (desktop only)
    const rotations = [
        "md:rotate-[-2deg]",
        "md:rotate-[3deg]",
        "md:rotate-[-1deg]",
        "md:rotate-[2deg]",
        "md:rotate-[-3deg]"
    ];

    // Default sticker backgrounds if not customized
    const bgColors = [
        "bg-white text-black",
        "bg-white text-black",
        "bg-white text-black"
    ];

    const renderCard = (indicator, index) => {
        const rotationClass = rotations[index % rotations.length];
        const defaultBgClass = bgColors[index % bgColors.length];
        const hasCustomBg = !!indicator.background_color;
        const cardStyles = hasCustomBg ? { backgroundColor: indicator.background_color } : {};
        const IconComponent = getIconComponent(indicator.symbol);

        return (
            <div
                className={`sticker-card p-6 md:p-8 flex flex-col justify-between w-full min-h-[300px] sm:min-h-[320px] md:min-h-[360px] rotate-0 ${rotationClass} ${hasCustomBg ? 'text-black' : defaultBgClass}`}
                style={cardStyles}
            >
                <div>
                    {IconComponent ? (
                        <IconComponent size={40} strokeWidth={1.5} className="mb-4 md:mb-6 text-black" />
                    ) : indicator.symbol ? (
                        <img
                            src={`/storage/images/indicator/${indicator.symbol}`}
                            alt={indicator.name}
                            loading="lazy"
                            decoding="async"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain mb-4 md:mb-6"
                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                        />
                    ) : (
                        <ShieldCheck size={40} strokeWidth={1.5} className="mb-4 md:mb-6 text-black" />
                    )}

                    <h4 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase leading-none mb-3 md:mb-4">
                        {indicator.name}
                    </h4>
                </div>

                <p className="text-[11px] md:text-xs uppercase leading-relaxed">
                    {indicator.description}
                </p>
            </div>
        );
    };

    return (
        <section
            className="py-12 md:py-20 border-y border-white/10 relative overflow-hidden"
            id={data?.element_id || null}
        >
            <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10 text-neutral-dark">
                {/* Grid desde tablet */}
                <div className="hidden sm:grid sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
                    {items.map((indicator, index) => (
                        <React.Fragment key={indicator.id || index}>
                            {renderCard(indicator, index)}
                        </React.Fragment>
                    ))}
                </div>

                {/* Móvil: carrusel con peek */}
                <div className="block sm:hidden">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={14}
                        slidesPerView={1.12}
                        centeredSlides={false}
                        loop={true}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                        }}
                        className="w-full !py-6"
                    >
                        {items.map((indicator, index) => (
                            <SwiperSlide key={indicator.id || index}>
                                {renderCard(indicator, index)}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default IndicatorTwenty;
