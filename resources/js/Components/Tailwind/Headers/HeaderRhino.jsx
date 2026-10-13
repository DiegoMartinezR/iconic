import React, { useState, useEffect, useRef } from 'react';
import { User, X, Menu, ArrowUpRight, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '../TopBar';
import Global from '../../../Utils/Global';
import { usePageContext } from '../../../Contexts/PageContext';

const HeaderRhino = ({
  data = {},
  pages = [],
  generals = [],
  items = [],
  services = [],
  isUser
}) => {
  const pageCtx = usePageContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [servicesList, setServicesList] = useState([]);
  const menuRef = useRef(null);
  const servicesDropdownRef = useRef(null);

  // Extract general settings from generals array
  const phoneWhatsappObj = generals.find(
    (item) => item.correlative === 'phone_whatsapp' || item.correlative === 'whatsapp_advisors'
  );
  const phoneWhatsapp = phoneWhatsappObj?.description ?? null;

  const emailContactObj = generals.find(
    (item) => item.correlative === 'email_contact' || item.correlative === 'support_email'
  );
  const emailContact = emailContactObj?.description ?? null;

  const cintilloObj = generals.find((item) => item.correlative === 'cintillo');
  const cintilloText = cintilloObj?.description ?? null;

  // Determine topbar type selection
  const selectedTopBar = data?.type_topbar || (phoneWhatsapp || emailContact || cintilloText ? 'TopBarSimple' : 'none');

  // Filter menuable pages ONLY from CMS pages
  const menuPages = Array.isArray(pages) ? pages.filter((p) => p.menuable) : [];

  const navPages = menuPages.map((p) => ({
    id: p.id,
    name: p.name,
    path: p.pseudo_path || p.path || '/',
  }));

  // Fetch or resolve services list directly (Services model)
  useEffect(() => {
    const initialList = (Array.isArray(services) && services.length > 0)
      ? services
      : (Array.isArray(items) && items.length > 0)
        ? items
        : [];

    if (initialList.length > 0) {
      setServicesList(initialList);
      return;
    }

    let isSubscribed = true;

    // Fetch services directly from /services/paginate
    fetch('/services/paginate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ take: 50, is_active: true, status: true })
    })
      .then((res) => res.json())
      .then((resData) => {
        if (!isSubscribed) return;
        const list = resData?.data || resData?.items || (Array.isArray(resData) ? resData : []);
        if (Array.isArray(list) && list.length > 0) {
          setServicesList(list);
        } else {
          // Alternative fetch extracting services from categories response if needed
          fetch('/services/categories')
            .then((r) => r.json())
            .then((catData) => {
              if (!isSubscribed) return;
              if (catData?.status && Array.isArray(catData.data)) {
                const extracted = [];
                catData.data.forEach((cat) => {
                  if (cat.services && Array.isArray(cat.services)) {
                    extracted.push(...cat.services);
                  }
                });
                if (extracted.length > 0) {
                  setServicesList(extracted);
                }
              }
            })
            .catch(() => { });
        }
      })
      .catch(() => { });

    return () => {
      isSubscribed = false;
    };
  }, [services, items]);

  const activeServices = servicesList;

  // Scroll listener for sticky state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logo URL resolution
  const customLogo = data?.logo;
  const logoUrl = customLogo
    ? customLogo.startsWith('/')
      ? customLogo
      : `/storage/images/logo/${customLogo}`
    : `/assets/resources/logo.png?v=${crypto.randomUUID()}`;

  // Evaluate if header solid background & active primary line should be enabled (via PageContext, scroll, or CMS data)
  const isSolidMode = Boolean(
    pageCtx?.headerConfig?.isSolid ||
    isScrolled ||
    data?.solid_bg ||
    data?.is_static ||
    data?.header_solid ||
    data?.header_static
  );

  return (
    <>
      {/* Main Header Wrapper (Always fixed top navbar with dynamic background & primary accent border) */}
      <header
        id={data?.element_id || null}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isSolidMode
          ? 'bg-page-background shadow-lg '
          : 'bg-transparent shadow-none'
          } ${data?.class || ''}`}
      >
        {/* Dynamic TopBar Component */}
        {selectedTopBar && selectedTopBar !== 'none' && (
          <div className={`w-full transition-colors duration-300 ${isSolidMode ? 'bg-page-background/90 border-b border-white/10' : 'bg-transparent border-b border-white/10'
            }`}>
            <TopBar
              which={selectedTopBar}
              data={data}
              generals={generals}
              isUser={isUser}
              pages={pages}
            />
          </div>
        )}

        {/* Navbar Container */}
        <div className={`transition-all duration-300 ${isSolidMode ? 'py-3 border-b-4 border-primary' : 'py-3 border-b-4 border-transparent'}`}>
          <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0">
            <div className="flex items-center justify-between h-10 md:h-12 xl:h-14">
              {/* Logo */}
              <a href="/" className="flex items-center space-x-3 group">
                <img
                  src={logoUrl}
                  alt={Global?.APP_NAME || 'Rhino Technology'}

                  className="h-10 md:h-12 xl:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => e.target.src = "/assets/img/logo-bk.svg"}
                />
              </a>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                {/* Servicios Dropdown Trigger & Menu */}
                <div
                  className="relative"
                  ref={servicesDropdownRef}
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-all duration-300 relative group cursor-pointer py-1"
                  >
                    <span>Servicios</span>
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-300 ${isServicesOpen ? 'rotate-180 text-primary' : 'text-white/60 group-hover:text-white'
                        }`}
                    />
                    <span className="absolute -bottom-0 left-0 w-full bg-white h-0.5 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100" />
                  </button>

                  {/* Dropdown Menu Panel - Pure Minimalist Rhino Design */}
                  <AnimatePresence>
                    {isServicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-0 top-full pt-2 z-50 min-w-[250px] max-w-[300px]"
                      >
                        <div className="bg-page-background/95 border border-white/10 shadow-2xl backdrop-blur-xl rounded-2xl p-2.5 space-y-0.5">
                          {activeServices.map((srv, idx) => {
                            const srvSlug = srv.slug || srv.id;
                            const srvUrl = `/servicio/${srvSlug}`;
                            const isSrvActive = typeof window !== 'undefined' && window.location.pathname === srvUrl;

                            return (
                              <a
                                key={`srv-${srv.id || idx}`}
                                href={srvUrl}
                                className={`group flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${isSrvActive
                                  ? 'text-primary'
                                  : 'text-white hover:text-white'
                                  }`}
                                onClick={() => setIsServicesOpen(false)}
                              >
                                <span className="text-base  font-title truncate group-hover:text-primary transition-colors">
                                  {srv.name}
                                </span>
                                <ChevronRight
                                  size={14}
                                  className="text-white group-hover:text-primary  transition-all flex-shrink-0 ml-2"
                                />
                              </a>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {navPages.map((page) => {
                  const isActive =
                    typeof window !== 'undefined' &&
                    (window.location.pathname === page.path ||
                      (window.location.pathname === '/' && page.path === '/'));

                  return (
                    <a
                      key={`page-${page.id || page.path}`}
                      href={page.path}
                      className={`text-sm font-medium  transition-all duration-300 relative group ${isActive ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                        }`}
                    >
                      {page.name}
                      <span
                        className={`absolute -bottom-1 left-0 w-full bg-white h-0.5 transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                      />
                    </a>
                  );
                })}

                {/* User Account Link */}
                {isUser && (
                  <a
                    href="/account"
                    className="p-2.5 rounded-full transition-all duration-300 bg-white/10 hover:bg-white/20 text-white"
                    title="Mi Cuenta"
                  >
                    <User size={18} />
                  </a>
                )}

                {/* CTA Button usando bg-primary */}
                <a
                  href={data?.cta_link || '/contacto'}
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase  text-white bg-primary hover:opacity-90 rounded-full transition-all duration-300 shadow-md"
                >
                  {data?.cta_text || 'Contactar Ventas'}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </nav>

              {/* Mobile Actions */}
              <div className="flex md:hidden items-center gap-3">
                <button
                  type="button"
                  className="p-2.5 transition-colors text-white rounded-full bg-white/10 hover:bg-white/20"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
                  title={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                >
                  {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu - Minimalista y limpio sin bordes innecesarios ni íconos recargados */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="md:hidden fixed right-0 top-0 h-full w-[85%] max-w-sm bg-page-background shadow-2xl z-50 flex flex-col"
            >
              {/* Drawer Header with Logo & Close button */}
              <div className="flex items-center justify-between p-6">
                <img
                  src={logoUrl}
                  alt={Global?.APP_NAME || 'Rhino Technology'}

                  className="h-9 w-auto object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  aria-label="Cerrar menú"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto py-2">
                <nav className="px-4 space-y-1">
                  {/* Mobile Servicios Accordion - Limpio, sin contenedor con borde ni ícono extra */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                      className="w-full flex items-center justify-between py-3 px-4 text-base font-medium text-white rounded-xl transition-all"
                    >
                      <span>Servicios</span>
                      <ChevronDown
                        size={18}
                        className={`text-white/60 transition-transform duration-300 ${isMobileServicesOpen ? 'rotate-180 text-primary' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isMobileServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden pl-4 pr-2 py-1 space-y-1"
                        >
                          {activeServices.map((srv, idx) => {
                            const srvSlug = srv.slug || srv.id;
                            const srvUrl = srv.path || srv.url || `/servicio/${srvSlug}`;
                            return (
                              <a
                                key={`mob-srv-${srv.id || idx}`}
                                href={srvUrl}
                                className="block py-2.5 px-3 text-sm text-white/75 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {srv.name}
                              </a>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Páginas de Navegación - Limpias sin íconos adicionales */}
                  {navPages.map((page, index) => (
                    <motion.a
                      key={`mobile-page-${page.id || index}`}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      href={page.path}
                      className="block py-3 px-4 text-base font-medium text-white/90 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {page.name}
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Drawer Footer */}
              <div className="p-6">
                <a
                  href={data?.cta_link || '/contacto'}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-3.5 px-4 rounded-xl bg-primary text-white font-semibold text-xs uppercase tracking-wider text-center block transition-all shadow-md hover:opacity-90"
                >
                  {data?.cta_text || 'Contactar Ventas'}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderRhino;

