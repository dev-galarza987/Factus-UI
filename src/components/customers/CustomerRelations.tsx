import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BuildingIcon, 
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
export interface Company {
  id: string
  businessName: string
  taxId: string
  email: string
  phone?: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
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

export interface CustomerRelationsData {
  company?: Company
  invoices: Invoice[]
  payments: Payment[]
  summary: {
    totalInvoices: number
    totalPurchases: number
    pendingAmount: number
    lastPurchaseDate?: string
  }
}

interface CustomerRelationsProps {
  customerId: string
  relations?: CustomerRelationsData
  loading?: boolean
}

export function CustomerRelations({ relations, loading = false }: CustomerRelationsProps) {
  const [activeTab, setActiveTab] = useState('company')

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
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <DollarSignIcon className="size-8 text-purple-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    S/ {relations.summary.totalPurchases.toLocaleString('es-PE')}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Compras</p>
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
                <CreditCardIcon className="size-8 text-orange-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    S/ {relations.summary.pendingAmount.toLocaleString('es-PE')}
                  </p>
                  <p className="text-xs text-muted-foreground">Pendiente</p>
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
                <CreditCardIcon className="size-8 text-blue-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold">{relations.payments.length}</p>
                  <p className="text-xs text-muted-foreground">Pagos</p>
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
              Detalle de empresa, facturas y pagos asociados a este cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="company">
                  <BuildingIcon className="size-4 mr-2" />
                  Empresa
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

              {/* Tab: Empresa */}
              <TabsContent value="company" className="space-y-4 mt-4">
                {!relations.company ? (
                  <p className="text-center text-muted-foreground py-8">
                    Este cliente no está asociado a ninguna empresa
                  </p>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 rounded-lg border bg-muted/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                          <BuildingIcon className="size-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            {relations.company.businessName}
                          </h3>
                          <Badge variant="outline" className="font-mono mb-2">
                            RUC: {relations.company.taxId}
                          </Badge>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>{relations.company.email}</p>
                            {relations.company.phone && <p>{relations.company.phone}</p>}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/companies/${relations.company.id}`}>
                          <ExternalLinkIcon className="size-4 mr-1" />
                          Ver empresa
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </TabsContent>

              {/* Tab: Facturas */}
              <TabsContent value="invoices" className="space-y-4 mt-4">
                {relations.invoices.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No hay facturas registradas para este cliente
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
                    No hay pagos registrados para este cliente
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
