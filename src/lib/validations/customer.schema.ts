import { z } from 'zod'

// Schema base para Customer - Simplificado para coincidir con el backend
export const customerSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),

  taxOrId: z
    .string()
    .min(8, 'El documento debe tener al menos 8 caracteres')
    .max(20, 'El documento no puede exceder 20 caracteres'),

  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
})

// Schema para crear un nuevo cliente
export const createCustomerSchema = customerSchema

// Schema para actualizar un cliente (todos los campos opcionales)
export const updateCustomerSchema = customerSchema.partial()

// Schema para filtros de búsqueda
export const customerSearchSchema = z.object({
  query: z.string().optional(),
  taxOrId: z.string().optional(),
  email: z.string().optional(),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

// Tipos TypeScript inferidos de los schemas
export type CustomerFormData = z.infer<typeof customerSchema>
export type CreateCustomerData = z.infer<typeof createCustomerSchema>
export type UpdateCustomerData = z.infer<typeof updateCustomerSchema>
export type CustomerSearchFilters = z.infer<typeof customerSearchSchema>
