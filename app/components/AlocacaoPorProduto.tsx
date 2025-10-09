"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  CircularProgress,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";

import { getNotasEntradaByNotaSaida } from "@/lib/api/notas-entrada";
import { DetalheNota, NotasEntradaByNotaSaidaData, ProdutoRow } from "@/lib/api/api_info";
import { formatQuantity } from "@/lib/utils/formatters";

type AlocacaoItem = {
  docCodEntrada: number;
  numeroNE: string;
  dataEntrada: string;
  quantidade: number;
  dprCodSeqEntrada: number;
};

interface AlocacaoPorProdutoProps {
  produto: ProdutoRow;
  docCodSaida: number;
  alocacoesProduto: AlocacaoItem[];
  onSelecaoNE: (ne: DetalheNota, selecionado: boolean) => void;
  onQuantidadeChange: (docCodEntrada: number, quantidade: number) => void;
}

export function AlocacaoPorProduto({
  produto,
  docCodSaida,
  alocacoesProduto,
  onSelecaoNE,
  onQuantidadeChange,
}: AlocacaoPorProdutoProps) {
  const [nesRelevantes, setNesRelevantes] = useState<NotasEntradaByNotaSaidaData[]>([]);
  const [isLoadingNes, setIsLoadingNes] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [fifoAplicado, setFifoAplicado] = useState(false);

  useEffect(() => {
    const carregarNEs = async () => {
      try {
        setIsLoadingNes(true);
        setError(null);

        const nesComProdutos = await getNotasEntradaByNotaSaida(docCodSaida);
        const nesComProdutosFiltrados = nesComProdutos
          .filter((ne) => ne.produtos.rows.some((p) => p.prdCod === produto.prdCod))
          .sort((a, b) => {
            const da = new Date(a.detalheNota.docDtaEmissao).getTime();
            const db = new Date(b.detalheNota.docDtaEmissao).getTime();
            return da - db; // FIFO: mais antigas primeiro
          });
        setNesRelevantes(nesComProdutosFiltrados);
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoadingNes(false);
      }
    };

    carregarNEs();
  }, [produto.prdCod, docCodSaida, produto.prdDesNome]);

  useEffect(() => {
    if (nesRelevantes.length > 0 && alocacoesProduto.length === 0 && !fifoAplicado) {
      let quantidadeRestante = produto.dprQtdQuantidade;
      for (const ne of nesRelevantes) {
        if (quantidadeRestante <= 0) break;
        const produtoNE = ne.produtos.rows.find((p) => p.prdCod === produto.prdCod);
        const disponivelNE = Math.max(0, produtoNE?.dprQtdQuantidade ?? 0);
        const quantidadeAlocar = Math.min(disponivelNE, quantidadeRestante);
        if (quantidadeAlocar > 0) {
          onSelecaoNE(ne.detalheNota, true);
          // pequeno atraso para garantir que a seleção reflita antes de alterar a quantidade
          setTimeout(() => onQuantidadeChange(ne.detalheNota.docCod, quantidadeAlocar), 50);
          quantidadeRestante -= quantidadeAlocar;
        }
      }
      setFifoAplicado(true);
    }
  }, [nesRelevantes, alocacoesProduto.length, fifoAplicado, produto, onSelecaoNE, onQuantidadeChange]);

  const quantidadeAlocadaProduto = alocacoesProduto.reduce((acc, curr) => acc + curr.quantidade, 0);
  const progressoProduto = (quantidadeAlocadaProduto / produto.dprQtdQuantidade) * 100;
  const alocacaoProdutoCompleta = quantidadeAlocadaProduto === produto.dprQtdQuantidade;

  const handleQuantidadeChangeLocal = (docCodEntrada: number, quantidade: number) => {
    const totalAlocadoEmOutros = alocacoesProduto
      .filter((item) => item.docCodEntrada !== docCodEntrada)
      .reduce((acc, curr) => acc + curr.quantidade, 0);

    // Limite global pelo produto da NS
    const maxPeloProdutoNS = Math.max(0, produto.dprQtdQuantidade - totalAlocadoEmOutros);

    // Limite local pela quantidade disponível na NE específica
    const neAlvo = nesRelevantes.find((ne) => ne.detalheNota.docCod === docCodEntrada);
    const produtoNE = neAlvo?.produtos.rows.find((p) => p.prdCod === produto.prdCod);
    const maxPelaNE = Math.max(0, produtoNE?.dprQtdQuantidade ?? 0);

    const teto = Math.min(maxPeloProdutoNS, maxPelaNE);
    const entradaNumerica = isNaN(quantidade) ? 0 : quantidade;
    const valorFinal = Math.min(Math.max(0, entradaNumerica), teto);
    onQuantidadeChange(docCodEntrada, valorFinal);
  };

  // Helper functions for Brazilian number formatting in input
  const parseNumberBR = (value: string): number => {
    if (!value || value.trim() === '') return 0;
    // Remove dots (thousand separator) and replace comma with dot (decimal separator)
    const normalized = value.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatInputValue = (value: number): string => {
    if (value === 0) return '';
    // Convert number to string with comma as decimal separator
    return value.toString().replace('.', ',');
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
              <Typography variant="h6">{formatQuantity(produto.dprQtdQuantidade)}</Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="subtitle2" color="text.secondary">Quantidade Alocada</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }} color={alocacaoProdutoCompleta ? "success.main" : "text.primary"}>
                {formatQuantity(quantidadeAlocadaProduto)}
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
          Faltam <strong>{formatQuantity(produto.dprQtdQuantidade - quantidadeAlocadaProduto)}</strong> unidades
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
                  <TableCell>Quantidade Disponível</TableCell>
                  <TableCell sx={{ width: "180px" }}>Qtd. a Alocar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nesRelevantes.map((ne) => {
                  const detalheNota = ne?.detalheNota;
                  const produtoFiltrado = ne?.produtos.rows.find((p) => p.prdCod === produto.prdCod);
                  const isSelected = alocacoesProduto.some((item) => item.docCodEntrada === detalheNota.docCod);
                  const selectedItem = isSelected ? alocacoesProduto.find((item) => item.docCodEntrada === detalheNota.docCod) : null;

                  return (
                    <TableRow key={detalheNota.docCod} sx={{ "& > .MuiTableCell-root": { py: 2 } }} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isSelected}
                          onChange={(e) => {
                            const marcado = e.target.checked;
                            onSelecaoNE(ne.detalheNota, marcado);
                            if (marcado) {
                              // Alocar automaticamente máximo possível respeitando NS e NE
                              const totalAlocadoEmOutros = alocacoesProduto
                                .filter((item) => item.docCodEntrada !== detalheNota.docCod)
                                .reduce((acc, curr) => acc + curr.quantidade, 0);
                              const maxPeloProdutoNS = Math.max(0, produto.dprQtdQuantidade - totalAlocadoEmOutros);
                              const dispNE = Math.max(0, produtoFiltrado?.dprQtdQuantidade ?? 0);
                              const quantidadeAuto = Math.min(maxPeloProdutoNS, dispNE);
                              if (quantidadeAuto > 0) {
                                setTimeout(() => onQuantidadeChange(detalheNota.docCod, quantidadeAuto), 0);
                              }
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell><Typography variant="body2" fontWeight={500}>{ne.detalheNota.docEspNumero || `NE-${ne.detalheNota.docCod}`}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{detalheNota.dpeNomPessoa || "N/A"}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{new Date(detalheNota.docDtaEmissao).toLocaleDateString("pt-BR")}</Typography></TableCell>
                      <TableCell><Chip label={`${detalheNota.qtdItens} itens`} size="small" variant="outlined" /></TableCell>
                      <TableCell><Typography variant="body2">{formatQuantity(produtoFiltrado?.dprQtdQuantidade ?? 0)}</Typography></TableCell>
                      <TableCell>
                        {isSelected && (
                          <TextField
                            type="text"
                            size="small"
                            variant="outlined"
                            value={formatInputValue(selectedItem?.quantidade || 0)}
                            onChange={(e) => handleQuantidadeChangeLocal(detalheNota.docCod, parseNumberBR(e.target.value))}
                            placeholder="0,00"
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
}


