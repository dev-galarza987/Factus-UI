import { apiClient } from '../lib/api/client'

// Tipos basados en el backend
export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED'

export interface Invoice {
  id: string
  number: string
  totalAmount: number
  status: InvoiceStatus
  companyId: string
  customerId: string
  createdAt: string
  updatedAt: string
  // Relaciones incluidas en algunas respuestas
  company?: {
    id: string
    businessName: string
    taxId: string
  }
  customer?: {
    id: string
    name: string
    taxOrId: string
  }
  payments?: Payment[]
}

export interface Payment {
  id: string
  amount: number
  method: string
  paymentDate: string
  status: string
  invoiceId: string
}

export interface CreateInvoiceDto {
  number: string
  totalAmount: number
  status: InvoiceStatus
  companyId: string
  customerId: string
}

export interface UpdateInvoiceDto {
  number?: string
  totalAmount?: number
  status?: InvoiceStatus
  companyId?: string
  customerId?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface InvoiceStats {
  totalInvoices: number
  totalRevenue: number
  averageAmount: number
  byStatus: {
    PAID: number
    PENDING: number
    CANCELLED: number
  }
}

export interface RevenueByStatus {
  PAID: number
  PENDING: number
  CANCELLED: number
}

class InvoiceService {
  private basePath = '/invoice'

  // CRUD Básico
  async getAll(): Promise<Invoice[]> {
    const response = await apiClient.get<Invoice[]>(this.basePath)
    return response.data
  }

  async getById(id: string): Promise<Invoice> {
    const response = await apiClient.get<Invoice>(`${this.basePath}/${id}`)
    return response.data
  }

  async create(data: CreateInvoiceDto): Promise<Invoice> {
    const response = await apiClient.post<Invoice>(`${this.basePath}/create`, data)
    return response.data
  }

  async update(id: string, data: UpdateInvoiceDto): Promise<Invoice> {
    const response = await apiClient.patch<Invoice>(`${this.basePath}/${id}/update`, data)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}/delete`)
  }

  // Búsqueda y Filtrado
  async search(query: string): Promise<Invoice[]> {
    const response = await apiClient.get<Invoice[]>(`${this.basePath}/search/query`, {
      params: { q: query }
    })
    return response.data
  }

  async getByNumber(number: string): Promise<Invoice> {
    const response = await apiClient.get<Invoice>(`${this.basePath}/number/${number}`)
    return response.data
  }

  async getByStatus(status: InvoiceStatus): Promise<Invoice[]> {
    const response = await apiClient.get<Invoice[]>(`${this.basePath}/status/${status}`)
    return response.data
  }

  async getByCompany(companyId: string): Promise<Invoice[]> {
    const response = await apiClient.get<Invoice[]>(`${this.basePath}/company/${companyId}`)
    return response.data
  }

  async getByCustomer(customerId: string): Promise<Invoice[]> {
    const response = await apiClient.get<Invoice[]>(`${this.basePath}/customer/${customerId}`)
    return response.data
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Invoice[]> {
    const response = await apiClient.get<Invoice[]>(`${this.basePath}/date-range/search`, {
      params: { startDate, endDate }
    })
    return response.data
  }

  async getByMinAmount(minAmount: number): Promise<Invoice[]> {
    const response = await apiClient.get<Invoice[]>(`${this.basePath}/min-amount/${minAmount}`)
    return response.data
  }

  async getPaginated(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Invoice>> {
    const response = await apiClient.get<PaginatedResponse<Invoice>>(
      `${this.basePath}/paginated/list`,
      { params: { page, limit } }
    )
    return response.data
  }

  // Validación
  async existsById(id: string): Promise<boolean> {
    const response = await apiClient.get<boolean>(`${this.basePath}/exists/id/${id}`)
    return response.data
  }

  async existsByNumber(number: string): Promise<boolean> {
    const response = await apiClient.get<boolean>(`${this.basePath}/exists/number/${number}`)
    return response.data
  }

  // Operaciones de Estado
  async changeStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    const response = await apiClient.patch<Invoice>(`${this.basePath}/${id}/status/${status}`)
    return response.data
  }

  async markAsPaid(id: string): Promise<Invoice> {
    const response = await apiClient.patch<Invoice>(`${this.basePath}/${id}/mark-as-paid`)
    return response.data
  }

  async markAsPending(id: string): Promise<Invoice> {
    const response = await apiClient.patch<Invoice>(`${this.basePath}/${id}/mark-as-pending`)
    return response.data
  }

  async cancel(id: string): Promise<Invoice> {
    const response = await apiClient.patch<Invoice>(`${this.basePath}/${id}/cancel`)
    return response.data
  }

  // Cálculos
  async getTotalPaid(id: string): Promise<number> {
    const response = await apiClient.get<number>(`${this.basePath}/${id}/total-paid`)
    return response.data
  }

  async getBalance(id: string): Promise<number> {
    const response = await apiClient.get<number>(`${this.basePath}/${id}/balance`)
    return response.data
  }

  // Estadísticas
  async getCount(): Promise<number> {
    const response = await apiClient.get<number>(`${this.basePath}/count/total`)
    return response.data
  }

  async getTotalRevenue(): Promise<{ totalRevenue: number }> {
    const response = await apiClient.get<{ totalRevenue: number }>(`${this.basePath}/stats/total-revenue`)
    return response.data
  }

  async getRevenueByStatus(): Promise<RevenueByStatus> {
    const response = await apiClient.get<RevenueByStatus>(`${this.basePath}/stats/revenue-by-status`)
    return response.data
  }

  async getGeneralStats(): Promise<InvoiceStats> {
    const response = await apiClient.get<InvoiceStats>(`${this.basePath}/stats/general`)
    return response.data
  }
}

export const invoiceService = new InvoiceService()
