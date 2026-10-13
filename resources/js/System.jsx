import React, { useEffect, useState, Suspense, createContext } from "react";
import { createRoot } from "react-dom/client";
import CreateReactScript from "./Utils/CreateReactScript";
import { Local } from "sode-extend-react";
import Global from "./Utils/Global";
import ItemsRest from "./Actions/ItemsRest";
import SortByAfterField from "./Utils/SortByAfterField";
import { Toaster } from "sonner";
import { PageProvider, deriveInitialHeaderConfig } from "./Contexts/PageContext";

// Componente de animación de scroll
const ScrollAnimation = React.lazy(
    () => import("./Components/Tailwind/Components/ScrollAnimation"),
);

// Importaciones críticas (NO LAZY para evitar parpadeo y mejorar LCP)
import NoComponent from "./NoComponent";
import TopBar from "./Components/Tailwind/TopBar";
import Header from "./Components/Tailwind/Header";
import Footer from "./Components/Tailwind/Footer";
import Slider from "./Components/Tailwind/Slider";
import Product from "./Components/Tailwind/Product";
import Banner from "./Components/Tailwind/Banner";
import Category from "./Components/Tailwind/Category";

// Importaciones lazy (para componentes que pueden esperar)
const Collection = React.lazy(() => import("./Components/Tailwind/Collection"));
const Cart = React.lazy(() => import("./Components/Tailwind/Cart"));
const Step = React.lazy(() => import("./Components/Tailwind/Step"));
const Filter = React.lazy(() => import("./Components/Tailwind/Filter"));
const ProductDetail = React.lazy(
    () => import("./Components/Tailwind/ProductDetail"),
);
const Contact = React.lazy(() => import("./Components/Tailwind/Contact"));
const Maps = React.lazy(() => import("./Components/Tailwind/Maps"));
const Frame = React.lazy(() => import("./Components/Tailwind/Frame"));
const Checkout = React.lazy(() => import("./Components/Tailwind/Checkout"));
const Menu = React.lazy(() => import("./Components/Tailwind/Menu"));
const Carrusel = React.lazy(() => import("./Components/Tailwind/Carrusel"));
const Faq = React.lazy(() => import("./Components/Tailwind/Faq"));
const PostDetail = React.lazy(() => import("./Components/Tailwind/PostDetail"));
const Blog = React.lazy(() => import("./Components/Tailwind/Blog"));
const Innovation = React.lazy(() => import("./Components/Tailwind/Innovation"));
const Service = React.lazy(() => import("./Components/Tailwind/Service"));
const Sector = React.lazy(() => import("./Components/Tailwind/Sector"));
const ServiceDetail = React.lazy(
    () => import("./Components/Tailwind/ServiceDetail"),
);
const AboutUs = React.lazy(() => import("./Components/Tailwind/AboutUs"));
const Login = React.lazy(() => import("./Components/Tailwind/Login"));
const Signup = React.lazy(() => import("./Components/Tailwind/Signup"));
const ForgotPassword = React.lazy(
    () => import("./Components/Tailwind/ForgotPassword"),
);
const ResetPassword = React.lazy(
    () => import("./Components/Tailwind/ResetPassword"),
);
const Unsubscribe = React.lazy(
    () => import("./Components/Tailwind/Unsubscribe"),
);
const Complaint = React.lazy(() => import("./Components/Tailwind/Complaint"));
const BottomBar = React.lazy(() => import("./Components/Tailwind/BottomBar"));
const Whistleblowing = React.lazy(
    () => import("./Components/Tailwind/Whistleblowing"),
);
const Indicator = React.lazy(() => import("./Components/Tailwind/Indicator"));
const ThankSimple = React.lazy(
    () => import("./Components/Tailwind/Thanks/ThankSimple"),
);
const Image = React.lazy(() => import("./Components/Tailwind/Image"));
const Track = React.lazy(() => import("./Components/Tailwind/Track"));
const BananaLab = React.lazy(() => import("./Components/Tailwind/BananaLab"));
const Floating = React.lazy(() => import("./Components/Tailwind/Floating"));
const DeliveryZone = React.lazy(
    () => import("./Components/Tailwind/DeliveryZone"),
);
const Ad = React.lazy(() => import("./Components/Tailwind/Ad"));
const Testimonials = React.lazy(
    () => import("./Components/Tailwind/Testimonials"),
);
const Strength = React.lazy(() => import("./Components/Tailwind/Strength"));
const Benefit = React.lazy(() => import("./Components/Tailwind/Benefit"));
const Specification = React.lazy(
    () => import("./Components/Tailwind/Specification"),
);
const Application = React.lazy(
    () => import("./Components/Tailwind/Application"),
);
const Brands = React.lazy(() => import("./Components/Tailwind/Brands"));
const Partner = React.lazy(() => import("./Components/Tailwind/Partner"));
const Subscription = React.lazy(
    () => import("./Components/Tailwind/Subscription"),
);
const Agradecimientos = React.lazy(
    () => import("./Components/Tailwind/Agradecimientos"),
);
const Support = React.lazy(() => import("./Components/Tailwind/Support"));
const FirstClass = React.lazy(() => import("./Components/Tailwind/FirstClass"));
const Store = React.lazy(() => import("./Components/Tailwind/Store"));
const Project = React.lazy(() => import("./Components/Tailwind/Project"));
const ProjectDetail = React.lazy(() => import("./Components/Tailwind/ProjectDetail"));
const CaseStudies = React.lazy(() => import("./Components/Tailwind/CaseStudies"));
const CaseDetail = React.lazy(() => import("./Components/Tailwind/CaseDetail"));
const Hotel = React.lazy(() => import("./Components/Tailwind/Hotel"));
const Legal = React.lazy(() => import("./Components/Tailwind/Legal"));

