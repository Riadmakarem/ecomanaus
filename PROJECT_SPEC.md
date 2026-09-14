# 🌿 EcoManaus — Especificação Técnica & Guia de Desenvolvimento com IA (PRD)

> **Documento Estruturado para Agentes de Código e Ferramentas de IA**  
> *Este documento foi formatado especialmente para ser fornecido como contexto/instrução completa para ferramentas de geração de código via IA (como Cursor, Lovable, Bolt, Windsurf ou Claude Code).*

---

## 📌 1. Visão Geral do Produto (Product Overview)

* **Nome do Projeto:** EcoManaus — Plataforma Integrada de Sustentabilidade Urbana
* **Localização Foco:** Cidade de Manaus / AM (adaptável para o contexto amazônico e igarapés)
* **Propósito:** Conectar a população, escolas, empresas e poder público para impulsionar a reciclagem, combate ao descarte irregular de lixo, economia circular, campanhas socioambientais e transparência de indicadores locais.
* **Usuários-Alvo:**
  1. **Cidadãos:** Encontrar ecopontos, reportar problemas ambientais, doar/trocar itens, acumular pontos.
  2. **Escolas:** Promover gincanas ambientais, engajar turmas e acompanhar ranking educativo.
  3. **Empresas (ESG):** Patrocinar campanhas, gerenciar ecopontos próprios e gerar relatórios de impacto ESG.
  4. **Administradores / Gestão:** Monitorar denúncias por bairro, validar pontos e publicar campanhas.

---

## 🏗️ 2. Arquitetura do Sistema & Stack Tecnológica Recomendada

Para um desenvolvimento rápido e escalável via ferramentas de IA, recomenda-se a seguinte stack:

* **Frontend:**
  * **Framework:** React 18+ com TypeScript (Vite ou Next.js 14+ App Router).
  * **Estilização:** Tailwind CSS + Shadcn/UI + Lucide Icons.
  * **Mapas & Geo:** Leaflet.js / React-Leaflet ou Mapbox GL (integrado com dados OpenStreetMap de Manaus).
* **Backend & Banco de Dados (BaaS):**
  * **Supabase / Firebase:** PostgreSQL com extensão `postgis` ativada para consultas de proximidade geográfica.
  * **Autenticação:** Supabase Auth (Email/Senha, Google OAuth, perfis diferenciados: Cidadão, Escola, Empresa, Admin).
  * **Storage:** Supabase Storage para fotos de denúncias, itens do EcoTroca e logotipos.
* **Módulos de Inteligência Artificial (Integrações API):**
  * **Visão Computacional (OpenAI Vision / Gemini Vision API):** Análise automática de fotos em denúncias (identificação de lixo em igarapés, queimadas, descarte irregular) para pré-classificação e triagem.
  * **Busca Semântica de Materiais:** Assistente/LLM para identificar a qual categoria pertence um item digitado (ex: "bateria de notebook antiga" -> *Ecoponto de Eletrônicos / Pilhas*).

---

## 🗄️ 3. Modelo de Dados Relacional (PostgreSQL Schema)

