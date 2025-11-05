# Factus-UI 🎨

UI moderna y minimalista para consumir la API REST de Factus construida con React, TypeScript, Vite y Shadcn UI.

## 🚀 Características

- **Diseño Moderno**: UI minimalista y elegante con componentes de Shadcn UI
- **Dark/Light Mode**: Soporte completo para temas claros y oscuros
- **Responsive**: Diseño adaptable a todos los dispositivos
- **TypeScript**: Tipado fuerte para mayor seguridad y productividad
- **Rutas Relativas**: Todas las importaciones usan rutas relativas (sin alias `@/`)

## 📦 Tecnologías

- **React 19**: Framework de UI
- **TypeScript 5**: Tipado estático
- **Vite 7**: Build tool ultra-rápido
- **Tailwind CSS 4**: Framework de CSS utilitario
- **Shadcn UI**: Componentes accesibles y personalizables
- **React Router DOM**: Enrutamiento del lado del cliente
- **Lucide Icons**: Iconos modernos
- **class-variance-authority**: Manejo de variantes de componentes

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de Shadcn UI
│   ├── Header.tsx      # Encabezado de navegación
│   ├── theme-provider.tsx
│   └── mode-toggle.tsx
├── pages/              # Páginas de la aplicación
│   └── HomePage.tsx    # Página de bienvenida
├── lib/                # Utilidades y configuraciones
│   └── utils.ts        # Funciones utilitarias
├── hooks/              # React hooks personalizados
│   └── use-mobile.ts
├── App.tsx             # Componente principal
└── main.tsx            # Punto de entrada
```

## 🎯 Convenciones de Código

### Importaciones
Todas las importaciones deben usar **rutas relativas**:

```tsx
// ✅ Correcto
import { Button } from '../components/ui/button'
import { cn } from '../../lib/utils'

// ❌ Incorrecto
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

### Componentes
- Usa Shadcn UI para componentes de interfaz
- Asegúrate de que sean accesibles
- Compatible con temas claros y oscuros
- Usa `class-variance-authority` para variantes complejas

### Estilos
- Usa Tailwind CSS para estilos utilitarios
- Clases personalizadas en archivos CSS separados cuando sea necesario
- Sigue el sistema de diseño de Shadcn UI

## 🔌 Conexión con la API

La UI consume la API REST de Factus:

- **Base URL**: `http://localhost:4500/api/v1`
- **Swagger UI**: `http://localhost:4500/api/v1/docs`
- **Documentación**: Ver `ENDPOINTS.md`

### Módulos Principales

1. **Company (Empresas)**: `/api/v1/company`
2. **Customer (Clientes)**: `/api/v1/customer`
3. **Invoice (Facturas)**: `/api/v1/invoice`
4. **Payment (Pagos)**: `/api/v1/payment`
5. **User (Usuarios)**: `/api/v1/user`

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Producción
npm run build            # Construye la aplicación
npm run preview          # Vista previa de la build

# Calidad de código
npm run lint             # Ejecuta ESLint
```

## 🎨 Temas

La aplicación soporta temas claros y oscuros. El tema se guarda en localStorage y persiste entre sesiones.

Para cambiar el tema, usa el botón de toggle en el header.

## 📄 Licencia

Este proyecto es parte del sistema de facturación Factus.

## 🤝 Contribuir

1. Sigue las convenciones de código establecidas
2. Usa rutas relativas para todas las importaciones
3. Asegúrate de que los componentes sean accesibles
4. Prueba en modo claro y oscuro
5. Documenta cambios significativos

---

**Construido con ❤️ usando React, TypeScript y Shadcn UI**
