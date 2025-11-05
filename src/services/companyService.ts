import { apiClient } from '../lib/api/client'
import { API_ENDPOINTS } from '../lib/constants/api'

/**
 * Tipos para el módulo de empresas
 */
export interface Company {
  id: string
  businessName: string
  taxId: string
  email: string
  address: string
  phone?: string
  website?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCompanyDto {
  businessName: string
  taxId: string
  email: string
  address: string
  phone?: string
  website?: string
}

export interface UpdateCompanyDto {
  businessName?: string
  email?: string
  address?: string
  phone?: string
  website?: string
}

export interface SearchCompanyParams {
  query?: string
  page?: number
  limit?: number
}

/**
 * Servicio para operaciones CRUD de empresas
 */
export const companyService = {
  /**
   * Obtener todas las empresas
   */
  async getAll(): Promise<Company[]> {
    const response = await apiClient.get<Company[]>(API_ENDPOINTS.COMPANY.BASE)
    return response.data
  },

  /**
   * Obtener empresa por ID
   */
  async getById(id: string): Promise<Company> {
    const response = await apiClient.get<Company>(API_ENDPOINTS.COMPANY.BY_ID(id))
    return response.data
  },

  /**
   * Crear nueva empresa
   */
  async create(data: CreateCompanyDto): Promise<Company> {
    const response = await apiClient.post<Company>(API_ENDPOINTS.COMPANY.CREATE, data)
    return response.data
  },

  /**
   * Actualizar empresa
   */
  async update(id: string, data: UpdateCompanyDto): Promise<Company> {
    const response = await apiClient.patch<Company>(
      API_ENDPOINTS.COMPANY.UPDATE(id),
      data
    )
    return response.data
  },

  /**
   * Eliminar empresa
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COMPANY.DELETE(id))
  },

  /**
   * Buscar empresa por RUC/Tax ID
   */
  async getByTaxId(taxId: string): Promise<Company> {
    const response = await apiClient.get<Company>(
      API_ENDPOINTS.COMPANY.BY_TAX_ID(taxId)
    )
    return response.data
  },

  /**
   * Buscar empresa por email
   */
  async getByEmail(email: string): Promise<Company> {
    const response = await apiClient.get<Company>(
      API_ENDPOINTS.COMPANY.BY_EMAIL(email)
    )
    return response.data
  },

  /**
   * Buscar empresas con query
   */
  async search(params: SearchCompanyParams): Promise<Company[]> {
    const searchParams = new URLSearchParams()
    if (params.query) searchParams.append('query', params.query)
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())

    const response = await apiClient.get<Company[]>(
      `${API_ENDPOINTS.COMPANY.SEARCH}?${searchParams.toString()}`
    )
    return response.data
  },
}
