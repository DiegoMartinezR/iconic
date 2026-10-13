import React, { useEffect, useState } from "react"
import { Search, RefreshCw, AlertTriangle, Package, CheckCircle } from "lucide-react"
import { GET } from "sode-extend-react"
import SalesRest from "../../../Actions/SalesRest"

const salesRest = new SalesRest()

const formatDate = (dateStr) => {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    const date = d.toLocaleDateString("es-PE", { year: "numeric", month: "2-digit", day: "2-digit" })
    const time = d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: true })
    return { date, time }
}

const TrackTwenty = ({ data }) => {
    const [orderCode, setOrderCode] = useState(GET?.code ?? "")
    const [statusTracking, setStatusTracking] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const fetchTracking = async (code) => {
        const { status, tracking } = await salesRest.track(code, false)
        if (!status) throw new Error("No encontrado")
        return tracking.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    const handleSearch = async (e) => {
        e?.preventDefault()
        if (!orderCode.trim()) return
        setIsLoading(true)
        setNotFound(false)
        setStatusTracking(null)
        try {
            setStatusTracking(await fetchTracking(orderCode))
        } catch {
            setNotFound(true)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRefresh = async () => {
        if (!orderCode.trim()) return
        setIsLoading(true)
        try {
            const result = await fetchTracking(orderCode)
            setStatusTracking(null)
            setTimeout(() => setStatusTracking(result), 80)
        } catch {
            setNotFound(true)
            setStatusTracking(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (orderCode) handleSearch()
    }, [])

    const currentStatus = statusTracking?.[0] ?? null

    return (
        <div
            id={data?.element_id || undefined}
            className="min-h-screen bg-primary text-white py-10 sm:py-16 px-4 sm:px-6 w-full max-w-full overflow-x-hidden"
        >
            <div className="px-primary 2xl:px-0 2xl:max-w-2xl mx-auto w-full">

                {/* ── Header ── */}
                <div className="mb-8 sm:mb-10 text-center flex flex-col items-center">
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase text-white">
                        Estado del pedido
                    </span>
                    <h1 className="mt-3 text-4xl sm:text-5xl font-black uppercase leading-none text-white">
                        Rastrear pedido
                    </h1>
                    <p className="mt-3 text-sm text-white/60 px-2 max-w-md">
                        Ingresa el código de tu pedido para ver su estado actual
                    </p>
                </div>

                {/* ── Buscador ── */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-8 sm:mb-10 rounded-3xl sm:rounded-full border border-white/15 bg-white/5 p-1.5 w-full">
                    <input
                        type="text"
                        placeholder="Ej: 20250624142749044420"
                        value={orderCode}
                        onChange={(e) => setOrderCode(e.target.value)}
                        className="w-full flex-1 min-w-0 bg-transparent text-white placeholder-white/40 px-4 sm:px-5 py-3 text-sm outline-none border-0 rounded-full"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !orderCode.trim()}
                        className="w-full sm:w-auto bg-white text-primary px-6 py-3 text-xs font-bold uppercase rounded-full hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shrink-0"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Search size={14} strokeWidth={2.5} />
                        )}
                        {!isLoading && <span>Buscar</span>}
                    </button>
                </form>

                {/* ── Estado actual ── */}
                {currentStatus && (() => {
                    const { date, time } = formatDate(currentStatus.created_at)
                    return (
                        <div className="border border-white/15 rounded-3xl mb-8 bg-white/5 backdrop-blur-sm w-full overflow-hidden">
                            <div
                                className="h-1 w-full"
                                style={{ backgroundColor: currentStatus.color || "#ffffff" }}
                            />
                            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex items-center sm:items-start gap-3 sm:gap-4 min-w-0">
                                    <div
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: currentStatus.color || "#ffffff" }}
                                    >
                                        {currentStatus.icon ? (
                                            <i className={`${currentStatus.icon} text-white text-base sm:text-lg`} />
                                        ) : (
                                            <CheckCircle size={18} className="text-black" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[9px] uppercase text-white/30 mb-0.5 sm:mb-1">
                                            Estado actual
                                        </p>
                                        <p
                                            className="text-lg sm:text-xl font-black break-words"
                                            style={{ color: currentStatus.color || "#ffffff" }}
                                        >
                                            {currentStatus.name}
                                        </p>
                                        {currentStatus.description && (
                                            <p className="text-xs text-white/50 mt-1 max-w-xs break-words">
                                                {currentStatus.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex sm:flex-col items-center justify-between sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 text-left sm:text-right shrink-0 w-full sm:w-auto">
                                    <p className="text-xs font-bold text-white">{date}</p>
                                    <p className="text-[10px] text-white/30 sm:mt-0.5">{time}</p>
                                </div>
                            </div>
                        </div>
                    )
                })()}

                {/* ── No encontrado ── */}
                {notFound && (
                    <div className="border border-red-500/30 rounded-3xl bg-red-500/5 p-6 sm:p-8 text-center mb-8 w-full overflow-hidden">
                        <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" strokeWidth={1.5} />
                        <p className="text-[9px] uppercase text-red-400/60 mb-2">
                            Error
                        </p>
                        <h3 className="text-base font-black text-red-400 mb-2">Pedido no encontrado</h3>
                        <p className="text-xs text-white/40 break-all">
                            No se encontró información para el código{" "}
                            <span className="text-white/70 font-bold">{orderCode}</span>
                        </p>
                    </div>
                )}

                {/* ── Timeline ── */}
                {statusTracking && statusTracking.length > 0 && (
                    <div className="w-full">
                        {/* Encabezado de timeline */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 gap-2">
                            <div>
                                <p className="text-[9px] uppercase text-white/30 mb-1">
                                    Historial
                                </p>
                                <h3 className="text-sm sm:text-base font-black text-white">
                                    Tracking de estados
                                </h3>
                            </div>
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 border border-white/15 rounded-full px-4 py-2 text-[10px] font-bold uppercase text-white/60 hover:text-white hover:border-white/40 transition-all disabled:opacity-30 shrink-0"
                            >
                                <RefreshCw
                                    size={12}
                                    strokeWidth={2.5}
                                    className={isLoading ? "animate-spin" : ""}
                                />
                                Refrescar
                            </button>
                        </div>

                        {/* Items */}
                        <div className="relative w-full">
                            {/* Línea vertical */}
                            <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-px bg-white/10" />

                            <div className="space-y-4 sm:space-y-5">
                                {statusTracking.map((status, index) => {
                                    const { date, time } = formatDate(status.created_at)
                                    const isFirst = index === 0
                                    return (
                                        <div
                                            key={status.id}
                                            className="relative flex items-start gap-3 sm:gap-5 min-w-0"
                                            style={{
                                                animation: `fadeSlideIn 0.3s ease both`,
                                                animationDelay: `${index * 50}ms`
                                            }}
                                        >
                                            {/* Dot */}
                                            <div
                                                className={`relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 transition-all ${isFirst ? "ring-2 ring-white/20" : ""}`}
                                                style={{ backgroundColor: status.color || "#333" }}
                                            >
                                                {status.icon ? (
                                                    <i className={`${status.icon} text-white text-xs sm:text-sm`} />
                                                ) : (
                                                    <Package size={14} className="text-white" />
                                                )}
                                            </div>

                                            {/* Card */}
                                            <div
                                                className={`flex-1 min-w-0 border rounded-2xl p-4 sm:p-5 transition-all ${isFirst
                                                    ? "border-white/20 bg-white/8"
                                                    : "border-white/8 bg-white/3"
                                                    }`}
                                                style={isFirst ? { borderColor: `${status.color}40` } : {}}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-3 mb-2">
                                                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                                        <span
                                                            className="text-[10px] font-bold uppercase rounded-full px-2.5 py-1"
                                                            style={{
                                                                backgroundColor: `${status.color}20`,
                                                                color: status.color || "#fff",
                                                            }}
                                                        >
                                                            {status.name}
                                                        </span>
                                                        {isFirst && (
                                                            <span className="text-[9px] font-bold uppercase text-white/50 border border-white/15 rounded-full px-2.5 py-1">
                                                                Actual
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex sm:flex-col items-center gap-2 sm:gap-0 sm:text-right shrink-0 text-white/70">
                                                        <p className="text-[10px] font-bold">{date}</p>
                                                        <p className="text-[9px] text-white/40 sm:mt-0.5">{time}</p>
                                                    </div>
                                                </div>
                                                {status.description && (
                                                    <p className="text-xs text-white/50 leading-relaxed break-words">
                                                        {status.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Animación inline */}
                <style>{`
                    @keyframes fadeSlideIn {
                        from { opacity: 0; transform: translateY(8px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    .bg-white\/8  { background-color: rgba(255,255,255,0.08); }
                    .bg-white\/3  { background-color: rgba(255,255,255,0.03); }
                `}</style>
            </div>
        </div>
    )
}

export default TrackTwenty
