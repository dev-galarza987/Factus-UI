import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  FileTextIcon,
  Building2Icon,
  UserIcon,
  CalendarIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  Loader2
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { invoiceService, type Invoice } from '../../services/invoiceService'
import { INVOICE_STATUS_LABELS } from '../../lib/validations/invoice.schema'
import { Skeleton } from '../../components/ui/skeleton'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { toast } from 'sonner'

const statusIcons = {
  PENDING: ClockIcon,
  PAID: CheckCircle2Icon,
  CANCELLED: XCircleIcon
}

const statusColors = {
  PENDING: 'text-yellow-600',
  PAID: 'text-green-600',
  CANCELLED: 'text-red-600'
}

export function InvoiceDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (id) {
      loadInvoice(id)
    }
  }, [id])

  const loadInvoice = async (invoiceId: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await invoiceService.getById(invoiceId)
      setInvoice(data)
    } catch (err) {
      setError('Error al cargar la factura')
      console.error('Error loading invoice:', err)
      toast.error('Error al cargar la factura')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    
    if (window.confirm('¿Estás seguro de que deseas eliminar esta factura? Esta acción no se puede deshacer.')) {
      try {
        await invoiceService.delete(id)
        toast.success('Factura eliminada exitosamente')
        navigate('/invoices')
      } catch (err) {
        toast.error('Error al eliminar la factura')
        console.error('Error deleting invoice:', err)
      }
    }
  }

  const handleMarkAsPaid = async () => {
    if (!id) return
    
    try {
      setActionLoading(true)
      await invoiceService.markAsPaid(id)
      toast.success('Factura marcada como pagada')
      await loadInvoice(id)
    } catch (err) {
      toast.error('Error al marcar como pagada')
      console.error('Error marking as paid:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!id) return
    
    if (window.confirm('¿Estás seguro de que deseas cancelar esta factura?')) {
      try {
        setActionLoading(true)
        await invoiceService.cancel(id)
        toast.success('Factura cancelada')
        await loadInvoice(id)
      } catch (err) {
        toast.error('Error al cancelar la factura')
        console.error('Error cancelling invoice:', err)
      } finally {
        setActionLoading(false)
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertDescription>{error || 'Factura no encontrada'}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/invoices')} className="mt-4">
          Volver a Facturas
        </Button>
      </div>
    )
  }

  const StatusIcon = statusIcons[invoice.status]

  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/invoices')}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <FileTextIcon className="h-8 w-8" />
                  {invoice.number}
                </h1>
                <Badge variant={invoice.status === 'PAID' ? 'default' : invoice.status === 'PENDING' ? 'secondary' : 'destructive'}>
                  <StatusIcon className={`h-4 w-4 mr-1 ${statusColors[invoice.status]}`} />
                  {INVOICE_STATUS_LABELS[invoice.status]}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                Detalles de la factura
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {invoice.status === 'PENDING' && (
              <Button
                variant="outline"
                onClick={handleMarkAsPaid}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2Icon className="h-4 w-4 mr-2" />
                )}
                Marcar como Pagada
              </Button>
            )}
            {invoice.status !== 'CANCELLED' && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircleIcon className="h-4 w-4 mr-2" />
                )}
                Cancelar
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate(`/invoices/${id}/edit`)}
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Main Info Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Invoice Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5" />
                  Información de la Factura
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Número:</span>
                  <span className="font-medium">{invoice.number}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monto Total:</span>
                  <span className="font-bold text-lg">{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado:</span>
                  <Badge variant={invoice.status === 'PAID' ? 'default' : invoice.status === 'PENDING' ? 'secondary' : 'destructive'}>
                    {INVOICE_STATUS_LABELS[invoice.status]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Información del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de Creación:</span>
                  <span className="font-medium">{formatDate(invoice.createdAt)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última Actualización:</span>
                  <span className="font-medium">{formatDate(invoice.updatedAt)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono text-xs">{invoice.id}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Company & Customer Info */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Company Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2Icon className="h-5 w-5" />
                  Información de la Empresa
                </CardTitle>
                <CardDescription>
                  Empresa emisora de la factura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {invoice.company ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre:</span>
                      <span className="font-medium">{invoice.company.businessName}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">RFC/Tax ID:</span>
                      <span className="font-medium">{invoice.company.taxId}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Información de empresa no disponible
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Customer Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Información del Cliente
                </CardTitle>
                <CardDescription>
                  Cliente receptor de la factura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {invoice.customer ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre:</span>
                      <span className="font-medium">{invoice.customer.name}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">RFC/ID:</span>
                      <span className="font-medium">{invoice.customer.taxOrId}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Información de cliente no disponible
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
