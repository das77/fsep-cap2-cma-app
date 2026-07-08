import { Link, useNavigate, useParams } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import { useCustomerContext } from '../context/useCustomerContext'
import type { CustomerFormData } from '../types/customer'

function EditCustomerPage() {
  const { id } = useParams()
  const { state, dispatch } = useCustomerContext()
  const navigate = useNavigate()

  const customer = state.customers.find((c) => c.id === Number(id))

  if (!customer) {
    return (
      <div>
        <h1>Edit Customer</h1>
        <p>Customer not found.</p>
        <Link to="/">Back to customer list</Link>
      </div>
    )
  }

  const handleSubmit = (data: CustomerFormData) => {
    dispatch({ type: 'UPDATE_CUSTOMER', payload: { ...data, id: customer.id } })
    navigate('/')
  }

  return (
    <div>
      <h1>Edit Customer</h1>
      <CustomerForm
        initialData={customer}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
    </div>
  )
}

export default EditCustomerPage
