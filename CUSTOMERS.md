# Módulo de Clientes (Customers) - Factus UI

## 📋 Resumen

Se ha implementado el módulo completo de gestión de clientes (Customers) siguiendo el mismo patrón y estructura que el módulo de Empresas (Companies), incluyendo búsqueda avanzada, validación de formularios, y navegación completa.

## 🎯 Características Implementadas

### ✅ 1. Servicio API (`customerService.ts`)

**Ubicación:** `src/services/customerService.ts`

#### Métodos Disponibles:
- `getAll()`: Obtener todos los clientes
- `getById(id)`: Obtener cliente por ID
- `create(data)`: Crear nuevo cliente
- `update(id, data)`: Actualizar cliente existente
- `delete(id)`: Eliminar cliente
- `search(query)`: Buscar clientes
- `getByCompany(companyId)`: Obtener clientes de una empresa específica

#### Tipos TypeScript:
```typescript
interface Customer {
  id: string
  firstName: string
  lastName: string
  documentType: 'DNI' | 'CE' | 'PASSPORT' | 'RUC'
  documentNumber: string
  email: string
  phone?: string
  address?: string
  city?: string
  country?: string
  companyId?: string
  companyName?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}
```

---

### ✅ 2. Esquemas de Validación (`customer.schema.ts`)

**Ubicación:** `src/lib/validations/customer.schema.ts`

#### Schemas de Zod:

1. **customerSchema**: Schema base con todas las validaciones
2. **createCustomerSchema**: Para crear nuevos clientes (incluye todos los campos)
3. **updateCustomerSchema**: Para editar clientes (omite documentType y documentNumber, ya que no son editables)
4. **customerSearchSchema**: Para validar filtros de búsqueda

#### Reglas de Validación:

| Campo | Reglas |
|-------|--------|
| `firstName` | 2-100 caracteres, solo letras y espacios |
| `lastName` | 2-100 caracteres, solo letras y espacios |
| `documentType` | Enum: DNI, CE, PASSPORT, RUC |
| `documentNumber` | 8-20 caracteres, solo letras mayúsculas y números |
| `email` | Email válido, convertido a minúsculas |
| `phone` | Opcional, 7-20 caracteres (números, espacios, +, -, (, )) |
| `address` | Opcional, 10-500 caracteres |
| `city` | Opcional, 2-100 caracteres |
| `country` | Opcional, 2-100 caracteres |
| `companyId` | Opcional, UUID válido |
| `status` | Enum: active, inactive (opcional) |

#### Tipos TypeScript Exportados:
- `CustomerFormData`
- `CreateCustomerData`
- `UpdateCustomerData`
- `CustomerSearchFilters`

---

### ✅ 3. Páginas Principales

#### a) CustomersPage (Lista de Clientes)
**Ubicación:** `src/pages/customers/CustomersPage.tsx`

**Características:**
- Lista completa de clientes en tabla
- Animaciones con framer-motion (entrada escalonada)
- Búsqueda avanzada integrada
- Estados de carga con skeletons
- Estado vacío con call-to-action
- Badges para tipo de documento y estado
- Acciones: Ver, Editar, Eliminar
- Botón de estadísticas (preparado para futura implementación)
- Información mostrada:
  - Nombre completo
  - Empresa asociada
  - Tipo y número de documento
  - Email y teléfono
  - Estado (Activo/Inactivo)

**Acciones:**
- Crear nuevo cliente → `/customers/new`
- Ver estadísticas → `/customers/stats` (preparado)
- Ver detalles → `/customers/:id` (preparado)
- Editar cliente → `/customers/:id/edit`
- Eliminar cliente (con confirmación)

#### b) CustomerFormPage (Crear/Editar Cliente)
**Ubicación:** `src/pages/customers/CustomerFormPage.tsx`

**Características:**
- Formulario completo con validación Zod
- Modo crear y modo editar (detectado por presencia de ID en URL)
- Campos organizados en secciones:
  1. **Información Personal**: Nombre, Apellido, Tipo y Número de Documento
  2. **Información de Contacto**: Email, Teléfono
  3. **Dirección**: Dirección completa, Ciudad, País
  4. **Estado**: Activo/Inactivo
