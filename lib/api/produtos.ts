/**
 * API Client - Produtos
 */

import { apiClient, getEndpoint } from './client';
import type { Produto, ListaProdutosResponse } from '@/lib/types/produtos';

/**
 * Busca lista de todos os produtos
 */
export async function getProdutos(): Promise<Produto[]> {
  try {
    const endpoint = getEndpoint('produtos.listAll');
    
    console.log('[API] Buscando produtos...', endpoint);
    
    const response = await apiClient<any>(endpoint);
    
    // Verifica se tem a estrutura esperada { count, pageNumber, rows }
    if (response && 'rows' in response && Array.isArray(response.rows)) {
      console.log('[API] ✅ Produtos carregados:', response.rows.length, 'de', response.count);
      return response.rows;
    }
    
    // Suporta array direto
    if (Array.isArray(response)) {
      console.log('[API] ✅ Produtos carregados:', response.length);
      return response;
    }
    
    // Suporta objeto com propriedade 'produtos'
    if (response && 'produtos' in response) {
      console.log('[API] ✅ Produtos carregados:', response.produtos.length);
      return response.produtos;
    }
    
    console.warn('[API] ⚠️ Formato de resposta inesperado:', response);
    return [];
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar produtos:', error);
    throw error;
  }
}

/**
 * Busca um produto específico por ID
 * (Para uso futuro, quando tivermos essa rota)
 */
export async function getProdutoById(id: string): Promise<Produto | null> {
  try {
    const produtos = await getProdutos();
    return produtos.find(p => p.id === id) || null;
  } catch (error) {
    console.error('[API] Erro ao buscar produto:', error);
    throw error;
  }
}
