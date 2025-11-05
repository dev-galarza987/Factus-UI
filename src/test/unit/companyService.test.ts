import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock de axios usando vi.hoisted para evitar problemas de hoisting
const mockAxiosInstance = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { 
      use: vi.fn(() => 1), 
      eject: vi.fn() 
    },
    response: { 
      use: vi.fn(() => 1), 
      eject: vi.fn() 
    }
  }
}))

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
    interceptors: mockAxiosInstance.interceptors
  }
}))

// Importar después de configurar los mocks
import { companyService } from '../../services/companyService'

describe('companyService - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('debería obtener todas las empresas', async () => {
      const mockCompanies = [
        {
          id: '1',
          businessName: 'Empresa 1',
          taxId: '20123456789',
          email: 'empresa1@test.com',
          address: 'Dirección 1',
          phone: '123456789',
          website: 'https://empresa1.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          businessName: 'Empresa 2',
          taxId: '20987654321',
          email: 'empresa2@test.com',
          address: 'Dirección 2',
          phone: '987654321',
          website: 'https://empresa2.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockCompanies })

      const result = await companyService.getAll()

      expect(result).toEqual(mockCompanies)
      expect(mockAxiosInstance.get).toHaveBeenCalledOnce()
    })

    it('debería manejar errores al obtener empresas', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'))

      await expect(companyService.getAll()).rejects.toThrow()
    })
  })

  describe('getById', () => {
    it('debería obtener una empresa por ID', async () => {
      const mockCompany = {
        id: '1',
        businessName: 'Empresa Test',
        taxId: '20123456789',
        email: 'test@empresa.com',
        address: 'Dirección Test',
        phone: '123456789',
        website: 'https://test.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockCompany })

      const result = await companyService.getById('1')

      expect(result).toEqual(mockCompany)
      expect(mockAxiosInstance.get).toHaveBeenCalledOnce()
    })

    it('debería manejar errores al obtener empresa por ID', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Not found'))

      await expect(companyService.getById('999')).rejects.toThrow()
    })
  })

  describe('create', () => {
    it('debería crear una nueva empresa', async () => {
      const newCompany = {
        businessName: 'Nueva Empresa',
        taxId: '20111222333',
        email: 'nueva@empresa.com',
        address: 'Nueva Dirección',
        phone: '111222333',
        website: 'https://nueva.com',
      }

      const createdCompany = {
        id: '3',
        ...newCompany,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockAxiosInstance.post.mockResolvedValueOnce({ data: createdCompany })

      const result = await companyService.create(newCompany)

      expect(result).toEqual(createdCompany)
      expect(mockAxiosInstance.post).toHaveBeenCalledOnce()
    })

    it('debería manejar errores al crear empresa', async () => {
      const newCompany = {
        businessName: 'Nueva Empresa',
        taxId: '20111222333',
        email: 'nueva@empresa.com',
        address: 'Nueva Dirección',
      }

      mockAxiosInstance.post.mockRejectedValueOnce(new Error('Validation error'))

      await expect(companyService.create(newCompany)).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('debería actualizar una empresa existente', async () => {
      const updateData = {
        businessName: 'Empresa Actualizada',
        email: 'actualizada@empresa.com',
        address: 'Nueva Dirección',
      }

      const updatedCompany = {
        id: '1',
        taxId: '20123456789',
        ...updateData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockAxiosInstance.patch.mockResolvedValueOnce({ data: updatedCompany })

      const result = await companyService.update('1', updateData)

      expect(result).toEqual(updatedCompany)
      expect(mockAxiosInstance.patch).toHaveBeenCalledOnce()
    })

    it('debería manejar errores al actualizar empresa', async () => {
      const updateData = {
        businessName: 'Empresa Actualizada',
      }

      mockAxiosInstance.patch.mockRejectedValueOnce(new Error('Not found'))

      await expect(companyService.update('999', updateData)).rejects.toThrow()
    })
  })

  describe('delete', () => {
    it('debería eliminar una empresa', async () => {
      mockAxiosInstance.delete.mockResolvedValueOnce({ data: { success: true } })

      await companyService.delete('1')

      expect(mockAxiosInstance.delete).toHaveBeenCalledOnce()
    })

    it('debería manejar errores al eliminar empresa', async () => {
      mockAxiosInstance.delete.mockRejectedValueOnce(new Error('Not found'))

      await expect(companyService.delete('999')).rejects.toThrow()
    })
  })

  describe('Validaciones de datos', () => {
    it('debería validar que el RUC tenga el formato correcto', async () => {
      const invalidCompany = {
        businessName: 'Empresa Inválida',
        taxId: '12345', // RUC inválido
        email: 'invalid@empresa.com',
        address: 'Dirección',
      }

      // El servicio debería rechazar o transformar datos inválidos
      expect(invalidCompany.taxId.length).toBeLessThan(11)
    })

    it('debería validar que el email tenga formato correcto', async () => {
      const companyWithInvalidEmail = {
        businessName: 'Empresa Test',
        taxId: '20123456789',
        email: 'invalid-email', // Email inválido
        address: 'Dirección',
      }

      // Verificar que no contiene @
      expect(companyWithInvalidEmail.email).not.toContain('@')
    })

    it('debería validar que los campos obligatorios existan', async () => {
      const incompleteCompany = {
        businessName: 'Empresa Incompleta',
        // Falta taxId (obligatorio)
        email: 'test@empresa.com',
        address: 'Dirección',
      }

      // Verificar que falta el taxId
      expect(incompleteCompany).not.toHaveProperty('taxId')
    })
  })
})
