import { Link } from 'react-router-dom'
import type { Customer } from '../types/customer'
import type { CustomerSort, SortKey } from '../utils/sortCustomers'

type Props = {
  customers: Customer[]
  onDelete: (id: number) => void
  sort: CustomerSort | null
  onSortChange: (key: SortKey) => void
}

function CustomerList({ customers, onDelete, sort, onSortChange }: Props) {
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

  const sortableHeader = (key: SortKey, label: string) => {
    const direction = sort?.key === key ? sort.direction : null
    return (
      <th
        scope="col"
        aria-sort={
          direction === 'asc'
            ? 'ascending'
            : direction === 'desc'
              ? 'descending'
              : undefined
        }
      >
        <button
          type="button"
          className="sort-header"
          onClick={() => onSortChange(key)}
        >
          {label}
          <span className="sort-indicator" aria-hidden="true">
            {direction === 'asc' ? '▲' : direction === 'desc' ? '▼' : ''}
          </span>
        </button>
      </th>
    )
  }

  return (
    <table className="customer-table">
      <thead>
        <tr>
          {sortableHeader('name', 'Name')}
          {sortableHeader('email', 'Email')}
          <th scope="col">Phone</th>
          {sortableHeader('city', 'City')}
          {sortableHeader('state', 'State')}
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
            <td>{customer.state}</td>
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
