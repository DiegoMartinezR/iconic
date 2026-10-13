import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const getBrandImage = (item) => {
  if (!item) return null;
  const img = typeof item === 'string' ? item : (item.image || item.logo || item.src || item.path || item.picture);
  if (!img || typeof img !== 'string' || !img.trim()) return null;
  if (img.startsWith('data:') || img.startsWith('/') || img.startsWith('http://') || img.startsWith('https://')) {
    return img;
  }
  return `/storage/images/brand/${img}`;
};

const ClientsSectionRhino = ({ data = {}, items = [], generals = [] }) => {
  // Si no hay items/marcas, no mostrar la sección
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const sectionLabel = data?.section_label || data?.subtitle || "Clientes & Marcas Aliadas";
  const title = data?.title || "Empresas que *confían* en nuestra tecnología";
  const description = data?.description || data?.summary;

  return (
    <section className="relative py-14 md:py-20 bg-page-background text-white border-t border-white/10 overflow-hidden font-paragraph">
      {/* Luz ambiental de fondo estilo Rhino */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10">
        {/* Cabecera de la sección */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14 space-y-4">
          {sectionLabel && (
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold backdrop-blur-md">
              {sectionLabel}
            </div>
          )}

          {title && (
            <h2 className="text-4xl md:text-5xl lg:text-7xl  font-title   text-white">
              <TextWithHighlight text={title} color="bg-primary" className='font-title' />

            </h2>
          )}

          {description && (
            <p className="text-base md:text-lg text-white/70 font-light max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Carrusel Swiper de Marcas sin bordes ni cajas en las imágenes */}
        <div className="relative w-full max-w-7xl mx-auto">
          {/* Degradados laterales para difuminar bordes */}
          <div className="absolute top-0 bottom-0 left-0 w-12 md:w-28 bg-gradient-to-r from-page-background to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-12 md:w-28 bg-gradient-to-l from-page-background to-transparent z-10 pointer-events-none" />

          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={2}
            loop={items.length > 3}
            speed={3500}
            autoplay={{
              delay: 1,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              480: { slidesPerView: 3, spaceBetween: 36 },
              768: { slidesPerView: 4, spaceBetween: 44 },
              1024: { slidesPerView: 5, spaceBetween: 52 },
              1280: { slidesPerView: 6, spaceBetween: 60 },
            }}
            className="w-full !py-4"
          >
            {items.map((item, idx) => {
              const brandImg = getBrandImage(item);
              const brandName = typeof item === 'string' ? item : (item.name || item.title || item.label || `Cliente ${idx + 1}`);
              const brandLink = typeof item === 'object' ? (item.url || item.website || item.link) : null;

              const cardContent = (
                <div className="group relative flex items-center justify-center px-4 py-2 h-20 md:h-24 cursor-pointer w-full">
                  {brandImg ? (
                    <img
                      src={brandImg}
                      alt={brandName}
                      className="max-h-12 md:max-h-16 w-auto object-contain filter   group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) {
                          e.currentTarget.nextSibling.style.display = 'block';
                        }
                      }}
                    />
                  ) : null}

                </div>
              );

              return (
                <SwiperSlide key={idx} className="!h-auto flex items-center justify-center">
                  {brandLink ? (
                    <a href={brandLink} target="_blank" rel="noopener noreferrer" className="w-full block">
                      {cardContent}
                    </a>
                  ) : (
                    cardContent
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ClientsSectionRhino;


