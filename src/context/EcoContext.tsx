import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Campaign,
  EcoTrocaItem,
  EnvironmentalReport,
  Profile,
} from "../types";
import {
  campaigns as seedCampaigns,
  ecotrocaItems as seedItems,
  initialReports,
} from "../data/mockData";

interface EcoContextValue {
  currentUser: Profile;
  addPoints: (amount: number, reason: string) => void;
  reports: EnvironmentalReport[];
  addReport: (report: EnvironmentalReport) => void;
  advanceReportStatus: (id: string) => void;
  items: EcoTrocaItem[];
  reserveItem: (id: string) => void;
  campaigns: Campaign[];
  joinCampaign: (id: string) => void;
  joinedCampaigns: string[];
  toasts: { id: number; message: string }[];
  notify: (message: string) => void;
}

const EcoContext = createContext<EcoContextValue | null>(null);

const seedUser: Profile = {
  id: "u1",
  fullName: "Sofia Amazonense",
  initials: "SA",
  role: "citizen",
  neighborhood: "Adrianópolis",
  points: 350,
};

let toastId = 0;

export function EcoProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile>(seedUser);
  const [reports, setReports] = useState<EnvironmentalReport[]>(initialReports);
  const [items, setItems] = useState<EcoTrocaItem[]>(seedItems);
  const [campaigns] = useState<Campaign[]>(seedCampaigns);
  const [joinedCampaigns, setJoinedCampaigns] = useState<string[]>([]);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  const notify = useCallback((message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const addPoints = useCallback(
    (amount: number, reason: string) => {
      setCurrentUser((u) => ({ ...u, points: u.points + amount }));
      notify(
        `+${amount} EcoPontos · ${reason}`
      );
    },
    [notify],
  );

  const addReport = useCallback(
    (report: EnvironmentalReport) => {
      setReports((prev) => [report, ...prev]);
      addPoints(20, "Denúncia ambiental registrada");
    },
    [addPoints],
  );

  const advanceReportStatus = useCallback(
    (id: string) => {
      setReports((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const order = ["Reportado", "Em Análise", "Encaminhado", "Resolvido"];
          const idx = order.indexOf(r.status);
          const next = order[Math.min(idx + 1, order.length - 1)];
          return {
            ...r,
            status: next as EnvironmentalReport["status"],
            resolvedAt: next === "Resolvido" ? new Date().toISOString() : r.resolvedAt,
          };
        }),
      );
    },
    [],
  );

  const reserveItem = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "reservado" } : i)),
      );
      notify("Item reservado! O doador foi notificado para contato.");
    },
    [notify],
  );

  const joinCampaign = useCallback(
    (id: string) => {
      setJoinedCampaigns((prev) =>
        prev.includes(id) ? prev : [...prev, id],
      );
      addPoints(100, "Participação em campanha ambiental");
    },
    [addPoints],
  );

  const value = useMemo(
    () => ({
      currentUser,
      addPoints,
      reports,
      addReport,
      advanceReportStatus,
      items,
      reserveItem,
      campaigns,
      joinCampaign,
      joinedCampaigns,
      toasts,
      notify,
    }),
    [
      currentUser,
      addPoints,
      reports,
      addReport,
      advanceReportStatus,
      items,
      reserveItem,
      campaigns,
      joinCampaign,
      joinedCampaigns,
      toasts,
      notify,
    ],
  );

  return <EcoContext.Provider value={value}>{children}</EcoContext.Provider>;
}

export function useEco() {
  const ctx = useContext(EcoContext);
  if (!ctx) throw new Error("useEco deve ser usado dentro de EcoProvider");
  return ctx;
}