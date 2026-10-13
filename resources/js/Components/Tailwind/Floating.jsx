import React from "react";
import { usePageContext } from "../../Contexts/PageContext";

const WhatsApp = React.lazy(() => import("./Floating/WhatsApp"));
const WhatsAppSeller = React.lazy(() => import("./Floating/WhatsAppSeller"));

const Floating = ({ which, item, data, referrer }) => {
    const pageCtx = usePageContext();

    if (pageCtx?.hideFloatingWhatsApp) {
        return null;
    }

    const getFloating = () => {
        switch (which) {


            case "WhatsApp":
                return <WhatsApp data={data} item={item} />;
            case "WhatsAppSeller":
                return (
                    <WhatsAppSeller
                        data={data}
                        item={item}
                        referrer={referrer}
                    />
                );
            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    return getFloating();
};

export default Floating;
