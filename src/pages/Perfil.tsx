import { useState } from "react";
import {
  User,
  Coins,
  Shield,
  TreePine,
  Recycle,
  Trophy,
  Award,
  MapPin,
  Mail,
  Pencil,
  Check,
  X,
  BadgeCheck,
} from "lucide-react";
import { PageHeader } from "../components/ui";
import { useEco } from "../context/EcoContext";
import { useAuth } from "../context/AuthContext";
import { NEIGHBORHOODS } from "../types";
import type { Role } from "../types";

const ROLE_LABELS: Record<Role, string> = {
  citizen: "Cidadão(ã)",
  school: "Escola",
  company: "Empresa",
  admin: "Administrador(a)",
};

/* Níveis com base nos EcoPontos reais */
const LEVELS = [
  { threshold: 0, label: "Semente", emoji: "🌱" },
  { threshold: 100, label: "Broto Verdescente", emoji: "🌿" },
  { threshold: 300, label: "Guardião da Floresta", emoji: "🌳" },
  { threshold: 700, label: "Protetor Amazônico", emoji: "🌎" },
];

function levelInfo(points: number) {
  let current = LEVELS[0];
  let next: (typeof LEVELS)[number] | null = null;
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].threshold) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? null;
    }
  }
  const floor = current.threshold;
  const ceil = next ? next.threshold : current.threshold;
  const progress = next
    ? Math.min(100, Math.round(((points - floor) / (ceil - floor)) * 100))
    : 100;
  return { current, next, progress };
}

/* Conquistas derivadas dos pontos reais */
function achievements(points: number) {
  return [
    {
      name: "Guardião do Igarapé",
      icon: Shield,
      earned: points >= 20,
      hint: "20+ EcoPontos",
    },
    {
      name: "Protetor da Amazônia",
      icon: TreePine,
      earned: points >= 100,
      hint: "100+ EcoPontos",
    },
    {
      name: "Mestre da Reciclagem",
      icon: Recycle,
      earned: points >= 300,
      hint: "300+ EcoPontos",
    },
  ];
}

export function Perfil() {
  const { currentUser } = useEco();
  const { profile, updateUserProfile } = useAuth();

  const points = currentUser.points;
  const { current: level, next, progress } = levelInfo(points);
  const badges = achievements(points);

  /* Edição de perfil */
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [neighborhood, setNeighborhood] = useState(currentUser.neighborhood);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const startEdit = () => {
    setFullName(currentUser.fullName);
    setNeighborhood(currentUser.neighborhood);
    setError("");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError("O nome não pode ficar vazio.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updateUserProfile({
        fullName: fullName.trim(),
        neighborhood,
      });
      setEditing(false);
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={<User className="h-6 w-6" />}
        title="Meu Perfil"
        subtitle="Acompanhe seus EcoPontos, conquistas e nível ambiental."
      />

      <div className="container-page mt-6 grid gap-6 lg:grid-cols-3">
        {/* Card do usuário */}
        <div className="card p-6 text-center">
          <div className="relative">
            {profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt={currentUser.fullName}
                referrerPolicy="no-referrer"
                className="mx-auto h-20 w-20 rounded-full border-2 border-eco-200 object-cover"
              />
            ) : (
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-eco-600 text-2xl font-extrabold text-white">
                {currentUser.initials}
              </span>
            )}
            {!editing && (
              <button
                onClick={startEdit}
                title="Editar perfil"
                className="absolute right-1/2 top-0 translate-x-10 rounded-full border border-slate-200 bg-white p-1.5 text-eco-700 shadow-soft transition hover:bg-eco-50"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {editing ? (
            <div className="mt-4 space-y-3 text-left">
              {error && (
                <div className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Bairro
                </label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20"
                >
                  {NEIGHBORHOODS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-eco-600 py-2 text-sm font-bold text-white transition hover:bg-eco-700 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {saving ? "Salvando..." : "Salvar"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  disabled={saving}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="mt-4 text-xl font-bold text-eco-950">
                {currentUser.fullName}
              </h2>
              {profile?.email && (
                <p className="mt-1 flex items-center justify-center gap-1 text-sm text-slate-500">
                  <Mail className="h-4 w-4 text-eco-600" /> {profile.email}
                </p>
              )}
              <p className="mt-1 flex items-center justify-center gap-1 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-eco-600" /> Bairro{" "}
                {currentUser.neighborhood}
              </p>
              <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-eco-50 px-3 py-1 text-xs font-semibold text-eco-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                {ROLE_LABELS[currentUser.role]}
              </p>
            </>
          )}

          <div className="mt-4 rounded-xl bg-gradient-to-r from-eco-50 to-clay-50 p-4">
            <p className="font-display text-3xl font-extrabold text-eco-700">
              {points.toLocaleString("pt-BR")}
            </p>
            <p className="flex items-center justify-center gap-1 text-sm font-medium text-clay-600">
              <Coins className="h-4 w-4" /> EcoPontos
            </p>
          </div>

          <p className="mt-4 text-sm font-bold text-eco-700">
            Nível: {level.emoji} {level.label}
          </p>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-eco-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            {next
              ? `${(next.threshold - points).toLocaleString("pt-BR")} EcoPontos para ${next.emoji} ${next.label}`
              : "Nível máximo alcançado! 🎉"}
          </p>
        </div>

        {/* Conquistas e dicas */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-eco-950">
              <Trophy className="h-5 w-5 text-clay-500" /> Conquistas
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {badges.map((b) => (
                <div
                  key={b.name}
                  className={`rounded-xl p-4 text-center ${b.earned
                      ? "bg-eco-50 ring-1 ring-eco-200"
                      : "bg-slate-50 opacity-50"
                    }`}
                >
                  <b.icon
                    className={`mx-auto h-8 w-8 ${b.earned ? "text-eco-600" : "text-slate-400"
                      }`}
                  />
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {b.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {b.earned ? "Desbloqueada" : b.hint}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-eco-950">
              <Award className="h-5 w-5 text-eco-600" /> Como ganhar EcoPontos
            </h3>
            <ul className="mt-4 divide-y divide-slate-100">
              {[
                ["♻️", "Descarte confirmado em ecoponto", "+50 pts"],
                ["⛑️", "Denúncia ambiental válida", "+20 pts"],
                ["🎁", "Item doado no EcoTroca", "+40 pts"],
                ["📍", "Indicação de novo ecoponto", "+30 pts"],
                ["🌳", "Participação em campanha", "+100 pts"],
              ].map(([emoji, label, pts]) => (
                <li key={label as string} className="flex items-center gap-3 py-3">
                  <span className="text-xl">{emoji}</span>
                  <span className="flex-1 text-sm font-medium text-slate-700">
                    {label}
                  </span>
                  <span className="badge bg-eco-100 text-eco-700">{pts}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
