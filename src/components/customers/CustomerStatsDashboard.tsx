import { motion } from 'framer-motion'
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  UsersIcon, 
  CalendarIcon,
  ActivityIcon,
  BarChart3Icon
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
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

export interface CustomerStats {
  totalCustomers: number
  customersThisMonth: number
  customersLastMonth: number
  activeCustomers: number
  customersByMonth: Array<{ month: string; count: number }>
  topCustomers: Array<{ name: string; purchases: number; totalSpent: number }>
  growthRate: number
}

interface CustomerStatsDashboardProps {
  stats: CustomerStats
  loading?: boolean
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function CustomerStatsDashboard({ stats, loading = false }: CustomerStatsDashboardProps) {
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

  const growthPercentage = stats.customersLastMonth > 0 
    ? ((stats.customersThisMonth - stats.customersLastMonth) / stats.customersLastMonth * 100).toFixed(1)
    : '0.0'
  const isGrowthPositive = stats.customersThisMonth >= stats.customersLastMonth

  // Datos para gráfico de pastel
  const pieData = [
    { name: 'Activos', value: stats.activeCustomers },
    { name: 'Inactivos', value: stats.totalCustomers - stats.activeCustomers },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total de Clientes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <UsersIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.activeCustomers} activos
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Clientes este mes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nuevos Este Mes</CardTitle>
              <CalendarIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.customersThisMonth}</div>
              <div className="flex items-center gap-1 mt-1">
                {isGrowthPositive ? (
                  <TrendingUpIcon className="size-3 text-green-500" />
                ) : (
                  <TrendingDownIcon className="size-3 text-red-500" />
                )}
                <p className={`text-xs ${isGrowthPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {growthPercentage}% vs mes anterior
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tasa de crecimiento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Crecimiento</CardTitle>
              <ActivityIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.growthRate}%</div>
              <Progress value={stats.growthRate} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Clientes activos % */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">% Activos</CardTitle>
              <BarChart3Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalCustomers > 0 
                  ? ((stats.activeCustomers / stats.totalCustomers) * 100).toFixed(1)
                  : '0.0'
                }%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.activeCustomers} de {stats.totalCustomers}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de barras - Clientes por mes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Clientes Registrados por Mes</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.customersByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gráfico de pastel - Distribución */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Clientes</CardTitle>
              <CardDescription>Activos vs Inactivos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Clientes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Top Clientes por Compras</CardTitle>
            <CardDescription>Clientes con mayor gasto total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="size-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.purchases} compras
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      S/ {customer.totalSpent.toLocaleString('es-PE')}
                    </p>
                    <p className="text-xs text-muted-foreground">Total gastado</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