- Validación en tiempo real (onBlur)
- Mensajes de error específicos por campo
- Estados de carga
- Animaciones suaves
- **Campos no editables en modo edición**: Tipo y Número de Documento
- Selects para campos enum (documentType, status)
- Botones: Cancelar, Crear/Actualizar

---

### ✅ 4. Búsqueda Avanzada

#### Componente: `AdvancedSearch`
**Ubicación:** `src/components/customers/AdvancedSearch.tsx`

**Características:**
- **Búsqueda general**: Busca por nombre completo, email o documento
- **Panel de filtros expandible**: Animación suave con AnimatePresence
- **Contador de filtros activos**: Badge que muestra cuántos filtros están aplicados
- **Filtros específicos**:
  - Número de Documento
  - Email
  - Teléfono
  - Estado (Todos/Activo/Inactivo)
  - Ordenar por (5 opciones: Nombre, Apellido, Email, Fecha creación, Última actualización)
  - Orden (Ascendente/Descendente)
  - Rango de fechas (Creado desde/hasta)
- **Botones de acción**: Buscar, Limpiar, Aplicar Filtros
- **Tecla Enter**: Búsqueda rápida

**Uso en CustomersPage:**
```tsx
<AdvancedSearch onSearch={handleSearch} onReset={handleReset} />
```

---

### ✅ 5. Rutas y Navegación

**Rutas configuradas en `main.tsx`:**
```tsx
/customers              → CustomersPage (lista)
/customers/new          → CustomerFormPage (crear)
/customers/:id/edit     → CustomerFormPage (editar)
/customers/:id          → Preparado para CustomerDetailsPage
/customers/stats        → Preparado para CustomerStatsPage
```

**Navegación en Header:**
- Link "Clientes" agregado al header principal
- Navegación fluida entre módulos

---

## 📁 Estructura de Archivos Creados

```
src/
├── components/
│   └── customers/
│       ├── AdvancedSearch.tsx              # Búsqueda avanzada
│       └── index.ts                        # Barrel exports
├── lib/
│   └── validations/
│       └── customer.schema.ts              # Esquemas de validación Zod
├── pages/
│   └── customers/
│       ├── CustomersPage.tsx               # Lista de clientes
│       ├── CustomerFormPage.tsx            # Formulario crear/editar
│       └── index.ts                        # Barrel exports
└── services/
    └── customerService.ts                  # Servicio API
```

---

## 🎨 Diseño y UX

### Animaciones (framer-motion):
- **Header**: Slide down (0.7s)
- **Página**: Fade in + slide up (0.7s, delay 0.3s)
- **Items de tabla**: Entrada escalonada (delay index * 0.08)
- **Iconos**: Hover con rotate y scale
- **Panel de filtros**: Expansión/colapso suave (0.3s)
- **Botones**: Spring animation (stiffness 150, damping 15)

### Badges de Estado:
- **Activo**: Default (verde)
- **Inactivo**: Secondary (gris)

### Badges de Tipo de Documento:
- **DNI**: Default
- **CE**: Secondary
- **PASSPORT**: Outline
- **RUC**: Default

---

## 🔄 Comparación con Módulo de Empresas

### Similitudes:
✅ Misma estructura de carpetas y archivos  
✅ Servicio API con métodos CRUD completos  
✅ Validación con Zod schemas  
✅ Búsqueda avanzada con múltiples filtros  
✅ Animaciones consistentes  
✅ Diseño responsive  
✅ Estados de carga y error  
✅ Confirmaciones para acciones destructivas  

### Diferencias:
🔸 **Customers** tiene campos de nombre/apellido separados (Companies tiene businessName)  
🔸 **Customers** incluye tipo y número de documento (Companies tiene taxId)  
🔸 **Customers** tiene ciudad y país opcionales  
🔸 **Customers** puede estar asociado a una empresa (companyId)  
🔸 **Filtros de búsqueda adaptados** al contexto de clientes  

---

## 🚀 Próximos Pasos

