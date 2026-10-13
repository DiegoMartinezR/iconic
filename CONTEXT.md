# CONTEXT.md — Cómo funciona este builder

> **Para qué existe este archivo:** es la referencia técnica del builder. Un agente de IA debe leerlo ANTES de tocar `pages.json`, `components.json` o cualquier componente, para saber qué archivos forman el contrato y qué se rompe si se cambia solo uno.
> Contexto de negocio/marca: `brief/`. Manos a la obra: `docs/BUILDER_PLAYBOOK.md`. Inventario de piezas: `docs/COMPONENTS_CATALOG.md`.

---

## 1. Qué es

Builder de sitios con drag & drop (Rhino Technology). Un mismo código Laravel + React sirve para:

- **Landing / sitio corporativo**: slider, banners, servicios, casos, blogs, contacto, mapa.
- **eCommerce completo**: catálogo con filtros, detalle de producto con variantes, carrito, checkout, thank-you, tracking de pedido, login.
- **Lead-gen / hotel / coupling**: servicios, reservas, habitaciones, formularios.

No es un generador de plantillas: es un **motor de composición**. El sitio se arma con filas de la tabla `systems`; cada fila dice *qué tipo de componente* usar, *qué variante* y *con qué datos*.

---

## 2. El contrato: 5 archivos, se cambian juntos

```
storage/app/pages.json          ← QUÉ páginas existen (rutas + config)
storage/app/components.json     ← QUÉ componentes existen y qué data/using aceptan
app/Models/System.php          ← DÓNDE se guarda la composición (tabla `systems`)
resources/js/System.jsx        ← DÓNDE se resuelve component → <Tipo>
resources/js/Components/Tailwind/<Tipo>.jsx  ← DÓNDE se resuelve value (opción) → hijo
app/Http/Controllers/SystemController.php    ← DÓNDE se ejecuta el `using` (queries) y se arma el payload
```

Regla de oro: **una opción nueva en `components.json` sin su `case` en el dispatcher = pantalla en blanco o “No Hay componente X”.** Y al revés.

### 2.1 `storage/app/pages.json` — array de páginas

```jsonc
{
  "id": "uuid-v4",              // lo genera el admin (Crypto::randomUUID)
  "name": "Catalogo",
  "path": "/catalogo",          // se convierte en Route::get() real (routes/web.php)
  "pseudo_path": "/catalogo",   // path sin params; se usa para el iframe del admin
  "extends_base": true,         // si hereda header/footer del base template
  "menuable": true,             // aparece en el menú (props `pages` del front)
  "sitemapable": true,
  "referrable": true,           // conserva ?ref= de los referidos
  "using": {                    // datos de página -> props.filteredData
    "categories": { "model": "Category", "fields": ["id","slug","name"], "relations": ["subcategories"] },
    "slug": { "model": "Item", "field": "slug", "relations": ["brand","variants"] }
  }
}
```

- `path` con params: `/product/{slug}`. Al editar el path, `BasicEditing4System` crea solo la entrada `using[param] = {model: null}` y el `pseudo_path`.
- Resolución de página (`SystemController:82-87`): gana la página cuyo `pseudo_path||path` sea **prefijo más largo** del REQUEST_URI. Ej: `/product/123` matchea `/product/{slug}` y no `/`.
- Sin match: si el path es el UUID de un usuario → redirect `/?ref=uuid`; si no → `abort(404)`.
- `using` con `field` → carga 1 registro, si no existe → 404. Sin `field` → carga la colección. Con `"static": ...` → valor fijo.
- El resultado se guarda dos veces en el payload: por clave (`filteredData.categories`) y por modelo (`filteredData.Category`). Los componentes leen `filteredData.Item`, `filteredData.Post`, etc.

### 2.2 `storage/app/components.json` — 60 tipos / 389 variantes

