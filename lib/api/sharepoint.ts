/**
 * API Client - SharePoint
 */

import { apiClient } from './client';
import { urls } from './api_info';

export interface ColetaXMLResponse {
  success: boolean;
  message: string;
  processados?: number;
  errors?: string[];
}

/**
 * Coleta novos arquivos XML do SharePoint e processa as notas
 * ATENÇÃO: Esta rota pode demorar bastante pois processa todos os XMLs encontrados
 */
export async function coletarXMLsSharePoint(): Promise<ColetaXMLResponse> {
  try {
    console.log('[API] 📥 Iniciando coleta de XMLs do SharePoint...');
    
    const endpoint = urls.coletarXMLsSharePoint;
    
    if (!endpoint) {
      throw new Error('Endpoint de coleta de XMLs não configurado');
    }
    
    // POST request sem body
    const response = await apiClient<ColetaXMLResponse>(endpoint, {
      method: 'POST',
    });
    
    console.log('[API] ✅ Coleta concluída:', response);
    
    return response;
  } catch (error) {
    console.error('[API] ❌ Erro ao coletar XMLs:', error);
    throw error;
  }
}
