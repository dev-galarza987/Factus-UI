import { Button } from "../components/ui/button";
import { ModeToggle } from "../components/mode-toggle";
import { DatabaseIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, type: "spring", stiffness: 80, damping: 15 }}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
          >
            <DatabaseIcon className="size-6 text-primary" />
          </motion.div>
          <span className="text-xl font-bold">Factus UI</span>
        </Link>

        <motion.nav 
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <Link to="/companies">
            <Button variant="ghost" size="sm">
              Empresas
            </Button>
          </Link>
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
        </motion.nav>
      </div>
    </motion.header>
  );
}
