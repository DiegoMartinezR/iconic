import React from "react";

const BottomBarTwenty = React.lazy(() => import("./BottomBars/BottomBarTwenty"));

const BottomBar = ({ which, data, cart, setCart, isUser, generals }) => {
    const getBottomBar = () => {
        switch (which) {
            case "BottomBarTwenty":
                return (
                    <BottomBarTwenty
                        data={data}
                        cart={cart}
                        setCart={setCart}
                        isUser={isUser}
                        generals={generals}
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
    return getBottomBar();
};

export default BottomBar;
