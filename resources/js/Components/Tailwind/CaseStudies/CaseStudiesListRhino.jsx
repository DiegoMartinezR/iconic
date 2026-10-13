import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowUpRight, FolderGit2, Search, X, ChevronDown } from 'lucide-react';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const getCaseImage = (c) => {
  if (!c) return '/assets/img/noimage/no_img.jpg';
  const img = c.image || c.url_image || c.background_image || c.banner;
  if (typeof img === 'string' && img) {
    return img.startsWith('/') || img.startsWith('http') ? img : `/storage/images/case_study/${img}`;
  }
  return '/assets/img/noimage/no_img.jpg';
};

const extractText = (htmlOrText, length = 180) => {
  if (!htmlOrText) return '';
  const text = String(htmlOrText).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

const CaseStudiesListRhino = ({ data = {}, items = [], generals = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const rawItems = Array.isArray(items) ? items : [];

  const normalizedCases = useMemo(() => {
    return rawItems.map((c, idx) => {
      const slug = c.slug || c.id || `caso-${idx}`;
      const client = c.client || c.name || 'Cliente Confidencial';
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
        client,
        before: c.before || c.problem || null,
        after: c.after || c.solution || null,
        impact: c.impact || c.metrics || c.badge || null,
        summary: extractText(c.summary || c.description || c.quote || '', 200),
        indicators: parsedIndicators,
        image: getCaseImage(c),
        path: c.path || c.url || `/caso-de-exito/${slug}`,
      };
    });
  }, [rawItems]);

  // Unique clients for filter pills
  const clients = useMemo(() => {
    const set = new Set();
    normalizedCases.forEach((c) => {
      if (c.client && c.client !== 'Cliente Confidencial') set.add(c.client);
    });
    return Array.from(set);
  }, [normalizedCases]);

  // Filter cases by search and client
  const filteredCases = useMemo(() => {
    return normalizedCases.filter((c) => {
      const matchesCategory = selectedCategory === 'all' || c.client === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        c.name.toLowerCase().includes(query) ||
        c.summary.toLowerCase().includes(query) ||
        c.client.toLowerCase().includes(query) ||
        (c.before && c.before.toLowerCase().includes(query)) ||
        (c.after && c.after.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [normalizedCases, selectedCategory, searchQuery]);

  const selectedLabel = useMemo(() => {
    if (selectedCategory === 'all') {
      return `Todos los casos (${normalizedCases.length})`;
    }
    const count = normalizedCases.filter((p) => p.client === selectedCategory).length;
    return `${selectedCategory} (${count})`;
  }, [selectedCategory, normalizedCases]);

  if (rawItems.length === 0) return null;

  return (
    <section
      id={data?.element_id || 'listado-casos-de-exito'}
      className={`relative py-10 lg:py-16 bg-page-background text-white overflow-hidden ${data?.class || data?.class_section || ''}`}
    >
      <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10">

        {/* Section Header */}
        {data?.subtitle && data?.title && (
          <div className="max-w-3xl mb-12 md:mb-16">
            {data?.title && (
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-title text-white">
                {data?.title ? (
                  <TextWithHighlight text={data.title} color="bg-primary" className="font-title" />
                ) : (
                  <>
                    Casos de Éxito <span className="text-primary block md:inline font-title">& Resultados Reales</span>
                  </>
                )}
              </h2>
            )}
            {data?.subtitle && (
              <p className="mt-4 text-lg md:text-xl text-white/70 font-light max-w-xl">
                {data?.subtitle || 'Explora el catálogo completo de casos de estudio, desafíos resueltos e impacto en negocios de tecnología.'}
              </p>
            )}
          </div>
        )}

        {/* Filter Controls Bar (Pills + Search Input) */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 md:gap-6 mb-12 md:mb-16 pb-6 border-b border-white/10">
          {/* Desktop Category / Client Pills (hidden md:flex) */}
          <div className="hidden md:flex flex-wrap items-center gap-3 flex-grow">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase transition-all duration-300 cursor-pointer ${selectedCategory === 'all'
                ? 'bg-primary text-neutral-dark shadow-lg shadow-primary/20 scale-105'
                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                }`}
            >
              Todos ({normalizedCases.length})
            </button>

            {clients.map((catName) => {
              const isSelected = selectedCategory === catName;
              const count = normalizedCases.filter((p) => p.client === catName).length;

              return (
                <button
                  key={catName}
                  type="button"
                  onClick={() => setSelectedCategory(catName)}
                  className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase transition-all duration-300 cursor-pointer ${isSelected
                    ? 'bg-primary text-neutral-dark shadow-lg shadow-primary/20 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                    }`}
                >
                  {catName} ({count})
                </button>
              );
            })}
          </div>

          {/* Custom Category Dropdown Select (Solo Mobile: block md:hidden) */}
          <div className="relative w-full block md:hidden" ref={dropdownRef}>
            <label className="block text-[10px] font-mono text-primary font-bold uppercase tracking-wider mb-1.5 ml-1">
              Filtrar por Cliente / Categoría
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full flex items-center justify-between px-5 py-3 rounded-full text-xs font-bold uppercase transition-all duration-300 cursor-pointer border ${
                selectedCategory !== 'all'
                  ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10'
                  : 'bg-white/5 hover:bg-white/10 border-white/20 text-white'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="truncate">{selectedLabel}</span>
              </div>
              <ChevronDown
                size={16}
                className={`shrink-0 transition-transform duration-300 ${
                  isDropdownOpen ? 'rotate-180 text-primary' : 'text-white/60'
                }`}
              />
            </button>

            {/* Options List Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#121212]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl space-y-1 max-h-72 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all text-left cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-neutral-dark font-extrabold shadow-md'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="truncate">Todos los casos</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    selectedCategory === 'all' ? 'bg-neutral-dark/20 text-neutral-dark' : 'bg-white/10 text-white/60'
                  }`}>
                    {normalizedCases.length}
                  </span>
                </button>

                {clients.map((catName) => {
                  const isSelected = selectedCategory === catName;
                  const count = normalizedCases.filter((p) => p.client === catName).length;

                  return (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(catName);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'bg-primary text-neutral-dark font-extrabold shadow-md'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{catName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isSelected ? 'bg-neutral-dark/20 text-neutral-dark' : 'bg-white/10 text-white/60'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full sm:w-72 md:w-80 shrink-0 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar casos de éxito..."
              className="w-full pl-10 pr-9 py-3 md:py-3.5 text-xs md:text-sm rounded-full bg-transparent border border-white/20 hover:border-white/40 text-white placeholder-white/50 outline-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white/5 transition-all font-light"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-primary p-1 rounded-full cursor-pointer transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Cases List */}
        {filteredCases.length === 0 ? (
          <div className="text-center py-20 px-4 max-w-md mx-auto">
            <FolderGit2 size={40} className="mx-auto text-white/30 mb-4" />
            <h3 className="text-lg font-bold font-title text-white">No se encontraron casos de éxito</h3>
            <p className="text-xs text-white/50 mt-1 font-light">Prueba cambiando la búsqueda o seleccionando otro filtro.</p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-6 px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-dark font-bold text-xs uppercase transition-all cursor-pointer font-title shadow-lg"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-24">
            {filteredCases.map((c, i) => {
              const isEven = i % 2 === 0;

              return (
                <div key={c.id || i} className="group relative">
                  <a
                    href={c.path}
                    className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
                  >
                    {/* Left/Right Text Column */}
                    <div className={`lg:col-span-6 space-y-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      {/* Number + Badges */}
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

                    {/* Right/Left Image Column (1:1 Aspect Square Frame) */}
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
        )}
      </div>
    </section>
  );
};

export default CaseStudiesListRhino;
