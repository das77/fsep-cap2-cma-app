# Design

## Component Tree

```text
App (BrowserRouter + Routes — owns customer state via useCustomers)
└── Layout (header with app name, nav links, <Outlet />)
    ├── CustomerListPage              route: /
    │   └── CustomerTable
    │       └── CustomerRow (one per customer; edit + delete actions)
    ├── AddCustomerPage               route: /add
    │   └── CustomerForm (starts empty; submit → addCustomer)
    └── EditCustomerPage              route: /edit/:id
        └── CustomerForm (pre-filled from :id; submit → updateCustomer)
```

Customer state lives at the shared-parent level (see
[ARCHITECTURE.md](./ARCHITECTURE.md)): the `useCustomers` hook — reducer plus
API calls — runs once near the top of the tree, and pages receive the customer
data and CRUD functions from it. `CustomerForm` is a single shared component;
the add and edit pages differ only in the initial values and submit callback
they pass it.
