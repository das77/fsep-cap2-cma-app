import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import CustomerSearch from './CustomerSearch'

function renderSearch(query = '') {
  const onQueryChange = vi.fn()
  render(
    <CustomerSearch
      query={query}
      onQueryChange={onQueryChange}
      shownCount={3}
      totalCount={12}
    />,
  )
  return { onQueryChange }
}

describe('CustomerSearch', () => {
  it('calls onQueryChange as the user types', async () => {
    const user = userEvent.setup()
    const { onQueryChange } = renderSearch()

    await user.type(screen.getByRole('searchbox', { name: 'Search customers' }), 'a')

    expect(onQueryChange).toHaveBeenCalledWith('a')
  })

  it('shows the result count', () => {
    renderSearch('anything')

    expect(screen.getByText('Showing 3 of 12 customers')).toBeInTheDocument()
  })

  it('clears the query via the clear button', async () => {
    const user = userEvent.setup()
    const { onQueryChange } = renderSearch('maria')

    await user.click(screen.getByRole('button', { name: 'Clear search' }))

    expect(onQueryChange).toHaveBeenCalledWith('')
  })

  it('hides the clear button when the query is empty', () => {
    renderSearch('')

    expect(
      screen.queryByRole('button', { name: 'Clear search' }),
    ).not.toBeInTheDocument()
  })
})
