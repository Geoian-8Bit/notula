# Roadmap de Notula

Estado actualizado a **2026-05-08**.

## Hecho

### Bootstrap (commit `cacfb70`)

- Monorepo npm workspaces (`shared`, `src/backend`, `src/frontend`)
- Stack base: Fastify 5 + Drizzle + zod + pino (backend); Vite + React 19 + r3f + Tailwind + Zustand + TanStack Query (frontend)
- Schema Drizzle completo del dominio (users, book_series, books, book_editions, user_library, reading_progress, book_files, scan_logs)
- DevOps: Dockerfiles, docker-compose, GitHub Actions (CI + Security), husky, lint-staged, commitlint, gitleaks, ESLint flat, Prettier, .editorconfig, .nvmrc

### Hardening de seguridad (commits `e9dad69`, `465564c`)

- `drizzle-orm` ≥ 0.45.2 vía override (CVE GHSA-gpj5-g38j-94v9 SQL injection corregido)
- `react-reader` quitado del frontend (vulnerable a través de `@xmldom/xmldom`)
- `legacy-peer-deps=true` para que React 19 conviva con peers opcionales de drizzle-orm
- Workflow `gitleaks` reescrito como invocación directa (la action @v2 se rompía con commits raíz)

### Auth (commit `acd23c0`, `d4080da`)

- **Better Auth** con drizzleAdapter, email + password, cookies de sesión
- Tablas `sessions`, `accounts`, `verifications` en el schema
- Endpoint `/api/auth/*` montado como catch-all en Fastify
- preHandler `requireUser` protege `/api/v1/*` (devuelve 401 si no hay sesión)
- Frontend: `<RequireAuth>`, páginas `SignIn` y `SignUp` con la estética parchment/accent + Cormorant Garamond
- Sign-out en la cabecera de la escena 3D
- CI con servicio Postgres real corriendo tests de integración (sign-up → cookie → endpoint protegido)

### Setup local (commit `39d22fb`)

- **Driver dual** en `db/index.ts`: postgres-js o PGlite según prefijo de `DATABASE_URL`
- Auto-migración en boot de dev
- `scripts/init-postgres.ps1` + `init-postgres.sql` para crear roles y DB en Postgres nativo de Windows
- `local.pgdata/` y `scripts/init-postgres.sql` gitignored

### Patrón de capas (commit `c99c332`)

- Convención canónica **route → service → repository** establecida con `books` como ejemplo
- Mapper Date → ISO en service para wire shape pura JSON
- Schemas zod compartidas en `@notula/shared` para request, response, errors
- Cliente API tipado en frontend (`src/frontend/src/api/books.ts`) que re-parsea respuestas
- Tests por capa: unit del service (mock repo) + integration de la route (DB real)
- Bug detectado y corregido: `setErrorHandler` ahora se setea **antes** de los `register()`

## En curso

Nada actualmente en progreso. La base está lista para empezar features MVP.

## Pendiente — MVP

### 1. Escáner ISBN (siguiente recomendado)

**Por qué primero:** ejercita el patrón end-to-end y da el efecto "guau" más rápido (apuntas el móvil a un libro, aparece). Toca todas las capas.

Tareas:

- Componente `<Scanner />` en `src/frontend/src/scanner/` que abre la cámara con `@zxing/browser` y decodifica códigos de barras EAN-13 / ISBN
- Página o modal que muestra el scanner y, al detectar, llama `findEditionByIsbn(isbn)` del cliente API
- Backend: enriquecer `GET /api/v1/books/by-isbn/:isbn` para que **si la edition no existe en local, llame a Google Books o Open Library, persista la nueva edition + book + cover, y devuelva**. Service nuevo `metadataLookupService` con cliente HTTP a esas APIs.
- Tabla `scan_logs` cobrar uso (cada escaneo, qué resolvió)
- Variables `GOOGLE_BOOKS_API_KEY` y `HARDCOVER_API_TOKEN` ya en `.env.example`
- Endpoint `POST /api/v1/library` para añadir una edition a la biblioteca del usuario logueado
- Tests: unit del metadataLookupService (mock fetch), integration del endpoint by-isbn con un mock de Google Books

### 2. Escena 3D real

**Por qué después del escáner:** sin libros en la biblioteca, la escena no tiene nada que pintar.

Tareas:

