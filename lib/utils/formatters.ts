/**
 * Utilitários de Formatação
 * Padrão brasileiro: . para milhar, , para decimal
 */

/**
 * Formata um número como moeda brasileira (R$)
 * @param value - Valor numérico
 * @returns String formatada como moeda (ex: R$ 1.234,56)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata um número com separadores brasileiros
 * @param value - Valor numérico
 * @param decimals - Número de casas decimais (padrão: 2)
 * @returns String formatada (ex: 1.234,56)
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formata um número como quantidade/unidades
 * @param value - Valor numérico
 * @returns String formatada (ex: 1.234,50)
 */
export function formatQuantity(value: number): string {
  return formatNumber(value, 2);
}

/**
 * Formata um número como percentual
 * @param value - Valor de 0 a 100
 * @returns String formatada (ex: 95,50%)
 */
export function formatPercent(value: number): string {
  return `${formatNumber(value, 2)}%`;
}

/**
 * Formata o nome de uma coluna para exibição formal
 * Remove underscores, adiciona espaços e capitaliza cada palavra
 * @param columnName - Nome da coluna (ex: "nome_fornecedor")
 * @returns Nome formatado para exibição (ex: "Nome Fornecedor")
 * 
 * @example
 * formatColumnName("nome_fornecedor") // "Nome Fornecedor"
 * formatColumnName("codigo_produto") // "Codigo Produto"
 * formatColumnName("data_criacao") // "Data Criacao"
 */
export function formatColumnName(columnName: string): string {
  return columnName
    .split('_')
    .map(word => {
      // Capitaliza a primeira letra e mantém o resto em minúsculas
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}
