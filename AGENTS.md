# AGENTS.md — Builder SaaS

> Instrucciones del proyecto builder. Sí va al git.
> Lo específico de cada negocio/marca vive en `brief/`, no aquí.

## 1. Qué es este proyecto

- Builder de páginas e-commerce con drag & drop (Rhino Technology). Un mismo código sirve para landing, sitio corporativo, e-commerce, lead-gen o hotel.
- **El mecanismo está en `CONTEXT.md`** (contrato entre `pages.json`, `components.json`, tabla `systems`, `System.jsx` y `SystemController`).
- Contexto de negocio/marca: `brief/README.md` + `brief/BRANDBOOK.md`.

## 1.b. Pedido típico: "genera un <sitio> según `brief/`"

Flujo obligatorio, en este orden:

1. Leer `brief/` completo y extraer requisitos (ver `docs/BUILDER_PLAYBOOK.md` §1).
2. Proponer el mapa `sección del brief → tipo:Opción` de `docs/COMPONENTS_CATALOG.md` (60 tipos / 389 variantes) y **esperar visto bueno** antes de escribir. **Reusar antes que crear.**
3. Si algo no es viable: extender una opción (`data:` + default) o crear una nueva variante siguiendo el checklist de `CONTEXT.md` §5. Registrar en `components.json` **y** en el dispatcher.
4. Declarar las páginas que pidió el brief en `storage/app/pages.json` (o por el admin `/admin/system`).
5. Componer: base template (incluida la fila `content`) + filas por página, en el orden que pidió el brief.
6. Cargar marca y contenido: `system_colors`, `Setting` de fuentes, `generals`, registros reales.
7. `php artisan cache:clear` y verificar (`npm run build`, rutas, móvil).

El agente compone según el pedido; no existe un generador genérico. `php artisan builder:page` es solo un atajo opcional para una página puntual, no el flujo de construcción (ver `docs/BUILDER_PLAYBOOK.md` §4.2).

Detalle y recetas landing/e-commerce: `docs/BUILDER_PLAYBOOK.md`.

## 2. Stack real (código actual, verificado)

- Backend: `composer.json`: PHP `^8.1`, Laravel `^10.10`, Inertia `^1.2`, Livewire `^3.4`, Sanctum, Spatie permission/sitemap, Culqi, MercadoPago, `sode/extend`.
- Frontend: `package.json`: React `^18.3.1`, `@inertiajs/react`, Tailwind `^3.4.6`, Vite `^6.2.6`, Mantine, BlockNote, TinyMCE, Framer Motion, Swiper.
- Dev local: XAMPP/Apache, MySQL, `serve.cmd` -> `npm run dev` + `php artisan serve --port=9000`.
- Build: `npm run build`. `build.cmd` hace build + commit + push (no usar sin pedirlo).
- Editor visual: `/admin/system` (solo rol `Root`). Ahí se hace drag & drop, `data`, SEO y `using` por página.

## 3. Stack objetivo (solo docs, no implementado aún)

- `docs/README_SAAS.md`: Laravel 11, React Inertia, PostgreSQL 16 schema-per-tenant, Docker (Nginx/PHP-FPM/Redis/Queue), UUID v7, planes/suscripciones.
- No asumir que el código ya es SaaS. Si la tarea pide multitenant, citar ese doc y proponer migración.

## 4. Orden de lectura para ahorrar tokens

1. Este `AGENTS.md`.
2. `CONTEXT.md` — siempre que la tarea toque páginas, componentes o el builder.
3. `brief/README.md` y `brief/BRANDBOOK.md` — contexto de la instancia (negocio/marca).
4. Solo lo necesario de `docs/`:
   - Builder: `docs/BUILDER_PLAYBOOK.md`, `docs/COMPONENTS_CATALOG.md`
   - SaaS/arquitectura: `docs/README_SAAS.md`
   - Pagos: `docs/README_CULQI.md`, `docs/OPENPAY_INTEGRATION.md`, `docs/README_BILLETERA.md`
   - Modelos: `docs/MODELS_DOCUMENTATION.md`
   - Email/cache/SEO: `docs/EMAIL_SYSTEM_UNIFIED.md`, `docs/CACHE_SYSTEM.md`, `docs/SEO_*.md`
5. `MEMORY.md` local si existe (aprendizajes previos, no commitear).
6. No leer por defecto: `vendor/`, `node_modules/`, `storage/framework/views/`, `graphify-out/` (solo bajo demanda con query puntual), ni `storage/app/components.json` completo (usar `docs/COMPONENTS_CATALOG.md` o grep puntual).

## 5. Reglas de trabajo

- Español para respuestas. Conciso, sin superlativos.
- Preferir `read`/`edit`/`glob`/`grep` sobre `bash` para archivos. `bash` solo para `git`, `npm`, `artisan`.
- No crear archivos nuevos si basta editar. No crear `*.md` de docs salvo pedido explícito.
- Verificar con ejecución cuando se implemente/fixee: `php artisan test`, `npm run build`.
- Después de editar `pages.json` / `components.json` / BD a mano: `php artisan cache:clear` (el admin lo hace solo).
- Colores siempre por clases del sistema (`primary`, `accent`, `page-background`…), nunca hex de marca en JSX.
- No tocar `build.cmd` ni hacer commit/push sin que lo pidan.

## 6. Gitignore esperado

- Sí al git: `AGENTS.md`, `CONTEXT.md`, `brief/*.example.md`, `MEMORY.example.md`, `docs/`, `tools/`.
- No al git: `.env`, `MEMORY.md`, `brief/README.md`, `brief/BRANDBOOK.md`, `graphify-out/`, `.agents/local/`.