### ✅ Completado:
1. ✅ **CustomerDetailsPage**: Página de detalles del cliente implementada
2. ✅ **CustomerRelations**: Componente de relaciones con tabs (Empresa, Facturas, Pagos)
3. ✅ **CustomerStatsDashboard**: Dashboard con KPIs y gráficos implementado
4. ✅ **CustomerStatsPage**: Página dedicada de estadísticas implementada
5. ✅ **Rutas configuradas**: /customers/:id y /customers/stats agregadas
6. ✅ **Integración completa**: CustomerRelations integrado en CustomerDetailsPage con datos mock

### Integraciones Sugeridas:
- Conectar con API real del backend
- Implementar relación con empresas (selector de empresa en formulario)
- Agregar vista de historial de compras
- Exportar lista de clientes (CSV/Excel/PDF)
- Implementar paginación para listas grandes
- Agregar filtros guardados por usuario

---

## 📊 Estado del Módulo

| Componente | Estado | Notas |
|------------|--------|-------|
| customerService.ts | ✅ Completo | API service con todos los métodos |
| customer.schema.ts | ✅ Completo | Validaciones Zod implementadas |
| CustomersPage | ✅ Completo | Lista con búsqueda avanzada |
| CustomerFormPage | ✅ Completo | Crear/editar con validación |
| AdvancedSearch | ✅ Completo | 8 filtros diferentes |
| CustomerDetailsPage | ✅ Completo | Vista detallada con secciones |
| CustomerRelations | ✅ Completo | Tabs con empresa, facturas, pagos |
| CustomerStatsDashboard | ✅ Completo | KPIs y gráficos con recharts |
| CustomerStatsPage | ✅ Completo | Página de estadísticas |
| Rutas | ✅ Completo | Todas las rutas configuradas |
| Header Nav | ✅ Completo | Link a clientes agregado |

---

## 🎯 Funcionalidades Implementadas

✅ CRUD completo de clientes  
✅ Búsqueda y filtrado avanzado  
✅ Validación robusta de formularios  
✅ Página de detalles con información completa  
✅ Componente de relaciones con tabs  
✅ Dashboard de estadísticas con KPIs  
✅ Gráficos interactivos con recharts  
✅ Manejo de estados de carga y error  
✅ Animaciones suaves en toda la UI  
✅ TypeScript con tipos fuertemente tipados  
✅ Componentes reutilizables y modulares  
✅ Responsive design  
✅ Integración con navegación global  
✅ Consistencia con módulo de Empresas  

---

## 🆕 Nuevas Páginas y Componentes

### CustomerDetailsPage
**Ruta:** `/customers/:id`

Muestra información completa del cliente en tarjetas organizadas:
- **Información Personal**: Nombre, apellido, tipo y número de documento
- **Información de Contacto**: Email y teléfono
- **Dirección**: Dirección completa, ciudad y país
- **Información del Sistema**: Fechas de creación y actualización
- **Relaciones**: Componente integrado con datos mock

### CustomerRelations
**Ubicación:** `src/components/customers/CustomerRelations.tsx`

Componente con tabs que muestra:
- **Tab Empresa**: Información de la empresa asociada (si existe)
- **Tab Facturas**: Lista de facturas del cliente con estado y montos
- **Tab Pagos**: Historial de pagos realizados
- **Resumen**: 4 tarjetas KPI con totales

### CustomerStatsDashboard
**Ubicación:** `src/components/customers/CustomerStatsDashboard.tsx`

Dashboard completo con:
- **4 KPIs**: Total clientes, nuevos este mes, crecimiento, % activos
- **Gráfico de barras**: Clientes registrados por mes (últimos 6 meses)
- **Gráfico de pastel**: Distribución activos vs inactivos
- **Top Clientes**: Lista de los 5 mejores clientes por compras

### CustomerStatsPage
**Ruta:** `/customers/stats`

Página dedicada de estadísticas con:
- Botón de navegación de regreso a /customers
- Botón de actualizar con animación de loading
- CustomerStatsDashboard con datos mock
- Animaciones de entrada suaves

---

## 🔗 Rutas Completas Configuradas

```tsx
/customers              → Lista de clientes con búsqueda
/customers/new          → Formulario de creación
/customers/:id          → Detalles del cliente
/customers/:id/edit     → Formulario de edición
/customers/stats        → Estadísticas de clientes
```  

---

**Fecha de implementación:** Enero 2025  
**Versión:** 1.0.0  
**Basado en:** Módulo de Empresas (Companies)
