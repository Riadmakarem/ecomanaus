export type Role = "citizen" | "school" | "company" | "admin";

export type MaterialCategory =
  | "reciclagem"
  | "eletronicos"
  | "oleo"
  | "pilhas"
  | "pet"
  | "medicamentos"
  | "roupas"
  | "doacoes"
  | "organico";

export type ReportCategory =
  | "lixo_irregular"
  | "igarape"
  | "queimada"
  | "esgoto"
  | "poluicao"
  | "alagamento";

export type ReportStatus = "Reportado" | "Em Análise" | "Encaminhado" | "Resolvido";

export type TrocaCategory =
  | "moveis"
  | "eletronicos"
  | "livros"
  | "roupas"
  | "materiais_escolares"
  | "outros";

export type CampaignCategory =
  | "coleta_eletronicos"
  | "mutirao_limpeza"
  | "plantio_arvores"
  | "outros";

export interface Profile {
  id: string;
  fullName: string;
  initials: string;
  role: Role;
  neighborhood: string;
  points: number;
}

export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
  acceptedMaterials: MaterialCategory[];
  hours: string;
  verified: boolean;
}

export interface EnvironmentalReport {
  id: string;
  title: string;
  category: ReportCategory;
  description: string;
  photoUrl: string;
  neighborhood: string;
  status: ReportStatus;
  aiVerificationNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface EcoTrocaItem {
  id: string;
  title: string;
  category: TrocaCategory;
  description: string;
  photoUrl: string;
  neighborhood: string;
  donor: string;
  status: "disponivel" | "reservado" | "doado";
  createdAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  organizerName: string;
  organizerType: "ong" | "escola" | "empresa";
  category: CampaignCategory;
  description: string;
  neighborhood: string;
  startDate: string;
  endDate: string;
  goalLabel: string;
  currentProgress: number;
  goalMetric: string;
}

export interface SchoolClass {
  id: string;
  className: string;
  kgRecycled: number;
  studentsCount: number;
}

export interface School {
  id: string;
  name: string;
  neighborhood: string;
  kgRecycled: number;
  studentsParticipating: number;
  activeCampaigns: number;
  monthlyChallenge: string;
  classes: SchoolClass[];
}

export interface NeighborhoodData {
  name: string;
  recyclingPoints: number;
  environmentalIssues: number;
  activeCampaigns: number;
  donationItems: number;
  ecoIndex: number;
}

export const MATERIAL_LABELS: Record<MaterialCategory, string> = {
  reciclagem: "Reciclagem Geral",
  eletronicos: "Eletrônicos",
  oleo: "Óleo de Cozinha",
  pilhas: "Pilhas / Baterias",
  pet: "PET / Papel",
  medicamentos: "Medicamentos",
  roupas: "Roupas",
  doacoes: "Doações",
  organico: "Orgânico",
};

export const REPORT_LABELS: Record<ReportCategory, string> = {
  lixo_irregular: "Descarte irregular de lixo",
  igarape: "Lixo em igarapé",
  queimada: "Queimadas",
  esgoto: "Esgoto a céu aberto",
  poluicao: "Poluição",
  alagamento: "Ponto de alagamento",
};

export const REPORT_STATUS_FLOW: ReportStatus[] = [
  "Reportado",
  "Em Análise",
  "Encaminhado",
  "Resolvido",
];

export const TROCA_LABELS: Record<TrocaCategory, string> = {
  moveis: "Móveis",
  eletronicos: "Eletrônicos",
  livros: "Livros",
  roupas: "Roupas",
  materiais_escolares: "Materiais Escolares",
  outros: "Outros",
};

export const CAMPAIGN_LABELS: Record<CampaignCategory, string> = {
  coleta_eletronicos: "Coleta de Eletrônicos",
  mutirao_limpeza: "Mutirão de Limpeza",
  plantio_arvores: "Plantio de Árvores",
  outros: "Outros",
};

export const NEIGHBORHOODS = [
  "Cidade Nova",
  "Compensa",
  "Adrianópolis",
  "Flores",
  "Centro",
  "Aleixo",
  "Ponta Negra",
  "São Jorge",
  "Educandos",
  "Dom Pedro",
];