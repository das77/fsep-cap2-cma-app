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

Full CRUD is implemented end to end: the pages read customers from a shared
store, and every add/update/delete goes through the JSON Server API.

- `customer-app/` — the Vite app
  - Routes wired up in `src/App.tsx` with `BrowserRouter`:
    | Path | Page |
    | --- | --- |
    | `/` | `CustomerListPage` — customer table with per-row Edit / Delete |
    | `/add` | `AddCustomerPage` — blank `CustomerForm`; creates a customer |
    | `/edit/:id` | `EditCustomerPage` — pre-filled `CustomerForm`; shows "Customer not found" for unknown ids |
  - `src/context/` — `CustomerContext` (typed `useReducer` state + actions),
    `CustomerProvider` (wraps the app in `App.tsx`), and the
    `useCustomerContext` consumer hook
  - `src/hooks/useCustomerApi.ts` — wraps all API calls: fetches the customer
    list on mount, exposes `addCustomer` / `updateCustomer` /
    `deleteCustomer`, tracks loading and error state, and re-fetches the list
    after every mutation
  - `src/components/` — `Layout` (shared shell: header, nav, `<Outlet />`),
    `CustomerList` (customer table), and `CustomerForm` (shared add/edit form
    with inline validation)
  - `src/types/customer.ts` — `Customer` interface and `CustomerFormData`
    (`Omit<Customer, 'id'>`)
  - `db.json` — seed customer data for JSON Server
  - `vite.config.ts` — dev-server proxy: the app fetches `/api/customers`,
    which is forwarded to JSON Server on port 3001
  - `docs/` — [architecture decisions](customer-app/docs/ARCHITECTURE.md)
    (state management, CRUD via `useReducer`, custom hooks, form modes, with
    Mermaid diagrams) and the [component tree](customer-app/docs/DESIGN.md)
- `.github/workflows/deploy-docs.yml` — publishes `customer-app/docs/` to
  GitHub Pages on every push to `main` that touches the docs

## Form validation

All fields on the customer form are required, and some enforce a format.
Errors show inline under each field, mark it with a red border, and clear as
the user types; submission is blocked until every rule passes. The same rules
apply on both Add and Edit.

| Field | Rule |
| --- | --- |
| Name | First and last name — two words separated by a space |
| Email | HTML5 email format, with a required 2–63 letter TLD |
| Phone | 7 digits with a dash: `555-0101` |
| Address / City / State | Required (any non-blank value) |
| ZIP | 5-digit (`62704`) or 9-digit (`62704-1234` or `627041234`) |

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
