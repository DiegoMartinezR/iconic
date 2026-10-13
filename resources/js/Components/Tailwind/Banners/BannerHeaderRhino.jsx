import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import TextWithHighlight from '../../../Utils/TextWithHighlight';
import { resolveSystemAsset } from './bannerUtils';

const BannerHeaderRhino = ({ data = {} }) => {
  const {
    name,
    subtitle,
    description,
    button_text,
    button_link,
    background,
    image,
    class_section = '',
    class_container = '',
    class_title = '',
    class_button = '',
    element_id,
  } = data;

  const backgroundUrl = resolveSystemAsset(background || image);

  return (
    <section
      id={element_id || 'header-banner'}
      className={`relative overflow-hidden pt-28 md:pt-36 pb-16 md:pb-24 bg-dark min-h-[60dvh] flex items-center ${class_section}`}
    >
      {/* Background Image Container with Gradient Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={backgroundUrl || '/api/cover/thumbnail/null'}
          alt={name || 'Banner Header Rhino'}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.src = '/api/cover/thumbnail/null';
          }}
        />
        {/* Layered Gradient Overlays for High Contrast & Transparent Header Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-page-background via-page-background/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-page-background/90 via-page-background/50 to-transparent pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className={`2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10 w-full ${class_container}`}>
        <div className="max-w-4xl space-y-6">

          {/* Subtitle / Badge Top */}
          {subtitle && (
            <div className="inline-flex items-center gap-2 bg-primary/15 text-primary border border-primary/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-2 backdrop-blur-md font-title uppercase ">
              <span>{subtitle}</span>
            </div>
          )}

          {/* Banner Hero Heading */}
          {name && (
            <h1 className={`text-5xl md:text-5xl lg:text-8xl font-title text-white mb-6  ${class_title}`}>
              <TextWithHighlight
                text={name}
                color="bg-primary"
                className="font-title"
              />
            </h1>
          )}

          {/* Subtitle / Description Paragraph */}
          {description && (
            typeof description === 'string' && description.includes('<') ? (
              <div
                className="text-white text-base md:text-lg lg:text-xl mb-8 max-w-3xl [&_p]:mb-4 [&_strong]:text-white [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-white text-base md:text-lg lg:text-xl mb-8 max-w-3xl ">
                {description}
              </p>
            )
          )}

          {/* Action CTA Button */}
          {button_text && (
            <div className="relative flex flex-wrap items-center gap-4 pt-2">
              <a
                href={button_link || '#'}
                className={`inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-dark font-bold px-7 py-3 lg:py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 text-base cursor-pointer font-title ${class_button}`}
              >
                <span>{button_text}</span>
                <ArrowUpRight size={20} />
              </a>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default BannerHeaderRhino;
