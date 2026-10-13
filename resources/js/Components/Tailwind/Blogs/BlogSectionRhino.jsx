import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { ArrowUpRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(
      dateString.includes('T') ? dateString : `${dateString}T00:00:00`
    );
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
  } catch (e) {
    return dateString;
  }
};

const extractText = (html, maxLength = 120) => {
  if (!html) return '';
  const text = html.replace(/<[^>]+>/g, '').trim();
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const calculateReadTime = (content) => {
  if (!content) return '3 min';
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]+>/g, '').trim();
  const wordCount = text.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min`;
};

const getPostImage = (post) => {
  if (!post) return '/assets/img/noimage/no_img.jpg';
  const img = post.image || post.url_image || post.banner;
  if (typeof img === 'string' && img) {
    return img.startsWith('/') || img.startsWith('http')
      ? img
      : `/storage/images/post/${img}`;
  }
  return '/assets/img/noimage/no_img.jpg';
};

const getCategoryName = (cat) => {
  if (!cat) return 'Novedades Tech';
  if (typeof cat === 'object') return cat.name || cat.alias || cat.title || 'Novedades Tech';
  return String(cat);
};

const BlogSectionRhino = ({ data = {}, items = [], generals = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swiperRef, setSwiperRef] = useState(null);

  const rawPosts = Array.isArray(items) ? items : [];
  if (rawPosts.length === 0) return null;

  const latestPosts = rawPosts.slice(0, 4);
  const featuredPost = latestPosts[0];
  const secondaryPosts = latestPosts.slice(1, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id={data?.element_id || 'blog'}
      className={`relative py-10 md:py-12 bg-page-background text-white overflow-hidden ${data?.class || data?.class_section || ''}`}
    >
      <div className="max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="space-y-3 max-w-2xl">
            <span className="font-mono text-xs text-primary font-bold uppercase bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full">
              {data?.section_label || 'BLOG & NOVEDADES TECH'}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-title text-white">
              <TextWithHighlight
                text={data?.title || 'Nuestro *Blog* e Ideas de Ingeniería'}
                color="bg-primary"
                className='font-title'
              />
            </h2>
            {data?.subtitle && (
              <p className="text-white text-base md:text-lg font-light">
                {data.subtitle}
              </p>
            )}
          </div>

          <a
            href={data?.blog_url || '/blog'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary text-white font-bold text-xs uppercase transition-all duration-300 shadow-lg shrink-0 group max-w-max"
          >
            <span>{data?.view_all_text || 'Ver todos los artículos'}</span>
            <ArrowUpRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile View: Swiper Slider with Identical Uniform Cards (md:hidden) */}
        <div className="block md:hidden mt-8">
          <Swiper
            modules={[Autoplay]}
            onSwiper={(swiper) => setSwiperRef(swiper)}
            onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
            spaceBetween={24}
            slidesPerView={1}
            loop={latestPosts.length > 1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="w-full"
          >
            {latestPosts.map((post, i) => (
              <SwiperSlide key={post.id || i}>
                <article className="h-full group">
                  <a
                    href={`/post/${post.slug || post.id}`}
                    className="flex flex-col h-full rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl backdrop-blur-md bg-white/[0.02] border border-white/10 hover:border-primary/40"
                  >
                    {/* Image Frame */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden flex-shrink-0 bg-white/[0.01]">
                      <img
                        src={getPostImage(post)}
                        alt={post.title || post.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/img/noimage/no_img.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-page-background/90 via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Text Details */}
                    <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
                      <div className="space-y-3">
                        {/* Category Pill */}
                        <span className="font-mono text-xs font-bold text-primary uppercase px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
                          {getCategoryName(post.category)}
                        </span>

                        {/* Title */}
                        <h3 className="text-xl font-bold font-title text-white group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {post.title || post.name}
                        </h3>

                        {/* Extract */}
                        <p className="text-sm text-white font-light line-clamp-3">
                          {extractText(post.extract || post.description || '', 140)}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-white/40">
                        <span>{formatDate(post.post_date || post.created_at)}</span>
                        <div className="flex items-center gap-1.5 text-primary/80 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{calculateReadTime(post.description)}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom HeroRhino-style Pagination Dots for Mobile */}
          {latestPosts.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {latestPosts.map((_, idx) => (
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
                  aria-label={`Ir al artículo ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === idx
                    ? 'w-8 bg-primary shadow-md'
                    : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop View: Editorial Grid (2 Columns Split) (hidden md:grid) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch"
        >
          {/* LEFT COLUMN: Large Featured Post */}
          {featuredPost && (
            <motion.div variants={itemVariants} className="h-full">
              <article className="h-full">
                <a
                  href={`/post/${featuredPost.slug || featuredPost.id}`}
                  className="group flex flex-col h-full rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl backdrop-blur-md"
                >
                  {/* Image Frame */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden flex-shrink-0 bg-white/[0.01]">
                    <img
                      src={getPostImage(featuredPost)}
                      alt={featuredPost.title || featuredPost.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/img/noimage/no_img.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-page-background/90 via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Text Details */}
                  <div className="p-8 md:p-10 flex flex-col flex-grow justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Category Pill */}
                      <span className="font-mono text-xs font-bold text-primary uppercase px-3 py-1 rounded-full bg-primary/10 inline-block">
                        {getCategoryName(featuredPost.category)}
                      </span>

                      {/* Title */}
                      <h3 className="text-2xl md:text-3xl font-title text-white group-hover:text-primary transition-colors duration-300">
                        {featuredPost.title || featuredPost.name}
                      </h3>

                      {/* Extract */}
                      <p className="text-sm md:text-base text-white font-light line-clamp-3">
                        {extractText(
                          featuredPost.extract || featuredPost.description || '',
                          220
                        )}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-6 text-xs text-white/40">
                      <span>{formatDate(featuredPost.post_date || featuredPost.created_at)}</span>
                      <div className="flex items-center gap-1.5 text-primary/80">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{calculateReadTime(featuredPost.description)}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </article>
            </motion.div>
          )}

          {/* RIGHT COLUMN: 3 Stacked Horizontal Cards */}
          <div className="flex flex-col justify-between h-full gap-6">
            {secondaryPosts.map((post, index) => (
              <motion.div
                key={post.id || index}
                variants={itemVariants}
                className="w-full flex-grow"
              >
                <article className="group h-full">
                  <a
                    href={`/post/${post.slug || post.id}`}
                    className="flex flex-col sm:flex-row h-full rounded-3xl overflow-hidden transition-all duration-500 shadow-xl backdrop-blur-md gap-5 items-center"
                  >
                    {/* Left: Small Image */}
                    <div className="relative w-full sm:w-[42%] aspect-[16/10] sm:aspect-auto sm:h-full rounded-2xl overflow-hidden bg-white/[0.01] shrink-0">
                      <img
                        src={getPostImage(post)}
                        alt={post.title || post.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/img/noimage/no_img.jpg';
                        }}
                      />
                    </div>

                    {/* Right: Details */}
                    <div className="flex flex-col justify-between flex-grow w-full sm:w-[58%] h-full py-1">
                      <div className="space-y-2.5">
                        {/* Category */}
                        <span className="font-mono text-[10px] md:text-xs font-bold text-primary uppercase block">
                          {getCategoryName(post.category)}
                        </span>

                        {/* Title */}
                        <h4 className="text-base md:text-xl font-title text-white group-hover:text-primary transition-colors line-clamp-3">
                          {post.title || post.name}
                        </h4>

                        {/* Summary */}
                        <p className="text-sm text-white font-light line-clamp-2">
                          {extractText(post.extract || post.description || '', 100)}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-3 mt-4 border-t border-white/5 font-mono text-[11px] text-white/40">
                        <span>{formatDate(post.post_date || post.created_at)}</span>
                        <div className="flex items-center gap-1 text-primary/80">
                          <Clock className="w-3 h-3" />
                          <span>{calculateReadTime(post.description)}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </article>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSectionRhino;

