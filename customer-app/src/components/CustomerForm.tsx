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

type FormErrors = Partial<Record<keyof CustomerFormData, string>>

// HTML5 spec regex for a valid <input type="email"> value, tightened to
// require a dot-separated TLD of at least two letters
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/
const NAME_PATTERN = /^\S+ \S+$/
const PHONE_PATTERN = /^\d{3}-\d{4}$/
const ZIP_PATTERN = /^\d{5}(?:-?\d{4})?$/

function validate(data: CustomerFormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim()) {
    errors.name = 'Name is required.'
  } else if (!NAME_PATTERN.test(data.name.trim())) {
    errors.name = 'Enter first and last name separated by a space.'
  }
  if (!data.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(data.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!data.phone.trim()) {
    errors.phone = 'Phone is required.'
  } else if (!PHONE_PATTERN.test(data.phone.trim())) {
    errors.phone = 'Enter a 7-digit phone number, e.g. 555-0101.'
  }
  if (!data.address.trim()) {
    errors.address = 'Address is required.'
  }
  if (!data.city.trim()) {
    errors.city = 'City is required.'
  }
  if (!data.state.trim()) {
    errors.state = 'State is required.'
  }
  if (!data.zip.trim()) {
    errors.zip = 'ZIP is required.'
  } else if (!ZIP_PATTERN.test(data.zip.trim())) {
    errors.zip = 'Enter a 5-digit or 9-digit ZIP code, e.g. 62704 or 62704-1234.'
  }
  return errors
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
  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name as keyof CustomerFormData]) return prev
      const next = { ...prev }
      delete next[name as keyof CustomerFormData]
      return next
    })
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validate(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onSubmit(formData)
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit} noValidate>
      {fields.map(({ name, label, type }) => (
        <div className="form-field" key={name}>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className={errors[name] ? 'invalid' : undefined}
            aria-invalid={errors[name] ? true : undefined}
            aria-describedby={errors[name] ? `${name}-error` : undefined}
          />
          {errors[name] && (
            <span className="field-error" id={`${name}-error`}>
              {errors[name]}
            </span>
          )}
        </div>
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
