import { useParams } from 'react-router-dom'

function EditCustomerPage() {
  const { id } = useParams()

  return (
    <div>
      <h1>Edit Customer</h1>
      <p>Pre-filled form for customer {id} will go here.</p>
    </div>
  )
}

export default EditCustomerPage
