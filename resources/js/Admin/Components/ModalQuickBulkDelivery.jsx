import React, { useEffect, useState } from "react";
import DeliveryPricesRest from "../../Actions/Admin/DeliveryPricesRest";
import StoresRest from "../../Actions/Admin/StoresRest";
import { toast } from "sonner";
import Swal from "sweetalert2";

const deliverypricesRest = new DeliveryPricesRest();
const storesRest = new StoresRest();

const ModalQuickBulkDelivery = ({ ubigeo = [], gridRef, modalRef, typesList = [] }) => {
    const getTypeInfo = (slugs, defaultName, defaultDesc) => {
        const slugList = Array.isArray(slugs) ? slugs : [slugs];
        const found = (typesList || []).find((t) => t && slugList.includes(t.slug));
        if (!found) {
            return {
                name: defaultName,
                description: defaultDesc,
                characteristics: [],
            };
        }

        return {
            name: found.name || defaultName,
            description: found.description || defaultDesc,
            characteristics: Array.isArray(found.characteristics) ? found.characteristics : [],
        };
    };

    // Ubicación seleccionada
    const [departments, setDepartments] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);

    const [selectedDepartment, setSelectedDepartment] = useState("ALL");
    const [selectedProvince, setSelectedProvince] = useState("ALL");
    const [selectedDistricts, setSelectedDistricts] = useState([]);
    const [applyToMissing, setApplyToMissing] = useState(true);

    // Opciones de entrega
    const [enableStandard, setEnableStandard] = useState(true);
    const [price, setPrice] = useState("15.00");
    const [enableFree, setEnableFree] = useState(false);
    const [enableExpress, setEnableExpress] = useState(false);
    const [expressPrice, setExpressPrice] = useState("25.00");
    const [enableAgency, setEnableAgency] = useState(false);
    const [agencyPrice, setAgencyPrice] = useState("0.00");
    const [agencyPaymentOnDelivery, setAgencyPaymentOnDelivery] = useState(false);
    const [enableStorePickup, setEnableStorePickup] = useState(false);

    // Tiendas disponibles
    const [availableStores, setAvailableStores] = useState([]);
    const [selectedStores, setSelectedStores] = useState([]);

    const [loading, setLoading] = useState(false);
    const [districtSearch, setDistrictSearch] = useState("");

    // Extraer lista única de departamentos
    useEffect(() => {
        if (Array.isArray(ubigeo) && ubigeo.length > 0) {
            const uniqueDepts = [...new Set(ubigeo.map((item) => item.departamento?.toUpperCase()))].filter(Boolean).sort();
            setDepartments(uniqueDepts);
        }
    }, [ubigeo]);

    // Filtrar provincias cuando cambia el departamento
    useEffect(() => {
        if (selectedDepartment === "ALL") {
            setProvinces([]);
            setSelectedProvince("ALL");
            setDistricts([]);
            setSelectedDistricts([]);
        } else {
            const filteredProv = [...new Set(
                ubigeo
                    .filter((item) => item.departamento?.toUpperCase() === selectedDepartment)
                    .map((item) => item.provincia?.toUpperCase())
            )].filter(Boolean).sort();

            setProvinces(filteredProv);
            setSelectedProvince("ALL");
            setDistricts([]);
            setSelectedDistricts([]);
        }
    }, [selectedDepartment, ubigeo]);

    // Filtrar distritos cuando cambia la provincia
    useEffect(() => {
        if (selectedDepartment !== "ALL") {
            let filteredList = ubigeo.filter((item) => item.departamento?.toUpperCase() === selectedDepartment);
            if (selectedProvince !== "ALL") {
                filteredList = filteredList.filter((item) => item.provincia?.toUpperCase() === selectedProvince);
            }
            const distList = filteredList.map((item) => ({
                reniec: item.reniec,
                distrito: item.distrito?.toUpperCase(),
                provincia: item.provincia?.toUpperCase(),
            })).sort((a, b) => a.distrito.localeCompare(b.distrito));

            setDistricts(distList);
            setSelectedDistricts([]);
        }
    }, [selectedDepartment, selectedProvince, ubigeo]);

    // Cargar tiendas al activar retiro en tienda
    useEffect(() => {
        if (enableStorePickup && availableStores.length === 0) {
            loadStores();
        }
    }, [enableStorePickup]);

    const loadStores = async () => {
        try {
            const result = await storesRest.paginate({ page: 1, per_page: 100, status: true, visible: true });
            if (result && result.data && Array.isArray(result.data)) {
                const filtered = result.data.filter((store) => {
                    const isVisible = store.visible === true || store.visible === 1;
                    const isActive = store.status === true || store.status === 1;
                    const isPickupEnabled = store.pickup_available === true || store.pickup_available === 1 || store.pickup_available === undefined;
                    return isVisible && isActive && isPickupEnabled;
                });
                setAvailableStores(filtered);
            }
        } catch (e) {
            console.error("Error al cargar tiendas:", e);
        }
    };

    const handleSelectAllDistricts = (e) => {
        if (e.target.checked) {
            setSelectedDistricts(filteredDistricts.map((d) => d.reniec));
        } else {
            setSelectedDistricts([]);
        }
    };

    const handleDistrictToggle = (reniec) => {
        setSelectedDistricts((prev) =>
            prev.includes(reniec) ? prev.filter((id) => id !== reniec) : [...prev, reniec]
        );
    };

    const handleStoreToggle = (storeId) => {
        setSelectedStores((prev) =>
            prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]
        );
    };

    const filteredDistricts = districts.filter(d =>
        !districtSearch || d.distrito.includes(districtSearch.toUpperCase()) || d.provincia.includes(districtSearch.toUpperCase())
    );

    const handleSubmit = async (e) => {
        if (e && typeof e.preventDefault === "function") {
            e.preventDefault();
        }

        let targetCount = 0;
        if (selectedDepartment === "ALL") {
            targetCount = ubigeo.length;
        } else if (selectedDistricts.length > 0) {
            targetCount = selectedDistricts.length;
        } else if (districts.length > 0) {
            targetCount = districts.length;
        }

        const locationText = selectedDepartment === "ALL"
            ? "TODOS los departamentos a nivel nacional"
            : `el departamento de ${selectedDepartment}` + (selectedProvince !== "ALL" ? ` (${selectedProvince})` : "") + (selectedDistricts.length > 0 ? ` [${selectedDistricts.length} distritos]` : "");

        const { isConfirmed } = await Swal.fire({
            title: "Confirmar Ajuste Masivo",
            html: `
                <div class="text-start">
                    <p class="fs-6">Vas a aplicar esta configuración de envío a <strong>${locationText}</strong> (~${targetCount} distritos).</p>
                    <div class="p-3 bg-light rounded-3 mb-2">
                        <strong class="d-block mb-1 text-dark">Resumen de tarifas:</strong>
                        <ul class="small mb-0">
                            <li><strong>Delivery Estándar:</strong> ${enableStandard ? `S/ ${price}` : 'Desactivado'}</li>
                            <li><strong>Envío Gratis:</strong> ${enableFree ? 'Habilitado (S/ 0.00)' : 'Desactivado'}</li>
                            <li><strong>Delivery Express:</strong> ${enableExpress ? `S/ ${expressPrice}` : 'Desactivado'}</li>
                            <li><strong>Agencia:</strong> ${enableAgency ? (agencyPaymentOnDelivery ? 'Habilitado (Pago en Destino)' : `S/ ${agencyPrice}`) : 'Desactivado'}</li>
                            <li><strong>Retiro en Tienda:</strong> ${enableStorePickup ? (selectedStores.length > 0 ? `${selectedStores.length} tiendas seleccionadas` : 'Todas las tiendas') : 'Desactivado'}</li>
                        </ul>
                    </div>
                    <p class="text-warning small mb-0"><i class="fas fa-exclamation-triangle me-1"></i> Esta operación actualizará las zonas de envío de los distritos seleccionados.</p>
                </div>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, aplicar ajuste masivo",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#f59e0b",
            cancelButtonColor: "#6b7280",
        });

        if (!isConfirmed) return;

        setLoading(true);

        const payload = {
            department: selectedDepartment,
            province: selectedProvince !== "ALL" ? selectedProvince : null,
            districts: selectedDistricts.length > 0 ? selectedDistricts : null,
            apply_to_missing: applyToMissing,
            enable_standard: enableStandard,
            price: parseFloat(price) || 0,
            enable_free: enableFree,
            enable_express: enableExpress,
            express_price: parseFloat(expressPrice) || 0,
            enable_agency: enableAgency,
            agency_price: parseFloat(agencyPrice) || 0,
            agency_payment_on_delivery: agencyPaymentOnDelivery,
            enable_store_pickup: enableStorePickup,
            selected_stores: enableStorePickup ? (selectedStores.length > 0 ? selectedStores : null) : null,
        };

        try {
            const result = await deliverypricesRest.bulkUpdate(payload);

            if (result && result.success) {
                Swal.fire({
                    title: "¡Ajuste Masivo Aplicado!",
                    text: result.message || `Se actualizaron ${result.updated} registros y se crearon ${result.created} nuevos registros.`,
                    icon: "success",
                    confirmButtonText: "Entendido",
                    confirmButtonColor: "#3085d6",
                });

                if (gridRef && gridRef.current) {
                    const gridInstance = $(gridRef.current).dxDataGrid("instance");
                    if (gridInstance) {
                        gridInstance.refresh();
                    }
                }

                const modalEl = modalRef?.current;
                if (modalEl) {
                    $(modalEl).modal("hide");
                }
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message || "Ocurrió un error al aplicar el ajuste masivo.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-100 px-2 py-1">
            {/* Header Banner */}
            <div className="bg-light p-3 rounded-4 mb-4 border shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-warning text-dark p-3 rounded-3 shadow-sm">
                            <i className="fas fa-bolt fa-2x"></i>
                        </div>
                        <div>
                            <h5 className="fw-bold mb-1 text-dark">Ajuste Rápido Masivo de Tarifas</h5>
                            <p className="text-muted small mb-0">Configura precios y modalidades de envío para departamentos, provincias o distritos</p>
                        </div>
                    </div>
                    <span
                        className="badge px-3 py-2 rounded-pill shadow-sm"
                        style={{ backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeeba", fontSize: "13px", fontWeight: "bold" }}
                    >
                        <i className="fas fa-layer-group me-1"></i> Edición Masiva
                    </span>
                </div>
            </div>

            <div className="quick-bulk-form">
                {/* Distribución en 2 Columnas Paralelas (Lado a Lado) */}
                <div className="row g-4">
                    {/* COLUMNA IZQUIERDA: PASO 1 - SELECCIÓN DE UBICACIÓN */}
                    <div className="col-lg-6">
                        <div className="card border rounded-4 shadow-sm h-100">
                            <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                                <h6 className="mb-0 fw-bold text-dark">
                                    <i className="fas fa-map-marked-alt text-primary me-2"></i>1. Ubicación y Distritos
                                </h6>
                                <span className="badge bg-primary-subtle text-primary">
                                    {selectedDepartment === "ALL" ? "Nacional" : `${selectedDepartment}${selectedProvince !== "ALL" ? ` / ${selectedProvince}` : ""}`}
                                </span>
                            </div>
                            <div className="card-body p-4 d-flex flex-column">
                                <div className="row g-3 mb-3">
                                    {/* Departamento */}
                                    <div className="col-12">
                                        <label className="form-label text-dark small fw-bold">Departamento</label>
                                        <select
                                            className="form-select rounded-3"
                                            value={selectedDepartment}
                                            onChange={(e) => setSelectedDepartment(e.target.value)}
                                        >
                                            <option value="ALL">TODOS LOS DEPARTAMENTOS (COBERTURA NACIONAL)</option>
                                            {departments.map((dept) => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Provincia */}
                                    <div className="col-12">
                                        <label className="form-label text-dark small fw-bold">Provincia</label>
                                        <select
                                            className="form-select rounded-3"
                                            value={selectedProvince}
                                            onChange={(e) => setSelectedProvince(e.target.value)}
                                            disabled={selectedDepartment === "ALL"}
                                        >
                                            <option value="ALL">TODAS LAS PROVINCIAS</option>
                                            {provinces.map((prov) => (
                                                <option key={prov} value={prov}>{prov}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Distritos con Mayor Altura (maxHeight: 480px) y 2 Columnas internas */}
                                {districts.length > 0 && (
                                    <div className="flex-grow-1 d-flex flex-column mb-3">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <label className="form-label text-dark small fw-bold mb-0">
                                                Distritos Específicos ({selectedDistricts.length > 0 ? `${selectedDistricts.length} seleccionados` : `Todos los ${districts.length} distritos`})
                                            </label>
                                            <div className="form-check me-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="selectAllDistrictsCheck"
                                                    checked={selectedDistricts.length === filteredDistricts.length && filteredDistricts.length > 0}
                                                    onChange={handleSelectAllDistricts}
                                                />
                                                <label className="form-check-label small text-muted cursor-pointer" htmlFor="selectAllDistrictsCheck">
                                                    Seleccionar Todos
                                                </label>
                                            </div>
                                        </div>

                                        <div className="input-group input-group-sm mb-2">
                                            <span className="input-group-text bg-white border-end-0">
                                                <i className="fas fa-search text-muted"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control border-start-0 px-2"
                                                placeholder="Filtrar distrito por nombre..."
                                                value={districtSearch}
                                                onChange={(e) => setDistrictSearch(e.target.value)}
                                            />
                                        </div>

                                        <div className="border bg-light rounded-3 p-3 flex-grow-1" style={{ minHeight: "360px", maxHeight: "600px", overflowY: "auto" }}>
                                            <div className="row g-2">
                                                {filteredDistricts.map((d) => (
                                                    <div key={d.reniec} className="col-6">
                                                        <div className={`p-2 rounded-3 border transition-all ${selectedDistricts.includes(d.reniec) ? "bg-primary-subtle border-primary" : "bg-white border-light-subtle"}`}>
                                                            <div className="form-check mb-0">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={`dist_${d.reniec}`}
                                                                    checked={selectedDistricts.includes(d.reniec)}
                                                                    onChange={() => handleDistrictToggle(d.reniec)}
                                                                />
                                                                <label className="form-check-label small text-truncate d-block fw-bold cursor-pointer" htmlFor={`dist_${d.reniec}`}>
                                                                    {d.distrito} <span className="text-muted fw-normal">({d.provincia})</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Auto-crear cobertura */}
                                <div className="p-3 bg-light rounded-3 border mt-auto">
                                    <div className="form-check mb-0">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="applyToMissingCheck"
                                            checked={applyToMissing}
                                            onChange={(e) => setApplyToMissing(e.target.checked)}
                                        />
                                        <label className="form-check-label small text-dark cursor-pointer" htmlFor="applyToMissingCheck">
                                            <b>Crear cobertura automática:</b> Registrar automáticamente los distritos de esta zona que aún no tengan tarifa guardada.
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: PASO 2 - CONFIGURACIÓN DE ENTREGAS */}
                    <div className="col-lg-6">
                        <div className="card border rounded-4 shadow-sm h-100">
                            <div className="card-header bg-white py-3 border-bottom">
                                <h6 className="mb-0 fw-bold text-dark">
                                    <i className="fas fa-truck text-success me-2"></i>2. Configurar Opciones de Envío
                                </h6>
                            </div>
                            <div className="card-body p-3 p-md-4">
                                <div className="d-flex flex-column gap-2">
                                    {/* Delivery Normal / Estándar */}
                                    {(() => {
                                        const stdTypeInfo = getTypeInfo(['delivery-normal', 'delivery-estandar', 'estandar'], 'Delivery Normal', 'Lima: 3 a 4 días hábiles | Provincia: de 4 a 10 días hábiles');
                                        return (
                                            <div className={`p-3 rounded-4 border transition-all ${enableStandard ? "bg-primary-subtle border-primary" : "bg-light border-light-subtle"}`}>
                                                <div className="d-flex align-items-center justify-content-between mb-1">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <i className="fas fa-box text-primary fs-5"></i>
                                                        <strong className="text-dark">{stdTypeInfo.name}</strong>
                                                    </div>
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="enableStandardSwitch"
                                                            checked={enableStandard}
                                                            onChange={(e) => setEnableStandard(e.target.checked)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text-muted small my-2">
                                                    {stdTypeInfo.description && (
                                                        <div className="mb-1">
                                                            <i className="fas fa-info-circle me-1 text-primary"></i> {stdTypeInfo.description}
                                                        </div>
                                                    )}
                                                    {stdTypeInfo.characteristics && stdTypeInfo.characteristics.length > 0 && (
                                                        <ul className="list-unstyled mb-0 mt-2">
                                                            {stdTypeInfo.characteristics.map((char, idx) => (
                                                                <li key={idx} className="small text-dark mb-1 d-flex align-items-center gap-2">
                                                                    <i className="fas fa-check-circle text-success flex-shrink-0"></i>
                                                                    <span>{char}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                {enableStandard && (
                                                    <div className="mt-3 pt-2 border-top">
                                                        <label className="form-label small fw-bold text-dark mb-1">Tarifa Normal (S/)</label>
                                                        <div className="input-group input-group-sm">
                                                            <span className="input-group-text bg-white">S/</span>
                                                            <input
                                                                type="number"
                                                                step="0.10"
                                                                min="0"
                                                                className="form-control"
                                                                placeholder="0.00"
                                                                value={price}
                                                                onChange={(e) => setPrice(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Envío Gratis */}
                                    {(() => {
                                        const freeTypeInfo = getTypeInfo(['envio-gratis', 'gratis'], 'Envío Gratis', 'Entrega entre 3 a 10 días hábiles sin costo por compra mínima');
                                        return (
                                            <div className={`p-3 rounded-4 border transition-all ${enableFree ? "bg-success-subtle border-success" : "bg-light border-light-subtle"}`}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <i className="fas fa-gift text-success fs-5"></i>
                                                        <div>
                                                            <strong className="text-dark d-block">{freeTypeInfo.name}</strong>
                                                            <small className="text-muted">Costo cero habilitado para esta ubicación</small>
                                                        </div>
                                                    </div>
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="enableFreeSwitch"
                                                            checked={enableFree}
                                                            onChange={(e) => setEnableFree(e.target.checked)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text-muted small my-2">
                                                    {freeTypeInfo.description && (
                                                        <div className="mb-1">
                                                            <i className="fas fa-info-circle me-1 text-success"></i> {freeTypeInfo.description}
                                                        </div>
                                                    )}
                                                    {freeTypeInfo.characteristics && freeTypeInfo.characteristics.length > 0 && (
                                                        <ul className="list-unstyled mb-0 mt-2">
                                                            {freeTypeInfo.characteristics.map((char, idx) => (
                                                                <li key={idx} className="small text-dark mb-1 d-flex align-items-center gap-2">
                                                                    <i className="fas fa-check-circle text-success flex-shrink-0"></i>
                                                                    <span>{char}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Delivery Express */}
                                    {(() => {
                                        const expTypeInfo = getTypeInfo(['delivery-express', 'express'], 'Delivery Express', 'Delivery 24 horas. Solo distritos autorizados.');
                                        return (
                                            <div className={`p-3 rounded-4 border transition-all ${enableExpress ? "bg-warning-subtle border-warning" : "bg-light border-light-subtle"}`}>
                                                <div className="d-flex align-items-center justify-content-between mb-1">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <i className="fas fa-shipping-fast text-warning-emphasis fs-5"></i>
                                                        <strong className="text-dark">{expTypeInfo.name}</strong>
                                                    </div>
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="enableExpressSwitch"
                                                            checked={enableExpress}
                                                            onChange={(e) => setEnableExpress(e.target.checked)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text-muted small my-2">
                                                    {expTypeInfo.description && (
                                                        <div className="mb-1">
                                                            <i className="fas fa-info-circle me-1 text-warning"></i> {expTypeInfo.description}
                                                        </div>
                                                    )}
                                                    {expTypeInfo.characteristics && expTypeInfo.characteristics.length > 0 && (
                                                        <ul className="list-unstyled mb-0 mt-2">
                                                            {expTypeInfo.characteristics.map((char, idx) => (
                                                                <li key={idx} className="small text-dark mb-1 d-flex align-items-center gap-2">
                                                                    <i className="fas fa-check-circle text-success flex-shrink-0"></i>
                                                                    <span>{char}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                {enableExpress && (
                                                    <div className="mt-3 pt-2 border-top">
                                                        <label className="form-label small fw-bold text-dark mb-1">Tarifa Express (S/)</label>
                                                        <div className="input-group input-group-sm">
                                                            <span className="input-group-text bg-white">S/</span>
                                                            <input
                                                                type="number"
                                                                step="0.10"
                                                                min="0"
                                                                className="form-control"
                                                                placeholder="0.00"
                                                                value={expressPrice}
                                                                onChange={(e) => setExpressPrice(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Delivery en Agencia */}
                                    {(() => {
                                        const agencyTypeInfo = getTypeInfo(['delivery-agencia', 'agencia'], 'Delivery en Agencia', 'Provincia: de 4 a 10 días hábiles');
                                        return (
                                            <div className={`p-3 rounded-4 border transition-all ${enableAgency ? "bg-info-subtle border-info" : "bg-light border-light-subtle"}`}>
                                                <div className="d-flex align-items-center justify-content-between mb-1">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <i className="fas fa-warehouse text-info-emphasis fs-5"></i>
                                                        <strong className="text-dark">{agencyTypeInfo.name}</strong>
                                                    </div>
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="enableAgencySwitch"
                                                            checked={enableAgency}
                                                            onChange={(e) => setEnableAgency(e.target.checked)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text-muted small my-2">
                                                    {agencyTypeInfo.description && (
                                                        <div className="mb-1">
                                                            <i className="fas fa-info-circle me-1 text-info"></i> {agencyTypeInfo.description}
                                                        </div>
                                                    )}
                                                    {agencyTypeInfo.characteristics && agencyTypeInfo.characteristics.length > 0 && (
                                                        <ul className="list-unstyled mb-0 mt-2">
                                                            {agencyTypeInfo.characteristics.map((char, idx) => (
                                                                <li key={idx} className="small text-dark mb-1 d-flex align-items-center gap-2">
                                                                    <i className="fas fa-check-circle text-success flex-shrink-0"></i>
                                                                    <span>{char}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                {enableAgency && (
                                                    <div className="mt-3 pt-2 border-top">
                                                        <div className="form-check mb-2">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="agencyPaymentOnDeliveryCheck"
                                                                checked={agencyPaymentOnDelivery}
                                                                onChange={(e) => setAgencyPaymentOnDelivery(e.target.checked)}
                                                            />
                                                            <label className="form-check-label small text-dark fw-bold cursor-pointer" htmlFor="agencyPaymentOnDeliveryCheck">
                                                                Pago en Destino (Flete por cobrar al recibir)
                                                            </label>
                                                        </div>
                                                        {!agencyPaymentOnDelivery && (
                                                            <div className="input-group input-group-sm">
                                                                <span className="input-group-text bg-white">S/</span>
                                                                <input
                                                                    type="number"
                                                                    step="0.10"
                                                                    min="0"
                                                                    className="form-control"
                                                                    placeholder="0.00"
                                                                    value={agencyPrice}
                                                                    onChange={(e) => setAgencyPrice(e.target.value)}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Retiro en Tienda */}
                                    {(() => {
                                        const storeTypeInfo = getTypeInfo(['retiro-en-tienda', 'retiro-tienda', 'tienda'], 'Retiro en Tienda', 'Cliente recoge en tienda física sin costo de envío');
                                        return (
                                            <div className={`p-3 rounded-4 border transition-all ${enableStorePickup ? "bg-secondary-subtle border-secondary" : "bg-light border-light-subtle"}`}>
                                                <div className="d-flex align-items-center justify-content-between mb-1">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <i className="fas fa-store text-secondary-emphasis fs-5"></i>
                                                        <strong className="text-dark">{storeTypeInfo.name}</strong>
                                                    </div>
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="enableStorePickupSwitch"
                                                            checked={enableStorePickup}
                                                            onChange={(e) => setEnableStorePickup(e.target.checked)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text-muted small my-2">
                                                    {storeTypeInfo.description && (
                                                        <div className="mb-1">
                                                            <i className="fas fa-info-circle me-1 text-secondary"></i> {storeTypeInfo.description}
                                                        </div>
                                                    )}
                                                    {storeTypeInfo.characteristics && storeTypeInfo.characteristics.length > 0 && (
                                                        <ul className="list-unstyled mb-0 mt-2">
                                                            {storeTypeInfo.characteristics.map((char, idx) => (
                                                                <li key={idx} className="small text-dark mb-1 d-flex align-items-center gap-2">
                                                                    <i className="fas fa-check-circle text-success flex-shrink-0"></i>
                                                                    <span>{char}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>

                                                {enableStorePickup && availableStores.length > 0 && (
                                                    <div className="mt-3 pt-3 border-top">
                                                        <label className="form-label text-dark small fw-bold mb-2">
                                                            Tiendas Disponibles ({selectedStores.length > 0 ? `${selectedStores.length} seleccionadas` : "Todas las tiendas habilitadas"})
                                                        </label>
                                                        <div className="row g-2" style={{ maxHeight: "140px", overflowY: "auto" }}>
                                                            {availableStores.map((store) => (
                                                                <div key={store.id} className="col-12">
                                                                    <div className={`p-2 rounded-3 border transition-all ${selectedStores.includes(store.id) ? "bg-white border-primary shadow-sm" : "bg-white border-light-subtle"}`}>
                                                                        <div className="form-check mb-0">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id={`store_${store.id}`}
                                                                                checked={selectedStores.includes(store.id)}
                                                                                onChange={() => handleStoreToggle(store.id)}
                                                                            />
                                                                            <label className="form-check-label small text-truncate d-block fw-bold cursor-pointer" htmlFor={`store_${store.id}`}>
                                                                                {store.name} <span className="text-muted fw-normal">({store.address})</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-top d-flex align-items-center justify-content-between">
                    <button
                        type="button"
                        className="btn btn-outline-secondary px-4 rounded-pill"
                        data-bs-dismiss="modal"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn btn-warning text-dark font-bold px-5 py-2 rounded-pill shadow-sm fw-bold"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Aplicando Cambios Masivos...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-bolt me-2"></i>
                                Aplicar Ajuste Masivo por Ubicación
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalQuickBulkDelivery;
