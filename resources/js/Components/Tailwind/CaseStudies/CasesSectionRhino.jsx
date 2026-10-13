import React, { useState, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { ArrowUpRight } from 'lucide-react';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const getCaseImage = (c) => {
  if (!c) return '/assets/img/noimage/no_img.jpg';
  const img = c.image || c.url_image || c.background_image || c.banner;
  if (typeof img === 'string' && img) {
    return img.startsWith('/') || img.startsWith('http') ? img : `/storage/images/case_study/${img}`;
  }
  return '/assets/img/noimage/no_img.jpg';
};

const CasesSectionRhino = ({ data = {}, items = [], generals = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swiperRef, setSwiperRef] = useState(null);

  const rawItems = Array.isArray(items) ? items : [];

  const normalizedCases = useMemo(() => {
    return rawItems.map((c, idx) => {
      const slug = c.slug || c.id || `caso-${idx}`;
      let parsedIndicators = [];
      if (typeof c.indicators === 'string') {
        try { parsedIndicators = JSON.parse(c.indicators); } catch (e) { }
      } else if (Array.isArray(c.indicators)) {
        parsedIndicators = c.indicators;
      }

      return {
        id: c.id || slug,
        slug,
        name: typeof c.name === 'string' ? c.name : (c.title || 'Caso de Éxito'),
        client: typeof c.client === 'string' ? c.client : null,
        before: c.before || c.problem || null,
        after: c.after || c.solution || null,
        impact: c.impact || c.metrics || c.badge || null,
        summary: c.summary || c.description || c.quote || '',
        author: c.author || c.role || null,
        indicators: parsedIndicators,
        image: getCaseImage(c),
        path: c.path || c.url || `/caso-de-exito/${slug}`,
      };
    });
  }, [rawItems]);

  if (normalizedCases.length === 0) return null;

  return (
    <section
      id={data?.element_id || 'casos-de-exito'}
      className={`relative py-10 md:py-16 bg-page-background text-white overflow-hidden ${data?.class || data?.class_container || ''}`}
    >
      <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-title text-white">
              {data?.title ? (
                <TextWithHighlight text={data.title} color="bg-primary" className="font-title" />
              ) : (
                <>
                  Casos de Éxito{' '}
                  <span className="text-primary block md:inline font-title">e Impacto Digital</span>
                </>
              )}
            </h2>

            <p className="mt-6 max-w-xl text-base md:text-lg lg:text-xl text-white font-light">
              {data?.subtitle ||
                'Explora nuestros casos de éxito y soluciones de software creadas para lograr métricas de alto impacto.'}
            </p>
          </div>
        </div>

        {/* Mobile View: Swiper Slider matching Desktop UI (md:hidden) */}
        <div className="block md:hidden mt-8">
          <Swiper
            modules={[Autoplay]}
            onSwiper={(swiper) => setSwiperRef(swiper)}
            onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
            spaceBetween={24}
            slidesPerView={1}
            loop={normalizedCases.length > 1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="w-full"
          >
            {normalizedCases.map((c, i) => (
              <SwiperSlide key={c.id || i}>
                <div className="group relative">
                  <a href={c.path} className="block space-y-5">
                    {/* Visual / Image Slot (Aspect Square matching Desktop) */}
                    <div className="w-full aspect-square relative overflow-hidden rounded-2xl shadow-2xl">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/img/noimage/no_img.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-page-background/80 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Content Section (Matching Desktop Hierarchy) */}
                    <div className="space-y-4 pt-1">
                      {/* Number + Client + Impact Badges */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-sm font-semibold text-primary/70">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {c.client && (
                          <span className="inline-block text-xs font-mono text-primary font-bold uppercase border border-primary/30 bg-primary/10 px-3 py-1 rounded-full">
                            {c.client}
                          </span>
                        )}
                        {c.impact && (
                          <span className="inline-block text-xs font-mono text-success font-bold uppercase border border-success/30 bg-success/10 px-3 py-1 rounded-full">
                            {c.impact}
                          </span>
                        )}
                      </div>

                      {/* Case Name Heading */}
                      <h3 className="text-2xl font-title text-white group-hover:text-primary transition-colors">
                        {c.name}
                      </h3>

                      {/* Summary Description */}
                      {c.summary && (
                        <p className="text-sm text-white font-light">
                          {c.summary}
                        </p>
                      )}

                      {/* Clean Bullets */}
                      {(c.before || c.after || (c.indicators && c.indicators.length > 0)) && (
                        <ul className="grid grid-cols-1 gap-x-2 gap-y-3 pt-1 text-sm text-white">
                          {c.before && (
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 opacity-80" />
                              <span className="font-light"><strong className="text-white/90">Antes:</strong> {c.before}</span>
                            </li>
                          )}
                          {c.after && (
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 opacity-80" />
                              <span className="font-light"><strong className="text-white/90">Después:</strong> {c.after}</span>
                            </li>
                          )}
                          {(!c.before && !c.after && c.indicators) &&
                            c.indicators.map((ind, indIdx) => (
                              <li key={indIdx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 opacity-80" />
                                <span className="font-light"><strong>{ind.name}:</strong> {ind.description}</span>
                              </li>
                            ))}
                        </ul>
                      )}

                      {/* Action Link */}
                      <div className="pt-2 inline-flex items-center gap-2 text-sm lg:text-base text-primary font-medium transition-all duration-300 group-hover:gap-3">
                        <span>Ver caso de éxito completo</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom HeroRhino-style Pagination Dots for Mobile */}
          {normalizedCases.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {normalizedCases.map((_, idx) => (
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

        {/* Desktop View: Ultra-Clean Tech Editorial Grid */}
        <div className="hidden md:block space-y-16 lg:space-y-24 mt-12 lg:mt-16">
          {normalizedCases.map((c, i) => {
            const isEven = i % 2 === 0;

            return (
              <div key={c.id || i} className="group relative">
                <a
                  href={c.path}
                  className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
                >
                  {/* Left/Right Text Column */}
                  <div className={`lg:col-span-6 space-y-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    {/* Index Number + Badges */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-primary/70">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {c.client && (
                        <span className="inline-block text-xs font-mono text-primary font-bold uppercase border border-primary/30 bg-primary/10 px-3 py-1 rounded-full">
                          {c.client}
                        </span>
                      )}
                      {c.impact && (
                        <span className="inline-block text-xs font-mono text-success font-bold uppercase border border-success/30 bg-success/10 px-3 py-1 rounded-full">
                          {c.impact}
                        </span>
                      )}
                    </div>

                    {/* Case Title Heading */}
                    <h3 className="text-3xl lg:text-5xl font-title text-white transition-colors duration-300 group-hover:text-primary">
                      {c.name}
                    </h3>

                    {/* Summary Description */}
                    {c.summary && (
                      <p className="text-base lg:text-lg text-white font-light max-w-xl">
                        {c.summary}
                      </p>
                    )}

                    {/* Clean Bullets */}
                    {(c.before || c.after || (c.indicators && c.indicators.length > 0)) && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pt-2">
                        {c.before && (
                          <li className="flex items-start gap-2 text-sm lg:text-base text-white">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 opacity-80" />
                            <span className="font-light">
                              <strong className="text-white/90">Antes:</strong> {c.before}
                            </span>
                          </li>
                        )}
                        {c.after && (
                          <li className="flex items-start gap-2 text-sm lg:text-base text-white">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 opacity-80" />
                            <span className="font-light">
                              <strong className="text-white/90">Después:</strong> {c.after}
                            </span>
                          </li>
                        )}
                        {(!c.before && !c.after && c.indicators) &&
                          c.indicators.map((ind, indIdx) => (
                            <li key={indIdx} className="flex items-start gap-2 text-sm lg:text-base text-white">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 opacity-80" />
                              <span className="font-light">
                                <strong>{ind.name}:</strong> {ind.description}
                              </span>
                            </li>
                          ))}
                      </ul>
                    )}

                    {/* Action Link */}
                    <div className="pt-3 inline-flex items-center gap-2 text-lg text-primary font-medium transition-all duration-300 group-hover:gap-3">
                      <span>Ver caso de éxito completo</span>
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Right/Left Image Column */}
                  <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="w-full aspect-square relative overflow-hidden rounded-2xl shadow-2xl group-hover:scale-[1.01] transition-all duration-500">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/img/noimage/no_img.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-page-background/80 via-transparent to-transparent opacity-60" />
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CasesSectionRhino;

