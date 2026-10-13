import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { ArrowUpRight, FolderGit2, TrendingUp, CheckCircle2, AlertTriangle, Building2 } from 'lucide-react';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const getCaseImage = (c) => {
  if (!c) return null;
  const img = c.image || c.url_image || c.background_image || c.banner;
  if (typeof img === 'string' && img) {
    return img.startsWith('/') || img.startsWith('http') ? img : `/storage/images/case_study/${img}`;
  }
  return null;
};

const CasesSectionRhino = ({ data = {}, items = [], generals = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swiperRef, setSwiperRef] = useState(null);

  const rawItems = Array.isArray(items) ? items : [];

  const casesList = rawItems.map((c, idx) => ({
    id: c.id || idx,
    slug: c.slug || c.id || idx,
    name: c.name || c.title || 'Caso de Éxito',
    client: c.client || c.name || c.title || 'Caso de Éxito',
    before: c.before || c.problem || null,
    after: c.after || c.solution || null,
    impact: c.impact || c.metrics || c.badge || null,
    quote: c.summary || c.description || c.quote || '',
    author: c.author || c.role || null,
    image: getCaseImage(c),
    path: c.path || c.url || `/casos-de-exito/${c.slug || c.id || idx}`,
  }));

  if (casesList.length === 0) return null;

  return (
    <section
      id={data?.element_id || 'casos-de-exito'}
      className={`relative py-12 md:py-20 bg-page-background text-white overflow-hidden ${data?.class || ''}`}
    >
      {/* Ambient background lighting glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-[500px] w-[600px] rounded-full bg-primary/10 blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[500px] rounded-full bg-success/5 blur-[160px]" />
      </div>

      <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10 space-y-12 md:space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs text-primary font-bold uppercase tracking-wider backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>{data?.section_label || 'CASOS DE ÉXITO & RESULTADOS'}</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-title text-white leading-tight">
            {data?.title ? (
              <TextWithHighlight text={data.title} color="bg-primary" className="font-title" />
            ) : (
              <>
                Impacto Real en <span className="text-primary block md:inline font-title">Negocios de Tecnología</span>
              </>
            )}
          </h2>

          <p className="mt-4 max-w-2xl text-base md:text-lg lg:text-xl text-white/80 font-light leading-relaxed">
            {data?.subtitle ||
              'Descubre cómo transformamos desafíos complejos de ingeniería en historias de éxito con métricas cuantitativas comprobables.'}
          </p>
        </div>

        {/* Mobile View: Swiper Slider matching Desktop Luxury Cards (md:hidden) */}
        <div className="block md:hidden mt-8">
          <Swiper
            modules={[Autoplay]}
            onSwiper={(swiper) => setSwiperRef(swiper)}
            onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
            spaceBetween={24}
            slidesPerView={1}
            loop={casesList.length > 1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="w-full"
          >
            {casesList.map((c, i) => (
              <SwiperSlide key={c.id || i}>
                <div className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] hover:border-primary/40 hover:bg-white/[0.04] p-6 transition-all duration-500 shadow-xl">
                  <a href={c.path} className="block space-y-6 flex-1">
                    {/* Image Container with Badges */}
                    <div className="w-full aspect-[16/10] relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/10 shadow-md">
                      {c.image ? (
                        <>
                          <img
                            src={c.image}
                            alt={c.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-page-background via-page-background/20 to-transparent opacity-80" />
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.03] text-white/30 space-y-3 p-6 text-center">
                          <FolderGit2 className="w-14 h-14 text-primary/40" />
                          <span className="text-sm text-white/60 font-semibold">{c.name}</span>
                        </div>
                      )}

                      {/* Top Floating Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                        {c.client && (
                          <span className="text-[11px] font-bold uppercase bg-page-background/90 border border-primary/40 text-primary px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-primary" />
                            <span>{c.client}</span>
                          </span>
                        )}
                      </div>

                      {/* Bottom Right Impact Badge */}
                      {c.impact && (
                        <div className="absolute bottom-3 right-3 pointer-events-none">
                          <span className="text-xs font-bold uppercase bg-success/20 border border-success/40 text-success px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                            <TrendingUp className="w-4 h-4 text-success" />
                            <span>{c.impact}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Title & Content */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold font-title text-white group-hover:text-primary transition-colors leading-tight">
                        {c.name}
                      </h3>

                      {/* Summary / Quote */}
                      {c.quote && (
                        <p className="text-sm text-white/80 font-light line-clamp-3 leading-relaxed border-l-2 border-primary/40 pl-3">
                          "{c.quote}"
                        </p>
                      )}

                      {/* Before vs After Pills Preview */}
                      {(c.before || c.after) && (
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          {c.before && (
                            <div className="flex items-center gap-2 text-xs text-danger font-medium bg-danger/10 border border-danger/20 rounded-lg px-3 py-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-danger flex-shrink-0" />
                              <span className="truncate"><strong>Antes:</strong> {c.before}</span>
                            </div>
                          )}
                          {c.after && (
                            <div className="flex items-center gap-2 text-xs text-success font-medium bg-success/10 border border-success/20 rounded-lg px-3 py-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                              <span className="truncate"><strong>Después:</strong> {c.after}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {c.author && (
                        <div className="text-xs font-mono text-primary/80 font-semibold pt-1">
                          — {c.author}
                        </div>
                      )}
                    </div>
                  </a>

                  {/* Action Link Button */}
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <a
                      href={c.path}
                      className="inline-flex items-center justify-between w-full text-sm text-primary font-medium transition-all duration-300 group-hover:text-white"
                    >
                      <span>Ver caso de éxito completo</span>
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-dark transition-all duration-300">
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom HeroRhino-style Pagination Dots for Mobile */}
          {casesList.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {casesList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (swiperRef) {
                      if (swiperRef.slideToLoop) {
                        swiperRef.slideToLoop(idx);
                      } else {
                        swiperRef.slideTo(idx);
                      }
                    }
                  }}
                  aria-label={`Ir al caso de éxito ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === idx
                    ? 'w-8 bg-primary shadow-md'
                    : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop View: 3-Column Luxury Card Showcase Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {casesList.map((c, i) => (
            <div
              key={c.id || i}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] hover:border-primary/40 hover:bg-white/[0.04] p-6 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/10"
            >
              <a href={c.path} className="block space-y-6 flex-1">
                {/* Image Container with Badges */}
                <div className="w-full aspect-[16/10] relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/10 shadow-md">
                  {c.image ? (
                    <>
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-page-background via-page-background/20 to-transparent opacity-80" />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.03] text-white/30 space-y-3 p-6 text-center">
                      <FolderGit2 className="w-14 h-14 text-primary/40" />
                      <span className="text-sm text-white/60 font-semibold">{c.name}</span>
                    </div>
                  )}

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                    {c.client && (
                      <span className="text-[11px] font-bold uppercase bg-page-background/90 border border-primary/40 text-primary px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-primary" />
                        <span>{c.client}</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom Right Impact Badge */}
                  {c.impact && (
                    <div className="absolute bottom-3 right-3 pointer-events-none">
                      <span className="text-xs font-bold uppercase bg-success/20 border border-success/40 text-success px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span>{c.impact}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Title & Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl lg:text-3xl font-bold font-title text-white group-hover:text-primary transition-colors leading-tight">
                    {c.name}
                  </h3>

                  {/* Summary / Quote */}
                  {c.quote && (
                    <p className="text-sm md:text-base text-white/80 font-light line-clamp-3 leading-relaxed border-l-2 border-primary/40 pl-3">
                      "{c.quote}"
                    </p>
                  )}

                  {/* Before vs After Pills Preview */}
                  {(c.before || c.after) && (
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      {c.before && (
                        <div className="flex items-center gap-2 text-xs text-danger font-medium bg-danger/10 border border-danger/20 rounded-lg px-3 py-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-danger flex-shrink-0" />
                          <span className="truncate"><strong>Antes:</strong> {c.before}</span>
                        </div>
                      )}
                      {c.after && (
                        <div className="flex items-center gap-2 text-xs text-success font-medium bg-success/10 border border-success/20 rounded-lg px-3 py-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                          <span className="truncate"><strong>Después:</strong> {c.after}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {c.author && (
                    <div className="text-xs font-mono text-primary/80 font-semibold pt-1">
                      — {c.author}
                    </div>
                  )}
                </div>
              </a>

              {/* Action Link Button */}
              <div className="pt-4 border-t border-white/10 mt-4">
                <a
                  href={c.path}
                  className="inline-flex items-center justify-between w-full text-base text-primary font-medium transition-all duration-300 group-hover:text-white"
                >
                  <span>Ver caso de éxito completo</span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-dark transition-all duration-300">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CasesSectionRhino;

