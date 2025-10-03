/**
 * API Client - Notas de Entrada
 */

import { apiClient } from './client';
import { NotasEntradaByNotaSaidaData, NotasEntradaByNotaSaidaResponse, urls, } from './api_info';

/**
 * Busca NEs que contêm produtos de uma Nota de Saída específica
 * Esta é a rota OTIMIZADA que retorna tudo de uma vez
 * @param docCodSaida - Código da Nota de Saída
 * @returns NEs com detalhes e produtos, já filtradas e com produtos em comum
 */
export async function getNotasEntradaByNotaSaida(docCodSaida: number): Promise<NotasEntradaByNotaSaidaData[]> {
  try {
    const endpoint = urls.getNotasEntradaByNotaSaida;
    
    if (!endpoint) {
      console.warn('[API] ⚠️ Endpoint getNotasEntradaByNotaSaida não configurado');
      return [];
    }
    
    console.log('[API] 🔍 Buscando NEs com produtos da NS:', docCodSaida);
    
    const url = `${endpoint}?docCodSaida=${docCodSaida}`;
    console.log('[API] 📡 URL da requisição:', url);
    
    const response = await apiClient<NotasEntradaByNotaSaidaResponse>(url);
    
    console.log('[API] 📥 Response completo:', JSON.stringify(response, null, 2));
    
    // API retorna: { data: [{ detalheNota, produtos }] }
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      const nesComProdutos = response.data;
      
      console.log('[API] 📊 Total de NEs no response.data:', nesComProdutos.length);
      
      // Ordenar por FIFO (data de emissão)
      const nesOrdenadas = nesComProdutos.sort((a: NotasEntradaByNotaSaidaData, b: NotasEntradaByNotaSaidaData) => 
        a.detalheNota.docDtaEmissao - b.detalheNota.docDtaEmissao
      );
      
      console.log('[API] ✅ NEs encontradas:', nesOrdenadas.length);
      
      return nesOrdenadas;
    }
    
    console.warn('[API] ⚠️ Nenhuma NE encontrada ou formato inesperado:', response);
    return [];
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar NEs por NS:', error);
    throw error;
  }
}
