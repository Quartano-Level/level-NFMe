# 📋 Informações Adicionais DANFE - Componente Sticky

## 🎯 Objetivo

Exibir as **informações adicionais da Nota de Saída** de forma destacada e sempre visível, servindo como **referência** para o analista entender como o estoque deve ser distribuído durante o processo de Referência.

## 🎨 Características do Design

### Visual (Monocromático)
- **Border forte**: 2px solid #1d1d1f (preto)
- **Fundo**: #fafafa (cinza muito claro)
- **Ícone**: Box preto 40x40px com ícone Info branco
- **Tipografia**: 
  - Título: font-weight 700, 1.125rem, preto
  - Conteúdo: font-weight 500, 0.9375rem, preto, line-height 1.7
- **Border radius**: 12px (cantos suaves)

### Comportamento Sticky
```css
position: sticky;
top: 16px;
z-index: 100;
```

**Como funciona:**
1. Componente aparece no topo da página de Referência
2. Quando usuário faz scroll para baixo, o componente **fixa no topo** (16px do viewport)
3. Permanece visível enquanto o usuário navega pelas abas de produtos
4. z-index 100 garante que fica acima dos outros elementos

### Tipografia de Alta Hierarquia
- **Sem scroll**: Texto exibido por completo sempre
- **whiteSpace: 'pre-wrap'**: Preserva quebras de linha do backend
- **wordBreak: 'break-word'**: Quebra palavras longas se necessário
- **Contraste máximo**: Texto preto (#1d1d1f) sobre fundo claro (#fafafa)
- **Line-height 1.7**: Espaçamento generoso para leitura confortável

## 📐 Estrutura

```tsx
<Paper sticky>
  ┌─────────────────────────────────────────┐
  │ [🖤]  Referência de Distribuição       │  ← Header
  │                                          │
  │       Texto das informações adicionais  │  ← Content
  │       distribuído conforme necessário   │     (alinhado com o título)
  │       preservando quebras de linha...   │
  └─────────────────────────────────────────┘
</Paper>
```

### Padding e Alinhamento
```css
Container: padding 24px (3rem)
Header: gap 12px entre ícone e texto
Content: padding-left 56px (40px icon + 12px gap + padding)
         Alinha perfeitamente com o texto do título
```

## 🔄 Comportamento

### Estados

**1. Texto Presente:**
```tsx
<ReferenciaDistribuicao texto="Distribuir conforme FIFO..." />
// Componente renderiza com sticky behavior
```

**2. Texto Vazio/Ausente:**
```tsx
<ReferenciaDistribuicao texto="" />
// Retorna null - não renderiza nada
```

### Sticky Behavior (Exemplo)

**Scroll Position: Topo (0px)**
```
┌────────────────────────────────────┐
│ [Botão Voltar]                     │
│                                     │
│ [📋 Referência de Distribuição]   │ ← Posição normal
│                                     │
│ [Resumo Geral da Referência]         │
│ ...                                 │
```

**Scroll Position: 100px para baixo**
```
┌────────────────────────────────────┐
│ [📋 Referência de Distribuição]   │ ← FIXO no topo!
├────────────────────────────────────┤
│ [Tabs de Produtos]                 │
│ [Tabela de NEs]                    │
│ ...                                 │
```

**Scroll Position: Voltando para cima**
```
┌────────────────────────────────────┐
│ [Botão Voltar]                     │
│                                     │
│ [📋 Referência de Distribuição]   │ ← Volta à posição normal
│                                     │
│ [Resumo Geral da Referência]         │
```

## 💡 Casos de Uso

### 1. FIFO com Exceções
```
Referência:
"Distribuir conforme FIFO, exceto produtos lote XYZ123
que devem ser alocados da NE #456 prioritariamente."
```

### 2. Cliente Específico
```
Referência:
"Cliente exige rastreabilidade completa.
Documentar todos os lotes utilizados na Referência."
```

### 3. Restrições de Armazenamento
```
Referência:
"Produtos da categoria A devem sair do depósito 01.
Produtos categoria B apenas do depósito 02."
```

### 4. Observações Críticas
```
Referência:
"URGENTE: Pedido para entrega amanhã.
Priorizar NEs com produtos já separados."
```

## 🎯 Vantagens do Design

### ✅ Alta Hierarquia Visual
- Border preto forte chama atenção
- Ícone destacado em box preto
- Tipografia em negrito (font-weight 700 no título, 500 no conteúdo)

### ✅ Sempre Visível
- Sticky behavior mantém referência acessível
- Não precisa voltar ao topo para consultar
- Melhora eficiência do analista

### ✅ Sem Scroll Interno
- whiteSpace: 'pre-wrap' garante exibição completa
- Não há área de scroll dentro do componente
- Texto respira com line-height 1.7

### ✅ Contraste Máximo
- Texto preto (#1d1d1f) - totalmente legível
- Fundo claro (#fafafa) - não cansa vista
- WCAG AAA compliance

### ✅ Monocromático
- Sem cores - apenas preto, branco e cinzas
- Consistente com design system
- Elegante e profissional

## 🔧 Implementação

### Props
```typescript
interface ReferenciaDistribuicaoProps {
  texto: string; // Informações adicionais da NS
}
```

### Uso no PainelAlocacaoDetalhada
```tsx
{/* Referência de Distribuição - Sticky */}
{!isLoading && detalheNotaSaida.infosAdicionais && (
  <ReferenciaDistribuicao texto={detalheNotaSaida.infosAdicionais} />
)}

{/* Resto do conteúdo abaixo */}
<ResumoAlocacao ... />
<Card> {/* Tabs de produtos */} </Card>
```

### Ordem Visual
1. **Botão Voltar** (não sticky)
2. **Alertas** (sucessos/erros)
3. **Referência de Distribuição** ⭐ (STICKY)
4. **Resumo Geral** (não sticky)
5. **Tabs de Produtos** (não sticky)
6. **Tabelas de NEs** (não sticky)

## 📱 Responsividade

### Desktop (≥1024px)
- Padding: 24px
- Font-size título: 1.125rem
- Font-size conteúdo: 0.9375rem

### Tablet (768px - 1023px)
- Padding: 20px
- Font-sizes mantidos

### Mobile (<768px)
- Padding: 16px
- Ícone: 36x36px (reduzido)
- Content padding-left ajustado

## ♿ Acessibilidade

### Contraste
- ✅ Título preto sobre cinza claro: ~16:1 (WCAG AAA)
- ✅ Conteúdo preto sobre cinza claro: ~16:1 (WCAG AAA)

### Keyboard Navigation
- Não interativo (apenas leitura)
- Focável via tab? Não necessário

### Screen Readers
- Título semântico: `<Typography variant="h6">`
- Conteúdo bem estruturado
- TODO: Adicionar aria-label="Referência de distribuição"

## 🐛 Edge Cases

### Texto Muito Longo
```tsx
// ✅ Quebra palavras automaticamente
wordBreak: 'break-word'

// ✅ Preserva espaços e quebras de linha
whiteSpace: 'pre-wrap'

// ✅ Sem scroll - expande altura necessária
// O sticky continua funcionando normalmente
```

### Texto com Caracteres Especiais
```tsx
// ✅ Renderiza corretamente
<Typography>{texto}</Typography>

// Exemplos suportados:
// - Quebras de linha: \n
// - Tabs: \t
// - Bullets: • ● ○
// - Setas: → ← ↑ ↓
```

### Texto Vazio
```tsx
if (!texto || texto.trim() === '') {
  return null; // Não renderiza nada
}
```

## 📊 Comparação: Antes vs Depois

### Antes (TextField dentro do ResumoAlocacao):
```
❌ Dentro de um card menor
❌ Com scroll (rows={3})
❌ Baixa hierarquia visual
❌ Não era sticky
❌ Texto cinza (menor contraste)
❌ Label "Informações Adicionais" separada
```

### Depois (Componente Dedicado Sticky):
```
✅ Componente separado de alta hierarquia
✅ Sem scroll - exibição completa
✅ Visualmente destacado (border preta forte)
✅ Sticky - sempre visível ao scrollar
✅ Texto preto (contraste máximo)
✅ Título integrado com ícone
✅ Design monocromático elegante
```

## 🎨 Tokens de Design

```css
/* Border */
--border-strong: 2px solid #1d1d1f;

/* Background */
--bg-reference: #fafafa;

/* Icon Box */
--icon-bg: #1d1d1f;
--icon-color: #ffffff;
--icon-size: 40px;
--icon-radius: 10px;

/* Typography */
--title-weight: 700;
--title-size: 1.125rem;
--title-color: #1d1d1f;

--content-weight: 500;
--content-size: 0.9375rem;
--content-color: #1d1d1f;
--content-line-height: 1.7;

/* Spacing */
--padding: 24px;
--header-gap: 12px;
--content-margin-top: 16px;
--content-padding-left: 56px;

/* Sticky */
--sticky-top: 16px;
--z-index: 100;
```

## ✅ Status

| Item | Status | Observações |
|------|--------|-------------|
| Componente Criado | ✅ Completo | `ReferenciaDistribuicao.tsx` |
| Integração | ✅ Completo | `PainelAlocacaoDetalhada.tsx` |
| Sticky Behavior | ✅ Completo | position: sticky, top: 16px |
| Design Monocromático | ✅ Completo | Preto, branco e cinzas |
| Tipografia Alta Hierarquia | ✅ Completo | Font-weight 700/500, preto |
| Sem Scroll Interno | ✅ Completo | whiteSpace: 'pre-wrap' |
| Responsividade | 🟡 Básico | Desktop OK, mobile precisa ajustes |
| Acessibilidade | 🟡 Básico | Contraste OK, faltam ARIA labels |
| Documentação | ✅ Completo | Este arquivo |

---

**Criado:** 2025-10-06  
**Versão:** 1.0  
**Design:** Monochrome Minimalist - Sticky Reference Component 🖤
