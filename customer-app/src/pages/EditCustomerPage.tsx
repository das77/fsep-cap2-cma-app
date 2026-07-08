import { Link, useNavigate, useParams } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import { useCustomerApi } from '../hooks/useCustomerApi'
import type { CustomerFormData } from '../types/customer'

function EditCustomerPage() {
  const { id } = useParams()
  const { customers, loading, error, updateCustomer } = useCustomerApi()
  const navigate = useNavigate()

  const customer = customers.find((c) => c.id === Number(id))

  if (loading && !customer) {
    return (
      <div>
        <h1>Edit Customer</h1>
        <p>Loading customer…</p>
      </div>
    )
  }

  if (!customer) {
    return (
      <div>
        <h1>Edit Customer</h1>
        {error && (
          <p className="error-banner" role="alert">
            {error}
          </p>
        )}
        <p>Customer not found.</p>
        <Link to="/">Back to customer list</Link>
      </div>
    )
  }

  const handleSubmit = async (data: CustomerFormData) => {
    if (await updateCustomer({ ...data, id: customer.id })) {
      navigate('/')
    }
  }

  return (
    <div>
      <h1>Edit Customer</h1>
      {error && (
        <p className="error-banner" role="alert">
          {error}
        </p>
      )}
      <CustomerForm
        initialData={customer}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
    </div>
  )
}

export default EditCustomerPage
