import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UsersIcon, 
  FileTextIcon, 
  CreditCardIcon, 
  ExternalLinkIcon,
  DollarSignIcon
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
import { Link } from 'react-router-dom'

// Tipos para las relaciones
export interface Customer {
  id: string
  fullName: string
  email: string
  totalInvoices: number
  totalPurchases: number
  status: 'active' | 'inactive'
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'cancelled'
  issueDate: string
  dueDate: string
}

export interface Payment {
  id: string
  invoiceNumber: string
  amount: number
  method: string
  paymentDate: string
  status: 'completed' | 'pending' | 'failed'
}

export interface CompanyRelations {
  customers: Customer[]
  invoices: Invoice[]
  payments: Payment[]
  summary: {
    totalCustomers: number
    totalInvoices: number
    totalRevenue: number
    pendingPayments: number
  }
}

interface CompanyRelationsProps {
  companyId: string
  relations?: CompanyRelations
  loading?: boolean
}

export function CompanyRelations({ relations, loading = false }: CompanyRelationsProps) {
  const [activeTab, setActiveTab] = useState('customers')

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!relations) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No hay datos de relaciones disponibles
          </p>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      inactive: 'secondary',
      paid: 'default',
      pending: 'secondary',
      overdue: 'destructive',
      cancelled: 'outline',
      completed: 'default',
      failed: 'destructive',
    }
    return variants[status] || 'outline'
  }

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      active: 'Activo',
      inactive: 'Inactivo',
      paid: 'Pagado',
      pending: 'Pendiente',
      overdue: 'Vencido',
      cancelled: 'Cancelado',
      completed: 'Completado',
      failed: 'Fallido',
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-6">
      {/* Resumen de relaciones */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <UsersIcon className="size-8 text-blue-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold">{relations.summary.totalCustomers}</p>
                  <p className="text-xs text-muted-foreground">Clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <FileTextIcon className="size-8 text-green-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold">{relations.summary.totalInvoices}</p>
                  <p className="text-xs text-muted-foreground">Facturas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <DollarSignIcon className="size-8 text-purple-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    S/ {relations.summary.totalRevenue.toLocaleString('es-PE')}
                  </p>
                  <p className="text-xs text-muted-foreground">Ingresos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <CreditCardIcon className="size-8 text-orange-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold">{relations.summary.pendingPayments}</p>
                  <p className="text-xs text-muted-foreground">Pagos Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs de relaciones detalladas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Relaciones y Actividad</CardTitle>
            <CardDescription>
              Detalle de clientes, facturas y pagos asociados a esta empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="customers">
                  <UsersIcon className="size-4 mr-2" />
                  Clientes ({relations.customers.length})
                </TabsTrigger>
                <TabsTrigger value="invoices">
                  <FileTextIcon className="size-4 mr-2" />
                  Facturas ({relations.invoices.length})
                </TabsTrigger>
                <TabsTrigger value="payments">
                  <CreditCardIcon className="size-4 mr-2" />
                  Pagos ({relations.payments.length})
                </TabsTrigger>
              </TabsList>

              {/* Tab: Clientes */}
              <TabsContent value="customers" className="space-y-4 mt-4">
                {relations.customers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No hay clientes registrados para esta empresa
                  </p>
                ) : (
                  relations.customers.map((customer, index) => (
                    <motion.div
                      key={customer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{customer.fullName}</p>
                          <Badge variant={getStatusBadge(customer.status)}>
                            {getStatusLabel(customer.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{customer.totalInvoices} facturas</span>
                          <Separator orientation="vertical" className="h-3" />
                          <span>S/ {customer.totalPurchases.toLocaleString('es-PE')}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/customers/${customer.id}`}>
                          <ExternalLinkIcon className="size-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  ))
                )}
              </TabsContent>

              {/* Tab: Facturas */}
              <TabsContent value="invoices" className="space-y-4 mt-4">
                {relations.invoices.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No hay facturas registradas para esta empresa
                  </p>
                ) : (
                  relations.invoices.map((invoice, index) => (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium font-mono">{invoice.invoiceNumber}</p>
                          <Badge variant={getStatusBadge(invoice.status)}>
                            {getStatusLabel(invoice.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Emisión: {new Date(invoice.issueDate).toLocaleDateString('es-PE')}</span>
                          <Separator orientation="vertical" className="h-3" />
                          <span>Vencimiento: {new Date(invoice.dueDate).toLocaleDateString('es-PE')}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">S/ {invoice.amount.toLocaleString('es-PE')}</p>
                        <Button variant="ghost" size="sm" asChild className="mt-1">
                          <Link to={`/invoices/${invoice.id}`}>
                            <ExternalLinkIcon className="size-4 mr-1" />
                            Ver
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </TabsContent>

              {/* Tab: Pagos */}
              <TabsContent value="payments" className="space-y-4 mt-4">
                {relations.payments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No hay pagos registrados para esta empresa
                  </p>
                ) : (
                  relations.payments.map((payment, index) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">Factura: {payment.invoiceNumber}</p>
                          <Badge variant={getStatusBadge(payment.status)}>
                            {getStatusLabel(payment.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{payment.method}</span>
                          <Separator orientation="vertical" className="h-3" />
                          <span>{new Date(payment.paymentDate).toLocaleDateString('es-PE')}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          S/ {payment.amount.toLocaleString('es-PE')}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
