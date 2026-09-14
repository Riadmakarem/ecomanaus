import { Building2, Recycle, AlertTriangle, Megaphone, Package, Gauge } from "lucide-react";
import { PageHeader, ProgressBar } from "../components/ui";
import { neighborhoods } from "../data/mockData";

export function Bairros() {
  const maxIssues = Math.max(...neighborhoods.map((n) => n.environmentalIssues));

  return (
    <div>
      <PageHeader
        icon={<Building2 className="h-6 w-6" />}
        title="Impacto por Bairro"
        subtitle="Compare os bairros de Manaus pelo Índice EcoManaus (0 a 100) e acompanhe a evolução de cada região."
      />

      <div className="container-page mt-6 space-y-5">
        <div className="card p-6">
          <h2 className="font-bold text-eco-950">Índice EcoManaus — Ranking</h2>
          <div className="mt-5 space-y-4">
            {[...neighborhoods]
              .sort((a, b) => b.ecoIndex - a.ecoIndex)
              .map((n, rank) => (
                <div key={n.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">
                      <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-eco-100 text-xs font-bold text-eco-700">
                        {rank + 1}
                      </span>
                      {n.name}
                    </span>
                    <span className="text-xs font-bold text-eco-700">
                      {n.ecoIndex}/100
                    </span>
                  </div>
                  <ProgressBar
                    value={n.ecoIndex}
                    max={100}
                    color={
                      n.ecoIndex >= 75
                        ? "bg-eco-500"
                        : n.ecoIndex >= 60
                          ? "bg-eco-300"
                          : "bg-clay-500"
                    }
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {neighborhoods.map((n) => (
            <div key={n.name} className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-eco-950">{n.name}</h3>
                <span
                  className={`badge ${
                    n.ecoIndex >= 75
                      ? "bg-eco-100 text-eco-700"
                      : n.ecoIndex >= 60
                        ? "bg-eco-50 text-eco-600"
                        : "bg-clay-100 text-clay-700"
                  }`}
                >
                  <Gauge className="h-3 w-3" /> {n.ecoIndex}/100
                </span>
              </div>

              <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Recycle className="h-4 w-4 text-eco-600" />
                  {n.recyclingPoints} pontos de reciclagem
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-clay-500" />
                  {n.environmentalIssues} problemas ambientais
                </li>
                <li className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-eco-500" />
                  {n.activeCampaigns} campanhas ativas
                </li>
                <li className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-clay-600" />
                  {n.donationItems} itens para doação
                </li>
              </ul>

              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-xs font-semibold text-slate-400">
                  <span>Saúde ambiental</span>
                  <span>{n.ecoIndex}%</span>
                </div>
                <ProgressBar
                  value={maxIssues - n.environmentalIssues + 10}
                  max={maxIssues + 10}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}