import { CheckCircle2 } from "lucide-react";
import { useEco } from "../context/EcoContext";

export function Toasts() {
  const { toasts } = useEco();
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[1000] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="status-enter pointer-events-auto flex items-center gap-2 rounded-xl border border-eco-200 bg-white px-4 py-3 text-sm font-semibold text-eco-900 shadow-glow"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-eco-500" />
          {t.message}
        </div>
      ))}
    </div>
  );
}
