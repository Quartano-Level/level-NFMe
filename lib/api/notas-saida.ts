/**
 * API Client - Notas de Saída
 */

import { apiClient, getEndpoint } from './client';
import type { NotaSaida, ListaNotasSaidaResponse, NotaSaidaDetalhada, ProdutoNotaSaida } from '@/lib/types/notas';

/**
 * Busca lista de notas de saída (versão frontend)
 */
export async function getNotasSaidaFront(): Promise<NotaSaida[]> {
  try {
    const endpoint = getEndpoint('notasSaida.listFront');
    
    console.log('[API] Buscando notas de saída...', endpoint);
    
    const response = await apiClient<any>(endpoint);
    
    // NOVA API: Retorna direto { count, pageNumber, rows }
    if (response && 'rows' in response && Array.isArray(response.rows)) {
      console.log('[API] ✅ Notas de saída carregadas:', response.rows.length, 'de', response.count);
      return response.rows;
    }
    
    // FALLBACK: Formato antigo - array com um único objeto contendo { count, pageNumber, rows }
    if (Array.isArray(response) && response.length > 0) {
      const data = response[0];
      
      if (data && 'rows' in data && Array.isArray(data.rows)) {
        console.log('[API] ✅ Notas de saída carregadas (formato antigo):', data.rows.length, 'de', data.count);
        return data.rows;
      }
    }
    
    // FALLBACK: Se for array direto
    if (Array.isArray(response)) {
      console.log('[API] ✅ Notas de saída carregadas (array direto):', response.length);
      return response;
    }
    
    console.warn('[API] ⚠️ Formato de resposta inesperado:', response);
    return [];
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar notas de saída:', error);
    throw error;
  }
}

/**
 * Busca detalhes completos de uma nota de saída incluindo todos os produtos
 * Esta é a rota principal para carregar dados do painel de alocação
 */
