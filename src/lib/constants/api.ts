/**
 * Configuración de la API REST de Factus
 * Base URL y endpoints principales
 */

export const API_CONFIG = {
  BASE_URL: 'http://localhost:4500/api/v1',
  TIMEOUT: 10000, // 10 segundos
} as const

export const API_ENDPOINTS = {
  // Empresas
  COMPANY: {
    BASE: '/company',
    CREATE: '/company/create',
    UPDATE: (id: string) => `/company/${id}/update`,
    DELETE: (id: string) => `/company/${id}/delete`,
    BY_ID: (id: string) => `/company/${id}`,
    BY_TAX_ID: (taxId: string) => `/company/tax-id/${taxId}`,
    BY_EMAIL: (email: string) => `/company/email/${email}`,
    SEARCH: '/company/search',
  },

  // Clientes
  CUSTOMER: {
    BASE: '/customer',
    CREATE: '/customer/create',
    UPDATE: (id: string) => `/customer/${id}/update`,
    DELETE: (id: string) => `/customer/${id}/delete`,
    BY_ID: (id: string) => `/customer/${id}`,
    BY_TAX_ID: (taxId: string) => `/customer/tax-id/${taxId}`,
    BY_EMAIL: (email: string) => `/customer/email/${email}`,
    SEARCH: '/customer/search',
  },

  // Facturas
  INVOICE: {
    BASE: '/invoice',
    CREATE: '/invoice/create',
    UPDATE: (id: string) => `/invoice/${id}/update`,
    DELETE: (id: string) => `/invoice/${id}/delete`,
    BY_ID: (id: string) => `/invoice/${id}`,
    BY_COMPANY: (companyId: string) => `/invoice/company/${companyId}`,
    BY_CUSTOMER: (customerId: string) => `/invoice/customer/${customerId}`,
    BY_NUMBER: (invoiceNumber: string) => `/invoice/number/${invoiceNumber}`,
    BY_DATE_RANGE: '/invoice/date-range',
    BY_STATUS: (status: string) => `/invoice/status/${status}`,
    SEARCH: '/invoice/search',
  },

  // Detalles de Factura
  INVOICE_DETAIL: {
    BASE: '/invoice-detail',
    CREATE: '/invoice-detail/create',
    UPDATE: (id: string) => `/invoice-detail/${id}/update`,
    DELETE: (id: string) => `/invoice-detail/${id}/delete`,
    BY_ID: (id: string) => `/invoice-detail/${id}`,
    BY_INVOICE: (invoiceId: string) => `/invoice-detail/invoice/${invoiceId}`,
  },

  // Pagos
  PAYMENT: {
    BASE: '/payment',
    CREATE: '/payment/create',
    UPDATE: (id: string) => `/payment/${id}/update`,
    DELETE: (id: string) => `/payment/${id}/delete`,
    BY_ID: (id: string) => `/payment/${id}`,
    BY_INVOICE: (invoiceId: string) => `/payment/invoice/${invoiceId}`,
    BY_DATE_RANGE: '/payment/date-range',
    BY_METHOD: (method: string) => `/payment/method/${method}`,
    SEARCH: '/payment/search',
  },

  // Usuarios
  USER: {
    BASE: '/user',
    CREATE: '/user/create',
    UPDATE: (id: string) => `/user/${id}/update`,
    DELETE: (id: string) => `/user/${id}/delete`,
    BY_ID: (id: string) => `/user/${id}`,
    BY_USERNAME: (username: string) => `/user/username/${username}`,
    BY_EMAIL: (email: string) => `/user/email/${email}`,
    BY_ROLE: (role: string) => `/user/role/${role}`,
    SEARCH: '/user/search',
  },
} as const

/**
 * Estados HTTP comunes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const

/**
 * Roles de usuario
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer',
} as const

/**
 * Estados de factura
 */
export const INVOICE_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  OVERDUE: 'overdue',
} as const

/**
 * Métodos de pago
 */
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  CHECK: 'check',
} as const
