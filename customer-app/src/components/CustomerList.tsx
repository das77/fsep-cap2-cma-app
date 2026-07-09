import { Link } from 'react-router-dom'
import type { Customer } from '../types/customer'

type Props = {
  customers: Customer[]
  onDelete: (id: number) => void
}

function CustomerList({ customers, onDelete }: Props) {
  if (customers.length === 0) {
    return <p>No customers found.</p>
  }

  const confirmDelete = (customer: Customer) => {
    const confirmed = window.confirm(
      `Delete ${customer.name}? This cannot be undone.`,
    )
    if (confirmed) {
      onDelete(customer.id)
    }
  }

  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Phone</th>
          <th scope="col">City</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.name}</td>
            <td>{customer.email}</td>
            <td>{customer.phone}</td>
            <td>{customer.city}</td>
            <td className="actions">
              <Link
                to={`/edit/${customer.id}`}
                aria-label={`Edit ${customer.name}`}
              >
                Edit
              </Link>
              <button
                type="button"
                aria-label={`Delete ${customer.name}`}
                onClick={() => confirmDelete(customer)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomerList
