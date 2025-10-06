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