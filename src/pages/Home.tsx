import { Link } from "react-router-dom";
import {
  Leaf,
  MapPin,
  AlertTriangle,
  Recycle,
  Megaphone,
  GraduationCap,
  Building2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

const metrics = [
  { label: "kg de materiais destinados", value: "2.340", icon: Recycle },
  { label: "itens reaproveitados", value: "486", icon: TrendingUp },
  { label: "ações ambientais realizadas", value: "27", icon: Megaphone },
  { label: "usuários ativos", value: "1.842", icon: Sparkles },
  { label: "denúncias registradas", value: "73", icon: AlertTriangle },
];

export function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-eco-950">
        <div className="absolute inset-0">
          <div className="absolute -left-24 -top-24 h-[420px] w-[420px] animate-blob rounded-full bg-eco-500/30 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[380px] w-[380px] animate-blob rounded-full bg-clay-500/25 blur-3xl [animation-delay:4s]" />
          <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] animate-blob rounded-full bg-eco-400/20 blur-3xl [animation-delay:8s]" />
        </div>
        <div className="paper-grain absolute inset-0 opacity-30" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-eco-950 to-transparent" />

        <div className="container-page relative py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-eco-200 backdrop-blur">
              <Leaf className="h-3.5 w-3.5" /> Manaus · Amazonas
            </span>
            <h1 className="mx-auto mt-7 animate-fade-up font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white [animation-delay:0.1s] sm:text-7xl">
              Sustentabilidade
              <br />
              <span className="bg-gradient-to-r from-eco-300 via-eco-200 to-white bg-clip-text text-transparent">
                com raiz amazônica.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl animate-fade-up text-lg text-eco-100/75 [animation-delay:0.2s]">
              Ecopontos, denúncias, doações e campanhas — tudo em uma
              plataforma feita para quem vive e cuida de Manaus.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-up [animation-delay:0.3s]">
              <Link to="/mapa" className="btn-accent !px-6 !py-3.5 text-sm">
                <MapPin className="h-4 w-4" /> Ver Mapa Sustentável
              </Link>
              <Link
                to="/denunciar"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Fazer uma denúncia <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Metrics strip */}
          <div className="relative mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur sm:grid-cols-5">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex flex-col items-center gap-2 bg-eco-950/40 px-4 py-6 text-center transition hover:bg-white/5"
              >
                <m.icon className="h-5 w-5 text-eco-300" />
                <p className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                  {m.value}
                </p>
                <p className="text-[11px] font-medium leading-tight text-eco-100/60">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO MODULES */}
      <section className="container-page mt-20">
        <div className="flex items-end justify-between">
          <div>
            <span className="section-eyebrow">Plataforma</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-eco-950 sm:text-4xl">
              Uma cidade, todos os caminhos.
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <BentoCard
            to="/mapa"
            icon={MapPin}
            title="Mapa Sustentável"
            desc="Ecopontos por bairro e busca inteligente por material: eletrônicos, óleo, pilhas, roupas e mais."
            className="lg:col-span-2 lg:row-span-1"
            featured
          />
          <BentoCard
            to="/denunciar"
            icon={AlertTriangle}
            title="Denúncia Ambiental"
            desc="Foto + IA que pré-classifica a ocorrência automaticamente."
          />
          <BentoCard
            to="/ecotroca"
            icon={Recycle}
            title="EcoTroca"
            desc="Doe ou troque itens. Economia circular de verdade."
          />
          <BentoCard
            to="/campanhas"
            icon={Megaphone}
            title="Campanhas"
            desc="Mutirões, coletas e plantios em toda Manaus."
          />
          <BentoCard
            to="/bairros"
            icon={Building2}
            title="Bairros"
            desc="Índice EcoManaus comparado por região."
          />
          <BentoCard
            to="/escolas"
            icon={GraduationCap}
            title="Módulo Escolar"
            desc="Desafios do mês e ranking entre turmas."
          />
        </div>
      </section>

      {/* GAMIFICATION CTA */}
      <section className="container-page mt-20 mb-4">
        <div className="relative overflow-hidden rounded-4xl bg-eco-950 p-10 text-white sm:p-14">
          <div className="absolute -right-16 -top-16 h-64 w-64 animate-float rounded-full bg-clay-500/20 blur-2xl" />
          <div className="absolute -bottom-20 left-10 h-56 w-56 animate-float rounded-full bg-eco-400/20 blur-2xl [animation-delay:2s]" />
          <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div className="max-w-lg">
              <span className="section-eyebrow border-white/15 bg-white/5 text-eco-200">
                Gamificação
              </span>
              <h3 className="mt-4 font-display text-3xl font-bold tracking-tight">
                Vire um Guardião da Amazônia
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-eco-100/85">
                <span>♻️ Descarte correto — +50 pts</span>
                <span>⛑️ Denúncia válida — +20 pts</span>
                <span>🎁 Doação no EcoTroca — +40 pts</span>
                <span>🌳 Campanha ambiental — +100 pts</span>
              </div>
            </div>
            <Link to="/perfil" className="btn-accent relative shrink-0">
              Ver minhas conquistas <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function BentoCard({
  to,
  icon: Icon,
  title,
  desc,
  className = "",
  featured = false,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  className?: string;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <Link
        to={to}
        className={`card card-hover group relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-eco-600 to-eco-800 p-8 text-white ${className}`}
      >
        <div className="paper-grain absolute inset-0 opacity-20" />
        <div className="relative">
          <span className="icon-tile h-14 w-14 bg-white/15 text-white backdrop-blur">
            <Icon className="h-7 w-7" />
          </span>
          <h3 className="mt-6 font-display text-2xl font-bold">{title}</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-eco-50/85">
            {desc}
          </p>
        </div>
        <ArrowUpRight className="relative mt-6 h-6 w-6 text-white/70 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`card card-hover group flex flex-col justify-between p-6 ${className}`}
    >
      <div>
        <span className="icon-tile h-11 w-11 bg-eco-100 text-eco-700 transition group-hover:bg-eco-600 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-eco-950">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{desc}</p>
      </div>
      <ArrowUpRight className="mt-4 h-4 w-4 text-eco-300 opacity-0 transition group-hover:opacity-100" />
    </Link>
  );
}
