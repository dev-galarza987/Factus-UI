# Características Avanzadas - Factus UI

## 📋 Resumen

Se han implementado características avanzadas para el módulo de gestión de empresas (Companies), incluyendo búsqueda y filtrado, validación de formularios, relaciones y estadísticas.

## 🔍 Búsqueda y Filtrado Avanzado

### Componente: `AdvancedSearch`
**Ubicación:** `src/components/companies/AdvancedSearch.tsx`

#### Características:
- **Búsqueda general**: Busca por nombre, RUC o email
- **Filtro por RUC**: Campo específico para Tax ID
- **Filtro por email**: Campo específico para correo electrónico
- **Rango de fechas**: Filtros "Desde" y "Hasta" para fecha de creación
- **Ordenamiento**: 4 opciones
  - Nombre de empresa (businessName)
  - RUC (taxId)
  - Fecha de creación (createdAt)
  - Última actualización (updatedAt)
- **Dirección**: Ascendente o descendente
- **Panel expandible**: Animación suave con AnimatePresence
- **Contador de filtros activos**: Badge que muestra cuántos filtros están aplicados
- **Botones de acción**: Aplicar y Limpiar filtros

#### Uso:
```tsx
import { AdvancedSearch } from '../../components/companies/AdvancedSearch'

<AdvancedSearch 
  onSearch={handleSearch} 
  onReset={handleReset} 
/>
```

**Integrado en:** `CompaniesPage`

---

## ✅ Validación de Formularios

### Esquema: `company.schema.ts`
**Ubicación:** `src/lib/validations/company.schema.ts`

#### Schemas de Zod:

1. **companySchema**: Schema base con todas las validaciones
2. **createCompanySchema**: Para crear nuevas empresas (incluye todos los campos)
3. **updateCompanySchema**: Para editar empresas (omite taxId, ya que no es editable)
4. **companySearchSchema**: Para validar filtros de búsqueda

#### Reglas de Validación:

| Campo | Reglas |
|-------|--------|
| `businessName` | 3-255 caracteres, solo letras, números, espacios y caracteres especiales |
| `taxId` | Exactamente 11 dígitos numéricos (formato RUC Perú) |
| `email` | Email válido, convertido a minúsculas |
| `address` | 10-500 caracteres |
| `phone` | Opcional, 7-20 caracteres (números, espacios, +, -, (, )) |
| `website` | Opcional, URL válida con protocolo http/https |

#### Tipos TypeScript Exportados:
- `CompanyFormData`
- `CreateCompanyData`
- `UpdateCompanyData`
- `CompanySearchFilters`

#### Uso:
```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { createCompanySchema, updateCompanySchema } from '../../lib/validations/company.schema'

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(isEditMode ? updateCompanySchema : createCompanySchema),
  mode: 'onBlur'
})
```

**Integrado en:** `CompanyFormPage`

---

## 🔗 Relaciones

### Componente: `CompanyRelations`
**Ubicación:** `src/components/companies/CompanyRelations.tsx`

#### Características:
- **Cards de resumen**: 4 métricas principales
  - Total de clientes
  - Total de facturas
  - Ingresos totales (en Soles S/)
  - Pagos pendientes
- **Interfaz con pestañas**: 3 secciones
  1. **Clientes**: Lista de clientes asociados con estado, facturas y compras totales
  2. **Facturas**: Número de factura, cliente, estado, fechas y monto
  3. **Pagos**: Factura relacionada, método de pago, fecha, estado y monto
- **Badges de estado**: Colores diferentes según el estado
  - Activo/Pagado: Verde
  - Inactivo/Pendiente: Amarillo
  - Vencido: Rojo
- **Enlaces externos**: Botones para ver detalles de cada registro
- **Estados vacíos**: Mensajes amigables cuando no hay datos
- **Animaciones**: Entrada escalonada de items en listas

#### Interfaces TypeScript:
```tsx
interface Customer {
  id: string
  fullName: string
  email: string
  status: 'active' | 'inactive'
  totalInvoices: number
  totalPurchases: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  issueDate: string
  dueDate: string
}

interface Payment {
  id: string
  invoiceNumber: string
  amount: number
  paymentDate: string
  paymentMethod: string
  status: 'completed' | 'pending'
}
```

#### Uso:
```tsx
import { CompanyRelations } from '../../components/companies/CompanyRelations'

<CompanyRelations 
  companyId={company.id}
  relations={relationsData}
  loading={false}
/>
```

**Integrado en:** `CompanyDetailsPage`

---

## 📊 Estadísticas y Dashboard

### Componente: `CompanyStatsDashboard`
**Ubicación:** `src/components/companies/CompanyStatsDashboard.tsx`

