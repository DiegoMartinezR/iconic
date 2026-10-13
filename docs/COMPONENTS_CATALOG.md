# CATALOGO DE COMPONENTES (generado desde storage/app/components.json)

> Generado automaticamente. Fuente de verdad = `storage/app/components.json`.
> Un **tipo** (`id` del grupo) = el `switch (component)` de `resources/js/System.jsx`.
> Una **opcion** (`options[].id`) = el `case (which)` del dispatcher de ese tipo.
> `model` = tabla que consulta `SystemController` para entregar `items` al componente.
> `data` = campos editables en el admin (se guardan en `systems.data`).
> `generals` = llaves de la tabla `generals` que el componente necesita.

Totales: 60 tipos, 393 opciones.

## top_bar — Cintillo (9 opciones)

- **TopBarSimple** — Simple - Stech | model: - | rel: - | data(2): class_content, class_text | generals: cintillo
- **TopBarSocials** — Con redes sociales | model: Social | rel: - | data(6): background_color, color, class_copyright, class_icon, isCopyright, border_color | generals: cintillo, copyright
- **TopBarPages** — Con páginas | model: Social | rel: - | data(6): background_color, color, isCopyright, border_color, pages_mobile, cintillo_mobile | generals: cintillo
- **TopBarCart** — Con Carrito | model: Social | rel: - | data(1): link_cart | generals: cintillo
- **TopBarCopyright** — Copyright | model: - | rel: - | data(3): class_container, showJobApplicationButton, creditPapayaDigital | generals: copyright
- **TopBarPanni** — Paani con redes sociales | model: Social | rel: - | data(4): background_color, color, isCopyright, border_color | generals: support_phone, support_email, cintillo
- **TopBarAddress** — Con dirección y WhatsApp | model: - | rel: - | data(3): class_content, class_address, class_button | generals: address, whatsapp_advisors
- **TopBarMarquee** — Marquee - Sticky (Premium) | model: - | rel: - | data(1): class_content | generals: cintillo
- **TopBarStoreMode** — Store Mode - Belleza Central | model: Store | rel: - | data(4): label, label_nacional, show_phone, class_content | generals: -

## menu — Menu (7 opciones)

- **MenuSimple** — Menu - Stech | model: Category | rel: subcategories | data(1): showCategories | generals: -
- **MenuMicjc** — Menu - Micjc (Doble Panel Premium) | model: Category | rel: subcategories | data(1): showCategories | generals: -
- **MenuMultivet** — Menu - Multivet | model: Category | rel: subcategories | data(15): showCategories, description, icon, class_container, type_order, cardType, show_categories, button_top, button_bottom, badge_offer_percent ... (+5) | generals: -
- **MenuCategories** — Menu - Categorías | model: Category | rel: subcategories | data(0): - | generals: -
- **MenuBananaLab** — Menu - Banana Lab | model: Category | rel: subcategories | data(0): - | generals: -
- **MenuExpertFarma** — Menu - Expert Farma | model: Category | rel: subcategories | data(2): showCategories, backgroundColor | generals: -
- **MenuKatya** — Menu - Katya | model: Category | rel: subcategories | data(1): showCategories | generals: - | filters=[featured] limit=5

## header — Header (22 opciones)

- **HeaderSearchB** — HeaderSearchB | model: Category | rel: subcategories | data(41): class, link_cart, showLoginCart, mobileSearch, backgroundColor, class_logo, input_search_placeholder, input_search_label, input_search_class, type_order ... (+31) | generals: phone_whatsapp, message_whatsapp, cintillo
- **HeaderIbergruas** — HeaderIbergruas | model: Category | rel: subcategories | data(9): class, link_cart, showLoginCart, mobileSearch, backgroundColor, class_logo, input_search_placeholder, input_search_label, input_search_class | generals: phone_whatsapp, message_whatsapp, header_menu_order 
- **HeaderSearchKatya** — HeaderSearchKatya | model: Category | rel: subcategories | data(6): class, link_cart, showLoginCart, mobileSearch, backgroundColor, class_logo | generals: phone_whatsapp, message_whatsapp, opening_hours, support_phone
- **HeaderPidelo** — HeaderPidelo | model: Store | rel: - | data(5): class, link_cart, showLoginCart, mobileSearch, backgroundColor | generals: phone_whatsapp, message_whatsapp
- **HeaderSearchDental** — HeaderSearchDental | model: Category | rel: subcategories | data(8): class, class_text, link_cart, showLoginCart, mobileSearch, backgroundColor, topBarType, class_pedido | generals: phone_whatsapp, message_whatsapp
- **HeaderMakita** — HeaderMakita | model: Item | rel: category+subcategory+brand+collection+variants | data(3): class, link_cart, showLoginCart | generals: phone_whatsapp, message_whatsapp
- **HeaderSearchContact** — Header - Kuchara | model: - | rel: - | data(3): class, link_cart, path_product | generals: phone_whatsapp, message_whatsapp
- **HeaderSearchMenu** — Con busqueda y menu | model: - | rel: - | data(24): class, class_logo, input_search_placeholder, input_search_class, type_topbar, class_logo, class_content, class_text, background_color, color ... (+14) | generals: cintillo
- **HeaderSearchMenuSF** — Con busqueda y menu SF | model: Category | rel: subcategories | data(6): class_content, class_text, class, link_cart, type_topbar, is_ecommerce | generals: cintillo
- **HeaderBananaLab** — Header - Banana Lab | model: Category | rel: subcategories | data(2): class, link_cart | generals: phone_whatsapp, message_whatsapp
- **HeaderSimple** — Header - Simple | model: Category | rel: subcategories | data(2): class, link_cart | generals: phone_whatsapp, message_whatsapp, email_contact
- **HeaderHuaillys** — Header - Huaillys | model: - | rel: - | data(5): class, class_logo, class_menu, class_link, class_link_mobile | generals: address
- **HeaderFirstClass** — Header - FirstClass Courier | model: ServiceCategory | rel: services | data(5): class, class_logo, class_menu, class_link, class_link_mobile | generals: phone_whatsapp, message_whatsapp, address
- **HeaderLaPetaca** — Header - La Petaca Hotel | model: - | rel: - | data(5): menuItems, logo, logoAlt, bgColor, accentColor | generals: -
- **HeaderWebQuirurgica** — Header - Web Quirurgica | model: ServiceCategory | rel: services | data(6): type_header, logoWidth, menu_button, ctaText, ctaLink, footerText | generals: header_menu_order, footer_company_links
- **HeaderWebQuirurgica2** — Header - Web Quirurgica 2 | model: ServiceCategory | rel: services | data(5): logoWidth, ctaText, ctaLink, class_cta_button, footerText | generals: header_menu_order
- **HeaderSticky** — Header Sticky Rainstarstore | model: - | rel: - | data(2): class, type_topbar | generals: whatsapp_advisors, email_contact, phone_contact, opening_hours, cintillo
- **HeaderMiBalon** — Header Mi Balón | model: - | rel: - | data(1): class | generals: whatsapp_advisors, email_contact, phone_contact, opening_hours
- **HeaderTwenty** — Header Twenty | model: Category | rel: subcategories | data(14): class, link_cart, showLoginCart, mobileSearch, backgroundColor, class_logo, input_search_placeholder, input_search_label, input_search_class, type_modal_cart ... (+4) | generals: phone_whatsapp, message_whatsapp, cintillo
- **HeaderFimesac** — Header Fimesac | model: - | rel: - | data(1): class | generals: -
- **HeaderNgs** — Header NGS Solutions | model: Category | rel: subcategories | data(1): class | generals: phone_whatsapp, whatsapp_advisors, email_contact
- **HeaderRhino** — Header - Rhino Glassmorphism | model: Service | rel: category | data(9): type_topbar, class_container, logo, logo_alt, bg_color, accent_color, cta_text, cta_link, link_cart | generals: phone_whatsapp, whatsapp_advisors, email_contact, support_email, address, cintillo, header_menu_order

## floating — Flotantes (2 opciones)

- **WhatsApp** — WhatsApp | model: - | rel: - | data(1): class_section | generals: whatsapp_advisors
- **WhatsAppSeller** — WhatsApp (Vendedor) | model: - | rel: - | data(0): - | generals: whatsapp_advisors

## bottombar — Barra inferior móvil (1 opciones)

- **BottomBarTwenty** — Bottom Bar Twenty (Estilo App) | model: - | rel: - | data(1): link_catalog | generals: -

## carrusel — Carrusel (8 opciones)

- **CarruselBenefitsInifinite** — Beneficios | model: Indicator | rel: - | data(4): background, class_container, class_content_swiper, class_divisor | generals: -
- **CarruselBenefitsInifinite2dn1** — CarruselBenefitsInifinite2dn1 | model: Indicator | rel: - | data(1): background | generals: -
- **CarruselBenefitsPaani** — Beneficios Paani | model: Indicator | rel: - | data(0): - | generals: -
- **CarruselBenefitsSimple** — Beneficios Simple | model: Indicator | rel: - | data(3): background, class_title, class_content | generals: -
- **CarruselBananaLab** — CarruselBananaLab | model: Indicator | rel: - | data(1): background | generals: -
- **CarruselBenefitsSwiper** — Beneficios Simple Swiper | model: Indicator | rel: - | data(1): background | generals: -
- **CarruselBenefitsMultivet** — Beneficios Multivet | model: Indicator | rel: - | data(13): background, background_image, overlay, title, subtitle, description, accent_color, accent_bg, class_title, class_description ... (+3) | generals: -
- **CarruselNgs** — Métricas / Indicadores NGS | model: Indicator | rel: - | data(1): background | generals: -

## slider — Sliders (14 opciones)

