import { useNavigate } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import { useCustomerApi } from '../hooks/useCustomerApi'
import type { CustomerFormData } from '../types/customer'

function AddCustomerPage() {
  const { addCustomer, error } = useCustomerApi()
  const navigate = useNavigate()

  const handleSubmit = async (data: CustomerFormData) => {
    if (await addCustomer(data)) {
      navigate('/')
    }
  }

  return (
    <div>
      <h1>Add Customer</h1>
      {error && (
        <p className="error-banner" role="alert">
          {error}
        </p>
      )}
      <CustomerForm onSubmit={handleSubmit} onCancel={() => navigate('/')} />
    </div>
  )
}

export default AddCustomerPage
