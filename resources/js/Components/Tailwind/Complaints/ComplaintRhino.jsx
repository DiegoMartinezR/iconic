import { useEffect, useRef, useState, useMemo } from "react";
import ubigeoData from "../../../../../storage/app/utils/ubigeo.json";
import CustomCaptchaRhino from "./CustomCaptchaRhino";
import ThankYouRhino from "./ThankYouRhino";

import ReactModal from "react-modal";
import HtmlContent from "../../../Utils/HtmlContent";
import { Send, X, User, MapPin, Package, AlertTriangle, Shield, ChevronDown, Check, Search, FileText } from "lucide-react";
import { toast } from "sonner";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import { motion, AnimatePresence } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import useHeaderConfig from "../../../Utils/useHeaderConfig";

// Componente Select Personalizado para Rhino
const SelectFormRhino = ({
    options = [],
    placeholder = "Seleccionar opción",
    onChange,
    valueKey,
    labelKey,
    label,
    disabled = false,
    value = null,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const selectRef = useRef(null);

    const isArrayOfObjects = options.length > 0 && typeof options[0] === "object";
    const computedValueKey = isArrayOfObjects ? valueKey || Object.keys(options[0])[0] : null;
    const computedLabelKey = isArrayOfObjects ? labelKey || Object.keys(options[0])[1] : null;

    const normalizedOptions = useMemo(() => {
        return options.map((option) =>
            isArrayOfObjects
                ? { value: option[computedValueKey], label: option[computedLabelKey] }
                : { value: option, label: option }
        );
    }, [options, isArrayOfObjects, computedValueKey, computedLabelKey]);

    const filteredOptions = useMemo(() => {
        return normalizedOptions.filter((option) =>
            String(option.label || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [normalizedOptions, searchTerm]);

    useEffect(() => {
        if (value && normalizedOptions.length > 0) {
            const option = normalizedOptions.find((opt) => opt.value === value);
            if (option && (!selectedOption || selectedOption.value !== option.value)) {
                setSelectedOption(option);
            }
        } else if (!value && selectedOption) {
            setSelectedOption(null);
        }
    }, [value, normalizedOptions]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        setSelectedOption(option);
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={selectRef}>
            {label && (
                <label className="block text-xs font-paragraph uppercase tracking-wider text-white/60 mb-2">
                    {label}
                </label>
            )}
            <button
                type="button"
                className={`w-full relative text-start px-5 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl outline-none focus:border-primary transition-all duration-300 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:border-white/20"
                    }`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <span className="block truncate font-paragraph text-sm md:text-base">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <ChevronDown
                        className={`w-4 h-4 text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute z-50 w-full mt-2 bg-page-background border border-white/15 rounded-2xl shadow-xl max-h-60 overflow-auto"
                    >
                        {normalizedOptions.length > 8 && (
                            <div className="sticky top-0 bg-page-background p-2 border-b border-white/10 z-10">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={14} />
                                    <input
                                        type="text"
                                        className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/10 text-white text-xs font-paragraph rounded-xl outline-none focus:border-primary"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        <ul className="py-1">
                            {filteredOptions.length === 0 ? (
                                <li className="px-4 py-3 text-xs font-paragraph text-white/40 text-center">
                                    Sin resultados
                                </li>
                            ) : (
                                filteredOptions.map((option) => {
                                    const isSelected = selectedOption && selectedOption.value === option.value;
                                    return (
                                        <li
                                            key={option.value}
                                            className={`px-4 py-3 cursor-pointer flex items-center justify-between text-xs md:text-sm font-paragraph transition-colors duration-150 ${isSelected
                                                ? "bg-primary text-dark font-bold"
                                                : "text-white/80 hover:bg-white/10 hover:text-white"
                                                }`}
                                            onClick={() => handleSelect(option)}
                                        >
                                            <span className="block truncate">{option.label}</span>
                                            {isSelected && <Check className="w-4 h-4 shrink-0" />}
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function ComplaintRhino({ generals = [], data }) {
    useHeaderConfig(data);

    const [messageCaptcha, setMessageCaptcha] = useState("");
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const [formLoadedAt, setFormLoadedAt] = useState(null);

    const captchaRef = useRef();

    useEffect(() => {
        setFormLoadedAt(Math.floor(Date.now() / 1000));
    }, []);

    const [formData, setFormData] = useState({
        nombre: "",
        tipo_documento: "ruc",
        numero_identidad: "",
        celular: "",
        correo_electronico: "",
        departamento: "",
        provincia: "",
        distrito: "",
        direccion: "",
        tipo_producto: "producto",
        monto_reclamado: "",
        descripcion_producto: "",
        tipo_reclamo: "reclamo",
        fecha_ocurrencia: "",
        numero_pedido: "",
        detalle_reclamo: "",
        acepta_terminos: false,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "date" && value) {
            const [year] = value.split("-");
            if (year && year.length > 4) {
                return;
            }
        }

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const resetForm = () => {
        setFormData({
            nombre: "",
            tipo_documento: "ruc",
            numero_identidad: "",
            celular: "",
            correo_electronico: "",
            departamento: "",
            provincia: "",
            distrito: "",
            direccion: "",
            tipo_producto: "producto",
            monto_reclamado: "",
            descripcion_producto: "",
            tipo_reclamo: "reclamo",
            fecha_ocurrencia: "",
            numero_pedido: "",
            detalle_reclamo: "",
            acepta_terminos: false,
        });
        setDepartamento("");
        setProvincia("");
        setDistrito("");
        setIsCaptchaVerified(false);
        setCaptchaToken(null);
        setMessageCaptcha("");

        if (captchaRef.current) {
            captchaRef.current.reset();
        }
    };

    const handleCaptchaVerify = (isVerified, token) => {
        setIsCaptchaVerified(isVerified);
        setCaptchaToken(token);
        if (isVerified) {
            setMessageCaptcha("");
        }
    };

    const handleBackToForm = () => {
        if (window.history && window.history.pushState) {
            window.history.pushState({}, "", window.location.pathname);
        }
        setShowThankYou(false);
        setSubmittedData(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!isCaptchaVerified || !captchaToken) {
            setMessageCaptcha("Por favor, completa la verificación de seguridad.");
            setLoading(false);
            return;
        }

        setMessageCaptcha("");

        const updatedFormData = {
            ...formData,
            captcha_verified: true,
            recaptcha_token: captchaToken,
            _form_loaded_at: formLoadedAt,
            _hp: "",
        };

        fetch("/api/complaints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFormData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.type === "success") {
                    const claimCode = data.data?.code || data.data?.numero_reclamacion || "RHI-2026-000001";
                    if (window.history && window.history.pushState) {
                        const newUrl = `${window.location.pathname}?code=${encodeURIComponent(claimCode)}`;
                        window.history.pushState({ code: claimCode }, "", newUrl);
                    }
                    setSubmittedData(data.data);
                    setShowThankYou(true);
                    resetForm();
                    setLoading(false);
                } else {
                    toast.error("Solicitud rechazada", {
                        description: `No se pudo registrar su solicitud.`,
                        icon: <Send className="h-5 w-5 text-red-500" />,
                        duration: 3000,
                        position: "bottom-center",
                    });
                    setLoading(false);
                }
            })
            .catch((error) => {
                toast.error("Solicitud rechazada", {
                    description: error.message || `No se pudo registrar su solicitud.`,
                    icon: <Send className="h-5 w-5 text-red-500" />,
                    duration: 3000,
                    position: "bottom-center",
                });
                setLoading(false);
            });
    };

    const [departamento, setDepartamento] = useState("");
    const [provincia, setProvincia] = useState("");
    const [distrito, setDistrito] = useState("");

    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);

    useEffect(() => {
        const uniqueDepartamentos = [
            ...new Set(ubigeoData.map((item) => item.departamento)),
        ];
        setDepartamentos(uniqueDepartamentos);

        // Soporte para URL con parámetro ?code=RHI-2026-000001 (Mediciones / Tracking / Recarga)
        const searchParams = new URLSearchParams(window.location.search);
        const codeParam = searchParams.get("code");
        if (codeParam) {
            setLoading(true);
            fetch(`/api/complaints/track/${encodeURIComponent(codeParam)}`)
                .then((res) => res.json())
                .then((resData) => {
                    if (resData.type === "success" && resData.data) {
                        setSubmittedData(resData.data);
                    } else {
                        setSubmittedData({ code: codeParam });
                    }
                    setShowThankYou(true);
                    setLoading(false);
                })
                .catch(() => {
                    setSubmittedData({ code: codeParam });
                    setShowThankYou(true);
                    setLoading(false);
                });
        }
    }, []);

    useEffect(() => {
        if (departamento) {
            const filteredProvincias = [
                ...new Set(
                    ubigeoData
                        .filter((item) => item.departamento === departamento)
                        .map((item) => item.provincia)
                ),
            ];
            setProvincias(filteredProvincias);
            setProvincia("");
            setDistrito("");
            setDistritos([]);
            setFormData((prev) => ({
                ...prev,
                departamento: departamento,
                provincia: "",
                distrito: "",
            }));
        }
    }, [departamento]);

    useEffect(() => {
        if (provincia) {
            const filteredDistritos = ubigeoData
                .filter(
                    (item) =>
                        item.departamento === departamento &&
                        item.provincia === provincia
                )
                .map((item) => item.distrito);
            setDistritos(filteredDistritos);
            setDistrito("");
            setFormData((prev) => ({
                ...prev,
                provincia: provincia,
                distrito: "",
            }));
        }
    }, [provincia]);

    useEffect(() => {
        if (distrito) {
            setFormData((prev) => ({ ...prev, distrito: distrito }));
        }
    }, [distrito]);

    const typesDocument = [
        { value: "ruc", label: "RUC" },
        { value: "dni", label: "DNI" },
        { value: "ce", label: "CE" },
        { value: "pasaporte", label: "Pasaporte" },
    ];
    const typesContract = [
        { value: "producto", label: "Producto" },
        { value: "servicio", label: "Servicio" },
    ];
    const typesClaim = [
        { value: "reclamo", label: "Reclamo" },
        { value: "queja", label: "Queja" },
    ];

    const [modalOpen, setModalOpen] = useState(null);

    const policyItems = {
        terms_conditions: "Términos y condiciones",
    };

    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(null);

    if (showThankYou && submittedData) {
        return (
            <ThankYouRhino
                complaintData={submittedData}
                onBackToForm={handleBackToForm}
                data={data}
            />
        );
    }

    return (
        <div
            id={data?.element_id || "complaint-rhino"}
            className="min-h-screen bg-page-background text-white font-paragraph pt-32 md:pt-36 lg:pt-40 pb-16 md:pb-24"
        >
            {/* Override inline para estilo captcha en modo oscuro Rhino */}
            <style>{`
                .captcha-container img {
                    border: 1px solid rgba(255,255,255,0.15) !important;
                    border-radius: 12px !important;
                }
                .captcha-container button {
                    background: rgba(255,255,255,0.05) !important;
                    border: 1px solid rgba(255,255,255,0.15) !important;
                    border-radius: 12px !important;
                    color: white !important;
                }
                .captcha-container button:hover {
                    border-color: #f39200 !important;
                }
                .captcha-container input {
                    border: 1px solid rgba(255,255,255,0.15) !important;
                    background: rgba(255,255,255,0.05) !important;
                    color: white !important;
                    border-radius: 12px !important;
                }
                .captcha-container input:focus {
                    border-color: #f39200 !important;
                    box-shadow: none !important;
                }
            `}</style>

            <div className="2xl:max-w-7xl mx-auto px-6 2xl:px-0">
                {/* Header de Sección Estilo Rhino */}
                <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">

                    <h1 className="text-5xl md:text-6xl lg:text-8xl font-title text-primary mb-6">
                        <TextWithHighlight
                            text={data?.title || "Libro de *Reclamaciones*"}
                            className="font-title"
                            color="text-white"
                        />
                    </h1>

                    <p className="mt-4 md:text-lg lg:text-xl text-white font-light max-w-2xl mx-auto">
                        Conforme a lo establecido en el Código de Protección y Defensa del Consumidor, ponemos a tu disposición nuestro libro de reclamaciones virtual.
                    </p>
                </div>

                {/* Card Contenedor Principal Formulario Estilo Rhino */}
                <div className="rounded-2xl max-w-4xl mx-auto border border-white/10 pb-10 lg:pb-12 px-6 md:px-12 transition-all duration-300">
                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Campo Honeypot para spam bots */}
                        <input
                            type="text"
                            name="_hp"
                            tabIndex="-1"
                            autoComplete="off"
                            className="hidden pointer-events-none opacity-0"
                            aria-hidden="true"
                        />

                        {/* Sección 1: Identificación del Consumidor */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 text-primary flex items-center justify-center shrink-0">
                                    <User size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-3xl font-title text-white">
                                        1. Identificación del Consumidor
                                    </h2>
                                    <p className="text-sm text-white/60 font-light">Ingresa tus datos personales de contacto</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-paragraph uppercase tracking-wider text-white/60 mb-2">
                                        Nombres completos *
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Escribe tu nombre y apellidos"
                                        required
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 py-3.5 px-5"
                                    />
                                </div>

                                <SelectFormRhino
                                    label="Tipo de documento *"
                                    options={typesDocument}
                                    placeholder="Seleccionar documento"
                                    value={formData.tipo_documento}
                                    onChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            tipo_documento: value,
                                        }));
                                    }}
                                />

                                <div>
                                    <label className="block text-xs font-paragraph uppercase tracking-wider text-white/60 mb-2">
                                        Número de documento *
                                    </label>
                                    <input
                                        type="text"
                                        name="numero_identidad"
                                        value={formData.numero_identidad}
                                        onChange={handleChange}
                                        placeholder="Ingresa el número"
                                        required
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 py-3.5 px-5"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-paragraph uppercase tracking-wider text-white/60 mb-2">
                                        Número de celular *
                                    </label>
                                    <input
                                        type="tel"
                                        name="celular"
                                        value={formData.celular}
                                        onChange={handleChange}
                                        placeholder="Ej: 999999999"
                                        required
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 py-3.5 px-5"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-paragraph uppercase tracking-wider text-white/60 mb-2">
                                        Correo electrónico *
                                    </label>
                                    <input
                                        type="email"
                                        name="correo_electronico"
                                        value={formData.correo_electronico}
                                        onChange={handleChange}
                                        placeholder="tu@correo.com"
                                        required
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 py-3.5 px-5"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sección 2: Ubicación */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 text-primary flex items-center justify-center shrink-0">
                                    <MapPin size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-3xl font-title text-white">
                                        2. Ubicación del Consumidor
                                    </h2>
                                    <p className="text-sm text-white/60 font-light">Indica tu domicilio o dirección fiscal</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <SelectFormRhino
                                    label="Departamento *"
                                    options={departamentos}
                                    placeholder="Seleccionar"
                                    value={departamento}
                                    onChange={(value) => {
                                        setDepartamento(value);
                                        setFormData((prev) => ({
                                            ...prev,
                                            departamento: value,
                                        }));
                                    }}
                                />
                                <SelectFormRhino
                                    disabled={!departamento}
                                    label="Provincia *"
                                    options={provincias}
                                    placeholder="Seleccionar"
                                    value={provincia}
                                    onChange={(value) => {
                                        setProvincia(value);
                                        setFormData((prev) => ({
                                            ...prev,
                                            provincia: value,
                                        }));
                                    }}
                                />
                                <SelectFormRhino
                                    disabled={!provincia}
                                    label="Distrito *"
                                    options={distritos}
                                    placeholder="Seleccionar"
                                    value={distrito}
                                    onChange={(value) => {
                                        setDistrito(value);
                                        setFormData((prev) => ({
                                            ...prev,
                                            distrito: value,
                                        }));
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-paragraph uppercase tracking-wider text-white/60 mb-2">
                                    Dirección completa *
                                </label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    placeholder="Ej: Av. Principal 1450, Dpto 402"
                                    required
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 py-3.5 px-5"
                                />
                            </div>
                        </div>

                        {/* Sección 3: Identificación del bien contratado */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 text-primary flex items-center justify-center shrink-0">
                                    <Package size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-3xl font-title text-white">
                                        3. Identificación del Bien Contratado
                                    </h2>
                                    <p className="text-sm text-white/60 font-light">Detalles del producto o servicio contratado</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <SelectFormRhino
                                        label="Tipo de contratación *"
                                        options={typesContract}
                                        placeholder="Seleccionar"
                                        value={formData.tipo_producto}
                                        onChange={(value) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                tipo_producto: value,
                                            }));
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-paragraph uppercase tracking-wider text-white/60 mb-2">
                                        Monto reclamado ({CurrencySymbol()}) *
                                    </label>
                                    <input
                                        type="number"
                                        name="monto_reclamado"
                                        value={formData.monto_reclamado}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        required
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 py-3.5 px-5"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-paragraph uppercase tracking-wider text-white/60 mb-2">
                                        Descripción del producto o servicio *
                                    </label>
                                    <input
                                        type="text"
                                        name="descripcion_producto"
                                        value={formData.descripcion_producto}
                                        onChange={handleChange}
                                        placeholder="Ej: Fabricación de Estructura Metálica"
                                        required
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 py-3.5 px-5"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sección 4: Detalles del reclamo o queja */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 text-primary flex items-center justify-center shrink-0">
                                    <AlertTriangle size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-3xl font-title text-white">
                                        4. Detalles del Reclamo o Queja
                                    </h2>
                                    <p className="text-sm text-white/60 font-light">Describe el hecho u ocurrencia</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectFormRhino
                                    label="Tipo de reclamación *"
                                    options={typesClaim}
                                    placeholder="Seleccionar"
                                    value={formData.tipo_reclamo}
                                    onChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            tipo_reclamo: value,
                                        }));
                                    }}
                                />

                                <div>
                                    <label className="block text-xs font-paragraph uppercase tracking-wider text-white/60 mb-2">
                                        Fecha de ocurrencia *
                                    </label>
                                    <input
                                        type="date"
                                        name="fecha_ocurrencia"
                                        value={formData.fecha_ocurrencia}
                                        onChange={handleChange}
                                        max={new Date().toISOString().split("T")[0]}
                                        min="2020-01-01"
                                        required
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 py-3.5 px-5"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-paragraph uppercase tracking-wider text-white/60 mb-2">
                                        Número de pedido / Cotización (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        name="numero_pedido"
                                        value={formData.numero_pedido}
                                        onChange={handleChange}
                                        placeholder="Ej: COT-2026-089"
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 py-3.5 px-5"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-paragraph uppercase tracking-wider text-white/60 mb-2">
                                        Detalle del reclamo o queja *
                                    </label>
                                    <textarea
                                        name="detalle_reclamo"
                                        rows={4}
                                        placeholder="Detalla de forma clara el inconveniente presentado con el producto o servicio adquirido..."
                                        value={formData.detalle_reclamo}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all duration-300 py-3.5 px-5"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sección 5: Términos y Verificación Captcha */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 text-primary flex items-center justify-center shrink-0">
                                    <Shield size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-3xl font-title text-white">
                                        5. Términos y Verificación
                                    </h2>
                                    <p className="text-sm text-white/60 font-light">Confirmación de seguridad</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-start gap-4">
                                    <input
                                        type="checkbox"
                                        id="acepta_terminos"
                                        name="acepta_terminos"
                                        className="mt-1 w-5 h-5 rounded-lg border-white/20 bg-white/5 text-primary focus:ring-primary cursor-pointer"
                                        checked={formData.acepta_terminos}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label htmlFor="acepta_terminos" className="text-xs md:text-sm text-white/70 font-paragraph leading-relaxed cursor-pointer select-none">
                                        Declaro que la información registrada es real y acepto los{" "}
                                        <a
                                            href={data?.terms_url || "/terminos-y-condiciones"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary underline font-bold hover:text-primary/80 transition-colors"
                                        >
                                            términos y condiciones
                                        </a>{" "}
                                        del libro de reclamaciones virtual.
                                    </label>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-300">
                                <CustomCaptchaRhino
                                    ref={captchaRef}
                                    onVerify={handleCaptchaVerify}
                                    error={messageCaptcha}
                                />
                            </div>
                        </div>

                        {/* Acciones del Formulario */}
                        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="w-full sm:w-auto px-6 py-3.5 border border-white/20 hover:bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                            >
                                Limpiar Formulario
                            </button>

                            <button
                                disabled={loading || !formData.acepta_terminos || !isCaptchaVerified}
                                type="submit"
                                className="w-full sm:w-auto text-xs bg-primary hover:bg-primary/90 text-dark font-bold rounded-full py-4 px-8 flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30 uppercase tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        <span>Registrando reclamo...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Send size={16} />
                                        <span>Enviar Reclamo Oficial</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal para términos y condiciones */}
            {Object.keys(policyItems).map((key, index) => {
                const title = policyItems[key];
                const content = Array.isArray(generals)
                    ? generals.find((x) => x.correlative === key)?.description ?? ""
                    : "";
                return (
                    <ReactModal
                        key={index}
                        isOpen={modalOpen === index}
                        onRequestClose={closeModal}
                        contentLabel={title}
                        className="fixed inset-0 m-auto max-w-4xl max-h-[85vh] bg-[#0F1420] border border-white/15 text-white outline-none flex flex-col z-[99999] rounded-3xl shadow-2xl overflow-hidden"
                        overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-md z-[99998]"
                        ariaHideApp={false}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/15 bg-white/5">
                            <h2 className="text-lg md:text-xl font-title font-bold text-primary">{title}</h2>
                            <button
                                onClick={closeModal}
                                className="text-white/60 hover:text-white transition-colors duration-200 border border-white/15 p-2 rounded-full hover:bg-white/10"
                                aria-label="Cerrar modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 font-paragraph leading-relaxed text-sm md:text-base text-white/80">
                            <div className="prose prose-invert max-w-none prose-p:text-white/80 prose-h2:text-primary prose-a:text-primary">
                                <HtmlContent html={content} />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end p-6 border-t border-white/15 bg-white/5">
                            <button
                                onClick={closeModal}
                                className="px-6 py-3 bg-primary text-neutral-dark font-bold text-xs uppercase tracking-wider rounded-full hover:bg-primary/90 transition-all cursor-pointer"
                            >
                                Entendido
                            </button>
                        </div>
                    </ReactModal>
                );
            })}
        </div>
    );
}
