import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import CustomerListPage from './pages/CustomerListPage'
import AddCustomerPage from './pages/AddCustomerPage'
import EditCustomerPage from './pages/EditCustomerPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CustomerListPage />} />
          <Route path="/add" element={<AddCustomerPage />} />
          <Route path="/edit/:id" element={<EditCustomerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
