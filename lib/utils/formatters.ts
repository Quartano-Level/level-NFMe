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
