import React, { useState } from "react";
import { MapPin, Truck, Phone, Check, ChevronDown, ChevronUp } from "lucide-react";
import HtmlContent from "../../../Utils/HtmlContent";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import {
    STORE_MODE_NACIONAL,
    resolvePurchase,
    useStoreMode,
} from "../../../Utils/StoreMode";

/**
 * Detalle de producto híbrido (Belleza Central): sin carrito.
 * - Tienda física: stock y precio propios de cada tienda (reserva por WhatsApp).
 * - Envío nacional: precio del producto y enlace oficial de compra.
 */
const ProductDetailHibrido = ({ item, data, generals }) => {
    const { mode, isNacional, choose } = useStoreMode();
    const [openSection, setOpenSection] = useState("descripcion");
    const [activeImage, setActiveImage] = useState(null);

    if (!item) return null;

    const purchase = resolvePurchase(item, mode);
    const storeRows = (item.item_stores || []).filter(
        (row) => row?.store && Number(row.stock) > 0,
    );
    const affiliateUrl = item.affiliate_url || null;
    const isOffer = item.offering || item.discount > 0;

    const images = [
        ...(item.images || []).map((img) => img.image || img.url).filter(Boolean),
        item.image,
    ].filter(Boolean);
    const mainImage =
        images[0]?.startsWith("http")
            ? images[0]
            : `/storage/images/item/${images[0] || "null"}`;
    const currentImage = activeImage || mainImage;

    const phone = data?.whatsapp || null;

    const reserveMessage = (storeName) =>
        encodeURIComponent(
            `Hola, quiero reservar "${item.name}"${
                storeName ? ` en ${storeName}` : ""
            }.`,
        );

    const toggleSection = (key) =>
        setOpenSection((prev) => (prev === key ? null : key));

    const specs = item.specifications || [];
    const faqs = Array.isArray(item.faqs) ? item.faqs : [];

    return (
        <section
            id={data?.element_id || null}
            className={`bg-white ${data?.class || "py-10 lg:py-16"}`}
        >
            <div className="px-primary 2xl:max-w-7xl 2xl:px-0 mx-auto">
                {/* Migas */}
                <nav className="text-[11px] uppercase tracking-widest text-gray-400 mb-8">
                    <a href="/" className="hover:text-primary">
                        Inicio
                    </a>
                    {item.category ? (
                        <>
                            <span className="mx-2">/</span>
                            <a
                                href={`/catalogo?category_id=${item.category.slug || item.category.id}`}
                                className="hover:text-primary"
                            >
                                {item.category.name}
                            </a>
                        </>
                    ) : null}
                    <span className="mx-2">/</span>
                    <span className="text-neutral-dark">{item.name}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
                    {/* Galería */}
                    <div>
                        <div className="relative overflow-hidden rounded-[2rem] bg-gray-100 aspect-[4/5] mb-4">
                            <img
                                src={currentImage}
                                alt={item.name}
                                className="w-full h-full object-cover object-top"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/api/cover/thumbnail/null";
                                }}
                            />
                        </div>
                        {images.length > 1 ? (
                            <div className="flex gap-3 overflow-x-auto">
                                {images.map((img, index) => {
                                    const url = img.startsWith("http")
                                        ? img
                                        : `/storage/images/item/${img}`;
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setActiveImage(url)}
                                            className={`w-20 h-20 shrink-0 border-2 overflow-hidden rounded-2xl ${
                                                currentImage === url
                                                    ? "border-primary"
                                                    : "border-transparent"
                                            }`}
                                        >
                                            <img
                                                src={url}
                                                alt={`${item.name} ${index + 1}`}
                                                className="w-full h-full object-cover object-top"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>

                    {/* Info */}
                    <div>
                        {item.brand ? (
                            <p className="text-[11px] font-bold uppercase tracking-widest text-accent mb-2">
                                {item.brand.name}
                            </p>
                        ) : null}

                        <h1 className="text-3xl md:text-4xl font-title font-black uppercase text-neutral-dark">
                            {item.name}
                        </h1>

                        {item.summary ? (
                            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                                {item.summary}
                            </p>
                        ) : null}

                        {/* Precio y stock del modo actual */}
                        <div className="mt-6 border border-gray-200 rounded-2xl p-5">
                            <div className="flex items-baseline gap-3 flex-wrap">
                                <span className="text-3xl font-black text-neutral-dark">
                                    {CurrencySymbol}{" "}
                                    {Number(purchase.price || 0).toFixed(2)}
                                </span>
                                {isOffer ? (
                                    <span className="text-sm text-gray-400 line-through">
                                        {CurrencySymbol}{" "}
                                        {Number(item.price).toFixed(2)}
                                    </span>
                                ) : null}
                            </div>

                            <p className="text-xs uppercase tracking-wider mt-3 flex items-center gap-2">
                                {purchase.isNacional ? (
                                    <>
                                        <Truck size={14} className="text-info" />
                                        <span className="text-info font-bold">
                                            Envío a todo el Perú
                                        </span>
                                    </>
                                ) : purchase.available ? (
                                    <>
                                        <Check
                                            size={14}
                                            className="text-success"
                                        />
                                        <span className="text-success font-bold">
                                            {purchase.stock} disponibles en{" "}
                                            {purchase.storeLabel}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-gray-400 font-bold">
                                        Sin stock en esta tienda
                                    </span>
                                )}
                            </p>

                            {/* Selector de modo */}
                            <div className="flex flex-wrap gap-2 mt-5">
                                {storeRows.map((row) => {
                                    const active = mode === row.store.slug;
                                    return (
                                        <button
                                            key={row.store.id}
                                            type="button"
                                            onClick={() => choose(row.store.slug)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-2 border text-[11px] font-bold uppercase tracking-wider transition-colors rounded-full ${
                                                active
                                                    ? "border-primary bg-primary text-white"
                                                    : "border-gray-200 text-gray-500 hover:border-primary"
                                            }`}
                                        >
                                            <MapPin size={12} />
                                            {row.store.name}
                                        </button>
                                    );
                                })}
                                <button
                                    type="button"
                                    onClick={() => choose(STORE_MODE_NACIONAL)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-2 border text-[11px] font-bold uppercase tracking-wider transition-colors rounded-full ${
                                        isNacional
                                            ? "border-info bg-info text-white"
                                            : "border-gray-200 text-gray-500 hover:border-info"
                                    }`}
                                >
                                    <Truck size={12} />
                                    Envío nacional
                                </button>
                            </div>

                            {/* CTA */}
                            <div className="mt-5 flex flex-col gap-3">
                                {isNacional ? (
                                    affiliateUrl ? (
                                        <a
                                            href={affiliateUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 bg-primary text-white py-4 px-8 font-bold uppercase text-xs tracking-wider hover:bg-accent hover:text-neutral-dark transition-colors rounded-full"
                                        >
                                            <Truck size={16} />
                                            Comprar en línea
                                        </a>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Este producto aún no tiene enlace de
                                            compra nacional. Escríbenos para
                                            coordinar la entrega.
                                        </p>
                                    )
                                ) : purchase.available ? (
                                    phone ? (
                                        <a
                                            href={`https://wa.me/51${String(phone).replace(/\D/g, "")}?text=${reserveMessage(purchase.storeLabel)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 bg-primary text-white py-4 px-8 font-bold uppercase text-xs tracking-wider hover:bg-accent hover:text-neutral-dark transition-colors rounded-full"
                                        >
                                            <Phone size={16} />
                                            Reservar en tienda
                                        </a>
                                    ) : null
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Por ahora este producto solo está
                                        disponible en compra nacional.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Disponibilidad por tienda */}
                        {storeRows.length ? (
                            <div className="mt-6">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-dark mb-3">
                                    Disponibilidad por tienda
                                </h2>
                                <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
                                    {storeRows.map((row) => (
                                        <div
                                            key={row.store.id}
                                            className="flex items-center justify-between gap-4 p-4"
                                        >
                                            <div>
                                                <p className="text-sm font-bold text-neutral-dark">
                                                    {row.store.name}
                                                </p>
                                                {row.store.address ? (
                                                    <p className="text-[11px] text-gray-400">
                                                        {row.store.address}
                                                    </p>
                                                ) : null}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold">
                                                    {CurrencySymbol}{" "}
                                                    {Number(
                                                        row.price ||
                                                            item.price ||
                                                            0,
                                                    ).toFixed(2)}
                                                </p>
                                                <p className="text-[11px] text-success font-bold uppercase">
                                                    {row.stock} disponibles
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {/* Acordeones */}
                        <div className="mt-8 border-t border-gray-100">
                            {[
                                {
                                    key: "descripcion",
                                    title: "Descripción",
                                    content: (
                                        <HtmlContent
                                            html={item.description || ""}
                                        />
                                    ),
                                },
                                ...(specs.length
                                    ? [
                                          {
                                              key: "especificaciones",
                                              title:
                                                  "Especificaciones",
                                              content: (
                                                  <ul className="space-y-2">
                                                      {specs.map((spec) => (
                                                          <li
                                                              key={
                                                                  spec.id ||
                                                                  spec.name
                                                              }
                                                              className="flex justify-between gap-6 text-sm border-b border-gray-100 pb-2"
                                                          >
                                                              <span className="text-gray-500">
                                                                  {spec.name ||
                                                                      spec.attribute
                                                                          ?.name}
                                                              </span>
                                                              <span className="text-neutral-dark font-medium text-right">
                                                                  {spec.value ||
                                                                      spec.description}
                                                              </span>
                                                          </li>
                                                      ))}
                                                  </ul>
                                              ),
                                          },
                                      ]
                                    : []),
                                ...(faqs.length
                                    ? [
                                          {
                                              key: "faq",
                                              title:
                                                  "Preguntas frecuentes",
                                              content: (
                                                  <div className="space-y-4">
                                                      {faqs.map((faq, index) => (
                                                          <div key={index}>
                                                              <p className="text-sm font-bold text-neutral-dark">
                                                                  {faq.question}
                                                              </p>
                                                              <p className="text-sm text-gray-500 mt-1">
                                                                  {faq.answer}
                                                              </p>
                                                          </div>
                                                      ))}
                                                  </div>
                                              ),
                                          },
                                      ]
                                    : []),
                            ].map((section) => {
                                const open = openSection === section.key;
                                return (
                                    <div
                                        key={section.key}
                                        className="border-b border-gray-100"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleSection(
                                                    section.key,
                                                )
                                            }
                                            className="w-full flex items-center justify-between py-4 text-left"
                                        >
                                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-dark">
                                                {section.title}
                                            </span>
                                            {open ? (
                                                <ChevronUp
                                                    size={16}
                                                    className="text-gray-400"
                                                />
                                            ) : (
                                                <ChevronDown
                                                    size={16}
                                                    className="text-gray-400"
                                                />
                                            )}
                                        </button>
                                        {open ? (
                                            <div className="pb-5 text-sm text-gray-600 leading-relaxed">
                                                {section.content}
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>

                        <p className="text-[10px] text-gray-400 mt-6 leading-relaxed">
                            Belleza Central es consultora independiente de
                            ventas. Los productos se despachan a nombre de
                            Natura Cosméticos Perú S.A.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetailHibrido;
