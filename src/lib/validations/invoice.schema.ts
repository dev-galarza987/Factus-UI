import { z } from 'zod'

// Schema base para factura
export const invoiceSchema = z.object({
  number: z
    .string()
    .min(1, 'El número de factura es requerido')
    .regex(/^FAC-\d{4}-\d{4,}$/, 'Formato inválido. Use: FAC-YYYY-NNNN'),
  totalAmount: z
    .number({ message: 'El monto total es requerido' })
    .positive('El monto debe ser mayor a 0')
    .min(0.01, 'El monto mínimo es 0.01'),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED'], {
    message: 'El estado es requerido'
  }),
  companyId: z
    .string()
    .uuid('ID de empresa inválido')
    .min(1, 'La empresa es requerida'),
  customerId: z
    .string()
    .uuid('ID de cliente inválido')
    .min(1, 'El cliente es requerido')
})

// Schema para crear (sin status default)
export const createInvoiceSchema = invoiceSchema

// Schema para actualizar (todos campos opcionales)
export const updateInvoiceSchema = invoiceSchema.partial()

// Schema para búsqueda avanzada
export const invoiceSearchSchema = z.object({
  query: z.string().optional(),
  number: z.string().optional(),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']).optional(),
  companyId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional(),
  sortBy: z.enum(['number', 'totalAmount', 'status', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// Tipos inferidos
export type InvoiceFormData = z.infer<typeof invoiceSchema>
export type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>
export type UpdateInvoiceFormData = z.infer<typeof updateInvoiceSchema>
export type InvoiceSearchFilters = z.infer<typeof invoiceSearchSchema>

// Helper para validar número de factura
export const isValidInvoiceNumber = (number: string): boolean => {
  return /^FAC-\d{4}-\d{4,}$/.test(number)
}

// Helper para generar número de factura
export const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `FAC-${year}-${random}`
}

// Constantes
export const INVOICE_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED'
} as const

export const INVOICE_STATUS_LABELS = {
  PENDING: 'Pendiente',
  PAID: 'Pagada',
  CANCELLED: 'Cancelada'
} as const

export const INVOICE_STATUS_COLORS = {
  PENDING: 'warning',
  PAID: 'success',
  CANCELLED: 'destructive'
} as const
