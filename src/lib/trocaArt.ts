import type { TrocaCategory } from "../types";

// Arte local gerada como SVG (data URI). Não depende de rede, então
// a imagem sempre carrega — sem ícone de imagem quebrada.

type ArtTheme = {
  from: string;
  to: string;
  // caminho/ícone desenhado no centro do card
  icon: string;
};

const THEMES: Record<TrocaCategory, ArtTheme> = {
  moveis: {
    from: "#34d399",
    to: "#059669",
    // sofá
    icon: `<path d="M40 86h120v26H40z" fill="#ffffff" opacity="0.95"/>
           <path d="M46 56c0-8 6-14 14-14h80c8 0 14 6 14 14v18H46z" fill="#ffffff" opacity="0.95"/>
           <rect x="34" y="60" width="22" height="34" rx="8" fill="#ffffff" opacity="0.95"/>
           <rect x="144" y="60" width="22" height="34" rx="8" fill="#ffffff" opacity="0.95"/>
           <rect x="50" y="108" width="10" height="16" fill="#ffffff" opacity="0.8"/>
           <rect x="140" y="108" width="10" height="16" fill="#ffffff" opacity="0.8"/>`,
  },
  eletronicos: {
    from: "#38bdf8",
    to: "#2563eb",
    // notebook
    icon: `<path d="M58 48h84a6 6 0 0 1 6 6v46H52V54a6 6 0 0 1 6-6z" fill="#ffffff" opacity="0.95"/>
           <rect x="62" y="56" width="76" height="38" rx="3" fill="#0ea5e9" opacity="0.5"/>
           <path d="M40 104h120l8 14a6 6 0 0 1-5 9H37a6 6 0 0 1-5-9z" fill="#ffffff" opacity="0.95"/>`,
  },
  livros: {
    from: "#fbbf24",
    to: "#d97706",
    // livros empilhados
    icon: `<rect x="56" y="54" width="88" height="20" rx="4" fill="#ffffff" opacity="0.95"/>
           <rect x="48" y="78" width="104" height="20" rx="4" fill="#ffffff" opacity="0.9"/>
           <rect x="60" y="102" width="80" height="20" rx="4" fill="#ffffff" opacity="0.85"/>
           <rect x="64" y="58" width="6" height="12" fill="#d97706" opacity="0.6"/>
           <rect x="56" y="82" width="6" height="12" fill="#d97706" opacity="0.6"/>`,
  },
  roupas: {
    from: "#f472b6",
    to: "#db2777",
    // camiseta
    icon: `<path d="M80 46l20 10 20-10 30 16-12 22-14-6v46H76V78l-14 6-12-22z" fill="#ffffff" opacity="0.95"/>`,
  },
  materiais_escolares: {
    from: "#a78bfa",
    to: "#7c3aed",
    // mochila
    icon: `<path d="M68 60c0-14 12-22 32-22s32 8 32 22v58a8 8 0 0 1-8 8H76a8 8 0 0 1-8-8z" fill="#ffffff" opacity="0.95"/>
           <path d="M84 60c0-8 6-12 16-12s16 4 16 12" fill="none" stroke="#7c3aed" stroke-width="4" opacity="0.5"/>
           <rect x="82" y="86" width="36" height="24" rx="5" fill="#7c3aed" opacity="0.35"/>`,
  },
  outros: {
    from: "#2dd4bf",
    to: "#0d9488",
    // caixa / reciclagem
    icon: `<path d="M60 70l40-20 40 20-40 20z" fill="#ffffff" opacity="0.95"/>
           <path d="M60 70v38l40 20V90z" fill="#ffffff" opacity="0.8"/>
           <path d="M140 70v38l-40 20V90z" fill="#ffffff" opacity="0.65"/>`,
  },
};

function buildSvg(theme: ArtTheme, seed: number): string {
  const rot = (seed % 7) * 3 - 9;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="176" viewBox="0 0 200 160">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${theme.from}"/>
      <stop offset="1" stop-color="${theme.to}"/>
    </linearGradient>
  </defs>
  <rect width="200" height="160" fill="url(#g)"/>
  <circle cx="30" cy="28" r="42" fill="#ffffff" opacity="0.08"/>
  <circle cx="178" cy="140" r="54" fill="#ffffff" opacity="0.08"/>
  <g transform="rotate(${rot} 100 85)">${theme.icon}</g>
</svg>`;
}

function toDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Arte determinística por categoria para um item do EcoTroca. */
export function trocaArt(category: TrocaCategory, seed = 0): string {
  const theme = THEMES[category] ?? THEMES.outros;
  return toDataUri(buildSvg(theme, seed));
}
