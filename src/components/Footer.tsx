import { Link } from "react-router-dom";
import { MapPin, Recycle, Heart } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-eco-950 text-eco-100">
      <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-eco-500/10 blur-3xl" />
      <div className="container-page relative grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo tone="light" />
          <p className="mt-3 text-sm text-eco-200/80">
            Plataforma integrada de sustentabilidade urbana da cidade de Manaus.
            Conectando pessoas, escolas, empresas e poder público pela Amazônia.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Navegação</h4>
          <ul className="mt-3 space-y-2 text-sm text-eco-200/80">
            <li><Link className="transition hover:text-eco-300" to="/mapa">Mapa Sustentável</Link></li>
            <li><Link className="transition hover:text-eco-300" to="/denunciar">Denúncia Ambiental</Link></li>
            <li><Link className="transition hover:text-eco-300" to="/ecotroca">EcoTroca</Link></li>
            <li><Link className="transition hover:text-eco-300" to="/campanhas">Campanhas</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Comunidade</h4>
          <ul className="mt-3 space-y-2 text-sm text-eco-200/80">
            <li><Link className="transition hover:text-eco-300" to="/bairros">Impacto por Bairro</Link></li>
            <li><Link className="transition hover:text-eco-300" to="/escolas">Módulo Escolar</Link></li>
            <li><Link className="transition hover:text-eco-300" to="/empresas">Empresas (ESG)</Link></li>
            <li><Link className="transition hover:text-eco-300" to="/perfil">Meu Perfil</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
            <MapPin className="h-4 w-4 text-clay-400" /> Manaus/AM
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-eco-200/80">
            <li className="flex items-center gap-2"><Recycle className="h-4 w-4 text-eco-400" /> Economia circular</li>
            <li className="flex items-center gap-2"><Heart className="h-4 w-4 text-clay-400" /> Feito com propósito</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/5 py-5 text-center text-xs text-eco-200/50">
        © 2026 EcoManaus · Sustentabilidade Urbana · Manaus/AM
      </div>
    </footer>
  );
}
