# Design

## File structure

Directory-level map of the repo; see the component tree below for how the
pieces fit together at runtime.

```text
fsep-cap2-cma-app/
├── README.md                  Project overview, getting started, scripts
├── .github/workflows/
│   └── deploy-docs.yml        Builds the app and publishes it + docs/ to
│                              GitHub Pages on push to main
└── customer-app/              The Vite app (everything runs from here)
    ├── db.json                Seed customer data, served by JSON Server (:3001)
    ├── vite.config.ts         Dev server, /api → :3001 proxy, Vitest config
    │                          (jsdom environment, globals, setup file)
    ├── docs/                  ARCHITECTURE.md (decisions, diagrams) and this file
    └── src/
        ├── main.tsx           Entry point; mounts <App /> with StrictMode
        ├── App.tsx            CustomerProvider + BrowserRouter + route table
        ├── components/        Shared UI: Layout (shell + dark mode toggle),
        │                      CustomerList (sortable table), CustomerSearch
        │                      (live filter + count), CustomerForm (shared
        │                      add/edit form + validation), ErrorBoundary
        │                      (render-error fallback + Try Again), with
        │                      colocated *.test.tsx component tests
        ├── pages/             One component per route: CustomerListPage,
        │                      AddCustomerPage, EditCustomerPage
        ├── context/           CustomerContext (typed useReducer store),
        │                      CustomerProvider, useCustomerContext hook
        ├── hooks/             useCustomerApi (all API calls, loading/error
        │                      state, re-fetch after mutations) and useTheme
        │                      (light/dark state, persisted to localStorage)
        ├── utils/             Pure helpers: filterCustomers (search match),
        │                      sortCustomers (sort + sessionStorage persistence)
        ├── types/             Customer interface, CustomerFormData
        ├── test/              Vitest setup (registers jest-dom matchers)
        ├── App.css            Component styles (table, form, search, error
        │                      banner, theme toggle)
        └── index.css          Design tokens (colors, --danger) as CSS custom
                               properties; light/dark via data-theme overrides
                               with an OS prefers-color-scheme fallback
```

## Component Tree

```text
App
└── CustomerProvider (CustomerContext: useReducer customer state)
    └── BrowserRouter
        └── ErrorBoundary (catches render errors; fallback + Try Again)
            └── Routes
                └── Layout (header with app name, nav links, dark mode
                    │       toggle via useTheme, <Outlet />)
                    ├── CustomerListPage          route: /
                    │   ├── CustomerSearch (live filter by name/email/city;
                    │   │                   result count + clear button)
                    │   └── CustomerList (sortable table; one row per
                    │                     customer with Edit link + Delete
                    │                     button, which confirms before
                    │                     deleting)
                    ├── AddCustomerPage           route: /add
                    │   └── CustomerForm (starts empty; submit → addCustomer)
                    └── EditCustomerPage          route: /edit/:id
                        └── CustomerForm (pre-filled from :id; submit →
                                          updateCustomer; falls back to
                                          "Customer not found.")
```

Customer state lives in `CustomerContext` (see
[ARCHITECTURE.md](./ARCHITECTURE.md)), provided by `CustomerProvider` at the
top of the tree. Each page calls the `useCustomerApi` hook, which reads
customers from the context and exposes the CRUD functions plus loading and
error state. `CustomerForm` is a single shared component that owns its field
state and validation; the add and edit pages differ only in the initial values
and submit callback they pass it. `ErrorBoundary` sits inside the router but
above the routes, so a render error anywhere in a page shows its fallback
while customer state survives for the "Try Again" recovery.

## Wireframes

Every page renders inside the shared `Layout` shell — header with the app
name, `Customers` / `Add Customer` nav links, and the dark mode toggle
(`🌙 Dark` / `☀️ Light`, drawn here as `( Dark )`), with the routed page
below.

### Customer list — `/`

Customers from the store in a table. The search bar filters by name, email,
or city as the user types, with a live "Showing X of Y customers" count and
an × button to clear the query. Clicking Name, Email, City, or State sorts
ascending / descending (shown by the ▲/▼ indicator — Name ▲ below); the
sort is remembered when navigating away and back. `Edit` links to
`/edit/:id`; `Delete` asks for confirmation (`window.confirm`) and then
calls the API. Shows "Loading customers…" during the initial fetch and
"No customers found." when the list (or the filtered result) is empty.

```text
┌────────────────────────────────────────────────────────────────────────────────────┐
│  Customer Manager                             Customers   Add Customer   ( Dark )  │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  Customers                                                                         │
│                                                                                    │
│  [ Search by name, email, or city____ × ]   Showing 3 of 3 customers               │
│                                                                                    │
│  Name ▲        Email                    Phone     City        State   Actions      │
│  ────────────────────────────────────────────────────────────────────────────────  │
│  Aisha Patel   aisha.patel@example.com  555-0103  Austin      TX      Edit [Delete]│
│  James Chen    james.chen@example.com   555-0102  Washington  DC      Edit [Delete]│
│  Maria Garcia  maria.garcia@example.com 555-0101  Springfield IL      Edit [Delete]│
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Add customer — `/add`

Blank form; `Add Customer` submits (POST) and returns to the list on success,
`Cancel` returns without saving.

```text
┌────────────────────────────────────────────────────────────────────────────────────┐
│  Customer Manager                             Customers   Add Customer   ( Dark )  │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  Add Customer                                                                      │
│                                                                                    │
│  Name                                                                              │
│  [______________________________________]                                          │
│  Email                                                                             │
│  [______________________________________]                                          │
│  Phone                                                                             │
│  [______________________________________]                                          │
│  Address                                                                           │
│  [______________________________________]                                          │
│  City                                                                              │
│  [______________________________________]                                          │
│  State                                                                             │
│  [______________________________________]                                          │
│  ZIP                                                                               │
│  [______________________________________]                                          │
│                                                                                    │
│  ( Add Customer )   ( Cancel )                                                     │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Edit customer — `/edit/:id`

Same form pre-filled from the customer matching `:id`. Shown here with a
validation error: the failing field gets a red border and an inline message
that clears as the user types. API failures appear as an error banner above
the form.

```text
┌────────────────────────────────────────────────────────────────────────────────────┐
│  Customer Manager                             Customers   Add Customer   ( Dark )  │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  Edit Customer                                                                     │
│                                                                                    │
│  Name                                                                              │
│  [ Maria Garcia_________________________]                                          │
│  Email                                                                             │
│  [ maria.garcia@example_________________]  <- red border                           │
│  Enter a valid email address.                                                      │
│  Phone                                                                             │
│  [ 555-0101_____________________________]                                          │
│  Address                                                                           │
│  [ 742 Evergreen Terrace________________]                                          │
│  City                                                                              │
│  [ Springfield__________________________]                                          │
│  State                                                                             │
│  [ IL___________________________________]                                          │
│  ZIP                                                                               │
│  [ 62704________________________________]                                          │
│                                                                                    │
│  ( Update Customer )   ( Cancel )                                                  │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Edit customer, unknown id

If `:id` doesn't match any customer once the initial fetch finishes:

```text
┌────────────────────────────────────────────────────────────────────────────────────┐
│  Customer Manager                             Customers   Add Customer   ( Dark )  │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  Edit Customer                                                                     │
│                                                                                    │
│  Customer not found.                                                               │
│  Back to customer list  -> /                                                       │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```
