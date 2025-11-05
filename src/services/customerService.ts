import { apiClient } from '../lib/api/client'

// Tipos de datos para Customer (basados en el backend)
export interface Customer {
  id: string
  name: string
  taxOrId: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerDto {
  name: string
  taxOrId: string
  email: string
}

export interface UpdateCustomerDto {
  name?: string
  taxOrId?: string
  email?: string
}

class CustomerService {
  private readonly basePath = '/customer'

  async getAll(): Promise<Customer[]> {
    const response = await apiClient.get<Customer[]>(this.basePath)
    return response.data
  }

  async getById(id: string): Promise<Customer> {
    const response = await apiClient.get<Customer>(`${this.basePath}/${id}`)
    return response.data
  }

  async create(data: CreateCustomerDto): Promise<Customer> {
    const response = await apiClient.post<Customer>(`${this.basePath}/create`, data)
    return response.data
  }

  async update(id: string, data: UpdateCustomerDto): Promise<Customer> {
    const response = await apiClient.patch<Customer>(`${this.basePath}/${id}/update`, data)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}/delete`)
  }

  async search(query: string): Promise<Customer[]> {
    const response = await apiClient.get<Customer[]>(`${this.basePath}/search/query`, {
      params: { q: query }
    })
    return response.data
  }

  async getByCompany(companyId: string): Promise<Customer[]> {
    const response = await apiClient.get<Customer[]>(`${this.basePath}/company/${companyId}`)
    return response.data
  }
}

export const customerService = new CustomerService()
