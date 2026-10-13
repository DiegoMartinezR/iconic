import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const serviceVisualsMap = {
  'desarrollo-web': 'browser',
  'web-catalogo': 'grid',
  'landing-pages': 'conversion',
  ecommerce: 'cart',
  'sistemas-web': 'dashboard',
  crm: 'network',
  automatizacion: 'workflow',
  ia: 'neural',
  seo: 'neural',
};

const visualTypesList = ['browser', 'grid', 'conversion', 'cart', 'dashboard', 'network', 'workflow', 'neural'];

const getServiceImage = (service) => {
  if (!service) return null;
  const img = service.image || service.banner || service.url_image || service.cover || service.img;
  if (!img) return null;
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) return img;
  return `/storage/images/service/${img}`;
};

const getServiceSummary = (service) => {
  if (!service) return '';
  return service.summary || service.description || service.excerpt || service.extract || '';
};

const getServiceFeatures = (service) => {
  if (!service) return [];
  const feats = service.features || service.featured || service.characteristics || service.items;
  if (!feats) return [];
  if (Array.isArray(feats)) return feats;
  if (typeof feats === 'string') {
    return feats.split(',').map((f) => f.trim()).filter(Boolean);
  }
  return [];
};


function ServiceVisual({ type }) {
  const common = 'relative h-full w-full overflow-hidden rounded-xl border border-primary/20 bg-white/[0.02] backdrop-blur-sm';

  switch (type) {
    case 'browser':
      return (
        <div className={common}>
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2 bg-white/5">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="ml-2 h-3 flex-1 rounded-sm bg-white/10" />
          </div>
          <div className="space-y-2.5 p-4">
            <div className="h-2 w-2/3 rounded-sm bg-primary/40" />
            <div className="h-2 w-full rounded-sm bg-white/10" />
            <div className="h-2 w-full rounded-sm bg-white/10" />
            <div className="h-2 w-1/2 rounded-sm bg-white/10" />
            <div className="mt-4 flex gap-2">
              <div className="h-6 w-20 rounded-md bg-primary/30 border border-primary/40" />
              <div className="h-6 w-16 rounded-md border border-white/15" />
            </div>
          </div>
        </div>
      );
    case 'grid':
      return (
        <div className={common}>
          <div className="grid grid-cols-3 gap-2.5 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="aspect-square rounded-md bg-gradient-to-br from-primary/20 to-white/5 border border-white/10" />
                <div className="h-1.5 w-full rounded-sm bg-white/10" />
                <div className="h-1.5 w-2/3 rounded-sm bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      );
    case 'conversion':
      return (
        <div className={common}>
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
            <div className="h-2 w-3/4 rounded-sm bg-primary/40" />
            <div className="h-2 w-full rounded-sm bg-white/10" />
            <div className="h-2 w-1/2 rounded-sm bg-white/10" />
            <div className="mt-2 h-9 w-36 rounded-xl bg-primary text-white flex items-center justify-center text-xs font-bold shadow-lg">
              Convertir Ahora
            </div>
            <div className="mt-1 flex gap-1.5">
              <div className="h-1.5 w-12 rounded-full bg-primary/50" />
              <div className="h-1.5 w-12 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      );
    case 'cart':
      return (
        <div className={common}>
          <div className="space-y-2.5 p-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary/30 to-white/5" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2 w-2/3 rounded-sm bg-white/15" />
                  <div className="h-1.5 w-1/3 rounded-sm bg-primary/50" />
                </div>
                <div className="h-6 w-16 rounded-md bg-primary/20 border border-primary/30" />
              </div>
            ))}
            <div className="flex justify-between items-center pt-2">
              <div className="h-2 w-16 rounded-sm bg-white/15" />
              <div className="h-7 w-24 rounded-lg bg-primary flex items-center justify-center text-[10px] font-bold uppercase  text-white">
                Comprar
              </div>
            </div>
          </div>
        </div>
      );
    case 'dashboard':
      return (
        <div className={common}>
          <div className="flex h-full gap-2.5 p-3.5">
            <div className="w-1/5 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`h-2 rounded-sm ${i === 0 ? 'bg-primary' : 'bg-white/10'}`} />
              ))}
            </div>
            <div className="flex-1 space-y-2.5">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] p-2">
                    <div className="h-1.5 w-2/3 rounded-sm bg-white/15" />
                    <div className="mt-2 h-3 w-1/2 rounded-sm bg-primary/50" />
                  </div>
                ))}
              </div>
              <div className="flex h-20 items-end gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/30 to-primary" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    case 'network':
      return (
        <div className={common}>
          <div className="relative h-full p-4">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 150" fill="none">
              <line x1="40" y1="40" x2="100" y2="75" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="100" y1="75" x2="160" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="100" y1="75" x2="40" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="100" y1="75" x2="160" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="40" y1="40" x2="40" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="160" y1="40" x2="160" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </svg>
            {[
              { x: '20%', y: '27%' },
              { x: '80%', y: '27%' },
              { x: '50%', y: '50%' },
              { x: '20%', y: '73%' },
              { x: '80%', y: '73%' },
            ].map((pos, i) => (
              <div
                key={i}
                className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50 bg-primary/20"
                style={{ left: pos.x, top: pos.y }}
              />
            ))}
          </div>
        </div>
      );
    case 'workflow':
      return (
        <div className={common}>
          <div className="relative h-full p-4">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 150" fill="none">
              <rect x="20" y="20" width="50" height="24" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <rect x="130" y="20" width="50" height="24" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <rect x="75" y="63" width="50" height="24" rx="4" fill="rgba(59,130,246,0.3)" stroke="rgba(59,130,246,0.6)" strokeWidth="1" />
              <rect x="20" y="106" width="50" height="24" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <rect x="130" y="106" width="50" height="24" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <path d="M45 44 L45 63 L75 75" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
              <path d="M155 44 L155 63 L125 75" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
              <path d="M95 87 L45 106" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
              <path d="M105 87 L155 106" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>
      );
    case 'neural':
      return (
        <div className={common}>
          <div className="relative h-full p-4">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 150" fill="none">
              {[40, 75, 110, 145].map((x) =>
                [30, 75, 120].map((y) => (
                  <g key={`${x}-${y}`}>
                    <circle cx={x} cy={y} r="3" fill="rgba(59,130,246,0.5)" />
                  </g>
                ))
              )}
              {[40, 75, 110, 145].slice(0, -1).map((x, i) => {
                const x2 = [75, 110, 145][i];
                return [30, 75, 120].map((y) =>
                  [30, 75, 120].map((y2) => (
                    <line key={`${x}-${y}-${x2}-${y2}`} x1={x} y1={y} x2={x2} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                  ))
                );
              })}
            </svg>
            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-white/10">
                <div className="h-full w-3/4 rounded-full bg-primary" />
              </div>
              <span className="font-mono text-[9px] text-primary font-bold">AI</span>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

const ServicesSectionRhino = ({ data = {}, items = [], generals = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swiperRef, setSwiperRef] = useState(null);

  const rawServices = Array.isArray(items) ? items : [];

  const serviceList = rawServices.map((srv, idx) => {
    const slug = srv.slug || srv.id || `service-${idx}`;
    const visualType = serviceVisualsMap[slug] || visualTypesList[idx % visualTypesList.length];
    return {
      id: srv.id || slug,
      slug,
      name: typeof srv.name === 'string' ? srv.name : (srv.title || 'Servicio'),
      badge: srv.badge || srv.subtitle || null,
      summary: getServiceSummary(srv),
      features: getServiceFeatures(srv),
      image: getServiceImage(srv),
      path: srv.pseudo_path || srv.path || srv.url || `/servicios/${slug}`,
      visualType,
    };
  });

  if (serviceList.length === 0) return null;

  return (
    <section
      id={data?.element_id || 'servicios'}
      className={`relative py-10 md:py-12 bg-page-background text-white overflow-hidden ${data?.class || ''}`}
    >


      <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10">
        {/* Section Header */}
        <div className=" max-w-3xl">


          <h2 className="text-4xl md:text-5xl lg:text-7xl  font-title   text-white">
            {data?.title ? (
              <TextWithHighlight text={data.title} color="bg-primary" className='font-title' />
            ) : (
              <>
                Todo lo que tu negocio{' '}
                <span className="text-primary block md:inline font-title">necesita para avanzar</span>
              </>
            )}
          </h2>

          <p className="mt-4 lg:mt-6 max-w-xl text-base md:text-lg lg:text-xl text-white  font-light">
            {data?.subtitle ||
              'Diseñamos y desarrollamos experiencias digitales, plataformas y herramientas que convierten ideas en soluciones reales.'}
          </p>
        </div>

        {/* Mobile View: Swiper Slider with Custom Hero-Style Pagination (md:hidden) */}
        <div className="block md:hidden mt-8">
          <Swiper
            modules={[Autoplay]}
            onSwiper={(swiper) => setSwiperRef(swiper)}
            onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
            spaceBetween={24}
            slidesPerView={1}
            loop={serviceList.length > 1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="w-full"
          >
            {serviceList.map((service, i) => (
              <SwiperSlide key={service.id || i}>
                <div className="group relative space-y-5 pb-2">
                  <a href={'/servicio/' + service.slug} className="block space-y-5">
                    {/* Visual / Image Slot */}
                    <div className="w-full aspect-[16/10] relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.01] shadow-lg">
                      {service.image ? (
                        <>
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-700"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-page-background/80 via-transparent to-transparent opacity-60" />
                        </>
                      ) : (
                        <ServiceVisual type={service.visualType} />
                      )}
                    </div>

                    {/* Index + Badge + Name */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-primary/70">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {service.badge && (
                          <span className="text-[10px] font-mono text-primary font-bold uppercase bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                            {service.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl  font-title text-white group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                    </div>

                    {/* Summary */}
                    {service.summary && (
                      <p className="text-sm text-white font-light">
                        {service.summary}
                      </p>
                    )}

                    {/* Features List */}
                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-2.5 pt-1">
                        {service.features.map((feat, fIdx) => (
                          <li
                            key={fIdx}
                            className="flex items-start gap-2.5 text-xs text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5 opacity-80" />
                            <span className="font-light">
                              {typeof feat === 'string' ? feat : (feat.name || feat.title || feat.feature)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Link Button */}
                    <div className="pt-2 inline-flex items-center gap-2 text-xs font-bold text-primary uppercase transition-all group-hover:gap-3">
                      <span>Ver servicio</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom HeroRhino-style Pagination Dots for Mobile */}
          {serviceList.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {serviceList.map((_, idx) => (
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
                  aria-label={`Ir al servicio ${idx + 1}`}
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
        <div className="hidden md:block space-y-px mt-10">
          {serviceList.map((service, i) => {
            const isEven = i % 2 === 0;

            return (
              <div
                key={service.id || i}
                className="group relative"
              >
                <a
                  href={'/servicio/' + service.slug}
                  className="relative grid grid-cols-12 gap-8 lg:gap-14 items-center"
                >
                  {/* Left Side (50% Width): Number + Badge + Content */}
                  <div className={`col-span-6 space-y-5 ${isEven ? 'order-2' : 'order-1'}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-primary/70 ">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {service.badge && (
                        <span className="inline-block text-xs font-mono text-primary font-bold uppercase  border border-primary/30 bg-primary/10 px-3 py-1 rounded-full">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-3xl lg:text-5xl font-title text-white transition-colors duration-300 group-hover:text-primary ">
                      {service.name}
                    </h3>

                    {service.summary && (
                      <p className="text-base lg:text-lg text-white font-light  max-w-xl">
                        {service.summary}
                      </p>
                    )}

                    {/* Features List (Ultra-Clean Bullet Grid without Heavy Outlines) */}
                    {service.features && service.features.length > 0 && (
                      <ul className="grid grid-cols-1  gap-y-6 gpt-2">
                        {service.features.map((feat, fIdx) => (
                          <li
                            key={fIdx}
                            className="flex items-start gap-2.5 text-sm lg:text-base text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5 opacity-85" />
                            <span className=" font-light">
                              {typeof feat === 'string' ? feat : (feat.name || feat.title || feat.feature)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="pt-3 inline-flex items-center gap-2 text-lg text-primary font-medium transition-all duration-300 group-hover:gap-3">
                      <span>Ver servicio</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Right Side (50% Width): Widescreen 16:10 Image Container */}
                  <div className={`col-span-6 ${isEven ? 'order-1' : 'order-2'}`}>
                    <div className="w-full aspect-square relative overflow-hidden rounded-2xl  shadow-2xl group-hover:scale-[1.01] transition-all duration-500">
                      {service.image ? (
                        <>
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />

                        </>
                      ) : (
                        <ServiceVisual type={service.visualType} />
                      )}
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

export default ServicesSectionRhino;


