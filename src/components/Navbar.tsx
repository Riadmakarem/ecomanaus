import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  MapPin,
  AlertTriangle,
  Recycle,
  Megaphone,
  Building2,
  GraduationCap,
  LayoutDashboard,
  User,
  Coins,
} from "lucide-react";
import { useEco } from "../context/EcoContext";
import { Logo } from "./Logo";

const links = [
  { to: "/mapa", label: "Mapa Sustentável", icon: MapPin },
  { to: "/denunciar", label: "Denúncia Ambiental", icon: AlertTriangle },
  { to: "/ecotroca", label: "EcoTroca", icon: Recycle },
  { to: "/campanhas", label: "Campanhas", icon: Megaphone },
  { to: "/bairros", label: "Bairros", icon: Building2 },
  { to: "/escolas", label: "Escolas", icon: GraduationCap },
  { to: "/empresas", label: "Empresas", icon: LayoutDashboard },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser } = useEco();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <header
        className={`glass container-page flex h-16 max-w-7xl items-center justify-between gap-4 rounded-full border border-white/60 px-4 transition-shadow duration-300 sm:px-6 ${
          scrolled ? "shadow-[0_8px_30px_-10px_rgb(6_44_31_/_0.25)]" : "shadow-none"
        }`}
      >
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold transition ${
                  isActive
                    ? "bg-eco-600 text-white shadow-soft"
                    : "text-eco-900/70 hover:bg-eco-950/5 hover:text-eco-900"
                }`
              }
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <span className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-clay-500 to-clay-400 px-3.5 py-2 text-sm font-bold text-white shadow-soft sm:flex">
            <Coins className="h-4 w-4" />
            {currentUser.points.toLocaleString("pt-BR")}
          </span>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-eco-900/10 bg-white text-eco-800 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {open && (
        <nav className="glass container-page mt-2 max-w-7xl rounded-3xl border border-white/60 p-3 shadow-[0_8px_30px_-10px_rgb(6_44_31_/_0.25)] lg:hidden">
          <div className="mb-2 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-clay-500 to-clay-400 px-3.5 py-2.5 text-sm font-bold text-white">
            <Coins className="h-4 w-4" />
            {currentUser.points.toLocaleString("pt-BR")} EcoPontos
          </div>
          <div className="grid grid-cols-1 gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-eco-600 text-white"
                      : "text-eco-900/70 hover:bg-eco-50"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
