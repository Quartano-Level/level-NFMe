'use client';

import { useState } from 'react';
import { getNotaSaidaComProdutos } from '@/lib/api/notas-saida';
import type { NotaSaidaDetalhada } from '@/lib/types/notas';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Chip
} from '@mui/material';

export default function TesteNotaSaidaDetalhadaPage() {
  const [docCod, setDocCod] = useState<string>('5');
  const [nota, setNota] = useState<NotaSaidaDetalhada | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuscar = async () => {
    try {
      setLoading(true);
      setError(null);
      setNota(null);
      
      const docCodNumber = parseInt(docCod);
      if (isNaN(docCodNumber)) {
        setError('Digite um código válido');
        return;
      }
      
      const data = await getNotaSaidaComProdutos(docCodNumber);
      
      if (data) {
        setNota(data);
        console.log('✅ Nota carregada com sucesso:', data);
      } else {
        setError('Nota não encontrada');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Erro ao carregar nota:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        🧪 Teste - Nota de Saída Detalhada (com Produtos)
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            label="Código da Nota (docCod)"
            value={docCod}
            onChange={(e) => setDocCod(e.target.value)}
            size="small"
            sx={{ width: 200 }}
          />
          <Button 
            variant="contained" 
            onClick={handleBuscar}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Buscar'}
          </Button>
        </Box>
        
        <Alert severity="info" sx={{ mt: 2 }}>
          Digite o <strong>docCod</strong> de uma nota de saída (ex: 5, 10, 25, 26, etc.)
        </Alert>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          ❌ {error}
        </Alert>
      )}

      {nota && (
        <>
          {/* Detalhes da Nota */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              📄 Detalhes da Nota
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Número da NF</Typography>
                <Typography variant="h6">{nota.detalheNota.docEspNumero}</Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">Cliente</Typography>
                <Typography variant="body1">{nota.detalheNota.dpeNomPessoa}</Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">Data de Emissão</Typography>
                <Typography variant="body1">{formatDate(nota.detalheNota.docDtaEmissao)}</Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">Valor Total</Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(nota.detalheNota.docMnyValor)}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Typography variant="body1">
                  <Chip 
                    label={nota.detalheNota.vldStatus === 3 ? 'Autorizada' : `Status ${nota.detalheNota.vldStatus}`}
                    color={nota.detalheNota.vldStatus === 3 ? 'success' : 'default'}
                    size="small"
                  />
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">Tipo</Typography>
                <Typography variant="body2">{nota.detalheNota.tpdDesNome}</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Resumo dos Produtos */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              📊 Resumo
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Total de Itens</Typography>
                <Typography variant="h4" color="primary">
                  {nota.produtos.summary.dprQtdItensTotal}
                </Typography>
              </Box>
              
              <Divider orientation="vertical" flexItem />
              
              <Box>
                <Typography variant="caption" color="text.secondary">Valor Líquido Total</Typography>
                <Typography variant="h4" color="success.main">
                  {formatCurrency(nota.produtos.summary.dprVlrLiquidoTotal)}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Tabela de Produtos */}
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h5">
                📦 Produtos ({nota.produtos.rows.length})
              </Typography>
            </Box>
            
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Código</strong></TableCell>
                    <TableCell><strong>Produto</strong></TableCell>
                    <TableCell align="right"><strong>Quantidade</strong></TableCell>
                    <TableCell><strong>Unidade</strong></TableCell>
                    <TableCell align="right"><strong>Vlr Unit.</strong></TableCell>
                    <TableCell align="right"><strong>Vlr Total</strong></TableCell>
                    <TableCell><strong>NCM</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nota.produtos.rows.map((produto, index) => (
                    <TableRow key={`${produto.prdCod}-${index}`} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {produto.prdCod}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Seq: {produto.dprCodSeq}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{produto.prdDesNome}</Typography>
                        {produto.prdEspCodExport && (
                          <Typography variant="caption" color="text.secondary">
                            Cód. Export: {produto.prdEspCodExport}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          {produto.dprQtdQuantidade.toLocaleString('pt-BR')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {produto.undDesNome}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(produto.dprPreValorun)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {formatCurrency(produto.dprPreTotalLiquido)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={produto.tecEspCod} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
}
