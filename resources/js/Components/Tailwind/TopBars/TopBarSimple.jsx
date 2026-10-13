import { useEffect, useRef } from "react";
import General from "../../../Utils/General";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import AnimatedCintillo from "../Components/AnimatedCintillo";
import useCintillos from "../../../Hooks/useCintillos";

const TopBarSimple = ({ data, generals }) => {
    const divRef = useRef(null);
    const { hasActiveCintillos } = useCintillos(generals);

    useEffect(() => {
        if (divRef.current) {
            adjustTextColor(divRef.current);
        }
    }, []);

    return (
        <div
            id={data?.element_id || null}
            ref={divRef}
            className={` bg-primary py-3 font-bold px-primary flex justify-center items-center text-sm font-paragraph ${data?.class_content || ""}`}
        >
            <p className={` ${data?.class_text || "text-center"}`}>
                <AnimatedCintillo generals={generals} />
            </p>
        </div>
    );
};

export default TopBarSimple;
