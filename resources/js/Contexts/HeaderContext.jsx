import React, { createContext, useContext, useState } from "react";

const HeaderContext = createContext({
    isSolid: false,
    setSolid: (val) => {},
});

export const HeaderProvider = ({ children }) => {
    const [isSolid, setIsSolid] = useState(false);

    return (
        <HeaderContext.Provider value={{ isSolid, setSolid: setIsSolid }}>
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeaderContext = () => useContext(HeaderContext);
export default HeaderContext;
