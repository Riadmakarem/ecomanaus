import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-eco-950">
      <div className="absolute -left-10 -top-16 h-56 w-56 rounded-full bg-eco-500/20 blur-3xl" />
      <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-clay-500/15 blur-3xl" />
      <div className="paper-grain absolute inset-0 opacity-20" />
      <div className="container-page relative flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:py-12">
        <div className="flex items-start gap-4">
          {icon && (
            <span className="icon-tile mt-0.5 h-[52px] w-[52px] bg-white/10 text-eco-200 backdrop-blur">
              {icon}
            </span>
          )}
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-eco-100/70">{subtitle}</p>
          </div>
        </div>
        {children && <div className="flex flex-wrap gap-2">{children}</div>}
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
}) {
  return (
    <div className="card card-hover flex items-center gap-4 p-5">
      <span className="icon-tile h-12 w-12 bg-eco-100 text-eco-700">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-display text-2xl font-extrabold tracking-tight text-eco-950">
          {value}
        </p>
        <p className="truncate text-sm font-medium text-slate-500">{label}</p>
        {hint && <p className="text-xs font-semibold text-clay-600">{hint}</p>}
      </div>
    </div>
  );
}

export function ProgressBar({
  value,
  max,
  color = "bg-eco-500",
}: {
  value: number;
  max: number;
  color?: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-eco-100/70">
      <div
        className={`h-full rounded-full ${color} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function CategoryPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
        active
          ? "border-eco-600 bg-eco-600 text-white shadow-soft"
          : "border-eco-200 bg-white text-eco-700 hover:-translate-y-0.5 hover:border-eco-300 hover:bg-eco-50"
      }`}
    >
      {children}
    </button>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="card flex flex-col items-center gap-3 p-12 text-center">
      <span className="icon-tile h-14 w-14 bg-eco-100 text-2xl">🌱</span>
      <p className="font-medium text-slate-500">{message}</p>
    </div>
  );
}