// Fallback no bloqueante para Suspense
const LoadingFallback = () => null;

const itemsRest = new ItemsRest();

export const SystemContext = createContext({});

const System = ({
    session,
    page,
    isUser,
    pages,
    params,
    jsons,
    filteredData = {},
    systems,
    generals = [],
    systemItems = {},
    contacts,
    faqs,
    headerPosts,
    stores,
    postsLatest,
    textstatic,
    categorias,
    referrer,
    referral_code,
    hasRole = () => { },
}) => {
    React.useEffect(() => {
        // Matar el loader nativo de PHP de inmediato para que el navegador pinte el LCP
        const nativeLoader = document.getElementById("native-loader");
        if (nativeLoader && nativeLoader.parentNode) {
            nativeLoader.parentNode.removeChild(nativeLoader);
        }
    }, []);

    // Lógica para mantener el código de referido en la URL (Sticky Referral)
    // Solo en páginas marcadas como "referrable" en pages.json
    useEffect(() => {
        if (referral_code && page?.referrable) {
            const url = new URL(window.location.href);
            if (url.searchParams.get("ref") !== referral_code) {
                url.searchParams.set("ref", referral_code);
                window.history.replaceState({}, "", url.toString());
            }
        }
    }, [referral_code, page]);

    const getItems = (itemsId) => {
        return systemItems[itemsId] ?? [];
    };

    const [cart, setCart] = useState(
        Local.get(`${Global.APP_CORRELATIVE}_cart`) ?? [],
    );

    useEffect(() => {
        Local.set(`${Global.APP_CORRELATIVE}_cart`, cart);
    }, [cart]);

    const [favorites, setFavorites] = useState(
        Local.get(`${Global.APP_CORRELATIVE}_favorites`) ?? [],
    );

    useEffect(() => {
        Local.set(`${Global.APP_CORRELATIVE}_favorites`, favorites);
    }, [favorites]);

    // Variables de totales del carrito global
    const [cartTotals, setCartTotals] = useState({
        subTotal: 0,
        igv: 0,
        perception: 0,
        total: 0
    });

    useEffect(() => {
        // Obtener la tasa de IGV desde la configuración general (correlative: igv_checkout)
        const igvGeneral = generals.find(g => g.correlative === "igv_checkout");
        const igvRate = parseFloat(igvGeneral?.description) || 18;

        // Actualizar Global para que otros componentes lo tengan
        Global.IGV_RATE = igvRate;

        let currentSubTotal = 0;
        let currentIgv = 0;
        let perceptionBasis = 0;

        cart.forEach((cartItem) => {
            const finalPrice = cartItem.final_price || cartItem.price || 0;
            const lineTotal = finalPrice * cartItem.quantity;

            currentSubTotal += lineTotal;

            // Lógica inclusiva: extraemos el IGV del precio
            const isTaxable = cartItem.is_taxable !== false; // Por defecto es true
            if (isTaxable) {
                currentIgv += lineTotal - lineTotal / (1 + (igvRate / 100));
            }

            // Nota: La percepción depende de la categoría, tal como indica el doc de implementación
            if (cartItem.is_perception_taxable || cartItem.category?.is_perception_taxable) {
                perceptionBasis += lineTotal;
            }
        });

        const currentPerception = perceptionBasis > 100 ? perceptionBasis * (Global.PERCEPTION_RATE / 100) : 0;

        setCartTotals({
            subTotal: currentSubTotal,
            igv: currentIgv,
            perception: currentPerception,
            total: currentSubTotal + currentPerception
        });
    }, [cart]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("code")) {
            Local.delete(`${Global.APP_CORRELATIVE}_cart`);
            Local.set(`${Global.APP_CORRELATIVE}_cart`, []);
            setCart([]);
            return;
        }

        // Separar combos de productos normales
        const regularItems = cart.filter((x) => x.type !== "combo");
        const combos = cart.filter((x) => x.type === "combo");

        if (regularItems.length > 0) {
            itemsRest
                .verifyStock(regularItems.map((x) => x.id))
                .then((items) => {
                    const verifiedRegularItems = items
                        .map((item) => {
                            const found = regularItems.find(
                                (x) => x.id == item.id,
                            );
                            if (!found) return;
                            found.price = item.price;
                            found.discount = item.discount;
                            found.name = item.name;

                            if (!item.stock_unlimited) {
                                if (item.stock <= 0) {
                                    return null;
                                }
                                if (item.stock < found.quantity) {
                                    found.quantity = item.stock;
                                }
                            }
                            return found;
                        })
                        .filter(Boolean); // Filtrar undefined/null

                    // Combinar productos verificados con combos sin modificar
                    const newCart = [...verifiedRegularItems, ...combos];

                    setCart(newCart);
                });
        } else if (combos.length > 0) {
            // Si solo hay combos, mantenerlos sin verificación
        }
    }, []);

    // Preload diferido para mobile (no bloqueante para TBT)
    useEffect(() => {
        const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

        if (isMobile) {
            const loadDeferred = () => {
                const criticalComponents = ["Header", "Footer", "Product", "Cart"];
                criticalComponents.forEach((component) => {
                    import(`./Components/Tailwind/${component}.jsx`).catch(() => {
                        // Silenciar errores de preload
                    });
                });
            };

            if ("requestIdleCallback" in window) {
                const idleId = window.requestIdleCallback(loadDeferred, { timeout: 3000 });
                return () => window.cancelIdleCallback(idleId);
            } else {
                const timerId = setTimeout(loadDeferred, 2500);
                return () => clearTimeout(timerId);
            }
        }
    }, []);


    const getSystem = ({
        component,
        value,
        data,
        itemsId,
        visible,
        element_id,
    }) => {
        if (visible == 0) return <></>;

        // Incluir element_id en data para que esté disponible en todos los componentes
        const dataWithElementId = { ...data, element_id };

        // Configuración de animación desde data (configurable desde admin)
        const isMobileDevice = typeof window !== "undefined" && window.innerWidth <= 768;
        const animationConfig = {
            animation: data?.scroll_animation || "fade-up", // Tipo de animación
            duration: parseFloat(data?.scroll_duration) || 0.8,
            delay: parseFloat(data?.scroll_delay) || 0,
            easing: data?.scroll_easing || "gcigc",
            disabled:
                data?.scroll_animation === "none" ||
                data?.scroll_disabled === true ||
                isMobileDevice, // Deshabilitar animaciones en móvil para máximo rendimiento
        };

        // Componentes que NO deben tener animación de scroll (fixed, floating, etc)
        const noAnimationComponents = [
            "floating",
            "header",
            "top_bar",
            "footer",
            "menu",
            "bottombar",
        ];
        const shouldAnimate = !noAnimationComponents.includes(component);

        const componentProps = {
            data: dataWithElementId,
            which: value,
            items: getItems(itemsId),
            cart,
            setCart,
            cartTotals, // Nuevas variables globales de totales
            subTotal: cartTotals.subTotal - cartTotals.igv, // Subtotal neto para el desglose
            igv: cartTotals.igv,
            perception: cartTotals.perception,
            totalPrice: cartTotals.total,
            pages,
            isUser: session,
            generals,
            stores,
            headerPosts,
            contacts,
            categorias,
            referrer,
        };

        // Función helper para envolver con animación
        const wrapWithAnimation = (content, customConfig = {}) => {
            if (!shouldAnimate || animationConfig.disabled) {
                return content;
            }
            return (
                <ScrollAnimation
                    animationConfig={{ ...animationConfig, ...customConfig }}
                    key={element_id || `anim-${component}-${itemsId}`}
                >
                    {content}
                </ScrollAnimation>
            );
        };

        switch (component) {
            case "top_bar":
                return <TopBar {...componentProps} data={dataWithElementId} />;
            case "header":
                return <Header {...componentProps} />;
            case "menu":
                return (
                    <Menu
                        data={dataWithElementId}
                        which={value}
                        items={getItems(itemsId)}
                        cart={cart}
                        setCart={setCart}
                        pages={pages}
                    />
                );
            case "content":
                if (!page.id) {
                    return null;
                    return (
                        <div className="h-80 w-full bg-gray-300 flex items-center justify-center">
                            <div>- Tu contenido aquí -</div>
                        </div>
                    );
                } else if (page.extends_base) {
                    const contentSystems = SortByAfterField(systems).filter(
                        (x) => Boolean(x.page_id),
                    );
                    return contentSystems.map((content, idx) => (
                        <React.Fragment
                            key={
                                content.id ??
                                `content-${idx}-${content.component}`
                            }
                        >
                            {getSystem(content)}
                        </React.Fragment>
                    ));
                }
                break;
            case "filter":
                return wrapWithAnimation(
                    <Filter
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                        filteredData={filteredData}
                        cart={cart}
                        setCart={setCart}
                        setFavorites={setFavorites}
                        favorites={favorites}
                    />,
                );
            case "product":
                return wrapWithAnimation(
                    <Product
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                        filteredData={filteredData}
                        cart={cart}
                        setCart={setCart}
                        pages={pages}
                        favorites={favorites}
                        generals={generals}
                        setFavorites={setFavorites}
                    // contacts={generals}
                    />,
                );
            case "category":
                return wrapWithAnimation(
                    <Category
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "collection":
                return wrapWithAnimation(
                    <Collection
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "slider":
                return (
                    <Slider
                        which={value}
                        data={dataWithElementId}
                        sliders={getItems(itemsId)}
                        generals={generals}
                    />
                );
            case "carrusel":
                return wrapWithAnimation(
                    <Carrusel
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "indicator":
                return wrapWithAnimation(
                    <Indicator
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "banner":
                return wrapWithAnimation(
                    <Banner
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                        generals={generals}
                        cart={cart}
                        setCart={setCart}
                    />,
                );
            case "ads":
                return wrapWithAnimation(
                    <Ad
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "image":
                return wrapWithAnimation(
                    <Image which={value} data={dataWithElementId} />,
                );
            case "step":
                return wrapWithAnimation(
                    <Step which={value} data={dataWithElementId} />,
                );
            case "delivery-zones":
                return wrapWithAnimation(
                    <DeliveryZone
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "product-detail":
                return wrapWithAnimation(
                    <ProductDetail
                        which={value}
                        item={
                            filteredData.Item ||
                            Object.values(filteredData).find(
                                (x) =>
                                    x &&
                                    typeof x === "object" &&
                                    !Array.isArray(x) &&
                                    (x.id || x.slug),
                            )
                        }
                        cart={cart}
                        setCart={setCart}
                        data={dataWithElementId}
                        generals={generals}
                        favorites={favorites}
                        setFavorites={setFavorites}
                        textstatic={textstatic}
                    //contacts={contacts}
                    />,
                );
            case "cart":
                return wrapWithAnimation(
                    <Cart
                        which={value}
                        data={dataWithElementId}
                        cart={cart}
                        setCart={setCart}
                    />,
                );
            case "checkout":
                return (
                    <Checkout
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                        cart={cart}
                        setCart={setCart}
                        isUser={session}
                        prefixes={jsons?.prefixes ?? []}
                        ubigeos={jsons?.ubigeos ?? []}
                        //  contacts={contacts}
                        generals={generals}
                        categorias={categorias}
                    />
                );
            case "contact":
                return wrapWithAnimation(
                    <Contact
                        which={value}
                        data={dataWithElementId}
                        //  contacts={contacts}
                        generals={generals}
                        items={getItems(itemsId)}
                    />,
                );
            case "maps":
            case "mapas":
                return wrapWithAnimation(
                    <Maps
                        which={value}
                        data={dataWithElementId}
                        generals={generals}
                        items={getItems(itemsId)}
                    />,
                );
            case "faq":
                return wrapWithAnimation(
                    <Faq
                        which={value}
                        data={dataWithElementId}
                        faqs={getItems(itemsId)}
                    />,
                );
            case "thank":
                return wrapWithAnimation(
                    <ThankSimple
                        which={value}
                        data={dataWithElementId}
                        item={
                            filteredData.Sale ||
                            Object.values(filteredData).find(
                                (x) =>
                                    x &&
                                    typeof x === "object" &&
                                    !Array.isArray(x) &&
                                    (x.id || x.slug),
                            )
                        }
                    />,
                );
            case "track":
                return wrapWithAnimation(
                    <Track which={value} data={dataWithElementId} />,
                );
            case "blog":
                return wrapWithAnimation(
                    <Blog
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                        headerPosts={headerPosts}
                        postsLatest={postsLatest}
                        filteredData={filteredData}
                    />,
                );
            case "innovation":
                return wrapWithAnimation(
                    <Innovation
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "service":
                return wrapWithAnimation(
                    <Service
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                        generals={generals}
                    />,
                );
            case "sector":
            case "sectores":
                return wrapWithAnimation(
                    <Sector
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                        generals={generals}
                    />,
                );
            case "project":
                return wrapWithAnimation(
                    <Project
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                        generals={generals}
                    />,
                );
            case "service-detail":
                return wrapWithAnimation(
                    <ServiceDetail
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                        currentService={
                            filteredData.Service ||
                            Object.values(filteredData).find(
                                (x) =>
                                    x &&
                                    typeof x === "object" &&
                                    !Array.isArray(x) &&
                                    (x.id || x.slug),
                            ) ||
                            null
                        }
                    />,
                );
            case "project-detail":
                return wrapWithAnimation(
                    <ProjectDetail
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                        currentProject={
                            filteredData.Project ||
                            Object.values(filteredData).find(
                                (x) =>
                                    x &&
                                    typeof x === "object" &&
                                    !Array.isArray(x) &&
                                    (x.id || x.slug),
                            ) ||
                            null
                        }
                    />,
                );
            case "case_studies":
                return wrapWithAnimation(
                    <CaseStudies
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                        generals={generals}
                    />,
                );
            case "case_detail":

                return wrapWithAnimation(
                    <CaseDetail
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                        currentCaseStudy={
                            filteredData.CaseStudy ||
                            filteredData.Case ||
                            filteredData.slug ||
                            Object.values(filteredData).find(
                                (x) =>
                                    x &&
                                    typeof x === "object" &&
                                    !Array.isArray(x) &&
                                    (x.id || x.slug),
                            ) ||
                            null
                        }
                        generals={generals}
                    />,
                );
            case "post-detail":
                return wrapWithAnimation(
                    <PostDetail
                        which={value}
                        data={dataWithElementId}
                        item={
                            filteredData.Post ||
                            Object.values(filteredData).find(
                                (x) =>
                                    x &&
                                    typeof x === "object" &&
                                    !Array.isArray(x) &&
                                    (x.id || x.slug),
                            )
                        }
                    />,
                );
            case "about":
                return wrapWithAnimation(
                    <AboutUs
                        which={value}
                        data={dataWithElementId}
                        filteredData={filteredData}
                        items={getItems(itemsId)}
                        generals={generals}
                    />,
                );
            case "login":
                return wrapWithAnimation(
                    <Login which={value} data={dataWithElementId} />,
                );
            case "signup":
                return wrapWithAnimation(
                    <Signup which={value} data={dataWithElementId} />,
                );
            case "forgot-password":
                return wrapWithAnimation(
                    <ForgotPassword which={value} data={dataWithElementId} />,
                );
            case "reset-password":
                return wrapWithAnimation(
                    <ResetPassword which={value} data={dataWithElementId} />,
                );
            case "unsubscribe":
                return wrapWithAnimation(
                    <Unsubscribe which={value} data={dataWithElementId} />,
                );
            case "frame":
                return wrapWithAnimation(
                    <Frame which={value} data={dataWithElementId} />,
                );
            case "footer":
                return (
                    <Footer
                        {...componentProps}
                        // contacts={contacts}
                        generals={generals}
                        stores={stores}
                    />
                );
            case "complaints":
                return wrapWithAnimation(
                    <Complaint
                        which={value}
                        data={dataWithElementId}
                        generals={generals}
                    />,
                );
            case "legal":
                return wrapWithAnimation(
                    <Legal
                        which={value}
                        data={dataWithElementId}
                        generals={generals}
                    />,
                );
            case "whistleblowings":
                return wrapWithAnimation(
                    <Whistleblowing
                        which={value}
                        data={dataWithElementId}
                        generals={generals}
                    />,
                );
            case "floating":
                return <Floating which={value} data={dataWithElementId} />;
            case "bottombar":
                return <BottomBar {...componentProps} />;
            case "testimonials":
                return wrapWithAnimation(
                    <Testimonials
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "strength":
                return wrapWithAnimation(
                    <Strength
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "benefit":
                return wrapWithAnimation(
                    <Benefit
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "specification":
                return wrapWithAnimation(
                    <Specification
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "application":
                return wrapWithAnimation(
                    <Application
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "brands":
                return wrapWithAnimation(
                    <Brands
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "partner":
                return wrapWithAnimation(
                    <Partner
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "subscription":
                return wrapWithAnimation(
                    <Subscription which={value} data={dataWithElementId} />,
                );
            case "agradecimientos":
                return wrapWithAnimation(
                    <Agradecimientos
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}

                    // contacts={contacts}
                    />,
                );
            case "support":
                return wrapWithAnimation(
                    <Support
                        which={value}
                        data={dataWithElementId}
                        items={getItems(itemsId)}
                    />,
                );
            case "firstclass":
                return wrapWithAnimation(<FirstClass {...componentProps} />);
            case "store":
                return wrapWithAnimation(<Store {...componentProps} />);
            case "hotel":
                return wrapWithAnimation(
                    <Hotel
                        {...componentProps}
                        filteredData={filteredData}
                        favorites={favorites}
                        setFavorites={setFavorites}
                    />,
                );
            default:
                return <NoComponent which={value} data={dataWithElementId} />;
        }
    };

    const systemsSorted = SortByAfterField(systems).filter((x) =>
        page.extends_base ? !x.page_id : true,
    );

    const initialHeaderConfig = deriveInitialHeaderConfig(systems);

    return (
        <PageProvider initialHeaderConfig={initialHeaderConfig}>
            <main className="font-paragraph">
                {systemsSorted.map((system, index) => (
                    <React.Fragment
                        key={
                            system.id ??
                            `sys-${index}-${system.component}-${system.element_id}`
                        }
                    >
                        {getSystem(system)}
                    </React.Fragment>
                ))}
                <Toaster />
            </main>
        </PageProvider>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <Suspense fallback={<LoadingFallback />}>
            <System {...properties} />
        </Suspense>
    );
});