- **SliderInteractive** — Interactivo Loop Nav Pag | model: Slider | rel: - | data(16): class_slider_section, class_slider, class_slider_container, bool:infiniteLoop, paginationAlignment, bool:showNavigation, bool:showPagination, paginationVariant, navigationVariant, navigationShape ... (+6) | generals: phone_whatsapp, message_whatsapp
- **SliderFimesac** — Slider Fimesac | model: Slider | rel: - | data(5): class, bool:infiniteLoop, bool:showNavigation, bool:showPagination, bool:animation_slider | generals: -
- **SliderMultivet** — Slider Multivet | model: Slider | rel: - | data(14): infiniteLoop, paginationAlignment, showNavigation, imageBgPosition, overlayMobile, overlayMobileDark, whatsapp_info, class_button_primary, class_icon_primary, class_title ... (+4) | generals: phone_whatsapp, message_whatsapp
- **SliderIbergruas** — Slider Ibergruas | model: Slider | rel: - | data(3): class_container, class_button_primary, class_button_secondary | generals: phone_whatsapp, message_whatsapp
- **SliderProductBannerKatya** — Slider Productos con Banner - Katya | model: Item | rel: - | data(6): title, subtitle, backgroundColor, textColor, autoPlay, autoPlayInterval | generals: phone_whatsapp, message_whatsapp | filters=[featured]
- **SliderBananaLab** — SliderBananaLab | model: Slider | rel: - | data(0): - | generals: -
- **SliderPideloPe** — SliderPideloPe | model: Slider | rel: - | data(0): - | generals: -
- **SliderBrandsPaani** — Brand Paani | model: Brand | rel: - | data(1): title | generals: -
- **SliderLaPetaca** — Slider - La Petaca Hotel | model: Slider | rel: - | data(17): animation_slider, autoplayDelay, showNavigation, showIndicators, class_slider, class_slider_section, class_content_slider, class_title, class_description, class_buttons_container ... (+7) | generals: -
- **SliderLaPetacaContact** — Slider con Contacto - La Petaca Hotel | model: Slider | rel: - | data(19): animation_slider, autoplayDelay, showNavigation, showIndicators, class_slider, class_slider_section, class_content_slider, class_title, class_description, class_buttons_container ... (+9) | generals: atalaya_leads_api_key
- **SliderPremium** — Slider Premium Rainstarstore | model: Slider | rel: - | data(4): class, class_slider_section, class_slider, autoplayDelay | generals: -
- **SliderNgs** — Slider Hero NGS Solutions | model: Slider | rel: - | data(6): class, bool:infiniteLoop, bool:showNavigation, bool:showPagination, bool:animation_slider, bool:show_form | generals: phone_whatsapp
- **HeroRhino** — Hero - Rhino Universo Tech | model: Slider | rel: - | data(5): class, bool:infiniteLoop, bool:showNavigation, bool:showPagination, bool:animation_slider | generals: phone_whatsapp
- **SliderTwenty** — Slider Twenty - Streetwear Hero | model: Slider | rel: - | data(11): class_slider_section, class_slider, class_slider_container, bool:infiniteLoop, bool:showNavigation, bool:showPagination, bool:animation_slider, imageBgPosition, class_button_primary, class_title ... (+1) | generals: -

## filter — Filtros (15 opciones)

- **FilterSimple** — Simple | model: Item | rel: - | data(4): path, title, description, link_cart | generals: -
- **CatalagoFiltros** — Producto Catalogo Filtro | model: - | rel: - | data(10): path, title, description, link_cart, class_button, is_short_description, class_card_image, class_card_title, class_card_subtitle, class_card_description | generals: - | subopciones=default|with_variants
- **CatalogoIbergruas** — Producto Catalogo Ibergruas | model: - | rel: - | data(10): path, title, description, link_cart, class_button, is_short_description, class_card_image, class_card_title, class_card_subtitle, class_card_description | generals: - | subopciones=default|with_variants
- **CatalogoFiltrosDental** — Producto Catalogo Filtro Dental | model: - | rel: - | data(21): class_title, title, class_sort_options, section_collections, section_brands, section_categories, section_subcategories, section_amenities, dat_prices, section_prices ... (+11) | generals: - | subopciones=default|with_variants
- **CatalogoFiltrosTwenty** — Catálogo de Productos Twenty (Streetwear) | model: - | rel: - | data(13): class_title, title, description, class_sort_options, section_collections, section_brands, section_categories, section_subcategories, section_prices, dat_prices ... (+3) | generals: - | subopciones=default
- **CatalogoFiltrosMiBalon** — Producto Catalogo Filtro MiBalon | model: - | rel: - | data(24): variant, class_title, title, class_sort_options, section_collections, section_brands, section_categories, section_subcategories, section_amenities, dat_prices ... (+14) | generals: - | subopciones=default|with_variants
- **CatalogoFiltrosKatya** — Producto Catalogo Filtro Katya | model: - | rel: - | data(15): path, title, description, link_cart, class_button, show_price, section_collections, section_brands, section_categories, section_subcategories ... (+5) | generals: - | subopciones=default|with_variants
- **CatalagoFiltrosAko** — Producto Catalogo Filtro - Ako | model: - | rel: - | data(4): path, title, description, link_cart | generals: - | subopciones=default|with_variants
- **CatalagoFiltrosPaani** — Producto Catalogo Filtro - Paani | model: - | rel: - | data(6): path, title, description, link_cart, background, backgroundboton | generals: - | subopciones=default|with_variants
- **CatalogoFiltrosRainstar** — Producto Catalogo Filtro - Belleza Central / Rainstar | model: - | rel: - | data(17): path, title, description, link_cart, background, backgroundboton, bool:section_categories, bool:section_subcategories, bool:section_brands, bool:section_collections ... (+7) | generals: - | subopciones=default
- **CatalagoFiltrosPaani** — Producto Catalogo Filtro - Paani | model: - | rel: - | data(6): path, title, description, link_cart, background, backgroundboton | generals: - | subopciones=default|with_variants
- **FilterSalaFabulosa** — Filtro SalaFabulosa | model: - | rel: - | data(8): path, title, description, link_cart, collection, category, brand, color | generals: - | subopciones=default|with_variants
- **FilterBananaLab** — Filtro FilterBananaLab | model: - | rel: - | data(5): path, title, description, link_cart, show_price | generals: - | subopciones=default|with_variants
- **FilterCategoryImage** — Categoría con Imagen | model: - | rel: - | data(3): path, title, card | generals: - | subopciones=default|with_variants
- **FilterHuaillys** — FilterHuaillys - Pollería Huaillys | model: - | rel: - | data(20): variant, type_category_card, background_image, hero_title, hero_subtitle, category_title, category_description, product_title, product_description, button_text ... (+10) | generals: - | subopciones=default

## category — Categorías (18 opciones)

- **CategoryTwenty** — Carousel de Categorías Twenty (Streetwear) | model: Category | rel: - | data(7): path, title, badge, description, bg_class, class_title, class_container | generals: -
- **CategoryNgs** — Categorías NGS Solutions | model: Category | rel: subcategories | data(5): class, title, subtitle, badge, description | generals: -
- **CategorySimple** — Simple | model: Category | rel: - | data(1): path | generals: - | limit=10
- **CategoryOneLine** — Una Linea | model: Category | rel: - | data(1): path | generals: -
- **CategoryPrettyGrid** — Pretty Grid | model: Category | rel: - | data(4): path, borderRadius, title, class_section | generals: - | filters=[featured,ignoreVisibility] limit=3
- **InfiniteCategory** — category-infinito | model: Category | rel: - | data(3): title, path, backgroundColor | generals: - | limit=10
- **CategoryPidelo** — category-pidelo | model: Category | rel: - | data(3): title, path, backgroundColor | generals: - | limit=10
- **CategoryInfiniteSlider** — Slider Infinito con Hover | model: Category | rel: - | data(4): title, description, path, link_catalog | generals: -
- **PaginationCategory** — paginacion | model: Category | rel: - | data(2): title, path | generals: - | limit=10
- **CategoryCarousel** — Carousel | model: Category | rel: - | data(4): path, title, description, link_catalog | generals: - | filters=[featured] limit=10
- **CategoryBoxSwiper** — Carousel Category Box | model: Category | rel: - | data(4): path, title, description, link_catalog | generals: - | filters=[featured] limit=10
- **CategoryFlex** — Flex | model: Category | rel: - | data(5): path, title, description, text_button, link_catalog | generals: - | filters=[featured]
- **CategoryGridInfinite** — CategoryGridInfinite | model: Category | rel: - | data(6): path, title, description, link_catalog, class_title, class_container | generals: - | filters=[featured]
- **CategoriesScraping** — CategoriesScraping | model: Category | rel: - | data(4): path, title, description, link_catalog | generals: - | filters=[featured] limit=10
- **CategoryMosaic** — Mosaico Editorial Rainstarstore (3 slots) | model: Category | rel: - | data(1): class | generals: - | limit=3
- **CategoryMosaicMiBalon** — Mosaico Deportivo Mi Balón (3 slots) | model: Category | rel: - | data(4): title, class_container, class_title, class_description | generals: - | limit=3
- **CategoryBannerMicjc** — Banner Tecnológico - Micjc (1-6 categorías) | model: Category | rel: - | data(4): path, title, description, class_section | generals: - | filters=[featured] limit=6
- **CategoryFimesac** — Categorías Fimesac | model: Category | rel: - | data(3): path, title, class | generals: - | limit=8

## collection — Colecciones (1 opciones)

- **PaginationCollection** — paginacion | model: Collection | rel: - | data(6): title, centrado, path, shownavigation, showPagination, paginationAlignment | generals: - | filters=[featured] limit=20

## indicator — Indicadores (11 opciones)

