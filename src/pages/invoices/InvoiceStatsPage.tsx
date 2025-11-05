import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, RefreshCwIcon } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { invoiceService } from '../../services/invoiceService'
import { InvoiceStatsDashboard, type InvoiceStatsData } from '../../components/invoices/InvoiceStatsDashboard'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '../../components/ui/alert'

export function InvoiceStatsPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<InvoiceStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await invoiceService.getGeneralStats()
      setStats(data)
    } catch (err) {
      console.error('Error loading invoice stats:', err)
      setError('Error al cargar las estadísticas de facturas')
      toast.error('Error al cargar las estadísticas')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    toast.promise(loadStats(), {
      loading: 'Actualizando estadísticas...',
      success: 'Estadísticas actualizadas',
      error: 'Error al actualizar'
    })
  }

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
              <h1 className="text-3xl font-bold">Estadísticas de Facturas</h1>
              <p className="text-muted-foreground mt-1">
                Análisis y métricas del sistema de facturación
              </p>
            </div>
          </div>
          <Button onClick={handleRefresh} disabled={loading}>
            <RefreshCwIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Dashboard */}
        {stats && <InvoiceStatsDashboard stats={stats} loading={loading} />}
      </motion.div>
    </div>
  )
}