- Componente `<Library />` carga `useQuery(['library'], listMyLibrary)` y pinta una estantería procedural con N libros
- Modelo de libro 3D (geometría parametrizada por dimensiones de la edition; texturas con la portada via R2)
- Animaciones de drei: `useSpring`, hover/click → libro sale de la estantería y se "abre"
- Cámara orbital + controles touch para móvil
- Performance: instancing si hay >50 libros, frustum culling, LOD
- Endpoint nuevo `GET /api/v1/library` (user's owned editions joined con books)

### 3. Storage R2

**Por qué:** las portadas y los EPUB/PDF necesitan storage. Ahora mismo `book_files` está en schema pero sin uso real.

Tareas:

- Cliente S3-compatible para Cloudflare R2 en backend
- Endpoint `POST /api/v1/library/:editionId/files` con upload multipart (portada, EPUB, PDF)
- URL firmada (presigned) para download del lado cliente sin exponer credenciales
- Variables `R2_*` ya en `.env.example`

### 4. Lector EPUB / PDF

**Por qué último:** primero hay que tener el archivo (R2) y la edition (escáner). Y porque la librería que usábamos (`react-reader`) tenía vulns; hay que elegir alternativa.

Tareas:

- Investigar opciones: `foliate-js`, `@nuxt/reader`, custom con jszip + epub spec, o react-reader cuando publiquen versión sin vuln
- Componente `<Reader />` en `src/frontend/src/reader/`
- Persistencia del progreso (`reading_progress.currentPage`)
- PDF: `react-pdf` ya instalado y sin vulns

### 5. Tracking de salidas de sagas

**Por qué:** feature de núcleo del MVP, simple comparada con escáner.

Tareas:

- UI que liste series con `totalPlanned` y muestre cuántos toques tiene el usuario
- `expectedReleaseDate` en `books` ya está en schema; falta UI para editarlo o pull desde Google Books / Hardcover
- Notificación in-app cuando una fecha se acerca (push para futuro)

## Pendiente — pre-features pero diferible

Cosas que mejorarán la base pero no bloquean empezar features:

- **Email verification + reset password** — necesita conectar Resend / Postmark / SES. ~30 min cuando vaya a invitarse a alguien.
- **Test DB separada** — los tests ahora pollan la DB de dev. Crear `notula_test` y apuntar `DATABASE_URL` distinto en CI/local tests. ~1h.
- **Prod-ready migrations** — script `db:migrate` que corre fuera de boot, para deploy. ~1h.
- **Workflow CI: actualizar acciones a Node 24** — `actions/checkout@v4` y `setup-node@v4` corren sobre Node 20, deprecación 2026-06-02. Esperar a que publiquen `v5` (probablemente Q1 2026). Si tarda, añadir `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true`.
- **Drizzle Studio** como `npm run db:studio` para inspeccionar datos sin pgAdmin. Drizzle-kit ya soporta. ~5 min de docs.

## Pendiente — post-MVP / nice-to-have

- **OAuth Google + Apple** — plugins de Better Auth, ~15 min cada uno + dar de alta en consolas correspondientes.
- **2FA / passkeys** — plugins de Better Auth.
- **Multi-tenant orgs** — plugin de Better Auth, cuando llegue B2B (biblioteca familiar / club de lectura).
- **PWA install prompt** — `vite-plugin-pwa` ya configurado, falta el UX layer.
- **Capacitor** para iOS/Android — wrap de la PWA. Requiere cambiar de cookies a JWT bearer tokens.
- **Decoración cosmética** de las estancias (pines, macetas, etc.) — del enunciado original.
- **Compartir bibliotecas / clubs de lectura** — multi-tenant.
- **Sentry / observabilidad** — pino ya estructura logs; falta sink en prod.
- **i18n** — en/es, react-i18next.
- **Analytics privacy-friendly** — Plausible o Umami.
- **Billing** — Stripe cuando se monetice.

## No-goals (por ahora)

Cosas que se han decidido **NO** hacer y por qué, para que ningún agente pierda tiempo proponiéndolas:

- **NoSQL** (Mongo, DynamoDB) — el dominio es claramente relacional (libros, series, ediciones, usuarios). Postgres + Drizzle.
- **GraphQL** — REST + zod + tipos compartidos da el 95% del beneficio sin la complejidad.
- **Microservicios** — un monolito modular con la convención de capas escala perfectamente para los próximos 2 años de crecimiento previsible.
- **CSS-in-JS** — Tailwind es la elección. Cohabitar con CSS-in-JS rompe consistencia.
- **Redux** — Zustand para estado UI, TanStack Query para datos remotos. Suficiente.
- **MUI / Chakra / Mantine** — Tailwind + shadcn/ui (componentes copiados, no librería) cuando hagan falta primitivas. Permite estética inmersiva sin pelear con un design system genérico.

## Referencias

- Issues / bugs: usa GitHub Issues en https://github.com/Geoian-8Bit/notula
- PRs: branch desde `main`, PR a `main`, CI debe estar verde
- Conventional commits exigidos por commitlint (ver `commitlint.config.cjs`)
