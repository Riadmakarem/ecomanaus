import { useMemo, useState } from "react";
import { Recycle, MapPin, Heart, X, CheckCircle2, MessageCircle } from "lucide-react";
import { PageHeader, CategoryPill, EmptyState } from "../components/ui";
import { useEco } from "../context/EcoContext";
import {
  NEIGHBORHOODS,
  TROCA_LABELS,
  type TrocaCategory,
} from "../types";

const FILTERS: { value: "todos" | TrocaCategory; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "moveis", label: "Móveis" },
  { value: "eletronicos", label: "Eletrônicos" },
  { value: "livros", label: "Livros" },
  { value: "roupas", label: "Roupas" },
  { value: "materiais_escolares", label: "Materiais Escolares" },
  { value: "outros", label: "Outros" },
];

const DONATION_ART = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=70",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=70",
  "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=900&q=70",
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=900&q=70",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=70",
  "https://images.unsplash.com/photo-1598008916843-b2d5edb315ec?w=900&q=70",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=70",
  "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=900&q=70",
];

function fallbackArt(i: number) {
  return DONATION_ART[i % DONATION_ART.length];
}

export function EcoTroca() {
  const { items, reserveItem, addPoints } = useEco();
  const [filter, setFilter] = useState<"todos" | TrocaCategory>("todos");
  const [bairro, setBairro] = useState("todos");
  const [contactItem, setContactItem] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          (filter === "todos" || i.category === filter) &&
          (bairro === "todos" || i.neighborhood === bairro),
      ),
    [items, filter, bairro],
  );

  const contactItemData = items.find((i) => i.id === contactItem);

  return (
    <div>
      <PageHeader
        icon={<Recycle className="h-6 w-6" />}
        title="EcoTroca"
        subtitle="Doe ou troque itens usados. Economia circular funcionando de verdade em Manaus."
      />
      <div className="container-page mt-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 flex-wrap gap-2">
            {FILTERS.map((f) => (
              <CategoryPill
                key={f.value}
                active={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </CategoryPill>
            ))}
          </div>
          <select
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            className="input-base sm:w-64"
          >
            <option value="todos">Todos os bairros</option>
            {NEIGHBORHOODS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="Nenhum item disponível com esses filtros." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, idx) => (
              <div key={item.id} className="card flex flex-col overflow-hidden">
                <div className="relative h-44">
                  <img
                    src={item.photoUrl || fallbackArt(idx)}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="badge absolute left-3 top-3 bg-white/95 text-eco-800 shadow-sm">
                    {TROCA_LABELS[item.category]}
                  </span>
                  {item.status === "reservado" && (
                    <span className="badge absolute right-3 top-3 bg-clay-500 text-white">
                      Reservado
                    </span>
                  )}
                  {item.status === "doado" && (
                    <span className="badge absolute right-3 top-3 bg-slate-600 text-white">
                      Doado
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-bold text-eco-950">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {item.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-eco-600" /> Bairro{" "}
                      {item.neighborhood}
                    </span>
                    <span>Doador: {item.donor}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {item.status === "disponivel" ? (
                      <>
                        <button
                          onClick={() => setContactItem(item.id)}
                          className="btn-primary flex-1"
                        >
                          <MessageCircle className="h-4 w-4" /> Quero este item
                        </button>
                        <button
                          onClick={() => {
                            reserveItem(item.id);
                            addPoints(40, "Item doado no EcoTroca");
                          }}
                          className="btn-secondary"
                          title="Confirmar doação"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-sm font-semibold text-slate-400">
                        <CheckCircle2 className="h-4 w-4" />
                        {item.status === "reservado"
                          ? "Em processo de retirada"
                          : "Já foi doado"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {contactItemData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setContactItem(null)}
        >
          <div
            className="card w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold text-eco-950">
                Quero este item
              </h3>
              <button
                onClick={() => setContactItem(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Entre em contato com o doador{" "}
              <strong className="text-slate-800">{contactItemData.donor}</strong>{" "}
              para combinar a retirada.
            </p>
            <div className="mt-4 rounded-xl bg-eco-50 p-4 text-sm">
              <p><strong>Item:</strong> {contactItemData.title}</p>
              <p className="mt-1">
                <strong>Bairro:</strong> {contactItemData.neighborhood}
              </p>
            </div>
            <button
              onClick={() => {
                reserveItem(contactItemData.id);
                setContactItem(null);
              }}
              className="btn-primary mt-5 w-full"
            >
              <MessageCircle className="h-4 w-4" /> Enviar solicitação de contato
            </button>
          </div>
        </div>
      )}
    </div>
  );
}