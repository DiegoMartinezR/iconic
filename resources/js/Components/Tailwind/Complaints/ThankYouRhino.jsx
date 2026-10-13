import React from "react";
import { CheckCircle, FileText, User, MapPin, Package, MessageSquare, Printer, ArrowLeft, ShieldCheck } from "lucide-react";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

export default function ThankYouRhino({ complaintData = {}, onBackToForm, data }) {
    const formatDate = (dateString) => {
        if (!dateString) return "No especificada";
        return new Date(dateString).toLocaleDateString("es-PE", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const code = complaintData?.code || complaintData?.numero_reclamacion || "RHI-2026-000001";
    const nombre = complaintData?.nombre || complaintData?.name || "";
    const tipoDoc = (complaintData?.tipo_documento || complaintData?.type_document || complaintData?.identity_type || "").toUpperCase();
    const numDoc = complaintData?.numero_identidad || complaintData?.document_number || complaintData?.dni || "";
    const email = complaintData?.correo_electronico || complaintData?.email || "";
    const celular = complaintData?.celular || complaintData?.phone || "";
    const departamento = complaintData?.departamento || complaintData?.department || "";
    const provincia = complaintData?.provincia || complaintData?.province || "";
    const distrito = complaintData?.distrito || complaintData?.district || "";
    const direccion = complaintData?.direccion || complaintData?.address || "";
    const tipoProducto = complaintData?.tipo_producto || complaintData?.product_type || complaintData?.type || "";
    const monto = complaintData?.monto_reclamado || complaintData?.amount || "";
    const descripcionProd = complaintData?.descripcion_producto || complaintData?.product_description || "";
    const tipoReclamo = complaintData?.tipo_reclamo || complaintData?.type_claim || "";
    const fechaOcurrencia = complaintData?.fecha_ocurrencia || complaintData?.date || "";
    const detalleReclamo = complaintData?.detalle_reclamo || complaintData?.description || "";

    const hasConsumerData = Boolean(nombre || numDoc || email || celular);
    const hasLocationData = Boolean(direccion || departamento || provincia || distrito);
    const hasProductData = Boolean(descripcionProd || tipoProducto || monto);
    const hasClaimData = Boolean(detalleReclamo || tipoReclamo || fechaOcurrencia);

    return (
        <div className="min-h-screen bg-page-background text-white font-paragraph pt-28 md:pt-36 lg:pt-40 pb-16 md:pb-24">
            {/* Estilos para impresión en PDF */}
            <style>{`
                @media print {
                    body { 
                        background: #000 !important;
                        color: #fff !important;
                        -webkit-print-color-adjust: exact; 
                        color-adjust: exact; 
                    }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    .printable-area {
                        position: static !important;
                        margin: 0 !important;
                        padding: 20px !important;
                    }
                    .print-header {
                        border-bottom: 2px solid rgba(255,255,255,0.2);
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        text-align: center;
                    }
                    .print-section {
                        page-break-inside: avoid;
                        margin-bottom: 20px;
                        border: 1px solid rgba(255,255,255,0.2);
                        padding: 15px;
                        border-radius: 12px;
                    }
                }
            `}</style>

            <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0">
                {/* Header de Agradecimiento Rhino */}
                <div className="max-w-3xl mx-auto text-center mb-12 no-print">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-6 backdrop-blur-md">
                        <CheckCircle size={16} />
                        <span>Confirmación de Registro</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-8xl font-title text-primary mb-4">
                        <TextWithHighlight
                            text={"¡Reclamo *Registrado!*"}
                            className="font-title"
                            color="text-white"
                        />
                    </h1>

                    <p className="text-white/80 text-lg md:text-xl font-light max-w-2xl mx-auto">
                        Su reclamo o queja ha sido registrado correctamente en nuestro sistema. Le daremos respuesta dentro de los próximos 15 días hábiles.
                    </p>
                </div>

                {/* Contenedor del Comprobante Imprimible */}
                <div className="printable-area max-w-4xl mx-auto">
                    {/* Header para Impresión PDF */}
                    <div className="print-header print-only hidden text-center border-b border-white/20 pb-6 mb-8">
                        <h1 className="text-3xl font-title text-primary font-bold">RHINO TECHNOLOGY</h1>
                        <p className="text-sm text-white/70 font-mono mt-1">LIBRO DE RECLAMACIONES VIRTUAL</p>
                        <p className="text-xs text-white/50 font-mono mt-0.5">Comprobante Oficial de Registro - Fecha: {formatDate(new Date())}</p>
                    </div>

                    {/* Tarjeta Principal Estilo Rhino */}
                    <div className="rounded-2xl border border-white/10 overflow-hidden transition-all duration-300">
                        {/* Cabecera del Resumen */}
                        <div className="p-6 md:p-8 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 text-primary flex items-center justify-center shrink-0">
                                    <FileText size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-title text-white">
                                        Resumen Oficial del Reclamo
                                    </h2>
                                    <p className="text-sm text-white/60 font-light">Código de seguimiento asignado</p>
                                </div>
                            </div>

                            <div className="bg-primary/10 border border-primary/30 rounded-2xl px-6 py-3 shrink-0">
                                <span className="block text-xs uppercase tracking-wider font-semibold text-primary/80 mb-0.5">N° de Reclamo</span>
                                <span className="text-2xl font-mono font-bold text-primary">{code}</span>
                            </div>
                        </div>

                        {/* Detalles del Formulario Registrado */}
                        <div className="p-6 md:p-8 space-y-8">
                            {/* Datos del Consumidor */}
                            {hasConsumerData && (
                                <div className="print-section space-y-4">
                                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 text-primary flex items-center justify-center shrink-0">
                                            <User size={18} />
                                        </div>
                                        <h3 className="text-lg font-title text-white">1. Datos del Consumidor</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {nombre && (
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-xs uppercase tracking-wider text-white/50 block mb-1">Nombre Completo</span>
                                                <p className="text-base font-semibold text-white">{nombre}</p>
                                            </div>
                                        )}
                                        {numDoc && (
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-xs uppercase tracking-wider text-white/50 block mb-1">Documento de Identidad</span>
                                                <p className="text-base font-semibold text-white">{tipoDoc ? `${tipoDoc} - ` : ""}{numDoc}</p>
                                            </div>
                                        )}
                                        {email && (
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-xs uppercase tracking-wider text-white/50 block mb-1">Correo Electrónico</span>
                                                <p className="text-base font-semibold text-white">{email}</p>
                                            </div>
                                        )}
                                        {celular && (
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-xs uppercase tracking-wider text-white/50 block mb-1">Teléfono / Celular</span>
                                                <p className="text-base font-semibold text-white">{celular}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Ubicación */}
                            {hasLocationData && (
                                <div className="print-section space-y-4">
                                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 text-primary flex items-center justify-center shrink-0">
                                            <MapPin size={18} />
                                        </div>
                                        <h3 className="text-lg font-title text-white">2. Ubicación</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {(departamento || provincia || distrito) && (
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-xs uppercase tracking-wider text-white/50 block mb-1">Departamento / Provincia / Distrito</span>
                                                <p className="text-base font-semibold text-white">{[departamento, provincia, distrito].filter(Boolean).join(" / ")}</p>
                                            </div>
                                        )}
                                        {direccion && (
                                            <div className="md:col-span-2 p-4 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-xs uppercase tracking-wider text-white/50 block mb-1">Dirección Completa</span>
                                                <p className="text-base font-semibold text-white">{direccion}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Detalle del bien contratado */}
                            {hasProductData && (
                                <div className="print-section space-y-4">
                                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 text-primary flex items-center justify-center shrink-0">
                                            <Package size={18} />
                                        </div>
                                        <h3 className="text-lg font-title text-white">3. Bien Contratado</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {tipoProducto && (
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-xs uppercase tracking-wider text-white/50 block mb-1">Tipo de Bien</span>
                                                <p className="text-base font-semibold text-white capitalize">{tipoProducto}</p>
                                            </div>
                                        )}
                                        {monto && (
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-xs uppercase tracking-wider text-white/50 block mb-1">Monto Reclamado</span>
                                                <p className="text-base font-mono font-bold text-primary">{CurrencySymbol()} {monto}</p>
                                            </div>
                                        )}
                                        {descripcionProd && (
                                            <div className="md:col-span-2 p-4 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-xs uppercase tracking-wider text-white/50 block mb-1">Descripción del Producto o Servicio</span>
                                                <p className="text-base text-white/80 font-light leading-relaxed">{descripcionProd}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Detalle de la Reclamación */}
                            {hasClaimData && (
                                <div className="print-section space-y-4">
                                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 text-primary flex items-center justify-center shrink-0">
                                            <MessageSquare size={18} />
                                        </div>
                                        <h3 className="text-lg font-title text-white">4. Reclamación Registrada</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {tipoReclamo && (
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-xs uppercase tracking-wider text-white/50 block mb-1">Tipo de Reclamación</span>
                                                <p className="text-base font-semibold text-white capitalize">{tipoReclamo}</p>
                                            </div>
                                        )}
                                        {fechaOcurrencia && (
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-xs uppercase tracking-wider text-white/50 block mb-1">Fecha de Ocurrencia</span>
                                                <p className="text-base font-semibold text-white">{formatDate(fechaOcurrencia)}</p>
                                            </div>
                                        )}
                                        {detalleReclamo && (
                                            <div className="md:col-span-2 p-4 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-xs uppercase tracking-wider text-white/50 block mb-1">Detalle del Reclamo o Queja</span>
                                                <p className="text-base text-white/80 font-light leading-relaxed whitespace-pre-line">{detalleReclamo}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Acciones e Información de Próximos Pasos */}
                <div className="max-w-4xl mx-auto mt-8 no-print space-y-6">
                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex items-start gap-4">
                        <ShieldCheck size={24} className="text-primary shrink-0 mt-1" />
                        <div className="text-xs md:text-sm text-white/70 font-paragraph space-y-1">
                            <p className="text-white font-bold">Respaldo y Próximos Pasos:</p>
                            <p>• Conserve este código (<span className="text-primary font-mono font-bold">{code}</span>) para consultas de seguimiento.</p>
                            <p>• La respuesta oficial será enviada dentro del plazo legal máximo de 15 días hábiles.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {onBackToForm && (
                            <button
                                onClick={onBackToForm}
                                className="w-full sm:w-auto px-8 py-4 border border-white/20 hover:bg-white/10 text-white rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={16} />
                                Nuevo Registro
                            </button>
                        )}
                        <button
                            onClick={handlePrint}
                            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-dark font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Printer size={16} />
                            Imprimir / Guardar PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
