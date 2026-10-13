import React from "react";
import HtmlContent from "../../../Utils/HtmlContent";
import { ShieldCheck } from "lucide-react";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import useHeaderConfig from "../../../Utils/useHeaderConfig";

const LegalRhino = ({ data, generals = [] }) => {
    useHeaderConfig(data);

    const correlative = data?.correlative || "terms_conditions";
    const content =
        generals?.find((x) => x.correlative === correlative)?.description ?? "";
    const title = data?.title || "Información Legal";

    return (
        <div
            id={data?.element_id || "legal-rhino"}
            className="bg-page-background text-white font-paragraph pt-32 md:pt-36 lg:pt-40 pb-16 md:pb-24 min-h-screen"
        >
            <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0">
                {/* Header de Sección Estilo Rhino */}
                <div className="max-w-3xl mx-auto text-center mb-6 md:mb-16">


                    <h1 className="text-5xl md:text-6xl lg:text-8xl font-title text-primary mb-6">
                        <TextWithHighlight
                            text={title}
                            className="font-title"
                            color="text-white"
                        />
                    </h1>
                </div>

                {/* Card de Contenido HTML Legal Estilo Rhino */}
                <div className="rounded-2xl  transition-all duration-300 max-w-4xl mx-auto">
                    {content ? (
                        <div className="prose prose-invert max-w-none
                            prose-p:text-white/80 prose-p:font-paragraph prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
                            prose-h2:font-title prose-h2:text-primary prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:font-bold
                            prose-h3:font-title prose-h3:text-white prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                            prose-a:text-primary hover:prose-a:underline prose-a:font-semibold
                            prose-strong:text-white prose-strong:font-semibold
                            prose-blockquote:border-l-primary prose-blockquote:bg-white/5 prose-blockquote:p-6 prose-blockquote:rounded-2xl prose-blockquote:text-white/90 prose-blockquote:font-title prose-blockquote:not-italic prose-blockquote:my-8
                            prose-hr:border-white/10 prose-hr:my-8
                            prose-ul:text-white/80 prose-ol:text-white/80 prose-li:mb-2"
                        >
                            <HtmlContent html={content} />
                        </div>
                    ) : (
                        <div className="text-center py-12 text-white/50 font-light text-base">
                            No hay información legal configurada para este apartado.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LegalRhino;
