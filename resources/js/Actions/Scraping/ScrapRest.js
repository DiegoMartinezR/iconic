/*class ScrapRest {
    static getProducts = async (request) => {
        console.log(request);
        try {
            const { status, result } = await Fetch("./api/scrap", {
                method: "POST",
                body: JSON.stringify(request),
            });
            if (!status)
                console.log(result?.message || "Error al obtener datos");

            Notify.add({
                icon: "/assets/resources/icon.png",
                title: "Operacion correcta",
                body: "Se obtuvo correctamente el precio de envio",
            });

            return result;
        } catch (error) {
            Notify.add({
                icon: "/assets/resources/icon.png",
                title: "Error",
                body: error.message,
                type: "danger",
            });
            return false;
        }
    };
}*/
import { Fetch, Notify } from "sode-extend-react";

class ScrapRest {
    static getProducts = async (request) => {
        console.log(request);
        try {
            const { query, proveedor, page, limit = 12 } = request;

            /*if (proveedor === "shopsimon") {
                const { status, result } = await Fetch(
                    "./api/scrap-shopsimon",
                    {
                        method: "POST",
                        body: JSON.stringify({ query, proveedor, page, limit }),
                    }
                );
                if (!status) {
                    console.log(result?.message || "Error al obtener datos");
                    return { data: [], hasMore: false };
                }

                Notify.add({
                    icon: "/assets/resources/icon.png",
                    title: "Operación correcta",
                    body: "Se obtuvieron los productos correctamente",
                });

                return {
                    data: result.data || [],
                    hasMore: result.data.length === limit, // Si la cantidad recibida es menor al límite, no hay más datos
                };
            }*/
            // Petición al backend con paginación
            const { status, result } = await Fetch("./api/scrap", {
                method: "POST",
                body: JSON.stringify({
                    query,
                    proveedor,
                    page,
                    limit,
                }),
            });

            if (!status) {
                console.log(result?.message || "Error al obtener datos");
                return { data: [], hasMore: false };
            }

            Notify.add({
                icon: "/assets/resources/icon.png",
                title: "Operación correcta",
                body: "Se obtuvieron los productos correctamente",
            });

            return {
                data: result.data || [],
                filters: result.filters || [],
                hasMore: result.data.length === limit, // Si la cantidad recibida es menor al límite, no hay más datos
            };
        } catch (error) {
            Notify.add({
                icon: "/assets/resources/icon.png",
                title: "Error",
                body: error.message,
                type: "danger",
            });
            return { data: [], filters: [], hasMore: false };
        }
    };

    static getPaginatedProducts = async (request) => {
        try {
            const { query, proveedor, page, limit = 10 } = request;

            // Petición para cargar más productos
            const { status, result } = await Fetch("./api/scrap", {
                method: "POST",
                body: JSON.stringify({ query, proveedor, page, limit }),
            });

            if (!status) {
                console.log(result?.message || "Error al obtener más datos");
                return { data: [], hasMore: false };
            }

            return {
                data: result.data || [],
                hasMore: result.data.length === limit,
            };
        } catch (error) {
            Notify.add({
                icon: "/assets/resources/icon.png",
                title: "Error",
                body: error.message,
                type: "danger",
            });
            return { data: [], hasMore: false };
        }
    };
}

export default ScrapRest;

/*
  static getPaginatedProducts = async (request) => {
        try {
            const { query, proveedor, page } = request;

            // Segunda petición: Obtener más productos por página
            const { status, result } = await Fetch(
                "./api/scrap-nike-paginate",
                {
                    method: "POST",
                    body: JSON.stringify({ query, proveedor, page }),
                }
            );

            if (!status) {
                console.log(result?.message || "Error al obtener más datos");
                return { data: [], hasMore: false };
            }

            return {
                data: result.data || [],
                hasMore: result.hasMore || false,
            };
        } catch (error) {
            Notify.add({
                icon: "/assets/resources/icon.png",
                title: "Error",
                body: error.message,
                type: "danger",
            });
            return { data: [], hasMore: false };
        }
    };
*/
