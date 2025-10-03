/**
 * Cliente HTTP base para comunicação com a API
 */

import apiRoutes from '@/api-routes.json';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Cliente HTTP genérico
 */
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    console.log('[API Client] Fazendo requisição para:', endpoint);
    
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    console.log('[API Client] Status da resposta:', response.status);
    console.log('[API Client] Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as unknown;
      throw new ApiError(
        errorData as string || `Erro HTTP: ${response.status}`,
        response.status,
        errorData
      );
    }

    // Pegar o texto bruto primeiro para debug
    const textResponse = await response.text();
    console.log('[API Client] Resposta bruta (primeiros 500 chars):', textResponse.substring(0, 500));

    // Tentar parsear como JSON
    if (!textResponse || textResponse.trim() === '') {
      console.warn('[API Client] Resposta vazia!');
      return [] as T;
    }

    try {
      const jsonData = JSON.parse(textResponse);
      console.log('[API Client] JSON parseado com sucesso:', jsonData);
      return jsonData;
    } catch (parseError) {
      console.error('[API Client] Erro ao parsear JSON:', parseError);
      console.error('[API Client] Texto que tentou parsear:', textResponse);
      throw new ApiError('Resposta da API não é um JSON válido');
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Erro desconhecido na requisição'
    );
  }
}

/**
 * Helper para obter endpoints do api-routes.json
 */
export function getEndpoint(path: string): string {
  const parts = path.split('.');
  let current: unknown = apiRoutes.routes;
  
  for (const part of parts) {
    current = (current as Record<string, unknown>)[part];
    if (!current) {
      throw new Error(`Endpoint não encontrado: ${path}`);
    }
  }
  
  return (current as Record<string, unknown>).endpoint as string;
}
