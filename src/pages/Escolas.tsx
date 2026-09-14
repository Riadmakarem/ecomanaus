import { Link, useParams } from "react-router-dom";
import { GraduationCap, ArrowLeft, MapPin, Trophy, Users, Recycle } from "lucide-react";
import { PageHeader, ProgressBar, EmptyState } from "../components/ui";
import { schools } from "../data/mockData";

export function Escolas() {
  return (
    <div>
      <PageHeader
        icon={<GraduationCap className="h-6 w-6" />}
        title="Módulo Educacional"
        subtitle="Escolas engajadas em gincanas, reciclagem e educação ambiental. Veja o desafio do mês e o ranking das turmas."
      />

      <div className="container-page mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {schools.map((s) => (
          <Link key={s.id} to={`/escola/${s.id}`} className="card card-hover flex flex-col p-6">
            <span className="icon-tile h-12 w-12 bg-eco-100 text-eco-700">
              <GraduationCap className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-eco-950">{s.name}</h2>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5" /> Bairro {s.neighborhood}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-eco-50 p-2.5">
                <p className="text-lg font-extrabold text-eco-700">
                  {s.kgRecycled.toLocaleString("pt-BR")}
                </p>
                <p className="text-[11px] font-medium text-slate-500">kg reciclados</p>
              </div>
              <div className="rounded-xl bg-eco-50 p-2.5">
                <p className="text-lg font-extrabold text-eco-700">{s.studentsParticipating}</p>
                <p className="text-[11px] font-medium text-slate-500">alunos ativos</p>
              </div>
              <div className="rounded-xl bg-eco-50 p-2.5">
                <p className="text-lg font-extrabold text-eco-700">{s.activeCampaigns}</p>
                <p className="text-[11px] font-medium text-slate-500">campanhas</p>
              </div>
            </div>

            <span className="mt-4 text-center text-sm font-bold text-eco-700">
              Desafio do mês: {s.monthlyChallenge}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function EscolaDetalhe() {
  const { id } = useParams();
  const school = schools.find((s) => s.id === id);
  if (!school) return <EmptyState message="Escola não encontrada." />;

  const sorted = [...school.classes].sort((a, b) => b.kgRecycled - a.kgRecycled);
  const challengeTarget = 100;

  return (
    <div>
      <PageHeader
        icon={<GraduationCap className="h-6 w-6" />}
        title={school.name}
        subtitle={`Bairro ${school.neighborhood} · ${school.studentsParticipating} alunos participantes`}
      >
        <Link to="/escolas" className="btn-secondary">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
      </PageHeader>

      <div className="container-page mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-eco-950">
              <Trophy className="h-5 w-5 text-clay-500" /> Desafio do Mês
            </h2>
            <p className="mt-1 text-sm text-slate-500">{school.monthlyChallenge}</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex-1">
                <ProgressBar
                  value={school.kgRecycled}
                  max={challengeTarget * 4}
                />
              </span>
              <span className="text-sm font-bold text-eco-700">
                {school.kgRecycled} kg
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Metas conjuntas entre todas as turmas participantes.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-eco-950">Ranking entre Turmas</h2>
            <ul className="mt-4 space-y-3">
              {sorted.map((c, i) => {
                const medalColor =
                  i === 0
                    ? "bg-amber-100 text-amber-700"
                    : i === 1
                      ? "bg-slate-200 text-slate-700"
                      : i === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-slate-50 text-slate-400";
                return (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${medalColor}`}
                    >
                      {i + 1}º
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{c.className}</p>
                      <p className="text-xs text-slate-400">
                        {c.studentsCount} alunos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-eco-700">
                        {c.kgRecycled} kg
                      </p>
                      <p className="text-xs text-slate-400">reciclados</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-eco-950">Pílulas Educativas</h3>
            <ul className="mt-4 space-y-3">
              {[
                "Como separar recicláveis em casa",
                "O que fazer com óleo de cozinha usado",
                "Ecossistema dos igarapés de Manaus",
                "Reduce, reuse, recycle — na prática",
              ].map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 rounded-xl bg-eco-50 px-3.5 py-3 text-sm font-medium text-eco-800"
                >
                  <span className="text-eco-500">🌱</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="card flex items-center gap-4 p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-100 text-eco-700">
              <Recycle className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-extrabold text-eco-950">
                {school.kgRecycled.toLocaleString("pt-BR")} kg
              </p>
              <p className="text-sm text-slate-500">já reciclados pela escola</p>
            </div>
          </div>

          <div className="card flex items-center gap-4 p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-100 text-eco-700">
              <Users className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-extrabold text-eco-950">
                {school.studentsParticipating}
              </p>
              <p className="text-sm text-slate-500">alunos participantes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}