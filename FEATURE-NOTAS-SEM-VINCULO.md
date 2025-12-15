# Feature: Exibição de Notas SEM Vínculo

## 📋 Resumo

Implementação da funcionalidade para exibir **Notas de Saída (NS) que não possuem vínculo** com Notas de Entrada (NE) no sistema Conexos. Estas são notas onde o XML de entrada referencia NEs que não foram encontradas no banco de dados.

## 🎯 Objetivo

Permitir que o usuário:
1. Visualize facilmente quais NS estão **sem vínculo** (NEs não encontradas)
2. Diferencie visualmente entre NS **pendentes** (com vínculo) e **sem vínculo**
3. **Receba aviso informativo** sobre inconsistências (sem ação de criação de vínculo)

## 🏗️ Estrutura da API

### Endpoint
```
GET https://level-nfse.app.n8n.cloud/webhook/06ce0737-0d9d-4a7c-b050-b2684913cded
```

### Resposta
```typescript
{
  pendentes: {
    count: number;
    pageNumber: number;
    rows: DetalheNota[];
  },
  sem_vinculo: {
    count: number;
    pageNumber: number;
    rows: DetalheNota[];
  }
}
```

### Explicação dos Campos

- **pendentes**: Notas de Saída com vínculos identificados, prontas para Referência FIFO
- **sem_vinculo**: Notas de Saída onde as NEs referenciadas no XML não foram encontradas no Conexos

## 📁 Arquivos Modificados/Criados

### 1. **Tipos TypeScript** (`lib/api/api_info.ts` e `lib/types/notas.ts`)
```typescript
export interface ListagemNotasSaidaComVinculoResponse {
  pendentes: ListagemNotasSaidaResponse;
  sem_vinculo: ListagemNotasSaidaResponse;
}
```

### 2. **API Client** (`lib/api/notas-saida.ts`)
- ✅ Atualizada função `getNotasSaida()` para retornar nova estrutura
- ✅ Adiciona logs para count de pendentes e sem_vinculo

### 3. **Novo Componente** (`app/alocacao/components/AlertaNotasSemVinculo.tsx`)
Componente de alerta visual para exibir notas sem vínculo:

**Características:**
- 🟠 Alert amarelo/laranja com ícone de warning
- 📋 Lista cada nota sem vínculo em card separado
- 🔍 Botão "Detalhes" para ver informações da nota
- 🔗 Botão "Criar Vínculo" para resolver o problema manualmente
- 📊 Exibe informações: NS #, Cliente, NF, Série, Data de Emissão, Qtd. Itens

### 4. **Componente Atualizado** (`app/components/TabelaNotasSaida.tsx`)
- ✅ Exibe alerta de notas sem vínculo **no topo da página**
- ✅ Abaixo, exibe tabela de notas pendentes (com vínculo)
- ✅ Separação visual clara entre os dois grupos
- ✅ Headers descritivos para cada seção

## 🎨 UI/UX

### Layout Visual (Apple Vibes - Minimalista)

```
┌─────────────────────────────────────────────────────┐
│ [🔶] Notas sem vínculo              [⌄]            │
│      5 notas requerem atenção                       │
└─────────────────────────────────────────────────────┘
  ↓ (Clica para expandir - Toggle)
┌─────────────────────────────────────────────────────┐
│ [🔶] Notas sem vínculo              [⌃]            │
│      5 notas requerem atenção                       │
│                                                      │
│ Estas notas referenciam NEs não encontradas...      │
│                                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ NS #89 • AMBEV S.A.       [Criar vínculo]      │ │
│ │ NF 10 • Série 2 • 01/06/2025                   │ │
│ └─────────────────────────────────────────────────┘ │
│ (Repetir para cada nota sem vínculo)                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Notas pendentes                                      │
│ 8 notas prontas para Referência                        │
├─────────────────────────────────────────────────────┤
│ NOTA    CLIENTE    VALOR    EMISSÃO   ITENS         │
│ ────────────────────────────────────────────────    │
│ #82     AMBEV      R$...    01/06     [1]  [Alocar]│
│ #71     AMBEV      R$...    31/05     [1]  [Alocar]│
└─────────────────────────────────────────────────────┘
```

### Design Principles (Apple-inspired)

**✨ Minimalismo:**
- Sem emojis no texto (apenas ícones SVG)
- Border radius 12px (cantos suaves)
- Elevação zero (flat design)
- Border sutil 1px #e5e5e7

**🎨 Cores (Monochrome):**
- Texto primário: #1d1d1f (preto)
- Texto secundário: #86868b (cinza médio)
- **Botão principal: #1d1d1f (preto)** - hover #2c2c2e
- Fundos: #fafafa, #f5f5f5
- **Sem cores** - design 100% monocromático

**📏 Espaçamento:**
- Sistema 8pt grid
- Padding generoso (20-24px)
- Line-height 1.5 (legibilidade)

**🔄 Animações:**
- Cubic-bezier(0.4, 0, 0.2, 1) - Apple timing
- 300ms para expand/collapse
- 200ms para hovers
- Transform suave (translateY -1px)

**💡 Toggle Collapsible:**
- ✅ **Collapsed por padrão** (reduz poluição visual)
- ✅ Clique no header inteiro para expandir
- ✅ Ícone ExpandMore rotaciona 180°
- ✅ Animação suave de 300ms
- ✅ Área clicável grande (toda a barra)

**ℹ️ Propósito Informativo:**
- ✅ **Sem botão "Criar vínculo"** - apenas aviso
- ✅ Badge mostra quantidade de itens
- ✅ Informações essenciais: NS #, Cliente, NF, Série, Data
- ✅ Mensagem clara sobre a inconsistência

