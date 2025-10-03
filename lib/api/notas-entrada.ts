/**
 * API Client - Notas de Entrada
 */

import { apiClient, getEndpoint } from './client';
import type { NotaEntrada, ListaNotasEntradaResponse } from '@/lib/types/notas';

/**
 * Busca lista de notas de entrada
 */
export async function getNotasEntrada(): Promise<NotaEntrada[]> {
  try {
    const endpoint = getEndpoint('notasEntrada.listAll');
    
    console.log('[API] Buscando notas de entrada...', endpoint);
    
    const response = await apiClient<any>(endpoint);
    
    // A API retorna um array com um único objeto contendo { count, pageNumber, rows }
    if (Array.isArray(response) && response.length > 0) {
      const data = response[0];
      
      if (data && 'rows' in data && Array.isArray(data.rows)) {
        console.log('[API] ✅ Notas de entrada carregadas:', data.rows.length, 'de', data.count);
        return data.rows;
      }
    }
    
    // Fallback: se for um objeto direto com rows
    if (response && 'rows' in response && Array.isArray(response.rows)) {
      console.log('[API] ✅ Notas de entrada carregadas:', response.rows.length, 'de', response.count);
      return response.rows;
    }
    
    // Fallback: se for array direto
    if (Array.isArray(response)) {
      console.log('[API] ✅ Notas de entrada carregadas:', response.length);
      return response;
    }
    
    console.warn('[API] ⚠️ Formato de resposta inesperado:', response);
    return [];
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar notas de entrada:', error);
    throw error;
  }
}

/**
 * Busca notas de entrada por código do produto (para FIFO)
 * @param prdCod - Código do produto
 * @returns Notas de entrada que contêm o produto, ordenadas por data (FIFO)
 */
export async function getNotasEntradaByProduto(prdCod: number): Promise<NotaEntrada[]> {
  try {
    // TODO: Quando tivermos a rota de match, usar ela
    // Por enquanto, filtramos todas as notas (não é ideal, mas funciona)
    const todasNotas = await getNotasEntrada();
    
    // Ordena por data de entrada (FIFO - First In, First Out)
    const notasOrdenadas = todasNotas.sort((a, b) => a.docDtaEmissao - b.docDtaEmissao);
    
    console.log(`[API] 🔍 Notas de entrada ordenadas por FIFO:`, notasOrdenadas.length);
    return notasOrdenadas;
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar notas de entrada por produto:', error);
    throw error;
  }
}

/**
 * Busca uma nota de entrada específica por ID
 */
export async function getNotaEntradaById(docCod: number): Promise<NotaEntrada | null> {
  try {
    const notas = await getNotasEntrada();
    return notas.find(n => n.docCod === docCod) || null;
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar nota de entrada:', error);
    throw error;
  }
}

/**
 * Verifica se uma NE contém um produto específico
 * @param nrNota - Número da nota (docCod)
 * @param prdCod - Código do produto
 * @returns Dados do produto se encontrado, null caso contrário
 */
export async function getProdutoDaNotaEntrada(nrNota: number, prdCod: number): Promise<any | null> {
  try {
    const endpoint = getEndpoint('notasEntrada.getProduto');
    
    if (!endpoint) {
      console.warn('[API] ⚠️ Endpoint notasEntrada.getProduto não configurado');
      return null;
    }
    
    const url = `${endpoint}?nrNota=${nrNota}&produto=${prdCod}`;
    const response = await apiClient<any>(url);
    
    // Verifica se tem dados na resposta
    if (Array.isArray(response) && response.length > 0 && response[0].rows && response[0].rows.length > 0) {
      return response[0];
    }
    
    return null;
  } catch (error) {
    // Silenciar erro para não poluir console (esperado para muitas combinações)
    return null;
  }
}

/**
 * Busca NEs que contêm produtos de uma Nota de Saída específica
 * Esta é a rota OTIMIZADA que retorna tudo de uma vez
 * @param docCodSaida - Código da Nota de Saída
 * @returns NEs com detalhes e produtos, já filtradas e com produtos em comum
 */
