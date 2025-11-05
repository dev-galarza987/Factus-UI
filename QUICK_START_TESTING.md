# 🎯 Guía Rápida - Testing Automatizado para Módulo Empresas

## ✅ ¿Qué se ha instalado?

### Paquetes de Testing
```json
{
  "devDependencies": {
    "selenium-webdriver": "^4.x",
    "@types/selenium-webdriver": "^4.x",
    "chromedriver": "^131.x",
    "@testing-library/react": "^16.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/user-event": "^14.x",
    "vitest": "^4.x",
    "@vitest/ui": "^4.x",
    "jsdom": "^25.x"
  }
}
```

## 📁 Archivos Creados

### Configuración
- ✅ `vitest.config.ts` - Configuración de Vitest
- ✅ `src/test/setup.ts` - Setup global de pruebas

### Pruebas Unitarias
- ✅ `src/test/unit/CompaniesPage.test.tsx` - 10 tests del componente
- ✅ `src/test/unit/companyService.test.ts` - 15 tests del servicio API

### Pruebas E2E (Selenium)
- ✅ `src/test/e2e/companies.selenium.test.ts` - 10 tests end-to-end

### Documentación
- ✅ `TESTING.md` - Documentación completa
- ✅ `QUICK_START_TESTING.md` - Esta guía rápida

## 🚀 Comandos Disponibles

```bash
# 🧪 PRUEBAS UNITARIAS

# Ejecutar todas las pruebas en modo watch (recomendado para desarrollo)
npm run test

# Ejecutar todas las pruebas una sola vez
npm run test:run

# Ver interfaz gráfica de Vitest (muy útil!)
npm run test:ui

# Solo pruebas unitarias
npm run test:unit

# Solo pruebas del módulo Empresas
npm run test:companies

# Generar reporte de cobertura
npm run test:coverage

# 🌐 PRUEBAS E2E CON SELENIUM

# Todas las pruebas E2E
npm run test:e2e

# Solo E2E de Empresas
npm run test:companies:e2e
```

## 🎬 Cómo Empezar

### 1. Ejecutar Pruebas Unitarias
```bash
# Abrir terminal en la raíz del proyecto
npm run test:companies
```

**Resultado esperado:**
```
✓ src/test/unit/CompaniesPage.test.tsx (10 tests)
✓ src/test/unit/companyService.test.ts (15 tests)

Test Files  2 passed (2)
     Tests  25 passed (25)
```

### 2. Ver Interfaz Gráfica (Recomendado)
```bash
npm run test:ui
```
Se abrirá una interfaz en el navegador donde puedes:
- Ver todos los tests
- Ejecutar tests individualmente
- Ver cobertura de código
- Depurar tests

### 3. Ejecutar Pruebas E2E
```bash
# Terminal 1: Levantar servidor de desarrollo
npm run dev

# Terminal 2: Ejecutar pruebas E2E
npm run test:companies:e2e
```

**Resultado esperado:**
```
✓ src/test/e2e/companies.selenium.test.ts (10 tests)

Test Files  1 passed (1)
     Tests  10 passed (10)
```

## 📊 Resumen de Pruebas

### CompaniesPage (Componente)
| Test | Descripción |
|------|-------------|
| ✅ Título | Verifica que se muestre "Gestión de Empresas" |
| ✅ Lista | Carga y muestra las empresas |
| ✅ RUC | Muestra el RUC de cada empresa |
| ✅ Email | Muestra el email de cada empresa |
| ✅ Vacío | Mensaje cuando no hay empresas |
| ✅ Botones | Muestra botones de Nueva Empresa y Estadísticas |
| ✅ Filtrado | Filtra empresas por búsqueda |
| ✅ Errores | Maneja errores de carga |
| ✅ Eliminar | Llama al servicio para eliminar |

### companyService (API)
| Método | Tests |
|--------|-------|
| `getAll()` | ✅ Éxito ✅ Error |
| `getById(id)` | ✅ Éxito ✅ Error |
| `create(data)` | ✅ Éxito ✅ Error |
| `update(id, data)` | ✅ Éxito ✅ Error |
| `delete(id)` | ✅ Éxito ✅ Error |
| Validaciones | ✅ RUC ✅ Email ✅ Campos requeridos |

### Selenium E2E (Navegador)
| Test | Descripción |
|------|-------------|
| ✅ Navegación | Navega de inicio a Empresas |
| ✅ Lista | Muestra la tabla de empresas |
| ✅ Botón Nueva | Existe y es clickeable |
| ✅ Formulario | Navega al formulario de creación |
| ✅ Campos | Muestra todos los campos requeridos |
| ✅ Validación | Valida campos vacíos |
| ✅ Búsqueda | Campo de búsqueda funciona |
| ✅ Estadísticas | Navega a estadísticas |
| ✅ Volver | Botón de volver funciona |

## 🎯 Comandos Más Usados

```bash
# Para desarrollo diario
npm run test                 # Tests en watch mode

# Antes de commit
npm run test:run            # Ejecutar todos los tests

# Para reportes
npm run test:coverage       # Generar cobertura

# Para depurar
npm run test:ui             # Interfaz gráfica
```

## 🔍 Ver Cobertura de Código

```bash
npm run test:coverage
```

Se genera en `coverage/index.html` - Ábrelo en tu navegador para ver:
- % de líneas cubiertas
- % de funciones cubiertas
- % de branches cubiertas
- Código no cubierto resaltado

## 💡 Tips

1. **Modo Watch**: `npm run test` detecta cambios automáticamente
2. **UI Mode**: `npm run test:ui` es la mejor manera de explorar tests
3. **E2E**: Requiere que la app esté corriendo en `http://localhost:5173`
4. **Cobertura**: Apunta a >80% para código crítico
5. **Selectores**: Usa `data-testid` en componentes para tests más estables

## 🐛 Solución de Problemas

### "Cannot find module"
```bash
npm install
```

### E2E fallan con timeout
- Verifica que `npm run dev` esté corriendo
- Aumenta el timeout en el test si tu máquina es lenta

### Tests pasan pero con warnings
- Revisa la configuración en `vitest.config.ts`
- Asegúrate de que `setup.ts` se ejecute

## 📚 Documentación Completa

Para más detalles, consulta `TESTING.md` que incluye:
- Explicación detallada de cada test
- Cómo agregar nuevos tests
- Mejores prácticas
- Referencias y recursos

## ✨ Estado Actual

```
✅ Selenium instalado y configurado
✅ Vitest configurado
✅ Testing Library listo
✅ 25 pruebas unitarias creadas
✅ 10 pruebas E2E creadas
✅ Scripts de npm configurados
✅ Documentación completa
✅ 0 errores de TypeScript
```

**¡Todo listo para usar! 🎉**