```sql
-- Habilitar extensão para geolocalização
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Tabela de Perfis de Usuários
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('citizen', 'school', 'company', 'admin')) DEFAULT 'citizen',
  neighborhood TEXT, -- Bairro de Manaus (ex: Cidade Nova, Compensa, Flores)
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Pontos de Coleta e Reciclagem
CREATE TABLE collection_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  accepted_materials TEXT[], -- ['eletronicos', 'oleo', 'pilhas', 'pet', 'medicamentos', 'roupas']
  managed_by_company_id UUID REFERENCES profiles(id),
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Denúncias Ambientais Colaborativas
CREATE TABLE environmental_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('lixo_irregular', 'igarape', 'queimada', 'esgoto', 'poluicao', 'alagamento')),
  description TEXT,
  photo_url TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  status TEXT CHECK (status IN ('Reportado', 'Em Análise', 'Encaminhado', 'Resolvido')) DEFAULT 'Reportado',
  ai_verification_notes TEXT, -- Retorno da análise de imagem por IA
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 4. EcoTroca (Itens para Doação / Reaproveitamento)
CREATE TABLE ecotroca_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('moveis', 'eletronicos', 'livros', 'roupas', 'materiais_escolares', 'outros')),
  description TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  status TEXT CHECK (status IN ('disponivel', 'reservado', 'doado')) DEFAULT 'disponivel',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Campanhas Ambientais
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  organizer_name TEXT NOT NULL, -- Escola, Empresa ou ONG
  category TEXT CHECK (category IN ('coleta_eletronicos', 'mutirao_limpeza', 'plantio_arvores', 'outros')),
  description TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  goal_metric TEXT, -- Ex: "1000 kg", "50 mudas"
  current_progress NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Módulo Escolar - Turmas e Rankings
CREATE TABLE school_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL, -- Ex: "Turma 1A", "Turma 2A"
  kg_recycled NUMERIC DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Log de Pontuação e Gamificação
CREATE TABLE gamification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'descarte_correto', 'participou_campanha', 'doou_item', 'denuncia_valida'
  points_earned INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 💻 4. Módulos Funcionais e Telas (Detalhamento de Requisitos)

### Módulo 1: Mapa Sustentável de Manaus & Busca por Material
* **Tela Principal (`/mapa`):**
  * Mapa interativo com marcadores coloridos por tipo de ecoponto.
  * **Filtros Rápidos:** Reciclagem geral, Ecopontos, Eletrônicos, Óleo de Cozinha, Pilhas/Baterias, Roupas, Medicamentos, Doações.
  * **Barra de Busca por Material:** Permite ao usuário buscar termos como `"bateria"`, `"notebook"`, `"óleo de cozinha"`, `"garrafa PET"`. O sistema destaca no mapa os ecopontos mais próximos que aceitam o item selecionado.
  * Card de detalhe do ecoponto (endereço, bairro, horários de funcionamento, distância do usuário).

### Módulo 2: Denúncia Ambiental Colaborativa (com Validação IA)
* **Tela de Registro (`/denunciar`):**
  * Formulário de envio rápido: Foto do problema, Categoria (*Lixo irregular, Descarte em igarapé, Queimadas, Esgoto a céu aberto, Poluição, Ponto de alagamento*), Seleção automática de GPS e Bairro de Manaus.
  * **Integração com IA (Vision API):** Ao enviar a foto, a IA analisa o conteúdo visual e adiciona uma tag indicativa (ex: `"Confirmada presença de resíduos sólidos em igarapé"`).
* **Acompanhamento de Status (`/denuncias`):**
  * Timeline de progresso visual do chamado: `Reportado` ➔ `Em Análise` ➔ `Encaminhado` ➔ `Resolvido` (com atualização de foto/data quando resolvido).

### Módulo 3: EcoTroca (Economia Circular e Doações)
* **Tela do Marketplace (`/ecotroca`):**
  * Feed visual estilo vitrine de itens para doação ou troca (*Móveis, Eletrônicos, Livros, Roupas, Materiais Escolares*).
  * Filtro por bairro de Manaus para facilitar a retirada presencial.
  * Botão "Quero este item" que abre modal de contato com o doador.
  * Confirmação da doação pelo doador, concedendo +40 EcoPontos para quem doou.

### Módulo 4: Campanhas Ambientais & Ações Comunitárias
* **Tela de Campanhas (`/campanhas`):**
  * Lista de eventos cadastrados por ONGs, Escolas e Empresas (ex: Mutirão de limpeza do Igarapé do Mindu, Coleta Seletiva de Eletrônicos no Centro).
  * Botão de inscrição e check-in no evento para marcar presença e pontuar.

### Módulo 5: Engine de Gamificação & Pontuação
* **Regra de Negócio de EcoPontos:**
  * Descarte confirmado em ponto de coleta: **+50 pts**
  * Denúncia ambiental válida reportada: **+20 pts**
  * Item doado no EcoTroca: **+40 pts**
  * Indicação de novo ecoponto: **+30 pts**
  * Participação em campanha ambiental: **+100 pts**
* **Conquistas/Badges:** *"Guardião do Igarapé"*, *"Protetor da Amazônia"*, *"Mestre da Reciclagem"*.
* Ranking comunitário de usuários e bairros mais engajados.

### Módulo 6: Dashboards de Impacto Mensurável e Visão por Bairro
* **Métricas Gerais da Cidade (EcoManaus Impacto):**
  * Total de kg de materiais destinados corretamente (ex: `2.340 kg`).
  * Total de itens reaproveitados (ex: `486 itens`).
  * Total de ações ambientais realizadas (ex: `27 ações`).
  * Usuários participantes (ex: `1.842 usuários`).
  * Denúncias ambientais cadastradas (ex: `73 denúncias`).
* **Dashboard por Bairro (`/bairros`):**
  * Visualização comparativa dos bairros de Manaus (ex: *Cidade Nova*, *Compensa*, *Adrianópolis*, *Flores*).
  * Exemplo de card por bairro:
    * **Cidade Nova**
    * Pontos de reciclagem: 14
    * Problemas ambientais: 27
    * Campanhas ativas: 3
    * Itens disponíveis para doação: 42
    * **Índice EcoManaus:** 72/100

### Módulo 7: Módulo Educacional e Área para Escolas
* **Perfil de Escola (`/escola/:id`):**
  * Exibição da quantidade reciclada pela instituição, campanhas ativas e alunos participantes.
  * **Ranking entre Turmas (Desafio do Mês):**
    * Exemplo: *Desafio do mês: Colete 100 kg de recicláveis*
    * `1º Lugar: Turma 1A` — 82 kg
    * `2º Lugar: Turma 2A` — 61 kg
    * `3º Lugar: Turma 3A` — 43 kg
  * Seção de pílulas educativas e artigos sobre reciclagem, descarte consciente e ecossistema de Manaus.

### Módulo 8: Módulo Empresarial (ESG & Patrocínio B2B)
* **Portal de Empresas (`/empresa`):**
  * Cadastro de ecopontos próprios e patrocínio de campanhas comunitárias.
  * Geração automática de relatórios de impacto ambiental para conformidade ESG.
  * Exemplo de destaque público: *"Empresa X arrecadou 1,2 tonelada de eletrônicos em Manaus em 2026"*.

---

## 🤖 5. Prompts Prontos para Gerar o Código com Ferramentas de IA

Copie e cole os prompts abaixo na sua ferramenta de IA (Cursor, Lovable, Bolt, GPT Engineer) em sequência:

### 🔹 PROMPT 1 — Estrutura Inicial e UI/Layout
```text
Crie uma aplicação web moderna em React com TypeScript, Tailwind CSS e Lucide Icons chamada "EcoManaus" - Plataforma de Sustentabilidade Urbana para a cidade de Manaus/AM.
A interface deve ser verde, sustentável, moderna e limpa.
Crie um Layout principal com Navbar contendo:
- Logo "EcoManaus" com ícone de folha/reciclagem
- Links de Navegação: Mapa Sustentável, Denúncia Ambiental, EcoTroca, Campanhas, Bairros, Escolas, Empresas e Perfil.
- Resumo de Pontos do Usuário (ex: 350 EcoPontos).
Crie também uma Home Hero destacando as métricas de impacto da cidade:
- 2.340 kg de materiais destinados
- 486 itens reaproveitados
- 27 ações ambientais realizadas
- 1.842 usuários ativos
- 73 denúncias registradas
```

### 🔹 PROMPT 2 — Módulo do Mapa Sustentável e Busca por Material
```text
Implemente a tela `/mapa` do EcoManaus com um mapa interativo usando React-Leaflet.
Adicione botões de filtro rápido por tipo de material: Reciclagem Geral, Ecopontos, Eletrônicos, Óleo de Cozinha, Pilhas/Baterias, Roupas, Medicamentos e Doações.
Adicione um input de busca por material onde o usuário digita algo como "notebook", "bateria", "óleo de cozinha" ou "garrafa PET" e o mapa filtra e exibe apenas os pontos que recolhem aquele item em bairros de Manaus (ex: Cidade Nova, Compensa, Adrianópolis, Flores).
Ao clicar em um marcador do mapa, abra um Card com nome do ecoponto, endereço, materiais aceitos e botão "Como Chegar".
```

### 🔹 PROMPT 3 — Módulo de Denúncia Ambiental Colaborativa com Status
```text
Crie a tela `/denunciar` e a tela `/denuncias` para o EcoManaus.
Na tela de criar denúncia:
- Upload de foto do problema ambiental.
- Seleção da Categoria: Descarte irregular, Lixo em Igarapé, Queimadas, Esgoto a céu aberto, Poluição, Ponto de alagamento.
- Input de endereço/bairro em Manaus e botão para capturar localização GPS.
- Descrição detalhada.
Na tela de listagem de denúncias:
- Cards exibindo a foto, categoria, bairro, data e um Badge de Status interativo: [Reportado] -> [Em Análise] -> [Encaminhado] -> [Resolvido].
- Simule uma chamada de IA que analisa a foto da denúncia e retorna um parecer automático sobre a gravidade do lixo/alagamento.
```

### 🔹 PROMPT 4 — EcoTroca, Campanhas, Módulo Escolar e Bairros
```text
Desenvolva os módulos adicionais para o EcoManaus:
1. EcoTroca (`/ecotroca`): Vitrine de doações/trocas de itens usados (móveis, eletrônicos, livros, roupas, materiais escolares) com botão para solicitar o item e filtro por bairro de Manaus.
2. Campanhas Ambientais (`/campanhas`): Lista de ações comunitárias (ex: Mutirão de limpeza de igarapé, Coleta de eletrônicos) com progresso de meta e botão "Inscrever-se".
3. Dashboard por Bairro (`/bairros`): Comparativo visual de bairros de Manaus (ex: Cidade Nova vs Compensa) mostrando pontos de reciclagem, denúncias ativas, itens para doação e o "Índice EcoManaus (0-100)".
4. Módulo para Escolas (`/escolas`): Lista de escolas com o "Desafio do Mês" e Ranking entre turmas (Turma 1A: 82kg, Turma 2A: 61kg, Turma 3A: 43kg).
```

---

## 🚀 6. Checklist de Execução do Projeto

- [x] **Passo 1:** Copiar o conteúdo deste arquivo MD para a pasta raiz do seu projeto de IA (`PROJECT_SPEC.md` ou `.cursorrules`).
- [ ] **Passo 2:** Configurar o banco de dados Supabase e rodar os scripts SQL da Seção 3.
- [x] **Passo 3:** MVP frontend construído com dados fictícios (todos os módulos da Seção 4 navegáveis via `bun run dev`).
- [ ] **Passo 4:** Conectar as chaves de API do Supabase e OpenAI/Gemini para a análise de fotos e geolocalização.
- [ ] **Passo 5:** Testar o fluxo completo em Manaus com dados fictícios e publicar o MVP.

---

## ⏳ 7. Status Atual & Pendências (Backlog)

> **Decisão:** O MVP está em execução **100% MOCK / offline — sem backend**. Tudo funciona
> com dados fictícios locais (`src/data/mockData.ts`) e estado em memória
> (`src/context/EcoContext.tsx`). Fibrações reais listadas abaixo permanecem **PENDENTES**.

### 🗄️ Integração de banco de dados (Supabase) — PENDENTE
- Criar projeto Supabase e habilitar a extensão `postgis`.
- Rodar o schema SQL da **Seção 3** (tabelas `profiles`, `collection_points`, `environmental_reports`, `ecotroca_items`, `campaigns`, `school_classes`, `gamification_logs`).
- Substituir `src/data/mockData.ts` por queries reais (RI-consultas de proximidade geográfica via PostGIS).
- Criar tabela `supabase-schema.sql` na raiz com o DDL para versionamento.

### 🔐 Autenticação (Supabase Auth) — PENDENTE
- Cadastro/login por email e senha + Google OAuth.
- Perfis diferenciados: Cidadão, Escola, Empresa e Admin (campo `role` em `profiles`).
- Storage do Supabase para fotos de denúncias, itens do EcoTroca e logotipos.

### 🤖 Integração com IA real (OpenAI Vision / Gemini Vision) — PENDENTE
- Hoje `/denunciar` simula o parecer de IA com texto estático (`AI_PARECER`).
- Ligar o upload da foto a uma API de visão computacional para classificação real.
- Busca semântica de materiais (`/mapa`) com assistente/LLM real no lugar do matcher por palavras-chave (`src/lib/materialMatcher.ts`).

### 🗺️ Dados geográficos oficiais — PENDENTE
- Pontos de coleta reais com coordenadas precisas de Manaus (tiles e localização aproximada hoje).

### 🧭 Roadmap de produto
- Ranking comunitário por bairro e usuários mais engajados (gamificação global).
- Relatórios ESG reais por empresa (`/empresas`).
- Notificações de status da denúncia e integração com órgãos públicos.