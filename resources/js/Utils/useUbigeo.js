// Nuevo hook useUbigeo.js
import { useCallback, useState } from "react";
import { debounce } from "lodash";

export const useUbigeo = () => {
    const [ubigeoOptions, setUbigeoOptions] = useState([]);
    const [loadingUbigeo, setLoadingUbigeo] = useState(false);

    const searchUbigeo = useCallback(
        debounce(async (searchTerm) => {
            if (searchTerm.length < 3) return;

            setLoadingUbigeo(true);
            try {
                const response = await fetch(
                    `/api/ubigeo/search?q=${encodeURIComponent(searchTerm)}`
                );
                const data = await response.json();

                const options = data.map((item) => ({
                    value: item.reniec,
                    label: `${item.distrito}, ${item.provincia}, ${item.departamento}`,
                    inei: item.inei,
                    data: item,
                }));

                setUbigeoOptions(options);
            } catch (error) {
                console.error("Error searching ubigeo:", error);
            }
            setLoadingUbigeo(false);
        }, 300),
        []
    );

    return { ubigeoOptions, loadingUbigeo, searchUbigeo };
};
