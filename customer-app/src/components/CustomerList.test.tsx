import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
  const onSortChange = vi.fn()
  render(
    <MemoryRouter>
      <CustomerList
        customers={customers}
        onDelete={onDelete}
        sort={null}
        onSortChange={onSortChange}
        {...props}
      />
    </MemoryRouter>,
  )
  return { onDelete, onSortChange }
}

describe('CustomerList', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

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

  it('calls onDelete with the customer id when Delete is confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const user = userEvent.setup()
    const { onDelete } = renderList()

    await user.click(screen.getByRole('button', { name: 'Delete James Chen' }))

    expect(window.confirm).toHaveBeenCalledWith(
      'Delete James Chen? This cannot be undone.',
    )
    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(2)
  })

  it('does not call onDelete when the confirmation is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()
    const { onDelete } = renderList()

    await user.click(screen.getByRole('button', { name: 'Delete James Chen' }))

    expect(onDelete).not.toHaveBeenCalled()
  })

  it('renders an Edit link pointing to the edit route for each customer', () => {
    renderList()

    expect(screen.getByRole('link', { name: 'Edit Maria Garcia' })).toHaveAttribute(
      'href',
      '/edit/1',
    )
    expect(screen.getByRole('link', { name: 'Edit James Chen' })).toHaveAttribute(
      'href',
      '/edit/2',
    )
  })

  it('calls onSortChange with the column key when a sortable header is clicked', async () => {
    const user = userEvent.setup()
    const { onSortChange } = renderList()

    await user.click(screen.getByRole('button', { name: 'City' }))

    expect(onSortChange).toHaveBeenCalledWith('city')
  })

  it('marks the sorted column with aria-sort and an indicator', () => {
    renderList({ sort: { key: 'name', direction: 'asc' } })

    const nameHeader = screen.getByRole('columnheader', { name: /Name/ })
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')
    expect(nameHeader).toHaveTextContent('▲')

    const emailHeader = screen.getByRole('columnheader', { name: 'Email' })
    expect(emailHeader).not.toHaveAttribute('aria-sort')
  })

  it('flips the indicator for a descending sort', () => {
    renderList({ sort: { key: 'name', direction: 'desc' } })

    const nameHeader = screen.getByRole('columnheader', { name: /Name/ })
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending')
    expect(nameHeader).toHaveTextContent('▼')
  })
})
