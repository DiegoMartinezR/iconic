import { Fetch, Notify } from "sode-extend-react";

export const recoveryOrderData = ({ code }) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("Codigo de venta:", code);
        // Crear preferencia en el servidor
        const { status, result } = await Fetch("./api/orders", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
        },
          body: JSON.stringify({ code }),
        })
  
        if (!status || !result.order) {
          Notify.add({
            icon: "/assets/resources/icon.png",
            title: "Error",
            body: result?.message || "Error no se pudo cargar la orden",
            type: "danger",
          })
          reject(result?.message || "Error no se pudo cargar la orde")
          return
        }
        // Devolver información para seguimiento
        resolve(result)
      } catch (error) {
        console.error("Error en processMercadoPagoPayment:", error)
        Notify.add({
          icon: "/assets/resources/icon.png",
          title: "Error",
          body: error.message || "Error en la integración con MercadoPago",
          type: "danger",
        })
        reject(error.message || "Error en la integración con MercadoPago")
      }
    })
  }
