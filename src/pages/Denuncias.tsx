import {
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { PageHeader, EmptyState } from "../components/ui";
import { useEco } from "../context/EcoContext";
import {
  REPORT_LABELS,
  REPORT_STATUS_FLOW,
  type ReportStatus,
} from "../types";

const statusColor: Record<ReportStatus, string> = {
  Reportado: "bg-slate-100 text-slate-700",
  "Em Análise": "bg-eco-50 text-eco-600",
  Encaminhado: "bg-clay-100 text-clay-700",
  Resolvido: "bg-eco-100 text-eco-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function Denuncias() {
  const { reports, advanceReportStatus } = useEco();

  return (
    <div>
      <PageHeader
        icon={<AlertTriangle className="h-6 w-6" />}
        title="Minhas Denúncias"
        subtitle="Acompanhe o ciclo de vida do chamado: Reportado → Em Análise → Encaminhado → Resolvido."
      >
        <span className="badge bg-eco-100 text-eco-800">
          {reports.length} denúncias na comunidade
        </span>
      </PageHeader>

      <div className="container-page mt-6 space-y-6">
        {reports.length === 0 ? (
          <EmptyState message="Nenhuma denúncia registrada ainda." />
        ) : (
          reports.map((r) => (
            <article key={r.id} className="card overflow-hidden">
              <div className="grid md:grid-cols-[280px_1fr]">
                <div className="relative h-48 md:h-full">
                  <img
                    src={r.photoUrl}
                    alt={r.title}
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`badge absolute left-3 top-3 ${statusColor[r.status]}`}
                  >
                    {r.status}
                  </span>
                </div>

                <div className="flex flex-col gap-3 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="badge bg-eco-50 text-eco-700">
                      {REPORT_LABELS[r.category]}
                    </span>
                    <span>Bairro: {r.neighborhood}</span>
                    <span>·</span>
                    <span>{formatDate(r.createdAt)}</span>
                  </div>

                  <h2 className="text-lg font-bold text-eco-950">{r.title}</h2>
                  {r.description && (
                    <p className="text-sm text-slate-500">{r.description}</p>
                  )}

                  {r.aiVerificationNotes && (
                    <div className="flex items-start gap-2 rounded-xl border border-eco-100 bg-eco-50 px-3.5 py-2.5 text-xs text-eco-800">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-eco-600" />
                      <span>{r.aiVerificationNotes}</span>
                    </div>
                  )}

                  <div className="mt-auto flex flex-col gap-3 pt-2">
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                      {REPORT_STATUS_FLOW.map((s, i) => {
                        const current = REPORT_STATUS_FLOW.indexOf(r.status);
                        const reached = i <= current;
                        return (
                          <div key={s} className="flex items-center gap-1">
                            <span
                              className={`badge ${
                                reached ? statusColor[s] : "bg-slate-100 text-slate-300"
                              }`}
                            >
                              {s}
                            </span>
                            {i < REPORT_STATUS_FLOW.length - 1 && (
                              <ArrowRight className="h-3 w-3 text-slate-300" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {r.status !== "Resolvido" ? (
                        <button
                          onClick={() => advanceReportStatus(r.id)}
                          className="btn-secondary !py-2 text-xs"
                        >
                          Simular avanço de status →
                        </button>
                      ) : (
                        <span className="badge bg-eco-600 text-white">
                          <CheckCircle2 className="h-3 w-3" /> Resolvido em{" "}
                          {r.resolvedAt ? formatDate(r.resolvedAt) : "—"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}