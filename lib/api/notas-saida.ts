/**
 * API Client - Notas de Saída
 */

import { apiClient } from './client';
import {
  DetailNotaSaidaResponse,
  ListagemNotasSaidaComVinculoResponse,
  ListagemNotasSaidaFilialItem,
  urls
} from './api_info';

/**
 * Busca notas de saída - retorna pendentes E sem_vinculo
 * A API retorna um objeto com pendentes, sem_vinculo (docCods), conta_e_ordem_terceiros e last_execution
 */
export async function getNotasSaida(pageNumber: number = 1): Promise<ListagemNotasSaidaComVinculoResponse> {
  try {
    const endpoint = urls.listagemNotasSaida;

    console.log('[API] Buscando notas de saída (pendentes e sem vínculo)...', endpoint);

    const rawResponse = await apiClient<ListagemNotasSaidaFilialItem>(endpoint + pageNumber);

    // Extrair dados da resposta
    const todasNotas = rawResponse.pendentes?.rows || [];
    const contaOrdemTerceiros = rawResponse.conta_e_ordem_terceiros;
    const lastExecution = rawResponse.last_execution;

    // Verificar se sem_vinculo veio no formato completo (com rows) ou vazio (com doccod_saidas: null)
    let notasSemVinculo: typeof todasNotas = [];
    let notasPendentes = todasNotas;

    if ('rows' in rawResponse.sem_vinculo && rawResponse.sem_vinculo.rows) {
      // Formato completo - sem_vinculo já vem com as notas
      notasSemVinculo = rawResponse.sem_vinculo.rows;
      // Neste caso, todasNotas são as pendentes, sem_vinculo vem separado
    } else {
      // Formato vazio (doccod_saidas: null) - todas as notas são pendentes
      notasPendentes = todasNotas;
      notasSemVinculo = [];
    }

    const response: ListagemNotasSaidaComVinculoResponse = {
      pendentes: {
        count: notasPendentes.length,
        pageNumber: pageNumber,
        rows: notasPendentes
      },
      sem_vinculo: {
        count: notasSemVinculo.length,
        pageNumber: pageNumber,
        rows: notasSemVinculo
      },
      conta_e_ordem_terceiros: contaOrdemTerceiros?.count && contaOrdemTerceiros.count > 0
        ? contaOrdemTerceiros
        : null,
      last_execution: lastExecution
    };

    console.log('[API] ✅ Notas encontradas:', {
      pendentes: response.pendentes.count,
      sem_vinculo: response.sem_vinculo.count,
      conta_e_ordem_terceiros: response.conta_e_ordem_terceiros?.count || 0,
      last_execution: lastExecution?.status || 'N/A'
    });

    return response;
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar notas de saída:', error);
    throw error;
  }
}

export async function getNotaSaidaDetalhada(docCod: number): Promise<DetailNotaSaidaResponse> {
  try {
    const endpoint = urls.detailNotaSaida;

    console.log('[API] Buscando nota de saída com produtos:', docCod);

    const response = await apiClient<DetailNotaSaidaResponse>(`${endpoint}?docCod=${docCod}`);

    return response;
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar nota de saída com produtos:', error);
    throw error;
  }
}

/**
 * Response da finalização de nota de saída
 */
export interface FinalizarNotaResponse {
  success: boolean;
  message: string;
  [key: string]: unknown; // Permitir campos adicionais da API
}

/**
 * Finaliza uma nota de saída de conta e ordem de terceiros
 */
export async function finalizarNotaSaida(docCodSaida: number): Promise<FinalizarNotaResponse> {
  try {
    const endpoint = urls.finalizarNotaSaida;

    console.log('[API] Finalizando nota de saída:', docCodSaida);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ docCodSaida }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log('[API] ✅ Nota finalizada com sucesso:', data);

    return data;
  } catch (error) {
    console.error('[API] ❌ Erro ao finalizar nota de saída:', error);
    throw error;
  }
}