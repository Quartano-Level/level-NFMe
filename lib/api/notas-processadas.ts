/**
 * API Client - Notas Processadas
 */

export interface NotaProcessada {
  id: string;
  created_at: string;
  xml: {
    NFe: {
      infNFe: {
        ide: {
          nNF: string;
          cNF: string;
        };
        dest: {
          xNome: string;
          CNPJ: string;
        };
        emit: {
          xNome: string;
          CNPJ: string;
        };
        total: {
          ICMSTot: {
            vNF: string;
          };
        };
      };
    };
  };
  sharepoint_name: string;
  sharepoint_webUrl: string;
  docCod: string;
  conexos_status: string;
  pesCod: string;
  endCod: string;
  products_cods: unknown;
  warnings: unknown;
}

/**
 * Busca todas as notas processadas e finalizadas
 */
export async function getNotasProcessadas(): Promise<NotaProcessada[]> {
  try {
    const endpoint = 'https://level-nfse.app.n8n.cloud/webhook/notas_processadas';
    
    console.log('[API] Buscando notas processadas...', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    // Garantir que retorna um array
    const notas = Array.isArray(data) ? data : [];
    
    console.log('[API] ✅ Notas processadas encontradas:', notas.length, 'registros');

    return notas;
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar notas processadas:', error);
    throw error;
  }
}