export async function getNotaSaidaComProdutos(docCod: number): Promise<NotaSaidaDetalhada | null> {
  // 🎭 MOCK para nota 71 - Simulação para demo
  if (docCod === 71) {
    console.log('[API] 🎭 MOCK: Retornando dados simulados para NS 71');
    
    const mockData: NotaSaidaDetalhada = {
      detalheNota: {
        filCod: 1,
        docTip: 2,
        docCod: 71,
        docEspNumero: "71",
        fisNumDocumento: 71,
        docDtaEmissao: new Date("2024-10-01").getTime(),
        docDtaMovimento: new Date("2024-10-01").getTime(),
        docDtaDigitacao: new Date("2024-10-01").getTime(),
        docMnyValor: 10000.00,
        pesCod: 1,
        dpeNomPessoa: "Cliente Demo",
        pdcDocFederal: "12345678000199",
        tpdCod: 1,
        tpdDesNome: "Nota Fiscal de Saída",
        espSerie: "1",
        vldStatus: 1,
        docVldFinalizado: 0,
        qtdItens: 2,
        mnyBruto: 10000.00,
        endDesCidade: "São Paulo",
        endDesLogradouro: "Rua Demo",
        ufEspSigla: "SP",
        vldNfe: 0,
        vldAutorizado: 0,
      },
      produtos: {
        count: 2,
        pageNumber: 1,
        summary: {
          dprVlrLiquidoTotal: 10000.00,
          dprQtdItensTotal: 150,
        },
        rows: [
          {
            filCod: 1,
            docTip: 2,
            docCod: 71,
            prdCod: 1234,
            dprCodSeq: 1,
            prdDesNome: "Produto A",
            dprQtdQuantidade: 100,
            dprPreValorun: 60.00,
            dprPreTotalbruto: 6000.00,
            dprPreTotalLiquido: 6000.00,
            undCod: 1,
            undDesNome: "Unidade",
            undEspSigla: "UN",
            tecEspCod: "0000",
          },
          {
            filCod: 1,
            docTip: 2,
            docCod: 71,
            prdCod: 5678,
            dprCodSeq: 2,
            prdDesNome: "Produto B",
            dprQtdQuantidade: 50,
            dprPreValorun: 80.00,
            dprPreTotalbruto: 4000.00,
            dprPreTotalLiquido: 4000.00,
            undCod: 1,
            undDesNome: "Unidade",
            undEspSigla: "UN",
            tecEspCod: "0000",
          },
        ],
      },
    };
    
    console.log('[API] ✅ MOCK: NS 71 carregada com 2 produtos');
    return mockData;
  }
  
  try {
    const endpoint = getEndpoint('notasSaida.getDetailWithProducts');
    
    console.log('[API] Buscando nota de saída com produtos:', docCod);
    
    // NOVA API: usa query parameter ?docCod=<docCod>
    const response = await apiClient<any>(`${endpoint}?docCod=${docCod}`);
    
    console.log('[API] Response recebido:', response);
    
    // NOVA API: Retorna direto { detalheNota, produtos }
    if (response && 'detalheNota' in response && 'produtos' in response) {
      console.log('[API] ✅ Nota de saída carregada:', {
        numero: response.detalheNota.docEspNumero,
        produtos: response.produtos.rows.length,
        valorTotal: response.produtos.summary.dprVlrLiquidoTotal
      });
      
      return response;
    }
    
    // FALLBACK: Formato antigo { data: [{ detalheNota, produtos }] }
    if (response && 'data' in response && Array.isArray(response.data) && response.data.length > 0) {
      const notaDetalhada = response.data[0];
      
      if (notaDetalhada && 'detalheNota' in notaDetalhada && 'produtos' in notaDetalhada) {
        console.log('[API] ✅ Nota de saída carregada (formato antigo):', {
          numero: notaDetalhada.detalheNota.docEspNumero,
          produtos: notaDetalhada.produtos.rows.length,
          valorTotal: notaDetalhada.produtos.summary.dprVlrLiquidoTotal
        });
        
        return notaDetalhada;
      }
    }
    
    console.warn('[API] ⚠️ Nota de saída não encontrada ou formato inesperado:', docCod, response);
    return null;
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar nota de saída com produtos:', error);
    throw error;
  }
}

/**
 * Busca apenas os produtos de uma nota de saída
 */
export async function getProdutosNotaSaida(docCod: number): Promise<ProdutoNotaSaida[]> {
  try {
    const notaDetalhada = await getNotaSaidaComProdutos(docCod);
    
    if (!notaDetalhada) {
      return [];
    }
    
    console.log('[API] ✅ Produtos da nota de saída:', notaDetalhada.produtos.rows.length);
    return notaDetalhada.produtos.rows;
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar produtos da nota de saída:', error);
    throw error;
  }
}

/**
 * Busca uma nota de saída específica por docCod (com detalhes completos)
 */
export async function getNotaSaidaById(docCod: number): Promise<NotaSaida | null> {
  try {
    const endpoint = getEndpoint('notasSaida.getDetail');
    
    console.log('[API] Buscando detalhes da nota de saída:', docCod);
    
    // A API usa query parameter: ?<docCod>
    const response = await apiClient<any>(`${endpoint}?${docCod}`);
    
    // A API retorna um array com único objeto (não tem rows)
    if (Array.isArray(response) && response.length > 0) {
      console.log('[API] ✅ Detalhes da nota de saída carregados:', response[0].docEspNumero);
      return response[0];
    }
    
    // Fallback: se retornar objeto direto
    if (response && typeof response === 'object' && 'docCod' in response) {
      console.log('[API] ✅ Detalhes da nota de saída carregados:', response.docEspNumero);
      return response;
    }
    
    console.warn('[API] ⚠️ Nota de saída não encontrada:', docCod);
    return null;
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar detalhes da nota de saída:', error);
    throw error;
  }
}
