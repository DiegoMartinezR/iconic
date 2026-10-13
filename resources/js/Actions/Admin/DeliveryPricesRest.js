import BasicRest from "@Rest/BasicRest.js";
import { Cookies } from "sode-extend-react";

class DeliveryPricesRest extends BasicRest {
    path = "admin/prices";

    upload = async (formData) => {
        try {
            const response = await fetch(`/api/${this.path}/massive`, {
                // Cambia la URL según tu backend
                method: "POST",
                headers: {
                    "X-Xsrf-Token": decodeURIComponent(
                        Cookies.get("XSRF-TOKEN")
                    ),
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al subir el archivo");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            return null;
        }
    };

    downloadTemplate = () => {
        window.open(`/api/${this.path}/download-template`, '_blank');
    };

    previewImport = async (formData) => {
        try {
            const response = await fetch(`/api/${this.path}/preview-import`, {
                method: "POST",
                headers: {
                    "X-Xsrf-Token": decodeURIComponent(
                        Cookies.get("XSRF-TOKEN")
                    ),
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al analizar el archivo");
            }

            const result = await response.json();
            return result.data ?? result;
        } catch (error) {
            console.error("Error en previewImport:", error);
            throw error;
        }
    };

    importData = async (formData) => {
        try {
            const response = await fetch(`/api/${this.path}/import-mapped`, {
                method: "POST",
                headers: {
                    "X-Xsrf-Token": decodeURIComponent(
                        Cookies.get("XSRF-TOKEN")
                    ),
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error en la importación");
            }

            const result = await response.json();
            return result.data ?? result;
        } catch (error) {
            console.error("Error en importData:", error);
            throw error;
        }
    };

    bulkUpdate = async (data) => {
        try {
            const response = await fetch(`/api/${this.path}/bulk-update`, {
                method: "POST",
                headers: {
                    "X-Xsrf-Token": decodeURIComponent(
                        Cookies.get("XSRF-TOKEN")
                    ),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al realizar el ajuste masivo");
            }

            const result = await response.json();
            return result.data ?? result;
        } catch (error) {
            console.error("Error en bulkUpdate:", error);
            throw error;
        }
    };

    validateReniec = async () => {
        try {
            const response = await fetch(`/api/${this.path}/validate-reniec`, {
                method: "POST",
                headers: {
                    "X-Xsrf-Token": decodeURIComponent(
                        Cookies.get("XSRF-TOKEN")
                    ),
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al validar RENIEC");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error en validateReniec:", error);
            throw error;
        }
    };
}

export default DeliveryPricesRest;

