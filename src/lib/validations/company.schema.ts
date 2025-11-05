import { z } from 'zod'

// Schema base de empresa
export const companySchema = z.object({
  businessName: z
    .string()
    .min(3, 'La razón social debe tener al menos 3 caracteres')
    .max(255, 'La razón social no puede exceder 255 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9.,&-]+$/, 'La razón social contiene caracteres no válidos'),

  taxId: z
    .string()
    .length(11, 'El RUC debe tener exactamente 11 dígitos')
    .regex(/^\d{11}$/, 'El RUC debe contener solo números'),

  email: z
    .string()
    .email('Formato de email no válido')
    .toLowerCase()
    .max(255, 'El email no puede exceder 255 caracteres'),

  address: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(500, 'La dirección no puede exceder 500 caracteres'),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s()+\-]{7,20}$/.test(val),
      'El teléfono debe tener entre 7 y 20 caracteres (números, espacios, +, -, (, ))'
    ),

  website: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(val),
      'El formato del sitio web no es válido'
    ),
})

// Schema para crear empresa
export const createCompanySchema = companySchema

// Schema para actualizar empresa (taxId no se puede modificar)
export const updateCompanySchema = companySchema.omit({ taxId: true })

// Schema para filtros de búsqueda
export const companySearchSchema = z.object({
  query: z.string().optional(),
  taxId: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
  sortBy: z.enum(['businessName', 'taxId', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

// Tipos TypeScript derivados de los schemas
export type CompanyFormData = z.infer<typeof companySchema>
export type CreateCompanyData = z.infer<typeof createCompanySchema>
export type UpdateCompanyData = z.infer<typeof updateCompanySchema>
export type CompanySearchFilters = z.infer<typeof companySearchSchema>
