import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import CustomerList from './CustomerList'
import type { Customer } from '../types/customer'

const customers: Customer[] = [
  {
    id: 1,
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '555-0101',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    zip: '62704',
  },
  {
    id: 2,
    name: 'James Chen',
    email: 'james.chen@example.com',
    phone: '555-0102',
    address: '1600 Pennsylvania Ave',
    city: 'Washington',
    state: 'DC',
    zip: '20500',
  },
]

function renderList(props?: Partial<Parameters<typeof CustomerList>[0]>) {
  const onDelete = vi.fn()
  render(
    <MemoryRouter>
      <CustomerList customers={customers} onDelete={onDelete} {...props} />
    </MemoryRouter>,
  )
  return { onDelete }
}

describe('CustomerList', () => {
  it('renders all customer names', () => {
    renderList()

    expect(screen.getByText('Maria Garcia')).toBeInTheDocument()
    expect(screen.getByText('James Chen')).toBeInTheDocument()
  })

  it('shows an empty state when there are no customers', () => {
    renderList({ customers: [] })

    expect(screen.getByText('No customers found.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('calls onDelete with the customer id when Delete is clicked', async () => {
    const user = userEvent.setup()
    const { onDelete } = renderList()

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    await user.click(deleteButtons[1])

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(2)
  })

  it('renders an Edit link pointing to the edit route for each customer', () => {
    renderList()

    const editLinks = screen.getAllByRole('link', { name: 'Edit' })
    expect(editLinks).toHaveLength(2)
    expect(editLinks[0]).toHaveAttribute('href', '/edit/1')
    expect(editLinks[1]).toHaveAttribute('href', '/edit/2')
  })
})
