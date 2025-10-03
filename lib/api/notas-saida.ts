/**
 * API Client - Notas de Saída
 */

import { apiClient } from './client';
import { DetailNotaSaidaResponse, ListagemNotasSaidaResponse, urls } from './api_info';

export async function getNotasSaida(pageNumber: number = 1): Promise<ListagemNotasSaidaResponse> {
  try {
    const endpoint = urls.listagemNotasSaida;
    
    console.log('[API] Buscando notas de saída...', endpoint);
    
    const response = await apiClient<ListagemNotasSaidaResponse>(endpoint + pageNumber);

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