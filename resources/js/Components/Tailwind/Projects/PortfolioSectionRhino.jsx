import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const getCategoryName = (cat) => {
  if (!cat) return null;
  if (typeof cat === 'object') return cat.name || cat.alias || cat.title || null;
  return String(cat);
};

const getProjectImage = (item) => {
  if (!item) return null;
  const img = item.image || item.url_image || item.background_image || item.banner;
  if (typeof img === 'string' && img) {
    return img.startsWith('/') || img.startsWith('http') ? img : `/storage/images/project/${img}`;
  }
  if (Array.isArray(item.images) && item.images.length > 0) {
    const firstImg = item.images[0];
    const imgUrl = typeof firstImg === 'object' ? (firstImg.image || firstImg.url || firstImg.path) : firstImg;
    if (imgUrl) return imgUrl.startsWith('/') || imgUrl.startsWith('http') ? imgUrl : `/storage/images/project/${imgUrl}`;
  }
  return null;
};

const PortfolioSectionRhino = ({ data = {}, items = [], generals = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swiperRef, setSwiperRef] = useState(null);

  const rawList = Array.isArray(items) ? items : [];

  const projectList = rawList.map((item, idx) => {
    const slug = item.slug || item.id || `proj-${idx}`;
    let parsedTech = [];
    let rawTech = item.technologies || item.tech;
    if (typeof rawTech === 'string') {
      try {
        const tryParse = JSON.parse(rawTech);
        if (Array.isArray(tryParse)) {
          rawTech = tryParse;
        } else {
          parsedTech = String(rawTech).split(',').map(t => t.trim()).filter(Boolean);
          rawTech = [];
        }
      } catch (e) {
        parsedTech = String(rawTech).split(',').map(t => t.trim()).filter(Boolean);
        rawTech = [];
      }
    }
    if (Array.isArray(rawTech) && rawTech.length > 0) {
      parsedTech = rawTech.map(t => typeof t === 'object' ? (t.name || t.title) : String(t)).filter(Boolean);
    }

    return {
      id: item.id || slug,
      slug,
      name: typeof item.name === 'string' ? item.name : (item.title || 'Proyecto Destacado'),
      categoryName: getCategoryName(item.category),
      description: typeof item.description === 'string' ? item.description : (item.summary || item.excerpt || ''),
      summary: typeof item.summary === 'string' ? item.summary : (item.description || item.excerpt || ''),
      metrics: typeof item.metrics === 'string' ? item.metrics : (item.client || item.subtitle || null),
      tech: parsedTech,
      image: getProjectImage(item),
      path: item.path || item.url || `/proyecto/${slug}`,
    };
  });

  if (projectList.length === 0) return null;

  return (
    <section
      id={data?.element_id || 'portafolio'}
      className={`relative py-10 md:py-12 bg-page-background text-white overflow-hidden ${data?.class || ''}`}
    >
      <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10">
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl lg:text-7xl  font-title text-white">
              {data?.title ? (
                <TextWithHighlight text={data.title} color="bg-primary" className='font-title' />
              ) : (
                <>
                  Proyectos Destacados{' '}
                  <span className="text-primary block md:inline font-title">e Ingeniería Digital</span>
                </>
              )}
            </h2>

            <p className="mt-6 max-w-xl text-base md:text-lg lg:text-xl text-white font-light">
              {data?.subtitle ||
                'Explora algunos de nuestros casos de éxito y soluciones de software creadas para impactar.'}
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
            loop={projectList.length > 1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="w-full"
          >
            {projectList.map((project, i) => (
              <SwiperSlide key={project.id || i}>
                <div className="group relative">
                  <a href={project.path} className="block space-y-5">
                    {/* Visual / Image Slot (Aspect Square matching Desktop) */}
                    <div className="w-full aspect-square relative overflow-hidden rounded-2xl shadow-2xl">
                      {project.image ? (
                        <>
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/img/noimage/no_img.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-page-background/80 via-transparent to-transparent opacity-60" />
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.02] text-white/30 space-y-3">
                          <FolderGit2 className="w-12 h-12 text-primary/40" />
                          <span className="text-xs text-white/50">{project.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Content Section (Matching Desktop Hierarchy) */}
                    <div className="space-y-4 pt-1">
                      {/* Number + Category Badge */}
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-primary/70">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {project.categoryName && (
                          <span className="inline-block text-xs font-mono text-primary font-bold uppercase border border-primary/30 bg-primary/10 px-3 py-1 rounded-full">
                            {project.categoryName}
                          </span>
                        )}
                      </div>

                      {/* Project Name Heading */}
                      <h3 className="text-2xl font-title text-white group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>

                      {/* Summary Description */}
                      {project.summary && (
                        <p className="text-sm text-white font-light">
                          {project.summary}
                        </p>
                      )}

                      {/* Tech List (Bullet Grid matching Desktop) */}
                      {project.tech && project.tech.length > 0 && (
                        <ul className="grid grid-cols-2 gap-y-3 gap-x-2 pt-1">
                          {project.tech.map((techItem, tIdx) => (
                            <li
                              key={tIdx}
                              className="flex items-start gap-2 text-xs text-white"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 opacity-80" />
                              <span className="font-light">
                                {techItem}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Action Link (Matching Desktop) */}
                      <div className="pt-2 inline-flex items-center gap-2 text-sm lg:text-base text-primary font-medium transition-all duration-300 group-hover:gap-3">
                        <span>Ver detalle del proyecto</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom HeroRhino-style Pagination Dots for Mobile */}
          {projectList.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {projectList.map((_, idx) => (
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
                  aria-label={`Ir al proyecto ${idx + 1}`}
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
          {projectList.map((project, i) => {
            const isEven = i % 2 === 0;

            return (
              <div key={project.id || i} className="group relative">
                <a
                  href={project.path}
                  className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
                >
                  {/* Left/Right Text Column */}
                  <div className={`lg:col-span-6 space-y-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    {/* Number + Badges */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-primary/70">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="inline-block text-xs font-mono text-primary font-bold uppercase border border-primary/30 bg-primary/10 px-3 py-1 rounded-full">
                        {project.categoryName}
                      </span>
                    </div>

                    {/* Project Name Heading */}
                    <h3 className="text-3xl lg:text-5xl font-title text-white transition-colors duration-300 group-hover:text-primary">
                      {project.name}
                    </h3>

                    {/* Summary Description */}
                    <p className="text-base lg:text-lg text-white font-light max-w-xl ">
                      {project.summary}
                    </p>

                    {/* Tech List (Ultra-Clean Bullet Grid without Heavy Outlines) */}
                    {project.tech && project.tech.length > 0 && (
                      <ul className="grid grid-cols-2 gap-y-4 pt-2">
                        {project.tech.map((techItem, tIdx) => (
                          <li
                            key={tIdx}
                            className="flex items-start gap-2 text-sm lg:text-base text-white"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 opacity-80" />
                            <span className="font-light">
                              {techItem}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Action Link (Style ServiceDetailRhino) */}
                    <div className="pt-3 inline-flex items-center gap-2 text-lg text-primary font-medium transition-all duration-300 group-hover:gap-3">
                      <span>Ver detalle del proyecto</span>
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Right/Left Image Column (Aspect Square 1:1 Rounded Frame) */}
                  <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="w-full aspect-square relative overflow-hidden rounded-2xl shadow-2xl group-hover:scale-[1.01] transition-all duration-500">
                      <img
                        src={project.image}
                        alt={project.name}
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

export default PortfolioSectionRhino;

