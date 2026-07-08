import CustomerList from '../components/CustomerList'
import { useCustomerContext } from '../context/useCustomerContext'

function CustomerListPage() {
  const { state, dispatch } = useCustomerContext()

  const handleDelete = (id: number) => {
    dispatch({ type: 'DELETE_CUSTOMER', payload: id })
  }

  return (
    <div>
      <h1>Customers</h1>
      <CustomerList customers={state.customers} onDelete={handleDelete} />
    </div>
  )
}

export default CustomerListPage
