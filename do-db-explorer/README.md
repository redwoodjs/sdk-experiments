# DoX — Durable Object SQLite Explorer (RedwoodSDK)

A small, production-ready example showing how to browse and edit a Durable Object (SQLite) database using RedwoodSDK. It lists tables, shows row counts, allows inline edits, inserts new rows, and can seed data using Workers AI — all inside a single Worker.

## Features

- Tables are discovered from `sqlite_master`
- Row counts per table in a left-hand navigation
- Inline edit, insert, and delete
- Reference options inferred from CREATE TABLE statements
- One-click AI seeding using Workers AI
- Middleware to show the explorer only on localhost

## Prerequisites

- Node.js 18+ (20+ recommended)
- Cloudflare Wrangler CLI (`npm i -g wrangler`) for deploys
- A Cloudflare account with Durable Objects enabled (for deploys) and Workers AI access (for AI seeding in production)

## Quick start (dev)

Install dependencies with your preferred package manager and start the dev server:

```sh
# any one of these
npm install && npm run dev
pnpm install && pnpm dev
yarn install && yarn dev
```

Open the URL printed in your terminal (e.g. `http://localhost:5173/`). The explorer will render locally. In non-local environments the middleware prevents the UI from rendering.

## How it works

- `src/worker.tsx`: Defines the Worker, routes, and a small `isLocalhost` middleware that interrupts non-local requests.
- `src/db/durableObject.ts`: Durable Object class that applies migrations.
- `src/db/migrations.ts`: Declarative migrations for your SQLite schema.
- `src/db/db.ts`: Creates the typed `db` instance bound to the Durable Object.
- `src/app/pages/Home.tsx`: Server component that discovers tables, reads `params.table`, and renders the viewer.
- `src/app/pages/functions.ts`: Server actions for insert/update/delete, listing reference options, and AI seeding.
- `src/app/components/*`: Small client components for rows, insertion, and seeding.

### Routing and localhost guard

```ts
// src/worker.tsx (excerpt)
export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    // interrupt non-local requests so the explorer only shows on localhost
    isLocalhost();
    ctx;
  },
  render(Document, [
    route("/", Home),
    route("/:table", Home),
  ]),
]);
```

### Reading the table param

```ts
// src/app/pages/Home.tsx (excerpt)
export async function Home({ params }: { params: { table: string } }) {
  const table = params.table;
  const selectedTable: string | undefined = table;
  // ... derive active table from discovered list
}
```

### Database and migrations

```ts
// src/db/durableObject.ts (excerpt)
export class AppDurableObject extends SqliteDurableObject {
  migrations = migrations;
}
```

Migrations live in `src/db/migrations.ts`. Update this file to add new tables or alter schema. These run inside the Durable Object storage.

## Configuration

Key bits from `wrangler.jsonc`:

```json
{
  "main": "src/worker.tsx",
  "ai": { "binding": "AI" },
  "durable_objects": {
    "bindings": [
      { "name": "APP_DURABLE_OBJECT", "class_name": "AppDurableObject" }
    ]
  },
  "migrations": [
    { "tag": "v1", "new_sqlite_classes": ["AppDurableObject"] }
  ]
}
```

The app uses a single binding internally via `src/db/db.ts`:

```ts
export const db = createDb<AppDatabase>(env.APP_DURABLE_OBJECT, "main-database");
```

## AI seeding

The seed button calls Workers AI to generate 10 rows that match your table schema. Ensure:

- `ai` binding is present in `wrangler.jsonc`
- The model `@cf/meta/llama-3.1-8b-instruct` is available to your account (use any model, this was just as an exmaple)

You can change the model or prompt in `src/app/pages/functions.ts`.

## Deploy

```sh
wrangler deploy
```

Notes:

- The middleware prevents the explorer from rendering in non-local environments. Remove or modify `isLocalhost` if you want to expose it (not recommended without auth).
- Ensure your Durable Object classes listed in `wrangler.jsonc` migrations match your implemented classes.

## Extending this base

- Add authentication and role-based access
- Support switching between multiple Durable Object bindings
- Filtering, sorting, and pagination
- Schema view (DDL + inferred relationships)
- CSV/JSON import & export
- Column-aware editors (date pickers, JSON editors) and validation

## Links

- RedwoodSDK docs: `https://docs.rwsdk.com/`
- Cloudflare Workers: `https://developers.cloudflare.com/workers/`
