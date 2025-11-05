import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchIcon, FilterIcon, XIcon, CalendarIcon, SortAscIcon, SortDescIcon } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Card, CardContent } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'

export interface SearchFilters {
  query?: string
  taxId?: string
  email?: string
  createdAfter?: string
  createdBefore?: string
  sortBy?: 'businessName' | 'taxId' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  onReset: () => void
  initialFilters?: SearchFilters
}

export function AdvancedSearch({ onSearch, onReset, initialFilters = {} }: AdvancedSearchProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleReset = () => {
    setFilters({})
    onReset()
    setShowFilters(false)
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Búsqueda principal */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, RUC o email..."
                value={filters.query || ''}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <FilterIcon className="size-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            <Button onClick={handleSearch} className="gap-2">
              <SearchIcon className="size-4" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtros avanzados */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Filtros Avanzados</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Filtro por RUC */}
                    <div className="space-y-2">
                      <Label htmlFor="taxId">RUC / Tax ID</Label>
                      <Input
                        id="taxId"
                        placeholder="20123456789"
                        value={filters.taxId || ''}
                        onChange={(e) => handleFilterChange('taxId', e.target.value)}
                        maxLength={11}
                      />
                    </div>

                    {/* Filtro por Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="empresa@ejemplo.com"
                        value={filters.email || ''}
                        onChange={(e) => handleFilterChange('email', e.target.value)}
                      />
                    </div>

                    {/* Ordenar por */}
                    <div className="space-y-2">
                      <Label htmlFor="sortBy">Ordenar por</Label>
                      <Select
                        value={filters.sortBy || ''}
                        onValueChange={(value) => handleFilterChange('sortBy', value)}
                      >
                        <SelectTrigger id="sortBy">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="businessName">Nombre</SelectItem>
                          <SelectItem value="taxId">RUC</SelectItem>
                          <SelectItem value="createdAt">Fecha de creación</SelectItem>
                          <SelectItem value="updatedAt">Última actualización</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Orden */}
                    <div className="space-y-2">
                      <Label htmlFor="sortOrder">Orden</Label>
                      <Select
                        value={filters.sortOrder || ''}
                        onValueChange={(value) => handleFilterChange('sortOrder', value)}
                      >
                        <SelectTrigger id="sortOrder">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">
                            <div className="flex items-center gap-2">
                              <SortAscIcon className="size-4" />
                              Ascendente
                            </div>
                          </SelectItem>
                          <SelectItem value="desc">
                            <div className="flex items-center gap-2">
                              <SortDescIcon className="size-4" />
                              Descendente
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fecha desde */}
                    <div className="space-y-2">
                      <Label htmlFor="createdAfter">
                        <CalendarIcon className="size-3 inline mr-1" />
                        Creado desde
                      </Label>
                      <Input
                        id="createdAfter"
                        type="date"
                        value={filters.createdAfter || ''}
                        onChange={(e) => handleFilterChange('createdAfter', e.target.value)}
                      />
                    </div>

                    {/* Fecha hasta */}
                    <div className="space-y-2">
                      <Label htmlFor="createdBefore">
                        <CalendarIcon className="size-3 inline mr-1" />
                        Creado hasta
                      </Label>
                      <Input
                        id="createdBefore"
                        type="date"
                        value={filters.createdBefore || ''}
                        onChange={(e) => handleFilterChange('createdBefore', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button onClick={handleSearch} className="flex-1">
                      Aplicar Filtros
                    </Button>
                    <Button onClick={handleReset} variant="outline">
                      Limpiar Todo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
