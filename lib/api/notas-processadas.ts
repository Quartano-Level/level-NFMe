/**
 * API Client - Notas Processadas
 */

export interface NotaProcessada {
  id: string;
  created_at: string;
  sharepoint_name: string;
  sharepoint_id: string;
  docCod: string;
  numero_nota?: string;
  cliente?: string;
  conexos_status: string;
  pesCod: string;
  products_cods: string[];
  total_count: string;
}

export interface NotasProcessadasResponse {
  data: NotaProcessada[];
  total: number;
}

export interface FiltrosNotasProcessadas {
  docCod?: string;
  numero_nota?: string;
  cliente?: string;
  pesCod?: string;
}

/**
 * Busca notas processadas e finalizadas com paginação e filtros
 */
export async function getNotasProcessadas(
  page: number = 1,
  limit: number = 10,
  filtros?: FiltrosNotasProcessadas
): Promise<NotasProcessadasResponse> {
  try {
    const endpoint = new URL('https://level-nfse.app.n8n.cloud/webhook/notas_processadas');
    endpoint.searchParams.set('page', page.toString());
    endpoint.searchParams.set('limit', limit.toString());
    
    // Adicionar filtros como query params apenas se estiverem definidos
    if (filtros) {
      if (filtros.docCod?.trim()) {
        endpoint.searchParams.set('docCod', filtros.docCod.trim());
      }
      if (filtros.numero_nota?.trim()) {
        endpoint.searchParams.set('numero_nota', filtros.numero_nota.trim());
      }
      if (filtros.cliente?.trim()) {
        endpoint.searchParams.set('cliente', filtros.cliente.trim());
      }
      if (filtros.pesCod?.trim()) {
        endpoint.searchParams.set('pesCod', filtros.pesCod.trim());
      }
    }
    
    console.log('[API] Buscando notas processadas...', endpoint.toString());
    
    const response = await fetch(endpoint.toString(), {
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
    
    // Pegar o total_count da primeira nota (todas têm o mesmo valor)
    const total = notas.length > 0 ? parseInt(notas[0].total_count || '0', 10) : 0;
    
    console.log('[API] ✅ Notas processadas encontradas:', notas.length, 'registros de', total, 'total');

    return {
      data: notas,
      total,
    };
  } catch (error) {
    console.error('[API] ❌ Erro ao buscar notas processadas:', error);
    throw error;
  }
}

