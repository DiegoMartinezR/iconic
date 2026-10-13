# Builder SaaS Platform — Arquitectura Multicliente

Plataforma CMS & E-commerce Headless multicliente construida sobre **Laravel 11, React (Inertia.js), PostgreSQL 16 y Docker**. 

Evolución integral del modelo monolítico basado en copias individuales a una **arquitectura SaaS multi-inquilino (*schema-per-tenant*)** capaz de desplegar sitios web y tiendas virtuales instantáneas bajo subdominios dinámicos, con aislamiento estricto de datos, aprovisionamiento automatizado y plantillas prediseñadas.

---

## 🚀 Evolución Arquitectónica (Antes vs. Ahora)

| Eje | Antes (Plantilla Monolítica por Copia) | Ahora (Plataforma Multicliente SaaS) |
| :--- | :--- | :--- |
| **Entorno Local / Prod** | XAMPP / Apache manual | **Docker Compose** (Nginx, PHP 8.2 FPM, PostgreSQL 16, Redis, Queue Worker) |
| **Base de Datos** | MySQL (1 base de datos física por cliente) | **PostgreSQL 16** con arquitectura **Schema-per-Tenant** (1 esquema aislado por inquilino) |
| **Identificadores** | IDs correlativos adivinables (`AUTO_INCREMENT`) | **UUID v7** (secuenciales temporales, óptimos para indexación B-Tree en PG) |
| **Multicliente** | Clonar repositorio y base de datos para cada cliente | **Instalación única (Single Codebase)** que sirve N dominios/subdominios dinámicamente |
| **Landing Raíz** | Pantalla estática "Próximamente" (`coming-soon.blade.php`) | **Landing SaaS** de alta conversión con SEO técnico, OpenGraph y JSON-LD estructurado |
| **Onboarding** | Configuración manual de `.env` y ejecución de scripts | **Flujo de registro guiado (Wizard)** con validación en tiempo real de **DNI y RUC** |
| **Verificación** | Inexistente (activación manual) | Verificación de identidad con **código OTP de 6 dígitos** enviado al correo |
| **Gestión Titulares** | Datos duplicados y dispersos en cada instalación | **Modelo Centralizado**: Un titular (DNI/RUC) gestiona múltiples webs/inquilinos |
| **Panel de Control** | Panel único sin jerarquía SaaS | Doble panel: **SuperAdmin (Equipo de plataforma)** y **Client Admin (Tenant Admin)** |
| **Monetización** | Cobro manual / sin facturación recurrente | **Planes y Suscripciones** segmentados por tipo de sitio (Básico, Pro, Corporativo) |
| **Puesta en Marcha** | Armado bloque por bloque desde cero | **4 Presets Preconfigurados** con páginas, menús y bloques listos para producción |
| **Notificaciones** | Librerías dispares (`CustomNotify`, `sweetalert2`) | Sistema unificado de toasts reactivos con **`sonner`** |
| **Servicio de Correo** | Credenciales Gmail personales en repo | **SMTP corporativo autenticado**, plantillas HTML unificadas y encolamiento Redis |
| **Marca Blanca** | Referencias hardcodeadas en 31 archivos | **Configuración centralizada de marca** en un único punto de configuración |
| **Control de Calidad** | Migraciones y flujos de login inconsistentes | **293 migraciones portadas a PG16**, ~106 tablas por esquema y suite de tests continua |

---

## 🏗️ Diagrama de Arquitectura Multicliente

```
                            [ Tráfico Web / Clientes ]
                                        │
                         *.tudominio.com / dominios custom
                                        │
                                        ▼
                             ┌─────────────────────┐
                             │ Nginx Reverse Proxy │ (SSL Wildcard / Let's Encrypt)
                             └──────────┬──────────┘
                                        │
                                        ▼
    ┌────────────────────────────────────────────────────────────────────────┐
    │                      Laravel Application (PHP-FPM)                     │
    │                                                                        │
    │  [ Subdomain / Domain Identification Middleware ]                      │
    │  ├─ SuperAdmin / Central Domain ──► Esquema: "public"                   │
    │  └─ Inquilino (ej: cliente.tudominio.com) ──► SET search_path = tenant_uuid │
    │                                                                        │
    │  [ Stack Frontend: React 18 + Inertia.js + Tailwind CSS + Sonner ]     │
    │  [ Queue Worker: Procesamiento asíncrono con Redis (OTP, correos, etc) ]│
    └───────────────────────────────────┬────────────────────────────────────┘
                                        │
                                        ▼
    ┌────────────────────────────────────────────────────────────────────────┐
    │                        PostgreSQL 16 Engine                            │
    │                                                                        │
    │  ┌───────────────────────┐          ┌───────────────────────────────┐  │
    │  │   Esquema "public"    │          │  Esquemas "tenant_{uuid}"     │  │
    │  ├───────────────────────┤          ├───────────────────────────────┤  │
    │  │ • tenants             │          │ • ~106 tablas por inquilino:  │  │
    │  │ • domains             │          │   - generals, systems         │  │
    │  │ • owners (DNI / RUC)  │          │   - pages, components         │  │
    │  │ • plans_subscriptions │          │   - products, orders, items   │  │
    │  │ • global_users        │          │   - posts, categories, blogs  │  │
    │  └───────────────────────┘          └───────────────────────────────┘  │
    └────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Requisitos del Sistema

- **Docker Desktop** (v24.0+) & **Docker Compose** (v2.20+)
- **PHP** >= 8.2 (si se ejecuta fuera de contenedor)
- **Node.js** >= 20.x & **NPM** >= 10.x
- **PostgreSQL** 16+
- **Redis** 7.x

---

## 📦 Despliegue Rápido con Docker

### 1. Clonar el repositorio y preparar entorno
```bash
git clone https://github.com/tu-organizacion/builder-saas.git
cd builder-saas
cp .env.example .env
```

### 2. Configurar variables clave en `.env`
```env
APP_NAME="Builder SaaS"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

