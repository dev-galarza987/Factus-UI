import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from '../../components/Header'
import { CustomerStatsDashboard, type CustomerStats } from '../../components/customers/CustomerStatsDashboard'
import { Button } from '../../components/ui/button'
import { ArrowLeftIcon, RefreshCwIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function CustomerStatsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<CustomerStats | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      // Simular carga de datos (reemplazar con llamada real a la API)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Datos de ejemplo
      const mockStats: CustomerStats = {
        totalCustomers: 156,
        customersThisMonth: 18,
        customersLastMonth: 12,
        activeCustomers: 142,
        growthRate: 50,
        customersByMonth: [
          { month: 'Ago', count: 12 },
          { month: 'Sep', count: 15 },
          { month: 'Oct', count: 14 },
          { month: 'Nov', count: 18 },
          { month: 'Dic', count: 16 },
          { month: 'Ene', count: 22 },
        ],
        topCustomers: [
          { name: 'Juan Carlos Pérez López', purchases: 28, totalSpent: 45000 },
          { name: 'María Elena García Torres', purchases: 24, totalSpent: 38500 },
          { name: 'Roberto Martínez Díaz', purchases: 21, totalSpent: 32000 },
          { name: 'Ana Lucía Rodríguez Vega', purchases: 19, totalSpent: 28750 },
          { name: 'Carlos Alberto Fernández', purchases: 17, totalSpent: 25000 },
        ],
      }
      
      setStats(mockStats)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/customers')}
              className="mb-4"
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              Volver a clientes
            </Button>
            <h1 className="text-3xl font-bold">Estadísticas de Clientes</h1>
            <p className="text-muted-foreground mt-2">
              Análisis y métricas de desempeño
            </p>
          </div>
          <Button
            variant="outline"
            onClick={loadStats}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCwIcon className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </motion.div>

        {/* Dashboard de estadísticas */}
        {stats && <CustomerStatsDashboard stats={stats} loading={loading} />}
      </div>
    </>
  )
}