export async function getNotasEntradaByNotaSaida(docCodSaida: number): Promise<Array<{
  detalheNota: NotaEntrada;
  produtos: {
    count: number;
    pageNumber: number;
    summary: {
      dprVlrLiquidoTotal: number;
      dprQtdItensTotal: number;
    };
    rows: any[];
  };
}>> {
  // 🎭 MOCK para nota 71 - Simulação para demo
  if (docCodSaida === 71) {
    console.log('[API] 🎭 MOCK: Retornando dados simulados para NS 71');
    
    const mockData = [
      {
        detalheNota: {
          filCod: 1,
          docCod: 101,
          docTip: 1,
          docEspNumero: "NE-2024-001",
          fisNumDocumento: 101,
          docDtaEmissao: new Date("2024-09-15").getTime(),
          docDtaMovimento: new Date("2024-09-15").getTime(),
          docDtaDigitacao: new Date("2024-09-15").getTime(),
          dpeNomPessoa: "Fornecedor A",
          docMnyValor: 5000.00,
          vldStatus: 1,
          docVldFinalizado: 1,
          pesCod: 1,
          pdcDocFederal: "11111111000111",
          tpdCod: 1,
          tpdDesNome: "Nota Fiscal de Entrada",
          espSerie: "1",
          qtdItens: 2,
          mnyBruto: 5000.00,
          endDesCidade: "São Paulo",
          ufEspSigla: "SP",
        },
        produtos: {
          count: 2,
          pageNumber: 1,
          summary: {
            dprVlrLiquidoTotal: 5000.00,
            dprQtdItensTotal: 100,
          },
          rows: [
            {
              dprCodSeq: 1,
              prdCod: 1234,
              prdNomProduto: "Produto A",
              dprQtdQuantidade: 50,
              dprMnyValorUnitario: 50.00,
              dprMnyValorLiquido: 2500.00,
            },
            {
              dprCodSeq: 2,
              prdCod: 5678,
              prdNomProduto: "Produto B",
              dprQtdQuantidade: 50,
              dprMnyValorUnitario: 50.00,
              dprMnyValorLiquido: 2500.00,
            },
          ],
        },
      },
      {
        detalheNota: {
          filCod: 1,
          docCod: 102,
          docTip: 1,
          docEspNumero: "NE-2024-002",
          fisNumDocumento: 102,
          docDtaEmissao: new Date("2024-09-20").getTime(),
          docDtaMovimento: new Date("2024-09-20").getTime(),
          docDtaDigitacao: new Date("2024-09-20").getTime(),
          dpeNomPessoa: "Fornecedor B",
          docMnyValor: 3000.00,
          vldStatus: 1,
          docVldFinalizado: 1,
          pesCod: 2,
          pdcDocFederal: "22222222000222",
          tpdCod: 1,
          tpdDesNome: "Nota Fiscal de Entrada",
          espSerie: "1",
          qtdItens: 1,
          mnyBruto: 3000.00,
          endDesCidade: "Rio de Janeiro",
          ufEspSigla: "RJ",
        },
        produtos: {
          count: 1,
          pageNumber: 1,
          summary: {
            dprVlrLiquidoTotal: 3000.00,
            dprQtdItensTotal: 60,
          },
          rows: [
            {
              dprCodSeq: 1,
              prdCod: 1234,
              prdNomProduto: "Produto A",
              dprQtdQuantidade: 60,
              dprMnyValorUnitario: 50.00,
              dprMnyValorLiquido: 3000.00,
            },
          ],
        },
      },
      {
        detalheNota: {
          filCod: 1,
          docCod: 103,
          docTip: 1,
          docEspNumero: "NE-2024-003",
          fisNumDocumento: 103,
          docDtaEmissao: new Date("2024-09-25").getTime(),
          docDtaMovimento: new Date("2024-09-25").getTime(),
          docDtaDigitacao: new Date("2024-09-25").getTime(),
          dpeNomPessoa: "Fornecedor C",
          docMnyValor: 4000.00,
          vldStatus: 1,
          docVldFinalizado: 1,
          pesCod: 3,
          pdcDocFederal: "33333333000333",
          tpdCod: 1,
          tpdDesNome: "Nota Fiscal de Entrada",
          espSerie: "1",
          qtdItens: 1,
          mnyBruto: 4000.00,
          endDesCidade: "Belo Horizonte",
          ufEspSigla: "MG",
        },
        produtos: {
          count: 1,
          pageNumber: 1,
          summary: {
            dprVlrLiquidoTotal: 4000.00,
            dprQtdItensTotal: 80,
          },
          rows: [
            {
              dprCodSeq: 1,
              prdCod: 5678,
              prdNomProduto: "Produto B",
              dprQtdQuantidade: 80,
              dprMnyValorUnitario: 50.00,
              dprMnyValorLiquido: 4000.00,
            },
          ],
        },
      },
    ];
    
    console.log('[API] ✅ MOCK: 3 NEs simuladas com produtos');
    mockData.forEach((ne: any, idx: number) => {
      console.log(`[API]   ${idx + 1}. NE ${ne.detalheNota.docEspNumero} - ${ne.produtos.rows.length} produtos - Data: ${new Date(ne.detalheNota.docDtaEmissao).toLocaleDateString()}`);
    });
    
    return mockData;
  }
  
  try {
    const endpoint = getEndpoint('notasEntrada.getMatchByProdCod');
    
    if (!endpoint) {
      console.warn('[API] ⚠️ Endpoint notasEntrada.getMatchByProdCod não configurado');
      return [];
    }
    
    console.log('[API] 🔍 Buscando NEs com produtos da NS:', docCodSaida);
    
    const url = `${endpoint}?docCodSaida=${docCodSaida}`;
    console.log('[API] 📡 URL da requisição:', url);
    
    const response = await apiClient<any>(url);
    
    console.log('[API] 📥 Response completo:', JSON.stringify(response, null, 2));
    
    // API retorna: { data: [{ detalheNota, produtos }] }
    if (response && 'data' in response && Array.isArray(response.data)) {
      const nesComProdutos = response.data;
      
      console.log('[API] 📊 Total de NEs no response.data:', nesComProdutos.length);
      
      // Ordenar por FIFO (data de emissão)
      const nesOrdenadas = nesComProdutos.sort((a: any, b: any) => 
        a.detalheNota.docDtaEmissao - b.detalheNota.docDtaEmissao
      );
      
      console.log('[API] ✅ NEs encontradas:', nesOrdenadas.length);
      
      // Log detalhado
      nesOrdenadas.forEach((ne: any, idx: number) => {
        const produtosInfo = ne.produtos?.rows?.map((p: any) => 
          `${p.prdCod} (${p.prdDesNome || 'sem nome'})`
        ).join(', ') || 'sem produtos';
        
        console.log(`[API]   ${idx + 1}. NE ${ne.detalheNota.docEspNumero} - ${ne.produtos?.rows?.length || 0} produtos - Data: ${new Date(ne.detalheNota.docDtaEmissao).toLocaleDateString()}`);
        console.log(`[API]      Produtos: ${produtosInfo}`);
      });
      
      return nesOrdenadas;
    }
    
    console.warn('[API] ⚠️ Nenhuma NE encontrada ou formato inesperado:', response);
    return [];
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar NEs por NS:', error);
    throw error;
  }
}

