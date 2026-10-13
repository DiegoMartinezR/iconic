import React, { useState } from "react";
import DeliveryPricesRest from "../../Actions/Admin/DeliveryPricesRest";
import { toast } from "sonner";

const deliverypricesRest = new DeliveryPricesRest();

const SYSTEM_FIELDS = [
    { key: "ubigeo", label: "Código de Ubigeo (RENIEC / INEI)", required: true, icon: "fas fa-map-pin", description: "Código único de 6 dígitos del distrito" },
    { key: "price", label: "Precio Delivery Estándar (S/)", required: false, icon: "fas fa-tag", description: "Tarifa normal de envío" },
    { key: "is_standard", label: "Habilitar Delivery Estándar", required: false, icon: "fas fa-toggle-on", description: "1 / Sí / True (Si aplica entrega normal)" },
    { key: "is_free", label: "Habilitar Envío Gratis", required: false, icon: "fas fa-gift", description: "1 / Sí / True (Si el costo es S/ 0)" },
    { key: "is_express", label: "Habilitar Delivery Express", required: false, icon: "fas fa-shipping-fast", description: "1 / Sí / True (Envío veloz)" },
    { key: "express_price", label: "Precio Delivery Express (S/)", required: false, icon: "fas fa-dollar-sign", description: "Monto diferencial express" },
    { key: "is_agency", label: "Habilitar Recojo en Agencia", required: false, icon: "fas fa-warehouse", description: "1 / Sí / True (Entrega en transporte)" },
    { key: "agency_price", label: "Precio Agencia (S/)", required: false, icon: "fas fa-calculator", description: "Costo flete agencia" },
    { key: "agency_payment_on_delivery", label: "Pago en Destino (Agencia)", required: false, icon: "fas fa-hand-holding-usd", description: "1 / Sí / True (Flete por cobrar en destino)" },
    { key: "is_store_pickup", label: "Habilitar Retiro en Tienda", required: false, icon: "fas fa-store", description: "1 / Sí / True (Pickup presencial)" },
    { key: "selected_stores", label: "Tiendas Seleccionadas (Nombres por comas)", required: false, icon: "fas fa-store-alt", description: "Opcional. Nombres o IDs de tiendas separadas por comas (ej: Tienda Principal, Miraflores)" },
];

