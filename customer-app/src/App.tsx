import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CustomerProvider } from './context/CustomerProvider'
import Layout from './components/Layout'
import CustomerListPage from './pages/CustomerListPage'
import AddCustomerPage from './pages/AddCustomerPage'
import EditCustomerPage from './pages/EditCustomerPage'
import './App.css'

function App() {
  return (
    <CustomerProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<CustomerListPage />} />
            <Route path="/add" element={<AddCustomerPage />} />
            <Route path="/edit/:id" element={<EditCustomerPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CustomerProvider>
  )
}

export default App
