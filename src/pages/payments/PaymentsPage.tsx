import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  Trash2,
  DollarSign,
  FileText,
  TrendingUp,
  CreditCard,
  RefreshCw
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog'
import { toast } from 'sonner'
import { paymentService, type Payment } from '../../service/payment/paymentService'
import { formatPaymentAmount, formatPaymentDate, getPaymentMethodLabel, getPaymentMethodColor } from '../../service/payment/payment.schema'

export function PaymentsPage() {
  const navigate = useNavigate()
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [methodFilter, setMethodFilter] = useState<string>('ALL')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null)

  // Estadísticas
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalCollected: 0,
    averagePayment: 0,
    todayPayments: 0
  })

  useEffect(() => {
    loadPayments()
    loadStats()
  }, [])

  useEffect(() => {
    filterPayments()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments, searchTerm, methodFilter])

  const loadPayments = async () => {
    try {
      setLoading(true)
      const data = await paymentService.getAll()
      setPayments(data)
    } catch (error) {
      console.error('Error loading payments:', error)
      toast.error('Error al cargar los pagos')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const generalStats = await paymentService.getGeneralStats()
      const today = new Date().toISOString().split('T')[0]
      const todayStart = `${today}T00:00:00.000Z`
      const todayEnd = `${today}T23:59:59.999Z`
      const todayPayments = await paymentService.getByDateRange(todayStart, todayEnd)

      setStats({
        totalPayments: generalStats.totalPayments,
        totalCollected: generalStats.totalCollected,
        averagePayment: generalStats.averagePayment,
        todayPayments: todayPayments.length
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const filterPayments = () => {
    let filtered = [...payments]

    // Filtrar por búsqueda (número de factura o referencia)
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.invoice?.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por método de pago
    if (methodFilter !== 'ALL') {
      filtered = filtered.filter(payment => payment.method === methodFilter)
    }

    setFilteredPayments(filtered)
  }

  const handleDelete = async () => {
    if (!paymentToDelete) return

    try {
      await paymentService.delete(paymentToDelete.id)
      toast.success('Pago eliminado correctamente')
      loadPayments()
      loadStats()
      setDeleteDialogOpen(false)
      setPaymentToDelete(null)
    } catch (error) {
      console.error('Error deleting payment:', error)
      toast.error('Error al eliminar el pago')
    }
  }

  const openDeleteDialog = (payment: Payment) => {
    setPaymentToDelete(payment)
    setDeleteDialogOpen(true)
  }

  const handleRefresh = () => {
    loadPayments()
    loadStats()
    toast.success('Datos actualizados')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="h-8 w-8" />
            Pagos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los pagos de facturas
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/payments/stats')}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Estadísticas
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="size-4 mr-2" />
            Actualizar
          </Button>
          <Button asChild>
            <Link to="/payments/new">
              <Plus className="size-4 mr-2" />
              Registrar Pago
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Pagos</CardTitle>
              <FileText className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPayments}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Pagos registrados
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Recaudado</CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPaymentAmount(stats.totalCollected)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                En total
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pago Promedio</CardTitle>
              <TrendingUp className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPaymentAmount(stats.averagePayment)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Por pago
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pagos Hoy</CardTitle>
              <CreditCard className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayPayments}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Registrados hoy
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Busca y filtra pagos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por factura o referencia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Método de Pago</label>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los métodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los métodos</SelectItem>
                  <SelectItem value="CASH">Efectivo</SelectItem>
                  <SelectItem value="CREDIT_CARD">Tarjeta de Crédito</SelectItem>
                  <SelectItem value="DEBIT_CARD">Tarjeta de Débito</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Transferencia Bancaria</SelectItem>
                  <SelectItem value="CHECK">Cheque</SelectItem>
                  <SelectItem value="OTHER">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pagos</CardTitle>
          <CardDescription>
            {filteredPayments.length} pago{filteredPayments.length !== 1 ? 's' : ''} encontrado{filteredPayments.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No se encontraron pagos
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {formatPaymentDate(payment.paymentDate || payment.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Link 
                        to={`/invoices/${payment.invoiceId}`}
                        className="text-primary hover:underline"
                      >
                        {payment.invoice?.number || 'N/A'}
                      </Link>
                    </TableCell>
                    <TableCell>{payment.invoice?.company?.name || 'N/A'}</TableCell>
                    <TableCell>{payment.invoice?.customer?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className={getPaymentMethodColor(payment.method)}>
                        {getPaymentMethodLabel(payment.method)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatPaymentAmount(payment.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.reference || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/payments/${payment.id}`)}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/payments/${payment.id}/edit`)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(payment)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El pago será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
