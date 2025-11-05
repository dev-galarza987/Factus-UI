import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../components/ui/table'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { 
  Plus, 
  Search, 
  Filter, 
  FileText,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Building2,
  User,
  Calendar,
  Loader2
} from 'lucide-react'
import { invoiceService, type Invoice, type InvoiceStatus } from '../../services/invoiceService'
import { 
  INVOICE_STATUS_LABELS,
  type InvoiceSearchFilters 
} from '../../lib/validations/invoice.schema'
import { toast } from 'sonner'

const statusVariants: Record<InvoiceStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: 'secondary',
  PAID: 'default',
  CANCELLED: 'destructive'
}

export default function InvoicesPage() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [searchFilters, setSearchFilters] = useState<Partial<InvoiceSearchFilters>>({})
  const [stats, setStats] = useState<{
    total: number
    totalRevenue: number
    pending: number
    paid: number
    cancelled: number
  }>({
    total: 0,
    totalRevenue: 0,
    pending: 0,
    paid: 0,
    cancelled: 0
  })

  useEffect(() => {
    loadInvoices()
    loadStats()
  }, [])

  const loadInvoices = async () => {
    try {
      setIsLoading(true)
      const data = await invoiceService.getAll()
      setInvoices(data)
    } catch (error) {
      console.error('Error al cargar las facturas:', error)
      toast.error('Error al cargar las facturas')
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const generalStats = await invoiceService.getGeneralStats()
      setStats({
        total: generalStats.totalInvoices,
        totalRevenue: generalStats.totalRevenue,
        pending: generalStats.byStatus.PENDING,
        paid: generalStats.byStatus.PAID,
        cancelled: generalStats.byStatus.CANCELLED
      })
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  const applyFilters = useCallback(() => {
    let filtered = [...invoices]

    // Búsqueda por texto general
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase()
      filtered = filtered.filter(invoice =>
        invoice.number.toLowerCase().includes(query) ||
        invoice.company?.businessName.toLowerCase().includes(query) ||
        invoice.customer?.name.toLowerCase().includes(query)
      )
    }

    // Filtro por número
    if (searchFilters.number) {
      filtered = filtered.filter(invoice =>
        invoice.number.toLowerCase().includes(searchFilters.number!.toLowerCase())
      )
    }

    // Filtro por estado
    if (searchFilters.status) {
      filtered = filtered.filter(invoice => invoice.status === searchFilters.status)
    }

    // Filtro por empresa
    if (searchFilters.companyId) {
      filtered = filtered.filter(invoice => invoice.companyId === searchFilters.companyId)
    }

    // Filtro por cliente
    if (searchFilters.customerId) {
      filtered = filtered.filter(invoice => invoice.customerId === searchFilters.customerId)
    }

    // Filtro por rango de fechas
    if (searchFilters.startDate) {
      filtered = filtered.filter(invoice =>
        new Date(invoice.createdAt) >= new Date(searchFilters.startDate!)
      )
    }
    if (searchFilters.endDate) {
      filtered = filtered.filter(invoice =>
        new Date(invoice.createdAt) <= new Date(searchFilters.endDate!)
      )
    }

    // Filtro por monto
    if (searchFilters.minAmount) {
      filtered = filtered.filter(invoice => invoice.totalAmount >= searchFilters.minAmount!)
    }
    if (searchFilters.maxAmount) {
      filtered = filtered.filter(invoice => invoice.totalAmount <= searchFilters.maxAmount!)
    }

    // Ordenamiento
    const sortBy = searchFilters.sortBy || 'createdAt'
    const sortOrder = searchFilters.sortOrder || 'desc'
    
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof Invoice] as string | number
      let bValue: string | number = b[sortBy as keyof Invoice] as string | number

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredInvoices(filtered)
  }, [invoices, searchFilters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleSearch = (filters: Partial<InvoiceSearchFilters>) => {
    setSearchFilters(filters)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar esta factura?')) return

    try {
      await invoiceService.delete(id)
      toast.success('Factura eliminada exitosamente')
      loadInvoices()
      loadStats()
    } catch (error) {
      console.error('Error al eliminar factura:', error)
      toast.error('Error al eliminar la factura')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const activeFiltersCount = Object.keys(searchFilters).filter(key => {
    const value = searchFilters[key as keyof InvoiceSearchFilters]
    return value !== undefined && value !== ''
  }).length

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Facturas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestión de facturas del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/invoices/stats')}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Estadísticas
          </Button>
          <Button onClick={() => navigate('/invoices/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Factura
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Facturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pagadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Canceladas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar facturas..."
                  className="text-lg font-semibold bg-transparent border-none outline-none"
                  value={searchFilters.query || ''}
                  onChange={(e) => handleSearch({ ...searchFilters, query: e.target.value })}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
                {showAdvancedSearch ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
            </div>
          </CardHeader>

          <AnimatePresence>
            {showAdvancedSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="border-t pt-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Los filtros avanzados se agregarán en el componente AdvancedSearch */}
                    <div className="text-sm text-muted-foreground">
                      Componente de búsqueda avanzada pendiente
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              Listado de Facturas ({filteredInvoices.length})
            </CardTitle>
            <CardDescription>
              Gestione todas las facturas del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No se encontraron facturas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {invoice.number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {invoice.company?.businessName || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {invoice.customer?.name || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(invoice.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[invoice.status]}>
                          {INVOICE_STATUS_LABELS[invoice.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(invoice.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/invoices/${invoice.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(invoice.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
