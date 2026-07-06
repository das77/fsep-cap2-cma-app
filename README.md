# fsep-cap2-cma-app

Customer Management Application — a single-page React application where users
can view, create, edit, and delete customer records.

**Live docs:** <!-- pages-url -->https://das77.github.io/fsep-cap2-cma-app/<!-- /pages-url -->
_(link is kept up to date automatically by the docs deploy workflow)_

## Tech stack

- **Frontend:** React 19 + TypeScript, built with Vite 8
- **Routing:** React Router (react-router-dom 7)
- **API:** [JSON Server](https://github.com/typicode/json-server) serving
  `customer-app/db.json` as a REST API on port 3001

## Current state

- `customer-app/` — the Vite app
  - Routes wired up in `src/App.tsx` with `BrowserRouter`:
    | Path | Page |
    | --- | --- |
    | `/` | `CustomerListPage` — customer list (placeholder) |
    | `/add` | `AddCustomerPage` — empty form (placeholder) |
    | `/edit/:id` | `EditCustomerPage` — pre-filled form (placeholder) |
  - `src/components/Layout.tsx` — shared shell: header with app name,
    nav links, and an `<Outlet />` for routed pages
  - `src/types/customer.ts` — `Customer` interface and `CustomerFormData`
    (`Omit<Customer, 'id'>`)
  - `db.json` — seed customer data for JSON Server
  - `docs/` — [architecture decisions](customer-app/docs/ARCHITECTURE.md)
    (state management, CRUD via `useReducer`, custom hooks, form modes, with
    Mermaid diagrams) and the [component tree](customer-app/docs/DESIGN.md)
- `.github/workflows/deploy-docs.yml` — publishes `customer-app/docs/` to
  GitHub Pages on every push to `main` that touches the docs

CRUD logic, hooks (`useCustomers`, `useCustomerForm`), and the shared
`CustomerForm` component are designed in the docs but not implemented yet.

## Getting started

```bash
cd customer-app
npm install
```

Run the API and the app in two terminals (both from `customer-app/`):

```bash
npm run api   # JSON Server on http://localhost:3001
npm run dev   # Vite dev server on http://localhost:5173
```

## Scripts (in `customer-app/`)

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run api` | Start JSON Server (`db.json`, port 3001) |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |
