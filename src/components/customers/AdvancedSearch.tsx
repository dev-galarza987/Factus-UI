import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchIcon, FilterIcon, XIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export interface SearchFilters {
  query?: string
  taxOrId?: string
  email?: string
  createdAfter?: string
  createdBefore?: string
  sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  onReset: () => void
}

export function AdvancedSearch({ onSearch, onReset }: AdvancedSearchProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleReset = () => {
    setFilters({
      query: '',
      sortBy: 'name',
      sortOrder: 'asc'
    })
    onReset()
    setShowFilters(false)
  }

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' || key === 'sortOrder') return false
    return value && value !== ''
  }).length

  return (
    <div className="space-y-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o documento..."
                value={filters.query || ''}
                onChange={(e) => handleInputChange('query', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <FilterIcon className="size-4" />
              Filtros
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <Button onClick={handleSearch}>
              Buscar
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  {/* Documento/RUC */}
                  <div className="space-y-2">
                    <Label htmlFor="taxOrId">Documento/RUC</Label>
                    <Input
                      id="taxOrId"
                      placeholder="12345678"
                      value={filters.taxOrId || ''}
                      onChange={(e) => handleInputChange('taxOrId', e.target.value)}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="cliente@ejemplo.com"
                      value={filters.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  {/* Ordenar por */}
                  <div className="space-y-2">
                    <Label htmlFor="sortBy">Ordenar por</Label>
                    <Select
                      value={filters.sortBy || 'name'}
                      onValueChange={(value) => handleInputChange('sortBy', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Nombre</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="createdAt">Fecha de creación</SelectItem>
                        <SelectItem value="updatedAt">Última actualización</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Orden */}
                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">Orden</Label>
                    <Select
                      value={filters.sortOrder || 'asc'}
                      onValueChange={(value) => handleInputChange('sortOrder', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascendente</SelectItem>
                        <SelectItem value="desc">Descendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fecha desde */}
                  <div className="space-y-2">
                    <Label htmlFor="createdAfter">Creado desde</Label>
                    <Input
                      id="createdAfter"
                      type="date"
                      value={filters.createdAfter || ''}
                      onChange={(e) => handleInputChange('createdAfter', e.target.value)}
                    />
                  </div>

                  {/* Fecha hasta */}
                  <div className="space-y-2">
                    <Label htmlFor="createdBefore">Creado hasta</Label>
                    <Input
                      id="createdBefore"
                      type="date"
                      value={filters.createdBefore || ''}
                      onChange={(e) => handleInputChange('createdBefore', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={handleReset}>
                    <XIcon className="size-4 mr-2" />
                    Limpiar
                  </Button>
                  <Button onClick={handleSearch}>
                    <SearchIcon className="size-4 mr-2" />
                    Aplicar Filtros
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
