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
        ├── components/        Shared UI: Layout (shell), CustomerList (table),
        │                      CustomerForm (shared add/edit form + validation),
        │                      with colocated *.test.tsx component tests
        ├── pages/             One component per route: CustomerListPage,
        │                      AddCustomerPage, EditCustomerPage
        ├── context/           CustomerContext (typed useReducer store),
        │                      CustomerProvider, useCustomerContext hook
        ├── hooks/             useCustomerApi — all API calls, loading/error
        │                      state, re-fetch after mutations
        ├── types/             Customer interface, CustomerFormData
        ├── test/              Vitest setup (registers jest-dom matchers)
        ├── App.css            Component styles (table, form, error banner)
        └── index.css          Design tokens (colors, --danger) + light/dark themes
```

## Component Tree

```text
App
└── CustomerProvider (CustomerContext: useReducer customer state)
    └── BrowserRouter + Routes
        └── Layout (header with app name, nav links, <Outlet />)
            ├── CustomerListPage          route: /
            │   └── CustomerList (table; one row per customer with
            │                     Edit link + Delete button)
            ├── AddCustomerPage           route: /add
            │   └── CustomerForm (starts empty; submit → addCustomer)
            └── EditCustomerPage          route: /edit/:id
                └── CustomerForm (pre-filled from :id; submit → updateCustomer;
                                  falls back to "Customer not found.")
```

Customer state lives in `CustomerContext` (see
[ARCHITECTURE.md](./ARCHITECTURE.md)), provided by `CustomerProvider` at the
top of the tree. Each page calls the `useCustomerApi` hook, which reads
customers from the context and exposes the CRUD functions plus loading and
error state. `CustomerForm` is a single shared component that owns its field
state and validation; the add and edit pages differ only in the initial values
and submit callback they pass it.

## Wireframes

Every page renders inside the shared `Layout` shell — header with the app
name, `Customers` / `Add Customer` nav links, and the routed page below.

### Customer list — `/`

Customers from the store in a table; `Edit` links to `/edit/:id`, `Delete`
calls the API. Shows "Loading customers…" during the initial fetch and
"No customers found." when the list is empty.

```text
┌────────────────────────────────────────────────────────────────────────────────┐
│  Customer Manager                                    Customers   Add Customer  │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  Customers                                                                     │
│                                                                                │
│  Name           Email                     Phone     City         Actions       │
│  ────────────────────────────────────────────────────────────────────────────  │
│  Maria Garcia   maria.garcia@example.com  555-0101  Springfield  Edit [Delete] │
│  James Chen     james.chen@example.com    555-0102  Washington   Edit [Delete] │
│  Aisha Patel    aisha.patel@example.com   555-0103  Austin       Edit [Delete] │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Add customer — `/add`

Blank form; `Add Customer` submits (POST) and returns to the list on success,
`Cancel` returns without saving.

```text
┌────────────────────────────────────────────────────────────────────────────────┐
│  Customer Manager                                    Customers   Add Customer  │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  Add Customer                                                                  │
│                                                                                │
│  Name                                                                          │
│  [______________________________________]                                      │
│  Email                                                                         │
│  [______________________________________]                                      │
│  Phone                                                                         │
│  [______________________________________]                                      │
│  Address                                                                       │
│  [______________________________________]                                      │
│  City                                                                          │
│  [______________________________________]                                      │
│  State                                                                         │
│  [______________________________________]                                      │
│  ZIP                                                                           │
│  [______________________________________]                                      │
│                                                                                │
│  ( Add Customer )   ( Cancel )                                                 │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Edit customer — `/edit/:id`

Same form pre-filled from the customer matching `:id`. Shown here with a
validation error: the failing field gets a red border and an inline message
that clears as the user types. API failures appear as an error banner above
the form.

```text
┌────────────────────────────────────────────────────────────────────────────────┐
│  Customer Manager                                    Customers   Add Customer  │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  Edit Customer                                                                 │
│                                                                                │
│  Name                                                                          │
│  [ Maria Garcia_________________________]                                      │
│  Email                                                                         │
│  [ maria.garcia@example_________________]  <- red border                       │
│  Enter a valid email address.                                                  │
│  Phone                                                                         │
│  [ 555-0101_____________________________]                                      │
│  Address                                                                       │
│  [ 742 Evergreen Terrace________________]                                      │
│  City                                                                          │
│  [ Springfield__________________________]                                      │
│  State                                                                         │
│  [ IL___________________________________]                                      │
│  ZIP                                                                           │
│  [ 62704________________________________]                                      │
│                                                                                │
│  ( Update Customer )   ( Cancel )                                              │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Edit customer, unknown id

If `:id` doesn't match any customer once the initial fetch finishes:

```text
┌────────────────────────────────────────────────────────────────────────────────┐
│  Customer Manager                                    Customers   Add Customer  │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  Edit Customer                                                                 │
│                                                                                │
│  Customer not found.                                                           │
│  Back to customer list  -> /                                                   │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```
