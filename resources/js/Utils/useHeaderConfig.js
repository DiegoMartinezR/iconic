import { useEffect, useLayoutEffect } from "react";
import { usePageContext } from "../Contexts/PageContext";

const useIsomorphicEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Custom hook to dynamically control HeaderRhino behavior from any page component.
 * Communicates directly through PageContext.
 *
 * @param {Object} input - Options object OR component `data` prop from CMS (e.g. data from components.json)
 * @param {boolean} [input.isStatic] - Force static/sticky position
 * @param {boolean} [input.solidBg] - Force solid background
 * @param {boolean|string} [input.header_static] - CMS data toggle for static header
 * @param {boolean|string} [input.header_solid] - CMS data toggle for solid header bg
 */
export function useHeaderConfig(input = { isStatic: true, solidBg: true }) {
    const pageCtx = usePageContext();

    const isTrue = (val) => val === true || val === "true" || val === 1 || val === "1";
    const isDefined = (val) => val !== undefined && val !== null;

    const hasCMSFields = isDefined(input?.header_static) || isDefined(input?.header_solid);

    const isStatic = hasCMSFields
        ? isTrue(input?.header_static)
        : Boolean(input?.isStatic ?? input?.is_static ?? true);

    const solidBg = hasCMSFields
        ? isTrue(input?.header_solid)
        : Boolean(input?.solidBg ?? input?.solid_bg ?? input?.bg_dark ?? true);

    const configString = JSON.stringify({ isStatic, solidBg });

    useIsomorphicEffect(() => {
        if (pageCtx?.setHeaderConfig) {
            pageCtx.setHeaderConfig({
                isSolid: solidBg || isStatic,
                isStatic: isStatic,
            });
        }

        return () => {
            if (pageCtx?.setHeaderConfig) {
                pageCtx.setHeaderConfig({
                    isSolid: false,
                    isStatic: false,
                });
            }
        };
    }, [configString]);
}

export default useHeaderConfig;
