import { Megaphone, CalendarDays, MapPin, Users, CheckCircle2 } from "lucide-react";
import { PageHeader, ProgressBar } from "../components/ui";
import { useEco } from "../context/EcoContext";
import { CAMPAIGN_LABELS } from "../types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Campanhas() {
  const { campaigns, joinCampaign, joinedCampaigns } = useEco();

  return (
    <div>
      <PageHeader
        icon={<Megaphone className="h-6 w-6" />}
        title="Campanhas Ambientais"
        subtitle="Mutirões, coletas e plantios organizados por ONGs, escolas e empresas de Manaus."
      />

      <div className="container-page mt-6 grid gap-5 sm:grid-cols-2">
        {campaigns.map((c) => {
          const joined = joinedCampaigns.includes(c.id);
          const pct = Math.min(
            100,
            Math.round(
              (Number(c.currentProgress) / Number(c.goalMetric.replace(/\D/g, ""))) * 100,
            ),
          );
          return (
            <div key={c.id} className="card flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="badge bg-eco-100 text-eco-800">
                    {CAMPAIGN_LABELS[c.category]}
                  </span>
                  <h2 className="mt-3 text-xl font-bold text-eco-950">
                    {c.title}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-eco-700">
                    {c.organizerName}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {c.description}
              </p>

              <div className="mt-4 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-eco-600" /> {c.neighborhood}
                </span>
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-eco-600" />
                  {formatDate(c.startDate)}
                </span>
              </div>

              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Meta: {c.goalMetric}</span>
                  <span>{pct}%</span>
                </div>
                <ProgressBar value={c.currentProgress} max={Number(c.goalMetric.replace(/\D/g, ""))} />
              </div>

              <div className="mt-5">
                {joined ? (
                  <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-eco-100 py-2.5 text-sm font-bold text-eco-700">
                    <CheckCircle2 className="h-4 w-4" /> Inscrito · Check-in feito
                  </span>
                ) : (
                  <button onClick={() => joinCampaign(c.id)} className="btn-primary w-full">
                    <Users className="h-4 w-4" /> Inscrever-se (+100 EcoPontos)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}