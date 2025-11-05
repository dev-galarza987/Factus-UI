import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  UserIcon,
  MailIcon,
  CalendarIcon,
  FileTextIcon
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { Header } from '../../components/Header'
import { customerService, type Customer } from '../../services/customerService'
import { Skeleton } from '../../components/ui/skeleton'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { CustomerRelations, type CustomerRelationsData } from '../../components/customers'

export function CustomerDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Datos mock para relaciones (sin company data)
  const mockRelations: CustomerRelationsData = {
    invoices: [
      {
        id: '1',
        invoiceNumber: 'F001-00123',
        amount: 1500,
        status: 'paid',
        issueDate: '2024-01-15',
        dueDate: '2024-02-15'
      },
      {
        id: '2',
        invoiceNumber: 'F001-00124',
        amount: 2300,
        status: 'pending',
        issueDate: '2024-02-01',
        dueDate: '2024-03-01'
      },
      {
        id: '3',
        invoiceNumber: 'F001-00125',
        amount: 1800,
        status: 'paid',
        issueDate: '2024-02-15',
        dueDate: '2024-03-15'
      }
    ],
    payments: [
      {
        id: '1',
        invoiceNumber: 'F001-00123',
        amount: 1500,
        method: 'Transferencia Bancaria',
        paymentDate: '2024-02-10',
        status: 'completed'
      },
      {
        id: '2',
        invoiceNumber: 'F001-00125',
        amount: 1800,
        method: 'Efectivo',
        paymentDate: '2024-03-10',
        status: 'completed'
      }
    ],
    summary: {
      totalInvoices: 3,
      totalPurchases: 5600,
      pendingAmount: 2300,
      lastPurchaseDate: '2024-02-15'
    }
  }

  useEffect(() => {
    if (id) {
      loadCustomer(id)
    }
  }, [id])

  const loadCustomer = async (customerId: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await customerService.getById(customerId)
      setCustomer(data)
    } catch (err) {
      setError('Error al cargar el cliente')
      console.error('Error loading customer:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.')) {
      try {
        await customerService.delete(id)
        navigate('/customers')
      } catch (err) {
        alert('Error al eliminar el cliente')
        console.error('Error deleting customer:', err)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </>
    )
  }

  if (error || !customer) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive">
              <AlertDescription>{error || 'Cliente no encontrado'}</AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={() => navigate('/customers')}
              className="mt-4"
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              Volver a clientes
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
          </motion.div>

          {/* Customer Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="flex size-16 items-center justify-center rounded-lg bg-primary/10"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 250, damping: 15 }}
                    >
                      <UserIcon className="size-8 text-primary" />
                    </motion.div>
                    <div>
                      <h1 className="text-2xl font-bold mb-1">
                        {customer.name}
                      </h1>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-mono">
                          {customer.taxOrId}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        ID: {customer.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/customers/${customer.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <PencilIcon className="size-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                    >
                      <TrashIcon className="size-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Información de Contacto */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Información del Cliente</CardTitle>
                  <CardDescription>Datos de contacto del cliente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <UserIcon className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Nombre Completo</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.name}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <FileTextIcon className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Documento/RUC</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {customer.taxOrId}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <MailIcon className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a
                        href={`mailto:${customer.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {customer.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Información del Sistema */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Información del Sistema</CardTitle>
                  <CardDescription>Datos de registro y actualización</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium mb-1">Fecha de Creación</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(customer.createdAt)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <CalendarIcon className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium mb-1">Última Actualización</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(customer.updatedAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Relaciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-6"
          >
            <CustomerRelations customerId={customer.id} relations={mockRelations} />
          </motion.div>
        </div>
      </div>
    </>
  )
}
