import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const parseBool = (value, defaultValue = true) => {
  if (value === true || value === 'true' || value === 'si' || value === 'yes' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 'no' || value === 0 || value === '0') return false;
  return defaultValue;
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('/') || path.startsWith('http')) return path;
  return `/storage/images/slider/${path}`;
};

const HeroRhino = ({ items = [], data = {}, generals = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(true);
  const startX = useRef(0);
  const endX = useRef(0);

  const infiniteLoop = data?.infiniteLoop !== undefined ? parseBool(data.infiniteLoop, true) : true;
  const showPagination = data?.showPagination !== undefined ? parseBool(data.showPagination, true) : true;
  const showNavigation = data?.showNavigation !== undefined ? parseBool(data.showNavigation, true) : true;
  const hasKenBurnsAnimation = data?.animation_slider !== undefined ? parseBool(data.animation_slider, true) : true;

  // Sort items from DB strictly by order_index
  const sortedSlides = Array.isArray(items) && items.length > 0
    ? [...items].sort((a, b) => (Number(a.order_index) || 0) - (Number(b.order_index) || 0))
    : [];

  // Autoplay slider logic
  useEffect(() => {
    if (!infiniteLoop || isPaused || sortedSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sortedSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sortedSlides.length, isPaused, infiniteLoop]);

  // Detect image darkness to adapt text colors dynamically when custom colors aren't explicitly provided
  const checkImageDarkness = (src) => {
    if (!src) return;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let colorSum = 0;
        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          colorSum += brightness;
        }
        const avg = colorSum / (imageData.data.length / 4);
        setIsDarkBg(avg < 128);
      } catch (e) {
        setIsDarkBg(true);
      }
    };
  };

  useEffect(() => {
    const currentItem = sortedSlides[currentSlide];
    if (currentItem) {
      const bgSrc = getImageUrl(currentItem.bg_image || currentItem.image);
      if (bgSrc) checkImageDarkness(bgSrc);
    }
  }, [currentSlide, sortedSlides]);

  const handleNext = () => {
    if (sortedSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % sortedSlides.length);
  };

  const handlePrev = () => {
    if (sortedSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + sortedSlides.length) % sortedSlides.length);
  };

  // Touch & Mouse drag swipe gesture support
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    endX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleMouseDown = (e) => {
    startX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    endX.current = e.clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const threshold = 50;
    const diffX = startX.current - endX.current;
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  if (sortedSlides.length === 0) {
    return (
      <div className="w-full h-[50vh] bg-page-background flex items-center justify-center text-white/60">
        No hay slides configurados.
      </div>
    );
  }

  // Calculate dynamic custom overlay from DB parameters
  const getOverlayStyle = (slide) => {
    if (slide.overlay_color || slide.overlay_opacity !== undefined || slide.overlay_direction) {
      const dirMap = {
        'to-r': 'to right',
        'to-l': 'to left',
        'to-t': 'to top',
        'to-b': 'to bottom',
        'to-tr': 'to top right',
        'to-tl': 'to top left',
        'to-br': 'to bottom right',
        'to-bl': 'to bottom left'
      };
      const direction = dirMap[slide.overlay_direction] || 'to right';
      const color = slide.overlay_color || '#000000';
      const opacityHex = Math.round((slide.overlay_opacity ?? 70) * 2.55).toString(16).padStart(2, '0');
      return {
        background: `linear-gradient(${direction}, ${color}${opacityHex}, transparent)`
      };
    }
    return null;
  };

  return (
    <section
      id={data?.element_id || null}
      className={`relative bg-page-background text-white overflow-hidden w-full h-screen min-h-[640px] flex items-center select-none cursor-grab active:cursor-grabbing ${data?.class || ''}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {sortedSlides.map((slide, index) => {
        const bgImageSrc = getImageUrl(slide.bg_image || slide.image);
        const bgImageMobileSrc = getImageUrl(slide.bg_image_mobile || slide.bg_image || slide.image);
        const customOverlayStyle = getOverlayStyle(slide);

        const showOverlay = slide.show_overlay !== false &&
          slide.show_overlay !== 0 &&
          slide.show_overlay !== '0' &&
          slide.show_overlay !== 'false';

        const showContent = slide.show_content !== false &&
          slide.show_content !== 0 &&
          slide.show_content !== '0' &&
          slide.show_content !== 'false';

        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
          >
            {/* Dynamic DB Overlay Layer */}
            {showOverlay && (
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={customOverlayStyle || undefined}
              >
                {!customOverlayStyle && (
                  <>
                    <div className="absolute inset-0 bg-page-background/70 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-r from-page-background via-page-background/90 to-transparent" />
                  </>
                )}
              </div>
            )}

            {/* Desktop Background Image with Ken Burns animation & navigation click */}
            {bgImageSrc && (
              <img
                src={bgImageSrc}
                alt={slide.name || slide.title || 'Background Image'}

                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="hidden md:block w-full h-full object-cover transition-transform duration-[10000ms] ease-out z-0 cursor-pointer"
                style={{
                  transform: hasKenBurnsAnimation && currentSlide === index ? 'scale(1.08)' : 'scale(1)',
                }}
                onClick={() => {
                  if (slide.button_link) {
                    window.open(slide.button_link, slide.button_new_tab ? '_blank' : '_self');
                  }
                }}
              />
            )}

            {/* Mobile Background Image */}
            {bgImageMobileSrc && (
              <img
                src={bgImageMobileSrc}
                alt={slide.name || slide.title || 'Background Image Mobile'}

                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="block md:hidden w-full h-full object-cover transition-transform duration-[10000ms] ease-out z-0 cursor-pointer"
                style={{
                  transform: hasKenBurnsAnimation && currentSlide === index ? 'scale(1.08)' : 'scale(1)',
                }}
                onClick={() => {
                  if (slide.button_link) {
                    window.open(slide.button_link, slide.button_new_tab ? '_blank' : '_self');
                  }
                }}
              />
            )}

            {/* Slide Content Section */}
            {showContent && (
              <div className="absolute inset-0 z-20 flex flex-col justify-center 2xl:max-w-7xl mx-auto px-primary 2xl:px-0 w-full pt-28 lg:pt-32 pb-12 pointer-events-auto">
                <AnimatePresence mode="wait">
                  {currentSlide === index && (
                    <motion.div
                      key={slide.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="max-w-3xl xl:max-w-4xl space-y-6 text-left"
                    >
                      {/* Subtitle Badge */}
                      {slide.subtitle && (
                        <div
                          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-[10px] lg:text-xs font-medium  uppercase backdrop-blur-md shadow-sm"
                          style={{ color: slide.subtitle_color || '#FFFFFF' }}
                        >

                          {slide.subtitle}
                        </div>
                      )}

                      {/* Main Title */}
                      {(slide.name || slide.title) && (
                        <h2
                          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl  font-title"
                          style={{
                            color: slide.title_color || (isDarkBg ? '#FFFFFF' : '#0F172A'),
                          }}
                        >
                          <TextWithHighlight text={slide.name || slide.title} color="bg-primary" className='font-title' />
                        </h2>
                      )}

                      {/* Description */}
                      {slide.description && (
                        <p
                          className="text-base md:text-lg lg:text-xl  font-light max-w-xl"
                          style={{
                            color:
                              slide.description_color ||
                              (isDarkBg ? 'rgba(255, 255, 255, 0.85)' : '#334155'),
                          }}
                        >
                          {slide.description}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-4 pt-2">
                        {(slide.button_text || slide.button_link) && (
                          <a
                            href={slide.button_link || '#'}
                            target={slide.button_new_tab ? '_blank' : '_self'}
                            rel={slide.button_new_tab ? 'noopener noreferrer' : undefined}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 px-7 py-3 lg:py-3.5 rounded-full bg-primary hover:opacity-95 text-neutral-dark font-semibold text-sm lg:text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                          >
                            {slide.button_text || 'Ver Más'}
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        )}

                        {(slide.secondary_button_text || slide.secondary_button_link) && (
                          <a
                            href={slide.secondary_button_link || '#'}
                            target={slide.secondary_button_new_tab ? '_blank' : '_self'}
                            rel={slide.secondary_button_new_tab ? 'noopener noreferrer' : undefined}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 px-7 py-3 lg:py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm lg:text-base border border-white/20 backdrop-blur-sm transition-all shadow-md hover:scale-[1.02]"
                          >
                            {slide.secondary_button_text || 'Contactar'}
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation & Pagination Controls */}
      {sortedSlides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-30 2xl:max-w-7xl mx-auto px-primary 2xl:px-0 flex items-center justify-between pointer-events-none">
          {showPagination && (
            <div className="flex items-center gap-2 pointer-events-auto">
              {sortedSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Ir al slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === idx
                    ? 'w-8 bg-primary shadow-md'
                    : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                />
              ))}
            </div>
          )}

          {showNavigation && (
            <div className="flex items-center gap-3 ml-auto pointer-events-auto">
              <button
                onClick={handlePrev}
                aria-label="Slide anterior"
                className="h-11 w-11 rounded-full border border-white/20 bg-black/30 hover:bg-primary hover:border-transparent backdrop-blur-md flex items-center justify-center text-white transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Slide siguiente"
                className="h-11 w-11 rounded-full border border-white/20 bg-black/30 hover:bg-primary hover:border-transparent backdrop-blur-md flex items-center justify-center text-white transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default HeroRhino;

