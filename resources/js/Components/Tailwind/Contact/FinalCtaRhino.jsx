import React from 'react';
import { ArrowRight, Sparkles, Send } from 'lucide-react';

const FinalCtaRhino = ({ data = {}, generals = [] }) => {
  return (
    <section className="relative py-28 bg-page-background text-white overflow-hidden border-t border-white/10">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-electric-500/15 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-electric-500/30 bg-electric-500/10 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-electric-400" />
          <span className="font-mono text-xs text-electric-400 font-semibold tracking-wider uppercase">
            RHINO TECHNOLOGY PLATFORM
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
          {data?.title || '¿Listo para Construir el Futuro de tu Software?'}
        </h2>

        <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          {data?.subtitle || 'Hablemos de tu proyecto. Evaluamos tus requerimientos y te entregamos un plan técnico de arquitectura y presupuesto sin compromiso.'}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/contacto"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-electric-500 to-electric-600 hover:from-electric-400 hover:to-electric-500 shadow-[0_0_40px_rgba(47,127,255,0.6)] transition-all duration-300"
          >
            {data?.cta_button_text || 'Iniciar Proyecto Ahora'}
            <Send className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaRhino;
