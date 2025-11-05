import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  BuildingIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  GlobeIcon,
  HashIcon
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { Header } from '../../components/Header'
import { companyService, type Company } from '../../services/companyService'
import { Skeleton } from '../../components/ui/skeleton'
import { Alert, AlertDescription } from '../../components/ui/alert'

export function CompanyDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadCompany(id)
    }
  }, [id])

  const loadCompany = async (companyId: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await companyService.getById(companyId)
      setCompany(data)
    } catch (err) {
      setError('Error al cargar la empresa')
      console.error('Error loading company:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    
    if (window.confirm('¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer.')) {
      try {
        await companyService.delete(id)
        navigate('/companies')
      } catch (err) {
        alert('Error al eliminar la empresa')
        console.error('Error deleting company:', err)
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

  if (error || !company) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive">
              <AlertDescription>{error || 'Empresa no encontrada'}</AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={() => navigate('/companies')}
              className="mt-4"
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              Volver a empresas
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
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/companies')}
              className="mb-4"
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              Volver a empresas
            </Button>
          </div>

          {/* Company Header Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex size-16 items-center justify-center rounded-lg bg-primary/10">
                    <BuildingIcon className="size-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{company.businessName}</h1>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono">
                        RUC: {company.taxId}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ID: {company.id}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/companies/${company.id}/edit`}>
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

          <div className="grid gap-6 md:grid-cols-2">
            {/* Información de Contacto */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
                <CardDescription>Datos de contacto de la empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MailIcon className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a
                      href={`mailto:${company.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {company.email}
                    </a>
                  </div>
                </div>

                {company.phone && (
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Teléfono</p>
                      <a
                        href={`tel:${company.phone}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {company.phone}
                      </a>
                    </div>
                  </div>
                )}

                {company.website && (
                  <div className="flex items-start gap-3">
                    <GlobeIcon className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Sitio Web</p>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-start gap-3">
                  <MapPinIcon className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">Dirección</p>
                    <p className="text-sm text-muted-foreground">{company.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información del Sistema */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Sistema</CardTitle>
                <CardDescription>Datos de registro y actualización</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <HashIcon className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">RUC / Tax ID</p>
                    <p className="text-sm text-muted-foreground font-mono">{company.taxId}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <CalendarIcon className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">Fecha de Creación</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(company.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarIcon className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">Última Actualización</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(company.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
