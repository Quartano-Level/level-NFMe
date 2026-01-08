"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Box,
  Link,
  Alert,
  AlertTitle,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getNotasSaida, finalizarNotaSaida } from "@/lib/api/notas-saida";
import { coletarXMLsSharePoint } from "@/lib/api/sharepoint";
import { useQuery } from "@tanstack/react-query";
import AlertaNotasSemVinculo from "./AlertaNotasSemVinculo";
import AlertaContaOrdemTerceiros from "./AlertaContaOrdemTerceiros";
import TabelaNotasComErro from "./AlertaNotasPendentes";
import { formatCurrency } from "@/lib/utils/formatters";

export const TabelaNotasSaida = () => {
  const [coletando, setColetando] = useState(false);
  const [resultado, setResultado] = useState<{ sucesso: boolean; mensagem: string } | null>(null);
  // Variáveis para funcionalidade de finalização de notas (implementação futura)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [finalizando, setFinalizando] = useState<number | null>(null); // docCod da nota sendo finalizada
  const [resultadoFinalizacao, setResultadoFinalizacao] = useState<{ sucesso: boolean; mensagem: string; docCod: number } | null>(null);

  const query = useQuery({
    queryKey: ['notasSaidaPendentes'],
    queryFn: async () => await getNotasSaida(),
  });

  const { data, error, isLoading, refetch } = query;

  const handleColetarXMLs = async () => {
    try {
      setColetando(true);
      setResultado(null);

      console.log('[TabelaNotasSaida] 📥 Iniciando coleta de XMLs do SharePoint...');

      await coletarXMLsSharePoint();

      setResultado({
        sucesso: true,
        mensagem: 'XMLs coletados com sucesso! Atualizando lista...'
      });

      // Aguarda 1 segundo para mostrar a mensagem de sucesso
      setTimeout(async () => {
        await refetch();
        setResultado(null);
        setColetando(false);
      }, 1500);

    } catch (err) {
      console.error('[TabelaNotasSaida] ❌ Erro ao coletar XMLs:', err);
      setResultado({
        sucesso: false,
        mensagem: 'Erro ao coletar as notas no SharePoint'
      });
      setColetando(false);
    }
  };

  // Função para finalização de notas (será conectada à UI futuramente)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFinalizarNota = async (docCodSaida: number) => {
    try {
      setFinalizando(docCodSaida);
      setResultadoFinalizacao(null);

      console.log('[TabelaNotasSaida] ✓ Finalizando nota de conta e ordem:', docCodSaida);

      await finalizarNotaSaida(docCodSaida);

      setResultadoFinalizacao({
        sucesso: true,
        mensagem: 'Nota finalizada com sucesso! Atualizando lista...',
        docCod: docCodSaida
      });

      // Aguarda 1 segundo para mostrar a mensagem de sucesso
      setTimeout(async () => {
        await refetch();
        setResultadoFinalizacao(null);
        setFinalizando(null);
      }, 1500);

    } catch (err) {
      console.error('[TabelaNotasSaida] ❌ Erro ao finalizar nota:', err);
      setResultadoFinalizacao({
        sucesso: false,
        mensagem: 'Erro ao finalizar a nota de saída',
        docCod: docCodSaida
      });
      setFinalizando(null);
    }
  };

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando notas de saída...</Typography>
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" sx={{ my: 4 }}>
        ❌ Falha ao carregar notas de saída: {error.message}
      </Typography>
    );

  const notasPendentes = data?.pendentes?.rows || [];
  const notasSemVinculo = data?.sem_vinculo?.rows || [];
  const notasContaOrdemTerceiros = data?.conta_e_ordem_terceiros?.rows || [];
  const totalPendentes = data?.pendentes?.count || 0;
  const totalSemVinculo = data?.sem_vinculo?.count || 0;
  const totalContaOrdemTerceiros = data?.conta_e_ordem_terceiros?.count || 0;
  const lastExecution = data?.last_execution;

  // Função para formatar data/hora
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para determinar cor do status
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONCLUÍDO':
      case 'CONCLUIDO':
      case 'SUCESSO':
        return '#34c759';
      case 'EM ANDAMENTO':
      case 'PROCESSANDO':
        return '#ff9500';
      case 'ERRO':
      case 'FALHA':
      case 'FALHOU':
        return '#ff3b30';
      default:
        return '#86868b';
    }
  };

  // Renderiza alertas e botão de atualização sempre
  const renderHeader = () => (
    <Box>
      {/* Alerta de resultado da coleta */}
      {resultado && (
        <Alert
          severity={resultado.sucesso ? "success" : "error"}
          sx={{
            mb: 3,
            border: `1px solid ${resultado.sucesso ? '#34c759' : '#ff3b30'}`,
            borderRadius: '12px',
            backgroundColor: resultado.sucesso ? '#f0fdf4' : '#fff5f5'
          }}
        >
          <AlertTitle sx={{ fontWeight: 600, color: '#1d1d1f' }}>
            {resultado.sucesso ? 'Sucesso!' : 'Erro'}
          </AlertTitle>
          <Typography sx={{ fontSize: '0.9375rem', color: '#1d1d1f' }}>
            {resultado.mensagem}
          </Typography>
        </Alert>
      )}

      {/* Alerta de resultado da finalização */}
      {resultadoFinalizacao && (
        <Alert
          severity={resultadoFinalizacao.sucesso ? "success" : "error"}
          sx={{
            mb: 3,
            border: `1px solid ${resultadoFinalizacao.sucesso ? '#34c759' : '#ff3b30'}`,
            borderRadius: '12px',
            backgroundColor: resultadoFinalizacao.sucesso ? '#f0fdf4' : '#fff5f5'
          }}
        >
          <AlertTitle sx={{ fontWeight: 600, color: '#1d1d1f' }}>
            {resultadoFinalizacao.sucesso ? 'Sucesso!' : 'Erro'}
          </AlertTitle>
          <Typography sx={{ fontSize: '0.9375rem', color: '#1d1d1f' }}>
            {resultadoFinalizacao.mensagem}
          </Typography>
        </Alert>
      )}

      {/* Status da última execução */}
      {lastExecution && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            border: '1px solid #e5e5e7',
            borderRadius: '12px',
            backgroundColor: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            {/* Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(lastExecution.status),
                  animation: lastExecution.status?.toUpperCase() === 'EM ANDAMENTO'
                    ? 'pulse 2s infinite'
                    : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.4 },
                    '100%': { opacity: 1 }
                  }
                }}
              />
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1d1d1f' }}>
                {lastExecution.status}
              </Typography>
            </Box>

            {/* Origem */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: '#86868b' }}>
                Origem:
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#1d1d1f' }}>
                {lastExecution.tipo}
              </Typography>
            </Box>

            {/* Notas encontradas */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: '#86868b' }}>
                Notas encontradas:
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1d1d1f' }}>
                {lastExecution.notas_encontradas}
              </Typography>
            </Box>

            {/* Data/hora */}
            <Typography sx={{ fontSize: '0.8125rem', color: '#86868b' }}>
              {formatDateTime(lastExecution.created_at)}
            </Typography>
          </Box>

          {/* Exibição do erro quando status for FALHOU */}
          {lastExecution.status?.toUpperCase() === 'FALHOU' && lastExecution.error && (
            <Box
              sx={{
                width: '100%',
                mt: 2,
                p: 2,
                backgroundColor: '#fff5f5',
                border: '1px solid #ff3b30',
                borderRadius: '8px'
              }}
            >
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ff3b30', mb: 1 }}>
                ⚠️ Detalhes do erro:
              </Typography>
              <Box
                component="pre"
                sx={{
                  fontSize: '0.75rem',
                  color: '#1d1d1f',
                  backgroundColor: '#fff',
                  p: 1.5,
                  borderRadius: '6px',
                  overflow: 'auto',
                  maxHeight: '200px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  margin: 0
                }}
              >
                {lastExecution.error}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Botão de atualização */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={coletando ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <RefreshIcon />}
          onClick={handleColetarXMLs}
          disabled={coletando}
          sx={{
            backgroundColor: '#1d1d1f',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9375rem',
            borderRadius: '10px',
            px: 3,
            py: 1.25,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#2c2c2e',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            },
            '&:disabled': {
              backgroundColor: '#86868b',
              color: '#fff'
            }
          }}
        >
          {coletando ? 'Coletando XMLs...' : 'Atualizar Notas'}
        </Button>
      </Box>
    </Box>
  );

  if (totalPendentes === 0 && totalSemVinculo === 0 && totalContaOrdemTerceiros === 0) {
    return (
      <Box>
        {renderHeader()}

        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            border: '1px solid #e5e5e7',
            borderRadius: '12px',
            backgroundColor: '#fafafa'
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '2rem'
            }}
          >
            ✓
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '1.125rem',
              color: '#1d1d1f',
              mb: 1
            }}
          >
            Tudo em dia
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#86868b',
              fontSize: '0.9375rem'
            }}
          >
            Nenhuma nota pendente de Referência no momento.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      {renderHeader()}

      {/* Tabela de notas com ERRO */}
      <TabelaNotasComErro />

      {/* Alerta para notas SEM vínculo - Monochrome */}
      {notasSemVinculo.length > 0 && (
        <AlertaNotasSemVinculo notas={notasSemVinculo} />
      )}

      {/* Alerta para notas de CONTA E ORDEM DE TERCEIROS - Monochrome */}
      {notasContaOrdemTerceiros.length > 0 && (
        <AlertaContaOrdemTerceiros notas={notasContaOrdemTerceiros} />
      )}

      {/* Tabela de notas PENDENTES - Estilo Apple - TEMPORARIAMENTE OCULTO */}
      {false && notasPendentes.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            border: '1px solid #e5e5e7',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#fff'
          }}
        >
          {/* Header da Tabela */}
          <Box sx={{
            p: 3,
            borderBottom: '1px solid #e5e5e7',
            backgroundColor: '#fafafa'
          }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '1.125rem',
                color: '#1d1d1f',
                letterSpacing: '-0.01em',
                mb: 0.5
              }}
            >
              Notas pendentes
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#86868b',
                fontSize: '0.875rem'
              }}
            >
              {totalPendentes} {totalPendentes === 1 ? 'nota pronta' : 'notas prontas'} para Referência
            </Typography>
          </Box>

          {/* Tabela Minimalista */}
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{
                  '& th': {
                    borderBottom: '1px solid #e5e5e7',
                    py: 2,
                    px: 3,
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    color: '#86868b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }
                }}>
                  <TableCell>Nota</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Emissão</TableCell>
                  <TableCell align="center">Itens</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notasPendentes.map((ns, index) => (
                  <TableRow
                    key={ns.docCod}
                    sx={{
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: '#fafafa'
                      },
                      '& td': {
                        borderBottom: index === notasPendentes.length - 1 ? 'none' : '1px solid #f0f0f0',
                        py: 2.5,
                        px: 3
                      }
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            color: '#1d1d1f',
                            mb: 0.25
                          }}
                        >
                          #{ns.docEspNumero}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#86868b',
                            fontSize: '0.8125rem'
                          }}
                        >
                          Doc {ns.docCod}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.9375rem',
                          color: '#1d1d1f',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '250px'
                        }}
                      >
                        {ns.dpeNomPessoa}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.9375rem',
                          color: '#1d1d1f',
                          fontVariantNumeric: 'tabular-nums'
                        }}
                      >
                        {formatCurrency(ns.docMnyValor)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.875rem',
                          color: '#86868b',
                          fontVariantNumeric: 'tabular-nums'
                        }}
                      >
                        {new Date(ns.docDtaEmissao).toLocaleDateString('pt-BR')}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 32,
                          height: 24,
                          borderRadius: '6px',
                          backgroundColor: '#f0f0f0',
                          px: 1,
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: '#1d1d1f'
                        }}
                      >
                        {ns.qtdItens || 0}
                      </Box>
                    </TableCell>

                    <TableCell align="right">
                      <Link href={`/${ns.docCod}`} style={{ textDecoration: 'none' }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: '#1d1d1f',
                            color: '#fff',
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            borderRadius: '8px',
                            px: 2.5,
                            py: 0.75,
                            boxShadow: 'none',
                            '&:hover': {
                              backgroundColor: '#2c2c2e',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                            }
                          }}
                        >
                          Alocar
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};
