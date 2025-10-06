/**
 * Tipos relacionados a Notas Fiscais
 */

export interface ProdutoNotaSaida {
  filCod: number;
  docTip: number;
  docCod: number;
  prdCod: number;
  dprCodSeq: number;
  prdDesNome: string;
  dprQtdQuantidade: number;
  dprPreValorun: number;
  dprPreTotalbruto: number;
  dprPreTotalLiquido: number;
  undCod: number;
  undDesNome: string;
  undEspSigla?: string;
  tecEspCod: string;
  lteEspCod?: string;
  prdEspCodExport?: string;
  // Permitir outros campos da API
  [key: string]: unknown;
}

export interface NotaSaidaDetalhada {
  detalheNota: NotaSaida;
  produtos: {
    count: number;
    pageNumber: number;
    summary: {
      dprVlrLiquidoTotal: number;
      dprQtdItensTotal: number;
    };
    rows: ProdutoNotaSaida[];
  };
  infosAdicionais: string;
}

export interface NotaSaida {
  filCod: number;
  docTip: number;
  docCod: number;
  docEspNumero: string;
  fisNumDocumento: number;
  docDtaEmissao: number;
  docDtaMovimento: number;
  docDtaDigitacao: number;
  docMnyValor: number;
  pesCod: number;
  dpeNomPessoa: string;
  pdcDocFederal: string;
  tpdCod: number;
  tpdDesNome: string;
  espSerie: string;
  vldStatus: number;
  docVldFinalizado: number;
  qtdItens: number;
  mnyBruto: number;
  endDesCidade?: string;
  endDesLogradouro?: string;
  ufEspSigla?: string;
  usnDesNome?: string;
  gerDes?: string;
  amzDesNome?: string;
  vldNfe: number;
  vldAutorizado: number;
  // Permitir outros campos da API
  [key: string]: unknown;
}

export interface ListaNotasSaidaResponse {
  count: number;
  pageNumber: number;
  rows: NotaSaida[];
}

/**
 * Response da API listFront - separada em pendentes e sem_vinculo
 */
export interface ListaNotasSaidaComVinculoResponse {
  pendentes: ListaNotasSaidaResponse;
  sem_vinculo: ListaNotasSaidaResponse;
}

export interface NotaEntrada {
  filCod: number;
  docTip: number;
  docCod: number;
  docEspNumero: string;
  fisNumDocumento: number;
  docDtaEmissao: number;
  docDtaMovimento: number;
  docDtaDigitacao: number;
  docMnyValor: number;
  pesCod: number;
  dpeNomPessoa: string;
  pdcDocFederal: string;
  tpdCod: number;
  tpdDesNome: string;
  espSerie: string;
  vldStatus: number;
  docVldFinalizado: number;
  qtdItens: number;
  mnyBruto: number;
  endDesCidade?: string;
  endDesLogradouro?: string;
  ufEspSigla?: string;
  usnDesNome?: string;
  gerDes?: string;
  amzDesNome?: string;
  docMemObs?: string;
  fisEspObs?: string;
  gcdDesNome?: string;
  // Permitir outros campos da API
  [key: string]: unknown;
}

export interface ListaNotasEntradaResponse {
  count: number;
  pageNumber: number;
  rows: NotaEntrada[];
}
