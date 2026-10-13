import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const IndicatorSimple = ({ items = [], data }) => {
  const sortedItems =
    items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) || [];

  useEffect(() => {
    const styleId = "indicator-simple-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .indicator-simple-bullet { width: 8px; height: 8px; background: var(--bg-primary); opacity: 0.3; border-radius: 9999px; transition: all 0.3s ease; cursor: pointer; display: inline-block; }
        .indicator-simple-bullet:hover { opacity: 0.6; transform: scale(1.2); }
        .indicator-simple-bullet.swiper-pagination-bullet-active { width: 24px; background: var(--bg-primary); opacity: 1; }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, []);

  if (sortedItems.length === 0) return null;

  const showPagination = sortedItems.length > 1;

  return (
    <section id={data?.element_id || null} className="bg-accent w-full">
      <div className="px-primary 2xl:px-0">
        <div className="2xl:max-w-7xl mx-auto py-[2.5%] relative">
          <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={0}
          loop={false}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={
            showPagination
              ? {
                  el: ".indicator-simple-pagination",
                  clickable: true,
                  dynamicBullets: true,
                  renderBullet: (index, className) =>
                    `<span class="${className} indicator-simple-bullet"></span>`,
                }
              : false
          }
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="w-full"
        >
          {sortedItems.map((benefit, index) => (
            <SwiperSlide key={benefit.id || index}>
              <div className="flex items-center gap-4 px-1 md:px-2">
                <div className="flex-shrink-0">
                  <div className="bg-primary rounded-full p-3 flex items-center justify-center">
                    <img
                      src={`/storage/images/indicator/${benefit.symbol}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/img/noimage/no_imagen_circular.png";
                      }}
                      className="min-w-8 min-h-8 max-w-8 max-h-8 object-contain"
                      alt={benefit.name}
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-bold" children={benefit.name} />
                  {benefit.description && (
                    <p children={benefit.description}></p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {showPagination && (
          <div className="indicator-simple-pagination flex justify-center gap-2 mt-6 lg:hidden"></div>
        )}
      </div>
    </div>
    </section>
  );
}

export default IndicatorSimple
