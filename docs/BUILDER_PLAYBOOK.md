# BUILDER_PLAYBOOK — cómo generar un sitio completo desde `brief/`

> Doc de ejecución. `CONTEXT.md` explica el mecanismo (léelo primero). `docs/COMPONENTS_CATALOG.md` es el inventario de piezas disponibles.
> Objetivo: que un agente de IA pueda responder “genera un e-commerce según `brief/`” y producir un sitio termin composed de componentes existentes, creando solo los que falten.

---

## 0. Reglas de la casa

1. **Reusar antes que crear.** El catálogo tiene 389 variantes de 60 tipos. Antes de escribir JSX, grepea `docs/COMPONENTS_CATALOG.md` por la sección que necesitas.
2. **Crear solo lo que no es viable.** Un componente nuevo se justifica si: el layout/UX no existe, o el existente no acepta el dato necesario (`using` distinto, `data` insuficiente), o la marca lo exige (dirección visual muy específica).
3. **Nombres:** prefiere variantes funcionales reutilizables (`HeaderSearchMenu`, `FilterSimple`, `BannerCampaign`). Sufijo de marca solo si el diseño es marcadamente de esa marca (`HeaderNgs`, `HeaderRhino`, `FooterDental`). No reescribir un componente existente para otra marca: crear la variante al lado.
4. **Ningún hex de marca en JSX.** Usar `primary`, `accent`, `page-background`, `sections-color`, `info`, `success`… (ver `CONTEXT.md` §4). El color se cambia desde el admin.
5. **Respetar el brief.** Copy en español de Perú, tuteo, frases cortas, y las restricciones legales del brief (ej. el aviso de consultora independiente) deben quedar **visibles en footer y header**, no solo en el código.
6. **Nada de “depurar” el brief.** Si pide algo que el builder no soporta (multitenant, suscencias, 3D), decirlo y proponer; no inventar.

---

## 1. Fase 0 — Leer el brief y extraer requisitos

Leer **todo** `brief/` (típicamente `README.md` = modelo de negocio, `BRANDBOOK.md` = identidad). Extraer y dejar por escrito:

| Extraer | Para qué |
| --- | --- |
| Tipo de sitio: landing / catálogo / e-commerce / servicio | Decide el set de páginas (ver §6) |
| Público y zona geográfica | Copy, secciones, datos de contacto |
| Paleta, tipografías, tono de voz | `system_colors`, `Setting` de fuentes, copy |
| Restricciones legales/brand | Footer/header obligatorios |
| Catálogo: ¿quiere carrito real o enlaces externos? | `is_ecommerce`, tipo de tarjeta de producto |
| Features pedidas: delivery local, reseñas, blogs, testimonios, FAQ | Componentes/módulos a incluir |

## 2. Fase 1 — Mapa sección → componente

Armar una tabla `sección del brief → tipo/opción del catálogo → qué falta`. Ejemplo:

| Sección del brief | Pieza | Viabilidad |
| --- | --- | --- |
| Hero principal con imagen y CTA | `slider` / `SliderInteractive` o `HeroRhino` | ✔ |
| Beneficios (4 iconos) | `indicator` / … | ✔ |
| Catálogo con filtro precio/marca | `filter` / `CatalogoFiltrosRainstar` | ✔ |
| Tarjeta con sello “entrega hoy” | `product` / … + campo en `data` | ⚠ ver §3 |

Ese mapa es el output intermedio: **presentarlo y esperar el visto bueno antes de escribir nada.** Si el usuario pide algo puntual ("cambia el hero de la home"), no hace falta mapa completo: confirmar la pieza a cambiar y seguir.

## 3. Fase 2 — Decidir: reusar, extender o crear

- **Reusar tal cual**: la opción cubre sección y look.
- **Extender** (preferible a crear): agregar un `data:` nuevo a una opción existente + el `default` en el hijo. Beneficio: lo heredan todas las páginas que la usen.
- **Crear opción nueva**: `CONTEXT.md` §5 (6 pasos). Ejemplos de motivo legítimo: “necesita 3 slots de precio con cupón” → `data: ["precio_base","precio_descuento","precio_especial"]` + render.
- **Crear tipo nuevo**: solo si el concepto no existe (ej. “calculadora de cotizaciones”). Requiere tocar `System.jsx`.

