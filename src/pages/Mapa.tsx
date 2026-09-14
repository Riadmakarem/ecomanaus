import { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Search,
  Clock,
  CheckCircle2,
  Navigation,
  AlertCircle,
} from "lucide-react";
import { PageHeader, CategoryPill, EmptyState } from "../components/ui";
import { collectionPoints } from "../data/mockData";
import { MATERIAL_LABELS, type MaterialCategory } from "../types";
import { matchMaterials } from "../lib/materialMatcher";

const MANAUS: [number, number] = [-3.119, -60.0217];

type Filter = "todos" | MaterialCategory;

const QUICK_FILTERS: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "reciclagem", label: "Reciclagem Geral" },
  { value: "eletronicos", label: "Eletrônicos" },
  { value: "oleo", label: "Óleo de Cozinha" },
  { value: "pilhas", label: "Pilhas / Baterias" },
  { value: "pet", label: "PET / Papel" },
  { value: "medicamentos", label: "Medicamentos" },
  { value: "roupas", label: "Roupas" },
  { value: "doacoes", label: "Doações" },
];

function iconFor(materials: MaterialCategory[]) {
  const type = materials.includes("eletronicos")
    ? "eletro"
    : materials.includes("oleo")
      ? "oleo"
      : materials.includes("pilhas")
        ? "pilha"
        : materials.includes("medicamentos")
          ? "med"
          : materials.includes("roupas") || materials.includes("doacoes")
            ? "roupa"
            : "geral";
  const colors: Record<string, string> = {
    geral: "#158f60",
    eletro: "#7c3aed",
    oleo: "#d9692e",
    pilha: "#dc2626",
    med: "#0284c7",
    roupa: "#db2777",
  };
  const emoji: Record<string, string> = {
    geral: "♻️",
    eletro: "🔌",
    oleo: "🫗",
    pilha: "🔋",
    med: "💊",
    roupa: "👕",
  };
  return L.divIcon({
    className: "",
    html: `<div style="width:34px;height:34px;border-radius:9999px;background:${colors[type]};display:flex;align-items:center;justify-content:center;font-size:17px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3)">${emoji[type]}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -36],
  });
}

export function Mapa() {
  const [activeFilter, setActiveFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const [matchedMaterials, setMatchedMaterials] = useState<MaterialCategory[]>([]);
  const [searchDone, setSearchDone] = useState(false);

  const filteredPoints = useMemo(() => {
    return collectionPoints.filter((p) => {
      const byFilter =
        activeFilter === "todos" || p.acceptedMaterials.includes(activeFilter);
      const bySearch =
        matchedMaterials.length === 0 ||
        p.acceptedMaterials.some((m) => matchedMaterials.includes(m));
      return byFilter && bySearch;
    });
  }, [activeFilter, matchedMaterials]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const materials = matchMaterials(query);
    setMatchedMaterials(materials);
    setSearchDone(true);
    if (query.trim() && materials.length === 0) {
      setActiveFilter("todos");
    }
  };

  const clearSearch = () => {
    setQuery("");
    setMatchedMaterials([]);
    setSearchDone(false);
  };

  const highlights = matchedMaterials.map((m) => MATERIAL_LABELS[m]).filter(Boolean);

  return (
    <div>
      <PageHeader
        icon={<MapPin className="h-6 w-6" />}
        title="Mapa Sustentável de Manaus"
        subtitle="Encontre ecopontos e pontos de coleta por bairro. Busque por material e veja os pontos mais próximos."
      />

      <div className="container-page mt-6 space-y-4">
        <form
          onSubmit={handleSearch}
          className="card flex flex-col gap-2 p-3 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Ex: "bateria", "notebook", "óleo de cozinha", "garrafa PET"'
              className="input-base pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">
            <Search className="h-4 w-4" /> Buscar material
          </button>
          {searchDone && (
            <button type="button" onClick={clearSearch} className="btn-secondary">
              Limpar
            </button>
          )}
        </form>

        {searchDone && (
          <div
            className={`status-enter flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
              matchedMaterials.length > 0
                ? "border-eco-200 bg-eco-50 text-eco-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {matchedMaterials.length > 0 ? (
              <>
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-eco-600" />
                <span>
                  <strong>IA:</strong> "{"{query}"}" corresponde a{" "}
                  <strong>{highlights.join(", ")}</strong>. Ecopontos compatíveis
                  destacados no mapa.
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>
                  Não encontramos ecopontos específicos para "{query}". Tente
                  termos como "bateria", "óleo", "roupas" ou "medicamentos".
                </span>
              </>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((f) => (
            <CategoryPill
              key={f.value}
              active={activeFilter === f.value}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
            </CategoryPill>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="h-[480px] w-full">
            <MapContainer
              center={MANAUS}
              zoom={12}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredPoints.map((p) => (
                <Marker
                  key={p.id}
                  position={[p.lat, p.lng]}
                  icon={iconFor(p.acceptedMaterials)}
                >
                  <Popup>
                    <div className="min-w-[220px] space-y-1.5 text-sm">
                      <div className="flex items-center gap-1.5 font-bold text-eco-950">
                        <MapPin className="h-4 w-4 text-eco-600" />
                        {p.name}
                      </div>
                      <p className="text-slate-500">{p.address}</p>
                      <p className="text-xs text-slate-400">Bairro: {p.neighborhood}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" /> {p.hours}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.acceptedMaterials.map((m) => (
                          <span
                            key={m}
                            className="badge bg-eco-100 text-eco-800"
                          >
                            {MATERIAL_LABELS[m]}
                          </span>
                        ))}
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary mt-2 w-full !py-2"
                      >
                        <Navigation className="h-4 w-4" /> Como chegar
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPoints.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState message="Nenhum ecoponto encontrado com os filtros atuais." />
            </div>
          ) : (
            filteredPoints.map((p) => (
              <div key={p.id} className="card p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-eco-950">{p.name}</h3>
                  {p.verified ? (
                    <span className="badge shrink-0 bg-eco-100 text-eco-700">
                      <CheckCircle2 className="h-3 w-3" /> Verificado
                    </span>
                  ) : (
                    <span className="badge shrink-0 bg-amber-100 text-amber-700">
                      Em validação
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500">{p.address}</p>
                <p className="mt-0.5 text-xs text-slate-400">Bairro: {p.neighborhood}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" /> {p.hours}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.acceptedMaterials.map((m) => (
                    <span key={m} className="badge bg-eco-50 text-eco-700">
                      {MATERIAL_LABELS[m]}
                    </span>
                  ))}
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary mt-4 w-full"
                >
                  <Navigation className="h-4 w-4" /> Como chegar
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}