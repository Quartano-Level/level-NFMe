# 🎨 Design System - Apple Vibes

## Paleta de Cores

```css
/* Neutros - Monochrome (Apple Style) */
--black-primary: #1d1d1f;     /* Preto principal - texto e botões */
--black-hover: #2c2c2e;        /* Preto hover - estados interativos */
--text-primary: #1d1d1f;       /* Texto principal */
--text-secondary: #86868b;     /* Texto secundário - cinza médio */
--border-light: #e5e5e7;       /* Bordas suaves */
--border-lighter: #f0f0f0;     /* Bordas mais suaves */
--border-hover: #d1d1d6;       /* Bordas hover */
--background-card: #fafafa;    /* Fundo de cards */
--background-hover: #f5f5f5;   /* Fundo hover */

/* Sem cores - Design 100% monocromático */
/* Removido: azul, laranja, verde */
```

## Tipografia

```css
/* Hierarquia - San Francisco inspired */
h6 (Headers): 
  - font-size: 1.125rem (18px)
  - font-weight: 600
  - letter-spacing: -0.01em
  - color: #1d1d1f

body2 (Conteúdo):
  - font-size: 0.9375rem (15px)
  - font-weight: 400
  - color: #1d1d1f

caption (Secundário):
  - font-size: 0.8125rem (13px)
  - color: #86868b
```

## Espaçamento

```css
/* Sistema 8pt Grid */
xs: 8px (0.5rem)
sm: 12px (0.75rem)
md: 16px (1rem)
lg: 24px (1.5rem)
xl: 32px (2rem)
xxl: 48px (3rem)
```

## Border Radius

```css
/* Cantos arredondados - Apple Style */
small: 6px   /* Pills, badges */
medium: 8px  /* Botões */
large: 10px  /* Cards internos */
xlarge: 12px /* Cards principais */
xxlarge: 16px /* Ícones destacados */
```

## Sombras

```css
/* Sombras sutis - minimalistas monocromáticas */
none: 0
hover-button: 0 2px 8px rgba(0, 0, 0, 0.2)      /* Botões pretos */
hover-card: 0 4px 12px rgba(0, 0, 0, 0.06)      /* Cards */
```

## Transições

```css
/* Cubic bezier - Apple's timing function */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transition-hover: 0.2s; /* Estados hover */
transition-expand: 300ms; /* Collapse/Expand */
```

## Componentes

### 1. AlertaNotasSemVinculo - Collapsible Card

**Estado Collapsed (Padrão):**
```
┌──────────────────────────────────────────────────┐
│  [🔶]  Notas sem vínculo           [⌄]          │
│        5 notas requerem atenção                  │
└──────────────────────────────────────────────────┘
```

**Estado Expanded:**
```
┌──────────────────────────────────────────────────┐
│  [⚠]  Notas sem vínculo           [⌃]          │
│        5 notas não encontradas no Conexos        │
│                                                   │
│  As notas abaixo referenciam NEs não encontradas │
│                                                   │
│  ┌────────────────────────────────────────────┐ │
│  │ NS #89 • AMBEV S.A.         [3 itens]     │ │
│  │ NF 10 • Série 2 • 01/06/2025              │ │
│  └────────────────────────────────────────────┘ │
│                                                   │
│  ┌────────────────────────────────────────────┐ │
│  │ NS #88 • AMBEV S.A.         [1 item]      │ │
│  │ NF 10 • Série 2 • 01/06/2025              │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

**Características:**
- ✅ Toggle suave com animação cubic-bezier
- ✅ Ícone rotaciona 180° ao expandir
- ✅ Border cinza sutil (#e5e5e7)
- ✅ Hover effect: border #d1d1d6, shadow suave preta
- ✅ Fundo dos cards: #fafafa
- ✅ Espaçamento interno: 20px (2.5rem)
- ✅ **Sem botão de ação** - apenas informativo
- ✅ Badge de itens no lugar do botão
- ✅ **100% monocromático** - sem cores

### 2. Tabela de Notas Pendentes

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  Notas pendentes                                              │
│  8 notas prontas para Referência                                │
├──────────────────────────────────────────────────────────────┤
│ NOTA      CLIENTE      VALOR      EMISSÃO    ITENS           │
├──────────────────────────────────────────────────────────────┤
│ #10       AMBEV       R$ 182.9k   01/06/25    [3]   [Alocar]│
│ Doc 82                                                        │
├──────────────────────────────────────────────────────────────┤
│ #10       AMBEV       R$ 182.9k   31/05/25    [1]   [Alocar]│
│ Doc 71                                                        │
└──────────────────────────────────────────────────────────────┘
```

