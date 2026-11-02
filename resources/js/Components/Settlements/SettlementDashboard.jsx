import React, { useState, useEffect, useRef } from "react";
import Number2Currency, { CurrencySymbol } from "../../Utils/Number2Currency";
import Swal from "sweetalert2";
import { toast, Toaster } from "sonner";
import { Fetch } from "sode-extend-react";
import Modal from "../Adminto/Modal";

const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const SettlementDashboard = ({
    isSellerView = false,
    sellers = [],
    initialData = null,
    currentYear = new Date().getFullYear(),
    currentMonth = new Date().getMonth() + 1,
    session = null
}) => {
    const [selectedSellerId, setSelectedSellerId] = useState(
        isSellerView ? session?.id : (initialData?.seller?.id || sellers[0]?.id || "")
    );
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Modal para procesar retiro desde admin
    const processModalRef = useRef();
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [processStatus, setProcessStatus] = useState("completed");
    const [processNotes, setProcessNotes] = useState("");
    const [receiptFile, setReceiptFile] = useState(null);
    const [processingWithdrawal, setProcessingWithdrawal] = useState(false);

    // Cargar datos cuando cambia el vendedor, año o mes
    const loadSettlementData = async (sellerId, y, m) => {
        if (!sellerId) return;
        setLoading(true);
        try {
            const apiPath = isSellerView
                ? `/api/seller/settlements/data?year=${y}&month=${m}`
                : `/api/admin/settlements/data?user_id=${sellerId}&year=${y}&month=${m}`;

            const { status, result } = await Fetch(apiPath);
            if (status && result?.data) {
                setData(result.data);
            } else {
                toast.error(result?.message || "No se pudo cargar la información de liquidación");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al obtener la liquidación del vendedor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedSellerId) {
            loadSettlementData(selectedSellerId, year, month);
        }
    }, [selectedSellerId, year, month]);

    // Navegación de meses
    const handlePrevMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    // Imprimir Ficha de Liquidación
    const handlePrint = () => {
        window.print();
    };

    // Coordinar por WhatsApp
    const handleWhatsAppSummary = () => {
        if (!data) return;
        const phone = data.seller?.phone ? data.seller.phone.replace(/[^0-9]/g, "") : "";
        const cleanPhone = phone.length === 9 && !phone.startsWith("51") ? `51${phone}` : phone;

        const symbol = typeof CurrencySymbol === "function" ? CurrencySymbol() : "S/";

        const summaryText =
            `*LIQUIDACIÓN MENSUAL — ${data.period?.month_name?.toUpperCase()}*\n` +
            `👤 *Vendedor:* ${data.seller?.name} (${data.seller?.email})\n` +
            `🏅 *Rango:* ${data.rank_progression?.current_rank?.name || "Promotor"}\n` +
            `-----------------------------------\n` +
            `📦 *Ventas Personales:* ${data.summary?.personal_items_count} prendas (${symbol} ${Number2Currency(data.summary?.personal_sales_amount)})\n` +
            `👥 *Ventas de Red:* ${data.summary?.group_items_count} prendas (${symbol} ${Number2Currency(data.summary?.group_sales_amount)})\n` +
            `💰 *Comisiones Ganadas:* ${symbol} ${Number2Currency(data.summary?.approved_commissions)}\n` +
            `🎁 *Bonos Acreditados:* ${symbol} ${Number2Currency(data.summary?.bonus_commissions)}\n` +
            `💵 *TOTAL LIQUIDACIÓN:* ${symbol} ${Number2Currency(data.summary?.total_earned_month)}\n` +
            `-----------------------------------\n` +
            (data.summary?.has_pending_withdrawal
                ? `⏳ *Solicitud de Retiro en Proceso:* ${symbol} ${Number2Currency(data.summary?.pending_withdrawal_amount)}\n`
                : `💳 *Saldo Disponible:* ${symbol} ${Number2Currency(data.summary?.available_balance_now)}\n`) +
            `🏦 *Banco:* ${data.seller?.bank_details?.bank_name || "No especificado"} | Cta: ${data.seller?.bank_details?.account_number || "S/N"}\n` +
            `¡Gracias por tu gran esfuerzo este mes!`;

        const waUrl = cleanPhone
            ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(summaryText)}`
            : `https://wa.me/?text=${encodeURIComponent(summaryText)}`;

        window.open(waUrl, "_blank");
    };

    // Abrir modal para procesar retiro desde admin
    const openProcessWithdrawalModal = (withdrawal) => {
        setSelectedWithdrawal(withdrawal);
        setProcessStatus("completed");
        setProcessNotes(withdrawal?.notes || "");
        setReceiptFile(null);
        $(processModalRef.current).modal("show");
    };

    const handleSaveProcessWithdrawal = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!selectedWithdrawal) return;

        setProcessingWithdrawal(true);
        try {
            const formData = new FormData();
            formData.append("status", processStatus);
            formData.append("notes", processNotes);
            if (receiptFile) {
                formData.append("receipt", receiptFile);
            }

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
            const response = await fetch(`/api/admin/settlements/process-withdrawal/${selectedWithdrawal.id}`, {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Accept": "application/json",
                },
                body: formData,
            });

            const res = await response.json();
            if (response.ok) {
                toast.success("Solicitud de retiro procesada correctamente");
                $(processModalRef.current).modal("hide");
                loadSettlementData(selectedSellerId, year, month);
            } else {
                toast.error(res?.message || "Error al procesar retiro");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error al procesar el pago");
        } finally {
            setProcessingWithdrawal(false);
        }
    };

    const formatCurrency = (val) => {
        const symbol = typeof CurrencySymbol === "function" ? CurrencySymbol() : "S/";
        return `${symbol} ${Number2Currency(val)}`;
    };

    return (
        <div className="container-fluid pb-4">
            <Toaster position="top-right" richColors />

            {/* Estilos específicos para vista de impresión limpia */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-settlement-sheet, #print-settlement-sheet * {
                        visibility: visible;
                    }
                    #print-settlement-sheet {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: #fff;
                        padding: 20px;
                        color: #000;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            {/* BARRA SUPERIOR DE FILTROS Y PERIODO */}
            <div className="card shadow-sm border-0 mb-4 no-print">
                <div className="card-body p-3">
                    <div className="row g-3 align-items-center justify-content-between">
                        {/* Selector de Vendedor (Solo Admin) */}
                        {!isSellerView && (
                            <div className="col-lg-4 col-md-5">
                                <label className="form-label text-muted small fw-bold mb-1">
                                    <i className="fas fa-user-tie me-1 text-primary"></i> VENDEDOR:
                                </label>
                                <select
                                    className="form-select border-primary"
                                    value={selectedSellerId}
                                    onChange={(e) => setSelectedSellerId(e.target.value)}
                                >
                                    {sellers.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} ({s.email}) — {s.rank?.name || "Sin Rango"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Selector de Mes y Año con Navegación Rápida */}
                        <div className={isSellerView ? "col-lg-6 col-md-8" : "col-lg-5 col-md-7"}>
                            <label className="form-label text-muted small fw-bold mb-1">
                                <i className="fas fa-calendar-alt me-1 text-primary"></i> PERIODO DE LIQUIDACIÓN:
                            </label>
                            <div className="d-flex align-items-center gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={handlePrevMonth}
                                    title="Mes Anterior"
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>

                                <select
                                    className="form-select form-select-sm"
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                    style={{ minWidth: "130px" }}
                                >
                                    {MONTH_NAMES.map((mName, idx) => (
                                        <option key={idx + 1} value={idx + 1}>
                                            {mName}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    className="form-select form-select-sm"
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    style={{ width: "95px" }}
                                >
                                    {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={handleNextMonth}
                                    title="Mes Siguiente"
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-soft-primary btn-sm ms-1"
                                    onClick={() => loadSettlementData(selectedSellerId, year, month)}
                                    title="Recargar datos"
                                >
                                    <i className={`fas fa-sync-alt ${loading ? "fa-spin" : ""}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* Botones de Acción (Imprimir / WhatsApp) */}
                        <div className="col-lg-3 col-md-12 text-md-end text-start">
                            <div className="btn-group">
                                <button
                                    type="button"
                                    className="btn btn-light btn-sm text-dark"
                                    onClick={handlePrint}
                                    title="Imprimir Ficha de Liquidación"
                                >
                                    <i className="fas fa-print me-1 text-secondary"></i> Imprimir Ficha
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    onClick={handleWhatsAppSummary}
                                    title="Enviar resumen por WhatsApp"
                                >
                                    <i className="fab fa-whatsapp me-1"></i> WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="text-muted mt-2">Cargando reporte de liquidación...</p>
                </div>
            )}

            {!loading && data && (
                <>
                    {/* RESUMEN DEL VENDEDOR EN CABECERA */}
                    <div className="card border-0 shadow-sm mb-4 bg-primary text-white no-print">
                        <div className="card-body p-4">
                            <div className="row align-items-center">
                                <div className="col-md-7">
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="avatar-lg rounded-circle bg-white text-primary d-flex align-items-center justify-content-center me-3 fs-1 fw-bold shadow-sm"
                                            style={{ width: "65px", height: "65px" }}
                                        >
                                            {data.seller?.name?.charAt(0) || "V"}
                                        </div>
                                        <div>
                                            <h4 className="mb-1 text-white fw-bold">
                                                {data.seller?.name}
                                            </h4>
                                            <p className="mb-0 text-white-50 small">
                                                <i className="fas fa-envelope me-1"></i> {data.seller?.email} |{" "}
                                                <i className="fas fa-phone me-1"></i> {data.seller?.phone || "Sin teléfono"} |{" "}
                                                <i className="fas fa-id-card me-1"></i> DNI: {data.seller?.document || "S/N"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5 text-md-end mt-3 mt-md-0">
                                    <span className="badge bg-white text-dark px-3 py-2 fs-6 rounded-pill shadow-sm me-2">
                                        <i className="fas fa-medal text-warning me-1"></i> Rango:{" "}
                                        <b>{data.rank_progression?.current_rank?.name || "Promotor Junior"}</b>
                                    </span>
                                    <span className="badge bg-soft-light text-white px-3 py-2 fs-6 rounded-pill">
                                        <i className="fas fa-calendar-check me-1"></i> Periodo: <b>{data.period?.month_name}</b>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TARJETAS DE KPIS PRINCIPALES */}
                    <div className="row g-3 mb-4 no-print">
                        {/* 1. Total Liquidación Ganada en el Mes */}
                        <div className="col-xl-3 col-md-6">
                            <div className="card border-0 shadow-sm h-100 bg-soft-success border-start border-4 border-success">
                                <div className="card-body p-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="text-muted text-uppercase fw-semibold fs-7 mb-1">
                                                Total Liquidación (Mes)
                                            </p>
                                            <h3 className="fw-bold text-success mb-0">
                                                {formatCurrency(data.summary?.total_earned_month)}
                                            </h3>
                                        </div>
                                        <div className="avatar-sm rounded bg-success text-white d-flex align-items-center justify-content-center">
                                            <i className="fas fa-hand-holding-usd fs-4"></i>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-muted small">
                                        <span>Comisiones + Bonos aprobados</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Ventas Personales vs Red */}
                        <div className="col-xl-3 col-md-6">
                            <div className="card border-0 shadow-sm h-100 bg-soft-primary border-start border-4 border-primary">
                                <div className="card-body p-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="text-muted text-uppercase fw-semibold fs-7 mb-1">
                                                Prendas Vendidas
                                            </p>
                                            <h3 className="fw-bold text-primary mb-0">
                                                {data.summary?.total_combined_items}{" "}
                                                <span className="fs-6 fw-normal text-muted">prendas</span>
                                            </h3>
                                        </div>
                                        <div className="avatar-sm rounded bg-primary text-white d-flex align-items-center justify-content-center">
                                            <i className="fas fa-tshirt fs-4"></i>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-muted small d-flex justify-content-between">
                                        <span>Personal: <b>{data.summary?.personal_items_count}</b></span>
                                        <span>Red L1+L2: <b>{data.summary?.group_items_count}</b></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Desglose de Ganancias */}
                        <div className="col-xl-3 col-md-6">
                            <div className="card border-0 shadow-sm h-100 bg-soft-warning border-start border-4 border-warning">
                                <div className="card-body p-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="text-muted text-uppercase fw-semibold fs-7 mb-1">
                                                Bonos & Premios
                                            </p>
                                            <h3 className="fw-bold text-warning mb-0">
                                                {formatCurrency(Number(data.summary?.bonus_commissions) + Number(data.summary?.vault_commissions))}
                                            </h3>
                                        </div>
                                        <div className="avatar-sm rounded bg-warning text-white d-flex align-items-center justify-content-center">
                                            <i className="fas fa-gift fs-4"></i>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-muted small d-flex justify-content-between">
                                        <span>Bonos: <b>{formatCurrency(data.summary?.bonus_commissions)}</b></span>
                                        <span>Bóveda 100%: <b>{formatCurrency(data.summary?.vault_commissions)}</b></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Solicitud de Retiro / Saldo a Pagar */}
                        <div className="col-xl-3 col-md-6">
                            <div className="card border-0 shadow-sm h-100 bg-soft-info border-start border-4 border-info">
                                <div className="card-body p-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="text-muted text-uppercase fw-semibold fs-7 mb-1">
                                                {data.summary?.has_pending_withdrawal ? "Retiro Solicitado" : "Saldo Disponible"}
                                            </p>
                                            <h3 className="fw-bold text-info mb-0">
                                                {formatCurrency(
                                                    data.summary?.has_pending_withdrawal
                                                        ? data.summary?.pending_withdrawal_amount
                                                        : data.summary?.available_balance_now
                                                )}
                                            </h3>
                                        </div>
                                        <div className="avatar-sm rounded bg-info text-white d-flex align-items-center justify-content-center">
                                            <i className="fas fa-university fs-4"></i>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-muted small">
                                        {data.summary?.has_pending_withdrawal ? (
                                            <span className="badge bg-danger">
                                                <i className="fas fa-clock me-1"></i> Pendiente de Pago
                                            </span>
                                        ) : (
                                            <span className="text-muted">En billetera para retirar</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NAVEGACIÓN POR PESTAÑAS (TABS) */}
                    <div className="card border-0 shadow-sm mb-4 no-print">
                        <div className="card-body p-2 border-bottom">
                            <ul className="nav nav-pills nav-justified" role="tablist">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link py-2 ${activeTab === "overview" ? "active" : ""}`}
                                        onClick={() => setActiveTab("overview")}
                                    >
                                        <i className="fas fa-file-invoice-dollar me-1"></i> 1. Cierre y Liquidación
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link py-2 ${activeTab === "goals" ? "active" : ""}`}
                                        onClick={() => setActiveTab("goals")}
                                    >
                                        <i className="fas fa-bullseye me-1"></i> 2. ¿Cuánto falta para metas/bonos?
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link py-2 ${activeTab === "rank" ? "active" : ""}`}
                                        onClick={() => setActiveTab("rank")}
                                    >
                                        <i className="fas fa-chart-line me-1"></i> 3. ¿Cuánto falta para subir de rango?
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link py-2 ${activeTab === "sales" ? "active" : ""}`}
                                        onClick={() => setActiveTab("sales")}
                                    >
                                        <i className="fas fa-shopping-bag me-1"></i> 4. Ventas del Mes ({data.personal_sales?.length || 0})
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link py-2 ${activeTab === "commissions" ? "active" : ""}`}
                                        onClick={() => setActiveTab("commissions")}
                                    >
                                        <i className="fas fa-coins me-1"></i> 5. Comisiones Detalladas ({data.commissions?.length || 0})
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* CONTENIDO DE LAS PESTAÑAS */}

                    {/* TAB 1: CIERRE Y LIQUIDACIÓN / RETIROS */}
                    {activeTab === "overview" && (
                        <div className="row g-4 no-print">
                            {/* Cuadro de Liquidación Oficial */}
                            <div className="col-lg-7">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-header bg-white border-bottom py-3">
                                        <h5 className="card-title mb-0 fw-bold text-dark">
                                            <i className="fas fa-balance-scale text-primary me-2"></i>
                                            Consolidado de Liquidación — {data.period?.month_name}
                                        </h5>
                                    </div>
                                    <div className="card-body p-0">
                                        <table className="table table-hover align-middle mb-0">
                                            <tbody>
                                                <tr>
                                                    <td className="ps-4 text-muted">Ventas Personales Generadas</td>
                                                    <td className="text-end fw-semibold text-dark">
                                                        {formatCurrency(data.summary?.personal_sales_amount)}
                                                    </td>
                                                    <td className="text-end text-muted pe-4 small">
                                                        {data.summary?.personal_items_count} prendas / {data.summary?.personal_orders_count} pedidos
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="ps-4 text-muted">Ventas de Red Grupal (L1 + L2)</td>
                                                    <td className="text-end fw-semibold text-dark">
                                                        {formatCurrency(data.summary?.group_sales_amount)}
                                                    </td>
                                                    <td className="text-end text-muted pe-4 small">
                                                        {data.summary?.group_items_count} prendas ({data.summary?.network_members_count} afiliados)
                                                    </td>
                                                </tr>
                                                <tr className="table-light">
                                                    <td className="ps-4 fw-bold text-dark">Comisiones por Ventas Directas</td>
                                                    <td className="text-end fw-bold text-success">
                                                        {formatCurrency(data.summary?.direct_commissions)}
                                                    </td>
                                                    <td className="text-end pe-4 text-muted small">Aprobadas/Validadas</td>
                                                </tr>
                                                <tr>
                                                    <td className="ps-4 text-muted">Ventas 100% Bóveda (Premios)</td>
                                                    <td className="text-end fw-semibold text-success">
                                                        {formatCurrency(data.summary?.vault_commissions)}
                                                    </td>
                                                    <td className="text-end pe-4 text-muted small">Margen total vendedor</td>
                                                </tr>
                                                <tr>
                                                    <td className="ps-4 text-muted">Bonos y Premios de Metas</td>
                                                    <td className="text-end fw-semibold text-success">
                                                        {formatCurrency(data.summary?.bonus_commissions)}
                                                    </td>
                                                    <td className="text-end pe-4 text-muted small">Ascenso y volumen</td>
                                                </tr>
                                                {data.summary?.pending_commissions > 0 && (
                                                    <tr className="table-warning">
                                                        <td className="ps-4 text-warning-dark">
                                                            <i className="fas fa-exclamation-triangle me-1"></i> Comisiones aún Pendientes de Entrega
                                                        </td>
                                                        <td className="text-end fw-semibold text-warning-dark">
                                                            {formatCurrency(data.summary?.pending_commissions)}
                                                        </td>
                                                        <td className="text-end pe-4 text-muted small">Se liberan al entregar</td>
                                                    </tr>
                                                )}
                                                <tr className="table-primary border-top border-2 border-primary">
                                                    <td className="ps-4 fw-bold fs-5 text-primary">
                                                        TOTAL NETO LIQUIDADO DEL MES
                                                    </td>
                                                    <td className="text-end fw-bold fs-4 text-primary" colSpan="2">
                                                        {formatCurrency(data.summary?.total_earned_month)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="card-footer bg-light p-3 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">
                                            Histórico acumulado en la plataforma: <b>{formatCurrency(data.summary?.total_earned_all_time)}</b>
                                        </span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={handlePrint}
                                        >
                                            <i className="fas fa-print me-1"></i> Imprimir Liquidación
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Estado de Retiro y Datos de Cobro */}
                            <div className="col-lg-5">
                                {/* Datos Bancarios */}
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-header bg-white border-bottom py-3">
                                        <h5 className="card-title mb-0 fw-bold text-dark">
                                            <i className="fas fa-credit-card text-success me-2"></i>
                                            Datos de Cobro del Vendedor
                                        </h5>
                                    </div>
                                    <div className="card-body p-3">
                                        <div className="row g-2">
                                            <div className="col-6">
                                                <small className="text-muted d-block">Banco:</small>
                                                <span className="fw-bold text-dark">
                                                    {data.seller?.bank_details?.bank_name || "No configurado"}
                                                </span>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted d-block">Yape / Plin:</small>
                                                <span className="fw-bold text-dark">
                                                    {data.seller?.bank_details?.yape_plin_number || "No configurado"}
                                                </span>
                                            </div>
                                            <div className="col-12 mt-2">
                                                <small className="text-muted d-block">N° de Cuenta:</small>
                                                <span className="font-monospace fw-semibold text-dark">
                                                    {data.seller?.bank_details?.account_number || "No configurado"}
                                                </span>
                                            </div>
                                            <div className="col-12 mt-2">
                                                <small className="text-muted d-block">CCI Interbancario:</small>
                                                <span className="font-monospace fw-semibold text-dark">
                                                    {data.seller?.bank_details?.cci_number || "No configurado"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Solicitud de Retiro Actual */}
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                                        <h5 className="card-title mb-0 fw-bold text-dark">
                                            <i className="fas fa-money-check-alt text-primary me-2"></i>
                                            Estado de Retiro al Cierre
                                        </h5>
                                        {data.pending_withdrawal && (
                                            <span className="badge bg-danger animate-pulse">
                                                Solicitud Pendiente
                                            </span>
                                        )}
                                    </div>
                                    <div className="card-body p-3">
                                        {data.pending_withdrawal ? (
                                            <div className="alert alert-soft-danger border-danger border-opacity-25 mb-3">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <h6 className="fw-bold text-danger mb-1">
                                                            El vendedor solicitó retirar: {formatCurrency(data.pending_withdrawal.amount)}
                                                        </h6>
                                                        <small className="text-muted">
                                                            Fecha de solicitud: {data.pending_withdrawal.created_at} | Vía {data.pending_withdrawal.method}
                                                        </small>
                                                    </div>
                                                </div>

                                                {!isSellerView && (
                                                    <div className="mt-3 text-end">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-success px-3 fw-bold"
                                                            onClick={() => openProcessWithdrawalModal(data.pending_withdrawal)}
                                                        >
                                                            <i className="fas fa-check-circle me-1"></i> Procesar / Pagar Retiro
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="alert alert-soft-info border-info border-opacity-25 mb-3">
                                                <div className="d-flex align-items-center">
                                                    <i className="fas fa-info-circle fs-3 text-info me-3"></i>
                                                    <div>
                                                        <h6 className="mb-1 fw-bold text-info">
                                                            No hay solicitudes pendientes de retiro
                                                        </h6>
                                                        <p className="mb-0 small text-muted">
                                                            El vendedor cuenta con <b>{formatCurrency(data.summary?.available_balance_now)}</b> disponibles para retirar en su panel.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Historial de retiros del periodo */}
                                        <h6 className="fw-bold text-dark mb-2 fs-7 text-uppercase">
                                            Historial de retiros del periodo:
                                        </h6>
                                        {data.withdrawals && data.withdrawals.length > 0 ? (
                                            <div className="list-group list-group-flush border rounded">
                                                {data.withdrawals.map((w) => (
                                                    <div key={w.id} className="list-group-item d-flex justify-content-between align-items-center p-2">
                                                        <div>
                                                            <span className="fw-bold text-dark">{formatCurrency(w.amount)}</span>
                                                            <small className="text-muted d-block">{w.created_at} — {w.method}</small>
                                                        </div>
                                                        <span
                                                            className={`badge ${
                                                                w.status === "completed"
                                                                    ? "bg-success"
                                                                    : w.status === "rejected"
                                                                    ? "bg-danger"
                                                                    : "bg-warning"
                                                            }`}
                                                        >
                                                            {w.status === "completed" ? "Pagado" : w.status === "rejected" ? "Rechazado" : "Pendiente"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted small mb-0">No se registraron retiros en este mes.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: METAS Y BONOS ACTIVOS (¿CUÁNTO FALTA?) */}
                    {activeTab === "goals" && (
                        <div className="card border-0 shadow-sm no-print">
                            <div className="card-header bg-white border-bottom py-3">
                                <h5 className="card-title mb-0 fw-bold text-dark">
                                    <i className="fas fa-bullseye text-danger me-2"></i>
                                    Diagnóstico de Metas y Bonos del Mes ({data.period?.month_name})
                                </h5>
                                <p className="text-muted small mb-0 mt-1">
                                    Revisa cuánto le falta al vendedor para alcanzar los bonos de volumen y desempeño mensual.
                                </p>
                            </div>
                            <div className="card-body p-4">
                                <div className="row g-4">
                                    {data.goals_progress && data.goals_progress.length > 0 ? (
                                        data.goals_progress.map((goal) => (
                                            <div key={goal.id} className="col-lg-6">
                                                <div
                                                    className={`card h-100 border ${
                                                        goal.achieved
                                                            ? "border-success bg-soft-success"
                                                            : "border-light bg-white shadow-sm"
                                                    }`}
                                                >
                                                    <div className="card-body p-3">
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div>
                                                                <h6 className="fw-bold text-dark mb-1">
                                                                    {goal.name}
                                                                </h6>
                                                                <p className="text-muted small mb-0">
                                                                    {goal.description || `Meta de ${goal.target_value} ${goal.unit} (${goal.is_group ? "Grupal" : "Personal"})`}
                                                                </p>
                                                            </div>
                                                            <span className="badge bg-success px-3 py-2 fs-7 fw-bold rounded-pill">
                                                                Premio: {formatCurrency(goal.bonus_amount)}
                                                            </span>
                                                        </div>

                                                        {/* Barra de Progreso */}
                                                        <div className="mt-3">
                                                            <div className="d-flex justify-content-between align-items-center mb-1 small">
                                                                <span className="text-muted">
                                                                    Avance actual: <b>{goal.actual_value} {goal.unit}</b>
                                                                </span>
                                                                <span className="text-muted">
                                                                    Meta: <b>{goal.target_value} {goal.unit}</b>
                                                                </span>
                                                            </div>
                                                            <div className="progress" style={{ height: "10px" }}>
                                                                <div
                                                                    className={`progress-bar progress-bar-striped ${
                                                                        goal.achieved ? "bg-success" : "bg-primary"
                                                                    }`}
                                                                    role="progressbar"
                                                                    style={{ width: `${goal.percentage}%` }}
                                                                    aria-valuenow={goal.percentage}
                                                                    aria-valuemin="0"
                                                                    aria-valuemax="100"
                                                                ></div>
                                                            </div>
                                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                                <span className="fw-bold small text-primary">
                                                                    {goal.percentage}% completado
                                                                </span>
                                                                {goal.achieved ? (
                                                                    <span className="badge bg-success">
                                                                        <i className="fas fa-check-circle me-1"></i> ¡Meta Lograda!
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge bg-warning text-dark">
                                                                        Faltan <b>{goal.missing_value} {goal.unit}</b>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12 text-center py-4">
                                            <p className="text-muted">No hay bonos por metas activos registrados en este momento.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: PROGRESO DE RANGO (¿CUÁNTO FALTA PARA SUBIR?) */}
                    {activeTab === "rank" && (
                        <div className="card border-0 shadow-sm no-print">
                            <div className="card-header bg-white border-bottom py-3">
                                <h5 className="card-title mb-0 fw-bold text-dark">
                                    <i className="fas fa-chart-line text-info me-2"></i>
                                    Diagnóstico para Subir de Rango
                                </h5>
                                <p className="text-muted small mb-0 mt-1">
                                    Brecha de requisitos del Plan de Carrera para ascender al siguiente nivel.
                                </p>
                            </div>
                            <div className="card-body p-4">
                                {data.rank_progression ? (
                                    <>
                                        {/* Cabecera de comparación de rango */}
                                        <div className="card bg-soft-primary border-primary border-opacity-25 mb-4">
                                            <div className="card-body p-3 d-flex flex-wrap align-items-center justify-content-between">
                                                <div className="d-flex align-items-center my-1">
                                                    <span className="badge bg-secondary p-2 me-2">Rango Actual:</span>
                                                    <h5 className="mb-0 fw-bold text-dark">
                                                        {data.rank_progression.current_rank?.name} ({data.rank_progression.current_rank?.commission_percent}% com.)
                                                    </h5>
                                                </div>

                                                <div className="fs-3 text-primary my-1 mx-3 d-none d-md-block">
                                                    <i className="fas fa-arrow-right"></i>
                                                </div>

                                                <div className="d-flex align-items-center my-1">
                                                    <span className="badge bg-success p-2 me-2">Siguiente Rango:</span>
                                                    <h5 className="mb-0 fw-bold text-success">
                                                        {data.rank_progression.next_rank?.name} ({data.rank_progression.next_rank?.commission_percent}% com.)
                                                    </h5>
                                                    {data.rank_progression.next_rank?.bonus_amount > 0 && (
                                                        <span className="badge bg-warning text-dark ms-2">
                                                            Bono Ascenso: {formatCurrency(data.rank_progression.next_rank.bonus_amount)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Requisitos Desglosados */}
                                        <div className="row g-3">
                                            {/* 1. Prendas Personales */}
                                            {data.rank_progression.requirements?.personal_items && (
                                                <div className="col-md-6">
                                                    <div className="card border h-100 p-3">
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <h6 className="fw-bold text-dark mb-0">
                                                                <i className="fas fa-tshirt text-primary me-2"></i> Prendas Personales
                                                            </h6>
                                                            {data.rank_progression.requirements.personal_items.completed ? (
                                                                <span className="badge bg-success">Cumplido</span>
                                                            ) : (
                                                                <span className="badge bg-danger">Faltan {data.rank_progression.requirements.personal_items.missing}</span>
                                                            )}
                                                        </div>
                                                        <p className="text-muted small mb-2">
                                                            Progreso: <b>{data.rank_progression.requirements.personal_items.actual}</b> de{" "}
                                                            <b>{data.rank_progression.requirements.personal_items.required} prendas</b>
                                                        </p>
                                                        <div className="progress" style={{ height: "8px" }}>
                                                            <div
                                                                className={`progress-bar ${
                                                                    data.rank_progression.requirements.personal_items.completed ? "bg-success" : "bg-primary"
                                                                }`}
                                                                style={{ width: `${data.rank_progression.requirements.personal_items.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 2. Prendas Grupales (L1 + L2) */}
                                            {data.rank_progression.requirements?.group_items && (
                                                <div className="col-md-6">
                                                    <div className="card border h-100 p-3">
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <h6 className="fw-bold text-dark mb-0">
                                                                <i className="fas fa-users text-info me-2"></i> Prendas Grupales (Línea 1 + 2)
                                                            </h6>
                                                            {data.rank_progression.requirements.group_items.completed ? (
                                                                <span className="badge bg-success">Cumplido</span>
                                                            ) : (
                                                                <span className="badge bg-danger">Faltan {data.rank_progression.requirements.group_items.missing}</span>
                                                            )}
                                                        </div>
                                                        <p className="text-muted small mb-2">
                                                            Progreso: <b>{data.rank_progression.requirements.group_items.actual}</b> de{" "}
                                                            <b>{data.rank_progression.requirements.group_items.required} prendas grupales</b>
                                                        </p>
                                                        <div className="progress" style={{ height: "8px" }}>
                                                            <div
                                                                className={`progress-bar ${
                                                                    data.rank_progression.requirements.group_items.completed ? "bg-success" : "bg-info"
                                                                }`}
                                                                style={{ width: `${data.rank_progression.requirements.group_items.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 3. Reclutas Activos */}
                                            {data.rank_progression.requirements?.active_recruits && (
                                                <div className="col-md-6">
                                                    <div className="card border h-100 p-3">
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <h6 className="fw-bold text-dark mb-0">
                                                                <i className="fas fa-user-check text-warning me-2"></i> Reclutas Activos
                                                            </h6>
                                                            {data.rank_progression.requirements.active_recruits.completed ? (
                                                                <span className="badge bg-success">Cumplido</span>
                                                            ) : (
                                                                <span className="badge bg-danger">Faltan {data.rank_progression.requirements.active_recruits.missing}</span>
                                                            )}
                                                        </div>
                                                        <p className="text-muted small mb-2">
                                                            Progreso: <b>{data.rank_progression.requirements.active_recruits.actual}</b> de{" "}
                                                            <b>{data.rank_progression.requirements.active_recruits.required} reclutas</b> (min. {formatCurrency(data.rank_progression.requirements.active_recruits.min_amount_each)} c/u)
                                                        </p>
                                                        <div className="progress" style={{ height: "8px" }}>
                                                            <div
                                                                className={`progress-bar ${
                                                                    data.rank_progression.requirements.active_recruits.completed ? "bg-success" : "bg-warning"
                                                                }`}
                                                                style={{ width: `${data.rank_progression.requirements.active_recruits.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 4. Líderes de Red */}
                                            {data.rank_progression.requirements?.leaders && (
                                                <div className="col-md-6">
                                                    <div className="card border h-100 p-3">
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <h6 className="fw-bold text-dark mb-0">
                                                                <i className="fas fa-crown text-purple me-2"></i> Líderes con Equipo
                                                            </h6>
                                                            {data.rank_progression.requirements.leaders.completed ? (
                                                                <span className="badge bg-success">Cumplido</span>
                                                            ) : (
                                                                <span className="badge bg-danger">Faltan {data.rank_progression.requirements.leaders.missing}</span>
                                                            )}
                                                        </div>
                                                        <p className="text-muted small mb-2">
                                                            Progreso: <b>{data.rank_progression.requirements.leaders.actual}</b> de{" "}
                                                            <b>{data.rank_progression.requirements.leaders.required} líderes</b>
                                                        </p>
                                                        <div className="progress" style={{ height: "8px" }}>
                                                            <div
                                                                className={`progress-bar ${
                                                                    data.rank_progression.requirements.leaders.completed ? "bg-success" : "bg-purple"
                                                                }`}
                                                                style={{ width: `${data.rank_progression.requirements.leaders.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <i className="fas fa-trophy fs-1 text-warning mb-2"></i>
                                        <h5 className="fw-bold text-dark">¡Felicidades! Se encuentra en el rango máximo</h5>
                                        <p className="text-muted">No existen rangos superiores registrados en el plan de carrera.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 4: VENTAS DEL MES */}
                    {activeTab === "sales" && (
                        <div className="card border-0 shadow-sm no-print">
                            <div className="card-header bg-white border-bottom py-3">
                                <h5 className="card-title mb-0 fw-bold text-dark">
                                    <i className="fas fa-shopping-bag text-primary me-2"></i>
                                    Detalle de Ventas Personales ({data.period?.month_name})
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-3">Código</th>
                                                <th>Fecha</th>
                                                <th>Cliente</th>
                                                <th>Prendas</th>
                                                <th>Monto</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.personal_sales && data.personal_sales.length > 0 ? (
                                                data.personal_sales.map((sale) => (
                                                    <tr key={sale.id}>
                                                        <td className="ps-3 fw-bold text-primary font-monospace">{sale.code}</td>
                                                        <td>{sale.created_at}</td>
                                                        <td>{sale.customer_name}</td>
                                                        <td><span className="badge bg-light text-dark">{sale.items_count} prendas</span></td>
                                                        <td className="fw-bold text-dark">{formatCurrency(sale.total_amount)}</td>
                                                        <td>
                                                            <span className="badge" style={{ backgroundColor: sale.status_color }}>
                                                                {sale.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4 text-muted">
                                                        No se registraron ventas en este periodo.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: COMISIONES DETALLADAS */}
                    {activeTab === "commissions" && (
                        <div className="card border-0 shadow-sm no-print">
                            <div className="card-header bg-white border-bottom py-3">
                                <h5 className="card-title mb-0 fw-bold text-dark">
                                    <i className="fas fa-coins text-warning me-2"></i>
                                    Comisiones y Bonos Generados ({data.period?.month_name})
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-3">Concepto / Descripción</th>
                                                <th>Venta / Pedido</th>
                                                <th>Fecha</th>
                                                <th>Tipo</th>
                                                <th>Base</th>
                                                <th>Monto Comisión</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.commissions && data.commissions.length > 0 ? (
                                                data.commissions.map((c) => (
                                                    <tr key={c.id}>
                                                        <td className="ps-3 fw-semibold text-dark">{c.description}</td>
                                                        <td className="font-monospace text-primary">{c.sale_code}</td>
                                                        <td>{c.created_at}</td>
                                                        <td>
                                                            <span
                                                                className={`badge ${
                                                                    c.type === "prize"
                                                                        ? "bg-warning text-dark"
                                                                        : c.type === "bonus"
                                                                        ? "bg-purple text-white"
                                                                        : "bg-info text-white"
                                                                }`}
                                                            >
                                                                {c.type === "prize" ? "Bóveda 100%" : c.type === "bonus" ? "Bono" : "Comisión"}
                                                            </span>
                                                        </td>
                                                        <td>{c.base_amount > 0 ? formatCurrency(c.base_amount) : "—"}</td>
                                                        <td className="fw-bold text-success fs-6">{formatCurrency(c.amount)}</td>
                                                        <td>
                                                            <span
                                                                className={`badge ${
                                                                    c.status === "approved" || c.status === "paid"
                                                                        ? "bg-success"
                                                                        : "bg-secondary"
                                                                }`}
                                                            >
                                                                {c.status === "approved" ? "Aprobada" : c.status === "paid" ? "Pagada" : "Pendiente"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-4 text-muted">
                                                        No hay comisiones registradas en este periodo.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* HOJA OFICIAL PARA IMPRESIÓN (PRINT ONLY) */}
                    <div id="print-settlement-sheet" className="d-none d-print-block">
                        <div className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h3 className="fw-bold text-dark mb-1">FICHA DE LIQUIDACIÓN DE VENDEDOR</h3>
                                <p className="text-muted mb-0">Periodo Oficial: <b>{data.period?.month_name}</b></p>
                            </div>
                            <div className="text-end">
                                <h5 className="mb-0 fw-bold">{data.seller?.name}</h5>
                                <small className="text-muted">DNI: {data.seller?.document || "S/N"} | Tel: {data.seller?.phone}</small>
                            </div>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-6">
                                <div className="border p-2 rounded">
                                    <h6 className="fw-bold mb-1">Datos del Vendedor:</h6>
                                    <p className="mb-0 small">Rango: <b>{data.rank_progression?.current_rank?.name || "Promotor"}</b></p>
                                    <p className="mb-0 small">Email: {data.seller?.email}</p>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="border p-2 rounded">
                                    <h6 className="fw-bold mb-1">Datos para Abono / Pago:</h6>
                                    <p className="mb-0 small">Banco: <b>{data.seller?.bank_details?.bank_name || "S/N"}</b></p>
                                    <p className="mb-0 small">N° Cuenta: <b>{data.seller?.bank_details?.account_number || "S/N"}</b></p>
                                    <p className="mb-0 small">CCI: <b>{data.seller?.bank_details?.cci_number || "S/N"}</b></p>
                                </div>
                            </div>
                        </div>

                        <table className="table table-bordered mb-4">
                            <thead className="table-light">
                                <tr>
                                    <th>Concepto de Liquidación</th>
                                    <th className="text-center">Base / Unidades</th>
                                    <th className="text-end">Monto Liquidado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Comisiones por Ventas Directas</td>
                                    <td className="text-center">{data.summary?.personal_items_count} prendas</td>
                                    <td className="text-end fw-bold">{formatCurrency(data.summary?.direct_commissions)}</td>
                                </tr>
                                <tr>
                                    <td>Comisiones 100% Bóveda (Inventario)</td>
                                    <td className="text-center">—</td>
                                    <td className="text-end fw-bold">{formatCurrency(data.summary?.vault_commissions)}</td>
                                </tr>
                                <tr>
                                    <td>Bonos de Metas y Ascenso</td>
                                    <td className="text-center">—</td>
                                    <td className="text-end fw-bold">{formatCurrency(data.summary?.bonus_commissions)}</td>
                                </tr>
                                <tr className="table-light">
                                    <td className="fw-bold fs-5">TOTAL A PAGAR / LIQUIDAR</td>
                                    <td></td>
                                    <td className="text-end fw-bold fs-5">{formatCurrency(data.summary?.total_earned_month)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="row mt-5 pt-4">
                            <div className="col-6 text-center">
                                <div className="border-top pt-2 mx-4">
                                    <p className="mb-0 fw-bold">Administración / Finanzas</p>
                                    <small className="text-muted">Firma y Sello</small>
                                </div>
                            </div>
                            <div className="col-6 text-center">
                                <div className="border-top pt-2 mx-4">
                                    <p className="mb-0 fw-bold">{data.seller?.name}</p>
                                    <small className="text-muted">Conformidad del Vendedor</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* MODAL PROCESAR RETIRO (ADMIN) */}
            <Modal
                modalRef={processModalRef}
                title="Procesar Solicitud de Retiro / Liquidación"
                size="md"
                hideFooter
                onSubmit={handleSaveProcessWithdrawal}
            >
                {selectedWithdrawal && (
                    <div>
                        <div className="alert alert-info py-2 px-3 small mb-3">
                            Monto a procesar: <b className="fs-6">{formatCurrency(selectedWithdrawal.amount)}</b> | Método: <b>{selectedWithdrawal.method}</b>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Estado del Retiro:</label>
                            <select
                                className="form-select"
                                value={processStatus}
                                onChange={(e) => setProcessStatus(e.target.value)}
                            >
                                <option value="completed">Completado / Pagado (Fondos transferidos)</option>
                                <option value="approved">Aprobado (En cola de transferencia)</option>
                                <option value="rejected">Rechazado</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Adjuntar Comprobante / Voucher (opcional):</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*,.pdf"
                                onChange={(e) => setReceiptFile(e.target.files[0] || null)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Notas o Referencia de Transferencia:</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Ej: Transferencia BCP N° operación 12345678 realizada con éxito."
                                value={processNotes}
                                onChange={(e) => setProcessNotes(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                            <button
                                type="button"
                                className="btn btn-light"
                                data-bs-dismiss="modal"
                                disabled={processingWithdrawal}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success px-4"
                                disabled={processingWithdrawal}
                            >
                                {processingWithdrawal && <i className="mdi mdi-loading mdi-spin me-1"></i>}
                                Confirmar y Guardar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SettlementDashboard;
