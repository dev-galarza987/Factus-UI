import { Button } from "../components/ui/button";
import { ModeToggle } from "../components/mode-toggle";
import { DatabaseIcon } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <DatabaseIcon className="size-6 text-primary" />
          <span className="text-xl font-bold">Factus UI</span>
        </div>

        <nav className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Empresas
          </Button>
          <Button variant="ghost" size="sm">
            Clientes
          </Button>
          <Button variant="ghost" size="sm">
            Facturas
          </Button>
          <Button variant="ghost" size="sm">
            Pagos
          </Button>
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
