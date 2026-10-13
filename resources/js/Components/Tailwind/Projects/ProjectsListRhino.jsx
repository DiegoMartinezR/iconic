import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Search, FolderGit2, X, ChevronDown } from 'lucide-react';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const getCategoryName = (cat) => {
  if (!cat) return 'Ingeniería Digital';
  if (typeof cat === 'object') return cat.name || cat.alias || cat.title || 'Ingeniería Digital';
  return String(cat);
};

const getProjectImage = (item) => {
  if (!item) return '/assets/img/noimage/no_img.jpg';
  const img = item.image || item.url_image || item.background_image || item.banner;
  if (typeof img === 'string' && img) {
    return img.startsWith('/') || img.startsWith('http') ? img : `/storage/images/project/${img}`;
  }
  if (Array.isArray(item.images) && item.images.length > 0) {
    const firstImg = item.images[0];
    const imgUrl = typeof firstImg === 'object' ? (firstImg.image || firstImg.url || firstImg.path) : firstImg;
    if (imgUrl) return imgUrl.startsWith('/') || imgUrl.startsWith('http') ? imgUrl : `/storage/images/project/${imgUrl}`;
  }
  return '/assets/img/noimage/no_img.jpg';
};

const extractText = (html, maxLength = 180) => {
  if (!html) return '';
  const text = String(html).replace(/<[^>]+>/g, '').trim();
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const defaultSampleProjects = [
  {
    id: '1',
    name: 'Plataforma E-commerce B2B High-Tech',
    slug: 'ecommerce-b2b-high-tech',
    categoryName: 'Desarrollo Web & E-commerce',
    description: 'Sistema de ventas al por mayor con catálogo interactivo, cotizaciones automáticas en tiempo real y pasarela de pago personalizada con arquitectura de microservicios.',
    tech: ['React', 'Laravel', 'TailwindCSS', 'PostgreSQL'],
    metrics: '+140% Incremento en Ventas B2B',
    image: null,
    featured: true,
  },
  {
    id: '2',
    name: 'Sistema ERP & CRM Cloud para Logística',
    slug: 'erp-crm-cloud-logistica',
    categoryName: 'Sistemas Web & Software',
    description: 'Gestión integral de flotas, control de inventario multialmacén y rastreo GPS en vivo para empresas de distribución masiva a nivel nacional.',
    tech: ['Next.js', 'Node.js', 'Docker', 'AWS'],
    metrics: '35% Optimización de Rutas',
    image: null,
    featured: true,
  },
  {
    id: '3',
    name: 'Agente IA de Atención & Ventas Autónomo',
    slug: 'agente-ia-atencion-ventas',
    categoryName: 'Inteligencia Artificial & Automatización',
    description: 'Asistente de inteligencia artificial capacitado con visión de negocio y RAG para captura de leads, respuesta contextual 24/7 y agendamiento directo.',
    tech: ['OpenAI API', 'Python', 'FastAPI', 'Vector DB'],
    metrics: 'Respuestas automáticas en < 2s',
    image: null,
    featured: false,
  },
  {
    id: '4',
    name: 'Portal Web Corporativo e Identidad Digital',
    slug: 'portal-web-corporativo-identidad',
    categoryName: 'Desarrollo Web & E-commerce',
    description: 'Sitio web institucional ultrarrápido con animaciones glassmorphic avanzadas, optimización SEO técnica y gestor de contenidos CMS autoadministrable.',
    tech: ['Inertia.js', 'React', 'TailwindCSS', 'PHP 8.2'],
    metrics: '99/100 en Google PageSpeed',
    image: null,
    featured: false,
  },
  {
    id: '5',
    name: 'App Web de Control Financiero y Métricas SaaS',
    slug: 'app-web-control-financiero-saas',
    categoryName: 'Sistemas Web & Software',
    description: 'Dashboard analítico con gráficos interactivos en tiempo real, proyección de ingresos recurrentes (MRR) y automatización de facturación electrónica.',
    tech: ['React', 'Chart.js', 'Laravel REST API', 'Redis'],
    metrics: '+50k Transacciones Procesadas',
    image: null,
    featured: false,
  },
  {
    id: '6',
    name: 'Integración IA para Diagnóstico & Procesamiento',
    slug: 'integracion-ia-diagnostico-procesamiento',
    categoryName: 'Inteligencia Artificial & Automatización',
    description: 'Módulo inteligente para extracción automatizada de datos a partir de documentos PDF complejos y análisis predictivo de patrones de negocio.',
    tech: ['Python', 'TensorFlow', 'REST API', 'Docker'],
    metrics: '99.4% Precisión en Extracción',
    image: null,
    featured: false,
  },
];

const ProjectsListRhino = ({ data = {}, items = [], generals = [] }) => {
  const [projectsList, setProjectsList] = useState([]);
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

  // Process incoming items from props or fetch from REST API if empty
  useEffect(() => {
    const rawList = Array.isArray(items) && items.length > 0 ? items : [];

    if (rawList.length > 0) {
      setProjectsList(rawList);
      return;
    }

    let isSubscribed = true;

    fetch('/projects/paginate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ take: 100, is_active: true, status: true })
    })
      .then((res) => res.json())
      .then((resData) => {
        if (!isSubscribed) return;
        const fetchedItems = resData?.data || resData?.items || (Array.isArray(resData) ? resData : []);

        if (Array.isArray(fetchedItems) && fetchedItems.length > 0) {
          setProjectsList(fetchedItems);
        } else {
          setProjectsList(defaultSampleProjects);
        }
      })
      .catch(() => {
        if (isSubscribed) {
          setProjectsList(defaultSampleProjects);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [items]);

  // Normalize project objects for clean rendering
  const normalizedProjects = useMemo(() => {
    const listToProcess = projectsList.length > 0 ? projectsList : defaultSampleProjects;

    return listToProcess.map((item, idx) => {
      const slug = item.slug || item.id || `proyecto-${idx}`;
      const categoryName = getCategoryName(item.category) || getCategoryName(item.serviceCategory) || item.categoryName || 'Ingeniería Digital';
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
      const techArray = parsedTech;

      return {
        id: item.id || slug,
        slug,
        name: typeof item.name === 'string' ? item.name : (item.title || 'Proyecto Rhino'),
        categoryName,
        description: extractText(item.description || item.summary || item.excerpt || 'Solución digital de alto rendimiento desarrollada con ingeniería de software moderna.', 200),
        summary: item.summary || extractText(item.description || item.excerpt || 'Solución digital de alto rendimiento desarrollada con ingeniería de software moderna.', 200),
        metrics: item.metrics || item.subtitle || item.client || null,
        tech: techArray,
        image: getProjectImage(item),
        path: item.path || item.url || `/proyecto/${slug}`,
        featured: Boolean(item.featured),
      };
    });
  }, [projectsList]);

  // Extract unique category names for filter pills
  const categories = useMemo(() => {
    const catSet = new Set();
    normalizedProjects.forEach((p) => {
      if (p.categoryName) catSet.add(p.categoryName);
    });
    return Array.from(catSet);
  }, [normalizedProjects]);

  // Filter projects by selected category and search query
  const filteredProjects = useMemo(() => {
    return normalizedProjects.filter((project) => {
      const matchesCategory = selectedCategory === 'all' || project.categoryName === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.categoryName.toLowerCase().includes(query) ||
        project.tech.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [normalizedProjects, selectedCategory, searchQuery]);

  const selectedLabel = useMemo(() => {
    if (selectedCategory === 'all') {
      return `Todos los proyectos (${normalizedProjects.length})`;
    }
    const count = normalizedProjects.filter((p) => p.categoryName === selectedCategory).length;
    return `${selectedCategory} (${count})`;
  }, [selectedCategory, normalizedProjects]);

  return (
    <section
      id={data?.element_id || 'nuestros-proyectos'}
      className={`relative py-10 lg:py-12 bg-page-background text-white overflow-hidden ${data?.class || data?.class_section || ''}`}
    >
      <div className="max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10">

        {/* Section Title Header (Optional) */}
        {(data?.title || data?.subtitle) && (
          <div className="max-w-3xl mb-12 md:mb-16">
            {data?.title && (
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-title text-white">
                <TextWithHighlight
                  text={data.title}
                  color="bg-primary"
                  className="font-title"
                />
              </h2>
            )}
            {data?.subtitle && (
              <p className="mt-4 text-lg md:text-xl text-white/70 font-light max-w-xl">
                {data.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 md:gap-6 mb-12 md:mb-16 pb-6 border-b border-white/10">

          {/* Desktop Category Pills (hidden md:flex) */}
          <div className="hidden md:flex flex-wrap items-center gap-3 flex-grow">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase transition-all duration-300 cursor-pointer ${selectedCategory === 'all'
                ? 'bg-primary text-neutral-dark shadow-lg shadow-primary/20 scale-105'
                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                }`}
            >
              Todos ({normalizedProjects.length})
            </button>

            {categories.map((catName) => {
              const isSelected = selectedCategory === catName;
              const count = normalizedProjects.filter((p) => p.categoryName === catName).length;

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
              Filtrar por Categoría
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full flex items-center justify-between px-5 py-3 rounded-full text-xs font-bold uppercase transition-all duration-300 cursor-pointer border ${selectedCategory !== 'all'
                ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10'
                : 'bg-white/5 hover:bg-white/10 border-white/20 text-white'
                }`}
            >
              <div className="flex items-center gap-2 truncate">

                <span className="truncate">{selectedLabel}</span>
              </div>
              <ChevronDown
                size={16}
                className={`shrink-0 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-primary' : 'text-white/60'
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
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all text-left cursor-pointer ${selectedCategory === 'all'
                    ? 'bg-primary text-neutral-dark font-extrabold shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <span className="truncate">Todos los proyectos</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${selectedCategory === 'all' ? 'bg-neutral-dark/20 text-neutral-dark' : 'bg-white/10 text-white/60'
                    }`}>
                    {normalizedProjects.length}
                  </span>
                </button>

                {categories.map((catName) => {
                  const isSelected = selectedCategory === catName;
                  const count = normalizedProjects.filter((p) => p.categoryName === catName).length;

                  return (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(catName);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all text-left cursor-pointer ${isSelected
                        ? 'bg-primary text-neutral-dark font-extrabold shadow-md'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                      <span className="truncate">{catName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${isSelected ? 'bg-neutral-dark/20 text-neutral-dark' : 'bg-white/10 text-white/60'
                        }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full sm:w-72 md:w-80 shrink-0 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por proyecto o tecnología..."
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

        {/* Minimalist Editorial Projects List (Fidelity to ServiceDetailRhino & ServicesSectionRhino) */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 px-4 max-w-md mx-auto">
            <FolderGit2 size={40} className="mx-auto text-white/30 mb-4" />
            <h3 className="text-lg font-bold font-title text-white">No se encontraron proyectos</h3>
            <p className="text-xs text-white/50 mt-1 font-light">Prueba cambiando la categoría o borrando los términos de búsqueda.</p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-6 px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-dark font-bold text-xs uppercase  transition-all cursor-pointer font-title shadow-lg"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-24">
            {filteredProjects.map((project, i) => {
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
        )}



      </div>
    </section>
  );
};

export default ProjectsListRhino;
