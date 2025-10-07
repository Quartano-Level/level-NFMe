export const urls = {
  listagemNotasSaida:
    "https://savixx-clonex-mp.app.n8n.cloud/webhook/06ce0737-0d9d-4a7c-b050-b2684913cded?filCod=10&pageNumber=",
  detailNotaSaida:
    "https://savixx-clonex-mp.app.n8n.cloud/webhook/06ce0737-0d9d-4a7c-b050-b2684913cdey",
  getNotasEntradaByNotaSaida:
    "https://savixx-clonex-mp.app.n8n.cloud/webhook/06ce0737-0d9d-4a7c-b050-b2684913cdes",
  processarAlocacao:
    "https://savixx-clonex-mp.app.n8n.cloud/webhook/6ce267f3-3048-4ed9-994b-16ba1567b7ef",
  coletarXMLsSharePoint:
    "https://savixx-clonex-mp.app.n8n.cloud/webhook/97b0db9a-5fe3-43cb-ac07-ad3055f041ed",
};

export interface ListagemNotasSaidaResponse {
  count: number;
  pageNumber: number;
  rows: DetalheNota[];
}

/**
 * Response da listFront - retorna pendentes E sem_vinculo
 */
export interface ListagemNotasSaidaComVinculoResponse {
  pendentes: ListagemNotasSaidaResponse;
  sem_vinculo: ListagemNotasSaidaResponse;
}

export interface DetailNotaSaidaResponse {
  detalheNota: DetalheNota;
  produtos: Produtos;
  infosAdicionais: string;
}

export interface DetalheNota {
  filCod: number;
  docTip: number;
  docCod: number;
  priCod: number | null;
  docVldTipo: number;
  docDtaRecebimento: number | null;
  docDtaEmissao: number;
  docDtaMovimento: number;
  docEspNumero: string;
  docVldTipoAdto: number;
  tpdCod: number;
  pesCod: number;
  dpeCodSeq: number;
  pgtCod: number;
  gerNum: number;
  docVldCopia: number;
  docVldPrevisao: number;
  docMnyValor: number;
  docDtaDigitacao: number;
  docMemComple: string | null;
  docMemObs: string | null;
  usnCodCad: number;
  pedCod: number | null;
  pedCodList: number | null;
  pedVldTipo: number | null;
  fisVldNfemitida: number;
  pdcDocFederal: string;
  amzCod: number;
  fisVldExonerado: number;
  fisVldTipodoc: number;
  docVldFinalizado: number;
  docVldNfehom: number;
  docVldConferencia: number | null;
  vldEnviarConferencia: number;
  endCod: number;
  fisEspObs: string | null;
  fisEspInfadfisco: string;
  fisEspObsLivroFiscal: string | null;
  fisNumDocumento: number;
  priEspRefcliente: string | null;
  priVldTipo: number | null;
  tpdDesNome: string;
  dpeNomPessoa: string;
  vldRwCondpgt: number;
  pgtDesNome: string;
  vldRwPlanfin: number;
  dpeVldContaPlano: number;
  gerDes: string;
  amzDesNome: string;
  endEspZipcod: string;
  endEspZipInter: string | null;
  paDesNome: string;
  ufEspSigla: string;
  endDesCidade: string;
  endDesBairro: string;
  endDesLogradouro: string;
  endEspNlogradouro: string;
  usnDesNome: string;
  espSerie: string;
  vldStatus: number;
  serVldAltnumnf: number;
  vldProcLiberado: number;
  vldDtMovLiberada: number;
  vldDtEmisLiberada: number;
  docVldSistema: number;
  gcdCod: number;
  gcdDesNome: string;
  gcdVldLibalter: number;
  qtdItens: number;
  mnyBruto: number;
  mnyAcrescimo: number;
  mnyDesconto: number;
  mnyTitValor: number;
  mnyTitPago: number;
  mnyTitPermuta: number;
  mnyTitAberto: number;
  mnyTitPermutar: number;
  mnyPis: number;
  mnyCofins: number;
  mnyCsll: number;
  mnyIrrf: number;
  mnyIcms: number;
  mnyIpi: number;
  mnyIcmsSub: number;
  vldNfe: number;
  vldTpNf: string;
  vldAutorizado: number;
  docVldSituacao: number;
  fisCodVendedor: number | null;
  dpeNomPessoaVend: string | null;
  fisCod: number;
  fisVldFundap: number;
  fisVldFundapDesc: string;
  tpdVldQuitAdto: number;
  odfCod: number | null;
  docCodNfVenda: number | null;
  docTipNfVenda: number | null;
  prjCod: number;
  ctpCod: number | null;
  pprCodLoteNf: number | null;
  moeCod: number | null;
  moeEspNome: string | null;
  moeEspSigla: string | null;
  ctpDesNome: string | null;
  titDtaVencimento: number | null;
  docEspNumeroNfVenda: string | null;
  edwCod: number | null;
  edwEspIdent: string | null;
  edwEspIdent2: string | null;
  edwEspIdMiro: string | null;
  edwVldStatus: number | null;
  vldTipoDocFinSap: number | null;
  edwTimStatus: number | null;
  edwTimUltCons: number | null;
  fdnCodSeq: number | null;
  docEspDocest: string;
  docEspIsuf: string | null;
  dpeQtdCaracteresPo: number | null;
  taxaCambio: number | null;
  edwEspIdMigo: string | null;
  tpdEspModfiscal: string | null;
  cnpCod: number | null;
  cnpEspNum: string | null;
  right: string;
  hasNfVendaVinc: number;
}

export interface Produtos {
  count: number;
  pageNumber: number;
  summary: Summary;
  rows: ProdutoRow[];
}

export interface Summary {
  dprVlrLiquidoTotal: number;
  dprQtdItensTotal: number;
}

