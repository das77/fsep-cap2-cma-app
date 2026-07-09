import { NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

function Layout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <span className="app-name">Customer Manager</span>
          <nav className="site-nav">
            <NavLink to="/" end>
              Customers
            </NavLink>
            <NavLink to="/add">Add Customer</NavLink>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>{' '}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