const ModalImportDeliveryPrices = ({ gridRef, modalRef }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [importMode, setImportMode] = useState("add_update"); // "add_update" o "reset"
    const [step, setStep] = useState("upload"); // "upload", "mapping"

    // Preview states
    const [headers, setHeaders] = useState([]);
    const [sampleRows, setSampleRows] = useState([]);
    const [mappings, setMappings] = useState({});

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setMessage("");
        setIsError(false);
        setPreviewLoading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await deliverypricesRest.previewImport(formData);
            if (response.success && response.preview) {
                const fileHeaders = response.preview.headers || [];
                setHeaders(fileHeaders);
                setSampleRows(response.preview.sample_rows || []);

                // Generar auto-mapeo inteligente por coincidencia de nombres
                const initialMappings = {};
                SYSTEM_FIELDS.forEach((field) => {
                    const matchedHeader = fileHeaders.find((h) => {
                        if (!h) return false;
                        const hClean = h.toString().toLowerCase().replace(/_/g, " ").trim();

                        switch (field.key) {
                            case "ubigeo":
                                return hClean.includes("ubigeo") || hClean.includes("reniec") || hClean.includes("codigo");
                            case "price":
                                return hClean === "precio estandar" || hClean === "precio" || (hClean.includes("precio") && !hClean.includes("express") && !hClean.includes("agencia"));
                            case "is_standard":
                                return hClean.includes("delivery estandar activo") || hClean.includes("estandar activo") || hClean === "is standard" || hClean === "delivery estandar";
                            case "is_free":
                                return hClean.includes("envio gratis") || hClean.includes("gratis") || hClean.includes("free");
                            case "is_express":
                                return hClean.includes("delivery express activo") || hClean.includes("express activo") || hClean === "is express" || (hClean.includes("express") && hClean.includes("activo"));
                            case "express_price":
                                return hClean.includes("precio express") || (hClean.includes("express") && hClean.includes("precio"));
                            case "is_agency":
                                return hClean.includes("recojo agencia activo") || hClean.includes("agencia activo") || hClean === "is agency" || (hClean.includes("agencia") && hClean.includes("activo"));
                            case "agency_price":
                                return hClean.includes("precio agencia") || (hClean.includes("agencia") && hClean.includes("precio"));
                            case "agency_payment_on_delivery":
                                return hClean.includes("pago en destino") || hClean.includes("destino") || hClean.includes("cobrar");
                            case "is_store_pickup":
                                return hClean.includes("retiro tienda activo") || hClean.includes("retiro tienda") || hClean.includes("retiro") || (hClean.includes("tienda") && hClean.includes("activo"));
                            case "selected_stores":
                                return hClean.includes("tiendas seleccionadas") || hClean.includes("tiendas") || hClean.includes("stores");
                            default:
                                return false;
                        }
                    });

                    initialMappings[field.key] = matchedHeader || "";
                });

                setMappings(initialMappings);
                setStep("mapping");
            } else {
                throw new Error("No se pudo analizar la estructura del archivo.");
            }
        } catch (error) {
            setMessage("Error al leer el archivo: " + (error.message || "Formato no compatible."));
            setIsError(true);
            setFile(null);
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleMappingChange = (sysKey, headerValue) => {
        setMappings((prev) => ({
            ...prev,
            [sysKey]: headerValue,
        }));
    };

    const handleBack = () => {
        setStep("upload");
        setFile(null);
        setHeaders([]);
        setSampleRows([]);
        setMappings({});
        setMessage("");
        setIsError(false);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Por favor, selecciona un archivo.");
            setIsError(true);
            return;
        }

        if (!mappings["ubigeo"]) {
            setMessage("Debe mapear la columna obligatoria de Código de Ubigeo.");
            setIsError(true);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("mode", importMode);

        const formattedMappings = {};
        Object.keys(mappings).forEach((sysKey) => {
            if (mappings[sysKey]) {
                formattedMappings[sysKey] = [mappings[sysKey]];
            }
        });
        formData.append("field_mappings", JSON.stringify(formattedMappings));

        setLoading(true);
        setMessage("");

        try {
            const result = await deliverypricesRest.importData(formData);

            if (result.error) {
                const errors = Array.isArray(result.error) ? result.error.join("\n") : result.error;
                setMessage(`Error en la importación:\n${errors}`);
                setIsError(true);
            } else {
                setMessage(result.message);
                setIsError(false);

                try {
                    if (gridRef && gridRef.current) {
                        const gridInstance = $(gridRef.current).dxDataGrid("instance");
                        if (gridInstance) gridInstance.refresh();
                    }
                } catch (e) {
                    console.error("Error al refrescar la grilla:", e);
                }

                toast.success("¡Importación exitosa!", {
                    description: result.message || "Las tarifas han sido procesadas correctamente.",
                    duration: 4000,
                    position: "bottom-center",
                    richColors: true,
                });

                setTimeout(() => {
                    const modalEl = modalRef?.current;
                    if (modalEl) {
                        const closeBtn = modalEl.querySelector('[data-bs-dismiss="modal"]');
                        if (closeBtn) closeBtn.click();
                        else $(modalEl).modal("hide");
                    }
                    handleBack();
                }, 1500);
            }
        } catch (error) {
            setMessage("Error al importar: " + (error.message || "Ocurrió un error en el servidor."));
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const getMappedSampleValue = (sysKey, rowIndex) => {
        const mappedHeader = mappings[sysKey];
        if (!mappedHeader) return <span className="text-muted fst-italic">No asignado</span>;

        const headerIndex = headers.indexOf(mappedHeader);
        if (headerIndex === -1) return <span className="text-danger">Columna no encontrada</span>;

        const row = sampleRows[rowIndex];
        if (!row || row[headerIndex] === undefined || row[headerIndex] === null || row[headerIndex] === "") {
            return <span className="text-muted fst-italic">[Vacío]</span>;
        }

        const value = String(row[headerIndex]);
        if (value.length > 35) return value.substring(0, 32) + "...";
        return value;
    };

    const handleDownloadTemplate = () => {
        deliverypricesRest.downloadTemplate();
    };

    return (
        <div className="w-100 px-2 py-1">

            {/* Banner Descargar Plantilla Excel */}
            <div className="p-3 bg-light rounded-4 mb-4 border shadow-sm d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <div className="p-2.5 bg-success text-white rounded-3">
                        <i className="fas fa-file-excel fs-4"></i>
                    </div>
                    <div>
                        <strong className="text-dark d-block">Plantilla Excel Oficial de Ubigeos</strong>
                        <small className="text-muted">Incluye Departamento, Provincia, Distrito y Código RENIEC de todos los distritos de Perú.</small>
                    </div>
                </div>
                <button
                    type="button"
                    className="btn btn-outline-success btn-sm px-3 py-2 rounded-pill fw-bold shadow-sm"
                    onClick={handleDownloadTemplate}
                >
                    <i className="fas fa-download me-2"></i>Descargar Plantilla Excel
                </button>
            </div>

            {/* Mensajes de Alerta */}
            {message && (
                <div className={`alert ${isError ? "alert-danger" : "alert-success"} rounded-3 shadow-sm mb-4`} role="alert">
                    <div className="d-flex align-items-start gap-2">
                        <i className={`fas ${isError ? "fa-exclamation-triangle" : "fa-check-circle"} fs-5 mt-1`}></i>
                        <div className="flex-grow-1">
                            <strong style={{ fontSize: "14px" }}>{isError ? "Atención requerida" : "Proceso completado"}</strong>
                            <div className="mt-1 small" style={{ whiteSpace: "pre-line" }}>{message}</div>
                        </div>
                    </div>
                </div>
            )}

            {step === "upload" ? (
                <>
                    {/* Tarjetas de Selección de Modo */}
                    <div className="mb-4">
                        <label className="form-label text-dark fw-bold mb-2 fs-6">
                            <i className="fas fa-cog text-primary me-2"></i>Selecciona el Modo de Importación
                        </label>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <div
                                    className={`card rounded-4 transition-all ${importMode === "add_update" ? "border-primary shadow-sm bg-primary-subtle" : "border bg-white"}`}
                                    style={{ cursor: "pointer", borderWidth: importMode === "add_update" ? "2px" : "1px" }}
                                    onClick={() => setImportMode("add_update")}
                                >
                                    <div className="card-body p-3">
                                        <div className="d-flex align-items-start gap-3">
                                            <div
                                                className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${importMode === "add_update" ? "bg-primary text-white" : "bg-light text-muted"}`}
                                                style={{ width: "44px", height: "44px" }}
                                            >
                                                <i className="fas fa-sync-alt fs-5"></i>
                                            </div>
                                            <div>
                                                <h6 className="fw-bold text-dark mb-1">Agregar / Actualizar Existentes</h6>
                                                <p className="text-muted small mb-0" style={{ lineHeight: "1.4" }}>
                                                    Actualiza las tarifas de los ubigeos coincidentes y registra nuevos ubigeos sin borrar el catálogo actual.
                                                </p>
                                                <span className="badge bg-primary mt-2">Recomendado</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div
                                    className={`card rounded-4 transition-all ${importMode === "reset" ? "border-danger shadow-sm bg-danger-subtle" : "border bg-white"}`}
                                    style={{ cursor: "pointer", borderWidth: importMode === "reset" ? "2px" : "1px" }}
                                    onClick={() => setImportMode("reset")}
                                >
                                    <div className="card-body p-3">
                                        <div className="d-flex align-items-start gap-3">
                                            <div
                                                className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${importMode === "reset" ? "bg-danger text-white" : "bg-light text-muted"}`}
                                                style={{ width: "44px", height: "44px" }}
                                            >
                                                <i className="fas fa-trash-restore fs-5"></i>
                                            </div>
                                            <div>
                                                <h6 className="fw-bold text-dark mb-1">Limpiar y Reemplazar Desde Cero</h6>
                                                <p className="text-muted small mb-0" style={{ lineHeight: "1.4" }}>
                                                    Elimina todos los registros de envío actuales e importa una lista totalmente nueva desde el archivo.
                                                </p>
                                                <span className="badge bg-danger mt-2">Acción Destructiva</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Drag & Drop Area */}
                    <div className="mb-4">
                        <label className="form-label text-dark fw-bold mb-2 fs-6">
                            <i className="fas fa-cloud-upload-alt text-primary me-2"></i>Cargar Archivo de Datos
                        </label>
                        <div
                            className="p-4 border-2 border-dashed rounded-4 text-center bg-light shadow-sm position-relative overflow-hidden"
                            style={{
                                borderColor: "#0d6efd",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                            }}
                            onClick={() => document.getElementById("import-delivery-file-input").click()}
                        >
                            {previewLoading ? (
                                <div className="py-4">
                                    <span className="spinner-border spinner-border-lg text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status"></span>
                                    <h5 className="text-dark fw-bold mb-1">Analizando estructura del archivo...</h5>
                                    <p className="text-muted small mb-0">Detectando columnas, cabeceras y muestras de datos</p>
                                </div>
                            ) : (
                                <div className="py-3">
                                    <div className="d-inline-flex p-4 rounded-circle bg-white text-success shadow-sm mb-3">
                                        <i className="fas fa-file-excel fa-3x"></i>
                                    </div>
                                    <h5 className="text-dark fw-bold mb-2">Haz clic o arrastra tu archivo Excel aquí</h5>
                                    <p className="text-muted small mb-3">Formatos admitidos: Excel (<b>.xlsx, .xls</b>) o CSV (<b>.csv</b>)</p>
                                    <span className="btn btn-primary btn-sm px-4 py-2 rounded-pill shadow-sm">
                                        <i className="fas fa-search me-2"></i>Examinar Archivos
                                    </span>
                                </div>
                            )}
                        </div>
                        <input
                            id="import-delivery-file-input"
                            type="file"
                            accept=".xlsx,.xls,.csv,text/plain"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            disabled={previewLoading}
                        />
                    </div>
                </>
            ) : (
                <>
                    {/* File Banner */}
                    <div className="p-3 bg-white rounded-3 mb-4 d-flex align-items-center justify-content-between border shadow-sm">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 bg-success-subtle text-success rounded-3">
                                <i className="fas fa-file-excel fs-3"></i>
                            </div>
                            <div>
                                <h6 className="fw-bold text-dark mb-0">{file.name}</h6>
                                <span className="badge bg-secondary-subtle text-secondary me-2">{(file.size / 1024).toFixed(1)} KB</span>
                                <span className="text-muted small">Se detectaron <b>{headers.length} columnas</b>.</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm px-3 rounded-pill"
                            onClick={handleBack}
                            disabled={loading}
                        >
                            <i className="fas fa-arrow-left me-2"></i> Cambiar Archivo
                        </button>
                    </div>

                    <div className="row g-4">
                        {/* Mapper Column */}
                        <div className="col-lg-7">
                            <div className="card border rounded-4 shadow-sm">
                                <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                                    <h6 className="mb-0 fw-bold text-dark">
                                        <i className="fas fa-exchange-alt me-2 text-primary"></i>Mapeo de Columnas
                                    </h6>
                                    <span className="badge bg-primary-subtle text-primary">
                                        {Object.values(mappings).filter(Boolean).length} / {SYSTEM_FIELDS.length} Asignados
                                    </span>
                                </div>
                                <div className="card-body p-0" style={{ maxHeight: "480px", overflowY: "auto" }}>
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light sticky-top shadow-sm">
                                            <tr>
                                                <th className="px-3 py-3 text-dark fw-bold" style={{ width: "45%" }}>Campo del Sistema</th>
                                                <th className="px-3 py-3 text-dark fw-bold" style={{ width: "55%" }}>Columna en tu Excel</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {SYSTEM_FIELDS.map((field) => (
                                                <tr key={field.key}>
                                                    <td className="px-3 py-2">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <i className={`${field.icon} text-muted`}></i>
                                                            <div>
                                                                <div className="d-flex align-items-center">
                                                                    <span className="fw-bold text-dark small">{field.label}</span>
                                                                    {field.required && (
                                                                        <span className="badge bg-danger ms-2" style={{ fontSize: "9px" }}>REQUERIDO</span>
                                                                    )}
                                                                </div>
                                                                <span className="text-muted d-block" style={{ fontSize: "11px" }}>{field.description}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <select
                                                            className={`form-select form-select-sm rounded-3 ${field.required && !mappings[field.key] ? "border-danger bg-danger-subtle" : mappings[field.key] ? "border-success bg-success-subtle" : ""}`}
                                                            value={mappings[field.key] || ""}
                                                            onChange={(e) => handleMappingChange(field.key, e.target.value)}
                                                        >
                                                            <option value="">-- No Importar --</option>
                                                            {headers.map((h) => (
                                                                <option key={h} value={h}>{h}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Preview Column */}
                        <div className="col-lg-5">
                            <div className="card border rounded-4 shadow-sm">
                                <div className="card-header bg-white py-3 border-bottom">
                                    <h6 className="mb-0 fw-bold text-dark">
                                        <i className="fas fa-eye me-2 text-primary"></i>Previsualización de Muestra
                                    </h6>
                                </div>
                                <div className="card-body p-0" style={{ overflowX: "auto" }}>
                                    <table className="table table-bordered align-middle mb-0" style={{ fontSize: "12px" }}>
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-3 py-2">Campo</th>
                                                <th className="px-2 py-2 text-center bg-primary-subtle">Fila #1</th>
                                                <th className="px-2 py-2 text-center bg-secondary-subtle">Fila #2</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {SYSTEM_FIELDS.filter((f) => mappings[f.key]).map((field) => (
                                                <tr key={field.key}>
                                                    <td className="px-3 py-2 fw-bold text-dark bg-light">{field.label}</td>
                                                    <td className="px-2 py-2 text-center text-dark">{getMappedSampleValue(field.key, 0)}</td>
                                                    <td className="px-2 py-2 text-center text-dark">{getMappedSampleValue(field.key, 1)}</td>
                                                </tr>
                                            ))}
                                            {Object.values(mappings).filter(Boolean).length === 0 && (
                                                <tr>
                                                    <td colSpan="3" className="text-center p-5 text-muted fst-italic">
                                                        <i className="fas fa-info-circle fa-2x mb-2 d-block text-primary opacity-50"></i>
                                                        Selecciona al menos una columna a la izquierda para previsualizar cómo se guardarán los datos.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-top d-flex align-items-center justify-content-between">
                        <button
                            onClick={handleBack}
                            disabled={loading}
                            className="btn btn-outline-secondary px-4 rounded-pill"
                            type="button"
                        >
                            <i className="fas fa-arrow-left me-2"></i>Volver
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="btn btn-success px-5 py-2 rounded-pill shadow-sm fw-bold"
                            type="button"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Procesando Importación...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check-circle me-2"></i>
                                    Iniciar Importación ({importMode === "reset" ? "Reemplazar Todo" : "Agregar/Actualizar"})
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ModalImportDeliveryPrices;
