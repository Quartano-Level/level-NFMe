'use client';

import { useState } from 'react';
import { getNotasEntrada } from '@/lib/api/notas-entrada';
import { getProdutosNotaSaida, getNotasSaidaFront } from '@/lib/api/notas-saida';
import { apiClient, getEndpoint } from '@/lib/api/client';
import type { NotaEntrada } from '@/lib/types/notas';
import { 
  Box, 
  Typography, 
  Alert, 
  Paper,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function TesteMatchProdutosPage() {
  const [notaEntradaCod, setNotaEntradaCod] = useState<string>('10');
  const [produtoCod, setProdutoCod] = useState<string>('5882');
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sugestoes, setSugestoes] = useState<{notasEntrada: any[], produtosSaida: any[]}>({
    notasEntrada: [],
    produtosSaida: []
  });
  const [loadingSugestoes, setLoadingSugestoes] = useState(false);

  const buscarProdutoNaNota = async () => {
    try {
      setLoading(true);
      setError(null);
      setResultado(null);

      const endpoint = getEndpoint('notasEntrada.getProduto');
      const url = `${endpoint}?nrNota=${notaEntradaCod}&produto=${produtoCod}`;
      
      console.log('[Teste] Buscando produto na nota:', { notaEntradaCod, produtoCod, url });
      
      const response = await apiClient<any>(url);
      
      console.log('[Teste] ✅ Resposta recebida:', response);
      setResultado(response);
      
      if (Array.isArray(response) && response.length > 0 && response[0].rows.length === 0) {
        setError('⚠️ Combinação não encontrada. Tente outras sugestões abaixo.');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('[Teste] ❌ Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const carregarSugestoes = async () => {
    try {
      setLoadingSugestoes(true);
      
      console.log('[Teste] Carregando sugestões...');
      
      // Carregar notas de entrada
      const notasEntrada = await getNotasEntrada();
      
      // Carregar produtos das notas de saída
      const notasSaida = await getNotasSaidaFront();
      const produtosUnicos = new Set<number>();
      const produtosDetalhes: any[] = [];
      
      for (const ns of notasSaida.slice(0, 3)) { // Apenas primeiras 3 para não demorar
        try {
          const produtos = await getProdutosNotaSaida(ns.docCod);
          produtos.forEach(p => {
            if (!produtosUnicos.has(p.prdCod)) {
              produtosUnicos.add(p.prdCod);
              produtosDetalhes.push({
                prdCod: p.prdCod,
                prdDesNome: p.prdDesNome,
                notaSaida: ns.docEspNumero
              });
            }
          });
        } catch (err) {
          console.warn('[Teste] Erro ao carregar produtos da NS:', err);
        }
      }
      
      setSugestoes({
        notasEntrada: notasEntrada.slice(0, 10), // Primeiras 10
        produtosSaida: produtosDetalhes.slice(0, 10)
      });
      
      console.log('[Teste] ✅ Sugestões carregadas:', {
        notasEntrada: notasEntrada.length,
        produtos: produtosDetalhes.length
      });
      
    } catch (err) {
      console.error('[Teste] ❌ Erro ao carregar sugestões:', err);
    } finally {
      setLoadingSugestoes(false);
    }
  };

  const testarCombinacao = (nrNota: number, prdCod: number) => {
    setNotaEntradaCod(nrNota.toString());
    setProdutoCod(prdCod.toString());
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        🧪 Teste - Match de Produto em Nota de Entrada
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>🎯 Objetivo:</strong> Testar a rota que busca um produto específico em uma nota de entrada.
        <br />
        <strong>📍 Endpoint:</strong> <code>GET /webhook/...?nrNota=X&produto=Y</code>
        <br />
        <strong>💡 Estratégia:</strong> Vamos testar combinações até encontrar dados reais!
      </Alert>

      {/* Formulário de Busca */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔍 Buscar Produto em Nota
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Nota de Entrada (docCod)"
              value={notaEntradaCod}
              onChange={(e) => setNotaEntradaCod(e.target.value)}
              placeholder="Ex: 10"
              type="number"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Código do Produto (prdCod)"
              value={produtoCod}
              onChange={(e) => setProdutoCod(e.target.value)}
              placeholder="Ex: 5882"
              type="number"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={buscarProdutoNaNota}
              disabled={loading || !notaEntradaCod || !produtoCod}
              startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              sx={{ height: 56 }}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* Resultado */}
      {resultado && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            📦 Resultado da Busca
          </Typography>
          
          {Array.isArray(resultado) && resultado.length > 0 && (
            <>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">Total</Typography>
                      <Typography variant="h4" color={resultado[0].count > 0 ? 'success.main' : 'warning.main'}>
                        {resultado[0].count}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">Itens</Typography>
                      <Typography variant="h4" color="primary">
                        {resultado[0].summary.dprQtdItensTotal}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">Valor Total</Typography>
                      <Typography variant="h4" color="primary">
                        R$ {resultado[0].summary.dprVlrLiquidoTotal.toLocaleString('pt-BR')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {resultado[0].rows.length > 0 ? (
                <>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    ✅ <strong>Match encontrado!</strong> Este produto existe nesta nota de entrada.
                  </Alert>
                  
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Campo</strong></TableCell>
                          <TableCell><strong>Valor</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(resultado[0].rows[0]).map(([key, value]: [string, any]) => (
                          <TableRow key={key}>
                            <TableCell><code>{key}</code></TableCell>
                            <TableCell>{JSON.stringify(value)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <Alert severity="warning">
                  ⚠️ Nenhum match encontrado. Este produto não está nesta nota de entrada.
                </Alert>
              )}
            </>
          )}

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="caption" color="text.secondary">
            JSON Completo:
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', mt: 1 }}>
            <pre style={{ margin: 0, fontSize: '0.75rem', overflow: 'auto', maxHeight: 300 }}>
              {JSON.stringify(resultado, null, 2)}
            </pre>
          </Paper>
        </Paper>
      )}

      {/* Sugestões */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            💡 Sugestões de Combinações
          </Typography>
          <Button
            variant="outlined"
            onClick={carregarSugestoes}
            disabled={loadingSugestoes}
            startIcon={loadingSugestoes ? <CircularProgress size={20} /> : null}
          >
            {loadingSugestoes ? 'Carregando...' : 'Carregar Sugestões'}
          </Button>
        </Box>

        {sugestoes.notasEntrada.length > 0 && sugestoes.produtosSaida.length > 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                📥 Notas de Entrada (docCod):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {sugestoes.notasEntrada.map((ne) => (
                  <Chip
                    key={ne.docCod}
                    label={`NE ${ne.docCod} (${ne.docEspNumero})`}
                    onClick={() => setNotaEntradaCod(ne.docCod.toString())}
                    color={notaEntradaCod === ne.docCod.toString() ? 'primary' : 'default'}
                    variant={notaEntradaCod === ne.docCod.toString() ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                📦 Produtos das NS (prdCod):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {sugestoes.produtosSaida.map((prod) => (
                  <Chip
                    key={prod.prdCod}
                    label={`${prod.prdCod} - ${prod.prdDesNome.substring(0, 20)}...`}
                    onClick={() => setProdutoCod(prod.prdCod.toString())}
                    color={produtoCod === prod.prdCod.toString() ? 'secondary' : 'default'}
                    variant={produtoCod === prod.prdCod.toString() ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        )}

        <Alert severity="info" sx={{ mt: 2 }}>
          <strong>💡 Dica:</strong> Clique nos chips para preencher os campos automaticamente, depois clique em "Buscar"!
        </Alert>
      </Paper>
    </Box>
  );
}
