"use client";

import { useState, useEffect, SyntheticEvent } from "react";
import useSWR from "swr";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Box,
  CircularProgress,
  Stack,
  LinearProgress,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Chip,
  Paper,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import SendIcon from "@mui/icons-material/Send";

// API
import { getNotasEntrada, getNotasEntradaByNotaSaida, getProdutoDaNotaEntrada } from "@/lib/api/notas-entrada";
import { processarAlocacao, type PayloadProcessamentoAlocacao } from "@/lib/api/alocacao";
import type { NotaEntrada } from "@/lib/types/notas";

// ==================== TIPOS ====================

type ProdutoDemanda = {
  prdCod: number;
  dprCodSeq: number;
  nome: string;
  quantidadeExigida: number;
};

type NotaSaida = {
  docCod: number;
  numero: string;
  cliente: string;
  dataEmissao: string;
  produtos: ProdutoDemanda[];
};

type AlocacaoItem = {
  docCodEntrada: number;
  numeroNE: string;
  dataEntrada: string;
  quantidade: number;
  dprCodSeqEntrada: number;
};

// ==================== PROPS ====================

interface PainelAlocacaoDetalhadaProps {
  notaSaidaSelecionada: NotaSaida;
  onVoltar: () => void;
  // onAlocacaoChange removido - não precisa sincronizar com pai
  // quantidadeTotalAlocada e quantidadeTotalExigida calculados localmente
  onProcessar: () => void;
  isLoading: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`product-tabpanel-${index}`} aria-labelledby={`product-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// ==================== COMPONENTE DE ALOCAÇÃO POR PRODUTO ====================

const AlocacaoPorProduto = ({
  produto,
  docCodSaida,
  alocacoesProduto,
  onSelecaoNE,
  onQuantidadeChange,
}: {
  produto: ProdutoDemanda;
  docCodSaida: number;
  alocacoesProduto: AlocacaoItem[];
  onSelecaoNE: (ne: NotaEntrada, selecionado: boolean) => void;
  onQuantidadeChange: (docCodEntrada: number, quantidade: number) => void;
}) => {
  const [nesRelevantes, setNesRelevantes] = useState<NotaEntrada[]>([]);
  const [isLoadingNes, setIsLoadingNes] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [fifoAplicado, setFifoAplicado] = useState(false);

  // Carregar NEs que contêm produtos da NS (ROTA OTIMIZADA)
  useEffect(() => {
    const carregarNEs = async () => {
      try {
        setIsLoadingNes(true);
        setError(null);

        console.log(`[AlocacaoPorProduto] Buscando NEs com produtos da NS ${docCodSaida}...`);
        console.log(`[AlocacaoPorProduto] Produto procurado: prdCod=${produto.prdCod}, nome="${produto.nome}"`);

        // NOVA ROTA OTIMIZADA: Retorna todas as NEs com produtos da NS de uma vez
        const nesComProdutos = await getNotasEntradaByNotaSaida(docCodSaida);

        console.log(`[AlocacaoPorProduto] 📦 NEs recebidas da API:`, nesComProdutos.length);
        console.log(`[AlocacaoPorProduto] 🔍 Detalhes das NEs:`, nesComProdutos);

        // ✅ EXIBIR TODAS as NEs retornadas (backend já filtra por vínculo)
        // O backend retorna apenas NEs vinculadas à NS, não precisa filtrar por produto aqui
        const nesParaExibir = nesComProdutos.map((neData) => neData.detalheNota);

        console.log(`[AlocacaoPorProduto] ✅ Total de NEs para exibir:`, nesParaExibir.length);
        nesParaExibir.forEach((ne, idx) => {
          console.log(`[AlocacaoPorProduto]   ${idx + 1}. NE ${ne.docEspNumero} - ${ne.dpeNomPessoa}`);
        });

        setNesRelevantes(nesParaExibir);
      } catch (err: any) {
        console.error('[AlocacaoPorProduto] ❌ Erro ao carregar NEs:', err);
        setError(err);
      } finally {
        setIsLoadingNes(false);
      }
    };

    carregarNEs();
  }, [produto.prdCod, docCodSaida]);

  // Aplicar FIFO automaticamente quando NEs carregarem
  useEffect(() => {
    if (nesRelevantes.length > 0 && alocacoesProduto.length === 0 && !fifoAplicado) {
      console.log(`[AlocacaoPorProduto] 🤖 Aplicando FIFO automático para ${produto.nome}...`);

      let quantidadeRestante = produto.quantidadeExigida;

      // Percorrer NEs em ordem FIFO (já vêm ordenadas)
      for (const ne of nesRelevantes) {
        if (quantidadeRestante <= 0) break;

        // Alocar o máximo possível desta NE
        const quantidadeAlocar = quantidadeRestante; // Simplificado: assume que NE tem estoque suficiente

        // Selecionar NE
        onSelecaoNE(ne, true);

        // Definir quantidade
        setTimeout(() => {
          onQuantidadeChange(ne.docCod, quantidadeAlocar);
        }, 50); // Pequeno delay para garantir que o estado de seleção seja processado

        quantidadeRestante -= quantidadeAlocar;
      }

      setFifoAplicado(true);
      console.log(`[AlocacaoPorProduto] ✅ FIFO aplicado! Alocações criadas automaticamente.`);
    }
  }, [nesRelevantes, alocacoesProduto.length, fifoAplicado, produto, onSelecaoNE, onQuantidadeChange]);

  const quantidadeAlocadaProduto = alocacoesProduto.reduce((acc, curr) => acc + curr.quantidade, 0);
  const progressoProduto = (quantidadeAlocadaProduto / produto.quantidadeExigida) * 100;
  const alocacaoProdutoCompleta = quantidadeAlocadaProduto === produto.quantidadeExigida;

  const handleQuantidadeChangeLocal = (docCodEntrada: number, quantidade: number) => {
    const totalAlocadoEmOutros = alocacoesProduto
      .filter((item) => item.docCodEntrada !== docCodEntrada)
      .reduce((acc, curr) => acc + curr.quantidade, 0);
    const maxPermitido = produto.quantidadeExigida - totalAlocadoEmOutros;
    const valorFinal = Math.min(quantidade, maxPermitido);
    onQuantidadeChange(docCodEntrada, Math.max(0, valorFinal));
  };

  if (isLoadingNes) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Buscando notas de entrada com este produto...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Erro ao carregar NEs</AlertTitle>
        {error.message || "Erro desconhecido"}
      </Alert>
    );
  }

  if (nesRelevantes.length === 0) {
    return (
      <Alert severity="warning">
        <AlertTitle>Nenhuma NE disponível</AlertTitle>
        Não há notas de entrada que contenham este produto.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Quantidade Exigida</Typography>
              <Typography variant="h6">{produto.quantidadeExigida.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="subtitle2" color="text.secondary">Quantidade Alocada</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }} color={alocacaoProdutoCompleta ? "success.main" : "text.primary"}>
                {quantidadeAlocadaProduto.toFixed(2)}
                {alocacaoProdutoCompleta && <CheckCircleIcon sx={{ ml: 1, verticalAlign: "middle" }} color="success" />}
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={Math.min(progressoProduto, 100)} color={alocacaoProdutoCompleta ? "success" : "primary"} sx={{ height: 8, borderRadius: 4 }} />
          </Box>
        </CardContent>
      </Card>

      {!alocacaoProdutoCompleta && quantidadeAlocadaProduto > 0 && (
        <Alert severity="warning" icon={<WarningIcon />}>
          Faltam <strong>{(produto.quantidadeExigida - quantidadeAlocadaProduto).toFixed(2)}</strong> unidades
        </Alert>
      )}

      {fifoAplicado && (
        <Alert severity="info">
          <AlertTitle>✅ FIFO Automático Aplicado</AlertTitle>
          As alocações foram preenchidas automaticamente seguindo a ordem FIFO (First In, First Out).
          Você pode ajustar manualmente se necessário.
        </Alert>
      )}

      <Card variant="outlined">
        <CardHeader title="Notas de Entrada Disponíveis" subheader={`${nesRelevantes.length} notas com este produto (FIFO)`} />
        <CardContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>Número NE</TableCell>
                  <TableCell>Fornecedor</TableCell>
                  <TableCell>Data Emissão</TableCell>
                  <TableCell>Itens</TableCell>
                  <TableCell sx={{ width: "180px" }}>Qtd. a Alocar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nesRelevantes.map((ne) => {
                  const isSelected = alocacoesProduto.some((item) => item.docCodEntrada === ne.docCod);
                  const selectedItem = isSelected ? alocacoesProduto.find((item) => item.docCodEntrada === ne.docCod) : null;

                  return (
                    <TableRow key={ne.docCod} sx={{ "& > .MuiTableCell-root": { py: 2 } }} hover>
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" checked={isSelected} onChange={(e) => onSelecaoNE(ne, e.target.checked)} />
                      </TableCell>
                      <TableCell><Typography variant="body2" fontWeight={500}>{ne.docEspNumero || `NE-${ne.docCod}`}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{ne.dpeNomPessoa || "N/A"}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{new Date(ne.docDtaEmissao).toLocaleDateString("pt-BR")}</Typography></TableCell>
                      <TableCell><Chip label={`${ne.qtdItens} itens`} size="small" variant="outlined" /></TableCell>
                      <TableCell>
                        {isSelected && (
                          <TextField
                            type="number"
                            size="small"
                            variant="outlined"
                            value={selectedItem?.quantidade || 0}
                            onChange={(e) => handleQuantidadeChangeLocal(ne.docCod, parseFloat(e.target.value) || 0)}
                            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                            sx={{ width: "150px" }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================

export const PainelAlocacaoDetalhada = ({
  notaSaidaSelecionada,
  onVoltar,
  onProcessar,
  isLoading,
}: PainelAlocacaoDetalhadaProps) => {
  const [abaAtual, setAbaAtual] = useState(0);
  const [alocacoesPorProduto, setAlocacoesPorProduto] = useState<Record<string, AlocacaoItem[]>>({});
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState<{ sucesso: boolean; mensagem: string } | null>(null);

  // Calcular totais localmente
  const quantidadeTotalExigida = notaSaidaSelecionada.produtos.reduce((acc, p) => acc + p.quantidadeExigida, 0);
  const quantidadeTotalAlocada = Object.values(alocacoesPorProduto)
    .flat()
    .reduce((acc, a) => acc + a.quantidade, 0);

  const handleSelecaoNE = (produtoId: string, ne: NotaEntrada, selecionado: boolean) => {
    setAlocacoesPorProduto((prev) => {
      const alocacoesAtuais = prev[produtoId] || [];
      if (selecionado) {
        return {
          ...prev,
          [produtoId]: [...alocacoesAtuais, { docCodEntrada: ne.docCod, numeroNE: ne.docEspNumero || `NE-${ne.docCod}`, dataEntrada: new Date(ne.docDtaEmissao).toISOString(), quantidade: 0, dprCodSeqEntrada: 1 }],
        };
      } else {
        return { ...prev, [produtoId]: alocacoesAtuais.filter((item) => item.docCodEntrada !== ne.docCod) };
      }
    });
  };

  const handleQuantidadeChange = (produtoId: string, docCodEntrada: number, quantidade: number) => {
    setAlocacoesPorProduto((prev) => {
      const alocacoesAtuais = prev[produtoId] || [];
      return { ...prev, [produtoId]: alocacoesAtuais.map((item) => (item.docCodEntrada === docCodEntrada ? { ...item, quantidade } : item)) };
    });
  };

  const handleMudarAba = (event: SyntheticEvent, novoValor: number) => setAbaAtual(novoValor);

  const handleProcessarAlocacao = async () => {
    setProcessando(true);
    setResultado(null);

    try {
      const payload: PayloadProcessamentoAlocacao = { docCodSaida: notaSaidaSelecionada.docCod, produtos: [] };

      notaSaidaSelecionada.produtos.forEach((produto) => {
        const chaveUnica = `${produto.prdCod}-${produto.dprCodSeq}`;
        const alocacoes = alocacoesPorProduto[chaveUnica] || [];
        alocacoes.forEach((alocacao) => {
          if (alocacao.quantidade > 0) {
            payload.produtos.push({
              docCodEntrada: alocacao.docCodEntrada,
              prdCod: produto.prdCod,
              quantidade: alocacao.quantidade,
              dprCodSeqEntrada: alocacao.dprCodSeqEntrada,
              dprCodSeqSaida: produto.dprCodSeq,
            });
          }
        });
      });

      console.log("📤 Payload gerado:", JSON.stringify(payload, null, 2));

      const resposta = await processarAlocacao(payload);
      setResultado({ sucesso: true, mensagem: resposta.message || "Alocação processada com sucesso!" });
      onProcessar();
    } catch (error: any) {
      console.error("❌ Erro ao processar:", error);
      setResultado({ sucesso: false, mensagem: error.message || "Erro ao processar alocação" });
    } finally {
      setProcessando(false);
    }
  };

  const isProcessamentoHabilitado = quantidadeTotalAlocada === quantidadeTotalExigida && quantidadeTotalAlocada > 0;
  const progresso = quantidadeTotalExigida > 0 ? (quantidadeTotalAlocada / quantidadeTotalExigida) * 100 : 0;

  return (
    <Stack spacing={3}>
      <Button onClick={onVoltar} variant="outlined" startIcon={<ArrowBackIcon />}>Voltar para a lista</Button>

      {resultado && (
        <Alert severity={resultado.sucesso ? "success" : "error"} onClose={() => setResultado(null)}>
          <AlertTitle>{resultado.sucesso ? "Sucesso!" : "Erro"}</AlertTitle>
          {resultado.mensagem}
        </Alert>
      )}

      <Card variant="outlined">
        <CardHeader title="Resumo Geral da Alocação" subheader={`NS nº ${notaSaidaSelecionada.numero}`} />
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2, sm: 4 }} justifyContent="space-between" alignItems={{ sm: "flex-end" }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Cliente</Typography>
              <Typography variant="body1" fontWeight={500}>{notaSaidaSelecionada.cliente}</Typography>
            </Box>
            <Box sx={{ textAlign: { sm: "right" } }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Data Emissão</Typography>
              <Typography variant="body1">{notaSaidaSelecionada.dataEmissao}</Typography>
            </Box>
            <Box sx={{ textAlign: { sm: "right" } }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Total Exigido</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>{quantidadeTotalExigida.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ textAlign: { sm: "right" } }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Total Alocado</Typography>
              <Typography variant="h6" color={isProcessamentoHabilitado ? "success.main" : "text.primary"} sx={{ fontWeight: "bold" }}>{quantidadeTotalAlocada.toFixed(2)}</Typography>
            </Box>
          </Stack>

          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">Progresso Total</Typography>
              <Typography variant="body2" color="text.secondary">{`${Math.round(progresso)}%`}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={Math.min(progresso, 100)} color={isProcessamentoHabilitado ? "success" : "primary"} sx={{ height: 10, borderRadius: 5 }} />
          </Box>
        </CardContent>
        <CardActions sx={{ p: 2, justifyContent: "flex-end" }}>
          <LoadingButton loading={processando || isLoading} onClick={handleProcessarAlocacao} variant="contained" disabled={!isProcessamentoHabilitado} startIcon={<SendIcon />} size="large">
            Processar Alocação
          </LoadingButton>
        </CardActions>
      </Card>

      <Card variant="outlined">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={abaAtual} onChange={handleMudarAba} aria-label="abas de produtos" variant="scrollable" scrollButtons="auto">
            {notaSaidaSelecionada.produtos.map((p, index) => (
              <Tab label={p.nome} key={`tab-${p.prdCod}-${p.dprCodSeq}`} id={`product-tab-${index}`} />
            ))}
          </Tabs>
        </Box>
        {notaSaidaSelecionada.produtos.map((p, index) => (
          <TabPanel value={abaAtual} index={index} key={`panel-${p.prdCod}-${p.dprCodSeq}`}>
            <AlocacaoPorProduto
              produto={p}
              docCodSaida={notaSaidaSelecionada.docCod}
              alocacoesProduto={alocacoesPorProduto[`${p.prdCod}-${p.dprCodSeq}`] || []}
              onSelecaoNE={(ne, sel) => handleSelecaoNE(`${p.prdCod}-${p.dprCodSeq}`, ne, sel)}
              onQuantidadeChange={(docCodEntrada, qtd) => handleQuantidadeChange(`${p.prdCod}-${p.dprCodSeq}`, docCodEntrada, qtd)}
            />
          </TabPanel>
        ))}
      </Card>

      <Card variant="outlined">
        <CardHeader title="🔍 Debug: Payload de Alocação" />
        <CardContent>
          <Paper sx={{ p: 2, bgcolor: "grey.900", color: "grey.100", fontFamily: "monospace", fontSize: "0.875rem", overflow: "auto", maxHeight: "400px" }}>
            <pre>
              {JSON.stringify(
                {
                  docCodSaida: notaSaidaSelecionada.docCod,
                  produtos: notaSaidaSelecionada.produtos.flatMap((produto) => {
                    const chaveUnica = `${produto.prdCod}-${produto.dprCodSeq}`;
                    const alocacoes = alocacoesPorProduto[chaveUnica] || [];
                    return alocacoes.filter((a) => a.quantidade > 0).map((a) => ({
                      docCodEntrada: a.docCodEntrada,
                      prdCod: produto.prdCod,
                      quantidade: a.quantidade,
                      dprCodSeqEntrada: a.dprCodSeqEntrada,
                      dprCodSeqSaida: produto.dprCodSeq,
                    }));
                  }),
                },
                null,
                2
              )}
            </pre>
          </Paper>
        </CardContent>
      </Card>
    </Stack>
  );
};
