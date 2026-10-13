import React, { createContext, useContext, useState } from "react";

/**
 * Contexto general de página (PageContext)
 * Administra el estado global de UI de las páginas (header, layout, configuraciones dinámicas).
 * Evita la anidación excesiva de múltiples contextos específicos en el futuro.
 */
const PageContext = createContext({
    headerConfig: { isSolid: false, isStatic: false },
    setHeaderConfig: () => {},
    hideFloatingWhatsApp: false,
    setHideFloatingWhatsApp: () => {},
});

export const deriveInitialHeaderConfig = (systems) => {
    let initialConfig = { isSolid: false, isStatic: false };
    if (!systems || !Array.isArray(systems)) return initialConfig;

    for (const system of systems) {
        if (!system.data) continue;
        
        let dataObj = system.data;
        if (typeof dataObj === 'string') {
            try {
                dataObj = JSON.parse(dataObj);
            } catch (e) {
                continue;
            }
        }
        
        if (dataObj?.header_solid) {
            initialConfig.isSolid = true;
        }
        if (dataObj?.header_static) {
            initialConfig.isStatic = true;
        }
        
        if (initialConfig.isSolid && initialConfig.isStatic) {
            break; 
        }
    }
    return initialConfig;
};

export const PageProvider = ({ children, initialHeaderConfig }) => {
    const [headerConfig, setHeaderConfig] = useState(
        initialHeaderConfig || { isSolid: false, isStatic: false }
    );
    const [hideFloatingWhatsApp, setHideFloatingWhatsApp] = useState(false);

    return (
        <PageContext.Provider
            value={{
                headerConfig,
                setHeaderConfig,
                hideFloatingWhatsApp,
                setHideFloatingWhatsApp,
            }}
        >
            {children}
        </PageContext.Provider>
    );
};

export const usePageContext = () => useContext(PageContext);
export default PageContext;
