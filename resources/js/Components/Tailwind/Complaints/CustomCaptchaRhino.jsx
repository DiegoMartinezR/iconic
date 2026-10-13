import {
    useState,
    useEffect,
    useImperativeHandle,
    forwardRef,
    useRef,
} from "react";
import { RotateCw, Loader2, Check, AlertCircle, ShieldCheck } from "lucide-react";
import axios from "axios";

const CustomCaptchaRhino = forwardRef(({ onVerify, error }, ref) => {
    const [captchaImage, setCaptchaImage] = useState("");
    const [userInput, setUserInput] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [captchaToken, setCaptchaToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState("");
    const [attemptsRemaining, setAttemptsRemaining] = useState(5);
    const hasGeneratedRef = useRef(false);

    // Generar CAPTCHA desde el servidor
    const generateCaptcha = async () => {
        setIsLoading(true);
        setLocalError("");
        setUserInput("");
        setIsVerified(false);
        setAttemptsRemaining(5);
        onVerify(false, null);

        try {
            const response = await axios.post("/api/captcha/generate");
            const { token, image } = response.data;

            setCaptchaToken(token);
            setCaptchaImage(image);
        } catch (err) {
            if (err.response?.status === 429) {
                setLocalError(
                    "Demasiados intentos. Por favor, espera un momento e intenta nuevamente."
                );
            } else {
                setLocalError(
                    err.response?.data?.error ||
                    "Error al cargar CAPTCHA. Intenta nuevamente."
                );
            }
            console.error("Error generando CAPTCHA:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        reset: generateCaptcha,
    }));

    useEffect(() => {
        if (!hasGeneratedRef.current) {
            hasGeneratedRef.current = true;
            generateCaptcha();
        }
    }, []);

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setUserInput(value);
        setLocalError("");

        if (value.length === 6) {
            setIsLoading(true);

            try {
                const response = await axios.post("/api/captcha/verify", {
                    token: captchaToken,
                    answer: value,
                });

                if (response.data.success) {
                    setIsVerified(true);
                    onVerify(true, captchaToken);
                } else {
                    setIsVerified(false);
                    onVerify(false, null);
                }
            } catch (err) {
                const errorData = err.response?.data;
                setIsVerified(false);
                onVerify(false, null);

                if (errorData?.attempts_remaining !== undefined) {
                    setAttemptsRemaining(errorData.attempts_remaining);
                }

                setLocalError(errorData?.error || "Error al verificar CAPTCHA");

                if (
                    err.response?.status === 400 &&
                    errorData?.error?.includes("expirado")
                ) {
                    setTimeout(() => generateCaptcha(), 2000);
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsVerified(false);
            onVerify(false, null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-paragraph uppercase tracking-wider text-white/70">
                    <ShieldCheck size={16} className="text-primary" />
                    <span>Verificación de Seguridad *</span>
                </label>
                {isVerified && (
                    <span className="text-xs font-semibold text-primary inline-flex items-center gap-1">
                        <Check size={14} /> Verificado con éxito
                    </span>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Contenedor de la Imagen CAPTCHA */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-[300px]  flex items-center justify-center shadow-inner">
                        {isLoading && !captchaImage ? (
                            <div className="flex items-center gap-2 text-white/50 text-xs">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                <span>Cargando código...</span>
                            </div>
                        ) : (
                            <img
                                src={captchaImage}
                                alt="CAPTCHA"
                                className="w-full h-full object-cover select-none pointer-events-none"
                                draggable="false"
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={generateCaptcha}
                        disabled={isLoading}
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 text-primary hover:bg-primary/10 hover:border-primary/40 flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        title="Generar nuevo código"
                    >
                        <RotateCw
                            className={`w-5 h-5 transition-transform duration-300 ${isLoading ? "animate-spin" : "hover:rotate-180"}`}
                        />
                    </button>
                </div>

                {/* Input de Respuesta CAPTCHA */}
                <div className="w-full relative flex-1">
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        disabled={isLoading || isVerified}
                        placeholder="Ingresa los 6 caracteres"
                        maxLength={6}
                        className={`w-full px-5 py-3.5 rounded-2xl font-mono text-base tracking-widest uppercase transition-all duration-300 outline-none ${isVerified
                            ? "bg-primary/10 border-2 border-primary text-primary font-bold"
                            : error || localError
                                ? "bg-red-500/10 border-2 border-red-500 text-white placeholder-white/40"
                                : "bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-primary"
                            }`}
                    />

                    {/* Icono de Estado */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
                        {isLoading && userInput.length === 6 ? (
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        ) : isVerified ? (
                            <div className="w-6 h-6 bg-primary text-dark rounded-full flex items-center justify-center font-bold">
                                <Check size={14} />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Mensajes de Error o Advertencia */}
            {(error || localError) && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-paragraph pt-1">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error || localError}</span>
                    {attemptsRemaining < 5 && attemptsRemaining > 0 && (
                        <span className="text-primary text-xs ml-2">
                            (Intentos restantes: {attemptsRemaining})
                        </span>
                    )}
                </div>
            )}

            <p className="text-xs text-white/50 font-light">
                Escribe los 6 caracteres del código de verificación tal como aparecen en la imagen.
            </p>
        </div>
    );
});

export default CustomCaptchaRhino;