## 4. Fase 3 — Composición: páginas y filas

### 4.1 Base template (una sola vez por sitio)

Orden canónico: `top_bar → header → [content] → footer → floating/bottombar`.
`content` es una fila manual con `component = "content"`, `value = null`, `page_id = null`. **Crearla primero**; sin ella las páginas no tienen cuerpo.

### 4.2 Declarar páginas en `pages.json`

El agente declara **solo las páginas que pidió el brief**, con este orden de trabajo:

1. Escribir la entrada en `storage/app/pages.json` (o crearla en `/admin/system`).
2. Crear sus filas en `systems`, encadenadas en el orden pedido por el brief.
3. `php artisan cache:clear`.

Campos mínimos: `name`, `path`, `extends_base: true`, `menuable`, `sitemapable`, `pseudo_path` (igual a `path`, o el prefijo si tiene `{param}`), `using` si la página carga datos.

```bash
php artisan cache:clear
```

#### Atajo opcional: `php artisan builder:page`

Comodín para una página puntual desde consola. **No reemplaza el criterio del agente** (qué páginas y en qué orden se piden), solo evita errores de encadenado:

```bash
php artisan builder:page "Promociones" /promociones \
  --section="slider:SliderInteractive" \
  --section="filter:CatalogoFiltrosRainstar" \
  --dry-run
```

- Repite `--section="tipo:Opcion"` en orden: cada fila se encadena con `after_component` a la anterior.
- `--base-section="content"` crea la fila `content` en el base template.
- Valida tipo y opción contra `components.json`; si no existe, muestra las opciones válidas y no escribe nada.
- Hace backup en `storage/app/pages.json.bak`, inserta en `pages.json`, crea las filas en `systems` con `element_id` único, y hace `Cache::flush()`.
- Opciones: `--no-base`, `--no-menu`, `--no-sitemap`, `--id=`, `--dry-run`.
- El `data` de cada fila queda `{}`: el copy fino se edita en `/admin/system`.

### 4.3 Insertar filas de composición (tinker)

Para componer a mano cuando el admin no basta (copiar una página, insertar en medio de la cadena, ajustar `data` de varias filas). `after_component` es una lista enlazada: el primero va en `null` y cada uno apunta al anterior.

```php
// php artisan tinker
$pageId = 'ID-DE-LA-PAGINA';                 // o null para el base template
$prev = null;                                // id del system anterior de la misma lista
$filas = [
  ['name' => 'Hero - SliderInteractive', 'component' => 'slider',      'value' => 'SliderInteractive'],
  ['name' => 'Beneficios - Carrusel Simple','component' => 'carrusel', 'value' => 'CarruselBenefitsSimple'],
  ['name' => 'Catálogo - Filtro Rainstar',  'component' => 'filter',    'value' => 'CatalogoFiltrosRainstar'],
];
foreach ($filas as [$name, $component, $value]) {
    $s = new App\Models\System;
    $s->name = $name;
    $s->component = $component;
    $s->value = $value;
    $s->page_id = $pageId;
    $s->after_component = $prev;
    $s->visible = true;
    $s->element_id = strtolower($component) . '-' . strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $value)) . '-' . substr(str_replace('-', '', $s->id), 0, 4);
    $s->save();
    $prev = $s->id;
}
Illuminate\Support\Facades\Cache::flush();
```

Después, afinar `data` de cada fila (lo que haría el modal “Configurar datos”). La consola es para el esqueleto; el copy fino se hace en el admin.

## 5. Fase 4 — Datos de marca y contenido