#### Características:

##### 1. **KPI Cards** (4 tarjetas principales)
- **Total de Empresas**: Muestra el total con el número de activas
- **Este Mes**: Empresas creadas en el mes actual con porcentaje de crecimiento
- **Tasa de Crecimiento**: Porcentaje con barra de progreso
- **% Activas**: Porcentaje de empresas activas del total

##### 2. **Gráfico de Barras** (Recharts)
- Visualiza empresas registradas por mes (últimos 6 meses)
- Barras azules con esquinas redondeadas
- Tooltips informativos
- Ejes X e Y con labels

##### 3. **Gráfico de Pastel** (Recharts)
- Distribución de empresas activas vs inactivas
- Porcentajes mostrados en el gráfico
- Colores: Verde (activas), Gris (inactivas)
- Leyenda descriptiva

##### 4. **Top 5 Empresas**
- Ranking con badges numerados
- Nombre de empresa
- Número de facturas emitidas
- Ingresos totales en Soles (S/)
- Ordenado por ingresos

#### Uso:
```tsx
import { CompanyStatsDashboard } from '../../components/companies/CompanyStatsDashboard'

const stats: CompanyStats = {
  totalCompanies: 45,
  companiesThisMonth: 8,
  companiesLastMonth: 5,
  activeCompanies: 42,
  companiesByMonth: [...],
  topCompanies: [...],
  growthRate: 60
}

<CompanyStatsDashboard stats={stats} />
```

### Página: `CompanyStatsPage`
**Ubicación:** `src/pages/companies/CompanyStatsPage.tsx`

- Página dedicada para estadísticas
- Header con botón de regreso y botón de actualizar
- Manejo de estados de carga
- Datos de ejemplo (mock data) para demostración
- Ruta: `/companies/stats`

**Integrado en:** 
- Ruta agregada en `main.tsx`
- Botón "Estadísticas" en `CompaniesPage`

---

## 🎨 Animaciones

Todas las características incluyen animaciones con **framer-motion**:
- Transiciones suaves (0.7-0.8s)
- Animaciones de entrada escalonadas
- Hover effects en elementos interactivos
- Expansión/colapso de paneles
- Spring animations en botones

---

## 📁 Estructura de Archivos

```
src/
├── components/
│   └── companies/
│       ├── AdvancedSearch.tsx          # Búsqueda avanzada
│       ├── CompanyStatsDashboard.tsx   # Dashboard de estadísticas
│       ├── CompanyRelations.tsx        # Relaciones de empresa
│       └── index.ts                    # Barrel exports
├── lib/
│   └── validations/
│       └── company.schema.ts           # Esquemas de validación Zod
└── pages/
    └── companies/
        ├── CompaniesPage.tsx           # Lista (con búsqueda avanzada)
        ├── CompanyFormPage.tsx         # Formulario (con validación)
        ├── CompanyDetailsPage.tsx      # Detalles (con relaciones)
        ├── CompanyStatsPage.tsx        # Estadísticas
        └── index.ts                    # Barrel exports
```

---

## 🚀 Próximos Pasos

### Integraciones Pendientes:
1. **Conectar con API real**: Reemplazar datos mock con llamadas al backend
2. **Servicios API**: Crear métodos en `companyService` para:
   - `getStats()`: Obtener estadísticas
   - `getRelations(companyId)`: Obtener relaciones de empresa
   - `search(filters)`: Búsqueda con filtros avanzados

### Mejoras Sugeridas:
1. **Exportar datos**: Botones para exportar a CSV/Excel/PDF
2. **Paginación**: Implementar para listas largas
3. **Operaciones en lote**: Selección múltiple y acciones masivas
4. **WebSockets**: Actualizaciones en tiempo real para estadísticas
5. **Preferencias de usuario**: Guardar filtros y ordenamiento preferidos
6. **Módulos similares**: Replicar características para Customers, Invoices, Payments

---

## 🛠️ Dependencias Instaladas

```json
{
  "framer-motion": "^11.x.x",
  "zod": "^3.x.x",
  "@hookform/resolvers": "^3.x.x",
  "recharts": "^2.x.x"
}
```

---

## ✨ Características Destacadas

- ✅ Búsqueda y filtrado con múltiples criterios
- ✅ Validación robusta de formularios con Zod
- ✅ Visualización de relaciones en tabs
- ✅ Dashboard con gráficos interactivos
- ✅ Animaciones suaves en toda la UI
- ✅ TypeScript con tipos fuertemente tipados
- ✅ Componentes reutilizables y modulares
- ✅ Estados de carga y error manejados
- ✅ Responsive design

---

**Fecha de implementación:** Enero 2025
**Versión:** 1.0.0
