import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, Phone, MapPin, Check } from "lucide-react";
import React, { useState, useRef } from "react";
import Swal from "sweetalert2";

import MessagesRest from "../../../Actions/MessagesRest";
import Global from "../../../Utils/Global";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import useHeaderConfig from "../../../Utils/useHeaderConfig";

// Rhino motion container animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.15,
            duration: 0.5,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const ContactRhino = ({ data, generals = [] }) => {
    useHeaderConfig(data);

    const messagesRest = new MessagesRest();
    messagesRest.enableNotifications = false;

    const nameRef = useRef();
    const lastnameRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const descriptionRef = useRef();

    const [sending, setSending] = useState(false);

    const clearForm = () => {
        const fields = [
            nameRef,
            lastnameRef,
            phoneRef,
            emailRef,
            descriptionRef,
        ];
        fields.forEach((ref) => {
            if (ref.current) {
                ref.current.value = "";
            }
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);

        const request = {
            name: (nameRef.current?.value || "") + " " + (lastnameRef.current?.value || ""),
            phone: phoneRef.current?.value || "",
            email: emailRef.current?.value || "",
            description: descriptionRef.current?.value || "",
        };

        try {
            const result = await messagesRest.save(request);
            setSending(false);

            if (!result) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.",
                    confirmButtonText: "Entendido",
                    customClass: {
                        popup: "rounded-3xl bg-[#0F1420] border border-white/15 text-white font-paragraph shadow-2xl",
                        confirmButton:
                            "bg-primary text-neutral-dark font-bold text-xs uppercase tracking-wider rounded-full py-3 px-6 cursor-pointer hover:bg-primary/90",
                    },
                });
                return;
            }

            Swal.fire({
                icon: "success",
                title: "¡Mensaje Enviado!",
                text: "Tu mensaje ha sido enviado correctamente. ¡Nos pondremos en contacto contigo pronto!",
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    popup: "rounded-3xl bg-[#0F1420] border border-white/15 text-white font-paragraph shadow-2xl",
                },
            });

            // CRM Atalaya Integration
            const generalsData = generals || [];
            const atalayaApiKey = generalsData.find(
                (item) => item.correlative === "atalaya_leads_api_key"
            )?.description;
            if (atalayaApiKey && atalayaApiKey.trim() !== "") {
                try {
                    await fetch("https://crm.atalaya.pe/free/leads", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${atalayaApiKey}`,
                        },
                        body: JSON.stringify({
                            contact_name: request.name,
                            contact_phone: request.phone,
                            contact_email: request.email,
                            message: request.description,
                            origin: `Página Web ${Global.APP_NAME}`,
                            triggered_by: "Formulario de Contacto Rhino",
                        }),
                    });
                } catch (error) { }
            }

            if (data?.redirect) {
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 3000);
            } else if (result.redirect) {
                setTimeout(() => {
                    window.location.href = result.redirect;
                }, 3000);
            }

            clearForm();
        } catch (error) {
            setSending(false);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.",
                confirmButtonText: "Entendido",
                customClass: {
                    popup: "rounded-3xl bg-[#0F1420] border border-white/15 text-white font-paragraph shadow-2xl",
                    confirmButton:
                        "bg-primary text-neutral-dark font-bold text-xs uppercase tracking-wider rounded-full py-3 px-6 cursor-pointer hover:bg-primary/90",
                },
            });
        }
    };

    const generalsData = generals || [];
    const location =
        generalsData.find((item) => item.correlative === "location")
            ?.description || "-12.08572604235328,-76.99121088594794";
    const mapSrcWithLocationAndEmbedAndOutput = `https://www.google.com/maps?q=${location}&z=16&output=embed&embed=true`;

    return (
        <motion.div
            id={data?.element_id || "contact-rhino"}
            className={`text-white min-h-screen bg-page-background font-paragraph relative ${data?.class_section || "pt-32 md:pt-36 lg:pt-40 pb-16 md:pb-24"}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
        >
            <main className="w-full px-6 2xl:px-0 2xl:max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-stretch">
                    {/* Left Column: Contact Form */}
                    <motion.div
                        className={`rounded-2xl border border-white/10 hover:border-primary/30 p-6 md:p-12 flex flex-col justify-between transition-all duration-300 ${data?.class_form_container || ""}`}
                        variants={itemVariants}
                    >
                        <div className="mb-8 text-left">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
                                <span>›</span> Contáctanos
                            </div>
                            <h2
                                className={`text-4xl md:text-5xl lg:text-6xl font-title text-primary mb-6 ${data?.class_title || ""}`}
                            >
                                <TextWithHighlight
                                    text={
                                        data?.title ||
                                        "Escríbenos y *conecta* con nosotros"
                                    }
                                    className="font-title"
                                    color="text-white"
                                />
                            </h2>
                            {data?.description ? (
                                <p
                                    className={`mt-4 text-lg md:text-xl text-white font-light ${data?.class_description || ""}`}
                                >
                                    {data.description}
                                </p>
                            ) : (
                                <p className="mt-4 text-lg md:text-xl text-white font-light">
                                    Estamos listos para asesorarte en tus proyectos industriales. Déjanos tu mensaje y te responderemos a la brevedad.
                                </p>
                            )}
                        </div>

                        <form
                            onSubmit={onSubmit}
                            className="w-full flex flex-col gap-6"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <input
                                    ref={nameRef}
                                    type="text"
                                    placeholder="Nombre"
                                    required
                                    className="rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 py-3.5 px-5"
                                />
                                <input
                                    ref={lastnameRef}
                                    type="text"
                                    placeholder="Apellido"
                                    required
                                    className="rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 py-3.5 px-5"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                                <input
                                    ref={phoneRef}
                                    type="text"
                                    placeholder="Teléfono"
                                    required
                                    className="rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 py-3.5 px-5"
                                />
                                <input
                                    ref={emailRef}
                                    type="email"
                                    placeholder="Correo electrónico"
                                    required
                                    className="rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 py-3.5 px-5"
                                />
                            </div>

                            <textarea
                                ref={descriptionRef}
                                placeholder="Escribir mensaje..."
                                rows={3}
                                required
                                className="w-full rounded-2xl border border-white/10 bg-white/5 text-white font-paragraph placeholder-white/40 text-sm md:text-base outline-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all duration-300 py-3.5 px-5"
                            />

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={sending}
                                className={`w-full bg-primary hover:bg-primary/90 text-neutral-dark font-bold text-sm md:text-base rounded-full py-4 px-8 flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 uppercase tracking-wider cursor-pointer disabled:opacity-50 ${data?.class_button_form || ""}`}
                            >
                                <AnimatePresence mode="wait">
                                    {sending ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            <span>Enviando mensaje...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Send size={16} />
                                            <span>Enviar Mensaje</span>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Right Column: Info Cards and Google Map */}
                    <motion.div
                        className="flex flex-col gap-6"
                        variants={itemVariants}
                    >
                        {/* Info Cards (Grid) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Email Card */}
                            <div className="group flex items-center gap-4 border border-white/10 hover:border-primary/40 rounded-2xl p-6 transition-all duration-300">
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-300">
                                    <Mail size={22} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-title text-sm font-bold uppercase tracking-wider text-white mb-1">
                                        Correo Electrónico
                                    </h3>
                                    <div className="text-white/70 text-xs md:text-sm break-all  font-light">
                                        {(() => {
                                            const emailData =
                                                generalsData.find(
                                                    (item) =>
                                                        item.correlative ===
                                                        "email_contact"
                                                )?.description || "";
                                            if (emailData.includes(",")) {
                                                const emails = emailData.split(",");
                                                return (
                                                    <div className="flex flex-col gap-0.5">
                                                        {emails.map((email, index) => (
                                                            <a
                                                                key={index}
                                                                href={`mailto:${email.trim()}`}
                                                                className="hover:text-primary transition-colors truncate block"
                                                            >
                                                                {email.trim()}
                                                            </a>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <a
                                                    href={`mailto:${emailData}`}
                                                    className="hover:text-primary transition-colors truncate block"
                                                >
                                                    {emailData ||
                                                        "contacto@rhino.com"}
                                                </a>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Phone Card */}
                            <div className="group flex items-center gap-4 border border-white/10 hover:border-primary/40 rounded-2xl p-6 transition-all duration-300">
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-300">
                                    <Phone size={22} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-title text-sm font-bold uppercase tracking-wider text-white mb-1">
                                        Teléfono Directo
                                    </h3>
                                    <div className="text-white/70 text-xs md:text-sm break-all font-light">
                                        {(() => {
                                            const phoneData =
                                                generalsData.find(
                                                    (item) =>
                                                        item.correlative ===
                                                        "phone_contact"
                                                )?.description || "";
                                            if (phoneData.includes(",")) {
                                                const phones = phoneData.split(",");
                                                return (
                                                    <div className="flex flex-col gap-0.5">
                                                        {phones.map((phone, index) => (
                                                            <a
                                                                key={index}
                                                                href={`tel:${phone.trim()}`}
                                                                className="hover:text-primary transition-colors truncate block"
                                                            >
                                                                {phone.trim()}
                                                            </a>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <a
                                                    href={`tel:${phoneData}`}
                                                    className="hover:text-primary transition-colors truncate block"
                                                >
                                                    {phoneData ||
                                                        "+51 987 654 321"}
                                                </a>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps Container */}
                        <div className="p-2 rounded-2xl border border-white/10 flex-grow min-h-[350px] lg:min-h-[400px] relative overflow-hidden">
                            <div className="w-full h-full rounded-xl overflow-hidden relative">
                                <div className="absolute top-4 left-4 z-10 bg-page-background/90 border border-white/15 px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2">
                                    <MapPin
                                        size={14}
                                        className="text-primary animate-pulse"
                                    />
                                    <span className="text-xs font-mono tracking-wider text-white/90">
                                        {generalsData.find(
                                            (item) =>
                                                item.correlative === "address"
                                        )?.description || "Nuestra Ubicación"}
                                    </span>
                                </div>
                                <iframe
                                    title="Ubicación Rhino Technology"
                                    src={mapSrcWithLocationAndEmbedAndOutput}
                                    className="w-full h-full border-0 absolute inset-0"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </motion.div>
    );
};

export default ContactRhino;
