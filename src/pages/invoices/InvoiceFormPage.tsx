import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, SaveIcon, FileText, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '../../components/ui/select'
import { invoiceService, type UpdateInvoiceDto } from '../../services/invoiceService'
import { companyService, type Company } from '../../services/companyService'
import { customerService, type Customer } from '../../services/customerService'
import { createInvoiceSchema, type InvoiceFormData, INVOICE_STATUS_LABELS, generateInvoiceNumber } from '../../lib/validations/invoice.schema'
import { toast } from 'sonner'

export function InvoiceFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = Boolean(id)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingData, setLoadingData] = useState(isEditMode)
  const [companies, setCompanies] = useState<Company[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const [loadingCustomers, setLoadingCustomers] = useState(true)

  const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<InvoiceFormData>({
    resolver: zodResolver(createInvoiceSchema),
    mode: 'onBlur',
    defaultValues: {
      number: generateInvoiceNumber(),
      status: 'PENDING',
      totalAmount: 0
    }
  })

  useEffect(() => {
    loadCompanies()
    loadCustomers()
  }, [])

  useEffect(() => {
    const loadData = async () => {
      if (id && isEditMode) {
        try {
          setLoadingData(true)
          const invoice = await invoiceService.getById(id)
          setValue('number', invoice.number)
          setValue('totalAmount', invoice.totalAmount)
          setValue('status', invoice.status)
          setValue('companyId', invoice.companyId)
          setValue('customerId', invoice.customerId)
        } catch (err) {
          setError('Error al cargar los datos de la factura')
          console.error('Error loading invoice:', err)
          toast.error('Error al cargar la factura')
        } finally {
          setLoadingData(false)
        }
      }
    }
    loadData()
  }, [id, isEditMode, setValue])

  const loadCompanies = async () => {
    try {
      setLoadingCompanies(true)
      const data = await companyService.getAll()
      setCompanies(data)
    } catch (error) {
      console.error('Error al cargar empresas:', error)
      toast.error('Error al cargar las empresas')
    } finally {
      setLoadingCompanies(false)
    }
  }

  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true)
      const data = await customerService.getAll()
      setCustomers(data)
    } catch (error) {
      console.error('Error al cargar clientes:', error)
      toast.error('Error al cargar los clientes')
    } finally {
      setLoadingCustomers(false)
    }
  }

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setLoading(true)
      setError(null)

      if (isEditMode && id) {
        const updateData: UpdateInvoiceDto = {
          number: data.number,
          totalAmount: data.totalAmount,
          status: data.status,
          companyId: data.companyId,
          customerId: data.customerId
        }
        await invoiceService.update(id, updateData)
        toast.success('Factura actualizada exitosamente')
      } else {
        await invoiceService.create({
          number: data.number,
          totalAmount: data.totalAmount,
          status: data.status,
          companyId: data.companyId,
          customerId: data.customerId
        })
        toast.success('Factura creada exitosamente')
      }

      navigate('/invoices')
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      const message = error.response?.data?.message || 'Error al guardar la factura'
      setError(message)
      toast.error(message)
      console.error('Error saving invoice:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/invoices')}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <FileText className="h-8 w-8" />
                {isEditMode ? 'Editar Factura' : 'Nueva Factura'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEditMode ? 'Modifique los datos de la factura' : 'Complete el formulario para crear una nueva factura'}
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Invoice Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Factura</CardTitle>
              <CardDescription>
                Datos básicos de la factura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Invoice Number */}
                <div className="space-y-2">
                  <Label htmlFor="number">
                    Número de Factura <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="number"
                    placeholder="FAC-2025-0001"
                    {...register('number')}
                    disabled={loading}
                  />
                  {errors.number && (
                    <p className="text-sm text-destructive">{errors.number.message}</p>
                  )}
                </div>

                {/* Total Amount */}
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">
                    Monto Total <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    {...register('totalAmount', { valueAsNumber: true })}
                    disabled={loading}
                  />
                  {errors.totalAmount && (
                    <p className="text-sm text-destructive">{errors.totalAmount.message}</p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Estado <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={loading}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">{INVOICE_STATUS_LABELS.PENDING}</SelectItem>
                          <SelectItem value="PAID">{INVOICE_STATUS_LABELS.PAID}</SelectItem>
                          <SelectItem value="CANCELLED">{INVOICE_STATUS_LABELS.CANCELLED}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <p className="text-sm text-destructive">{errors.status.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company & Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Empresa y Cliente</CardTitle>
              <CardDescription>
                Seleccione la empresa y el cliente asociados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="companyId">
                    Empresa <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="companyId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={loading || loadingCompanies}
                      >
                        <SelectTrigger id="companyId">
                          <SelectValue placeholder={loadingCompanies ? "Cargando..." : "Seleccione una empresa"} />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.businessName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.companyId && (
                    <p className="text-sm text-destructive">{errors.companyId.message}</p>
                  )}
                </div>

                {/* Customer */}
                <div className="space-y-2">
                  <Label htmlFor="customerId">
                    Cliente <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="customerId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={loading || loadingCustomers}
                      >
                        <SelectTrigger id="customerId">
                          <SelectValue placeholder={loadingCustomers ? "Cargando..." : "Seleccione un cliente"} />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.customerId && (
                    <p className="text-sm text-destructive">{errors.customerId.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/invoices')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Actualizar' : 'Crear'} Factura
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