export interface ProdutoRow {
  filCod: number;
  docTip: number;
  docVldTipo: number;
  docCod: number;
  fisCod: number;
  prdCod: number;
  dprCodSeq: number;
  usnCod: number;
  tpcCod: number;
  cfoEspCod: string;
  dprLngComplemento: string | null;
  prjCod: number;
  ctpCod: number;
  ccuCod: number;
  dprQtdQuantidade: number;
  dprPreValorun: number;
  dprPreTotalbruto: number;
  dprPreTotalLiquido: number;
  undCod: number;
  dprQtdUnidades: number;
  dprQtdUma: number | null;
  priCod: number | null;
  docDtaVencimento: number | null;
  dprPreVlrOrig: number;
  amzCodDestino: number | null;
  dprLngDescrNf: string | null;
  ungCod: number | null;
  dprVldOrigMerc: number;
  moeCodPrestcont: number | null;
  dprPreValorPrestcont: number | null;
  dprMnyDescontos: number | null;
  vldPermiteArmaz: number;
  vldPermiteApto: number;
  prdDesNome: string;
  tpcDesNome: string;
  undDesNome: string;
  undEspSigla: string | null;
  ctpDesNome: string;
  ctpEspConta: string | null;
  ccuDesNome: string;
  usnDesNome: string;
  pruQtdEmbalagem: number;
  amzDesNome: string | null;
  prdEspCodExport: string | null;
  ungDesNome: string | null;
  moeEspNome: string | null;
  fisVldNfemitida: number;
  dprVldCstIssqn: number;
  dprVldCstIssqnDesc: string | null;
  dprVldCstIcms: number;
  dprVldCstIcmsDesc: string | null;
  dprVldEqdCod: number;
  dprVldCstIpi: number;
  dprVldCstIpiDesc: string | null;
  dprVldCstPis: number;
  dprVldCstPisDesc: string | null;
  dprVldCstCofins: number;
  dprVldCstCofinsDesc: string | null;
  dprVldMotdesicms: number;
  dprVldMotdesicmsDesc: string | null;
  cfoVldModBCst: number;
  dprVldCsosn: number;
  dprVldCsosnDesc: string | null;
  preFator: number;
  preFator2: number;
  preFator3: number;
  valorParcela: number;
  sptCodNbcPiscofins: number;
  sptCodNcredPis: number;
  sptCodNcredCofins: number;
  dprVldNfrete: number;
  scpCodDnrec: number;
  sptCodNbcPiscofinsDesc: string | null;
  sptCodNbcPiscofinsCodigo: string | null;
  sptIdNbcPiscofins: string | null;
  sptGrupoNbcPiscofins: string | null;
  sptCodNcredPisDesc: string | null;
  sptCodNcredPisCodigo: string | null;
  sptIdNcredPis: string | null;
  sptGrupoNcredPis: string | null;
  sptCodNcredCofinsDesc: string | null;
  sptCodNcredCofinsCodigo: string | null;
  sptIdNcredCofins: string | null;
  sptGrupoNcredCofins: string | null;
  scpEspDesItem: string | null;
  scpEspCodItem: string | null;
  scpEspTabela: string | null;
  scpEspDesGrupo: string | null;
  dprVldNfreteCod: number;
  dprVldNfreteDesc: string | null;
  cfbEspCodBeneficio: string | null;
  docEspNumeroNfVenda: string | null;
  dprFltCustoMedio: number;
  lteEspCod: string | null;
  odfCod: number | null;
  cdiEspNumero: string | null;
  cdiCod: number | null;
  cdiCodSeq: number | null;
  adiCod: number | null;
  idiCod: number | null;
  dprNumSeloIni: number | null;
  dprNumSeloFim: number | null;
  dprEspNfci: string | null;
  cfoVldEx: number;
  cfoVldDw: number;
  vldLotesSeries: number;
  dprVldBeneficio: number;
  dprQtdUnidadesTrib: number;
  undCodTrib: number;
  undDesNomeTrib: string;
  dprPreValorunTrib: number;
  tipoCfop: number;
  mixCod: number;
  prdQtdNcm: number;
  ccuEspConta: string;
  dprNumPedCom: number;
  dprNumItemPedCom: number;
  dprVldSisQtdTrib: number;
  titCod: number;
  dprEspMotivoRestCompl: string | null;
  vldAtualizaCcustoItem: number;
  docCodNfVenda: number;
  docTipNfVenda: number;
  fisCodNfVenda: number;
  prdCodNfVenda: number;
  dprCodSeqNfVenda: number;
  espSerieNfVenda: string;
  tecEspCod: string;
  tecEspCodSeq: string;
  filCodAto: number;
  datCod: number;
  daiCod: number;
  daiEspNumero: string | null;
  daiVldModalidade: number;
  daiVldTipo: number;
  dprEspNrselo: string | null;
  dprNumQtselo: number;
  numeroPo: number | null;
  itemPo: number;
  invCod: number;
  iniItem: number;
  cntCod: number;
  cntEspNumero: string | null;
  dimEspNum: string | null;
  dimCod: number;
  dioCod: number;
  diiCod: number;
  priEspRefcliente: string | null;
  docMnyValorExt: number;
  dprPreValorunExt: number;
  dprVldCstIbsCbs: string;
  cbiCodIbsCbs: number;
  cbiEspClassTribIbsCbs: string | null;
  cbiDesClassTribIbsCbs: string | null;
  ccuCodDefault: boolean;
}

export interface NotasEntradaByNotaSaidaData {
  detalheNota: DetalheNota;
  produtos: Produtos;
  infosAdicionais: string;
}

export interface NotasEntradaByNotaSaidaResponse {
  data: NotasEntradaByNotaSaidaData[];
}