```jsonc
{
  "id": "product-detail",       // = case del switch en System.jsx
  "name": "Detalle de producto",
  "icon": "mdi mdi-tag",
  "options": [{
    "id": "ProductDetailRainstar",   // = case del switch en ProductDetail.jsx  (PascalCase)
    "name": "Detalle Rainstar",
    "image": "…png",                 // decorativo, el admin no lo usa hoy
    "data": [ /* campos editables, ver DSL 2.3 */ ],
    "generals": ["cintillo", "phone_whatsapp"],   // llaves de `generals` que necesita
    "using": {                        // qué datos pide a la BD
      "model": "Item",
      "fields": ["id","name","price","final_price","image"],
      "with": ["brand", "variants"],
      "relations": ["tags"],
      "filters": ["featured"],        // bools que el admin puede activar (columna = true)
      "filters:method": "store",      // ids de la relación related → whereIn
      "limit": 5,
      "order": ["name", "asc"],
      "group_by_name": true,           // (frontend lo ignora hoy; se conserva por compat)
      "json": { "prefixes": "…json" }  // archivo JSON estático extra
    },
    "options": [{ "id": "default", "using": { … } }]  // subopciones (variantes de query)
  }]
}
```

Claves de `using` que el backend **sí** implementa (`SystemController:155-248`): `model`, `fields`, `with`, `scopes` (no usado en el json actual), `order`, `limit`, `json`. El resto (`filters`, `filters:method`, `group_by_name`) se resuelve combining `components.json` + lo guardado en la fila de `systems`.

### 2.3 DSL de `data` (lo que ve el admin en “Configurar datos”)

Cada string del array `data` se parsea en `DataModal.jsx:205-350`:

| Escritura | Resultado en el admin | Ejemplo |
| --- | --- | --- |
| `"title"` | textarea, label = `title` | |
| `"class:Clase CSS"` | textarea con label | `"class_content"` → label `class_content` |
| `"bool:showForm:Mostrar Formulario"` | radio Sí/No → booleano real | |
| `"select:type_card:Tipo:CardA|A,CardB|B,none|Ninguno"` | select; el **valor** es la clave y debe existir como opción en otro componente | |
| `"select-multiple:…"` | multiselect (hoy no usado) | |
| `"code:body:HTML"` | editor enriquecido (modal grande) | |

Además, siempre disponibles sin declararlos en `data`: `scroll_animation`, `scroll_duration`, `scroll_delay`, `scroll_easing`, `scroll_disabled` (pestaña Animación) y `header_solid` / `header_static` (los lee `PageContext`).

**El `value` de un `select:` debe coincidir con el `id` de una opción real** de otro tipo (ej. `type_card_product:CardProductKatya` → el `case "CardProductKatya"` de `Product.jsx`). Si no existe, el selector no renderiza nada.

### 2.4 Dispatcher frontend

- `System.jsx` `getSystem({component, value, data, itemsId, visible, element_id})`:
  - `visible == 0` → no renderiza.
  - mete `element_id` dentro de `data`.
  - aplica `ScrollAnimation` salvo en `floating, header, top_bar, footer, menu, bottombar`, y lo desactiva en móvil.
  - `case "content"` → **punto de inyección del cuerpo de la página**.
  - props comunes a todos: `data`, `which`, `items`, `cart`, `setCart`, `cartTotals/subTotal/igv/perception/totalPrice`, `pages`, `generals`, `session`, `stores`, `headerPosts`, `contacts`, `categorias`, `referrer`, `filteredData`.
- Orden de render: `SortByAfterField(systems)` (cadena `after_component`).
- `resources/js/Components/Tailwind/<Tipo>.jsx` = switch de `which` con `React.lazy` a `./<Carpeta>/<Opcion>`.

### 2.5 La tabla `systems` (la composición)

`app/Models/System.php` — una fila = un componente colocado.

