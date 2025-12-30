/**
 * API Client - Notas Pendentes (com erro)
 */

export interface NotaPendente {
    id: number;
    created_at: string;
    doc_esp_num: string;
    sharepoint_id: string;
    sharepoint_name: string;
    sharepoint_url: string;
    motivo: string;
    docCod: string | null;
    details: string | null;
}

/**
 * Busca todas as notas pendentes (com erro)
 */
export async function getNotasPendentes(): Promise<NotaPendente[]> {
    try {
        const endpoint = 'https://level-nfse.app.n8n.cloud/webhook/notas_pendentes';

        console.log('[API] Buscando notas pendentes (com erro)...', endpoint);

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

        console.log('[API] ✅ Notas pendentes encontradas:', notas.length, 'registros');

        return notas;
    } catch (error) {
        console.error('[API] ❌ Erro ao buscar notas pendentes:', error);
        throw error;
    }
}
