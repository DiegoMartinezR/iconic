import { Fetch, Notify } from "sode-extend-react";
import { toast } from "sonner";
import { CheckCircle, XCircle, Info } from "lucide-react";
import React from "react";

class DeliveryPricesRest {
    static getShippingCost = async (request) => {
        try {
            const { status, result } = await Fetch("./api/delivery-prices", {
                method: "POST",
                body: JSON.stringify(request),
            });
            if (!status)
                throw new Error(result?.message || "Error al obtener datos");

            // toast.success('Operacion correcta', {
            //     description: `Se obtuvo correctamente el precio de envio`,
            //     icon: React.createElement(CheckCircle, { className: "h-5 w-5 text-green-500" }),
            //     duration: 3000,
            //     position: 'top-right',
            // });

            return result;
        } catch (error) {
            // toast.success('Error', {
            //     description: error.message,
            //     icon: React.createElement(XCircle, { className: "h-5 w-5 text-red-500" }),
            //     duration: 3000,
            //     position: 'top-right',
            // });
           
            return false;
        }
    };

    static getCosts = async (request) => {
        try {
            const { status, result } = await Fetch("./api/prices-type", {
                method: "POST",
            });
            if (!status)
                throw new Error(result?.message || "Error al obtener datos");

            // toast.success("¡Excelente!", {
            //     description: "Obtuvimos el precio de envio correctamente",
              
            //     duration: 3000,
            //     position: "bottom-center",
            //    richColors:true
            // });
         

            return result;
        } catch (error) {
            // toast.error("¡Error!", {
            //     description: error.message,
              
            //     duration: 3000,
            //     position: "bottom-center",
            //    richColors:true
            // });
            return false;
        }
    };
}

export default DeliveryPricesRest;
