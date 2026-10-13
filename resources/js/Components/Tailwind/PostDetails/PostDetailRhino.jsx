import React, { useState, useRef, useEffect } from "react";
import {
    Facebook,
    Link,
    TwitterIcon,
    Share2,
    ArrowLeft,
    Clock,
    Tag,
    Check,
    MessageCircle,
    Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

// Format date in Spanish
function formatDate(dateString) {
    if (!dateString) return "";
    try {
        const date = new Date(
            dateString.includes("T") ? dateString : `${dateString}T00:00:00`
        );
        return isNaN(date.getTime())
            ? dateString
            : date.toLocaleDateString("es-PE", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
    } catch (e) {
        return dateString;
    }
}

// Read-time estimator (~200 words per minute)
function readTime(html) {
    if (!html) return 1;
    const text = html.replace(/<[^>]*>/g, "");
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

const getPostImage = (imgName) => {
    if (!imgName) return null;
    if (typeof imgName === "string" && imgName.trim()) {
        if (
            imgName.startsWith("data:") ||
            imgName.startsWith("/") ||
            imgName.startsWith("http")
        )
            return imgName;
        return `/storage/images/post/${imgName}`;
    }
    return null;
};

export default function PostDetailRhino({ item, data, generals = [] }) {
    const [copied, setCopied] = useState(false);
    const [isWhatsappOpen, setIsWhatsappOpen] = useState(false);
    const whatsappRef = useRef(null);

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                whatsappRef.current &&
                !whatsappRef.current.contains(event.target)
            ) {
                setIsWhatsappOpen(false);
            }
        };
        if (isWhatsappOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isWhatsappOpen]);

    const handleShare = (platform) => {
        const text = encodeURIComponent(
            (item?.name || item?.title || "") + " " + shareUrl
        );
        let url = "";
        switch (platform) {
            case "facebook":
                url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                break;
            case "twitter":
                url = `https://twitter.com/intent/tweet?text=${text}`;
                break;
            case "whatsapp":
                url = `https://wa.me/?text=${text}`;
                break;
            case "link":
                navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                return;
            default:
                return;
        }
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const mins = readTime(item?.description);
    const postImage = getPostImage(item?.image);

    // Advisors extraction identical to ServiceDetailRhino
    const advisorsGeneral = generals?.find?.(
        (g) => g.correlative === "whatsapp_advisors"
    )?.value;
    let advisors = [];
    if (Array.isArray(advisorsGeneral)) advisors = advisorsGeneral;
    else if (typeof advisorsGeneral === "string") {
        try {
            advisors = JSON.parse(advisorsGeneral);
        } catch (e) {
            advisors = [];
        }
    }
    if (!advisors.length) {
        const singlePhone =
            generals?.find?.(
                (g) =>
                    g.correlative === "phone_whatsapp" ||
                    g.correlative === "whatsapp"
            )?.value || "51999999999";
        advisors = [
            {
                name: "Asesor Comercial",
                phone: singlePhone,
                position: "Atención al Cliente",
            },
        ];
    }

    const handleCotizarClick = (e) => {
        if (advisors.length > 1) {
            e.preventDefault();
            setIsWhatsappOpen(!isWhatsappOpen);
        } else if (advisors.length === 1) {
            const adv = advisors[0];
            const phone = String(adv.phone || adv.number || "").replace(
                /[^0-9]/g,
                ""
            );
            const msg =
                adv.message ||
                `¡Hola! Quisiera consultar sobre el artículo: ${item?.name || item?.title}`;
            window.open(
                `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`,
                "_blank"
            );
        }
    };

    return (
        <article
            id={data?.element_id || undefined}
            className="min-h-screen bg-page-background text-white font-paragraph "
            itemScope
            itemType="https://schema.org/BlogPosting"
        >
            {/* ─── 1. HERO SECTION (Estilo ServiceDetailRhino) ─── */}
            <section className="relative overflow-hidden pt-28 md:pt-36 pb-12 md:pb-24 bg-dark min-h-[50dvh] md:min-h-[55dvh] flex items-center">
                {/* Background image & gradient overlay */}
                {postImage && (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <img
                            src={postImage}
                            alt={item?.name || "Post imagen"}
                            className="w-full h-full object-cover opacity-30 blur-sm scale-105"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/img/noimage/no_img.jpg";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-page-background via-page-background/70 to-dark/80 pointer-events-none" />
                    </div>
                )}

                <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10 w-full">
                    <div className="max-w-4xl">
                        {/* Volver al Blog */}
                        <motion.div
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mb-6"
                        >
                            <a
                                href="/blog"
                                className="inline-flex items-center gap-2 bg-white/5 hover:bg-primary hover:text-neutral-dark text-white border border-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase  transition-all duration-300 backdrop-blur-md cursor-pointer"
                            >
                                <ArrowLeft size={14} strokeWidth={2.5} />
                                Volver al blog
                            </a>
                        </motion.div>



                        {/* Título Principal */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className={`text-3xl md:text-5xl lg:text-7xl font-title text-primary font-bold mb-6  ${data?.class_title || ""}`}
                            itemProp="headline"
                        >
                            <TextWithHighlight
                                text={item?.name || item?.title || ""}
                                className="font-title"
                                color="text-white"
                            />
                        </motion.h1>

                        {/* Metadata row: Fecha, Lectura, Tags */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="flex flex-wrap items-center gap-4 text-xs  text-white"
                        >
                            {(item?.post_date || item?.created_at) && (
                                <time
                                    dateTime={item.post_date || item.created_at}
                                    itemProp="datePublished"
                                    className="bg-white/5 inline-flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-full"
                                >
                                    <Calendar size={13} />
                                    {formatDate(
                                        item.post_date || item.created_at
                                    )}
                                </time>
                            )}
                            <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-primary">
                                <Clock size={13} />
                                {mins} min de lectura
                            </span>
                        </motion.div>



                    </div>
                </div>
            </section>

            {/* ─── 2. CONTENIDO PRINCIPAL (Estilo Rhino Dark Glassmorphism) ─── */}
            <div className="2xl:max-w-5xl mx-auto px-primary 2xl:px-0 pb-10 md:pb-12">
                {/* Imagen Principal del Post */}
                {postImage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/[0.02] mb-10 md:mb-12 aspect-square lg:aspect-[16/9]"
                    >
                        <img
                            src={postImage}
                            alt={item?.name || "Post imagen"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/img/noimage/no_img.jpg";
                            }}
                            itemProp="image"
                        />
                    </motion.div>
                )}

                {/* Cuerpo del Artículo en HTML (Typography Rhino) */}
                {item?.description && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="prose prose-invert max-w-none
                            prose-p:text-white prose-p:font-paragraph prose-p:text-base md:prose-p:text-lg prose-p: prose-p:mb-6
                            prose-h2:font-title prose-h2:text-primary prose-h2:text-2xl md:prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:font-bold
                            prose-h3:font-title prose-h3:text-white prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                            prose-a:text-primary hover:prose-a:underline prose-a:font-semibold
                            prose-strong:text-white prose-strong:font-semibold
                            prose-blockquote:border-l-primary prose-blockquote:bg-white/5 prose-blockquote:p-6 prose-blockquote:rounded-2xl prose-blockquote:text-white/90 prose-blockquote:font-title prose-blockquote:not-italic prose-blockquote:my-8
                            prose-img:rounded-3xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl prose-img:my-8
                            prose-hr:border-white/10 prose-hr:my-10
                            prose-ul:text-white/80 prose-ol:text-white/80 prose-li:mb-2
                            [&_img]:w-full"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                        itemProp="articleBody"
                    />
                )}

                {/* ─── 3. BARRA DE COMPARTIR Y CONTACTO INFERIOR ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 pt-10 border-t border-white/10"
                >
                    <div className="px-8 flex flex-col sm:flex-row sm:items-center justify-center md:justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                                <Share2 size={18} />
                            </div>
                            <div>
                                <h4 className="font-title text-xl text-white">
                                    ¿Te gustó esta publicación?
                                </h4>
                                <p className="text-xs text-white">
                                    Compártela con tus colegas o en tus redes.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                            {/* Facebook */}
                            <button
                                aria-label="Compartir en Facebook"
                                onClick={() => handleShare("facebook")}
                                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-primary hover:text-neutral-dark hover:border-primary transition-all duration-300 cursor-pointer"
                            >
                                <Facebook size={18} />
                            </button>

                            {/* Twitter / X */}
                            <button
                                aria-label="Compartir en Twitter"
                                onClick={() => handleShare("twitter")}
                                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-primary hover:text-neutral-dark hover:border-primary transition-all duration-300 cursor-pointer"
                            >
                                <TwitterIcon size={18} />
                            </button>

                            {/* WhatsApp */}
                            <button
                                aria-label="Compartir en WhatsApp"
                                onClick={() => handleShare("whatsapp")}
                                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-primary hover:text-neutral-dark hover:border-primary transition-all duration-300 cursor-pointer"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
                                </svg>
                            </button>

                            {/* Copy Link */}
                            <button
                                aria-label="Copiar enlace"
                                onClick={() => handleShare("link")}
                                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-primary hover:text-neutral-dark hover:border-primary transition-all duration-300 cursor-pointer"
                            >
                                <Link size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Copied Notification */}
                    <AnimatePresence>
                        {copied && (
                            <motion.p
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-3 text-xs  text-primary flex items-center gap-1.5"
                            >
                                <Check size={14} /> Enlace copiado al portapapeles
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </article>
    );
}
