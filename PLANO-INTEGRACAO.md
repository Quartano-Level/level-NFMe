# 📋 Planejamento de Integração - Sistema de Gestão de Estoque

## 🎯 Objetivo
Substituir todos os mocks por integrações reais com a API, tornando o sistema 100% funcional.

---

## 📊 Análise do Sistema Atual

### Páginas Identificadas:
1. **Página Principal** (`/`) - Dashboard
2. **Referência** (`/alocacao`) - Sistema de Referência de produtos

### Componentes:
- `PainelAlocacaoDetalhada.tsx`
- `TabelaNotasSaida.tsx`

---

## 🔄 Ordem de Integração Recomendada

### **FASE 1: Fundação - Dados Base** 
*Integrar primeiro as rotas de leitura que alimentam o sistema*

#### 1.1 - Produtos (PRIORIDADE MÁXIMA) ⭐
**Rota:** `GET /produtos`
- **Por quê primeiro?** Os produtos são a base de todo o sistema
- **Impacto:** Usado em todas as telas que exibem informações de produtos
- **Complexidade:** Baixa (apenas GET, sem filtros complexos)
- **Dependências:** Nenhuma

#### 1.2 - Listagem de Notas de Entrada
**Rota:** `GET /notas-entrada`
- **Por quê?** Notas de entrada são a origem do estoque
- **Impacto:** Necessário para visualizar o que entrou no estoque
- **Complexidade:** Baixa
- **Dependências:** Produtos (para exibir informações completas)

#### 1.3 - Listagem de Notas de Saída
**Rota:** `GET /notas-saida` ou `GET /notas-saida/front`
- **Por quê?** Complementa a visualização do fluxo de estoque
- **Impacto:** Usado na página de Referência (TabelaNotasSaida)
- **Complexidade:** Baixa
- **Dependências:** Produtos

---

### **FASE 2: Detalhamento**
*Integrar rotas que mostram informações detalhadas*

#### 2.1 - Detalhes de Nota de Entrada
**Rota:** `GET /notas-entrada/:id`
- **Impacto:** Visualização completa de uma nota
- **Complexidade:** Média
- **Dependências:** Listagem de notas de entrada

#### 2.2 - Detalhes de Nota de Saída
**Rota:** `GET /notas-saida/:id`
- **Impacto:** Visualização completa de uma nota de saída
- **Complexidade:** Média
- **Dependências:** Listagem de notas de saída

#### 2.3 - Produto da Nota (Entrada e Saída)
**Rotas:** 
- `GET /notas-entrada/:notaId/produto/:produtoId`
- `GET /notas-saida/:notaId/produto/:produtoId`
- **Impacto:** Drill-down em produtos específicos
- **Complexidade:** Média

---

### **FASE 3: Funcionalidades de Busca e Match**
*Integrar rotas que facilitam a Referência*

#### 3.1 - Match de Notas por Código de Produto
**Rota:** `GET /notas-entrada/match?prdCod[]=XXX&prdCod[]=YYY`
- **Por quê?** Essencial para sistema de Referência
- **Impacto:** Permite encontrar notas de entrada que contêm produtos específicos
- **Complexidade:** Média/Alta
- **Dependências:** Notas de entrada, Produtos
- **Uso:** Tela de Referência - encontrar de onde alocar

#### 3.2 - Listagem de Notas e Produtos para Referência
**Rota:** `GET /alocacao/notas-produtos`
- **Por quê?** Específico para a tela de Referência
- **Impacto:** Painel de Referência detalhada
- **Complexidade:** Média
- **Dependências:** Todas as rotas anteriores

---

### **FASE 4: XML e Importação**
*Integrar processamento de XMLs*

#### 4.1 - Leitura de XML
**Rota:** `GET /xml/detail?xml=...`
- **Por quê?** Permite preview de notas antes de salvar
- **Impacto:** Funcionalidade de importação
- **Complexidade:** Alta (parsing de XML)
- **Dependências:** Nenhuma

#### 4.2 - Processamento e Salvamento de XML
**Rota:** `POST /xml/process`
- **Por quê?** Permite adicionar novas notas ao sistema
- **Impacto:** Criação de novas notas de entrada/saída
- **Complexidade:** Alta
- **Dependências:** Leitura de XML

---

### **FASE 5: Processamento de Saídas (CORE DO NEGÓCIO)** 🎯
*As funcionalidades mais críticas e complexas*

#### 5.1 - Processar Nota de Saída Simples
**Rota:** `POST /notas-saida/processar`
- **Por quê?** Registra saída de produtos
- **Impacto:** Operação principal do sistema
- **Complexidade:** Alta
- **Dependências:** Todas as anteriores

#### 5.2 - Processar NF Saída com Base em Entrada (Referência AUTOMÁTICA)
**Rota:** `POST /notas-saida/processar-com-entrada`
- **Por quê?** Referência automática - coração do sistema
- **Impacto:** Principal diferencial do sistema
- **Complexidade:** Muito Alta
- **Dependências:** Todas as rotas anteriores
- **Uso:** PainelAlocacaoDetalhada

---

## 🚀 Primeira Integração Recomendada

### **COMEÇAR POR: Lista de Produtos** ✅

```typescript
// Rota: GET /produtos
// Arquivo sugerido: app/api/produtos/route.ts ou lib/api/produtos.ts
```

### Motivos:
1. ✅ **Sem dependências** - funciona independentemente
2. ✅ **Baixa complexidade** - apenas GET simples
3. ✅ **Alto impacto** - usado em múltiplas telas
4. ✅ **Teste rápido** - fácil validar se API está funcionando
5. ✅ **Base para tudo** - outros endpoints dependem deste

### Próximos passos após Produtos:
1. Listagem de Notas de Entrada
2. Listagem de Notas de Saída (front)
3. Testar componente TabelaNotasSaida com dados reais
4. Seguir para detalhamentos

---

## 📝 Checklist de Integração (por rota)

Para cada rota, seguir:
- [ ] Adicionar URL no `api-routes.json`
- [ ] Criar/atualizar função de fetch
- [ ] Criar tipos TypeScript para response
- [ ] Remover mock correspondente
- [ ] Atualizar componentes que usam a rota
- [ ] Testar em desenvolvimento
- [ ] Tratamento de erros
- [ ] Loading states
- [ ] Validação de dados

---

## 🎨 Estrutura Sugerida

```
lib/
  api/
    client.ts          # Cliente base com baseURL
    produtos.ts        # Funções relacionadas a produtos
    notas-entrada.ts   # Funções de notas de entrada
    notas-saida.ts     # Funções de notas de saída
    alocacao.ts        # Funções de Referência
    xml.ts             # Funções de processamento XML
  types/
    api.ts             # Tipos de request/response
    produtos.ts        # Tipos de produtos
    notas.ts           # Tipos de notas
```

---

## ⚠️ Pontos de Atenção

1. **Tratamento de Erros**: Implementar error boundaries e fallbacks
2. **Loading States**: Skeletons para melhor UX
3. **Cache**: Considerar SWR ou React Query para cache inteligente
4. **Validação**: Zod para validar responses da API
5. **Tipos**: TypeScript strict para evitar erros em runtime
6. **Performance**: Lazy loading e otimização de requests

---

## 📊 Métricas de Sucesso

- [ ] Zero mocks em produção
- [ ] Todas as telas funcionando com dados reais
- [ ] Tempo de resposta < 2s para listagens
- [ ] Tratamento de erros em 100% das requests
- [ ] Testes automatizados para integrações críticas

