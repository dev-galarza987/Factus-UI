import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { CompaniesPage, CompanyFormPage, CompanyDetailsPage, CompanyStatsPage } from './pages/companies'
import { CustomersPage, CustomerFormPage, CustomerDetailsPage, CustomerStatsPage } from './pages/customers'
import { InvoicesPage, InvoiceFormPage, InvoiceDetailsPage, InvoiceStatsPage } from './pages/invoices'
import { PaymentsPage, PaymentFormPage } from './pages/payments'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/stats" element={<CompanyStatsPage />} />
          <Route path="/companies/new" element={<CompanyFormPage />} />
          <Route path="/companies/:id" element={<CompanyDetailsPage />} />
          <Route path="/companies/:id/edit" element={<CompanyFormPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/stats" element={<CustomerStatsPage />} />
          <Route path="/customers/new" element={<CustomerFormPage />} />
          <Route path="/customers/:id" element={<CustomerDetailsPage />} />
          <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoices/stats" element={<InvoiceStatsPage />} />
          <Route path="/invoices/new" element={<InvoiceFormPage />} />
          <Route path="/invoices/:id" element={<InvoiceDetailsPage />} />
          <Route path="/invoices/:id/edit" element={<InvoiceFormPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/payments/new" element={<PaymentFormPage />} />
          <Route path="/payments/:id/edit" element={<PaymentFormPage />} />
        </Routes>
      </BrowserRouter>
    </App>
  </StrictMode>,
)