# Base Central PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=builder_saas
DB_USERNAME=builder_admin
DB_PASSWORD=secret_postgres_password

# Cache y Colas
CACHE_STORE=redis
QUEUE_CONNECTION=redis
REDIS_HOST=redis
REDIS_PORT=6379

# Dominio Central
CENTRAL_DOMAINS="localhost,builder.local,builder.pe"

# Servicios de Validación DNI / RUC
APISPERU_TOKEN="tu_token_aqui"
```

### 3. Levantar los servicios de infraestructura
```bash
docker compose up -d --build
```

### 4. Inicializar la plataforma central
```bash
# Entrar al contenedor de aplicación
docker compose exec app bash

# Generar clave de cifrado
php artisan key:generate

# Correr migraciones del esquema central (public)
php artisan migrate --path=database/migrations/central

# Generar datos iniciales (Planes, Roles y SuperAdmin)
php artisan db:seed --class=CentralDatabaseSeeder

# Compilar assets frontend
npm install && npm run build
```

---

## 🏢 Arquitectura de Inquilinos (*Tenant Management*)

### Aislamiento por Esquemas de PostgreSQL
Cada cliente registrado obtiene un esquema independiente dentro de PostgreSQL 16 (`tenant_018f...`). Esto garantiza:
1. **Seguridad Absoluta:** Un inquilino nunca puede filtrar ni acceder por error a las tablas de otro cliente.
2. **Backups y Restauraciones Selectivas:** Se puede respaldar o restaurar la tienda de un cliente individual con `pg_dump -n tenant_{id}` sin congelar toda la base de datos.
3. **Escalabilidad y Rendimiento:** Índices optimizados por esquema sin bloating de tablas globales gigantescas.

### Ciclo de Aprovisionamiento de un Inquilino
Cuando un nuevo cliente se registra desde la Landing:
1. **Validación:** Se valida su DNI / RUC mediante API oficial (Reniec/Sunat).
2. **Verificación:** Se genera un código OTP de 6 dígitos enviado por correo mediante cola de Redis.
3. **Creación:** Se registra el inquilino en `public.tenants` y su subdominio en `public.domains`.
4. **Migración:** El sistema ejecuta de forma aislada las ~106 tablas en el nuevo esquema:
   ```bash
   php artisan tenant:create --name="Boutique Lima" --subdomain="boutique" --preset="ecommerce"
   ```
5. **Carga de Preset:** Se pueblan las páginas y bloques según la plantilla elegida.

---

## 🎨 Catálogo de Presets Disponibles

La plataforma no entrega una hoja en blanco; provisiona sitios funcionales listos para operar:

| Preset | Audiencia Objetivo | Páginas y Componentes Incluidos |
| :--- | :--- | :--- |
| **`ecommerce`** | Tiendas virtuales de ropa, tecnología o retail | Catálogo, filtros, carrito deslizante, pasarelas de pago (Culqi/MercadoPago), checkout y seguimiento de pedidos. |
| **`catalog`** | Empresas B2B o distribución mayorista | Catálogo de productos con cotizador directo vía WhatsApp, fichas técnicas descargables y sin pasarela directa. |
| **`services`** | Consultorías, agencias, clínicas, estudios | Páginas de servicios, testimonios, formulario de prospección calificado, banners corporativos y sección "Nosotros". |
| **`portfolio`** | Fotógrafos, arquitectos, creativos | Galerías masonry, slider de proyectos destacados, biografía y formulario de contacto optimizado. |

---

## 🛠️ Comandos Artisan Específicos

| Comando | Descripción |
| :--- | :--- |
| `php artisan tenant:create` | Crea manualmente un nuevo inquilino, genera su esquema y aplica migraciones. |
| `php artisan tenant:migrate` | Ejecuta migraciones pendientes en **todos** los esquemas de inquilinos activos. |
| `php artisan tenant:seed {id} --preset={name}` | Aplica un preset de diseño específico a un inquilino existente. |
| `php artisan tenant:backup {id}` | Exporta un dump comprimido `.sql.gz` del esquema del inquilino seleccionado. |
| `php artisan robots:generate` | Regenera los archivos `robots.txt` y `llms.txt` por inquilino respetando sus políticas. |
| `php artisan sitemap:generate` | Genera los sitemaps XML individuales para indexación en Google Search Console. |

---

## 🔒 Seguridad y Buenas Prácticas

- **Cero Credenciales en Código:** Variables críticas gestionadas exclusivamente mediante `.env` o secretos de Docker.
- **Identificadores UUID v7:** Claves primarias no predecibles, evitando ataques de enumeración y optimizando la inserción secuencial.
- **Aislamiento de Almacenamiento:** Archivos multimedia organizados por inquilino:
  `storage/app/tenants/{tenant_uuid}/images/` expuestos mediante enlaces simbólicos independientes o buckets S3 con prefijos dedicados.
- **Protección contra CSRF y Headers de Seguridad:** Middleware global que inyecta encabezados `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security` y `Referrer-Policy`.

---

## 🧪 Pruebas Automatizadas

Para validar que los contratos de inquilinos, la conmutación de esquemas y las migraciones funcionen sin anomalías:

```bash
# Ejecutar suite de pruebas completa en entorno de prueba aislado
php artisan test

# Probar únicamente la conmutación de esquemas multicliente
php artisan test --filter=TenantSwitchTest
```

---

## 📄 Licencia

Este proyecto es software propietario desarrollado para la infraestructura de **Builder SaaS**. Todos los derechos reservados.