/**
 * Filtra NEs que contêm produtos em comum com uma lista de produtos
 * @param produtosCods - Lista de códigos de produtos da NS
 * @returns NEs filtradas e ordenadas por FIFO, com informação de quais produtos têm
 */
export async function getNotasEntradaComProdutos(produtosCods: number[]): Promise<Array<NotaEntrada & { produtosDisponiveis: number[] }>> {
  try {
    console.log('[API] 🔍 Buscando NEs que contêm produtos:', produtosCods);
    
    const todasNEs = await getNotasEntrada();
    const nesOrdenadas = todasNEs.sort((a, b) => a.docDtaEmissao - b.docDtaEmissao); // FIFO
    
    const nesComProdutos: Array<NotaEntrada & { produtosDisponiveis: number[] }> = [];
    
    // Para cada NE, verificar quais produtos ela tem
    for (const ne of nesOrdenadas) {
      const produtosEncontrados: number[] = [];
      
      // Testar cada produto da NS nesta NE
      for (const prdCod of produtosCods) {
        const resultado = await getProdutoDaNotaEntrada(ne.docCod, prdCod);
        if (resultado && resultado.rows && resultado.rows.length > 0) {
          produtosEncontrados.push(prdCod);
        }
      }
      
      // Se encontrou pelo menos 1 produto, adiciona à lista
      if (produtosEncontrados.length > 0) {
        nesComProdutos.push({
          ...ne,
          produtosDisponiveis: produtosEncontrados,
        });
      }
    }
    
    console.log('[API] ✅ NEs com produtos em comum:', nesComProdutos.length, 'de', todasNEs.length);
    return nesComProdutos;
  } catch (error) {
    console.error('[API] ❌ Erro ao filtrar NEs com produtos:', error);
    throw error;
  }
}
