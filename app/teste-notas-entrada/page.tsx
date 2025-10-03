'use client';

import { useEffect, useState } from 'react';
import { getNotasEntrada } from '@/lib/api/notas-entrada';
import type { NotaEntrada } from '@/lib/types/notas';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function TesteNotasEntradaPage() {
  const [notas, setNotas] = useState<NotaEntrada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notaSelecionada, setNotaSelecionada] = useState<NotaEntrada | null>(null);

  useEffect(() => {
    async function loadNotas() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getNotasEntrada();
        setNotas(data);
        
        console.log('✅ Notas de entrada carregadas:', data.length);
        console.log('📦 Primeira nota (exemplo):', data[0]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        console.error('❌ Erro ao carregar notas:', err);
      } finally {
        setLoading(false);
      }
    }

    loadNotas();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusChip = (status: number) => {
    const statusMap: Record<number, { label: string; color: any }> = {
      1: { label: 'Em Digitação', color: 'warning' },
      3: { label: 'Autorizada', color: 'success' },
      5: { label: 'Status 5', color: 'info' },
      6: { label: 'Status 6', color: 'default' },
    };
    
    const info = statusMap[status] || { label: `Status ${status}`, color: 'default' };
    return <Chip label={info.label} color={info.color} size="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando notas de entrada...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6">Erro ao carregar notas de entrada</Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        🧪 Teste - Notas de Entrada (Estoque Disponível)
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>📋 Total de notas:</strong> {notas.length}
        <br />
        <strong>🎯 Objetivo:</strong> Identificar a rota que retorna os <strong>produtos</strong> de cada nota de entrada.
        <br />
        <strong>💡 Dica:</strong> Clique em uma nota para ver todos os campos disponíveis no console.
      </Alert>

      {/* Resumo Rápido */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>📊 Resumo das Notas</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Total de Notas</Typography>
              <Typography variant="h4" color="primary">{notas.length}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Autorizadas</Typography>
              <Typography variant="h4" color="success.main">
                {notas.filter(n => n.vldStatus === 3).length}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Valor Total</Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(notas.reduce((acc, n) => acc + n.docMnyValor, 0))}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Paper>

      {/* Tabela de Notas */}
      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>Código</strong></TableCell>
                <TableCell><strong>NF</strong></TableCell>
                <TableCell><strong>Cliente</strong></TableCell>
                <TableCell><strong>Data Emissão</strong></TableCell>
                <TableCell><strong>Valor</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Itens</strong></TableCell>
                <TableCell><strong>Armazém</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notas.map((nota) => (
                <TableRow 
                  key={`${nota.docTip}-${nota.docCod}`} 
                  hover
                  onClick={() => {
                    setNotaSelecionada(nota);
                    console.log('📦 Nota selecionada:', nota);
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {nota.docCod}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tipo: {nota.docTip}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {nota.docEspNumero}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Doc: {nota.fisNumDocumento}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{nota.dpeNomPessoa}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      CNPJ: {nota.pdcDocFederal}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(nota.docDtaEmissao)}</TableCell>
                  <TableCell>{formatCurrency(nota.docMnyValor)}</TableCell>
                  <TableCell>{getStatusChip(nota.vldStatus)}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={nota.qtdItens || '?'} 
                      color="info" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{nota.amzDesNome}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Detalhes da Nota Selecionada */}
      {notaSelecionada && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            🔍 Detalhes da Nota {notaSelecionada.docCod}
          </Typography>
          
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ Nota selecionada! Veja o console para o objeto completo.
          </Alert>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">📄 Informações Gerais</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Número NF</Typography>
                  <Typography variant="body1" fontWeight="bold">{notaSelecionada.docEspNumero}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Cliente</Typography>
                  <Typography variant="body1">{notaSelecionada.dpeNomPessoa}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Data Emissão</Typography>
                  <Typography variant="body1">{formatDate(notaSelecionada.docDtaEmissao)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Valor Total</Typography>
                  <Typography variant="body1" color="primary">{formatCurrency(notaSelecionada.docMnyValor)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Quantidade de Itens</Typography>
                  <Typography variant="body1">{notaSelecionada.qtdItens}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Armazém</Typography>
                  <Typography variant="body1">{notaSelecionada.amzDesNome}</Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">📍 Endereço</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                {notaSelecionada.endDesLogradouro}, {notaSelecionada.endEspNlogradouro}
                <br />
                {notaSelecionada.endDesBairro} - {notaSelecionada.endDesCidade}/{notaSelecionada.ufEspSigla}
                <br />
                CEP: {notaSelecionada.endEspZipcod}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">🔑 Campos Técnicos</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">filCod</Typography>
                  <Typography variant="body2">{notaSelecionada.filCod}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">docTip</Typography>
                  <Typography variant="body2">{notaSelecionada.docTip}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">docCod</Typography>
                  <Typography variant="body2" fontWeight="bold">{notaSelecionada.docCod}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">vldStatus</Typography>
                  <Typography variant="body2">{notaSelecionada.vldStatus}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">docVldFinalizado</Typography>
                  <Typography variant="body2">{notaSelecionada.docVldFinalizado ? '✅ Sim' : '❌ Não'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">gcdDesNome</Typography>
                  <Typography variant="body2">{notaSelecionada.gcdDesNome || '-'}</Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Divider sx={{ my: 3 }} />

          <Alert severity="warning">
            <Typography variant="h6">❓ Pergunta Chave:</Typography>
            <Typography sx={{ mt: 1 }}>
              <strong>Esta nota tem produtos/itens?</strong>
              <br />
              • Campo <code>qtdItens</code> indica: <strong>{notaSelecionada.qtdItens}</strong>
              <br />
              • Precisamos de uma rota que retorne esses produtos com:
              <br />
              &nbsp;&nbsp;- <code>prdCod</code> (código do produto)
              <br />
              &nbsp;&nbsp;- <code>prdDesNome</code> (nome do produto)
              <br />
              &nbsp;&nbsp;- <code>quantidade disponível</code>
              <br />
              &nbsp;&nbsp;- <code>dprQtdQuantidade</code> (quantidade)
            </Typography>
          </Alert>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>💡 Dica:</strong> Procure por rotas como:
              <br />
              • <code>GET /notas-entrada/detail?docCodEntrada={notaSelecionada.docCod}</code>
              <br />
              • <code>GET /notas-entrada/produtos?docCod={notaSelecionada.docCod}</code>
              <br />
              • Similar à rota de saída: <code>?docCodSaida=...</code>
            </Typography>
          </Alert>
        </Paper>
      )}
    </Box>
  );
}
