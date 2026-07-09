# fsep-cap2-cma-app

Customer Management Application — a single-page React application where users
can view, create, edit, and delete customer records.

**Live app:** <!-- pages-url -->https://das77.github.io/fsep-cap2-cma-app/<!-- /pages-url -->
**Live docs:** <!-- docs-url -->https://das77.github.io/fsep-cap2-cma-app/docs/<!-- /docs-url -->
_(links are kept up to date automatically by the deploy workflow. Note: the
live app is a static build without the JSON Server API, so it shows an error
banner instead of customer data — run it locally for the full experience.)_

## Tech stack

- **Frontend:** React 19 + TypeScript, built with Vite 8
- **Routing:** React Router (react-router-dom 7)
- **API:** [JSON Server](https://github.com/typicode/json-server) serving
  `customer-app/db.json` as a REST API on port 3001
- **Testing:** [Vitest](https://vitest.dev/) +
  [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
  running in jsdom

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
    with inline validation), each with a colocated `*.test.tsx` file
  - `src/test/setup.ts` — Vitest setup: registers the jest-dom matchers
    (config in `vite.config.ts`: jsdom environment, globals)
  - `src/types/customer.ts` — `Customer` interface and `CustomerFormData`
    (`Omit<Customer, 'id'>`)
  - `db.json` — seed customer data for JSON Server
  - `vite.config.ts` — dev-server proxy: the app fetches `/api/customers`,
    which is forwarded to JSON Server on port 3001
  - `docs/` — [architecture decisions](customer-app/docs/ARCHITECTURE.md)
    (state management, CRUD via `useReducer`, custom hooks, form modes,
    testing, with Mermaid diagrams) and the
    [design doc](customer-app/docs/DESIGN.md) (file structure, component
    tree, and page wireframes)
- `.github/workflows/deploy-docs.yml` — builds the app and publishes it to
  GitHub Pages (app at the site root, `customer-app/docs/` under `/docs/`,
  with a `404.html` SPA fallback for deep links) on every push to `main`
  that touches `customer-app/`

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
| `npm test` | Run Vitest in watch mode |
| `npm run test:run` | Run the test suite once (CI-style) |

## Testing

Component tests live next to the components they cover
(`src/components/*.test.tsx`) and run with Vitest + React Testing Library in
a jsdom environment (no browser or API server needed):

- **`CustomerList`** — renders customer names, shows the empty state, calls
  `onDelete` with the clicked row's id, and points each Edit link at the
  right `/edit/:id` route (rendered inside a `MemoryRouter`).
- **`CustomerForm`** — shows required-field errors on empty submit, calls
  `onSubmit` with the typed form data when valid, calls `onCancel` from the
  Cancel button, and pre-fills fields (with an "Update Customer" button) in
  edit mode.
