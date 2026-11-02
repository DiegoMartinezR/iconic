import BaseAdminto from "@Adminto/Base";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Table from "../Components/Adminto/Table";
import Modal from "../Components/Adminto/Modal";
import CreateReactScript from "../Utils/CreateReactScript";
import BasicRest from "../Actions/BasicRest";
import ReactAppend from "../Utils/ReactAppend";
import Swal from "sweetalert2";
import { Fetch } from "sode-extend-react";

class VaultRest extends BasicRest {
    path = "seller/vault";

    updateDestination = async (data) => {
        const { status, result } = await Fetch(`/api/${this.path}/destination`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        if (!status) {
            throw new Error(result?.message || "Ocurrió un error al actualizar el destino.");
        }
        return result;
    };
}

const vaultRest = new VaultRest();

const Vault = ({ whatsapp_phone, session }) => {
    const gridRef = useRef();
    const destinationModalRef = useRef();

    const [selectedVault, setSelectedVault] = useState(null);
    const [destination, setDestination] = useState("for_sale");
    const [claimType, setClaimType] = useState("delivery");
    const [claimAddress, setClaimAddress] = useState("");
    const [claimNotes, setClaimNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const openDestinationModal = (data) => {
        setSelectedVault(data);
        setDestination(data.destination || "for_sale");
        setClaimType(data.claim_type || "delivery");
        setClaimAddress(data.claim_address || "");
        setClaimNotes(data.claim_notes || "");
        $(destinationModalRef.current).modal("show");
    };

    const handleWhatsAppCoordination = (data) => {
        const phone = whatsapp_phone || "51999999999";
        const productName = data.item?.name || "Producto";
        const qty = data.quantity || 1;
        const modality = data.claim_type === "delivery" ? "Delivery a domicilio" : "Recojo en tienda";
        const address = data.claim_address ? `\n*Dirección:* ${data.claim_address}` : "";
        const notes = data.claim_notes ? `\n*Notas:* ${data.claim_notes}` : "";

        const message = `¡Hola! Soy ${session?.name || "Vendedor"} (${session?.email || ""}).\n`
            + `He solicitado reclamar mi producto de la bóveda:\n`
            + `📦 *Producto:* ${productName} (x${qty} unid.)\n`
            + `🛵 *Modalidad:* ${modality}`
            + address
            + notes + `\n\n`
            + `Deseo coordinar la entrega. ¡Muchas gracias!`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    const handleSaveDestination = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!selectedVault?.id) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se ha seleccionado ningún producto.",
            });
            return;
        }

        if (destination === "claim_physical" && claimType === "delivery" && !claimAddress.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Dirección requerida",
                text: "Por favor, ingresa la dirección de entrega para la modalidad de delivery.",
            });
            return;
        }

        setLoading(true);
        try {
            const res = await vaultRest.updateDestination({
                id: selectedVault.id,
                destination,
                claim_type: destination === "claim_physical" ? claimType : null,
                claim_address: destination === "claim_physical" ? claimAddress : null,
                claim_notes: destination === "claim_physical" ? claimNotes : null,
            });

            if (res && (res.status === 200 || res.status === true)) {
                $(destinationModalRef.current).modal("hide");

                if (destination === "claim_physical") {
                    if (res.whatsapp_url) {
                        window.open(res.whatsapp_url, "_blank");
                    }
                    Swal.fire({
                        icon: "success",
                        title: "¡Reclamo Registrado!",
                        html: `Tu solicitud de reclamo físico fue guardada exitosamente.<br><br>Se ha abierto WhatsApp para que coordines la entrega con administración. Si tu navegador bloqueó la ventana emergente, puedes usar el botón verde de WhatsApp en la tabla.`,
                    });
                } else {
                    Swal.fire({
                        icon: "success",
                        title: "¡Configurado para Tienda!",
                        text: "El producto ahora está habilitado para venderse en tu tienda online. Si se vende, ¡ganarás el 100% de la venta!",
                    });
                }

                $(gridRef.current).dxDataGrid("instance").refresh();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: res?.message || "Ocurrió un error al actualizar el destino del producto.",
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.message || "No se pudo comunicar con el servidor. Inténtalo nuevamente.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="row mb-3">
                <div className="col-12">
                    <div className="card bg-soft-primary border-primary border-opacity-25 shadow-none mb-0">
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center">
                                <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0">
                                    <i className="fas fa-boxes text-white fs-4"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="text-primary fw-bold mb-1">
                                        ¿Cómo funciona tu Bóveda de Inventario?
                                    </h5>
                                    <p className="text-muted mb-0 small">
                                        Aquí se guardan tus productos obtenidos por metas y premios. Puedes elegir destinarlos para 
                                        <b className="text-dark"> Vender en tu Tienda Online</b> (ganas el 100% del valor al venderse) o 
                                        <b className="text-dark"> Reclamar en Físico</b> (para uso personal mediante delivery o recojo en tienda previa coordinación por WhatsApp).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Table
                gridRef={gridRef}
                title="Mi Bóveda de Productos"
                rest={vaultRest}
                pageSize={10}
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            hint: "Refrescar inventario",
                            onClick: () =>
                                $(gridRef.current).dxDataGrid("instance").refresh(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "item.name",
                        caption: "Producto / Premio",
                        width: "35%",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <div className="d-flex align-items-center py-2">
                                    <div className="flex-shrink-0 me-3">
                                        {data.item?.image ? (
                                            <img
                                                src={`/${data.item.image}`}
                                                alt={data.item?.name}
                                                className="rounded border"
                                                style={{ width: "45px", height: "45px", objectFit: "cover" }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className="avatar-sm bg-soft-success rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "45px",
                                                height: "45px",
                                                display: data.item?.image ? 'none' : 'flex'
                                            }}
                                        >
                                            <i className="fas fa-gift text-success fs-5"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold text-dark">
                                            {data.item?.name}
                                        </h6>
                                        <small className="text-muted">
                                            {data.item?.category?.name || "Premio Especial"}
                                        </small>
                                    </div>
                                </div>,
                            );
                        },
                    },
                    {
                        dataField: "item.sku",
                        caption: "SKU / Código",
                        alignment: "center",
                        width: "15%",
                        cellTemplate: (container, { data }) => {
                            $(container).html(
                                `<span class="badge bg-light text-dark border font-monospace px-2 py-1">${data.item?.sku || data.item_id.substring(0, 8)}</span>`,
                            );
                        },
                    },
                    {
                        dataField: "quantity",
                        caption: "Stock en Bóveda",
                        alignment: "center",
                        width: "15%",
                        cellTemplate: (container, { data }) => {
                            const colorClass = data.quantity > 0 ? "bg-success" : "bg-danger";
                            const iconClass = data.quantity > 0 ? "fa-layer-group" : "fa-exclamation-triangle";
                            $(container).html(`
                                <span class="badge ${colorClass} rounded-pill px-3 py-2 shadow-sm">
                                    <i class="fas ${iconClass} me-1"></i>
                                    ${data.quantity} unid.
                                </span>
                            `);
                        },
                    },
                    {
                        dataField: "destination",
                        caption: "Destino / Uso",
                        alignment: "center",
                        width: "20%",
                        cellTemplate: (container, { data }) => {
                            if (data.destination === "claim_physical") {
                                const modalityText = data.claim_type === "delivery" ? "🛵 Delivery" : "🏬 Recojo";
                                let statusBadge = `<span class="badge bg-soft-warning text-warning border border-warning border-opacity-25 ms-1">Pendiente coord.</span>`;
                                if (data.claim_status === "coordinated") {
                                    statusBadge = `<span class="badge bg-soft-info text-info border border-info border-opacity-25 ms-1">Coordinado</span>`;
                                } else if (data.claim_status === "delivered") {
                                    statusBadge = `<span class="badge bg-soft-success text-success border border-success border-opacity-25 ms-1">Entregado</span>`;
                                }

                                $(container).html(`
                                    <div class="py-1">
                                        <span class="badge bg-soft-primary text-primary border border-primary border-opacity-25 px-2 py-1 fw-bold">
                                            <i class="fas fa-hand-holding-box me-1"></i> Reclamo Físico
                                        </span>
                                        <div class="small text-muted mt-1">
                                            <span>${modalityText}</span> ${statusBadge}
                                        </div>
                                    </div>
                                `);
                            } else {
                                $(container).html(`
                                    <div class="py-1">
                                        <span class="badge bg-soft-success text-success border border-success border-opacity-25 px-2 py-1 fw-bold">
                                            <i class="fas fa-store me-1"></i> Tienda Online
                                        </span>
                                        <div class="small text-success mt-1 fw-semibold">
                                            <i class="fas fa-check-circle me-1"></i> 100% de ganancia
                                        </div>
                                    </div>
                                `);
                            }
                        },
                    },
                    {
                        caption: "Acciones",
                        alignment: "center",
                        width: "15%",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <div className="d-flex justify-content-center align-items-center gap-1">
                                    <button
                                        type="button"
                                        className="btn btn-xs btn-outline-primary waves-effect waves-light d-flex align-items-center"
                                        onClick={() => openDestinationModal(data)}
                                        title="Configurar si deseas venderlo en tienda o reclamarlo en físico"
                                    >
                                        <i className="fas fa-cog me-1"></i> Destino
                                    </button>

                                    {data.destination === "claim_physical" && (
                                        <button
                                            type="button"
                                            className="btn btn-xs btn-success waves-effect waves-light"
                                            onClick={() => handleWhatsAppCoordination(data)}
                                            title="Coordinar entrega por WhatsApp"
                                        >
                                            <i className="fab fa-whatsapp"></i>
                                        </button>
                                    )}
                                </div>,
                            );
                        },
                    },
                ]}
            />

            {/* Modal para configurar destino del producto */}
            <Modal
                modalRef={destinationModalRef}
                title="Configurar Destino del Producto"
                size="lg"
                hideFooter
                onSubmit={handleSaveDestination}
            >
                {selectedVault && (
                    <div>
                        {/* Resumen del Producto */}
                        <div className="card bg-light border-0 mb-3">
                            <div className="card-body p-3 d-flex align-items-center">
                                <div className="avatar-md bg-white rounded border d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: "55px", height: "55px" }}>
                                    <i className="fas fa-gift text-primary fs-3"></i>
                                </div>
                                <div>
                                    <h5 className="mb-1 text-dark fw-bold">{selectedVault.item?.name}</h5>
                                    <p className="text-muted mb-0 small">
                                        <span className="badge bg-secondary me-2">SKU: {selectedVault.item?.sku || "S/N"}</span>
                                        <span>Stock disponible en bóveda: <b className="text-dark">{selectedVault.quantity} unidades</b></span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold text-dark fs-5 mb-2">
                                ¿Cómo deseas utilizar este producto?
                            </label>

                            <div className="row g-3">
                                {/* Opción 1: Vender en tienda */}
                                <div className="col-md-6">
                                    <div
                                        className={`card h-100 border p-3 cursor-pointer transition-all ${
                                            destination === "for_sale"
                                                ? "border-success bg-soft-success shadow-sm"
                                                : "border-light bg-white hover-border-secondary"
                                        }`}
                                        style={{ cursor: "pointer", transition: "all 0.2s" }}
                                        onClick={() => setDestination("for_sale")}
                                    >
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="destination_radio"
                                                id="dest_for_sale"
                                                checked={destination === "for_sale"}
                                                onChange={() => setDestination("for_sale")}
                                            />
                                            <label className="form-check-label fw-bold text-dark fs-6 cursor-pointer" htmlFor="dest_for_sale">
                                                🏪 Vender en mi tienda online
                                            </label>
                                        </div>
                                        <p className="text-muted small mt-2 mb-0 ps-4">
                                            Estará disponible para tus clientes a través de tu link de referidor. Si lo compran (incluso con stock central agotado), <b>¡ganarás el 100% del valor de la venta!</b>
                                        </p>
                                    </div>
                                </div>

                                {/* Opción 2: Reclamar en físico */}
                                <div className="col-md-6">
                                    <div
                                        className={`card h-100 border p-3 cursor-pointer transition-all ${
                                            destination === "claim_physical"
                                                ? "border-primary bg-soft-primary shadow-sm"
                                                : "border-light bg-white hover-border-secondary"
                                        }`}
                                        style={{ cursor: "pointer", transition: "all 0.2s" }}
                                        onClick={() => setDestination("claim_physical")}
                                    >
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="destination_radio"
                                                id="dest_claim_physical"
                                                checked={destination === "claim_physical"}
                                                onChange={() => setDestination("claim_physical")}
                                            />
                                            <label className="form-check-label fw-bold text-dark fs-6 cursor-pointer" htmlFor="dest_claim_physical">
                                                📦 Reclamar en físico
                                            </label>
                                        </div>
                                        <p className="text-muted small mt-2 mb-0 ps-4">
                                            Retira este producto para tu uso personal. No estará disponible para venta online. Coordinarás el delivery o recojo en tienda por WhatsApp.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Opciones adicionales si elige Reclamar en físico */}
                        {destination === "claim_physical" && (
                            <div className="border border-primary border-opacity-25 rounded p-3 bg-white mb-3">
                                <h6 className="fw-bold text-primary mb-3">
                                    <i className="fas fa-truck me-1"></i> Detalles para la entrega
                                </h6>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-dark">Modalidad de entrega:</label>
                                    <div className="d-flex gap-4">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="claim_type_radio"
                                                id="claim_delivery"
                                                checked={claimType === "delivery"}
                                                onChange={() => setClaimType("delivery")}
                                            />
                                            <label className="form-check-label text-dark fw-medium" htmlFor="claim_delivery">
                                                🛵 Delivery a domicilio
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="claim_type_radio"
                                                id="claim_pickup"
                                                checked={claimType === "store_pickup"}
                                                onChange={() => setClaimType("store_pickup")}
                                            />
                                            <label className="form-check-label text-dark fw-medium" htmlFor="claim_pickup">
                                                🏬 Recojo en tienda física
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {claimType === "delivery" && (
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-dark">
                                            Dirección de entrega <span className="text-danger">*</span>:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Ej: Av. Benavides 1234, Dpto 502, Miraflores, Lima"
                                            value={claimAddress}
                                            onChange={(e) => setClaimAddress(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-dark">
                                        Notas o referencias (opcional):
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        placeholder="Ej: Entregar preferentemente por las tardes. Teléfono de contacto alternativo: 987654321."
                                        value={claimNotes}
                                        onChange={(e) => setClaimNotes(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="alert alert-info border-0 mb-0 py-2 px-3 small d-flex align-items-center">
                                    <i className="fab fa-whatsapp fs-3 me-2 text-success"></i>
                                    <div>
                                        Al guardar, se abrirá WhatsApp con el mensaje listo para coordinar la fecha y envío con la administración de la empresa.
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                            <button
                                type="button"
                                className="btn btn-light"
                                data-bs-dismiss="modal"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={`btn ${destination === "claim_physical" ? "btn-success" : "btn-primary"} px-4`}
                                disabled={loading}
                            >
                                {loading && <i className="mdi mdi-loading mdi-spin me-1"></i>}
                                {destination === "claim_physical" ? (
                                    <>
                                        <i className="fab fa-whatsapp me-1"></i> Guardar y Coordinar por WhatsApp
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-check me-1"></i> Guardar para Mi Tienda
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Mi Bóveda">
            <Vault {...properties} />
        </BaseAdminto>,
    );
});