- **IndicatorTwenty** — Indicadores Twenty (Distressed / Streetwear) | model: Indicator | rel: - | data(1): class | generals: -
- **IndicatorRainstar** — Editorial Premium Indicators | model: Indicator | rel: - | data(1): class | generals: -
- **IndicatorSimple** — Simple | model: Indicator | rel: - | data(0): - | generals: -
- **IndicatorIbergruas** — IndicatorIbergruas | model: Indicator | rel: - | data(0): - | generals: -
- **IndicatorHuaillys** — Indicator - Huaillys | model: Indicator | rel: - | data(10): class, url_background, url_image, class_chicken, class_icon, class_title, class_description, class_whatsapp_text, class_whatsapp_number, class_whatsapp_subtitle | generals: phone_whatsapp
- **IndicatorLaPetaca** — Indicadores - La Petaca Hotel | model: Indicator | rel: - | data(3): accentColor, showDirectBooking, class_section | generals: -
- **IndicatorHostinfinity** — Indicadores - Hostinfinity (Stats Grid) | model: Indicator | rel: - | data(6): title, description, class_section, class_title, class_description, class_indicators_card | generals: -
- **IndicatorHostinfinityImage** — Indicadores - Hostinfinity (Stats Grid) Image | model: Indicator | rel: - | data(6): title, description, class_section, class_title, class_description, class_indicators_card | generals: -
- **IndicatorFimesac** — Indicadores Fimesac | model: Indicator | rel: - | data(1): class | generals: -
- **IndicatorNgs** — Indicadores NGS Solutions | model: Indicator | rel: - | data(1): class | generals: -
- **IndicatorRhino** — Indicadores - Rhino Technology | model: Indicator | rel: - | data(3): background, class_content, class_title | generals: -

## product — Productos (31 opciones)

- **ProductCardHybrid** — Producto Card Híbrido Belleza Central | model: Item | rel: category+subcategory+brand+images | data(6): title, subtitle, button_text, class_section, class_card, show_store_selector | generals: - | filters=[featured,offering,is_new] limit=12
- **ProductGridRainstar** — Grid Editorial Premium Rainstar | model: Item | rel: category | data(6): title, button_text, button_link, bool:show_button, type_card_product, class | generals: - | filters=[featured,offering,is_new,most_view] limit=8
- **Carousel** — Carousel | model: Item | rel: category+subcategory+brand | data(7): path, title, description, link_catalog, button_text, bool:show_summary, link_cart | generals: - | filters=[featured,recommended,offering,is_new] limit=10
- **List** — Listado | model: Item | rel: - | data(5): path, title, description, link_catalog, link_cart | generals: - | filters=[featured,recommended,offering,is_new] limit=8 filterByRelation=category
- **ProductSlider** — Slider | model: Item | rel: - | data(7): path, title, description, link_catalog, link_cart, background_color, text_color | generals: - | filters=[featured,recommended,offering,is_new]
- **ProductInfinite** — Producto Infinito | model: Item | rel: category+subcategory+brand | data(13): title, path, description, link_catalog, link_cart, class_header, class_content, class_button, class_card_title, class_card_image ... (+3) | generals: - | filters=[featured,recommended,offering,is_new,views,most_view] limit=12
- **ProductFimesac** — Productos Fimesac | model: Item | rel: category+subcategory+brand | data(6): title, description, subtitle, path, link_catalog, class | generals: - | filters=[featured,recommended,is_new,most_view] limit=12
- **ProductsNgs** — Productos NGS Solutions | model: Item | rel: category+subcategory+brand | data(6): title, description, subtitle, button_text, button_link, class | generals: - | filters=[featured,recommended,is_new,most_view] limit=12
- **ProductNgs** — Producto Grid NGS Solutions | model: Item | rel: category+subcategory+brand | data(6): title, description, subtitle, button_text, button_link, class | generals: - | filters=[featured,recommended,is_new,most_view] limit=12
- **ProductSwiperBanners** — Carrusel de Banners de Productos (ProductSwiperBanners) | model: Item | rel: category+subcategory+brand | data(6): title, bool:autoplay, bool:loop, class_section, class_title, class_image | generals: - | filters=[featured,recommended,offering,is_new,views,most_view] limit=12
- **ProductSwiperMiBalon** — Carrusel de Productos Mi Balón | model: Item | rel: category+subcategory+brand | data(10): title, description, link_catalog, type_card_product, bool:autoplay, bool:loop, bool:show_link_catalog, class_container, class_title, type_modal_cart | generals: - | filters=[featured,recommended,offering,is_new,views,most_view,is_master] limit=12
- **ProductSwiperTwenty** — Carrusel de Productos Twenty (Streetwear) | model: Item | rel: category+subcategory+brand+cardTags | data(14): title, title_line1, title_line2, badge, description, link_catalog, type_card_product, bool:autoplay, bool:loop, bool:show_link_catalog ... (+4) | generals: - | filters=[featured,recommended,offering,is_new,views,most_view,is_master] limit=8
- **ProductIbergruas** — ProductIbergruas | model: Item | rel: category+subcategory+brand | data(5): title, path, description, link_catalog, link_cart | generals: - | filters=[featured,recommended,offering,is_new,views,most_view] limit=12
- **ProductMakita** — ProductMakita | model: Item | rel: category+subcategory+brand | data(5): title, path, description, link_catalog, link_cart | generals: - | filters=[featured,recommended,offering,is_new,views,most_view] limit=10
- **ProductMultivet** — Product Multivet | model: Item | rel: category+subcategory+brand | data(17): title, class_title, description, link_catalog, text_button, class_section, class_button, cardType, show_categories, button_top ... (+7) | generals: - | filters=[featured,recommended,offering,is_new] limit=12
- **ProductIbergruasSwiper** — Product Ibergruas Swiper | model: Item | rel: category+subcategory+brand | data(5): title, description, link_catalog, class_button, class_content_header | generals: - | filters=[featured,recommended,offering,is_new] limit=12
- **ProductNavigation** — Navegacion | model: Item | rel: category+subcategory+brand | data(5): title, path, description, link_catalog, link_cart | generals: - | filters=[featured,recommended,offering,is_new,views,most_view] limit=8
- **ProductNavigationSwiper** — NavegacionSwiper | model: Item | rel: category+subcategory+brand+variants | data(5): title, path, description, link_catalog, link_cart | generals: - | filters=[featured,recommended,offering,is_new,views,most_view] limit=20
- **ProductNavigationSwiperSimple** — NavegacionSwiper Simple | model: Item | rel: category+subcategory+brand | data(5): title, path, description, link_catalog, link_cart | generals: - | filters=[featured,recommended,offering,is_new,views,most_view] limit=20
- **ProductFeaturedSwiper** — Navegacion Swiper Featured | model: Item | rel: category+subcategory+brand+specifications+amenities | data(5): title, path, description, link_catalog, link_cart | generals: - | filters=[featured,recommended,offering,is_new,views,most_view] limit=20
- **ProductFeaturedVerticalSlider** — Producto Destacado con Slider Vertical | model: Item | rel: category+subcategory+brand | data(2): title, description | generals: - | filters=[featured,recommended,offering,is_new] limit=10
- **ProductInfiniteSlider** — Slider Infinito de Productos | model: Item | rel: category+subcategory+brand | data(5): title, description, path, link_catalog, link_text | generals: - | filters=[featured,recommended,offering,is_new]
- **ProductBananaLab** — ProductBananaLab | model: Item | rel: category+subcategory+brand | data(15): style_offer, support_favorite, title, class_title, path, description, text_button, link_catalog, link_cart, class_button_primary ... (+5) | generals: - | filters=[featured,recommended,offering,is_new,views,most_view] limit=12
- **Scraping** — Scraping Simple | model: Item | rel: category+subcategory+brand | data(0): - | generals: - | filters=[featured,recommended,offering,is_new] limit=8
- **ProductLaPetaca** — Productos - La Petaca Hotel | model: Item | rel: category+subcategory+brand+images+amenities | data(5): rooms, showFeatured, accentColor, title, subtitle | generals: - | filters=[featured,recommended,offering,is_new] limit=8
- **ProductListPanelPro** — Productos - Panel Pro | model: Item | rel: category+subcategory+brand+images+features+amenities+specifications+attributes+applications | data(3): title, subtitle, description | generals: whatsapp_advisors | filters=[featured,recommended,offering,is_new,is_master]
- **ProductListCardPanelPro** — Productos - Card Panel Pro | model: Item | rel: category+subcategory+brand+images+features+amenities+specifications+attributes+applications | data(3): title, subtitle, description | generals: whatsapp_advisors, items.file_catalogo_url | filters=[featured,recommended,offering,is_new,is_master]
- **ProductListHostinfinity** — Productos - Hostinfinity (SaaS) | model: Item | rel: category+subcategory+brand+images+features+attributes | data(7): insert_html_content, title, subtitle, description, class, show_all_link, all_link | generals: - | filters=[featured,recommended,offering,is_new] limit=12
- **ProductListHostinfinityFilter** — Productos - Hostinfinity Filter (SaaS) | model: Item | rel: category+subcategory+brand+images+features+attributes | data(7): badge, title, subtitle, description, class, show_all_link, all_link | generals: - | filters=[featured,recommended,offering,is_new,category_id,subcategory_id,brand_id] limit=24
- **ProductFimesac** — Productos Fimesac | model: Item | rel: category+brand | data(4): title_recommended, title_new, path, class | generals: - | filters=[featured,recommended,is_new,most_view] limit=12
- **ProductsNgs** — Grid Productos Destacados NGS | model: Item | rel: category+brand | data(4): title, subtitle, button_text, button_link | generals: - | filters=[featured] limit=8

