import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  SearchIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  BuildingIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon
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
import { companyService, type Company } from '../../services/companyService'
import { Header } from '../../components/Header'
import { Skeleton } from '../../components/ui/skeleton'
import { Alert, AlertDescription } from '../../components/ui/alert'

export function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])

  // Cargar empresas al montar el componente
  useEffect(() => {
    loadCompanies()
  }, [])

  // Filtrar empresas cuando cambia el search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCompanies(companies)
    } else {
      const filtered = companies.filter(company =>
        company.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.taxId.includes(searchQuery) ||
        company.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCompanies(filtered)
    }
  }, [searchQuery, companies])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await companyService.getAll()
      setCompanies(data)
      setFilteredCompanies(data)
    } catch (err) {
      setError('Error al cargar las empresas. Por favor, intenta nuevamente.')
      console.error('Error loading companies:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
      try {
        await companyService.delete(id)
        loadCompanies()
      } catch (err) {
        console.error('Error deleting company:', err)
        alert('Error al eliminar la empresa')
      }
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div 
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <motion.h1 
              className="text-3xl font-bold flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <BuildingIcon className="size-8 text-primary" />
              Gestión de Empresas
            </motion.h1>
            <motion.p 
              className="text-muted-foreground mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              Administra todas las empresas registradas en el sistema
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 150, damping: 15 }}
          >
            <Link to="/companies/new">
              <Button size="lg" className="gap-2">
                <PlusIcon className="size-4" />
                Nueva Empresa
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, RUC o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Lista de Empresas</CardTitle>
              <CardDescription>
                {filteredCompanies.length} empresa{filteredCompanies.length !== 1 ? 's' : ''} encontrada{filteredCompanies.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
            {loading ? (
              // Loading skeleton
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredCompanies.length === 0 ? (
              // Empty state
              <div className="text-center py-12">
                <BuildingIcon className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay empresas</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'No se encontraron empresas con ese criterio de búsqueda' : 'Comienza creando tu primera empresa'}
                </p>
                {!searchQuery && (
                  <Link to="/companies/new">
                    <Button>
                      <PlusIcon className="size-4 mr-2" />
                      Crear Empresa
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              // Table
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>RUC / Tax ID</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company, index) => (
                      <motion.tr 
                        key={company.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.5 }}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <motion.div 
                              className="flex size-10 items-center justify-center rounded-lg bg-primary/10"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 250, damping: 15 }}
                            >
                              <BuildingIcon className="size-5 text-primary" />
                            </motion.div>
                            <div>
                              <p className="font-medium">{company.businessName}</p>
                              <p className="text-xs text-muted-foreground">
                                ID: {company.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{company.taxId}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1">
                              <MailIcon className="size-3 text-muted-foreground" />
                              <span className="text-xs">{company.email}</span>
                            </div>
                            {company.phone && (
                              <div className="flex items-center gap-1">
                                <PhoneIcon className="size-3 text-muted-foreground" />
                                <span className="text-xs">{company.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-1 max-w-xs">
                            <MapPinIcon className="size-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground line-clamp-2">
                              {company.address}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/companies/${company.id}`}>
                              <Button variant="ghost" size="icon" title="Ver detalles">
                                <EyeIcon className="size-4" />
                              </Button>
                            </Link>
                            <Link to={`/companies/${company.id}/edit`}>
                              <Button variant="ghost" size="icon" title="Editar">
                                <PencilIcon className="size-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Eliminar"
                              onClick={() => handleDelete(company.id)}
                            >
                              <TrashIcon className="size-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </>
  )
}
