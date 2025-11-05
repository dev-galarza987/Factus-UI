import axios from 'axios'

const API_BASE_URL = 'http://localhost:4500/api/v1'
const PAYMENT_ENDPOINT = `${API_BASE_URL}/payment`

// ============================================
// Tipos e Interfaces
// ============================================

export type PaymentMethod = 
  | 'CASH' 
  | 'CREDIT_CARD' 
  | 'DEBIT_CARD' 
  | 'BANK_TRANSFER' 
  | 'CHECK' 
  | 'OTHER'

export interface Payment {
  id: string
  method: PaymentMethod
  amount: number
  paymentDate: string
  invoiceId: string
  reference?: string
  notes?: string
  createdAt: string
  updatedAt: string
  // Relaciones
  invoice?: {
    id: string
    number: string
    totalAmount: number
    status: string
    company?: {
      id: string
      name: string
    }
    customer?: {
      id: string
      name: string
    }
  }
}

export interface CreatePaymentDTO {
  method: PaymentMethod
  amount: number
  invoiceId: string
  paymentDate?: string
  reference?: string
  notes?: string
}

export interface UpdatePaymentDTO {
  method?: PaymentMethod
  amount?: number
  invoiceId?: string
  paymentDate?: string
  reference?: string
  notes?: string
}

export interface PaginatedPaymentsResponse {
  data: Payment[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaymentStats {
  totalPayments: number
  totalCollected: number
  averagePayment: number
  byMethod: Record<PaymentMethod, number>
}

export interface CollectedByMethodResponse {
  CASH?: number
  CREDIT_CARD?: number
  DEBIT_CARD?: number
  BANK_TRANSFER?: number
  CHECK?: number
  OTHER?: number
}

export interface PeriodStats {
  totalPayments: number
  totalAmount: number
  averageAmount: number
  byMethod: Record<string, number>
  startDate: string
  endDate: string
}

// ============================================
// CRUD Básico
// ============================================

export const paymentService = {
  /**
   * Crear un nuevo pago
   */
  async create(data: CreatePaymentDTO): Promise<Payment> {
    const response = await axios.post(`${PAYMENT_ENDPOINT}/create`, data)
    return response.data
  },

  /**
   * Obtener todos los pagos
   */
  async getAll(): Promise<Payment[]> {
    const response = await axios.get(PAYMENT_ENDPOINT)
    return response.data
  },

  /**
   * Obtener un pago por ID
   */
  async getById(id: string): Promise<Payment> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/${id}`)
    return response.data
  },

  /**
   * Actualizar un pago
   */
  async update(id: string, data: UpdatePaymentDTO): Promise<Payment> {
    const response = await axios.patch(`${PAYMENT_ENDPOINT}/${id}/update`, data)
    return response.data
  },

  /**
   * Eliminar un pago
   */
  async delete(id: string): Promise<void> {
    await axios.delete(`${PAYMENT_ENDPOINT}/${id}/delete`)
  },

  // ============================================
  // Búsqueda y Filtrado
  // ============================================

  /**
   * Obtener pagos por factura
   */
  async getByInvoice(invoiceId: string): Promise<Payment[]> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/invoice/${invoiceId}`)
    return response.data
  },

  /**
   * Buscar por método de pago
   */
  async getByMethod(method: PaymentMethod): Promise<Payment[]> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/method/${method}`)
    return response.data
  },

  /**
   * Buscar por rango de fechas
   */
  async getByDateRange(startDate: string, endDate: string): Promise<Payment[]> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/date-range/search`, {
      params: { startDate, endDate }
    })
    return response.data
  },

  /**
   * Buscar por monto mínimo
   */
  async getByMinAmount(minAmount: number): Promise<Payment[]> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/min-amount/${minAmount}`)
    return response.data
  },

  /**
   * Obtener listado paginado
   */
  async getPaginated(page = 1, limit = 10): Promise<PaginatedPaymentsResponse> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/paginated/list`, {
      params: { page, limit }
    })
    return response.data
  },

  // ============================================
  // Validación
  // ============================================

  /**
   * Verificar si existe un pago por ID
   */
  async existsById(id: string): Promise<boolean> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/exists/id/${id}`)
    return response.data
  },

  // ============================================
  // Cálculos
  // ============================================

  /**
   * Calcular total pagado por factura
   */
  async getTotalPaidByInvoice(invoiceId: string): Promise<number> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/calculate/total-paid/${invoiceId}`)
    return response.data
  },

  /**
   * Calcular saldo pendiente por factura
   */
  async getBalanceByInvoice(invoiceId: string): Promise<number> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/calculate/balance/${invoiceId}`)
    return response.data
  },

  /**
   * Verificar si factura está completamente pagada
   */
  async isInvoiceFullyPaid(invoiceId: string): Promise<boolean> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/check/fully-paid/${invoiceId}`)
    return response.data
  },

  // ============================================
  // Estadísticas
  // ============================================

  /**
   * Contar total de pagos
   */
  async getTotalCount(): Promise<number> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/count/total`)
    return response.data
  },

  /**
   * Obtener total recaudado
   */
  async getTotalCollected(): Promise<{ totalCollected: number }> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/stats/total-collected`)
    return response.data
  },

  /**
   * Obtener total recaudado por método
   */
  async getCollectedByMethod(): Promise<CollectedByMethodResponse> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/stats/collected-by-method`)
    return response.data
  },

  /**
   * Obtener promedio de pagos
   */
  async getAveragePayment(): Promise<number> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/stats/average-payment`)
    return response.data
  },

  /**
   * Obtener pagos más grandes
   */
  async getLargestPayments(limit = 10): Promise<Payment[]> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/stats/largest-payments`, {
      params: { limit }
    })
    return response.data
  },

  /**
   * Obtener estadísticas por período
   */
  async getStatsByPeriod(startDate: string, endDate: string): Promise<PeriodStats> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/stats/by-period`, {
      params: { startDate, endDate }
    })
    return response.data
  },

  /**
   * Obtener estadísticas generales
   */
  async getGeneralStats(): Promise<PaymentStats> {
    const response = await axios.get(`${PAYMENT_ENDPOINT}/stats/general`)
    return response.data
  },

  // ============================================
  // Utilidades
  // ============================================

  /**
   * Obtener lista de métodos de pago disponibles
   */
  getPaymentMethods(): Array<{ value: PaymentMethod; label: string }> {
    return [
      { value: 'CASH', label: 'Efectivo' },
      { value: 'CREDIT_CARD', label: 'Tarjeta de Crédito' },
      { value: 'DEBIT_CARD', label: 'Tarjeta de Débito' },
      { value: 'BANK_TRANSFER', label: 'Transferencia Bancaria' },
      { value: 'CHECK', label: 'Cheque' },
      { value: 'OTHER', label: 'Otro' },
    ]
  },

  /**
   * Obtener etiqueta de método de pago
   */
  getPaymentMethodLabel(method: PaymentMethod): string {
    const methods = this.getPaymentMethods()
    return methods.find(m => m.value === method)?.label || method
  },

  /**
   * Formatear fecha de pago
   */
  formatPaymentDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  },
}
