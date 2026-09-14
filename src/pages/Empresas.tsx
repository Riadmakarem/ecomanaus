import { LayoutDashboard, FileBarChart, Award, Recycle, Building2, TrendingUp } from "lucide-react";
import { PageHeader } from "../components/ui";

const reports = [
  {
    company: "TechRecicla AM",
    highlight: "1,2 tonelada de eletrônicos arrecadados em Manaus em 2026",
    kg: "1.200 kg",
    items: 420,
    campaigns: 3,
    co2: "-4,8 t CO₂e",
  },
  {
    company: "Supermercado Bom Preço",
    highlight: "680 kg de óleo de cozinha coletados nas lojas da Compensa",
    kg: "680 kg",
    items: 0,
    campaigns: 2,
    co2: "-2,1 t CO₂e",
  },
  {
    company: "Padaria Bom Pão",
    highlight: "Material escolar doado a 150 crianças do Centro",
    kg: "0 kg",
    items: 150,
    campaigns: 1,
    co2: "-0,6 t CO₂e",
  },
];

export function Empresas() {
  return (
    <div>
      <PageHeader
        icon={<LayoutDashboard className="h-6 w-6" />}
        title="Portal ESG para Empresas"
        subtitle="Patrocine campanhas, gerencie ecopontos próprios e gere relatórios de impacto ambiental automaticamente."
      />

      <div className="container-page mt-6 space-y-6">
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-eco-100 text-eco-700">
              <Recycle className="h-5 w-5" />
            </span>
            <h3 className="mt-3 font-bold text-eco-950">Ecopontos próprios</h3>
            <p className="mt-1 text-sm text-slate-500">
              Cadastre pontos de coleta vinculados à sua empresa e monitore o fluxo de materiais.
            </p>
          </div>
          <div className="card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-eco-100 text-eco-700">
              <Award className="h-5 w-5" />
            </span>
            <h3 className="mt-3 font-bold text-eco-950">Patrocínio de campanhas</h3>
            <p className="mt-1 text-sm text-slate-500">
              Apoie mutirões e coletas comunitárias com visibilidade de marca.
            </p>
          </div>
          <div className="card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-eco-100 text-eco-700">
              <FileBarChart className="h-5 w-5" />
            </span>
            <h3 className="mt-3 font-bold text-eco-950">Relatórios automáticos</h3>
            <p className="mt-1 text-sm text-slate-500">
              Gere relatórios de impacto ESG com dados reais para conformidade e divulgação.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="text-xl font-bold text-eco-950">
            Impacto público dos parceiros
          </h2>
          {reports.map((r) => (
            <div key={r.company} className="card p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-eco-950">
                    <Building2 className="h-5 w-5 text-eco-600" />
                    {r.company}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{r.highlight}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-center sm:text-right">
                  <div>
                    <p className="text-xl font-extrabold text-eco-700">{r.kg}</p>
                    <p className="text-xs text-slate-400">materiais</p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-eco-700">{r.items}</p>
                    <p className="text-xs text-slate-400">itens</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1 text-xl font-extrabold text-eco-700">
                      <TrendingUp className="h-5 w-5" />
                    </p>
                    <p className="text-xs text-slate-400">{r.co2}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card overflow-hidden bg-gradient-to-r from-eco-600 to-eco-800 p-8 text-white">
          <h3 className="text-xl font-bold">Mesure seu impacto ESG em Manaus</h3>
          <p className="mt-1.5 max-w-2xl text-sm text-eco-100/90">
            Compilamos kg reciclados, itens reaproveitados e redução de emissões em
            relatórios prontos para seu relatório anual de sustentabilidade.
          </p>
          <button className="btn-primary mt-5 bg-eco-500 hover:bg-eco-400">
            <FileBarChart className="h-4 w-4" /> Gerar relatório de impacto
          </button>
        </div>
      </div>
    </div>
  );
}