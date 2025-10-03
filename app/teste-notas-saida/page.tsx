'use client';

import { useEffect, useState } from 'react';
import { getNotasSaidaFront, getNotaSaidaComProdutos } from '@/lib/api/notas-saida';
import type { NotaSaida, ProdutoNotaSaida } from '@/lib/types/notas';
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
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function TesteNotasSaidaPage() {
  const [notas, setNotas] = useState<NotaSaida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [produtosUnicos, setProdutosUnicos] = useState<Array<{prdCod: number, prdDesNome: string, count: number}>>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(false);

  useEffect(() => {
    async function loadNotas() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getNotasSaidaFront();
        setNotas(data);
        
        console.log('✅ Notas de saída carregadas com sucesso:', data.length);
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

  const extrairProdutosUnicos = async () => {
    try {
      setLoadingProdutos(true);
      const produtosMap = new Map<number, {prdDesNome: string, count: number}>();
      
      console.log('🔍 Carregando produtos de todas as notas...');
      
      // Busca produtos de todas as notas
      for (const nota of notas) {
        try {
          const notaDetalhada = await getNotaSaidaComProdutos(nota.docCod);
          
          if (notaDetalhada) {
            notaDetalhada.produtos.rows.forEach(produto => {
              const existing = produtosMap.get(produto.prdCod);
              if (existing) {
                existing.count++;
              } else {
                produtosMap.set(produto.prdCod, {
                  prdDesNome: produto.prdDesNome,
                  count: 1
                });
              }
            });
          }
        } catch (err) {
          console.warn(`⚠️ Erro ao carregar produtos da nota ${nota.docCod}:`, err);
        }
      }
      
      // Converte para array e ordena
      const produtosArray = Array.from(produtosMap.entries()).map(([prdCod, data]) => ({
        prdCod,
        prdDesNome: data.prdDesNome,
        count: data.count
      })).sort((a, b) => b.count - a.count);
      
      setProdutosUnicos(produtosArray);
      console.log('✅ Produtos únicos extraídos:', produtosArray.length);
      console.log('📦 Produtos:', produtosArray);
      
    } catch (err) {
      console.error('❌ Erro ao extrair produtos:', err);
      alert('Erro ao extrair produtos. Veja o console.');
    } finally {
      setLoadingProdutos(false);
    }
  };

  const copiarParaClipboard = (texto: string) => {
    navigator.clipboard.writeText(texto);
    alert('✅ Copiado para a área de transferência!');
  };

  const copiarTodosCodigos = () => {
    const codigos = produtosUnicos.map(p => p.prdCod).join(', ');
    copiarParaClipboard(codigos);
  };

  const copiarCodigosArray = () => {
    const codigos = JSON.stringify(produtosUnicos.map(p => p.prdCod));
    copiarParaClipboard(codigos);
  };

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
      2: { label: 'Aguardando', color: 'info' },
      3: { label: 'Autorizada', color: 'success' },
    };
    
    const info = statusMap[status] || { label: 'Desconhecido', color: 'default' };
    return <Chip label={info.label} color={info.color} size="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando notas de saída...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6">Erro ao carregar notas de saída</Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        🧪 Teste de Integração - Notas de Saída
      </Typography>

      {/* Seção de Produtos Únicos - NOVO */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          🔍 Extrator de Produtos (para testar rota de match)
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>🎯 Objetivo:</strong> Extrair todos os <code>prdCod</code> únicos das notas de saída para testar a rota de match por produto.
          <br />
          <strong>💡 Como usar:</strong> Clique no botão abaixo para carregar todos os produtos de todas as notas.
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={extrairProdutosUnicos}
            disabled={loadingProdutos || notas.length === 0}
            startIcon={loadingProdutos ? <CircularProgress size={20} /> : <RefreshIcon />}
          >
            {loadingProdutos ? 'Carregando produtos...' : 'Extrair Produtos Únicos'}
          </Button>
          
          {produtosUnicos.length > 0 && (
            <>
              <Button 
                variant="outlined"
                onClick={copiarTodosCodigos}
                startIcon={<ContentCopyIcon />}
              >
                Copiar Códigos (CSV)
              </Button>
              <Button 
                variant="outlined"
                onClick={copiarCodigosArray}
                startIcon={<ContentCopyIcon />}
              >
                Copiar Array JSON
              </Button>
            </>
          )}
        </Box>

        {produtosUnicos.length > 0 && (
          <Box>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary">
                  📦 {produtosUnicos.length} produtos únicos encontrados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use esses códigos para testar a rota de match com notas de entrada
                </Typography>
              </CardContent>
            </Card>

            <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                📋 Lista de Produtos:
              </Typography>
              <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                {produtosUnicos.map((produto) => (
                  <ListItem 
                    key={produto.prdCod}
                    secondaryAction={
                      <Tooltip title="Copiar código">
                        <IconButton 
                          edge="end" 
                          size="small"
                          onClick={() => copiarParaClipboard(produto.prdCod.toString())}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip 
                            label={`prdCod: ${produto.prdCod}`} 
                            color="primary" 
                            size="small" 
                            variant="outlined"
                          />
                          <Chip 
                            label={`${produto.count}x`} 
                            color="secondary" 
                            size="small"
                          />
                        </Box>
                      }
                      secondary={produto.prdDesNome}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Alert severity="success">
              <Typography variant="body2">
                <strong>✅ Exemplo de URL para testar:</strong>
                <br />
                <code>
                  GET /notas-entrada/match?prdCod={produtosUnicos[0]?.prdCod}
                </code>
                <br />
                <br />
                <strong>Ou com múltiplos códigos:</strong>
                <br />
                <code>
                  GET /notas-entrada/match?prdCod[]={produtosUnicos.slice(0, 3).map(p => p.prdCod).join('&prdCod[]=')}
                </code>
              </Typography>
            </Alert>
          </Box>
        )}
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Resto do código original */}
      <Alert severity="success" sx={{ mb: 3 }}>
        ✅ <strong>{notas.length}</strong> notas de saída carregadas com sucesso!
      </Alert>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>NF</strong></TableCell>
                <TableCell><strong>Cliente</strong></TableCell>
                <TableCell><strong>Data Emissão</strong></TableCell>
                <TableCell><strong>Valor</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Tipo</strong></TableCell>
                <TableCell><strong>Itens</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notas.map((nota) => (
                <TableRow key={`${nota.docTip}-${nota.docCod}`} hover>
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
                  <TableCell>
                    <Typography variant="caption">{nota.tpdDesNome}</Typography>
                  </TableCell>
                  <TableCell align="center">{nota.qtdItens}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
