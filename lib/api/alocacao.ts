/**
 * API Client - Processamento de Alocação
 */

import { apiClient, getEndpoint } from './client';

/**
 * Payload de alocação individual
 */
export interface AlocacaoProduto {
  docCodEntrada: number;      // Código da Nota de Entrada
  prdCod: number;              // Código do Produto
  quantidade: number;          // Quantidade a alocar
  dprCodSeqEntrada: number;    // Sequência do produto na NE
  dprCodSeqSaida: number;      // Sequência do produto na NS
}

/**
 * Payload completo de processamento
 */
export interface PayloadProcessamentoAlocacao {
  docCodSaida: number;         // Código da Nota de Saída
  produtos: AlocacaoProduto[]; // Lista de alocações
}

/**
 * Resposta do processamento
 */
export interface RespostaProcessamento {
  success: boolean;
  message?: string;
  data?: unknown;
}

/**
 * Processa a alocação de uma Nota de Saída com suas Notas de Entrada
 * @param payload - Payload com docCodSaida e produtos alocados
 * @returns Resposta do processamento
 */
export async function processarAlocacao(
  payload: PayloadProcessamentoAlocacao
): Promise<RespostaProcessamento> {
  try {
    const endpoint = getEndpoint('alocacao.processar');
    
    console.log('[API] 📤 Processando alocação:', payload);
    console.log('[API] Endpoint:', endpoint);
    
    if (!endpoint) {
      throw new Error('Endpoint de processamento de alocação não configurado');
    }
    
    const response = await apiClient<RespostaProcessamento>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    console.log('[API] ✅ Alocação processada com sucesso:', response);
    return response;
  } catch (error) {
    console.error('[API] ❌ Erro ao processar alocação:', error);
    throw error;
  }
}

/**
 * Gera o payload de alocação a partir dos dados do componente
 * @param docCodSaida - Código da Nota de Saída
 * @param alocacoesPorProduto - Mapa de alocações organizadas por produto
 * @param produtosDaNS - Lista de produtos da Nota de Saída (para pegar dprCodSeqSaida)
 * @returns Payload formatado para envio
 */
export function gerarPayloadAlocacao(
  docCodSaida: number,
  alocacoesPorProduto: Map<string, Array<{
    docCodEntrada: number;
    prdCod: number;
    quantidade: number;
    dprCodSeqEntrada: number;
    dprCodSeqSaida: number;
  }>>,
): PayloadProcessamentoAlocacao {
  const produtos: AlocacaoProduto[] = [];
  
  // Achata o mapa em um array único
  alocacoesPorProduto.forEach((alocacoes) => {
    produtos.push(...alocacoes);
  });
  
  return {
    docCodSaida,
    produtos,
  };
}
