import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CustomerProvider } from './context/CustomerProvider'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import CustomerListPage from './pages/CustomerListPage'
import AddCustomerPage from './pages/AddCustomerPage'
import EditCustomerPage from './pages/EditCustomerPage'
import './App.css'

function App() {
  return (
    <CustomerProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<CustomerListPage />} />
              <Route path="/add" element={<AddCustomerPage />} />
              <Route path="/edit/:id" element={<EditCustomerPage />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </CustomerProvider>
  )
}

export default App
