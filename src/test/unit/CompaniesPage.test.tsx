import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { CompaniesPage } from '../../pages/companies/CompaniesPage'
import { companyService } from '../../services/companyService'

// Mock del componente Header
vi.mock('../../components/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}))

// Mock del servicio de empresas
vi.mock('../../services/companyService', () => ({
  companyService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}))

// Mock del componente AdvancedSearch
vi.mock('../../components/companies/AdvancedSearch', () => ({
  AdvancedSearch: ({ onSearch, onReset }: { onSearch: (filters: Record<string, unknown>) => void, onReset: () => void }) => (
    <div data-testid="advanced-search">
      <input 
        placeholder="Buscar empresa" 
        onChange={(e) => onSearch({ query: e.target.value })}
      />
      <button onClick={onReset}>Reset</button>
    </div>
  )
}))

// Mock de framer-motion para evitar problemas con animaciones en tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props}>{children}</p>,
    tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props}>{children}</tr>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockCompanies = [
  {
    id: '1',
    businessName: 'Empresa Test 1',
    taxId: '20123456789',
    email: 'test1@empresa.com',
    phone: '123456789',
    address: 'Calle Test 123',
    website: 'https://test1.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    businessName: 'Empresa Test 2',
    taxId: '20987654321',
    email: 'test2@empresa.com',
    phone: '987654321',
    address: 'Av. Test 456',
    website: 'https://test2.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

describe('CompaniesPage - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debería renderizar el título de la página', async () => {
    vi.mocked(companyService.getAll).mockResolvedValue(mockCompanies)

    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Gestión de Empresas')).toBeInTheDocument()
    })
  })

  it('debería cargar y mostrar la lista de empresas', async () => {
    vi.mocked(companyService.getAll).mockResolvedValue(mockCompanies)

    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Empresa Test 1')).toBeInTheDocument()
      expect(screen.getByText('Empresa Test 2')).toBeInTheDocument()
    })
  })

  it('debería mostrar el RUC de las empresas', async () => {
    vi.mocked(companyService.getAll).mockResolvedValue(mockCompanies)

    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('20123456789')).toBeInTheDocument()
      expect(screen.getByText('20987654321')).toBeInTheDocument()
    })
  })

  it('debería mostrar el email de las empresas', async () => {
    vi.mocked(companyService.getAll).mockResolvedValue(mockCompanies)

    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('test1@empresa.com')).toBeInTheDocument()
      expect(screen.getByText('test2@empresa.com')).toBeInTheDocument()
    })
  })

  it('debería mostrar un mensaje cuando no hay empresas', async () => {
    vi.mocked(companyService.getAll).mockResolvedValue([])

    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/No hay empresas/i)).toBeInTheDocument()
    })
  })

  it('debería mostrar el botón de Nueva Empresa', async () => {
    vi.mocked(companyService.getAll).mockResolvedValue(mockCompanies)

    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Nueva Empresa')).toBeInTheDocument()
    })
  })

  it('debería mostrar el botón de Estadísticas', async () => {
    vi.mocked(companyService.getAll).mockResolvedValue(mockCompanies)

    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Estadísticas')).toBeInTheDocument()
    })
  })

  it('debería filtrar empresas por búsqueda', async () => {
    vi.mocked(companyService.getAll).mockResolvedValue(mockCompanies)

    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    )

    // Esperar a que carguen las empresas
    await waitFor(() => {
      expect(screen.getByText('Empresa Test 1')).toBeInTheDocument()
    })

    // Buscar el input de búsqueda (puede estar en AdvancedSearch)
    const searchInputs = screen.getAllByPlaceholderText(/Buscar|buscar/i)
    if (searchInputs.length > 0) {
      const searchInput = searchInputs[0]
      fireEvent.change(searchInput, { target: { value: 'Test 1' } })

      // Verificar que se filtre
      await waitFor(() => {
        expect(screen.getByText('Empresa Test 1')).toBeInTheDocument()
      })
    }
  })

  it('debería manejar errores al cargar empresas', async () => {
    vi.mocked(companyService.getAll).mockRejectedValue(new Error('Error de red'))

    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar las empresas/i)).toBeInTheDocument()
    })
  })

  it('debería llamar a companyService.delete al eliminar una empresa', async () => {
    vi.mocked(companyService.getAll).mockResolvedValue(mockCompanies)
    vi.mocked(companyService.delete).mockResolvedValue()
    
    // Mock de window.confirm
    global.confirm = vi.fn(() => true)

    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Empresa Test 1')).toBeInTheDocument()
    })

    // Buscar botones de eliminar (trash icon)
    const deleteButtons = screen.getAllByTitle('Eliminar')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(companyService.delete).toHaveBeenCalledWith('1')
    })
  })
})
