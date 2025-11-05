import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, SaveIcon, BuildingIcon } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Header } from '../../components/Header'
import { companyService, type CreateCompanyDto, type UpdateCompanyDto } from '../../services/companyService'

type CompanyFormData = CreateCompanyDto

export function CompanyFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingData, setLoadingData] = useState(isEditMode)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>()

  // Cargar datos de la empresa si estamos en modo edición
  useEffect(() => {
    if (isEditMode && id) {
      loadCompanyData(id)
    }
  }, [id, isEditMode])

  const loadCompanyData = async (companyId: string) => {
    try {
      setLoadingData(true)
      const company = await companyService.getById(companyId)
      reset({
        businessName: company.businessName,
        taxId: company.taxId,
        email: company.email,
        address: company.address,
        phone: company.phone || '',
        website: company.website || '',
      })
    } catch (err) {
      setError('Error al cargar los datos de la empresa')
      console.error('Error loading company:', err)
    } finally {
      setLoadingData(false)
    }
  }

  const onSubmit = async (data: CompanyFormData) => {
    try {
      setLoading(true)
      setError(null)

      if (isEditMode && id) {
        // Actualizar empresa existente
        const updateData: UpdateCompanyDto = {
          businessName: data.businessName,
          email: data.email,
          address: data.address,
          phone: data.phone || undefined,
          website: data.website || undefined,
        }
        await companyService.update(id, updateData)
      } else {
        // Crear nueva empresa
        await companyService.create(data)
      }

      navigate('/companies')
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
        (isEditMode ? 'Error al actualizar la empresa' : 'Error al crear la empresa')
      setError(errorMessage)
      console.error('Error saving company:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded animate-pulse" />
                  <div className="h-8 bg-muted rounded animate-pulse" />
                  <div className="h-8 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/companies')}
              className="mb-4"
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              Volver a empresas
            </Button>
            <motion.h1 
              className="text-3xl font-bold flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <BuildingIcon className="size-8 text-primary" />
              {isEditMode ? 'Editar Empresa' : 'Nueva Empresa'}
            </motion.h1>
            <motion.p 
              className="text-muted-foreground mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              {isEditMode 
                ? 'Actualiza la información de la empresa' 
                : 'Completa el formulario para registrar una nueva empresa'}
            </motion.p>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Información de la Empresa</CardTitle>
                <CardDescription>
                  Los campos marcados con * son obligatorios
                </CardDescription>
              </CardHeader>
              <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Razón Social */}
                <div className="space-y-2">
                  <Label htmlFor="businessName">
                    Razón Social <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="businessName"
                    {...register('businessName', {
                      required: 'La razón social es obligatoria',
                      minLength: {
                        value: 3,
                        message: 'Debe tener al menos 3 caracteres'
                      }
                    })}
                    placeholder="Ej: Tech Solutions S.A.C."
                    disabled={loading}
                  />
                  {errors.businessName && (
                    <p className="text-sm text-destructive">{errors.businessName.message}</p>
                  )}
                </div>

                {/* RUC / Tax ID */}
                <div className="space-y-2">
                  <Label htmlFor="taxId">
                    RUC / Tax ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="taxId"
                    {...register('taxId', {
                      required: 'El RUC es obligatorio',
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: 'El RUC debe tener 11 dígitos'
                      }
                    })}
                    placeholder="20123456789"
                    disabled={loading || isEditMode} // No permitir editar RUC
                    maxLength={11}
                  />
                  {errors.taxId && (
                    <p className="text-sm text-destructive">{errors.taxId.message}</p>
                  )}
                  {isEditMode && (
                    <p className="text-xs text-muted-foreground">
                      El RUC no puede ser modificado
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'El email es obligatorio',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                    placeholder="contacto@empresa.com"
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Dirección */}
                <div className="space-y-2">
                  <Label htmlFor="address">
                    Dirección <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address"
                    {...register('address', {
                      required: 'La dirección es obligatoria',
                      minLength: {
                        value: 10,
                        message: 'Debe tener al menos 10 caracteres'
                      }
                    })}
                    placeholder="Av. Javier Prado 123, San Isidro, Lima"
                    disabled={loading}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone', {
                      pattern: {
                        value: /^[0-9+\-\s()]+$/,
                        message: 'Formato de teléfono inválido'
                      }
                    })}
                    placeholder="+51 999 999 999"
                    disabled={loading}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input
                    id="website"
                    type="url"
                    {...register('website', {
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Debe ser una URL válida (http:// o https://)'
                      }
                    })}
                    placeholder="https://www.empresa.com"
                    disabled={loading}
                  />
                  {errors.website && (
                    <p className="text-sm text-destructive">{errors.website.message}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>Guardando...</>
                    ) : (
                      <>
                        <SaveIcon className="size-4 mr-2" />
                        {isEditMode ? 'Actualizar' : 'Crear'} Empresa
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/companies')}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}
