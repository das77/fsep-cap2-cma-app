import { useState } from 'react'
import type { CustomerFormData } from '../types/customer'

type Props = {
  initialData?: CustomerFormData
  onSubmit: (data: CustomerFormData) => void
  onCancel: () => void
}

const emptyForm: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
}

const fields: Array<{
  name: keyof CustomerFormData
  label: string
  type: string
}> = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'address', label: 'Address', type: 'text' },
  { name: 'city', label: 'City', type: 'text' },
  { name: 'state', label: 'State', type: 'text' },
  { name: 'zip', label: 'ZIP', type: 'text' },
]

function CustomerForm({ initialData, onSubmit, onCancel }: Props) {
  const isEditMode = initialData !== undefined
  const [formData, setFormData] = useState<CustomerFormData>(
    initialData ?? emptyForm,
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      {fields.map(({ name, label, type }) => (
        <label key={name}>
          {label}
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            required
          />
        </label>
      ))}
      <div className="form-actions">
        <button type="submit" className="primary">
          {isEditMode ? 'Update Customer' : 'Add Customer'}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CustomerForm