## banner — Banners (30 opciones)

- **BannerSimple** — Simple | model: - | rel: - | data(9): variant, bool:overlay, class_section, class_container, class_title, class_description, class_button, class_overlay, btn_secondary | generals: -
- **BannerSimpleD2** — Simple D2en1 | model: - | rel: - | data(0): - | generals: -
- **BannerAd** — Anuncio | model: - | rel: - | data(1): background_color | generals: -
- **BannerPidelo** — BannerPidelo | model: - | rel: - | data(2): btn_secondary, overlay | generals: -
- **BannerPublicitario** — BannerPublicitario | model: - | rel: - | data(7): title, image_position, class_content, class_image, class_right, class_button, class_content_right | generals: -
- **BannerPublicitarioKatya** — BannerPublicitarioKatya | model: - | rel: - | data(7): title, image_position, class_content, class_image, class_right, class_button, class_content_right | generals: -
- **BannerPublicitarioPaani** — BannerPublicitarioPaani | model: - | rel: - | data(2): title, image_position | generals: -
- **BannerCTAMakita** — BannerCTAMakita | model: Strength | rel: - | data(0): - | generals: -
- **BannerContactMakita** — BannerContactMakita | model: - | rel: - | data(2): title, image_position | generals: -
- **BannerPostSuscriptionPaani** — BannerPostSuscriptionPaani | model: Post | rel: - | data(3): title, text_button, link_button | generals: - | limit=2
- **BannerFullWidth** — Full Width | model: - | rel: - | data(1): bool:rounded_button | generals: -
- **BannerFlex** — Flex | model: - | rel: - | data(0): - | generals: -
- **BannerIbergruas** — BannerIbergruas | model: - | rel: - | data(2): title, subtitle | generals: -
- **BannerStatic** — Estatico | model: Aboutus | rel: - | data(0): - | generals: -
- **BannerStaticSecond** — Banner Certificaciones | model: Certification | rel: - | data(6): title, subtitle, description, class_section, class_title, class_description | generals: -
- **BannerSimpleSF** — SimpleSF | model: - | rel: - | data(0): - | generals: -
- **BannerMultivet** — Banner Multivet | model: - | rel: - | data(13): class_section, class_container, class_content, class_title, class_description, class_button, image_position, show_image_overlay, show_decorations, decoration_color ... (+3) | generals: -
- **BannerFimesac** — Banner Fimesac (Fondo Imagen) | model: - | rel: - | data(6): class_section, class_container, class_content, class_title, class_description, class_button | generals: -
- **BannerFimesacContact** — Banner con Formulario de Contacto (BannerFimesacContact) | model: - | rel: - | data(9): form_title, form_description, subtitle, class_section, class_container, class_content, class_title, class_description, class_button | generals: atalaya_leads_api_key
- **BannerBlogSectionKatya** — BannerBlogSectionKatya | model: Post | rel: category | data(0): - | generals: - | limit=2
- **BannerBananaLab** — BannerBananaLab | model: - | rel: - | data(0): - | generals: -
- **BannerMobileApp** — Banner Mobile App - FirstClass | model: App | rel: - | data(7): class_section, class_container, class_content, class_title, class_description, class_stats, class_phone_mockup | generals: -
- **BannerAboutStats** — About con Estadísticas - WebQuirurgica | model: Indicator | rel: - | data(4): class, class_title, class_indicators_card, class_indicators_icon | generals: -
- **BannerAboutStatsPanelPro** — About con Estadísticas - Panel Pro | model: Indicator | rel: - | data(4): class, class_title, class_indicators_card, class_indicators_icon | generals: -
- **BannerPremiumCampaign** — Banner Premium Campaña (Llamada a la Acción) | model: - | rel: - | data(1): class | generals: -
- **BannerMiBalon** — Banner Destacado Mi Balón | model: - | rel: - | data(4): bool:show_gradient, class_title, class_button, class | generals: -
- **BannerJustImageMicjc** — Banner Solo Imagen (BannerJustImageMicjc) | model: - | rel: - | data(3): background, button_link, class | generals: -
- **BannerProductSwiperMiBalon** — Banner + Carrusel Mi Balón | model: Item | rel: category+subcategory+brand | data(7): background, bool:image_right, type_card_product, bool:autoplay, bool:loop, class_container, type_modal_cart | generals: - | filters=[featured,recommended,offering,is_new,views,most_view,is_master] limit=12
- **BannerNgs** — Banner Destacado NGS Solutions | model: - | rel: - | data(4): bool:show_overlay, class, class_title, class_button | generals: -
- **BannerHeaderRhino** — Banner Cabecera / Hero Landing Rhino | model: - | rel: - | data(4): class_section, class_container, class_title, class_button | generals: -

## image — Imágenes (1 opciones)

- **ImageSimple** — Simple | model: - | rel: - | data(2): image, aspect_ratio | generals: -

## step — Steps (2 opciones)

- **StepSimple** — Simple | model: - | rel: - | data(2): steps, selected | generals: -
- **StepKuchara** — Kuchara | model: - | rel: - | data(2): steps, selected | generals: -

## product-detail — Detalle de producto (22 opciones)

- **ProductDetailSimple** — Simple | model: Item | rel: category+subcategory+brand | data(0): - | generals: -
- **ProductDetailKuchara** — Kuchara | model: Item | rel: category | data(0): - | generals: -
- **ProductDetailB** — ProductDetailB | model: Item | rel: - | data(13): link_cart, class_button, class_header, class_content, related_title, related_description, related_class_container, related_class_title, related_filter, related_limit ... (+3) | generals: phone_whatsapp, message_whatsapp, delivery_policy
- **ProductDetailPaani** — ProductDetailPaani | model: Item | rel: - | data(3): link_cart, background, backgroundboton | generals: phone_whatsapp, message_whatsapp
- **ProductDetailDental** — ProductDetailDental | model: Item | rel: - | data(12): link_cart, background, backgroundboton, especification_tec, title, style_offer, background, class_button_primary, class_button, class_section ... (+2) | generals: phone_whatsapp, message_whatsapp
- **ProductDetailSF** — ProductDetailSF | model: Item | rel: variants+images+specifications+features+attributes, category+brand+subcategory | data(4): link_cart, button_buy, button_consultation, show_additional_info | generals: -
- **ProductDetailPidelo** — ProductDetailPidelo | model: Item | rel: variants+images+specifications+features, category+brand+subcategory | data(2): link_cart, class_badge | generals: -
- **ProductDetailAko** — ProductDetailAko | model: Item | rel: variants+images+specifications+features, category+brand+subcategory | data(1): link_cart | generals: -
- **ProductDetailBananaLab** — ProductDetailBananaLab | model: Item | rel: variants+images+specifications+features, category+brand+subcategory | data(0): - | generals: -
- **ProductDetailHibrido** — Producto híbrido - Belleza Central | model: Item | rel: - | data(2): whatsapp, class | generals: -
- **ProductDetailMultivet** — ProductDetailMultivet - Tienda de Mascotas | model: Item | rel: images+specifications, category+brand+subcategory | data(22): link_cart, background, buyButton, class_badge_category, title, type_style_list, class_title, description, link_catalog, text_button ... (+12) | generals: phone_whatsapp, message_whatsapp
- **ProductDetailIbergruas** — ProductDetailIbergruas - Ibergruas | model: Item | rel: images+specifications, category+brand+subcategory | data(3): link_cart, background, buyButton | generals: phone_whatsapp, message_whatsapp
- **ProductDetailKatya** — ProductDetailKatya | model: Item | rel: images+specifications, category+brand+subcategory | data(2): link_cart, background | generals: phone_whatsapp, message_whatsapp
- **ProductDetailHuaillys** — ProductDetailHuaillys - Pollería Huaillys | model: Item | rel: images+specifications+features, category+brand+subcategory | data(7): link_cart, background, product_type_list, title_related, description_related, link_text_related, button_text_related | generals: phone_whatsapp, message_whatsapp, address
- **ProductDetailRainstar** — ProductDetailRainstar - Variante | model: - | rel: - | data(2): link_cart, background | generals: phone_whatsapp, message_whatsapp, delivery_policy
- **ProductDetailFimesac** — ProductDetailFimesac - Industrial Fimesac | model: - | rel: - | data(2): link_cart, background | generals: phone_whatsapp, message_whatsapp, delivery_policy
- **ProductDetailNgs** — Detalle de Producto NGS Solutions | model: - | rel: - | data(2): link_cart, background | generals: phone_whatsapp, message_whatsapp, delivery_policy
- **ProductDetailMiBalon** — ProductDetailMiBalon | model: - | rel: - | data(18): link_cart, class_title, background, bool:buyButton, bool:cartButton, bool:showDeliveryPolicy, bool:show_whatsapp, bool:quoteButton, related_title, related_description ... (+8) | generals: phone_whatsapp, message_whatsapp, delivery_policy, payment_methods, payment_methods_title
- **ProductDetailMicjc** — Detalle de Producto Micjc | model: - | rel: - | data(18): link_cart, class_title, background, bool:buyButton, bool:cartButton, bool:showDeliveryPolicy, bool:show_whatsapp, bool:quoteButton, related_title, related_description ... (+8) | generals: phone_whatsapp, message_whatsapp, delivery_policy, payment_methods, payment_methods_title
- **ScrapingProductDetail** — ScrapingProductDetail | model: - | rel: - | data(0): - | generals: -
- **ProductDetailTwenty** — ProductDetailTwenty | model: - | rel: - | data(18): link_cart, class_title, background, bool:buyButton, bool:cartButton, bool:showDeliveryPolicy, bool:show_whatsapp, bool:quoteButton, related_title, related_description ... (+8) | generals: phone_whatsapp, message_whatsapp, delivery_policy
- **ProductDetailNgs** — Detalle de Producto NGS Solutions | model: Item | rel: category+subcategory+brand+images+specifications+features | data(1): class | generals: phone_whatsapp

