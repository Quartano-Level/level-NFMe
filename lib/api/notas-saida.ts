/**
 * API Client - Notas de Saída
 */

import { apiClient } from './client';
import { 
  DetailNotaSaidaResponse, 
  ListagemNotasSaidaComVinculoResponse,
  urls 
} from './api_info';

/**
 * Busca notas de saída - retorna pendentes E sem_vinculo
 */
export async function getNotasSaida(pageNumber: number = 1): Promise<ListagemNotasSaidaComVinculoResponse> {
  try {
    const endpoint = urls.listagemNotasSaida;
    
    console.log('[API] Buscando notas de saída (pendentes e sem vínculo)...', endpoint);
    
    const response = await apiClient<ListagemNotasSaidaComVinculoResponse>(endpoint + pageNumber);

    console.log('[API] ✅ Notas encontradas:', {
      pendentes: response.pendentes.count,
      sem_vinculo: response.sem_vinculo.count
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