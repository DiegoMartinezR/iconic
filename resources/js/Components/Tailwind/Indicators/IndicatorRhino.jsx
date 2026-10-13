import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const IndicatorRhino = ({ items = [], data = {}, generals = [] }) => {
  // Sort items strictly by order_index
  const sortedItems = Array.isArray(items) && items.length > 0
    ? [...items].sort((a, b) => (Number(a.order_index) || 0) - (Number(b.order_index) || 0))
    : [];

  if (sortedItems.length === 0) return null;

  return (
    <section
      id={data?.element_id || null}
      className={`${data?.background ? data.background : 'bg-page-background'
        } text-white py-8 md:py-12  overflow-hidden font-paragraph relative z-20 ${data?.class || ''}`}
    >
      <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          loop={sortedItems.length > 1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: Math.min(3, sortedItems.length),
              spaceBetween: 32,
            },
            1280: {
              slidesPerView: Math.min(3, sortedItems.length),
              spaceBetween: 40,
            },
          }}
          className="w-full"
        >
          {sortedItems.map((benefit, index) => (
            <SwiperSlide key={benefit.id || index}>
              <div className="flex items-center gap-4 group/card h-full">
                {/* Circular Icon Container */}
                <div className="relative min-w-14 min-h-14 max-w-14 max-h-14 md:min-w-16 md:min-h-16 md:max-w-16 md:max-h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-300 group-hover/card:bg-primary/20 group-hover/card:border-primary/40">
                  <div className="relative z-10 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
                    <img
                      src={`/storage/images/indicator/${benefit.symbol}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/img/noimage/no_imagen_circular.png';
                      }}
                      alt={benefit.name || 'Indicador'}
                      className="w-full h-full object-contain filter brightness-0 invert transition-transform duration-300 group-hover/card:scale-110"
                    />
                  </div>
                </div>

                {/* Text Info */}
                <div className={`flex-1 min-w-0 text-left ${data?.class_content || ''}`}>
                  <span className={` text-white font-title text-lg md:text-xl block leading-snug group-hover/card:text-primary transition-colors ${data?.class_title || ''}`}>
                    {benefit.name}
                  </span>
                  {benefit.description && (
                    <p className="text-white text-xs md:text-sm block mt-1 font-light leading-relaxed line-clamp-3">
                      {benefit.description}
                    </p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default IndicatorRhino;