| Campo | Uso |
| --- | --- |
| `id` | uuid |
| `name` | etiqueta en el admin |
| `component` | **tipo**: `header`, `product`, `content`, … |
| `value` | **opción**: `HeaderSearchMenu`, `ProductDetailRainstar`, … |
| `page_id` | `null` = base template; si no, id de la página de `pages.json` |
| `after_component` | id del anterior; `null` = primero. Es una **lista enlazada**, no un índice |
| `data` | json con lo del DSL |
| `filters`, `filters_method`, `filters_method_values` | recorte de la query de `using` |
| `element_id` | ancla `#id` para CSS/nav; autogenerado (`component-value-shortid`) |
| `visible` | 0 = apagado sin borrar |

**`content` es un pseudo-componente**: no existe en `components.json`. Es una fila manual con `component = "content"` y `value = null` que vive en el base template. **Su posición define dónde se inyecta el contenido de cada página.** Sin esa fila, las páginas con `extends_base` renderizan solo el base.

El orden no lo decide un índice: lo resuelve `resources/js/Utils/SortByAfterField.js`, que recorre la lista enlazada hacia atrás, detecta referencias circulares (console warning) y pone al final las filas cuyo `after_component` no existe (ordenadas por `created_at`). Un `after_component` mal puesto no rompe la página, solo desordena.

Estado actual del base de esta instancia: `header → content → floating → footer`.

---

## 3. Ciclo de una visita

```
GET /catalogo
  └─ routes/web.php:103-116   lee pages.json (Cache 'cached_pages_routes', 86400s) y registra Route::get(path)
     └─ SystemController@setReactViewProperties
        ├─ cacheKey react_view_props_{md5(path)}  (600s)
        ├─ resuelve la página por prefijo más largo
        ├─ /base-template → solo page_id null; si no → whereNull(page_id) OR page_id = id
        ├─ por cada system (≠ content):
        │    ├─ busca tipo+opción en components.json
        │    ├─ si using → query (select fields, with, order, filters, limit, visible, status, order_index)
        │    │     → $props['systemItems'][shortId] y $system->itemsId
        │    ├─ si using.json → $props['jsons'][key]
        │    └─ si generals → suma llaves
        ├─ generals = lista SEO base + llaves de las opciones (Cache 'generals_set_*', 3600s)
        ├─ page.using → $props['filteredData'] (404 si el registro no existe)
        └─ globales: stores / faqs / postsLatest / categorias / headerPosts / textstatic
     └─ Inertia renderiza `System.jsx` con ese payload
        └─ System.jsx recorre systems ordenados y despacha cada uno
```

Payload recortado a propósito: `pages` solo lleva `name/path/pseudo_path/menuable`; `components` se envía vacío (`SystemController:400-410`).

### 3.1 Caché (si no limpias, no ves tus cambios)

| Clave | TTL |
| --- | --- |
| `cached_pages_routes` | 86400s (**rutas nuevas no aparecen**) |
| `react_view_props_{md5}` | 600s |
| `global_pages_json`, `global_components_json` | 3600s |
| `generals_set_{md5}` | 3600s |
| `global_stores_active`, `global_faqs_active`, `global_categories_nav`, `global_posts_*`, `global_aboutus_static` | 3600s |
| `schema_columns_{tabla}` | 86400s (columnas nuevas) |

El admin hace `Cache::flush()` al guardar. Cuando edites JSON o BD a mano:

```bash
php artisan cache:clear
php artisan config:clear   # solo si agregaste/quitaste rutas
```

---

## 4. Datos: colores, settings, generals

- **Colores**: tabla `system_colors` (12 slots fijos) → CSS vars `--bg-*` → escala Tailwind completa con `color-mix`. Slots: `primary, secondary, accent, neutral-light, neutral-dark, page-background, sections-color, warning, danger, info, success, menu-admin`. Usar `bg-primary`, `text-primary-700`, `border-accent/20`, `shadow-primary/30`. **Un color nuevo exige editar `tailwind.config.js`** (array `colors` + safelist), no solo la BD.
- **Settings** (`Setting`, editable en el panel derecho de /admin/system): `title-font-name|url|source`, `paragraph-font-name|url|source`. Son las únicas fuentes globally; cada componente puede sobrescribir con `font-*`.
- **Generals** (`General`, CRUD en `/admin/generals`): tabla clave→valor con `correlative`, `name`, `description`, `data_type`, `status`. El backend solo carga los que algún componente declara en `generals`, más la lista SEO base. En el frontend: `generals.find(g => g.correlative === 'x')?.description` o `Global.APP_NAME` / `General::get('currency')`.
- **Contenido**: todo lo que se muestra como colección viene de un modelo (`Item`, `Category`, `SubCategory`, `Brand`, `Collection`, `Slider`, `Banner`, `Indicator`, `Post`, `Faq`, `Service`, `Testimony`, `Strength`, `Benefit`, …). Modelos + campos + relaciones: `docs/MODELS_DOCUMENTATION.md`.