## cart — Carrito (2 opciones)

- **CartSimple** — Simple | model: - | rel: - | data(2): url_catalog, url_checkout | generals: -
- **CartKuchara** — Kuchara | model: - | rel: - | data(2): url_catalog, url_checkout | generals: igv_checkout

## checkout — Checkout (9 opciones)

- **CheckoutCulqi** — Culqi | model: - | rel: - | data(1): url_thanks | generals: -
- **CheckoutKuchara** — Kuchara | model: DeliveryPrice | rel: - | data(1): url_thanks | generals: igv_checkout, checkout_culqi, checkout_culqi_name, checkout_culqi_public_key, checkout_dwallet, checkout_dwallet_qr, checkout_dwallet_name, checkout_dwallet_description, checkout_transfer, checkout_transfer_cci, checkout_transfer_name, checkout_transfer_description
- **CheckoutSteps** — Steps | model: - | rel: - | data(2): title, class_button | generals: importation_flete, importation_seguro, importation_derecho_arancelario, importation_derecho_arancelario_descripcion
- **CheckoutStepsPidelo** — StepsPidelo | model: - | rel: - | data(2): title, class_button | generals: importation_flete, importation_seguro, importation_derecho_arancelario, importation_derecho_arancelario_descripcion
- **CheckoutStepsSF** — StepsSF | model: - | rel: - | data(3): title, class_button, type_cart_item | generals: igv_checkout, checkout_culqi, checkout_culqi_name, checkout_culqi_public_key, checkout_dwallet, checkout_dwallet_qr, checkout_dwallet_name, checkout_dwallet_description, checkout_transfer, checkout_transfer_cci, checkout_transfer_name, checkout_transfer_description ... (+14)
- **CheckoutStepsRainstar** — Rainstar | model: - | rel: - | data(2): title, class_button | generals: igv_checkout, checkout_culqi, checkout_culqi_name, checkout_culqi_public_key, checkout_dwallet, checkout_dwallet_qr, checkout_dwallet_name, checkout_dwallet_description, checkout_transfer, checkout_transfer_cci, checkout_transfer_name, checkout_transfer_description ... (+10)
- **CheckoutStepsIbegruas** — StepsIbegruas | model: - | rel: - | data(2): title, class_button | generals: igv_checkout, checkout_culqi, checkout_culqi_name, checkout_culqi_public_key, checkout_dwallet, checkout_dwallet_qr, checkout_dwallet_name, checkout_dwallet_description, checkout_transfer, checkout_transfer_cci, checkout_transfer_name, checkout_transfer_description ... (+6)
- **CheckoutStepsRooms** — StepsRooms - Reservas de Habitaciones | model: - | rel: - | data(2): title, class_button | generals: igv_checkout, checkout_culqi, checkout_culqi_name, checkout_culqi_public_key, checkout_dwallet, checkout_dwallet_qr, checkout_dwallet_name, checkout_dwallet_description, checkout_transfer, checkout_transfer_cci, checkout_transfer_name, checkout_transfer_description ... (+8)
- **CheckoutStepsTwenty** — Checkout Twenty — Brutalist Dark | model: - | rel: - | data(3): title, class_button, type_cart_item | generals: igv_checkout, checkout_culqi, checkout_culqi_name, checkout_culqi_public_key, checkout_dwallet, checkout_dwallet_qr, checkout_dwallet_name, checkout_dwallet_description, checkout_transfer, checkout_transfer_cci, checkout_transfer_name, checkout_transfer_description ... (+15)

## contact — Contacto (12 opciones)

- **ContactSimple** — Simple | model: - | rel: - | data(1): redirect | generals: email_contact, phone_contact
- **ContactGrid** — Grid | model: - | rel: - | data(10): redirect, class_title, class_card_description, class_card_title, class_card_button, class_card_container, title_ubication, description_ubication, stores_support, description | generals: email_contact, phone_contact
- **ContactKatya** — Katya | model: - | rel: - | data(8): redirect, class_section, title, description, class_form_container, class_title, class_description, class_button_form | generals: email_contact, address, phone_contact, location, atalaya_leads_api_key
- **ContactMibalon** — ContactMiBalon | model: - | rel: - | data(8): redirect, class_section, title, description, class_form_container, class_title, class_description, class_button_form | generals: email_contact, address, phone_contact, location, atalaya_leads_api_key
- **ContactTwenty** — Contact Twenty (Streetwear) | model: - | rel: - | data(8): redirect, class_section, title, description, class_form_container, class_title, class_description, class_button_form | generals: email_contact, address, phone_contact, location, atalaya_leads_api_key
- **ContactRhino** — Contact Rhino — Rhino Technology | model: - | rel: - | data(10): redirect, class_section, title, description, class_form_container, class_title, class_description, class_button_form, bool:header_solid, bool:header_static | generals: email_contact, address, phone_contact, location, atalaya_leads_api_key
- **ContactHuaillys** — Contact Huaillys | model: - | rel: - | data(12): title, description, class_title, class_description, class_button, class_card_container, class_card_title, class_card_description, class_card_data, class_card_icon ... (+2) | generals: email_contact, phone_contact, address, location, opening_hours
- **ThankContact** — ThankContact | model: Social | rel: - | data(1): url_catalog | generals: -
- **ContactRainstar** — Contact Rainstar | model: - | rel: - | data(6): title, description, title_ubication, stores_support, bool:show_locations, redirect | generals: address, phone_contact, email_contact, opening_hours
- **ContactWebQuirurgica** — Contact WebQuirurgica - Diseño Limpio | model: Service | rel: - | data(2): class_opening_hours_container, class_form_container | generals: email_contact, phone_contact, address, opening_hours
- **ContactNgs** — Contacto NGS Solutions | model: - | rel: - | data(2): title, subtitle | generals: phone_whatsapp, email_contact, address, opening_hours, whatsapp_advisors
- **FinalCtaRhino** — CTA Final - Rhino Cotización Espacial | model: - | rel: - | data(5): title, subtitle, cta_button_text, estimate_modal_trigger, class_container | generals: phone_whatsapp, email_contact

## frame — Frame (2 opciones)

- **Simple** — Simple | model: - | rel: - | data(1): code:html | generals: -
- **Full** — Full Width | model: - | rel: - | data(1): code:html | generals: -

## faq — Faqs (9 opciones)

- **FaqSimple** — Simple | model: Faq | rel: - | data(4): title, class_card_container, class_faq_answer, class_title | generals: -
- **FaqMiBalon** — MiBalon | model: Faq | rel: - | data(4): title, class_card_container, class_faq_answer, class_title | generals: -
- **FaqTwenty** — Faq Twenty (Streetwear) | model: Faq | rel: - | data(5): title, description, class_card_container, class_faq_answer, class_title | generals: -
- **FaqRhino** — FAQ Rhino — Rhino Technology | model: Faq | rel: - | data(5): title, description, class_card_container, class_faq_answer, class_title | generals: -
- **FaqModern** — FAQ Modern - Accordion Moderno | model: Faq | rel: - | data(6): title, description, class_title, class_description, class_faq_answer, show_contact_cta | generals: -
- **FaqChat** — FAQ Chat - Estilo Conversacional | model: Faq | rel: - | data(6): title, description, class_title, class_description, class_faq_answer, show_contact_cta | generals: -
- **FaqWebQuirurgica** — FAQ WebQuirurgica - Diseño Limpio | model: Faq | rel: - | data(0): - | generals: -
- **FaqHostinfinity** — FAQ Hostinfinity (SaaS) | model: Faq | rel: - | data(4): title, description, bool:show_contact, contact_link | generals: -
- **FaqRainstar** — Faq Rainstar - Editorial Premium | model: Faq | rel: - | data(2): title, description | generals: -

## blog — Blogs (21 opciones)

