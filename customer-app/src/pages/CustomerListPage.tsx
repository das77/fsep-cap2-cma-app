import CustomerList from '../components/CustomerList'
import { useCustomerApi } from '../hooks/useCustomerApi'

function CustomerListPage() {
  const { customers, loading, error, deleteCustomer } = useCustomerApi()

  const handleDelete = (id: number) => {
    void deleteCustomer(id)
  }

  return (
    <div>
      <h1>Customers</h1>
      {error && (
        <p className="error-banner" role="alert">
          {error}
        </p>
      )}
      {loading && customers.length === 0 ? (
        <p>Loading customers…</p>
      ) : (
        <CustomerList customers={customers} onDelete={handleDelete} />
      )}
    </div>
  )
}

export default CustomerListPage
