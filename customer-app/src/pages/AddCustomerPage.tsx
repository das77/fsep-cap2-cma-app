import { useNavigate } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import { useCustomerContext } from '../context/useCustomerContext'
import type { CustomerFormData } from '../types/customer'

function AddCustomerPage() {
  const { state, dispatch } = useCustomerContext()
  const navigate = useNavigate()

  const handleSubmit = (data: CustomerFormData) => {
    const nextId =
      state.customers.reduce((max, customer) => Math.max(max, customer.id), 0) +
      1
    dispatch({ type: 'ADD_CUSTOMER', payload: { ...data, id: nextId } })
    navigate('/')
  }

  return (
    <div>
      <h1>Add Customer</h1>
      <CustomerForm onSubmit={handleSubmit} onCancel={() => navigate('/')} />
    </div>
  )
}

export default AddCustomerPage
