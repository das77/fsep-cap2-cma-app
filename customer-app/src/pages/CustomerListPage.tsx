import { useState } from 'react'
import CustomerList from '../components/CustomerList'
import CustomerSearch from '../components/CustomerSearch'
import { useCustomerApi } from '../hooks/useCustomerApi'
import { filterCustomers } from '../utils/filterCustomers'

function CustomerListPage() {
  const { customers, loading, error, deleteCustomer } = useCustomerApi()
  const [query, setQuery] = useState('')

  const filtered = filterCustomers(customers, query)

  const handleDelete = (id: number) => {
    void deleteCustomer(id)
  }

  return (
    <div>
      <h1>Customers</h1>
      {error && (
        <p className="error-banner" role="alert">
          <strong>Error:</strong> {error}
        </p>
      )}
      {loading && customers.length === 0 ? (
        <p>Loading customers…</p>
      ) : (
        <>
          <CustomerSearch
            query={query}
            onQueryChange={setQuery}
            shownCount={filtered.length}
            totalCount={customers.length}
          />
          <CustomerList customers={filtered} onDelete={handleDelete} />
        </>
      )}
    </div>
  )
}

export default CustomerListPage
