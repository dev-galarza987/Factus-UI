import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  UsersIcon,
  MailIcon,
  BarChart3Icon
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { customerService, type Customer } from '../../services/customerService'
import { Header } from '../../components/Header'
import { Skeleton } from '../../components/ui/skeleton'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { AdvancedSearch, type SearchFilters } from '../../components/customers/AdvancedSearch'

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadCustomers()
  }, [])

  const handleSearch = (filters: SearchFilters) => {
    let filtered = [...customers]

    // Aplicar filtro de búsqueda general
    if (filters.query && filters.query.trim() !== '') {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(query) ||
        customer.taxOrId.includes(query) ||
        customer.email.toLowerCase().includes(query)
      )
    }

    // Aplicar filtro de documento
    if (filters.taxOrId && filters.taxOrId.trim() !== '') {
      filtered = filtered.filter(customer =>
        customer.taxOrId.includes(filters.taxOrId!)
      )
    }

    // Aplicar filtro de email
    if (filters.email && filters.email.trim() !== '') {
      filtered = filtered.filter(customer =>
        customer.email.toLowerCase().includes(filters.email!.toLowerCase())
      )
    }

    // Aplicar filtro de fecha desde
    if (filters.createdAfter) {
      const afterDate = new Date(filters.createdAfter)
      filtered = filtered.filter(customer =>
        new Date(customer.createdAt) >= afterDate
      )
    }

    // Aplicar filtro de fecha hasta
    if (filters.createdBefore) {
      const beforeDate = new Date(filters.createdBefore)
      filtered = filtered.filter(customer =>
        new Date(customer.createdAt) <= beforeDate
      )
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'email':
          comparison = a.email.localeCompare(b.email)
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison
    })

    setFilteredCustomers(filtered)
  }

  const handleReset = () => {
    setFilteredCustomers(customers)
  }

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await customerService.getAll()
      setCustomers(data)
      setFilteredCustomers(data)
    } catch (err) {
      setError('Error al cargar los clientes. Por favor, intenta nuevamente.')
      console.error('Error loading customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await customerService.delete(id)
        loadCustomers()
      } catch (err) {
        console.error('Error deleting customer:', err)
        alert('Error al eliminar el cliente')
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
              <UsersIcon className="size-8 text-primary" />
              Gestión de Clientes
            </motion.h1>
            <motion.p 
              className="text-muted-foreground mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              Administra todos los clientes registrados en el sistema
            </motion.p>
          </div>
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 150, damping: 15 }}
          >
            <Link to="/customers/stats">
              <Button size="lg" variant="outline" className="gap-2">
                <BarChart3Icon className="size-4" />
                Estadísticas
              </Button>
            </Link>
            <Link to="/customers/new">
              <Button size="lg" className="gap-2">
                <PlusIcon className="size-4" />
                Nuevo Cliente
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Advanced Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <AdvancedSearch onSearch={handleSearch} onReset={handleReset} />
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          <Card>
            <CardContent className="pt-6">
            {loading ? (
              // Loading skeleton
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Skeleton className="size-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-3 w-[200px]" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredCustomers.length === 0 ? (
              // Empty state
              <div className="text-center py-12">
                <UsersIcon className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay clientes</h3>
                <p className="text-muted-foreground mb-4">
                  Comienza creando tu primer cliente
                </p>
                <Link to="/customers/new">
                  <Button>
                    <PlusIcon className="size-4 mr-2" />
                    Crear Cliente
                  </Button>
                </Link>
              </div>
            ) : (
              // Table
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Fecha Creación</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer, index) => (
                      <motion.tr 
                        key={customer.id}
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
                              <UsersIcon className="size-5 text-primary" />
                            </motion.div>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-mono">{customer.taxOrId}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MailIcon className="size-3 text-muted-foreground" />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(customer.createdAt).toLocaleDateString('es-ES')}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/customers/${customer.id}`}>
                              <Button variant="ghost" size="icon">
                                <EyeIcon className="size-4" />
                              </Button>
                            </Link>
                            <Link to={`/customers/${customer.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <PencilIcon className="size-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(customer.id)}
                            >
                              <TrashIcon className="size-4" />
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