- **BlogSectionRainstar** — Blog Section Rainstar (Rainstar Style - 3 Columnas) | model: Post | rel: category | data(5): title, badge, description, class_title, class_section | generals: - | limit=3
- **BlogSectionTwenty** — Blog Section Twenty (Streetwear - 3 Columnas) | model: Post | rel: category | data(6): title, badge, description, bg_class, class_title, class_section | generals: - | limit=3
- **BlogSimple** — Simple | model: - | rel: - | data(6): title, description, second_title, second_description, bool:show_seen, class_title | generals: -
- **BlogMultivet** — Multivet | model: - | rel: - | data(9): title, description, second_title, second_description, bool:show_seen, class_title, class_second_title, placeholder_search, class_badge_category | generals: -
- **BlogKatya** — Katya | model: - | rel: - | data(6): title, description, second_title, second_description, bool:show_seen, class_title | generals: -
- **BlogCarousel** — Carousel | model: Post | rel: category | data(7): title, description, button_text, link_blog, url_video, button_video_text, button_video_link | generals: - | limit=3
- **BlogCarruselBananaLab** — BlogCarruselBananaLab | model: Post | rel: category | data(4): title, description, button_text, link_blog | generals: - | limit=3
- **BlogSectionMakita** — BlogSectionMakita | model: Post | rel: category | data(4): title, description, button_text, link_blog | generals: - | limit=4
- **BlogSectionAko** — BlogSectionAko | model: Post | rel: category | data(4): title, description, button_text, link_blog | generals: - | limit=4
- **BlogSectionDental** — BlogSectionDental | model: Post | rel: category | data(4): title, description, button_text, link_blog | generals: - | limit=2
- **BlogSectionMultivet** — BlogSectionMultivet | model: Post | rel: category | data(10): title, subtitle, posts_per_page, blog_url, read_more_text, view_all_text, class_section, class_card, class_button, class_badge_category | generals: - | limit=12
- **BlogSectionMiBalon** — BlogSectionMiBalon | model: Post | rel: category | data(10): title, subtitle, posts_per_page, blog_url, read_more_text, view_all_text, class_section, class_card, class_button, class_badge_category | generals: - | limit=12
- **BlogSectionMicjc** — BlogSectionMicjc | model: Post | rel: category | data(14): variant, title, subtitle, title_all, posts_per_page, blog_url, read_more_text, view_all_text, class_section, class_title ... (+4) | generals: - | limit=4
- **BlogWebQuirurgica** — Blog WebQuirúrgica | model: Post | rel: category | data(2): name, description | generals: -
- **BlogRhino** — Blog Rhino - Rhino Technology | model: Post | rel: category | data(8): section_label, title, description, title_all, class_section, class_title, class_title_all, class_card | generals: - | limit=4 order=created_at desc
- **BlogMicjc** — Blog Micjc | model: Post | rel: category | data(9): variant, title, description, title_all, class_section, class_title, class_title_all, class_card, class_button | generals: - | limit=4
- **BlogTwenty** — Blog Twenty (Streetwear) | model: Post | rel: category | data(3): title, class_title, description | generals: - | limit=4
- **BlogMiBalon** — Blog Mi Balón | model: Post | rel: category | data(0): - | generals: -
- **BlogRainstar** — Blog - Rainstar Style | model: Post | rel: category | data(2): title, description | generals: - | filters=[is_published] limit=12
- **BlogSectionNgs** — Sección Blog NGS Solutions | model: Post | rel: category | data(2): title, subtitle | generals: -
- **BlogSectionRhino** — Blog - Rhino Novedades e Ideas Tech | model: Post | rel: category | data(6): section_label, title, subtitle, show_featured_post, reading_time, class_container | generals: - | limit=4 order=created_at desc

## delivery-zones — Zonas de Cobertura (1 opciones)

- **DeliveryZonesKuchara** — Kuchara | model: DeliveryZone | rel: - | data(1): image | generals: -

## thank — Thanks (1 opciones)

- **ThankSimple** — Simple | model: - | rel: - | data(2): url_catalog, bool:send_whatsapp | generals: phone_whatsapp

## track — Tracking (3 opciones)

- **TrackSimple** — Simple | model: - | rel: - | data(0): - | generals: -
- **TrackingFirstClass** — Tracking FirstClass | model: - | rel: - | data(8): class_section, class_container, class_title, class_subtitle, class_input, class_button, class_status_grid, class_help_text | generals: tracking_help_phone, tracking_help_email
- **TrackTwenty** — Twenty — Brutalist Dark | model: - | rel: - | data(0): - | generals: -

## post-detail — Post Detalle (5 opciones)

- **PostDetailSimple** — Simple | model: Post | rel: category, category | data(1): title | generals: -
- **PostDetailRainstar** — Post Detail Rainstar - Editorial Premium | model: Post | rel: category, category | data(3): title, class_title, variant | generals: -
- **PostDetailTwenty** — Post Detail Twenty — Brutalist Dark | model: Post | rel: category+tags, category+tags | data(1): class_title | generals: -
- **PostDetailRhino** — Post Detail Rhino — Rhino Technology | model: Post | rel: category+tags, category+tags | data(1): class_title | generals: -
- **PostDetailNgs** — Detalle de Post NGS Solutions | model: Post | rel: category+tags | data(0): - | generals: -

## about — Acerca de Nosotros (15 opciones)

- **AboutSimple** — Simple | model: Aboutus | rel: - | data(1): title | generals: -
- **AboutImage** — Con Imagen | model: - | rel: - | data(4): url_imagen, title, description, about_url | generals: -
- **AboutAko** — AboutAko | model: Aboutus | rel: - | data(6): url_imagen, title, description, about_url, class_card, class_title | generals: -
- **AboutMultivet** — AboutMultivet | model: Aboutus | rel: - | data(5): url_imagen, title, description, about_url, class_title | generals: -
- **AboutMiBalon** — AboutMiBalon | model: Aboutus | rel: - | data(2): variant, class_title | generals: -
- **AboutTwenty** — AboutTwenty | model: Aboutus | rel: - | data(1): class_title | generals: -
- **AboutRhino** — About Rhino - Rhino Technology | model: Aboutus | rel: - | data(2): class_title, class_section | generals: whatsapp_advisors
- **AboutPaani** — AboutPaani | model: Aboutus | rel: - | data(5): url_imagen, title, description, about_url, class_title | generals: -
- **AboutWebQuirurgica** — AboutWebQuirurgica | model: Aboutus | rel: - | data(5): url_imagen, title, description, about_url, class_title | generals: -
- **AboutKatya** — AboutKatya | model: Aboutus | rel: - | data(5): url_imagen, title, description, about_url, class_title | generals: -
- **AboutHuaillys** — AboutHuaillys - Pollería Huaillys | model: Aboutus | rel: - | data(1): strengths_title | generals: -
- **AboutModern** — About Modern - Completo con Secciones | model: Aboutus | rel: - | data(12): class_hero_title, class_hero_description, class_historia_title, class_historia_description, class_valores_title, class_valores_description, class_mision_title, class_mision_description, class_vision_title, class_vision_description ... (+2) | generals: -
- **AboutSidebar** — About con Sidebar - Estilo Service | model: Aboutus | rel: - | data(6): strengths_title, class_container, class_sidebar, strengths_section, class_title_banner, class_content_banner | generals: -
- **AboutRainstar** — About Rainstar - Editorial Premium | model: Aboutus | rel: - | data(1): class | generals: whatsapp_advisors
- **AboutNgs** — Nosotros NGS Solutions | model: Aboutus | rel: - | data(4): title, subtitle, mission, vision | generals: -

## login — Login (3 opciones)

- **LoginSimple** — Simple | model: - | rel: - | data(0): - | generals: -
- **LoginRainstar** — Rainstar | model: - | rel: - | data(0): - | generals: -
- **LoginTwenty** — Twenty | model: - | rel: - | data(0): - | generals: -

## signup — Signup (3 opciones)

- **SignUpSimple** — Simple | model: - | rel: - | data(0): - | generals: -
- **SignUpRainstar** — Rainstar | model: - | rel: - | data(0): - | generals: -
- **SignUpTwenty** — Twenty | model: - | rel: - | data(0): - | generals: -

## forgot-password — ForgotPassword (3 opciones)

- **ForgotPasswordSimple** — Simple | model: - | rel: - | data(0): - | generals: -
- **ForgotPasswordRainstar** — Rainstar | model: - | rel: - | data(0): - | generals: -
- **ForgotPasswordTwenty** — Twenty | model: - | rel: - | data(0): - | generals: -

## reset-password — ResetPassword (3 opciones)

- **ResetPasswordSimple** — Simple | model: - | rel: - | data(0): - | generals: -
- **ResetPasswordRainstar** — Rainstar | model: - | rel: - | data(0): - | generals: -
- **ResetPasswordTwenty** — Twenty | model: - | rel: - | data(0): - | generals: -

## unsubscribe — Unsubscribe (2 opciones)

- **UnsubscribeSimple** — Simple | model: - | rel: - | data(0): - | generals: -
- **UnsubscribeTwenty** — Twenty | model: - | rel: - | data(0): - | generals: -

## footer — Footer (15 opciones)

- **FooterB** — FooterB | model: Social | rel: - | data(12): type_button_subscriber, sticker_book_reclamations, class_footer, logo_footer_content, logo_footer, class_logo_footer, class_menu, class_menu_list, class_menu_item, class_icon ... (+2) | generals: terms_conditions, privacy_policy, delivery_policy, saleback_policy, address, support_phone, support_email | limit=10
- **FooterDental** — FooterDental | model: Social | rel: - | data(13): class_footer, logo_footer_content, class_menu, class_menu_list, class_menu_item, class_icon, class_description, class_button, link_denuncias, job_button ... (+3) | generals: terms_conditions, privacy_policy, delivery_policy, saleback_policy, address, support_phone, support_email, opening_hours, politica_sistema_gestion, alcance_sistema_gestion | limit=10
- **FooterIbergruas** — FooterIbergruas | model: Social | rel: - | data(12): class_footer, logo_footer_content, logo_footer, class_menu, class_menu_list, class_menu_item, class_icon, class_description, class_button, link_denuncias ... (+2) | generals: terms_conditions, privacy_policy, delivery_policy, saleback_policy, address, support_phone, support_email, opening_hours, politica_sistema_gestion, alcance_sistema_gestion | limit=10
- **FooterPaani** — FooterPaani | model: Social | rel: - | data(1): methodPayment | generals: terms_conditions, privacy_policy, delivery_policy, saleback_policy, address, support_phone, support_email, opening_hours | limit=10
- **FooterTermsCTASocials** — Politicas, CTA y Redes | model: Social | rel: - | data(1): complaint_url | generals: terms_conditions, privacy_policy, delivery_policy, saleback_policy, address, support_phone, support_email | limit=10
- **FooterSalaFabulosa** — FooterSalaFabulosa | model: Social | rel: - | data(1): class_button | generals: terms_conditions, privacy_policy, delivery_policy, saleback_policy, address, support_phone, support_email | limit=10
- **Footer2Den1** — Footer2Den1 | model: Social | rel: - | data(0): - | generals: terms_conditions, privacy_policy, delivery_policy, saleback_policy, address, support_phone, support_email | limit=10
- **FooterCallToAction** — Llamada a la acción | model: Social | rel: - | data(1): summary | generals: terms_conditions, privacy_policy | limit=10
- **FooterSimpleCallToAction** — Llamada a la acción simple | model: Social | rel: - | data(1): summary | generals: terms_conditions, privacy_policy, delivery_policy, saleback_policy, address, support_phone, support_email | limit=10
- **FooterHuaillys** — Footer Huaillys | model: Social | rel: - | data(4): footer_background, left_image, right_image, class_logo_footer | generals: terms_conditions, privacy_policy, footer_description, copyright | limit=10
- **FooterFirstClass** — Footer FirstClass Courier | model: Social | rel: - | data(11): class_footer, class_container, class_logo, class_company_info, class_services_section, class_help_section, class_contact_section, class_social_links, class_bottom_section, class_copyright ... (+1) | generals: address, support_phone, support_email, footer_description, copyright, terms_conditions, privacy_policy, email_contact, site_description | limit=10
- **FooterLaPetaca** — Footer - La Petaca Hotel | model: Service | rel: - | data(9): menuItems, services, contactInfo, socials, logo, logoAlt, description, tagline, accentColor | generals: address, support_phone, support_email, footer_description, copyright, terms_conditions, privacy_policy, email_contact, site_description
- **FooterPanelPro** — Footer - Panel Pro Premium | model: Social | rel: - | data(13): logo_footer, policies_title, privacy_text, terms_text, complaints_text, company_title, contact_title, email_response_time, show_newsletter, newsletter_title ... (+3) | generals: footer_description, footer_company_links, phone_contact, email_contact, address, opening_hours, privacy_policy, terms_conditions, copyright
- **FooterHostinfinity** — Footer - Hostinfinity (SaaS) | model: Social | rel: - | data(14): logo_footer, products_title, product_links, support_title, support_links, legal_title, terms_text, privacy_text, returns_text, complaints_text ... (+4) | generals: footer_description, phone_contact, email_contact, address, ruc, privacy_policy, terms_conditions, saleback_policy, copyright
- **FooterRainstar** — Footer Editorial Premium Rainstar | model: Social | rel: - | data(7): bool:show_join_us, bool:show_privacy_policy, bool:show_terms_conditions, bool:show_return_policy, bool:show_shipping_policy, bool:show_complaints_book, class | generals: footer_description, address, opening_hours, phone_contact, email_contact, privacy_policy, terms_conditions, saleback_policy, delivery_policy, copyright

