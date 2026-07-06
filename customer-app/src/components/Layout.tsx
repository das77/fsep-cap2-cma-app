import { NavLink, Outlet } from 'react-router-dom'

function Layout() {
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