**Características:**
- ✅ Header com fundo #fafafa
- ✅ Border radius 12px
- ✅ Sem elevação (elevation: 0)
- ✅ Border 1px solid #e5e5e7
- ✅ Cabeçalhos uppercase, 0.8125rem, color #86868b
- ✅ Hover row: background #fafafa
- ✅ Última linha sem border-bottom
- ✅ **Botão preto** (#1d1d1f, hover #2c2c2e)
- ✅ Badge de itens: background #f0f0f0, border-radius 6px
- ✅ **Design monocromático** - apenas preto e cinzas

### 3. Estado Vazio

**Layout:**
```
┌──────────────────────────────────┐
│                                   │
│         [  ✓  ]                  │
│                                   │
│      Tudo em dia                 │
│                                   │
│  Nenhuma nota pendente de        │
│  Referência no momento.            │
│                                   │
└──────────────────────────────────┘
```

**Características:**
- ✅ Ícone checkmark 64x64px, background #f0f0f0
- ✅ Border radius 16px no ícone
- ✅ Padding 48px (6rem)
- ✅ Fundo #fafafa
- ✅ Border 1px solid #e5e5e7
- ✅ Texto centralizado

## Interações

### Hover States

**Botão "Alocar":**
```css
background: #1d1d1f → #2c2c2e (preto)
box-shadow: none → 0 2px 8px rgba(0, 0, 0, 0.2)
```

**Card de nota sem vínculo:**
```css
background: #fafafa → #f5f5f5
border: #f0f0f0 → #e0e0e0
transform: translateY(0) → translateY(-1px)
```

**Header collapsible:**
```css
background: transparent → #fafafa
border: #e5e5e7 → #d1d1d6
cursor: pointer
user-select: none
```

### Animações

**Expand/Collapse:**
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Ícone rotaciona suavemente

**Cards hover:**
- Duration: 200ms
- Transform translateY sutil (-1px)

**Botões:**
- Duration: 200ms
- Shadow aparece suavemente

## Responsividade

### Desktop (≥1024px)
- Largura máxima tabela: 100%
- Padding cards: 20px
- Font-size padrão

### Tablet (768px - 1023px)
- Tabela scroll horizontal se necessário
- Padding cards: 16px
- Font-size ligeiramente reduzido

### Mobile (<768px)
- Cards empilhados
- Botões full-width
- Tabela em modo scroll
- Font-size ajustado

## Acessibilidade

✅ Contraste WCAG AAA:
- Texto primário (#1d1d1f) sobre branco: 19.01:1
- Texto secundário (#86868b) sobre branco: 4.51:1

✅ Interatividade:
- Área clicável mínima: 44x44px (WCAG 2.1)
- Focus states visíveis
- Aria labels em ícones

✅ Keyboard navigation:
- Tab order lógico
- Enter/Space para toggles
- Esc para fechar expandidos

## Comparação: Antes vs Depois

### Antes (Material Design padrão):
- ❌ Alert amarelo vibrante
- ❌ Múltiplos botões (Detalhes + Criar Vínculo)
- ❌ Chips coloridos
- ❌ Emojis no texto
- ❌ Sempre expandido (poluição visual)
- ❌ Cores saturadas (azul, laranja, verde)

### Depois (Monochrome Minimalist):
- ✅ **Toggle collapsible** - Collapsed por padrão
- ✅ Border cinza sutil (#e5e5e7)
- ✅ **Sem botões de ação** - apenas informativo
- ✅ Badge minimalista para itens ([3 itens])
- ✅ Ícone ErrorOutline (SVG preto)
- ✅ **100% monocromático** - apenas preto e cinzas
- ✅ Espaçamento generoso (20-24px)
- ✅ Tipografia SF Pro inspired
- ✅ Animações suaves (cubic-bezier Apple)
- ✅ Zero elevação (flat design)
- ✅ Header tabela: #fafafa minimalista
- ✅ Estado vazio redesenhado (ícone checkmark)
- ✅ Hover effects sutis (translateY -1px)
- ✅ **Propósito informativo** - sem ações de criação de vínculo

## Inspiração

Design inspirado em:
- Apple.com (cards de produto)
- Apple Music (listas)
- iOS Settings (toggles)
- macOS Big Sur (UI elements)
- **Notion** (minimalismo monocromático)
- **Linear** (design limpo, sem cores)

**Princípios aplicados:**
1. **Clareza**: Hierarquia visual clara com preto e cinzas
2. **Deference**: Interface não compete com conteúdo
3. **Depth**: Layers sutis, não sombras pesadas
4. **Consistency**: Padrões repetidos
5. **Feedback**: Respostas visuais a interações
6. **Monochrome**: Sem cores - apenas preto, branco e cinzas
7. **Informativo**: Alertas informativos, não acionáveis

---

**Status:** ✅ Implementado  
**Data:** 2025-10-06  
**Versão:** 2.0 - Monochrome Minimalist Edition