## legal — Legal (3 opciones)

- **LegalSimple** — Contenido Legal Dinámico | model: - | rel: - | data(2): correlative, title | generals: privacy_policy, terms_conditions, delivery_policy, saleback_policy
- **LegalNgs** — Página Legal NGS Solutions | model: - | rel: - | data(3): title, subtitle, last_updated | generals: -
- **LegalRhino** — Legal Rhino — Rhino Technology | model: - | rel: - | data(4): correlative, title, bool:header_solid, bool:header_static | generals: privacy_policy, terms_conditions, delivery_policy, saleback_policy

## complaints — Complaints (6 opciones)

- **ComplaintRainstar** — Rainstar Editorial Premium | model: - | rel: - | data(1): class | generals: terms_conditions, phone_contact, email_contact, opening_hours
- **ComplaintStech** — Stech | model: - | rel: - | data(4): steps, selected, class_title, class_icon | generals: terms_conditions
- **ComplaintSimple** — Simple | model: - | rel: - | data(2): steps, selected | generals: terms_conditions
- **ComplaintTwenty** — Twenty — Brutalist Dark | model: - | rel: - | data(2): steps, selected | generals: terms_conditions
- **ComplaintRhino** — Libro de Reclamaciones Rhino — Rhino Technology | model: - | rel: - | data(3): title, bool:header_solid, bool:header_static | generals: terms_conditions
- **ComplaintNgs** — Libro de Reclamaciones NGS | model: - | rel: - | data(1): title | generals: -

## whistleblowings — Whistleblowings (1 opciones)

- **WhistleblowingStech** — Stech | model: - | rel: - | data(3): class_base, class_title, class_icon | generals: privacy_policy

## testimonials — Testimonials (9 opciones)

- **TestimonialsPaani** — Paani | model: Testimony | rel: - | data(0): - | generals: -
- **TestimonialsMultivet** — Multivet | model: Testimony | rel: - | data(5): title, subtitle, star_color, nav_button_bg, nav_button_color | generals: -
- **TestimonialsMiBalon** — MiBalon | model: Testimony | rel: - | data(3): title, subtitle, star_color | generals: -
- **TestimonialsFirstClass** — Testimonials FirstClass Courier | model: Testimony | rel: - | data(19): title, subtitle, class_section, class_container, class_header, class_title, class_subtitle, class_card, class_author, class_image ... (+9) | generals: -
- **TestimonialsLaPetaca** — Testimonials - La Petaca Hotel | model: Testimony | rel: - | data(2): testimonials, accentColor | generals: -
- **TestimonialsVideosWebQuirurgica** — Videos de Casos Reales - WebQuirurgica | model: CaseStudy | rel: - | data(0): - | generals: -
- **TestimonialsTextWebQuirurgica** — Testimonios Escritos - WebQuirurgica | model: Testimony | rel: - | data(1): class_section | generals: -
- **TestimonialsSimple** — Testimonials Simple | model: Testimony | rel: - | data(6): title, subtitle, companies_title, show_companies, companies, class_section | generals: -
- **TestimonialsHostinfinity** — Testimonials Hostinfinity (SaaS) | model: Testimony | rel: - | data(9): title, description, bool:show_stats, stat_1_value, stat_1_label, stat_2_value, stat_2_label, stat_3_value, stat_3_label | generals: -

## strength — Fortalezas (5 opciones)

- **StrengthFirstClass** — Fortalezas FirstClass Courier | model: Strength | rel: - | data(13): title, subtitle, class_section, class_container, class_header, class_title, class_subtitle, class_grid, class_card, class_icon_container ... (+3) | generals: -
- **StrengthSimple** — Fortalezas Simple | model: Strength | rel: - | data(5): badge, title, subtitle, footer_text, footer_subtitle | generals: -
- **StrengthHostinfinity** — Fortalezas Hostinfinity (SaaS) | model: Strength | rel: - | data(2): title, description | generals: -
- **StrengthHostinfinityV2** — Fortalezas Hostinfinity (SaaS) V2 | model: Strength | rel: - | data(2): title, description | generals: -
- **DifferentialSectionRhino** — Diferenciales - Rhino Ventajas Competitivas | model: - | rel: - | data(5): section_label, title, subtitle, pillars_count, class_container | generals: -

## benefit — Beneficios (1 opciones)

- **BenefitSimple** — Beneficios Simple | model: Benefit | rel: - | data(5): title, subtitle, footer_text, footer_subtitle, footer_image | generals: -

## specification — Especificaciones (1 opciones)

- **SpecificationSimple** — Especificaciones Simple | model: Item | rel: attributes+applications | data(5): title, subtitle, footer_text, footer_subtitle, footer_image | generals: -

## application — Aplicaciones (1 opciones)

- **ApplicationSimple** — Aplicaciones Simple | model: Application | rel: - | data(6): title, subtitle, footer_text, footer_subtitle, footer_button_text, footer_image | generals: -

## bananalab — BananaLab (4 opciones)

- **Canva1** — Canva1 | model: - | rel: - | data(2): steps, selected | generals: -
- **Canva2** — Canva2 | model: - | rel: - | data(2): steps, selected | generals: -
- **Canva3** — Canva3 | model: - | rel: - | data(2): steps, selected | generals: -
- **Editor** — Editor | model: - | rel: - | data(2): steps, selected | generals: -

## agradecimientos — Agradecimientos (2 opciones)

- **AgradecimientoSF** — AgradecimientoSF | model: - | rel: - | data(0): - | generals: -
- **AgradecimientoAko** — AgradecimientoAko | model: Social | rel: - | data(0): - | generals: -

## brands — Brands (3 opciones)

- **BrandMultivet** — Brand Multivet | model: Brand | rel: - | data(3): title, description, footer_text | generals: -
- **BrandInfinite** — Marcas Infinito (BrandInfinite) | model: Brand | rel: - | data(8): title, class_title, class_section, class_content, navigationVariant, class_button, class_image, bool:autoplay | generals: -
- **ClientsSectionRhino** — Clientes - Rhino Carrusel y Confianza | model: Brand | rel: - | data(6): section_label, title, subtitle, marquee_speed, show_ratings, class_container | generals: -

## partner — Partners (2 opciones)

- **PartnerSimple** — PartnerSimple | model: Partner | rel: - | data(2): title, background | generals: -
- **PartnerMblens** — PartnerMblens | model: Partner | rel: - | data(3): title, description, footer_text | generals: -

## subscription — Suscripciones (1 opciones)

- **SubscriptionSimple** — Suscripción Simple | model: - | rel: - | data(8): title, description, background_image, placeholder, button_text, button_color, default_name, privacy_note | generals: -

## support — Soporte Técnico (1 opciones)

- **SupportDownloadCenter** — Centro de Descargas Premium | model: Item | rel: - | data(4): backgroundColor, textColor, title, subtitle | generals: -

## innovation — Innovaciones (3 opciones)

- **InnovationGrid** — Grid de Innovaciones | model: Innovation | rel: - | data(5): title, title_color, subtitle, subtitle_color, bg_color | generals: -
- **InnovationSimple** — Lista Simple | model: Innovation | rel: - | data(1): bg_color | generals: -
- **InnovationCarousel** — Carrusel de Innovaciones | model: Innovation | rel: - | data(2): title, bg_color | generals: -

## project — Proyectos (3 opciones)