1. **Colores**: cargar la paleta del brief en `system_colors` (solo los 12 slots; no inventar nombres).
2. **Fuentes**: `Setting` `title-font-*` y `paragraph-font-*` desde el panel derecho de `/admin/system`.
3. **Generals**: crear/actualizar las llaves que declaren los componentes usados (`cintillo`, `phone_whatsapp`, `address`, `copyright`, `igv_checkout`, `is_ecommerce`, …). El backend solo carga las que se piden, así que si falta una, el componente la ve `undefined`.
4. **Contenido**: cargar datos reales (items, categorías, sliders, indicadores, posts, faqs). Un sitio sin registros se ve roto aunque el código esté bien.
5. **Identidad**: favicon/logo en el panel derecho (`public/assets/resources/`).

## 6. Fase 5 — Recetas de páginas

### Landing / sitio corporativo

| Página | `path` | Componentes típicos |
| --- | --- | --- |
| Home | `/` | `slider`, `indicator`, `banner`, `service`, `testimonials`, `blog`, `faq`, `contact` |
| Nosotros | `/nosotros` | `about`, `strength`, `indicator`, `testimonials` |
| Servicios | `/servicios` | `service` (+ `sector` si hay industrias) |
| Detalle | `/servicio/{slug}` | `service-detail` |
| Blog | `/blogs`, `/post/{slug}` | `blog`, `post-detail` |
| Contacto | `/contacto` | `contact`, `maps` |
| Legales | `/politicas-de-privacidad`, … | `legal` |

**No** pongas `filter`, `product`, `cart`, `checkout` si no hay e-commerce.

### e-commerce

| Página | `path` | Componentes típicos |
| --- | --- | --- |
| Home | `/` | `slider`, `banner`, `category`, `product` (grid destacados), `indicator` |
| Catálogo | `/catalogo` | `filter` (variante con filtros) + `product` |
| Detalle | `/product/{slug}` | `product-detail` |
| Carrito | `/cart` | `cart` |
| Checkout | `/checkout` | `checkout` |
| Gracias | `/gracias` | `thank` |
| Rastreo | `/rastreo` | `track` |
| Auth | `/iniciar-sesion`, `/crear-cuenta`, `/forgot-password` | `login`, `signup`, `forgot-password` |
| Corp/legal | `/nosotros`, `/contacto`, `/blogs`, políticas | igual que landing |

Además: `generals.is_ecommerce` para costos de envío, `igv_checkout` para el impuesto, `delivery-zones`, y la tarjeta de producto correcta vía `select:type_card_product` / `type_card`.

## 7. Fase 6 — SEO y verificación

1. Por página: modal **Editar SEO** (title/description/og/twitter) y revisar `sitemapable`.
2. Globales SEO ya se cargan siempre (`site_title`, `og_*`, `twitter_*`, `favicon`, `canonical_url`…).
3. `php artisan cache:clear`.
4. `npm run build` si se tocó JSX; `php artisan test` si se tocó backend.
5. Pruebas mínimas antes de dar por terminado:
   - `/` y todas las rutas nuevas cargan sin error de consola.
   - `/base-template` y `/admin/system` siguen ok.
   - Un producto con filtro devuelve items; el detalle del producto recibe `filteredData.Item`.
   - Carrito: añadir → `/cart` → `/checkout` (si aplica).
   - Móvil: header, filtros y tarjetas no se rompen (el builder ya desactiva animaciones en móvil).
6. Entregar resumen: qué páginas se crearon, qué componentes se reutilizaron, cuáles se crearon nuevos, y qué queda pendiente de contenido real.

---

## Checklist de calidad (para el agente)

- [ ] Ningún componente nuevo sin su `case` y su entrada en `components.json`.
- [ ] Ningún hex de marca en JSX; todo por clases del sistema.
- [ ] `content` existe en el base template.
- [ ] Toda página nueva: `extends_base`, `menuable`, `sitemapable`, `pseudo_path` coherentes, y caché limpia.
- [ ] `element_id` único por fila.
- [ ] `data` con defaults en el hijo (nada de `data.x.map` sin Optional chaining).
- [ ] Copy del brief fiel, incluido el texto legal obligatorio.
- [ ] `npm run build` en verde.
