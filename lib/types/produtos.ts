/**
 * Tipos relacionados a Produtos
 */

export interface Produto {
  prdCod: number;
  prdDesNome: string;
  prdEspCodExterno?: string;
  prdEspDescred?: string;
  undEspSigla?: string;
  undDesNome?: string;
  tecEspCod?: string;
  tecMemMercadoria?: string;
  saldo?: number;
  prdVldSituacao?: number;
  prdTimAtualiza?: number;
  // Permitir outros campos da API
  [key: string]: unknown;
}

export interface ListaProdutosResponse {
  count: number;
  pageNumber: number;
  rows: Produto[];
}
