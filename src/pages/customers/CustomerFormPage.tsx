import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, SaveIcon, UsersIcon } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { customerService, type UpdateCustomerDto } from '../../services/customerService'
import { createCustomerSchema, type CustomerFormData } from '../../lib/validations/customer.schema'
import { Header } from '../../components/Header'

export function CustomerFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = Boolean(id)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingData, setLoadingData] = useState(isEditMode)

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CustomerFormData>({
    resolver: zodResolver(createCustomerSchema),
    mode: 'onBlur'
  })

  useEffect(() => {
    const loadData = async () => {
      if (id && isEditMode) {
        try {
          setLoadingData(true)
          const customer = await customerService.getById(id)
          setValue('name', customer.name)
          setValue('taxOrId', customer.taxOrId)
          setValue('email', customer.email)
        } catch (err) {
          setError('Error al cargar los datos del cliente')
          console.error('Error loading customer:', err)
        } finally {
          setLoadingData(false)
        }
      }
    }
    loadData()
  }, [id, isEditMode, setValue])

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setLoading(true)
      setError(null)

      if (isEditMode && id) {
        const updateData: UpdateCustomerDto = {
          name: data.name,
          taxOrId: data.taxOrId,
          email: data.email
        }
        await customerService.update(id, updateData)
      } else {
        await customerService.create({
          name: data.name,
          taxOrId: data.taxOrId,
          email: data.email
        })
      }

      navigate('/customers')
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Error al guardar el cliente')
      console.error('Error saving customer:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-muted rounded" />
              <div className="h-96 bg-muted rounded" />
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/customers')}
              className="mb-4"
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              Volver a clientes
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <UsersIcon className="size-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h1>
                <p className="text-muted-foreground">
                  {isEditMode ? 'Actualiza la información del cliente' : 'Completa los datos del nuevo cliente'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Información del Cliente</CardTitle>
                <CardDescription>
                  {isEditMode ? 'Edita los campos necesarios' : 'Todos los campos marcados con * son obligatorios'}
                </CardDescription>
              </CardHeader>
              <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Información del Cliente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Datos del Cliente</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Juan Carlos Pérez González"
                        disabled={loading}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxOrId">Documento/RUC *</Label>
                      <Input
                        id="taxOrId"
                        {...register('taxOrId')}
                        placeholder="12345678"
                        disabled={loading}
                      />
                      {errors.taxOrId && (
                        <p className="text-sm text-destructive">{errors.taxOrId.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="cliente@ejemplo.com"
                        disabled={loading}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/customers')}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="mr-2">Guardando...</span>
                      </>
                    ) : (
                      <>
                        <SaveIcon className="size-4 mr-2" />
                        {isEditMode ? 'Actualizar' : 'Crear'} Cliente
                      </>
                    )}
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
