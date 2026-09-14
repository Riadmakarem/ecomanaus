import { Leaf } from "lucide-react";

/**
 * Marca EcoManaus — selo em gradiente com folha, acompanhado do wordmark.
 * `tone="dark"` é usado sobre fundos claros (navbar); `tone="light"` sobre fundos escuros (footer/hero).
 */
export function Logo({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-400 to-eco-700 text-white shadow-soft">
        <Leaf className="h-5 w-5" strokeWidth={2.25} />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-clay-400 ring-2 ring-white" />
      </span>
      <span
        className={`font-display text-lg font-bold leading-none tracking-tight ${
          tone === "dark" ? "text-eco-950" : "text-white"
        }`}
      >
        Eco<span className="text-eco-500">Manaus</span>
      </span>
    </span>
  );
}
