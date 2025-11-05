import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from '../../components/Header'
import { CompanyStatsDashboard, type CompanyStats } from '../../components/companies/CompanyStatsDashboard'
import { Button } from '../../components/ui/button'
import { ArrowLeftIcon, RefreshCwIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function CompanyStatsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<CompanyStats | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      // Simular carga de datos (reemplazar con llamada real a la API)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Datos de ejemplo
      const mockStats: CompanyStats = {
        totalCompanies: 45,
        companiesThisMonth: 8,
        companiesLastMonth: 5,
        activeCompanies: 42,
        growthRate: 60,
        companiesByMonth: [
          { month: 'Ago', count: 4 },
          { month: 'Sep', count: 6 },
          { month: 'Oct', count: 5 },
          { month: 'Nov', count: 8 },
          { month: 'Dic', count: 7 },
          { month: 'Ene', count: 9 },
        ],
        topCompanies: [
          { name: 'Tech Solutions SAC', invoices: 45, revenue: 125000 },
          { name: 'Distribuidora Lima SRL', invoices: 38, revenue: 98000 },
          { name: 'Consultores ABC EIRL', invoices: 32, revenue: 87500 },
          { name: 'Importaciones Global SAC', invoices: 28, revenue: 75000 },
          { name: 'Servicios Integrales Peru', invoices: 25, revenue: 68000 },
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
              onClick={() => navigate('/companies')}
              className="mb-4"
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              Volver a empresas
            </Button>
            <h1 className="text-3xl font-bold">Estadísticas de Empresas</h1>
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
        {stats && <CompanyStatsDashboard stats={stats} loading={loading} />}
      </div>
    </>
  )
}
