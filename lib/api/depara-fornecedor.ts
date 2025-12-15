/**
 * API Client - Depara Fornecedor
 */

import { apiClient } from './client';
import { urls } from './api_info';

/**
 * Tipo genérico para uma linha da tabela de depara
 * Será ajustado conforme a estrutura real retornada pela API
 */
export interface DeparaFornecedorRow {
  id?: number | string;
  [key: string]: unknown; // Permite campos dinâmicos conforme a estrutura real
}

/**
 * Response do GET - lista completa da tabela
 */
export type DeparaFornecedorResponse = DeparaFornecedorRow[] | {
  rows?: DeparaFornecedorRow[];
  data?: DeparaFornecedorRow[];
  [key: string]: unknown;
};

/**
 * Busca a tabela completa de depara fornecedor
 */
export async function getDeparaFornecedor(): Promise<DeparaFornecedorRow[]> {
  try {
    const endpoint = urls.deparaFornecedorProcesso;
    
    console.log('[API] Buscando tabela de depara fornecedor...', endpoint);
    
    const response = await apiClient<DeparaFornecedorResponse>(endpoint, {
      method: 'GET',
    });

    // Normalizar resposta - pode vir como array direto ou objeto com rows/data
    let rows: DeparaFornecedorRow[] = [];
    
    if (Array.isArray(response)) {
      rows = response;
    } else if (response.rows && Array.isArray(response.rows)) {
      rows = response.rows;
    } else if (response.data && Array.isArray(response.data)) {
      rows = response.data;
    } else {
      console.warn('[API] Formato de resposta inesperado:', response);
      rows = [];
    }

    console.log('[API] ✅ Tabela de depara encontrada:', rows.length, 'registros');

    return rows;
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar tabela de depara:', error);
    throw error;
  }
}

/**
 * Adiciona uma nova linha na tabela de depara
 */
export async function createDeparaFornecedor(
  data: DeparaFornecedorRow
): Promise<DeparaFornecedorRow | { success: boolean; message: string }> {
  try {
    const endpoint = urls.deparaFornecedorProcesso;
    
    console.log('[API] Adicionando nova linha na tabela de depara...', data);
    
    const response = await apiClient<DeparaFornecedorRow | { success: boolean; message: string }>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    console.log('[API] ✅ Linha adicionada com sucesso:', response);

    return response;
  } catch (error) {
    console.error('[API] ❌ Erro ao adicionar linha:', error);
    throw error;
  }
}

/**
 * Atualiza uma ou mais linhas na tabela de depara
 */
export async function updateDeparaFornecedor(
  data: DeparaFornecedorRow | DeparaFornecedorRow[]
): Promise<DeparaFornecedorRow[] | { success: boolean; message: string }> {
  try {
    const endpoint = urls.deparaFornecedorProcesso;
    
    console.log('[API] Atualizando linha(s) na tabela de depara...', data);
    
    // Se for array, envia como array, senão envia como objeto único
    const payload = Array.isArray(data) ? data : [data];
    
    const response = await apiClient<DeparaFornecedorRow[] | { success: boolean; message: string }>(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );

    console.log('[API] ✅ Linha(s) atualizada(s) com sucesso:', response);

    return response;
  } catch (error) {
    console.error('[API] ❌ Erro ao atualizar linha(s):', error);
    throw error;
  }
}

/**
 * Remove uma ou mais linhas da tabela de depara
 */
export async function deleteDeparaFornecedor(
  ids: (number | string) | (number | string)[]
): Promise<{ success: boolean; message: string }> {
  try {
    const endpoint = urls.deparaFornecedorProcesso;
    
    console.log('[API] Removendo linha(s) da tabela de depara...', ids);
    
    // Normalizar para array
    const idsArray = Array.isArray(ids) ? ids : [ids];
    
    const response = await apiClient<{ success: boolean; message: string }>(
      endpoint,
      {
        method: 'DELETE',
        body: JSON.stringify({ ids: idsArray }),
      }
    );

    console.log('[API] ✅ Linha(s) removida(s) com sucesso:', response);

    return response;
  } catch (error) {
    console.error('[API] ❌ Erro ao remover linha(s):', error);
    throw error;
  }
}

