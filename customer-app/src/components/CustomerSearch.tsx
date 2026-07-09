type Props = {
  query: string
  onQueryChange: (query: string) => void
  shownCount: number
  totalCount: number
}

function CustomerSearch({ query, onQueryChange, shownCount, totalCount }: Props) {
  return (
    <div className="customer-search">
      <div className="search-input">
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name, email, or city"
          aria-label="Search customers"
        />
        {query && (
          <button
            type="button"
            className="clear-search"
            aria-label="Clear search"
            onClick={() => onQueryChange('')}
          >
            ×
          </button>
        )}
      </div>
      <p className="search-count" aria-live="polite">
        Showing {shownCount} of {totalCount} customers
      </p>
    </div>
  )
}

export default CustomerSearch
