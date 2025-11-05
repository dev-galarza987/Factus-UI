import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { CompaniesPage, CompanyFormPage, CompanyDetailsPage } from './pages/companies'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/new" element={<CompanyFormPage />} />
          <Route path="/companies/:id" element={<CompanyDetailsPage />} />
          <Route path="/companies/:id/edit" element={<CompanyFormPage />} />
        </Routes>
      </BrowserRouter>
    </App>
  </StrictMode>,
)
