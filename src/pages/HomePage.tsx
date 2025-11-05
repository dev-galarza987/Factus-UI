import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Header } from "../components/Header"
import { 
  BuildingIcon, 
  UsersIcon, 
  FileTextIcon, 
  CreditCardIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ServerIcon,
  DatabaseIcon,
  ShieldCheckIcon
} from "lucide-react"

export function HomePage() {
  const features = [
    {
      icon: BuildingIcon,
      title: "Gestión de Empresas",
      description: "Administra múltiples empresas con sus datos fiscales y de contacto",
      endpoint: "/api/v1/company",
      color: "text-blue-500"
    },
    {
      icon: UsersIcon,
      title: "Clientes",
      description: "Gestiona tu cartera de clientes con información completa y actualizada",
      endpoint: "/api/v1/customer",
      color: "text-green-500"
    },
    {
      icon: FileTextIcon,
      title: "Facturas",
      description: "Crea, consulta y administra facturas con detalles completos",
      endpoint: "/api/v1/invoice",
      color: "text-purple-500"
    },
    {
      icon: CreditCardIcon,
      title: "Pagos",
      description: "Registra y da seguimiento a los pagos recibidos",
      endpoint: "/api/v1/payment",
      color: "text-orange-500"
    }
  ]

  const techStack = [
    { name: "NestJS", version: "11.x" },
    { name: "PostgreSQL", version: "16.x" },
    { name: "TypeORM", version: "0.3.x" },
    { name: "TypeScript", version: "5.x" }
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="text-sm px-4 py-1">
            <ServerIcon className="size-3 mr-2 inline" />
            API REST v1.0.0
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Factus API
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sistema de facturación completo con API REST construido con tecnologías modernas
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center pt-4">
            <Button size="lg" className="gap-2">
              Ver Documentación
              <ArrowRightIcon className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <DatabaseIcon className="size-4" />
              Swagger UI
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Icon className={`size-10 ${feature.color} mb-4`} />
                    <Badge variant="outline" className="text-xs">
                      REST API
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <code className="text-xs bg-muted px-3 py-1 rounded-md font-mono">
                      {feature.endpoint}
                    </code>
                    <ArrowRightIcon className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DatabaseIcon className="size-5" />
                Stack Tecnológico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {techStack.map((tech, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{tech.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {tech.version}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Características */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircleIcon className="size-5" />
                Características
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="size-4 text-green-500 mt-0.5" />
                <span className="text-sm">Validación de datos completa</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="size-4 text-green-500 mt-0.5" />
                <span className="text-sm">Documentación Swagger</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="size-4 text-green-500 mt-0.5" />
                <span className="text-sm">TypeORM con PostgreSQL</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="size-4 text-green-500 mt-0.5" />
                <span className="text-sm">API REST completa</span>
              </div>
            </CardContent>
          </Card>

          {/* Seguridad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheckIcon className="size-5" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="size-4 text-blue-500 mt-0.5" />
                <span className="text-sm">Validación class-validator</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="size-4 text-blue-500 mt-0.5" />
                <span className="text-sm">Transformación de datos</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="size-4 text-blue-500 mt-0.5" />
                <span className="text-sm">Manejo de errores robusto</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="size-4 text-blue-500 mt-0.5" />
                <span className="text-sm">TypeScript estricto</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardHeader>
            <CardTitle>Enlaces Rápidos</CardTitle>
            <CardDescription>
              Accede directamente a los recursos de la API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="http://localhost:4500" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">Servidor Principal</p>
                  <code className="text-xs text-muted-foreground">http://localhost:4500</code>
                </div>
                <ArrowRightIcon className="size-4" />
              </a>

              <a 
                href="http://localhost:4500/api/v1/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">Swagger UI</p>
                  <code className="text-xs text-muted-foreground">http://localhost:4500/api/v1/docs</code>
                </div>
                <ArrowRightIcon className="size-4" />
              </a>

              <a 
                href="http://localhost:4500/home" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">Documentación Home</p>
                  <code className="text-xs text-muted-foreground">http://localhost:4500/home</code>
                </div>
                <ArrowRightIcon className="size-4" />
              </a>

              <a 
                href="http://localhost:4500/api/v1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">Base API</p>
                  <code className="text-xs text-muted-foreground">http://localhost:4500/api/v1</code>
                </div>
                <ArrowRightIcon className="size-4" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Separator className="my-12" />
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Sistema de Facturación API REST - Versión 1.0.0</p>
          <p className="mt-2">
            Construido con ❤️ usando NestJS, PostgreSQL y TypeScript
          </p>
        </div>
        </div>
      </div>
    </>
  )
}
