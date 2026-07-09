import { useState } from 'react'
import CustomerList from '../components/CustomerList'
import CustomerSearch from '../components/CustomerSearch'
import { useCustomerApi } from '../hooks/useCustomerApi'
import { filterCustomers } from '../utils/filterCustomers'
import {
  loadSort,
  saveSort,
  sortCustomers,
  toggleSort,
} from '../utils/sortCustomers'
import type { CustomerSort, SortKey } from '../utils/sortCustomers'

function CustomerListPage() {
  const { customers, loading, error, deleteCustomer } = useCustomerApi()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<CustomerSort | null>(loadSort)

  const visibleCustomers = sortCustomers(
    filterCustomers(customers, query),
    sort,
  )

  const handleSortChange = (key: SortKey) => {
    setSort((current) => {
      const next = toggleSort(current, key)
      saveSort(next)
      return next
    })
  }

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
            shownCount={visibleCustomers.length}
            totalCount={customers.length}
          />
          <CustomerList
            customers={visibleCustomers}
            onDelete={handleDelete}
            sort={sort}
            onSortChange={handleSortChange}
          />
        </>
      )}
    </div>
  )
}

export default CustomerListPage
