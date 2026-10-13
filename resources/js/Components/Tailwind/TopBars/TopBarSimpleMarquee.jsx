import React, { useEffect, useState, useRef } from "react";
import General from "../../../Utils/General";
import CintilloScheduler from "../../../Utils/CintilloScheduler";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import AnimatedCintillo from "../Components/AnimatedCintillo";
import useCintillos from "../../../Hooks/useCintillos";

const TopBarSimpleMarquee = ({ data, generals = null }) => {
    const divRef = useRef(null);
    const { hasActiveCintillos } = useCintillos(generals);
    const [activeCintillos, setActiveCintillos] = useState([]);

    const updateActiveCintillos = () => {
        try {
            let cintilloData = null;
            if (generals && Array.isArray(generals) && generals.length > 0) {
                cintilloData = generals.find(g => g.correlative === "cintillo")?.description;
            }
            if (!cintilloData) {
                cintilloData = General.get("cintillo");
            }

            let allCintillos = [];

            if (cintilloData) {
                if (typeof cintilloData === 'string') {
                    try {
                        allCintillos = JSON.parse(cintilloData);
                    } catch (e) {
                        allCintillos = cintilloData
                            .split(",")
                            .map((c) => c.trim())
                            .filter((c) => c.length > 0);
                    }
                } else if (Array.isArray(cintilloData)) {
                    allCintillos = cintilloData;
                } else {
                    allCintillos = [cintilloData];
                }
            }

            const filtered = CintilloScheduler.filterActiveCintillos(allCintillos);
            setActiveCintillos(filtered);
        } catch (error) {
            console.warn("Error al procesar cintillos:", error);
            setActiveCintillos([]);
        }
    };

    useEffect(() => {
        updateActiveCintillos();
        const interval = setInterval(updateActiveCintillos, 60000);
        return () => clearInterval(interval);
    }, [generals]);

    useEffect(() => {
        if (divRef.current) {
            adjustTextColor(divRef.current);
        }
    }, [activeCintillos]);

    const MarqueeGroup = () => (
        <div className="flex items-center shrink-0">
            {[...Array(6)].map((_, i) => (
                <React.Fragment key={i}>
                    {activeCintillos.map((cintillo, index) => (
                        <React.Fragment key={`${i}-${index}`}>
                            <span className="mx-6 text-xs font-bold tracking-wider uppercase shrink-0 whitespace-nowrap">
                                {CintilloScheduler.getText(cintillo)}
                            </span>

                        </React.Fragment>
                    ))}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <>
            <style>{`
                @keyframes topbar-simple-marquee-infinite {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-topbar-simple-marquee {
                    display: flex;
                    width: max-content;
                    animation: topbar-simple-marquee-infinite 60s linear infinite;
                }
                .animate-topbar-simple-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
            <div
                id={data?.element_id || null}
                ref={divRef}
                className={`bg-primary py-3 font-bold w-full overflow-hidden text-sm font-paragraph ${data?.class_content || ""}`}
            >
                {/* Desktop Version: Centered Animated Cintillo */}
                <div className="hidden sm:flex justify-center items-center text-center px-primary">
                    <p className={`${data?.class_text || "text-center"}`}>
                        <AnimatedCintillo generals={generals} />
                    </p>
                </div>

                {/* Mobile Version: Infinite Horizontal Marquee */}
                <div className="flex sm:hidden w-full items-center overflow-hidden">
                    {activeCintillos.length > 0 ? (
                        <div className="animate-topbar-simple-marquee">
                            <MarqueeGroup />
                            <MarqueeGroup />
                        </div>
                    ) : (
                        <div className="w-full text-center px-4">
                            <AnimatedCintillo generals={generals} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TopBarSimpleMarquee;
