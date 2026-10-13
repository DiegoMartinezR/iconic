import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import { Search, Menu, X, ChevronRight } from "lucide-react";
import TopBar from "../TopBar";
import { motion, AnimatePresence } from "framer-motion";
import { CurrencySymbol } from "../../../Utils/Number2Currency";

const HeaderSearchMenu = ({
  items,
  data,
  cart,
  setCart,
  isUser,
  pages,
  generals = [], }) => {

  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Bloquear scroll del body mientras el menú mobile está abierto
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMenuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuOpen]);

  // Búsqueda predictiva (igual que HeaderTwenty)
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const suggestionItemsRef = useRef([]);
  const suggestionsRef = useRef(null);
  const desktopSearchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const suggestionRefs = useRef([]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
        !desktopSearchInputRef.current?.contains(event.target)) {
        clearSuggestions();
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Limpieza del debounce al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Cerrar sugerencias con Escape
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape' && showSuggestions) {
        clearSuggestions();
      }
    };
    if (showSuggestions) {
      document.addEventListener("keydown", handleKeyPress);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [showSuggestions]);

  // Scroll automático a la sugerencia seleccionada
  useEffect(() => {
    if (
      selectedSuggestionIndex >= 0 &&
      suggestionRefs.current[selectedSuggestionIndex] &&
      suggestionsRef.current
    ) {
      suggestionRefs.current[selectedSuggestionIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedSuggestionIndex]);

  const fetchSearchSuggestions = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const response = await fetch('/api/items/paginate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          take: 8,
          skip: 0,
          filter: [
            ['name', 'contains', query],
            'or',
            ['summary', 'contains', query],
            'or',
            ['description', 'contains', query],
            'or',
            ['sku', 'contains', query]
          ],
          requireTotalCount: false,
          with: 'category,brand'
        })
      });
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      const resData = await response.json();
      if (resData.status === 200 && Array.isArray(resData.data)) {
        setSearchSuggestions(resData.data);
        setShowSuggestions(resData.data.length > 0);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setSelectedSuggestionIndex(-1);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchSearchSuggestions(value);
    }, 300);
  };

  const clearSuggestions = () => {
    setShowSuggestions(false);
    setSearchSuggestions([]);
    setSelectedSuggestionIndex(-1);
  };

  const selectSuggestion = (suggestion) => {
    if (!suggestion) return;
    clearSuggestions();
    const targetSlug = suggestion.slug || suggestion.id;
    const url = targetSlug
      ? `/product/${targetSlug}`
      : `/catalogo?search=${encodeURIComponent(suggestion.name)}`;
    window.location.href = url;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    clearSuggestions();
    if (search.trim()) {
      window.location.href = `/catalogo?search=${encodeURIComponent(search.trim())}`;
    }
    return false;
  };

  function scrollToSuggestion(index) {
    const container = suggestionsRef.current;
    const el = suggestionItemsRef.current[index];
    if (!container || !el) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    if (elRect.top < containerRect.top) {
      container.scrollTop -= (containerRect.top - elRect.top);
    } else if (elRect.bottom > containerRect.bottom) {
      container.scrollTop += (elRect.bottom - containerRect.bottom);
    }
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || searchSuggestions.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => {
          const next = prev < searchSuggestions.length - 1 ? prev + 1 : prev;
          setTimeout(() => scrollToSuggestion(next), 0);
          return next;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => {
          const next = prev > 0 ? prev - 1 : 0;
          setTimeout(() => scrollToSuggestion(next), 0);
          return next;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < searchSuggestions.length) {
          selectSuggestion(searchSuggestions[selectedSuggestionIndex]);
        } else if (search.trim()) {
          handleFormSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  const SearchSuggestions = ({ suggestions, isLoading, onSelect, selectedIndex }) => {
    if (!showSuggestions) return null;

    const highlightMatches = (text, searchQuery) => {
      if (!text || !searchQuery) return text;
      const searchWords = searchQuery.trim().toLowerCase().split(/\s+/).filter(w => w.length >= 2);
      const pattern = new RegExp(`(${searchWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
      const parts = text.split(pattern);
      return parts.map((part, index) => {
        const isMatch = searchWords.some(word => part.toLowerCase() === word);
        if (isMatch) {
          return <strong key={index} className="font-bold customtext-primary">{part}</strong>;
        }
        return <span key={index}>{part}</span>;
      });
    };

    return (
      <motion.div
        ref={suggestionsRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[60] max-h-80 overflow-y-auto mt-1"
      >
        {isLoading ? (
          <div className="p-4 text-center customtext-neutral-dark">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Buscando...
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          <ul className="py-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                ref={el => suggestionItemsRef.current[index] = el}
              >
                <button
                  data-suggestion-button
                  onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTimeout(() => onSelect(suggestion), 0);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 ${index === selectedIndex ? 'bg-gray-50 border-l-4 border-primary' : ''}`}
                  type="button"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    {suggestion.image ? (
                      <img
                        src={`/api/items/media/${suggestion.image}`}
                        alt={suggestion.name}
                        className="w-full h-full object-cover"
                        onError={e => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center customtext-neutral-dark">
                        <Search size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium customtext-neutral-dark truncate">
                      {highlightMatches(suggestion.name, search)}
                    </div>
                    {suggestion.category && (
                      <div className="text-sm customtext-neutral-dark truncate">
                        {suggestion.category.name}
                      </div>
                    )}
                    {suggestion.final_price && suggestion.final_price > 0 && (
                      <div className="text-sm font-semibold customtext-primary">
                        {CurrencySymbol()} {parseFloat(suggestion.final_price).toFixed(2)}
                      </div>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center customtext-neutral-dark">
            No se encontraron productos
          </div>
        )}
      </motion.div>
    );
  };

  const menuPages = pages || [];
  const topBarType = data?.type_topbar && data.type_topbar !== 'none'
    ? data.type_topbar
    : 'TopBarSimple';

  return (
    <header id={data?.element_id || null} className="relative w-full z-[100]">
      <div className="relative z-50 w-full transition-all duration-300">
        <TopBar
          which={topBarType}
          data={data}
          items={items}
          generals={generals}
          cart={cart}
          setCart={setCart}
          isUser={isUser}
          pages={menuPages}
        />
      </div>
      <div className="relative z-50 px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-4 font-paragraph customtext-primary text-base font-semibold">
        {/* Mobile: [hamburguesa][logo centrado] + search en fila propia.
            lg+: [logo][nav centrada][search] en 3 columnas, sin hamburguesa. */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 gap-y-4 lg:gap-6">

          {/* Hamburguesa - solo mobile */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            className="row-start-1 col-start-1 justify-self-start lg:hidden -ml-2 p-2 transition-transform duration-300 active:scale-90"
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>

          {/* Logo */}
          <a
            href="/"
            className="row-start-1 col-start-2 justify-self-center lg:col-start-1 lg:justify-self-start flex items-center gap-2 shrink-0"
          >
            <img src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`} alt={Global.APP_NAME} className={`h-11 lg:h-14 object-contain object-center ${data?.class_logo || ""}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/img/logo-bk.svg';
              }} />
          </a>

          {/* Nav - solo desktop */}
          <ul className="hidden lg:flex lg:row-start-1 lg:col-start-2 lg:justify-self-center list-none gap-4 text-lg min-w-0">
            {menuPages.map((page, index) => (
              page.menuable && ( // Simplified conditional rendering
                <li key={index} className="py-3">
                  <a href={page.path} className="hover:customtext-primary cursor-pointer transition-all duration-300 pr-6  ">
                    {page.name}
                  </a>
                </li>
              )
            ))}
          </ul>

          {/* Search Bar - fila 2 en mobile, columna 3 en desktop */}
          <div className="col-span-3 col-start-1 row-start-2 lg:col-start-3 lg:row-start-1 w-full lg:max-w-sm justify-self-stretch lg:justify-self-end">
            <div className="relative w-full">
              <form onSubmit={handleFormSubmit} role="search">
                <input
                  ref={desktopSearchInputRef}
                  type="search"
                  name="search"
                  placeholder={data?.input_search_placeholder || "Buscar productos"}
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    setIsMenuOpen(false);
                    if (search.trim().length >= 2) {
                      fetchSearchSuggestions(search);
                    }
                  }}
                  className={`w-full pr-14 py-3 pl-4 lg:py-4 lg:pl-6 border rounded-full focus:ring-0 focus:outline-none placeholder:customtext-primary ${data?.input_search_class || ""}`}
                  enterKeyHint="search"
                  inputMode="search"
                  autoComplete="on"
                  role="searchbox"
                  aria-label={data?.input_search_placeholder || "Buscar productos"}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-full hover:scale-105 transition-all duration-300"
                  aria-label="Buscar"
                >
                  <Search />
                </button>
              </form>
              <AnimatePresence>
                <SearchSuggestions
                  suggestions={searchSuggestions}
                  isLoading={isLoadingSuggestions}
                  onSelect={selectSuggestion}
                  selectedIndex={selectedSuggestionIndex}
                />
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* Menu mobile - panel flotante fuera de flujo: no desplaza el contenido.
          Backdrop + panel se animan con opacity/translate (sin layout shift). */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/20"
              aria-hidden="true"
            />

            <motion.nav
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="lg:hidden absolute top-full left-0 right-0 z-50 px-primary pb-4"
            >
              <ul className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden list-none flex flex-col divide-y divide-gray-100 max-h-[65vh] overflow-y-auto">
                {menuPages.map((page, index) => (
                  page.menuable && (
                    <li key={index}>
                      <a
                        href={page.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between gap-3 px-5 py-4 text-base font-semibold customtext-neutral-dark hover:bg-gray-50 hover:customtext-primary active:bg-gray-100 transition-colors duration-200"
                      >
                        {page.name}
                        <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                      </a>
                    </li>
                  )
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
export default HeaderSearchMenu;