### Cores e Ícones

- **Sem Vínculo**: Border cinza sutil (#e5e5e7) - Discreto e informativo
- **Pendentes**: Tabela limpa com border cinza claro
- **Ícones**: ErrorOutline (SVG preto), ExpandMore (SVG preto)
- **Badge**: Fundo #f0f0f0, texto cinza (#86868b)
- **100% Monocromático** - Sem uso de cores

## 🔄 Fluxo de Uso

1. **Usuário acessa página de Referência**
   - Sistema busca notas via `getNotasSaida()`
   - API retorna `pendentes` e `sem_vinculo`

2. **Se houver notas sem vínculo:**
   - Alerta aparece no topo (collapsed por padrão)
   - Usuário pode expandir para ver lista de notas problemáticas
   - **Apenas informativo** - sem ações de criação de vínculo
   - Badge mostra quantidade de itens por nota

3. **Notas pendentes (com vínculo):**
   - Aparecem na tabela abaixo
   - Usuário pode clicar "Alocar" normalmente
   - Fluxo de Referência FIFO funciona como antes

## 🚀 Próximos Passos (TODO)

### Implementações Pendentes:

1. **Modal de Detalhes** (Opcional)
   - Mostrar informações completas da NS
   - Exibir produtos da nota
   - Mostrar NE referenciada no XML (que não foi encontrada)

2. **Notificações/Alertas** (Opcional)
   - Badge no menu lateral com count de sem_vinculo
   - Notificação quando novas sem_vinculo aparecem
   - Email/alerta para responsável

3. **Filtros e Ordenação**
   - Filtrar por cliente
   - Ordenar por data
   - Buscar por número de NF

4. **Histórico**
   - Log de notas sem vínculo identificadas
   - Relatório de inconsistências

> **Nota:** Funcionalidade de criação de vínculo **não será implementada**.  
> O sistema serve apenas para **alertar o analista** sobre inconsistências.

## 🧪 Como Testar

1. **Iniciar servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Acessar:** `http://localhost:3000/alocacao`

3. **Verificar resposta da API:**
   - Abrir DevTools (F12) → Console
   - Procurar por log: `[API] ✅ Notas encontradas: { pendentes: X, sem_vinculo: Y }`

4. **Validar UI:**
   - ✅ Alerta amarelo aparece se houver sem_vinculo
   - ✅ Cards de notas sem vínculo estão visíveis
   - ✅ Botões "Detalhes" e "Criar Vínculo" funcionam
   - ✅ Tabela de pendentes aparece abaixo
   - ✅ Separação visual está clara

5. **Testar com dados reais:**
   - Backend deve ter notas com `status = 'SEM_VINCULO'` na tabela vinculos
   - API deve retornar essas notas no campo `sem_vinculo`

## 📊 Dados de Exemplo

### Resposta da API (Real):
- **Pendentes**: 8 notas (docCod: 82, 71, 70, 67, 66, 65, 64, 63)
- **Sem Vínculo**: 5 notas (docCod: 89, 88, 86, 84, 83)

### Nota Sem Vínculo (Exemplo):
```json
{
  "docCod": 89,
  "docEspNumero": "10",
  "fisNumDocumento": 10,
  "dpeNomPessoa": "AMBEV S.A.",
  "qtdItens": 0,
  "docDtaEmissao": 1759449600000,
  "espSerie": "2",
  "vldStatus": 1
}
```

## 🔍 Troubleshooting

### Problema: Alerta não aparece
- **Verificar:** `data.sem_vinculo.rows` não está vazio
- **Verificar:** Backend está retornando estrutura correta
- **Console:** Procurar erros de parsing/tipo TypeScript

### Problema: Notas duplicadas
- **Verificar:** Keys únicas nas listas (`key={ns.docCod}`)
- **Verificar:** Backend não está duplicando registros

### Problema: Botões não funcionam
- **N/A** - Não há botões de ação (apenas informativo)

## 📝 Observações

- ⚠️ **Performance**: Se houver muitas notas sem vínculo (>20), considerar paginação
- ℹ️ **Propósito**: Sistema é **apenas informativo** - não cria vínculos
- 📱 **Responsivo**: UI funciona em mobile, mas pode precisar ajustes de layout
- ♿ **Acessibilidade**: Adicionar ARIA labels para leitores de tela
- 🎨 **Design**: 100% monocromático - apenas preto, branco e cinzas

## ✅ Status da Feature

| Componente | Status | Observações |
|------------|--------|-------------|
| API Response Type | ✅ Completo | Interface `ListagemNotasSaidaComVinculoResponse` |
| API Client | ✅ Completo | Função `getNotasSaida()` atualizada |
| Componente Alerta | ✅ Completo | `AlertaNotasSemVinculo.tsx` - Informativo |
| Tabela Atualizada | ✅ Completo | `TabelaNotasSaida.tsx` exibe ambos grupos |
| Design Monocromático | ✅ Completo | 100% preto, branco e cinzas |
| Botão Criar Vínculo | ❌ Removido | Sistema apenas informativo |
| Handlers Detalhes | 🔲 Não necessário | Feature informativa |
| Testes | ⏳ Pendente | Aguardando deploy backend |
| Documentação | ✅ Completo | Este arquivo + DESIGN-SYSTEM.md |

---

**Última atualização:** 2025-10-06  
**Autor:** GitHub Copilot + Yuri Toledo  
**Versão:** 2.0 - Monochrome Informative Edition
