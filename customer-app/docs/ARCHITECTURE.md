# Architecture

Design decisions for the Customer Manager app. For the component tree these
decisions apply to, see [DESIGN.md](./DESIGN.md).

## SYSTEM COMPONENTS

```mermaid
graph TB
    subgraph Browser["Browser — React app (Vite, port 5173)"]
        App["App<br/>(BrowserRouter + Routes)"]
        Layout["Layout<br/>(header, nav, Outlet)"]
        List["CustomerListPage<br/>/"]
        Add["AddCustomerPage<br/>/add"]
        Edit["EditCustomerPage<br/>/edit/:id"]
        Form["CustomerForm<br/>(shared add/edit form)"]
        Hook["useCustomers<br/>(useReducer + API calls)"]
    end

    subgraph Server["JSON Server (port 3001)"]
        API["REST API<br/>/customers"]
        DB[("db.json")]
    end

    App --> Layout
    Layout --> List
    Layout --> Add
    Layout --> Edit
    Add --> Form
    Edit --> Form
    List -.reads state / calls CRUD.-> Hook
    Form -.submits via page callbacks.-> Hook
    Hook <-->|fetch| API
    API <--> DB
```

## CUSTOMER STATE DATA

Customer state is lifted to a shared parent component rather than fetched
independently by each page. The list, add, and edit pages all read from and
update the same source of truth, so changes made on one page (e.g. adding a
customer) are immediately reflected on the others without refetching.

## CRUD OPERATIONS

With `useReducer` and typed actions for scalability. A single reducer handles
the customer collection, with a discriminated-union action type such as:

```ts
type CustomerAction =
  | { type: 'set'; customers: Customer[] }   // initial load from the API
  | { type: 'add'; customer: Customer }
  | { type: 'update'; customer: Customer }
  | { type: 'delete'; id: number }
```

Each CRUD operation calls the JSON Server API first, then dispatches the
matching action with the server's response, keeping local state in sync with
`db.json`. Typed actions make every state transition explicit and give the
compiler a way to catch missing or malformed updates as the app grows.

### Data flow

Every mutation follows the same loop — API first, then dispatch, then
re-render:

```mermaid
flowchart LR
    UI["User action<br/>(submit form, click delete)"] --> Fn["useCustomers function<br/>addCustomer / updateCustomer / deleteCustomer"]
    Fn -->|"1. fetch"| API["JSON Server<br/>/customers"]
    API -->|"2. response (saved customer)"| Fn
    Fn -->|"3. dispatch typed action"| Reducer["customersReducer"]
    Reducer -->|"4. new state"| State["customers state"]
    State -->|"5. re-render"| Pages["List / Add / Edit pages"]
```

### API calls

```mermaid
sequenceDiagram
    participant P as Page
    participant H as useCustomers
    participant S as JSON Server (:3001)

    Note over P,S: Initial load (list page mounts)
    P->>H: mount
    H->>S: GET /customers
    S-->>H: 200 — Customer[]
    H->>H: dispatch { type: 'set' }

    Note over P,S: Add (/add)
    P->>H: addCustomer(formData)
    H->>S: POST /customers (CustomerFormData)
    S-->>H: 201 — Customer (id assigned)
    H->>H: dispatch { type: 'add' }

    Note over P,S: Edit (/edit/:id)
    P->>H: updateCustomer(customer)
    H->>S: PUT /customers/:id (Customer)
    S-->>H: 200 — Customer
    H->>H: dispatch { type: 'update' }

    Note over P,S: Delete (list page)
    P->>H: deleteCustomer(id)
    H->>S: DELETE /customers/:id
    S-->>H: 200
    H->>H: dispatch { type: 'delete' }
```

## CUSTOM HOOKS

- `useCustomers` — wraps the reducer and API calls. Owns the customer state
  and exposes it along with `addCustomer`, `updateCustomer`, and
  `deleteCustomer` functions, plus loading and error state. Pages call these
  functions instead of talking to the API directly.
- `useCustomerForm` — manages `CustomerFormData` field state, change handlers,
  and validation for the customer form, accepting optional initial values so
  the same hook serves both add and edit modes.

## ADD/EDIT

One shared `CustomerForm` component is used by both pages, working with
`CustomerFormData` (the `Customer` type minus `id`, since JSON Server assigns
IDs). The mode is determined by its props:

- **Add** (`/add`): rendered with no initial values, so fields start empty.
  Submitting calls `addCustomer`, which POSTs to the API.
- **Edit** (`/edit/:id`): the page looks up the customer by the `id` route
  param and passes it as initial values, so fields start pre-filled.
  Submitting calls `updateCustomer` with the existing `id`, which PUTs to the
  API.

The form itself never knows which mode it is in — it just receives initial
values and an `onSubmit` callback, and the page supplies the right behavior.
