"use client";

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
  Chip,
  Link,
} from "@mui/material";
import { getNotasSaida } from "@/lib/api/notas-saida";
import { useQuery } from "@tanstack/react-query";

export const TabelaNotasSaida = () => {
  const query = useQuery({
    queryKey: ['notasSaidaPendentes'],
    queryFn: async () => await getNotasSaida(),
  });

  const { data, error, isLoading } = query;

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando notas de saída pendentes...</Typography>
      </Box>
    );
  
  if (error)
    return (
      <Typography color="error" align="center" sx={{ my: 4 }}>
        ❌ Falha ao carregar notas de saída: {error.message}
      </Typography>
    );

  if (!data || data.rows?.length === 0 || !data.rows) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          ✅ Nenhuma nota de saída pendente de alocação!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Todas as notas foram processadas.
        </Typography>
      </Paper>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Número da NS</strong></TableCell>
            <TableCell><strong>Cliente/Destino</strong></TableCell>
            <TableCell><strong>Valor</strong></TableCell>
            <TableCell><strong>Data de Emissão</strong></TableCell>
            <TableCell><strong>Itens</strong></TableCell>
            <TableCell><strong>Ação</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.rows?.map((ns) => (
            <TableRow key={ns.docCod} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {ns.docEspNumero}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Doc: {ns.docCod}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{ns.dpeNomPessoa}</Typography>
              </TableCell>
              <TableCell>{formatCurrency(ns.docMnyValor)}</TableCell>
              <TableCell>
                {new Date(ns.docDtaEmissao).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell align="center">
                <Chip 
                  label="Carregar detalhes" 
                  color="default" 
                  size="small" 
                />
              </TableCell>
              <TableCell>
                <Link href={`/alocacao/${ns.docCod}`}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small"
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
  );
};
