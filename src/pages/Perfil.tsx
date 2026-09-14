import {
  User,
  Coins,
  Shield,
  TreePine,
  Recycle,
  Trophy,
  Award,
  MapPin,
} from "lucide-react";
import { PageHeader } from "../components/ui";
import { useEco } from "../context/EcoContext";

const badges = [
  { name: "Guardião do Igarapé", icon: Shield, earned: true },
  { name: "Protetor da Amazônia", icon: TreePine, earned: true },
  { name: "Mestre da Reciclagem", icon: Recycle, earned: false },
];

function badgeLevel(points: number) {
  if (points < 100) return { label: "Semente", emoji: "🌱" };
  if (points < 300) return { label: "Broto Verdescente", emoji: "🌿" };
  if (points < 700) return { label: "Guardião da Floresta", emoji: "🌳" };
  return { label: "Protetor Amazônico", emoji: "🌎" };
}

export function Perfil() {
  const { currentUser } = useEco();
  const level = badgeLevel(currentUser.points);
  const nextLevel = currentUser.points < 100 ? 100 : currentUser.points < 300 ? 300 : currentUser.points < 700 ? 700 : currentUser.points;
  const progress = Math.min(100, Math.round((currentUser.points / nextLevel) * 100));

  return (
    <div>
      <PageHeader
        icon={<User className="h-6 w-6" />}
        title="Meu Perfil"
        subtitle="Acompanhe seus EcoPontos, conquistas e nível ambiental."
      />

      <div className="container-page mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-eco-600 text-2xl font-extrabold text-white">
            {currentUser.initials}
          </span>
          <h2 className="mt-4 text-xl font-bold text-eco-950">
            {currentUser.fullName}
          </h2>
          <p className="mt-1 flex items-center justify-center gap-1 text-sm text-slate-500">
            <MapPin className="h-4 w-4 text-eco-600" /> Bairro {currentUser.neighborhood}
          </p>
          <div className="mt-4 rounded-xl bg-gradient-to-r from-eco-50 to-clay-50 p-4">
            <p className="font-display text-3xl font-extrabold text-eco-700">
              {currentUser.points.toLocaleString("pt-BR")}
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
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-eco-950">
              <Trophy className="h-5 w-5 text-clay-500" /> Conquistas
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {badges.map((b) => (
                <div
                  key={b.name}
                  className={`rounded-xl p-4 text-center ${
                    b.earned
                      ? "bg-eco-50 ring-1 ring-eco-200"
                      : "bg-slate-50 opacity-50"
                  }`}
                >
                  <b.icon
                    className={`mx-auto h-8 w-8 ${
                      b.earned ? "text-eco-600" : "text-slate-400"
                    }`}
                  />
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {b.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {b.earned ? "Desbloqueada" : "Bloqueada"}
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