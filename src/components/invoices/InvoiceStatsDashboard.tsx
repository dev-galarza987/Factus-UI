import { motion } from 'framer-motion'
import { 
  TrendingUpIcon, 
  FileTextIcon, 
  DollarSignIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export interface InvoiceStatsData {
  totalInvoices: number
  totalRevenue: number
  averageAmount: number
  byStatus: {
    PAID: number
    PENDING: number
    CANCELLED: number
  }
}

interface InvoiceStatsDashboardProps {
  stats: InvoiceStatsData
  loading?: boolean
}

const STATUS_COLORS = {
  PAID: '#10b981',      // green
  PENDING: '#f59e0b',   // yellow/orange
  CANCELLED: '#ef4444'  // red
}

export function InvoiceStatsDashboard({ stats, loading = false }: InvoiceStatsDashboardProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-8 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Validación defensiva de datos
  const safeStats = {
    totalInvoices: stats.totalInvoices || 0,
    totalRevenue: stats.totalRevenue || 0,
    averageAmount: stats.averageAmount || 0,
    byStatus: {
      PAID: stats.byStatus?.PAID || 0,
      PENDING: stats.byStatus?.PENDING || 0,
      CANCELLED: stats.byStatus?.CANCELLED || 0
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  // Datos para gráfico de pastel (distribución por estado)
  const pieData = [
    { name: 'Pagadas', value: safeStats.byStatus.PAID, color: STATUS_COLORS.PAID },
    { name: 'Pendientes', value: safeStats.byStatus.PENDING, color: STATUS_COLORS.PENDING },
    { name: 'Canceladas', value: safeStats.byStatus.CANCELLED, color: STATUS_COLORS.CANCELLED },
  ].filter(item => item.value > 0)

  // Datos para gráfico de barras (ingresos por estado)
  const revenueByStatus = [
    { 
      status: 'Pagadas', 
      cantidad: safeStats.byStatus.PAID,
      fill: STATUS_COLORS.PAID
    },
    { 
      status: 'Pendientes', 
      cantidad: safeStats.byStatus.PENDING,
      fill: STATUS_COLORS.PENDING
    },
    { 
      status: 'Canceladas', 
      cantidad: safeStats.byStatus.CANCELLED,
      fill: STATUS_COLORS.CANCELLED
    },
  ]

  // Calcular porcentajes
  const paidPercentage = safeStats.totalInvoices > 0 
    ? (safeStats.byStatus.PAID / safeStats.totalInvoices * 100).toFixed(1)
    : '0.0'
  
  const pendingPercentage = safeStats.totalInvoices > 0 
    ? (safeStats.byStatus.PENDING / safeStats.totalInvoices * 100).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total de Facturas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Facturas</CardTitle>
              <FileTextIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeStats.totalInvoices}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {safeStats.byStatus.PAID} pagadas • {safeStats.byStatus.PENDING} pendientes
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ingresos Totales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSignIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(safeStats.totalRevenue)}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUpIcon className="size-3 text-green-500" />
                <p className="text-xs text-green-500">
                  {paidPercentage}% cobrado
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monto Promedio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monto Promedio</CardTitle>
              <DollarSignIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(safeStats.averageAmount)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Por factura
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tasa de Pago */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Pago</CardTitle>
              <CheckCircle2Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidPercentage}%</div>
              <Progress value={parseFloat(paidPercentage)} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Estado de Facturas - Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Estado</CardTitle>
              <CardDescription>
                Cantidad de facturas por estado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Facturas por Estado - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Cantidad por Estado</CardTitle>
              <CardDescription>
                Comparativa de facturas según su estado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cantidad" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Status Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Resumen por Estado</CardTitle>
            <CardDescription>
              Detalle de facturas según su estado de pago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Pagadas */}
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle2Icon className="size-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Pagadas</p>
                  <p className="text-2xl font-bold">{safeStats.byStatus.PAID}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {paidPercentage}% del total
                  </p>
                </div>
              </div>

              {/* Pendientes */}
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <ClockIcon className="size-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold">{safeStats.byStatus.PENDING}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pendingPercentage}% del total
                  </p>
                </div>
              </div>

              {/* Canceladas */}
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <XCircleIcon className="size-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Canceladas</p>
                  <p className="text-2xl font-bold">{safeStats.byStatus.CANCELLED}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {safeStats.totalInvoices > 0 
                      ? ((safeStats.byStatus.CANCELLED / safeStats.totalInvoices * 100).toFixed(1))
                      : '0.0'}% del total
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
