import { Logo } from "@/components/Logo";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <Logo className="mb-4" />
            <p className="text-muted-foreground mb-4 max-w-md">
              Transformando vidas através da tecnologia e inteligência artificial aplicada à saúde e fitness.
            </p>
            <p className="text-sm text-muted-foreground">
              Feito com <Heart className="w-4 h-4 inline text-red-500" /> para o Brasil
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-orbitron font-semibold text-foreground mb-4">Produto</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Como funciona</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Recursos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Preços</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-orbitron font-semibold text-foreground mb-4">Empresa</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Sobre nós</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Termos</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 FitPlanAI powered by CodeJungle.
          </p>
        </div>
      </div>
    </footer>
  );
}