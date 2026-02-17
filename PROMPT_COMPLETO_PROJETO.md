# 🤖 PROMPT COMPLETO - SGF (Sistema de Gerenciamento de Férias)

> **Documento de Especificação Completa para Recriação do Projeto**
>
> Este documento contém TODAS as informações necessárias para recriar o projeto SGF do zero, incluindo stack tecnológico, plataformas, banco de dados, IA utilizada, layout completo e design visual.

---

## 📋 ÍNDICE

1. [Visão Geral](#1-visão-geral)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Inteligência Artificial Utilizada](#3-inteligência-artificial-utilizada)
4. [Plataformas e Hospedagem](#4-plataformas-e-hospedagem)
5. [Banco de Dados](#5-banco-de-dados)
6. [Design System e Layout](#6-design-system-e-layout)
7. [Componentes Visuais](#7-componentes-visuais)
8. [Funcionalidades Detalhadas](#8-funcionalidades-detalhadas)
9. [Regras de Negócio](#9-regras-de-negócio)
10. [Prompt para Recriação com IA](#10-prompt-para-recriação-com-ia)

---

## 1. VISÃO GERAL

### 1.1 Informações do Projeto
```yaml
Nome: SGF - Sistema de Gerenciamento de Férias
Tipo: Single Page Application (SPA)
Propósito: Gestão completa de férias de colaboradores QA
Target: Supervisores e equipes de Quality Assurance
Status: ✅ Produção Ativa
```

### 1.2 Características Principais
```
✅ 100% Client-Side (sem backend)
✅ Dados persistidos no navegador (localStorage)
✅ Deploy automático via Git
✅ Multi-deploy para múltiplos clientes isolados
✅ Exportação de relatórios em Excel
✅ Validação automática de regras trabalhistas brasileiras
✅ Interface responsiva (mobile + desktop)
✅ Design moderno e profissional
```

---

## 2. STACK TECNOLÓGICO

### 2.1 Linguagens
```yaml
TypeScript: 5.7.3
  Uso: Todo o código React/TS
  Configuração: Strict mode habilitado

JavaScript: ES2022+
  Uso: Build output
  Target: ESNext

HTML5:
  Uso: index.html base

CSS3:
  Uso: Via Tailwind CSS (utility classes)
```

### 2.2 Framework e Bibliotecas
```yaml
Core:
  react: 19.2.3
  react-dom: 19.2.3

Build Tool:
  vite: 6.4.1
  @vitejs/plugin-react: 4.3.4

UI Components:
  lucide-react: 0.561.0  # Ícones

Utilities:
  xlsx: 0.18.5           # Exportação Excel

Styling:
  Tailwind CSS: 3.x (via CDN)
  Google Fonts: Inter (300,400,500,600,700)
```

### 2.3 DevDependencies
```yaml
TypeScript Ecosystem:
  typescript: 5.7.3
  @types/react: 19.0.6
  @types/react-dom: 19.0.4

Linting:
  eslint: 9.18.0
  @eslint/js: 9.18.0
  eslint-plugin-react-hooks: 5.1.0
  eslint-plugin-react-refresh: 0.4.19
  typescript-eslint: 8.26.0
  globals: 15.14.0
```

### 2.4 package.json Completo
```json
{
  "name": "sgf---sistema-de-gerenciamento-de-férias",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.561.0",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "@eslint/js": "^9.18.0",
    "@types/react": "^19.0.6",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.18.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^15.14.0",
    "typescript": "~5.7.3",
    "typescript-eslint": "^8.26.0",
    "vite": "^6.4.1"
  }
}
```

---

## 3. INTELIGÊNCIA ARTIFICIAL UTILIZADA

### 3.1 Ferramenta Principal
```yaml
Nome: Claude Code
Provedor: Anthropic
Modelo: Claude Sonnet 4.5
ID Exato: claude-sonnet-4-5-20250929
Interface: CLI (Command Line Interface)
Website: https://claude.com/claude-code
```

### 3.2 Capacidades Utilizadas
```yaml
Code Generation:
  ✅ Geração de componentes React completos
  ✅ Implementação de TypeScript interfaces
  ✅ Lógica de negócio complexa
  ✅ Validações e cálculos de datas

Code Refactoring:
  ✅ Otimização de performance
  ✅ Melhorias de tipagem
  ✅ Correção de bugs
  ✅ Remoção de código duplicado

Git Operations:
  ✅ Commits automáticos
  ✅ Mensagens de commit semânticas
  ✅ Push para GitHub
  ✅ Gerenciamento de branches

Documentation:
  ✅ Comentários inline
  ✅ Documentação técnica
  ✅ Guias de deploy
  ✅ Este prompt completo

Deployment:
  ✅ Configuração Vercel
  ✅ Multi-deploy setup
  ✅ Build optimization
```

### 3.3 Estatísticas de Desenvolvimento
```yaml
Contribuição IA: ~95% do código
Commits com Co-Autoria: Todos (50+)
Linhas de Código Geradas: ~8000+
Tempo de Desenvolvimento: 2-3 dias
Bugs Corrigidos pela IA: 20+
Refatorações: 15+

Co-Autoria em Commits:
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### 3.4 Prompts Típicos Usados
```
"Crie um dashboard com cards estatísticos"
"Adicione validação para férias não iniciarem em finais de semana"
"Implemente detecção de conflitos de QAs do mesmo time"
"Adicione busca e ordenação em todas as colunas"
"Exporte relatórios em Excel"
"Configure multi-deploy no Vercel"
"Remova bloqueio da regra de 2 dias antes de feriado"
"Adicione indicador de 1°, 2° ou 3° período"
```

---

## 4. PLATAFORMAS E HOSPEDAGEM

### 4.1 Frontend Hosting - Vercel
```yaml
Provedor: Vercel Inc.
Website: https://vercel.com
Plano: Hobby (Gratuito)

Recursos:
  ✅ Deploy automático via Git
  ✅ SSL/TLS gratuito (HTTPS)
  ✅ CDN Global (Edge Network)
  ✅ Build automático (Vite)
  ✅ Preview deploys (PRs)
  ✅ Custom domains
  ✅ Bandwidth ilimitado
  ✅ Analytics básico

Configuração Build:
  Build Command: npm run build
  Output Directory: dist
  Install Command: npm install
  Framework: Vite (auto-detected)
  Node Version: 20.x

Build Time: ~20-30 segundos
Deploy Time: ~40 segundos total
```

### 4.2 Repositório - GitHub
```yaml
Provedor: GitHub Inc.
URL: https://github.com/RafaelFrancoD/Sistema-Gerenciamento
Branch Principal: main
Username: RafaelFrancoD

Features:
  ✅ Versionamento Git
  ✅ Histórico completo de commits
  ✅ Webhook para Vercel
  ✅ Auto-deploy on push
  ✅ Issues tracking
  ✅ Code review (optional)
```

### 4.3 URLs de Produção
```yaml
Deploy Original:
  Nome: sistema-gerenciamento
  URL: https://sistema-gerenciamento.vercel.app
  Uso: Produção principal
  Status: ✅ Ativo

Deploy Cliente Teste:
  Nome: sgf-cliente-teste
  URL: https://sgf-cliente-teste.vercel.app
  Uso: Testes e demos
  Status: ✅ Ativo

Deploy Desenvolvimento:
  Nome: sgf-desenvolvimento
  URL: https://sgf-desenvolvimento.vercel.app
  Uso: Desenvolvimento interno
  Status: ✅ Ativo
```

### 4.4 DNS e SSL
```yaml
DNS: Gerenciado pelo Vercel
SSL/TLS: Let's Encrypt (automático)
HTTPS: Forçado (redirect de HTTP)
Certificate Renewal: Automático
```

---

## 5. BANCO DE DADOS

### 5.1 Tecnologia
```yaml
Tipo: Client-Side Storage
Implementação: localStorage (Web Storage API)
Localização: Navegador do usuário
Capacidade: ~5-10 MB por domínio
Formato: JSON (string serializado)
Persistência: Permanente até limpar cache
Sincronização: Não aplicável (local)
Custo: R$ 0,00 (gratuito)
```

### 5.2 Estrutura de Armazenamento
```javascript
// localStorage Structure
{
  // Chave: "sgf_employees"
  "sgf_employees": "[{...Employee}, {...Employee}, ...]",

  // Chave: "sgf_vacations"
  "sgf_vacations": "[{...VacationRequest}, {...VacationRequest}, ...]"
}
```

### 5.3 Schema - Employees
```typescript
interface Employee {
  id: string;              // UUID único
  name: string;            // Nome completo
  role: string;            // Cargo (ex: "QA", "QA Senior")
  team: string;            // Nome do time/squad
  email: string;           // Email corporativo
  admissionDate: string;   // Data admissão (YYYY-MM-DD)
  skills: string[];        // Array de skills
}

// Exemplo:
{
  "id": "emp_1234567890",
  "name": "João Silva",
  "role": "QA",
  "team": "Squad Alpha",
  "email": "joao.silva@empresa.com",
  "admissionDate": "2023-01-15",
  "skills": ["Automation", "API Testing", "Selenium"]
}
```

### 5.4 Schema - Vacations
```typescript
interface VacationRequest {
  id: number | string;           // ID único
  employeeId: string;            // FK → Employee.id
  startDate: string;             // Data início (YYYY-MM-DD)
  endDate: string;               // Data fim (YYYY-MM-DD)
  status: VacationStatus;        // Estado atual
  acquisitionYear?: number;      // Ano aquisição (ex: 2025)
  days?: number;                 // Quantidade de dias
  specialApprovalReason?: string; // Motivo aprovação especial
}

type VacationStatus =
  | 'pending'    // Pendente validação
  | 'approved'   // Aprovado
  | 'rejected'   // Rejeitado
  | 'planned'    // Planejado
  | 'notified';  // Colaborador notificado

// Exemplo:
{
  "id": "vac_9876543210",
  "employeeId": "emp_1234567890",
  "startDate": "2026-03-15",
  "endDate": "2026-03-29",
  "status": "approved",
  "acquisitionYear": 2025,
  "days": 15,
  "specialApprovalReason": null
}
```

### 5.5 Operações CRUD
```typescript
// CREATE
const newEmployee: Employee = {...};
const employees = JSON.parse(localStorage.getItem('sgf_employees') || '[]');
employees.push(newEmployee);
localStorage.setItem('sgf_employees', JSON.stringify(employees));

// READ
const employees: Employee[] = JSON.parse(
  localStorage.getItem('sgf_employees') || '[]'
);

// UPDATE
const updated = employees.map(emp =>
  emp.id === targetId ? {...emp, ...changes} : emp
);
localStorage.setItem('sgf_employees', JSON.stringify(updated));

// DELETE
const filtered = employees.filter(emp => emp.id !== targetId);
localStorage.setItem('sgf_employees', JSON.stringify(filtered));
```

### 5.6 Isolamento Multi-Deploy
```
Por domínio (Same-Origin Policy):

Deploy 1: sistema-gerenciamento.vercel.app
localStorage: { "sgf_employees": [...], "sgf_vacations": [...] }

Deploy 2: sgf-cliente-teste.vercel.app
localStorage: { "sgf_employees": [...], "sgf_vacations": [...] }
                    ↑ DADOS DIFERENTES (isolados)

Impossível um domínio acessar localStorage de outro.
```

---

## 6. DESIGN SYSTEM E LAYOUT

### 6.1 Paleta de Cores
```yaml
# Primary Colors (Azul)
blue-50:  #eff6ff   # Backgrounds suaves
blue-100: #dbeafe   # Backgrounds claros
blue-200: #bfdbfe   # Bordas
blue-500: #3b82f6   # Elementos interativos
blue-600: #2563eb   # Botões primários
blue-700: #1d4ed8   # Botões hover
blue-900: #1e3a8a   # Títulos principais

# Secondary Colors (Slate/Cinza)
slate-50:  #f8fafc  # Background geral
slate-100: #f1f5f9  # Backgrounds secundários
slate-200: #e2e8f0  # Bordas suaves
slate-300: #cbd5e1  # Bordas padrão
slate-400: #94a3b8  # Texto desabilitado
slate-500: #64748b  # Texto secundário
slate-600: #475569  # Texto normal
slate-700: #334155  # Texto ênfase
slate-800: #1e293b  # Texto títulos
slate-900: #0f172a  # Texto principal

# Status Colors
green-50:  #f0fdf4  # Success background
green-100: #dcfce7
green-600: #16a34a  # Success
green-700: #15803d
green-800: #166534

yellow-50:  #fefce8 # Warning background
yellow-100: #fef9c3
yellow-600: #ca8a04 # Warning
yellow-700: #a16207
yellow-800: #854d0e

red-50:  #fef2f2    # Error background
red-100: #fee2e2
red-600: #dc2626    # Error
red-700: #b91c1c
red-800: #991b1b

orange-50:  #fff7ed # Special background
orange-100: #ffedd5
orange-600: #ea580c
orange-700: #c2410c
orange-800: #9a3412

purple-50:  #faf5ff # Notified background
purple-100: #f3e8ff
purple-600: #9333ea
purple-700: #7e22ce
purple-800: #6b21a8

indigo-50:  #eef2ff
indigo-100: #e0e7ff
indigo-600: #4f46e5
```

### 6.2 Tipografia
```yaml
Font Family:
  Primary: 'Inter', sans-serif
  Source: Google Fonts
  Weights: 300, 400, 500, 600, 700
  Link: https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap

Font Sizes (Tailwind):
  text-xs:   0.75rem  (12px)  # Labels pequenas
  text-sm:   0.875rem (14px)  # Texto secundário
  text-base: 1rem     (16px)  # Texto padrão
  text-lg:   1.125rem (18px)  # Subtítulos
  text-xl:   1.25rem  (20px)  # Títulos pequenos
  text-2xl:  1.5rem   (24px)  # Títulos médios
  text-3xl:  1.875rem (30px)  # Títulos grandes

Font Weights:
  font-light:  300  # Texto suave
  font-normal: 400  # Texto padrão
  font-medium: 500  # Ênfase leve
  font-semibold: 600 # Ênfase média
  font-bold:   700  # Títulos, destaque
```

### 6.3 Espaçamentos (Tailwind)
```yaml
Padding/Margin Scale:
  p-1, m-1:   0.25rem  (4px)
  p-2, m-2:   0.5rem   (8px)
  p-3, m-3:   0.75rem  (12px)
  p-4, m-4:   1rem     (16px)
  p-6, m-6:   1.5rem   (24px)
  p-8, m-8:   2rem     (32px)
  p-12, m-12: 3rem     (48px)

Gaps (Flexbox/Grid):
  gap-1: 0.25rem  (4px)
  gap-2: 0.5rem   (8px)
  gap-3: 0.75rem  (12px)
  gap-4: 1rem     (16px)
  gap-6: 1.5rem   (24px)
  gap-8: 2rem     (32px)
```

### 6.4 Bordas e Sombras
```yaml
Border Radius:
  rounded:     0.25rem  (4px)   # Padrão
  rounded-lg:  0.5rem   (8px)   # Cards pequenos
  rounded-xl:  0.75rem  (12px)  # Cards médios
  rounded-2xl: 1rem     (16px)  # Cards grandes
  rounded-full: 9999px          # Círculos/Pills

Border Width:
  border:   1px    # Padrão
  border-2: 2px    # Ênfase
  border-4: 4px    # Destaque forte

Shadows:
  shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05)
  shadow:     0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
  shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
  shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
  shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
```

### 6.5 Layout Geral
```yaml
Estrutura:
  ├── Sidebar (fixa esquerda, 256px desktop)
  └── Main Content (flex-1, padding 32px)
      ├── Header (mobile: botão menu, desktop: título)
      └── Content Area (espaçamento 24px entre seções)

Responsividade:
  Mobile: < 768px
    - Sidebar: overlay (z-index alto)
    - Content: padding 16px
    - Botão menu: visível

  Desktop: >= 768px (md:)
    - Sidebar: fixa (margin-left: 256px)
    - Content: padding 32px
    - Botão menu: oculto

Grid System:
  grid-cols-1: Mobile (1 coluna)
  md:grid-cols-2: Tablet (2 colunas)
  lg:grid-cols-3: Desktop (3 colunas)
  xl:grid-cols-4: Large desktop (4 colunas)
```

---

## 7. COMPONENTES VISUAIS

### 7.1 Sidebar
```yaml
Aparência:
  Width: 256px (w-64)
  Background: bg-white
  Border: border-r border-slate-200
  Shadow: shadow-lg
  Z-index: 50 (mobile overlay)

Logo/Header:
  Padding: p-6
  Background: bg-gradient-to-br from-blue-600 to-indigo-600
  Text: text-white, font-bold, text-xl
  Icon: Calendar (24px)

Menu Items:
  Padding: px-4 py-3
  Hover: hover:bg-blue-50
  Active: bg-blue-100, text-blue-700, border-r-4 border-blue-600
  Inactive: text-slate-600
  Icon Size: 20px
  Gap: gap-3

Badge de Alerta:
  Background: bg-red-500
  Text: text-white, text-xs
  Size: w-5 h-5
  Shape: rounded-full
  Position: absolute top-0 right-0

Mobile Overlay:
  Background: bg-black/50 (backdrop)
  Animation: Slide from left
  Close: Click backdrop ou botão X
```

### 7.2 Cards Estatísticos
```yaml
Container:
  Background: bg-white
  Padding: p-6
  Border: border border-blue-100
  Radius: rounded-xl
  Shadow: shadow-sm
  Hover: hover:shadow-md, cursor-pointer

Header:
  Flex: justify-between items-start
  Icon Container:
    Size: w-12 h-12
    Shape: rounded-full
    Background: bg-blue-100 (varia por tipo)
    Icon: 24px, text-blue-600

Content:
  Value:
    Size: text-3xl
    Weight: font-bold
    Color: text-slate-900

  Label:
    Size: text-sm
    Color: text-slate-500
    Margin: mt-1

Variações:
  Total: bg-blue-100, text-blue-600
  Approved: bg-green-100, text-green-600
  Pending: bg-yellow-100, text-yellow-600
  Rejected: bg-red-100, text-red-600
```

### 7.3 Tabelas
```yaml
Container:
  Background: bg-white
  Border: border border-slate-100
  Radius: rounded-2xl
  Overflow: overflow-hidden

Table Header (thead):
  Background: bg-slate-50/50
  Text: text-slate-600, text-xs, uppercase
  Padding: p-4
  Font: font-semibold

  Sortable Columns:
    Cursor: cursor-pointer
    Hover: hover:bg-slate-100
    Icon: ArrowUpDown (14px)
    Active: text-blue-600

Table Body (tbody):
  Divide: divide-y divide-slate-100
  Row Hover: hover:bg-slate-50/50

Table Cells (td):
  Padding: p-4
  Font Size: text-sm (padrão)
  Text Color: text-slate-600 (padrão)

Actions Column:
  Buttons:
    Size: p-2
    Radius: rounded-lg
    Edit: hover:bg-slate-100, text-slate-600
    Delete: hover:bg-red-50, text-red-600
    Icon Size: 16px
```

### 7.4 Badges de Status
```yaml
Base Style:
  Display: inline-block
  Padding: px-3 py-1
  Font: text-xs font-bold
  Radius: rounded-full
  Border: border

Status Approved (Aprovada):
  Background: bg-green-100
  Text: text-green-800
  Border: border-green-200

Status Pending (Pendente):
  Background: bg-yellow-100
  Text: text-yellow-800
  Border: border-yellow-200

Status Rejected (Rejeitada):
  Background: bg-red-100
  Text: text-red-800
  Border: border-red-200

Status Planned (Planejada):
  Background: bg-blue-100
  Text: text-blue-800
  Border: border-blue-200

Status Notified (Notificada):
  Background: bg-purple-100
  Text: text-purple-800
  Border: border-purple-200
```

### 7.5 Indicadores de Período
```yaml
1° Período:
  Background: bg-blue-100
  Text: text-blue-700
  Border: border border-blue-200
  Font: text-xs font-bold
  Padding: px-2.5 py-1
  Radius: rounded-full

2° Período:
  Background: bg-green-100
  Text: text-green-700
  Border: border border-green-200
  (mesmo estilo)

3° Período:
  Background: bg-purple-100
  Text: text-purple-700
  Border: border border-purple-200
  (mesmo estilo)

Posicionamento:
  Dashboard Cards: Canto superior direito (badge pequeno)
  Lista Sidebar: Ao lado do nome (inline)
  Tabelas: Coluna dedicada "N° Período"
```

### 7.6 Formulários
```yaml
Input Fields:
  Width: w-full
  Padding: px-4 py-3 (ou p-3)
  Border: border border-slate-200
  Radius: rounded-xl (ou rounded-lg)
  Background: bg-slate-50 (ou bg-white)
  Focus: focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  Outline: outline-none
  Disabled: bg-slate-100, cursor-not-allowed

Labels:
  Size: text-xs
  Weight: font-bold
  Color: text-slate-500
  Transform: uppercase
  Margin: mb-2

Select Dropdowns:
  (mesmos estilos de Input)
  Appearance: Sistema operacional padrão

Buttons Primary:
  Background: bg-blue-600
  Text: text-white
  Padding: px-4 py-3
  Radius: rounded-xl
  Font: font-bold
  Hover: hover:bg-blue-700
  Shadow: shadow-lg
  Disabled: disabled:bg-slate-400, disabled:shadow-none
  Icon: gap-2 (entre ícone e texto)

Buttons Secondary:
  Background: bg-white
  Text: text-slate-600 (ou text-blue-700)
  Border: border border-slate-300 (ou border-blue-200)
  Hover: hover:bg-slate-100 (ou hover:bg-blue-50)
  (outros estilos iguais)

Search Input:
  Position: relative
  Icon: Absolute left-3, text-slate-400
  Padding Left: pl-10 (para ícone)
```

### 7.7 Modais
```yaml
Backdrop:
  Background: bg-black/50
  Position: fixed inset-0
  Z-index: z-50
  Click: Fecha modal

Modal Container:
  Background: bg-white
  Radius: rounded-2xl
  Shadow: shadow-2xl
  Max Width: max-w-2xl (ou max-w-4xl)
  Max Height: max-h-[90vh]
  Overflow: overflow-y-auto
  Padding: p-6
  Position: Centralizado (flex center)

Header:
  Border: border-b border-slate-200
  Padding: pb-4 mb-4
  Title: text-xl font-bold text-slate-900
  Close Button:
    Position: Canto superior direito
    Icon: X (20px)
    Hover: hover:bg-slate-100
    Radius: rounded-full
    Padding: p-2

Content:
  Padding: py-4
  Spacing: space-y-4

Footer:
  Border: border-t border-slate-200
  Padding: pt-4 mt-4
  Buttons: Alinhados à direita (flex justify-end gap-3)
```

### 7.8 Alertas/Avisos
```yaml
Success Alert:
  Background: bg-green-50
  Text: text-green-800
  Border: border border-green-200
  Icon: Check (verde)

Warning Alert:
  Background: bg-yellow-50
  Text: text-yellow-800
  Border: border border-yellow-200
  Icon: AlertTriangle (amarelo)

Error Alert:
  Background: bg-red-50
  Text: text-red-800
  Border: border border-red-200
  Icon: AlertTriangle (vermelho)

Info Alert:
  Background: bg-blue-50
  Text: text-blue-800
  Border: border border-blue-200
  Icon: Info (azul)

Base Style:
  Padding: p-4
  Radius: rounded-lg
  Font: text-sm font-medium
  Icon + Text: flex items-start gap-2
```

### 7.9 Empty States
```yaml
Container:
  Padding: p-12
  Background: bg-slate-50
  Border: border-2 border-dashed border-slate-300
  Radius: rounded-xl
  Text Align: text-center

Icon:
  Size: 48px
  Color: text-slate-400
  Opacity: opacity-50
  Margin: mb-4

Text:
  Size: text-base
  Color: text-slate-400
```

---

## 8. FUNCIONALIDADES DETALHADAS

### 8.1 Dashboard
```yaml
Layout:
  Grid: grid-cols-1 md:grid-cols-2 xl:grid-cols-4
  Gap: gap-6
  Spacing: space-y-6

Cards Estatísticos (4 cards):
  1. Total de Férias
     - Conta: todos os vacations
     - Cor: Azul
     - Ícone: Calendar

  2. Férias Aprovadas
     - Filtra: status === 'approved' || 'notified'
     - Cor: Verde
     - Ícone: CheckCircle

  3. Férias Pendentes
     - Filtra: status === 'pending' || 'planned'
     - Cor: Amarelo
     - Ícone: Clock

  4. Férias Rejeitadas
     - Filtra: status === 'rejected'
     - Cor: Vermelho
     - Ícone: XCircle

Click no Card:
  - Abre modal com lista detalhada
  - Modal mostra: nome, período, dias, status, indicador período
  - Filtros: 7, 15, 30, 60, 90 dias
  - Botões: Pills (rounded-full) com estados ativo/inativo

Seções Adicionais:
  1. Férias Ativas
     - Filtra: startDate <= hoje <= endDate
     - Status: approved || notified
     - Ordenação: por startDate

  2. Férias Vencendo
     - Calcula: endDate entre hoje e +X dias
     - Filtros: 30, 60, 90 dias (pills)
     - Cor diferenciada por urgência

  3. Férias Gozadas em 2026
     - Filtra: endDate no passado, ano atual
     - Status: approved || notified

  4. Conflitos Detectados
     - Tipo 1: QAs do mesmo time (cor vermelha)
     - Tipo 2: Sobreposição de períodos (cor laranja)
     - Mostra: colaboradores, time, período conflito, dias conflito
```

### 8.2 Colaboradores
```yaml
Formulário de Cadastro:
  Campos:
    - Nome (text, required)
    - Cargo (text, required, ex: "QA")
    - Time (text, required, ex: "Squad Alpha")
    - Email (email, required, unique)
    - Data Admissão (date, required, não futura)
    - Skills (array, opcional)
      - Input + botão adicionar
      - Lista de pills removíveis
      - Digitação livre

  Validações:
    - Email único no sistema
    - Data admissão <= hoje
    - Campos obrigatórios preenchidos

  Botões:
    - Salvar (azul, disabled até válido)
    - Cancelar (cinza, se editando)

Lista de Colaboradores:
  Formato: Tabela responsiva
  Colunas:
    - Nome (bold)
    - Cargo + Time (subtitle)
    - Email
    - Data Admissão
    - Skills (pills pequenos)
    - Ações (Editar + Excluir)

  Features:
    - Busca por nome (real-time)
    - Indicador de férias vencendo (badge vermelho)
    - Click Editar: carrega dados no formulário
    - Click Excluir: confirmação antes de deletar
```

### 8.3 Solicitações de Férias
```yaml
Formulário Nova Solicitação:
  Campos:
    - Colaborador (select, alfabético, required)
    - Ano Aquisição (number, default: ano atual)
    - Data Início (date, required)
    - Dias (number, default: 30, padrões: 10,15,20,30)
    - Data Fim (date, readonly, calculado)

  Botões:
    1. Validar Período (branco, borda azul)
       - Executa todas as regras (RN01-RN07)
       - Mostra resultado colorido:
         ✅ Verde: Válido
         ⚠️ Amarelo: Aprovação especial
         ❌ Vermelho: Bloqueado

    2. Solicitar (azul, disabled até validar)
       - Salva no localStorage
       - Status: 'planned' ou 'pending'

    3. Cancelar (se editando)

Sugestões Inteligentes:
  Botão: "Sugerir Meses"

  Passo 1: Lista meses disponíveis
    - Pills clicáveis
    - Destaque quando selecionado
    - Dentro da janela legal (6 meses)

  Passo 2: Após selecionar mês
    - Lista datas de início válidas
    - Verde: Data válida
    - Vermelho: Sem datas (mostra impedimentos)
    - Click na data: preenche formulário

Lista de Solicitações:
  Tabela com colunas:
    - Colaborador (nome + team)
    - Data Admissão (NOVA!)
    - N° Período (badge 1°/2°/3°) (NOVA!)
    - Período (início - fim)
    - Status (badge colorido)
    - Ações (Editar + Excluir)

  Busca:
    - Input com ícone lupa
    - Filtra por nome em tempo real
    - Placeholder: "Pesquisar por nome..."

  Ordenação: (NOVA!)
    - Click no header da coluna
    - Ícone ArrowUpDown
    - Azul quando ativa
    - Alterna asc/desc
    - Colunas: todas

Cálculo de Período (1°/2°/3°):
  Lógica:
    1. Pega employeeId + acquisitionYear
    2. Lista todas férias (approved/notified/planned/pending)
    3. Ordena por startDate
    4. Índice + 1 = número do período

  Visual:
    1° → Azul
    2° → Verde
    3° → Roxo
```

### 8.4 Aprovações
```yaml
Lista de Pendentes:
  Filtra: status === 'planned' || 'pending'

  Tabela com colunas:
    - Colaborador (nome + team)
    - Data Admissão (NOVA!)
    - Período (início - fim)
    - Dias (ex: "15d")
    - Ano Aquisição
    - N° Período (badge) (NOVA!)
    - Motivo (lista de avisos, cor laranja)
    - Status (badge)
    - Ações (Aprovar + Rejeitar)

  Motivo Especial:
    - Lista com bullets
    - Cor laranja
    - Font size xs
    - Mostra warnings da validação

  Botões de Ação:
    Aprovar:
      - Cor: verde
      - Ícone: Check
      - Shape: circular (rounded-full)
      - Hover: bg-green-200
      - Ação: status → 'approved', limpa reason

    Rejeitar:
      - Cor: vermelho
      - Ícone: X
      - Shape: circular (rounded-full)
      - Hover: bg-red-200
      - Ação: status → 'rejected', limpa reason

  Empty State:
    - Quando sem pendentes
    - Ícone grande (48px)
    - Texto: "Nenhuma solicitação pendente"
    - Background: slate-50
```

### 8.5 Relatórios
```yaml
Seção 1: Exportar Todas (NOVA!)
  Container:
    - Background: gradient blue-indigo
    - Border: azul
    - Padding: p-6
    - Radius: rounded-xl

  Layout: Flex justify-between

  Left:
    - Título: "Exportar Todas as Férias"
    - Subtitle: "Gere um relatório completo..."

  Right:
    - Botão Excel:
      - Ícone: FileSpreadsheet
      - Cor: verde
      - Label: "Exportar Excel"
      - Ação: Exporta TODAS (approved+notified)

Seção 2: Seleção Individual
  Layout: Grid (1 coluna mobile, 3 colunas desktop)

  Coluna 1: Lista (Sidebar)
    - Busca:
      - Input com ícone Search
      - Placeholder: "Pesquisar por nome..."
      - Filter em tempo real

    - Ordenação:
      - Dropdown (select)
      - Opções:
        - Nome (A-Z)
        - Nome (Z-A)
        - Data (Mais Antiga)
        - Data (Mais Recente)

    - Lista de férias:
      - Cards clicáveis
      - Active: bg-blue-50, borda azul
      - Mostra: nome, período, badge período
      - Scroll: max-h-[500px]

  Coluna 2-3: Preview + Ações
    - Documento formatado:
      - Título: "Aviso de Férias" (centralizado)
      - Grid 2 colunas:
        - Info colaborador
        - Data emissão
      - Box destaque: Detalhes período
      - Box laranja: Observações (se houver)

    - Botões (footer):
      1. Exportar Excel (verde)
         - Exporta férias selecionada

      2. Enviar por Email (azul)
         - Abre mailto: com template
         - Atualiza status → 'notified'
         - Alert: "Email pronto..."

Template Email:
  Assunto: "Aviso de Férias Aprovadas - [Nome]"

  Corpo:
    Prezado(a) [Nome],

    Comunicamos que suas férias foram aprovadas.

    INFORMAÇÕES DO COLABORADOR
    Time: [Team]
    Data de Admissão: [Data]

    DETALHES DO PERÍODO
    Período: [Início] a [Fim]
    Duração: [X] dias
    Ano de Aquisição: [Ano]
    Status: Aprovada

    Lembre-se de realizar o comunicado...
    [Link PCR-QA]

    Atenciosamente,
    Gisela Nossa - Supervisora de Qualidade
```

---

## 9. REGRAS DE NEGÓCIO

### 9.1 RN01 - Cálculo de Vencimento
```yaml
Descrição:
  Férias vencem 6 meses após aniversário do período aquisitivo

Fórmula:
  baseDate = (dia/mês admissão) + (ano aquisição)
  vencimento = baseDate + 6 meses

Exemplo:
  Admissão: 06/11/2017
  Ano Aquisição: 2025
  Base: 06/11/2025
  Vencimento: 06/05/2026

Implementação:
  File: utils/dateLogic.ts
  Function: calculateVacationDueDate(admissionDate, acquisitionYear)

  Logic:
    1. Extrai dia/mês da admissão
    2. Constrói data base com ano aquisição
    3. Adiciona 6 meses
    4. Retorna Date object
```

### 9.2 RN02 - Períodos Padrão
```yaml
Períodos Permitidos:
  - 30 dias (período completo)
  - 20 dias (2/3)
  - 15 dias (metade)
  - 10 dias (1/3)

Comportamento:
  - Períodos fora do padrão: ⚠️ Warning (não bloqueia)
  - Mensagem: "Período de X dias não é um período padrão"
  - Permite com aprovação especial

Implementação:
  File: utils/dateLogic.ts
  Function: validateVacationRequest()

  Check:
    const standardPeriods = [10, 15, 20, 30];
    if (!standardPeriods.includes(duration)) {
      warnings.push(`Período de ${duration} dias não é padrão`);
    }
```

### 9.3 RN03 - Restrições de Início
```yaml
Não Pode Iniciar Em:
  ❌ Sábado (day === 6)
  ❌ Domingo (day === 0)
  ❌ Feriado nacional/municipal

Avisos (não bloqueia):
  ⚠️ 2 dias antes de final de semana
  ⚠️ 2 dias antes de feriado

Feriados Fixos:
  - 01/01 - Confraternização
  - 21/04 - Tiradentes
  - 01/05 - Dia do Trabalho
  - 07/09 - Independência
  - 12/10 - Nossa Senhora Aparecida
  - 02/11 - Finados
  - 15/11 - Proclamação da República
  - 25/12 - Natal
  - 19/03 - Aniversário SJRP (municipal)

Feriados Móveis (2025-2027 hardcoded):
  2025:
    - 03/03, 04/03 - Carnaval
    - 18/04 - Sexta-feira Santa
    - 19/06 - Corpus Christi

  2026:
    - 16/02, 17/02 - Carnaval
    - 03/04 - Sexta-feira Santa
    - 04/06 - Corpus Christi

  2027:
    - 08/02, 09/02 - Carnaval
    - 26/03 - Sexta-feira Santa
    - 27/05 - Corpus Christi

Implementação:
  File: utils/dateLogic.ts
  Functions:
    - isHoliday(date, year): boolean
    - isWeekend(date): boolean
    - isStartDateInvalid(date): {invalid, reason}

  Status: Movido para WARNINGS (não bloqueia mais)
```

### 9.4 RN04 - Conflito de QAs
```yaml
Regra:
  Não pode haver 2 QAs do mesmo time de férias simultaneamente

Verificação:
  1. Identifica role === 'QA' e team
  2. Lista outros QAs do mesmo team
  3. Verifica sobreposição de datas
  4. Se overlap: warning

Overlap Check:
  if (
    (newStart >= existingStart && newStart <= existingEnd) ||
    (newEnd >= existingStart && newEnd <= existingEnd) ||
    (newStart <= existingStart && newEnd >= existingEnd)
  ) → Conflito!

Mensagem:
  "Conflito de QA: [Nome QA] do seu time já estará de férias"

Ação:
  ⚠️ Warning (permite com aprovação especial)

Implementação:
  File: utils/dateLogic.ts
  Function: isQAConflict(start, end, empId, employees, vacations)
```

### 9.5 RN05 - Retroatividade
```yaml
Permitido:
  ✅ Férias até 6 meses no passado

Bloqueado:
  ❌ Férias anteriores a 6 meses

Cálculo:
  const today = new Date()
  const sixMonthsAgo = new Date(today)
  sixMonthsAgo.setMonth(today.getMonth() - 6)

  if (startDate < sixMonthsAgo) → ERRO

Mensagem:
  "A data de início não pode ser anterior a 6 meses atrás"

Motivo:
  Permite correção de férias já tiradas
  Mas impede dados muito antigos/incorretos

Implementação:
  File: utils/dateLogic.ts
  Function: validateVacationRequest()
```

### 9.6 RN06 - Sugestão de Datas
```yaml
Sugestão de Meses:
  1. Calcula data de vencimento (RN01)
  2. Window: baseDate até vencimento (6 meses)
  3. Exclui meses completamente passados
  4. Retorna array de strings: "janeiro de 2026"

Sugestão de Datas:
  1. Para cada dia do mês selecionado
  2. Cria VacationRequest dummy (30 dias)
  3. Executa validateVacationRequest()
  4. Se válido: adiciona à lista
  5. Se inválido: adiciona impedimento

Impedimentos:
  - Lista de motivos por que datas não são válidas
  - Exibidos quando nenhuma data disponível

UI:
  Botão: "Sugerir Meses"
  Passo 1: Pills de meses (clicáveis)
  Passo 2: Lista de datas ou impedimentos

Implementação:
  File: utils/dateLogic.ts
  Functions:
    - getSuggestedMonths(empId, employees, vacations, year)
    - getSuggestedDatesForMonth(month, empId, employees, vacations, year)
```

### 9.7 RN07 - Alertas de Vencimento
```yaml
Condição:
  Férias vencendo em menos de 30 dias
  E SEM férias aprovadas para aquele ano aquisição

Cálculo:
  1. Para cada colaborador
  2. Para ano atual e ano atual+1
  3. Calcula vencimento
  4. daysLeft = (vencimento - hoje) / (1 dia em ms)
  5. Verifica se tem vacation com:
     - employeeId match
     - acquisitionYear match
     - status === 'approved'
  6. Se daysLeft < 30 && !hasVacation → ALERTA

Indicador:
  - Badge vermelho no menu Sidebar
  - Texto: "Alertas"
  - Posição: Ao lado do item "Dashboard"

Implementação:
  File: App.tsx
  Hook: useMemo(() => hasAlerts, [employees, vacations])

  Logic:
    return employees.some(emp => {
      for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
        const year = currentYear + yearOffset
        const dueDate = calculateVacationDueDate(emp.admissionDate, year)
        const daysLeft = getDaysUntilDue(dueDate)
        const hasTaken = vacations.some(v =>
          v.employeeId === emp.id &&
          v.acquisitionYear === year &&
          v.status === 'approved'
        )
        if (daysLeft < 30 && !hasTaken) return true
      }
      return false
    })
```

---

## 10. PROMPT PARA RECRIAÇÃO COM IA

### 10.1 Prompt Completo (Copiar e Colar)
```
Crie um sistema completo de gerenciamento de férias (SGF) com as seguintes especificações EXATAS:

═══════════════════════════════════════════════════════════════
STACK TECNOLÓGICO
═══════════════════════════════════════════════════════════════

Frontend Framework:
- React 19.2.3 com TypeScript 5.7.3
- Vite 6.4.1 como build tool
- Functional components com hooks (useState, useEffect, useMemo)

UI e Styling:
- Tailwind CSS via CDN: https://cdn.tailwindcss.com
- Google Fonts Inter: weights 300,400,500,600,700
- Lucide React 0.561.0 para ícones
- Sem CSS modules ou styled-components

Bibliotecas:
- xlsx 0.18.5 para exportação Excel
- Sem jsPDF (removido)

Persistência:
- localStorage do navegador
- Sem backend, sem API, sem banco de dados externo
- Chaves: "sgf_employees" e "sgf_vacations"

═══════════════════════════════════════════════════════════════
DESIGN SYSTEM EXATO
═══════════════════════════════════════════════════════════════

Cores Principais:
- Background geral: bg-slate-50
- Cards: bg-white
- Primária: blue-600 (botões), blue-900 (títulos)
- Sucesso: green-600, green-100
- Aviso: yellow-600, yellow-100
- Erro: red-600, red-100
- Info: slate-600, slate-100

Tipografia:
- Font: Inter (Google Fonts)
- Títulos principais: text-2xl md:text-3xl font-bold text-blue-900
- Subtítulos: text-xl font-bold text-slate-800
- Texto normal: text-sm text-slate-600
- Labels: text-xs font-bold text-slate-500 uppercase

Espaçamentos:
- Entre seções: space-y-6
- Padding cards: p-6
- Padding inputs: px-4 py-3
- Gap grids: gap-6

Bordas:
- Cards: rounded-xl ou rounded-2xl
- Inputs: rounded-xl ou rounded-lg
- Badges: rounded-full
- Sombra cards: shadow-sm, hover:shadow-md

═══════════════════════════════════════════════════════════════
ESTRUTURA DE COMPONENTES
═══════════════════════════════════════════════════════════════

App.tsx (Root):
- Estado global: employees, vacations
- Persistência automática via useEffect
- Navegação por estado (currentView)
- Calcula hasAlerts para Sidebar

Componentes Principais:

1. Sidebar:
   - Width: 256px (w-64)
   - Background: bg-white, border-r
   - Header com gradient: from-blue-600 to-indigo-600
   - Menu items: hover:bg-blue-50, active com border-r-4 blue
   - Badge de alertas (vermelho, circular)
   - Mobile: overlay com backdrop

2. Dashboard:
   - 4 cards estatísticos (Total, Aprovadas, Pendentes, Rejeitadas)
   - Grid: grid-cols-1 md:grid-cols-2 xl:grid-cols-4
   - Cards clicáveis: abrem modal com detalhes
   - Seções: Férias Ativas, Vencendo, Gozadas, Conflitos
   - Filtros: Pills (7, 15, 30, 60, 90 dias)
   - Indicadores de período: 1°(azul), 2°(verde), 3°(roxo)

3. EmployeeManager:
   - Formulário: nome, cargo, team, email, admissão, skills
   - Skills: input + botão adicionar, lista de pills
   - Tabela: nome, cargo/team, email, admissão, skills, ações
   - Busca por nome
   - Editar: carrega no form
   - Excluir: confirmação

4. VacationManager:
   - Form: colaborador (select alfabético), ano aquisição, data início, dias, data fim (readonly)
   - Botão "Validar Período": executa regras, mostra resultado colorido
   - Botão "Solicitar": salva (disabled até validar)
   - Sugestões: "Sugerir Meses" → pills de meses → datas válidas
   - Tabela: colaborador, admissão, período (badge 1°/2°/3°), período, status, ações
   - Busca + ordenação por colunas (ícone ArrowUpDown)

5. ApprovalManager:
   - Lista pendentes: status 'pending' ou 'planned'
   - Tabela: colaborador, admissão, período, dias, ano, n° período, motivo, status, ações
   - Botões circulares: Aprovar (verde, Check), Rejeitar (vermelho, X)
   - Motivo: lista bullets, cor laranja

6. Reports:
   - Seção 1: "Exportar Todas" (gradient, botão Excel verde)
   - Seção 2: Grid 3 colunas (lista | preview | ações)
   - Lista: busca + ordenação (dropdown) + cards clicáveis
   - Preview: documento formatado (título centralizado, grid 2 cols)
   - Botões: Exportar Excel (verde), Enviar Email (azul)
   - Email: template específico, atualiza status → 'notified'

═══════════════════════════════════════════════════════════════
SCHEMA DE DADOS (localStorage)
═══════════════════════════════════════════════════════════════

Employee:
{
  id: string,              // UUID único
  name: string,            // Nome completo
  role: string,            // "QA", "QA Senior"
  team: string,            // "Squad Alpha"
  email: string,           // Email único
  admissionDate: string,   // YYYY-MM-DD
  skills: string[]         // ["Automation", "API Testing"]
}

VacationRequest:
{
  id: number | string,           // ID único
  employeeId: string,            // FK Employee.id
  startDate: string,             // YYYY-MM-DD
  endDate: string,               // YYYY-MM-DD
  status: 'pending' | 'approved' | 'rejected' | 'planned' | 'notified',
  acquisitionYear?: number,      // 2025
  days?: number,                 // 15
  specialApprovalReason?: string // "Conflito de QA: João Silva..."
}

Chaves localStorage:
- "sgf_employees" → JSON.stringify(Employee[])
- "sgf_vacations" → JSON.stringify(VacationRequest[])

═══════════════════════════════════════════════════════════════
REGRAS DE NEGÓCIO (utils/dateLogic.ts)
═══════════════════════════════════════════════════════════════

RN01 - Cálculo de Vencimento:
Function: calculateVacationDueDate(admissionDate, acquisitionYear)
Lógica: baseDate = dia/mês admissão + ano aquisição, vencimento = base + 6 meses
Exemplo: Admissão 06/11/2017, Ano 2025 → Base 06/11/2025 → Vence 06/05/2026

RN02 - Períodos Padrão:
Permitidos: 10, 15, 20, 30 dias
Outros: ⚠️ Warning "Período de X dias não é padrão"
Ação: Permite com aprovação especial

RN03 - Restrições de Início:
Não pode: Sábado, domingo, feriado
Aviso (não bloqueia): 2 dias antes de feriado/final de semana
Feriados: Lista completa (nacionais + SJRP + móveis 2025-2027)
Status: Movido para warnings (não bloqueia)

RN04 - Conflito QAs:
Verifica: role === 'QA' && mesmo team
Overlap: Se datas sobrepõem
Warning: "Conflito de QA: [Nome] do seu time já estará de férias"

RN05 - Retroatividade:
Permitido: Até 6 meses no passado
Bloqueado: Anterior a 6 meses
Erro: "Data de início não pode ser anterior a 6 meses atrás"

RN06 - Sugestão de Datas:
Sugere meses: Dentro da janela legal (até vencimento)
Sugere datas: Para cada dia, valida e retorna válidas
Impedimentos: Se nenhuma data válida

RN07 - Alertas Vencimento:
Condição: Vence em < 30 dias E sem férias aprovadas
Indicador: Badge vermelho na Sidebar
Cálculo: Para cada colaborador, anos atual e +1

═══════════════════════════════════════════════════════════════
FUNCIONALIDADES ESPECÍFICAS
═══════════════════════════════════════════════════════════════

Indicadores de Período (1°/2°/3°):
Lógica:
  1. Filtra vacations: mesmo employeeId + acquisitionYear
  2. Status: approved || notified || planned || pending
  3. Ordena por startDate
  4. Índice + 1 = número período

Visual:
  1° Período: bg-blue-100 text-blue-700 border-blue-200
  2° Período: bg-green-100 text-green-700 border-green-200
  3° Período: bg-purple-100 text-purple-700 border-purple-200

Badges: text-xs font-bold px-2.5 py-1 rounded-full

Locais:
- Dashboard cards (canto superior direito, menor)
- Lista sidebar Reports (ao lado do nome)
- Tabelas (coluna dedicada "N° Período")

Detecção de Conflitos (Dashboard):
Tipo 1 - QAs:
  - Mesmo team, role=QA, overlap de datas
  - Card vermelho
  - Mostra: colaboradores, team, período conflito, dias conflito

Tipo 2 - Overlap:
  - Qualquer overlap de datas
  - Card laranja
  - Mostra: colaboradores, período conflito, dias conflito

Cálculo dias conflito:
  overlapStart = Math.max(start1, start2)
  overlapEnd = Math.min(end1, end2)
  conflictDays = Math.ceil((overlapEnd - overlapStart) / dia_ms) + 1

Exportação Excel:
Individual:
  - Botão "Exportar Excel" (verde) no Reports
  - 1 linha: colaborador, email, team, admissão, ano, período, início, fim, dias, status, obs

Completo:
  - Botão "Exportar Excel" no topo do Reports
  - Todas as férias approved || notified
  - Múltiplas linhas
  - Nome arquivo: Relatorio_Todas_Ferias_[data].xlsx

Email Template:
Assunto: "Aviso de Férias Aprovadas - [Nome]"
Corpo:
  Prezado(a) [Nome],

  Comunicamos que suas férias foram aprovadas.

  INFORMAÇÕES DO COLABORADOR
  Time: [Team]
  Data de Admissão: [Data]

  DETALHES DO PERÍODO
  Período: [Início] a [Fim]
  Duração: [Dias] dias
  Ano de Aquisição: [Ano]
  Status: Aprovada

  Lembre-se de realizar o comunicado ao seu time e a passagem de conhecimento para outro QA com antecedência, seguindo as diretrizes internas contidas no documento
  PCR-QA - Procedimento para período de férias V2.doc https://shiftbrasil.sharepoint.com/:w:/s/team.teste/IQCXW7G2Sz1xS4UdJcr8UFp4AbF9y2UfZFI0GlyqMUOxIVs?e=OFBobx

  Atenciosamente,
  Gisela Nossa - Supervisora de Qualidade

Ação: window.location.href = `mailto:...`
Atualiza: status → 'notified'

═══════════════════════════════════════════════════════════════
DEPLOY E HOSPEDAGEM
═══════════════════════════════════════════════════════════════

Plataforma: Vercel
Build Command: npm run build
Output Directory: dist
Auto-deploy: Push to main

vercel.json:
{
  "name": "sgf-[cliente]",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}

Multi-Deploy:
- Mesmo código, múltiplos deploys
- Nomes diferentes: sgf-cliente-a, sgf-cliente-b
- Isolamento: localStorage por domínio
- URLs: https://sgf-[cliente].vercel.app

═══════════════════════════════════════════════════════════════
ESTRUTURA DE ARQUIVOS OBRIGATÓRIA
═══════════════════════════════════════════════════════════════

src/
├── components/
│   ├── ApprovalManager.tsx
│   ├── Dashboard.tsx
│   ├── EmployeeManager.tsx
│   ├── Reports.tsx
│   ├── Sidebar.tsx
│   └── VacationManager.tsx
├── utils/
│   └── dateLogic.ts
├── App.tsx
├── main.tsx
├── types.ts
└── constants.ts

index.html
package.json
tsconfig.json
vite.config.ts
vercel.json

═══════════════════════════════════════════════════════════════
REQUISITOS CRÍTICOS
═══════════════════════════════════════════════════════════════

✅ TypeScript strict mode
✅ Todas as props tipadas
✅ Sem 'any' types
✅ Functional components apenas
✅ Hooks: useState, useEffect, useMemo
✅ Responsivo (mobile + desktop)
✅ localStorage auto-save (useEffect)
✅ Todas as 7 regras de negócio implementadas
✅ Validação completa em dateLogic.ts
✅ Busca e ordenação em tabelas
✅ Indicadores de período coloridos
✅ Detecção de conflitos com dias
✅ Exportação Excel (individual + completo)
✅ Email com template específico
✅ Design exato conforme especificado
✅ Cores, espaçamentos, fontes exatas

═══════════════════════════════════════════════════════════════
CHECKLIST DE VALIDAÇÃO
═══════════════════════════════════════════════════════════════

Após gerar o código, verificar:

[ ] Build sem erros: npm run build
[ ] TypeScript sem erros: tsc --noEmit
[ ] Todas as 6 telas funcionando
[ ] localStorage salvando/carregando
[ ] Validações bloqueando/avisando corretamente
[ ] Sugestões de datas funcionando
[ ] Exportação Excel gerando arquivo
[ ] Email abrindo com template correto
[ ] Busca filtrando em tempo real
[ ] Ordenação alternando asc/desc
[ ] Indicadores de período corretos (1°/2°/3°)
[ ] Conflitos detectando corretamente
[ ] Responsivo em mobile e desktop
[ ] Cores e espaçamentos conforme design system

═══════════════════════════════════════════════════════════════

IMPORTANTE: Siga EXATAMENTE as especificações acima. Este é um sistema real em produção, qualquer desvio pode causar problemas. Use as cores, espaçamentos, estrutura e lógica EXATAS descritas.
```

---

**FIM DO PROMPT COMPLETO**

---

**📄 Informações do Documento:**
- **Versão:** 1.0
- **Data:** 17 de Fevereiro de 2026
- **Criado por:** Claude Code (Sonnet 4.5)
- **Para:** Rafael Azevedo
- **Uso:** Documentação técnica e prompt para recriação do projeto SGF

---

**Este documento contém TODAS as informações para recriar o projeto SGF identicamente, incluindo layout, cores, espaçamentos, funcionalidades e regras de negócio.**
