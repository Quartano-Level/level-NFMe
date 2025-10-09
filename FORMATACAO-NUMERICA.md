# Padronização de Formatação Numérica

## Objetivo
Garantir que todos os números no frontend sigam o padrão brasileiro:
- **`.` (ponto)** para separador de milhar
- **`,` (vírgula)** para separador decimal

## Funções Utilitárias Criadas

### Arquivo: `lib/utils/formatters.ts`

```typescript
// Formata como moeda: R$ 1.234,56
formatCurrency(value: number): string

// Formata número com decimais: 1.234,56
formatNumber(value: number, decimals: number = 2): string

// Formata quantidade/unidades: 1.234,50
formatQuantity(value: number): string

// Formata percentual: 95,50%
formatPercent(value: number): string
```

## Arquivos Atualizados

### ✅ app/components/TabelaNotasSaida.tsx
- **Linha ~339**: Valor da nota (`docMnyValor`)
  - **Antes**: `formatCurrency(ns.docMnyValor)` (local)
  - **Depois**: `formatCurrency(ns.docMnyValor)` (importado)
  - **Formato**: R$ 182.309,29

### ✅ app/components/ResumoAlocacao.tsx
- **Linha ~72**: Total Exigido
  - **Antes**: `totalExigido.toFixed(2)`
  - **Depois**: `formatQuantity(totalExigido)`
  - **Formato**: 1.234,50

- **Linha ~84**: Total Alocado
  - **Antes**: `totalAlocado.toFixed(2)`
  - **Depois**: `formatQuantity(totalAlocado)`
  - **Formato**: 1.234,50

### ✅ app/components/AlocacaoPorProduto.tsx
- **Linha ~162**: Quantidade Exigida do Produto
  - **Antes**: `produto.dprQtdQuantidade.toFixed(2)`
  - **Depois**: `formatQuantity(produto.dprQtdQuantidade)`
  - **Formato**: 1.234,50

- **Linha ~167**: Quantidade Alocada do Produto
  - **Antes**: `quantidadeAlocadaProduto.toFixed(2)`
  - **Depois**: `formatQuantity(quantidadeAlocadaProduto)`
  - **Formato**: 1.234,50

- **Linha ~180**: Quantidade Faltante (Alert)
  - **Antes**: `(produto.dprQtdQuantidade - quantidadeAlocadaProduto).toFixed(2)`
  - **Depois**: `formatQuantity(produto.dprQtdQuantidade - quantidadeAlocadaProduto)`
  - **Formato**: 123,45

- **Linha ~244**: Quantidade Disponível na NE (Tabela)
  - **Antes**: `{produtoFiltrado?.dprQtdQuantidade}`
  - **Depois**: `{formatQuantity(produtoFiltrado?.dprQtdQuantidade ?? 0)}`
  - **Formato**: 1.234,50

- **Linhas ~109-119**: Helper Functions para Input Brasileiro
  ```tsx
  const parseNumberBR = (value: string): number => {
    if (!value || value.trim() === '') return 0;
    const normalized = value.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatInputValue = (value: number): string => {
    if (value === 0) return '';
    return value.toString().replace('.', ',');
  };
  ```

- **Linhas ~263-266**: TextField com Formatação Brasileira no Input
  - **Antes**: `type="number"`, `value={selectedItem?.quantidade || 0}`, `onChange={parseFloat(e.target.value)}`
  - **Depois**: `type="text"`, `value={formatInputValue(selectedItem?.quantidade || 0)}`, `onChange={parseNumberBR(e.target.value)}`
  - **Formato de Input**: Aceita `123,45` (vírgula como decimal)
  - **Armazenamento**: Converte para `123.45` (ponto como decimal)

## Verificação de Cálculos

Os cálculos internos (não exibidos ao usuário) **não foram alterados**:
- Soma de quantidades (`dprQtdQuantidade`)
- Comparações (`quantidadeAlocada === quantidadeExigida`)
- Cálculos de progresso (`(alocado / exigido) * 100`)
- Validações de máximo disponível

Apenas a **exibição visual** foi formatada para o padrão brasileiro.

## Exemplos de Formatação

| Valor Original | Antes | Depois |
|---------------|-------|--------|
| 1234.5 | `1234.50` | `1.234,50` |
| 182309.29 | `R$ 182309.29` | `R$ 182.309,29` |
| 0.75 | `0.75` | `0,75` |
| 10000 | `10000.00` | `10.000,00` |

## Status

✅ **CONCLUÍDO** - Todos os números exibidos ao usuário seguem o padrão brasileiro (pt-BR).
✅ **CONCLUÍDO** - Campos de entrada (input) aceitam vírgula como separador decimal.

**Total de localizações atualizadas: 8**
- **Display**: 7 locais (valores monetários + quantidades)
- **Input**: 1 local (campo de quantidade a alocar)

## Testes Recomendados

### Display (Exibição)
1. ✅ Verificar lista de notas (valores em R$)
2. ✅ Verificar resumo de alocação (quantidades)
3. ✅ Verificar alocação por produto (quantidades exigidas/alocadas)
4. ✅ Verificar alertas de quantidade faltante
5. ✅ Verificar tabela de notas de entrada disponíveis

Todos devem mostrar:
- `.` para milhar (ex: 1.234)
- `,` para decimal (ex: 56,78)

### Input (Entrada de Dados)
6. ✅ Digitar quantidade com vírgula: `123,45`
7. ✅ Verificar conversão interna: `123.45`
8. ✅ Testar valores sem parte decimal: `100`
9. ✅ Testar valores com milhares: `1.234,56` ou `1234,56`
10. ✅ Campo vazio deve ser tratado como `0`

**Comportamento esperado:**
- Usuário digita: `123,45`
- Sistema armazena: `123.45`
- Display mostra: `123,45`