---

## 5. Cómo nace un componente (checklist, sin excepciones)

1. **JSX hijo**: `resources/js/Components/Tailwind/<Tipo>/<Carpeta>/<Opcion>.jsx`. Props: `{ data, which, items, ...propsGlobales }`. Lee SIEMPRE de `data` con valor por defecto (`data?.title ?? '…'`) para no romper si el admin no configuró nada. Usa las clases de color del sistema, no hex sueltos.
2. **Dispatcher del tipo**: añadir `const X = React.lazy(() => import('./<Carpeta>/X'))` + `case "X":` en `Components/Tailwind/<Tipo>.jsx`.
3. **Tipo nuevo** (además): import + `case "<tipo>":` en `resources/js/System.jsx`, y decidir si entra o no en `noAnimationComponents`.
4. **`components.json`**: añadir la opción con `id` = `case` exacto, `name` legible, `data` (solo campos que de verdad se editan), `using` si consume colección, `generals` si usa `generals`.
5. **Fila**: crearla desde el admin, editando el JSON, o por consola; luego `php artisan cache:clear`.
6. **Verificar**: `npm run build` (obligatorio con JSX nuevo) y abrir la página real.

Atajo opcional (no es el flujo de construcción): `php artisan builder:page "Nombre" /ruta --section="<tipo>:<Opcion>"` valida contra `components.json`, encadena `after_component`, genera `element_id`, hace backup del JSON y `Cache::flush()`. Ver `docs/BUILDER_PLAYBOOK.md` §4.2.

Convención de nombres: tipo en `kebab-case` (`product-detail`, `forgot-password`, `delivery-zones`), opción en `PascalCase`, carpeta hija plural o por dominio (`Headers/`, `Sliders/`, `Scraping/`, `Thanks/`, `Components/`).

---

## 6. Reglas que se olvidan y rompen la web

- Agregar la opción a `components.json` pero no el `case` (o al revés) → pantalla vacía.
- Olvidar la fila `content` en el base template → las páginas no muestran su cuerpo.
- Poner `extends_base: false` y no declarar header/footer → página pelada.
- Rutas nuevas en `pages.json` sin `php artisan cache:clear` → 404.
- `using.fields` o `using.with` con nombres que no existen → 500 en la primera visita.
- Cambiar el `id` de un tipo/opción ya usado → hay que actualizar también las filas de `systems` (`value`) y las referencias `select:`.
- `element_id` duplicado → anclas/CSS colisionan.
- Editar `data` desde el backend sobrescribiendo en vez de hacer merge (el admin ya mergea).
- `visible`/`status` se filtran **solos** si la columna existe **en la tabla consultada** (`Item`, `Slider`, …); para saltarlos: `filters: ["ignoreVisibility"]` / `["ignoreStatus"]`. Las filas de `systems` no se filtran ni se ordenan por eso: su orden es solo `after_component`.
- Escribir hex de marca directamente en un componente en vez de `primary/accent/…` (la marca se cambia desde el admin, no desde el código).

---

## 7. Verificación

```bash
npm run build          # obligatorio tras crear/modificar JSX
php artisan cache:clear
php artisan test       # si hay cambios de backend
```

En el navegador: `/admin/system` (solo rol Root) muestra el editor con iframe por página; ahí se Drag & Drop, se edita `data`, SEO y `using`. El iframe es la verificación real de que el componente renderiza.