- **ProjectsGalleryNgs** — Galería de Proyectos NGS (Filtros por Categoría & Modal Galería) | model: Project | rel: category+images | data(7): title, badge, description, class_section, class_title, class_title_all, data_title_all | generals: -
- **PortfolioSectionRhino** — Portafolio - Rhino Proyectos y Demos | model: Project | rel: category+images | data(6): section_label, title, subtitle, show_categories, show_live_demo, class_container | generals: - | filters=[featured]
- **ProjectsListRhino** — Catálogo de Proyectos - Rhino Lista Completa | model: Project | rel: category+images | data(4): badge, title, subtitle, class_container | generals: phone_whatsapp, whatsapp_advisors

## service — Servicios (12 opciones)

- **ServiceGrid** — Grid de Servicios | model: Service | rel: - | data(5): title, title_color, subtitle, subtitle_color, bg_color | generals: -
- **ServiceSimple** — Lista Simple | model: Service | rel: - | data(1): bg_color | generals: -
- **ServiceCarousel** — Carrusel de Servicios | model: Service | rel: - | data(2): title, bg_color | generals: -
- **ServiceSelection** — Selección de Servicios | model: - | rel: - | data(12): class_section, class_container, class_title, class_subtitle, class_cards_grid, class_card_personas, class_card_empresas, class_card_header, class_card_title, class_card_description ... (+2) | generals: -
- **ServiceSidebar** — Servicios con Sidebar | model: Service | rel: - | data(6): title, description, sidebar_title, class_container, class_title, class_description | generals: -
- **ServiceLaPetaca** — Servicios - La Petaca Hotel | model: Service | rel: - | data(5): services, showPreview, accentColor, title, subtitle | generals: -
- **ServiceWebQuirurgica** — Servicios por Categoría - WebQuirurgica | model: Service | rel: category+subcategory | data(1): class | generals: -
- **ServiceWebQuirurgica2** — Servicios por Categoría - WebQuirurgica2 | model: Service | rel: category+subcategory+images+features | data(8): class_section, class_header_container, class_title, class_title_highlight, class_card, class_card_icon, button_card_text, type_web | generals: whatsapp_advisors, services.file_catalogo_url | filters=[featured]
- **ServiceFimesac** — Servicios Fimesac (Sidebar Industrial) | model: Service | rel: features | data(3): title, subtitle, class_section | generals: phone_whatsapp
- **ServiceNgs** — Carrusel de Servicios Interactivo NGS | model: Service | rel: features | data(7): badge, title, subtitle, description, button_text, button_link, class | generals: -
- **ServiceDetailCatalogFimesac** — Catálogo de Servicios Fimesac (Sidebar Industrial) | model: Service | rel: category+subcategory+images+features+specifications | data(5): title, subtitle, description, badge, class | generals: whatsapp_advisors, phone_whatsapp
- **ServicesSectionRhino** — Servicios - Rhino Catálogo Interactivo | model: Service | rel: features+category | data(8): section_label, title, subtitle, cta_title, cta_link, cta_text, show_modal_detail, class_container | generals: - | filters=[featured]

## service-detail — Detalle de Servicio (5 opciones)

- **ServiceDetailSimple** — Simple | model: Service | rel: category+subcategory+images+features+specifications | data(1): class | generals: -
- **ServiceDetailCatalog** — Catálogo con Sidebar | model: Service | rel: category+subcategory+images+features+specifications | data(1): class | generals: -
- **ServiceDetailCatalogNgs** — Catálogo de Servicios Interactivo NGS | model: Service | rel: category+subcategory+images+features+specifications | data(2): title, class | generals: -
- **ServiceDetailCatalogFimesac** — Catálogo de Servicios Fimesac (Sidebar Industrial) | model: Service | rel: category+subcategory+images+features+specifications | data(5): title, subtitle, description, badge, class | generals: whatsapp_advisors, phone_whatsapp
- **ServiceDetailRhino** — Detalle de Servicio Landing Rhino | model: Service | rel: category+subcategory+images+features+specifications | data(5): title, subtitle, description, badge, class | generals: whatsapp_advisors, phone_whatsapp

## project-detail — Detalle de Proyecto (1 opciones)

- **ProjectDetailRhino** — Detalle de Proyecto Landing Rhino | model: Project | rel: category+images | data(5): title, subtitle, description, badge, class | generals: whatsapp_advisors, phone_whatsapp

## firstclass — FirstClass Pages (8 opciones)

- **CasilleroVirtual** — Casillero Virtual | model: - | rel: - | data(10): hero_title, hero_subtitle, hero_cta_text, how_it_works_title, benefits_title, features_title, class_hero, class_steps, class_benefits, class_features | generals: -
- **EnviosUSAPeru** — Envíos USA - Perú | model: - | rel: - | data(10): hero_title, hero_subtitle, hero_cta_text, how_it_works_title, benefits_title, features_title, class_hero, class_steps, class_benefits, class_features | generals: -
- **EnviosPeruUSA** — Envíos Perú - USA | model: - | rel: - | data(12): hero_title, hero_subtitle, hero_cta_text, how_it_works_title, benefits_title, features_title, products_title, class_hero, class_steps, class_benefits ... (+2) | generals: -
- **ImportacionCourier** — Importación Modalidad Courier | model: - | rel: - | data(13): hero_title, hero_subtitle, hero_cta_text, how_it_works_title, benefits_title, features_title, import_types_title, requirements_title, class_hero, class_steps ... (+3) | generals: -
- **ExportacionCourier** — Exportación Modalidad Courier | model: - | rel: - | data(14): hero_title, hero_subtitle, hero_cta_text, how_it_works_title, benefits_title, features_title, export_types_title, requirements_title, destinations_title, class_hero ... (+4) | generals: -
- **TarifasNormativas** — Tarifas y Normativas | model: - | rel: - | data(13): hero_title, hero_subtitle, calculator_title, requirements_title, prohibited_title, consequences_title, benefits_title, class_hero, class_calculator, class_requirements ... (+3) | generals: -
- **PQRS** — PQRS - Atención al Cliente | model: - | rel: - | data(11): hero_title, hero_subtitle, types_title, form_title, process_title, commitments_title, class_hero, class_types, class_form, class_process ... (+1) | generals: phone_contact, email_contact
- **FAQ** — Preguntas Frecuentes | model: Faq | rel: - | data(10): hero_title, hero_subtitle, search_placeholder, categories_title, cta_title, cta_description, class_hero, class_categories, class_faqs, class_cta | generals: phone_contact, email_contact | filters=[status]

## ads — Pop-ups (4 opciones)

- **AdStoreSelector** — Selector de tienda - Belleza Central | model: Store | rel: - | data(9): enabled, close_overlay, seconds, title, description, title_nacional, label_nacional, label_local, note | generals: -
- **AdSubscription** — Suscripción | model: Ad | rel: - | data(0): - | generals: privacy_policy
- **AdModal** — Pop-up / Modal | model: Ad | rel: - | data(0): - | generals: -
- **AdModalTwenty** — Pop-up / Modal Twenty | model: Ad | rel: - | data(0): - | generals: -

## store — Tiendas (2 opciones)

- **StoreMap** — Mapa de Ubicaciones | model: Store | rel: - | data(8): title, description, class_container, class_title, class_description, class_store_card, class_button, stored_cards | generals: - | filters=[visible]
- **StoreList** — Lista de Ubicaciones | model: Store | rel: - | data(7): title, description, class_container, class_title, class_description, class_store_card, class_button | generals: - | filters=[visible]

## hotel — Hotel (7 opciones)

- **SearchWidget** — Buscador de Habitaciones | model: - | rel: - | data(6): title, backgroundColor, class_container, class_title, class_input, class_button | generals: -
- **RoomDetailLaPetaca** — Detalle de Habitación - La Petaca | model: Item | rel: images+amenities+features | data(1): accentColor | generals: phone_whatsapp, hotel_checkin_time, hotel_checkout_time
- **RoomCard** — Tarjeta de Habitación | model: - | rel: - | data(5): class_card, class_image, class_title, class_price, class_button | generals: -
- **RoomsList** — Listado de Habitaciones | model: Item | rel: - | data(5): title, description, class_container, class_grid, show_search | generals: - | filters=[type:room,visible]
- **RoomDetail** — Detalle de Habitación | model: Item | rel: images+amenities | data(6): class_container, class_gallery, class_sidebar, class_button_reserve, show_amenities, show_description | generals: -
- **BookingSummary** — Resumen de Reserva (Carrito) | model: - | rel: - | data(4): class_card, class_dates, class_price, show_remove_button | generals: -
- **BookingCartCard** — Tarjeta de Reserva en Carrito | model: - | rel: - | data(4): class_card, class_dates, class_actions, show_edit_button | generals: -

## maps — Mapas (1 opciones)

- **MapFimesac** — Map Fimesac | model: - | rel: - | data(3): title, title_ubication, stores_support | generals: address, phone_contact, email_contact, opening_hours, location

## sector — Sectores (1 opciones)

- **SectorFimesac** — Sectores Fimesac (Grid Industrial) | model: Sector | rel: - | data(4): title, subtitle, description, class_section | generals: -

## case_studies — Casos de Éxito (2 opciones)

- **CaseStudiesListRhino** — Listado General de Casos - Rhino | model: CaseStudy | rel: - | data(4): title, subtitle, section_label, class_section | generals: -
- **CasesSectionRhino** — Sección Casos de Éxito - Rhino | model: CaseStudy | rel: - | data(5): section_label, title, subtitle, show_metrics_before_after, class_container | generals: - | filters=[featured]

## case_detail — Detalle de Caso de Estudio (1 opciones)

- **CaseStudyDetailRhino** — Detalle Caso de Estudio - Rhino | model: CaseStudy | rel: - | data(3): class_container, class_title, accentColor | generals: whatsapp_advisors, phone_whatsapp
