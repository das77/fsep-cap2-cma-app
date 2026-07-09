# Design

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
