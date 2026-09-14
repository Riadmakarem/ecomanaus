import type { MaterialCategory } from "../types";

type KeywordRule = {
  keywords: string[];
  materials: MaterialCategory[];
};

const RULES: KeywordRule[] = [
  {
    keywords: ["bateria", "pilha", "celular", "notebook", "computador", "tablet", "eletrodoméstico", "eletronico", "tv", "telefone", "carregador", "fone"],
    materials: ["eletronicos", "pilhas"],
  },
  {
    keywords: ["óleo", "oleo", "cozinha", "fritura", "azeite"],
    materials: ["oleo"],
  },
  {
    keywords: ["pet", "garrafa", "plástico", "plastico", "papel", "jornal", "papelão", "reciclavel", "lata", "alumínio", "aluminio"],
    materials: ["pet", "reciclagem"],
  },
  {
    keywords: ["medicamento", "remédio", "remedio", "farmácia", "bula", "vencido"],
    materials: ["medicamentos"],
  },
  {
    keywords: ["roupa", "vestido", "camisa", "calçado", "sapato", "tecido", "tênis", "tenis"],
    materials: ["roupas"],
  },
  {
    keywords: ["doação", "doacao", "móvel", "moveis", "livro", "brinquedo", "item", "quero doar"],
    materials: ["doacoes", "reciclagem"],
  },
  {
    keywords: ["lixo", "entulho", "resto", "orgânico", "organico", "comida", "sobra"],
    materials: ["organico", "reciclagem"],
  },
];

export function matchMaterials(query: string): MaterialCategory[] {
  const q = query.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (!q) return [];
  const matched = new Set<MaterialCategory>();
  for (const rule of RULES) {
    if (
      rule.materials.includes("reciclagem")
        ? rule.keywords.some((k) => q.includes(k))
        : rule.keywords.some((k) => q === k || q.includes(k))
    ) {
      rule.materials.forEach((m) => matched.add(m));
    }
  }
  return Array.from(matched);
}

export function describeMatch(query: string): string {
  const materials = matchMaterials(query);
  if (materials.length === 0) return "";
  const words: Record<MaterialCategory, string> = {
    reciclagem: "recicláveis",
    eletronicos: "eletrônicos",
    oleo: "óleo de cozinha",
    pilhas: "pilhas/baterias",
    pet: "PET, papel e latinhas",
    medicamentos: "medicamentos",
    roupas: "roupas",
    doacoes: "itens para doação",
    organico: "orgânicos",
  };
  return materials.map((m) => words[m]).join(", ");
}