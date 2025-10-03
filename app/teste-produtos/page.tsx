'use client';

import { useEffect, useState } from 'react';
import { getProdutos } from '@/lib/api/produtos';
import type { Produto } from '@/lib/types/produtos';
import { Box, Typography, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function TesteProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProdutos() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getProdutos();
        setProdutos(data);
        
        console.log('✅ Produtos carregados com sucesso:', data.length);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        console.error('❌ Erro ao carregar produtos:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProdutos();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando produtos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6">Erro ao carregar produtos</Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        🧪 Teste de Integração - Produtos
      </Typography>

      <Alert severity="success" sx={{ mb: 3 }}>
        ✅ <strong>{produtos.length}</strong> produtos carregados com sucesso!
      </Alert>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>Código</strong></TableCell>
                <TableCell><strong>Descrição</strong></TableCell>
                <TableCell><strong>Unidade</strong></TableCell>
                <TableCell><strong>NCM</strong></TableCell>
                <TableCell><strong>Situação</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {produtos.map((produto, index) => (
                <TableRow key={produto.prdCod || index} hover>
                  <TableCell>{produto.prdEspCodExterno || produto.prdCod}</TableCell>
                  <TableCell>{produto.prdDesNome}</TableCell>
                  <TableCell>{produto.undEspSigla || '-'}</TableCell>
                  <TableCell>{produto.tecEspCod || '-'}</TableCell>
                  <TableCell>{produto.prdVldSituacao === 1 ? '✅ Ativo' : '❌ Inativo'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" color="text.secondary">
          Endpoint: {getProdutos.toString().includes('produtos.listAll') ? '✅ Usando api-routes.json' : '⚠️ Verificar configuração'}
        </Typography>
      </Box>
    </Box>
  );
}
