# Dream Library

Biblioteca virtual personal inmersiva. Los usuarios fotografían el código de barras de un libro físico, la app lo identifica vía Google Books / Open Library y lo añade a una biblioteca 3D donde pueden visualizarlo, abrirlo si tienen el archivo digital (PDF/EPUB) y consultar fechas de próximos tomos de la saga.

## Stack

- **Frontend** Vite + React 19 + TypeScript + react-three-fiber + drei + Tailwind + shadcn/ui + Zustand + TanStack Query
- **Backend** Node.js 22 + Fastify 5 + TypeScript + Drizzle ORM + Zod + pino
- **DB** PostgreSQL 17 (Docker en local; Neon / Supabase / VPS en producción)
- **Storage** Cloudflare R2 (portadas, EPUBs, PDFs)

## Estructura

```
dream-library/
├── shared/         tipos zod compartidos cliente↔servidor
├── src/
│   ├── frontend/   app web (Vite)
│   └── backend/    API REST (Fastify)
├── docker-compose.yml
└── .github/workflows/
```

## Arranque rápido

```bash
cp .env.example .env
docker compose up -d postgres
npm install
npm run db:push
npm run dev
```

- Frontend en `http://localhost:5173`
- API en `http://localhost:4000`
- Swagger en `http://localhost:4000/docs`
- Health en `http://localhost:4000/health`

## Scripts raíz

| Script                | Acción                                     |
| --------------------- | ------------------------------------------ |
| `npm run dev`         | Frontend y backend en paralelo             |
| `npm run build`       | Build de todos los workspaces              |
| `npm run lint`        | ESLint en todo el repo                     |
| `npm run format`      | Prettier write                             |
| `npm run typecheck`   | tsc --noEmit en cada workspace             |
| `npm run db:generate` | Genera migraciones desde el schema Drizzle |
| `npm run db:push`     | Aplica el schema directamente (desarrollo) |
| `npm run db:studio`   | Drizzle Studio (UI de la DB)               |

## Documentación

Antes de tocar código:

- [`CLAUDE.md`](CLAUDE.md) — guía corta para agentes (auto-loaded por Claude Code) con las reglas no-negociables y los comandos comunes.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — stack, monorepo, ciclo de vida de una request, auth, DB, errores, decisiones notables.
- [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) — recetas paso a paso para añadir features siguiendo el patrón route → service → repository.
- [`docs/SETUP.md`](docs/SETUP.md) — setup local detallado (Postgres real, PGlite, Docker), reset de DB, troubleshooting.
