import React from 'react';
import { Zap, Cpu, Bot, Headphones, Sparkles } from 'lucide-react';

const DifferentialSectionRhino = ({ data = {}, items = [], generals = [] }) => {
  const pillars = [
    {
      title: 'Velocidad de Ejecución Extrema',
      desc: 'Optimización de código y entrega continua para lanzar plataformas al mercado en tiempos récord.',
      icon: Zap,
    },
    {
      title: 'Arquitectura Escalable Cloud',
      desc: 'Sistemas diseñados con microservicios y serverless para soportar millones de solicitudes sin caídas.',
      icon: Cpu,
    },
    {
      title: 'Integración Inteligencia Artificial',
      desc: 'Modelos predictivos y LLMs integrados directamente en tu flujo de trabajo operativo.',
      icon: Bot,
    },
    {
      title: 'Soporte y Monitoreo 24/7',
      desc: 'Supervisión constante en tiempo real para garantizar cero interrupciones de servicio.',
      icon: Headphones,
    },
  ];

  return (
    <section className="relative py-24 bg-page-background text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-mono text-xs text-electric-400 uppercase tracking-widest">// DIFERENCIALES RHINO</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            ¿Por qué elegir Rhino Technology?
          </h2>
          <p className="text-white/60 text-base">
            Combinamos ingeniería rigurosa y diseño futurista para superar las expectativas en cada entrega.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const IconComponent = p.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-electric-500/50 hover:bg-electric-500/10 transition-all duration-300 space-y-4"
              >
                <div className="h-12 w-12 rounded-xl bg-electric-500/10 border border-electric-500/20 flex items-center justify-center text-electric-400">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{p.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DifferentialSectionRhino;
