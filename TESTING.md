# 🧪 Pruebas Automatizadas - Módulo de Empresas

Este proyecto incluye pruebas automatizadas unitarias y E2E (End-to-End) usando **Vitest**, **Testing Library** y **Selenium WebDriver** para el módulo de Empresas.

## 📦 Tecnologías de Testing

- **Vitest**: Framework de testing rápido y moderno para Vite
- **@testing-library/react**: Testing de componentes React
- **@testing-library/jest-dom**: Matchers adicionales para DOM
- **Selenium WebDriver**: Automatización de navegador para pruebas E2E
- **ChromeDriver**: Driver de Chrome para Selenium
- **jsdom**: Entorno DOM para pruebas unitarias

## 🚀 Scripts Disponibles

### Pruebas Unitarias
```bash
# Ejecutar todas las pruebas en modo watch
npm run test

# Ejecutar todas las pruebas una vez
npm run test:run

# Ver interfaz gráfica de Vitest
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage

# Solo pruebas unitarias
npm run test:unit

# Solo pruebas del módulo Empresas
npm run test:companies
```

### Pruebas E2E con Selenium
```bash
# Ejecutar pruebas E2E
npm run test:e2e

# Solo pruebas E2E de Empresas
npm run test:companies:e2e
```

## 📁 Estructura de Archivos de Pruebas

```
src/test/
├── setup.ts                          # Configuración global de pruebas
├── unit/                             # Pruebas unitarias
│   ├── CompaniesPage.test.tsx       # Pruebas de componente CompaniesPage
│   └── companyService.test.ts       # Pruebas de servicio companyService
└── e2e/                              # Pruebas End-to-End
    └── companies.selenium.test.ts   # Pruebas E2E con Selenium
```

## 🧪 Pruebas Unitarias del Módulo Empresas

### CompaniesPage.test.tsx
Pruebas del componente de lista de empresas:
- ✅ Renderizado del título
- ✅ Carga y visualización de empresas
- ✅ Visualización de RUC y email
- ✅ Mensaje cuando no hay empresas
- ✅ Botones de navegación (Nueva Empresa, Estadísticas)
- ✅ Filtrado por búsqueda
- ✅ Manejo de errores
- ✅ Eliminación de empresas

### companyService.test.ts
Pruebas del servicio de API:
- ✅ `getAll()` - Obtener todas las empresas
- ✅ `getById(id)` - Obtener empresa por ID
- ✅ `create(data)` - Crear nueva empresa
- ✅ `update(id, data)` - Actualizar empresa
- ✅ `delete(id)` - Eliminar empresa
- ✅ Validaciones de RUC y email
- ✅ Manejo de errores de red

## 🌐 Pruebas E2E con Selenium

### companies.selenium.test.ts
Pruebas de flujo completo en navegador:
- ✅ Navegación a la página de Empresas
- ✅ Visualización de la lista de empresas
- ✅ Botón de Nueva Empresa
- ✅ Navegación al formulario de creación
- ✅ Validación de campos del formulario
- ✅ Validación de campos requeridos
- ✅ Búsqueda de empresas
- ✅ Navegación a Estadísticas
- ✅ Botón de Volver en formulario

## ⚙️ Configuración

### vitest.config.ts
Configuración de Vitest con:
- Entorno jsdom para simular el DOM
- Cobertura de código con v8
- Archivo de setup global
- Alias de rutas

### src/test/setup.ts
Configuración global que incluye:
- Importación de jest-dom matchers
- Limpieza automática después de cada prueba
- Mocks de window.matchMedia
- Mocks de IntersectionObserver
- Mocks de ResizeObserver

## 🎯 Ejemplo de Uso

### Ejecutar pruebas unitarias en modo watch
```bash
npm run test
```

### Ejecutar solo las pruebas de Empresas
```bash
npm run test:companies
```

### Ejecutar pruebas E2E (requiere que la app esté corriendo)
```bash
# Terminal 1: Levantar el servidor de desarrollo
npm run dev

# Terminal 2: Ejecutar pruebas E2E
npm run test:companies:e2e
```

### Ver cobertura de código
```bash
npm run test:coverage
```

## 📊 Cobertura de Código

El reporte de cobertura se genera en `coverage/` e incluye:
- Cobertura de líneas
- Cobertura de funciones
- Cobertura de branches
- Reporte HTML interactivo

## 🔧 Troubleshooting

### Las pruebas E2E fallan
1. Asegúrate de que la aplicación esté corriendo en `http://localhost:5173`
2. Verifica que Chrome esté instalado
3. ChromeDriver se instala automáticamente con el paquete

### Errores de timeout
Las pruebas E2E tienen un timeout de 30 segundos. Si tu aplicación es lenta:
```typescript
it('test name', async () => {
  // código
}, 60000) // Aumentar timeout a 60 segundos
```

### Mock de componentes externos
Si necesitas mockear más componentes (como framer-motion):
```typescript
vi.mock('library-name', () => ({
  Component: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))
```

## 📝 Buenas Prácticas

1. **Nombrar tests descriptivamente**: Usa "debería..." para describir el comportamiento esperado
2. **Limpiar mocks**: Usa `vi.clearAllMocks()` en `beforeEach`
3. **Usar waitFor**: Para operaciones asíncronas en pruebas de componentes
4. **Selectores estables**: Usa `data-testid` o roles semánticos en E2E
5. **Aislar pruebas**: Cada test debe ser independiente

## 🚀 Próximos Pasos

Para agregar pruebas a otros módulos:
1. Crear archivo de test en `src/test/unit/`
2. Seguir el patrón de `CompaniesPage.test.tsx`
3. Agregar script específico en `package.json`
4. Documentar en este README

## 📖 Referencias

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
