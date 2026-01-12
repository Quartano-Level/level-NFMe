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

/**
 * Marca uma nota com erro como concluída
 * @param sharepointId ID da nota no SharePoint (obrigatório para identificar a linha na tabela)
 * @param deleteOnSharepoint Se deve remover a nota do SharePoint
 */
export async function checkNotaErro(
    sharepointId: string,
    deleteOnSharepoint: boolean = false
): Promise<void> {
    try {
        const endpoint = 'https://level-nfse.app.n8n.cloud/webhook/check_error';

        console.log('[API] Marcando nota com erro como concluída...', { sharepointId, deleteOnSharepoint });

        // sharepoint_id sempre é enviado porque é necessário para identificar qual linha remover da tabela
        const payload: { delete_on_sharepoint: boolean; sharepoint_id: string } = {
            delete_on_sharepoint: deleteOnSharepoint,
            sharepoint_id: sharepointId,
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        console.log('[API] ✅ Nota marcada como concluída com sucesso');
    } catch (error) {
        console.error('[API] ❌ Erro ao marcar nota como concluída:', error);
        throw error;
    }
}
