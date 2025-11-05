import { z } from 'zod'

// ============================================
// Enums
// ============================================

export const PaymentMethodEnum = z.enum([
  'CASH',
  'CREDIT_CARD',
  'DEBIT_CARD',
  'BANK_TRANSFER',
  'CHECK',
  'OTHER'
])

export type PaymentMethod = z.infer<typeof PaymentMethodEnum>

// ============================================
// Esquemas de Validación
// ============================================

/**
 * Schema para crear un pago
 */
export const createPaymentSchema = z.object({
  method: PaymentMethodEnum,
  amount: z
    .number()
    .positive('El monto debe ser mayor a 0')
    .max(999999999.99, 'El monto es demasiado grande'),
  invoiceId: z
    .string()
    .uuid('ID de factura inválido')
    .min(1, 'La factura es requerida'),
  paymentDate: z
    .string()
    .datetime()
    .optional(),
  reference: z
    .string()
    .max(100, 'La referencia no puede exceder 100 caracteres')
    .optional(),
  notes: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional(),
})

/**
 * Schema para actualizar un pago
 */
export const updatePaymentSchema = createPaymentSchema.partial()

/**
 * Schema para filtros de búsqueda
 */
export const paymentSearchSchema = z.object({
  method: PaymentMethodEnum.optional(),
  invoiceId: z.string().uuid().optional(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  reference: z.string().optional(),
})

// ============================================
// Tipos derivados
// ============================================

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>
export type PaymentSearchInput = z.infer<typeof paymentSearchSchema>

// ============================================
// Constantes de Validación
// ============================================

export const PAYMENT_VALIDATION = {
  AMOUNT: {
    MIN: 0.01,
    MAX: 999999999.99,
  },
  REFERENCE: {
    MAX_LENGTH: 100,
  },
  NOTES: {
    MAX_LENGTH: 500,
  },
} as const

// ============================================
// Helpers
// ============================================

/**
 * Validar que la fecha de pago no sea futura
 */
export function validatePaymentDate(date: string | Date): boolean {
  const paymentDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  return paymentDate <= now
}

/**
 * Validar que el monto no exceda el saldo de la factura
 */
export function validatePaymentAmount(
  amount: number,
  invoiceTotal: number,
  alreadyPaid: number = 0
): { valid: boolean; message?: string } {
  const remaining = invoiceTotal - alreadyPaid

  if (amount <= 0) {
    return { valid: false, message: 'El monto debe ser mayor a 0' }
  }

  if (amount > remaining) {
    return {
      valid: false,
      message: `El monto excede el saldo pendiente (${remaining.toFixed(2)})`,
    }
  }

  return { valid: true }
}

/**
 * Obtener el label en español del método de pago
 */
export function getPaymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    CASH: 'Efectivo',
    CREDIT_CARD: 'Tarjeta de Crédito',
    DEBIT_CARD: 'Tarjeta de Débito',
    BANK_TRANSFER: 'Transferencia Bancaria',
    CHECK: 'Cheque',
    OTHER: 'Otro',
  }
  return labels[method]
}

/**
 * Obtener color para badge según método de pago
 */
export function getPaymentMethodColor(method: PaymentMethod): string {
  const colors: Record<PaymentMethod, string> = {
    CASH: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    CREDIT_CARD: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    DEBIT_CARD: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    BANK_TRANSFER: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
    CHECK: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  }
  return colors[method]
}

/**
 * Formatear monto con símbolo de moneda
 */
export function formatPaymentAmount(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formatear fecha de pago
 */
export function formatPaymentDate(date: string | Date): string {
  const paymentDate = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(paymentDate)
}

/**
 * Formatear fecha con hora
 */
export function formatPaymentDateTime(date: string | Date): string {
  const paymentDate = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(paymentDate)
}
