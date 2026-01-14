"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getNotasProcessadas, FiltrosNotasProcessadas } from "@/lib/api/notas-processadas";
import TabelaNotasProcessadas from "./components/TabelaNotasProcessadas";
import FiltrosNotasProcessadasComponent from "./components/FiltrosNotasProcessadas";

export default function NotasProcessadasPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filtros, setFiltros] = useState<FiltrosNotasProcessadas>({});
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosNotasProcessadas>({});

  // Função para buscar notas
  const buscarNotas = useCallback(async () => {
    return await getNotasProcessadas(page, limit, filtrosAplicados);
  }, [page, limit, filtrosAplicados]);

  // Query para buscar as notas processadas
  const { data, isLoading, error } = useQuery({
    queryKey: ["notasProcessadas", page, limit, filtrosAplicados],
    queryFn: buscarNotas,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const handleFiltrosChange = (novosFiltros: FiltrosNotasProcessadas) => {
    setFiltros(novosFiltros);
  };

  const handlePesquisar = () => {
    setFiltrosAplicados(filtros);
    setPage(1); // Resetar para primeira página ao pesquisar
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Resetar para primeira página ao mudar limit
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Notas Processadas e Finalizadas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visualize todas as notas fiscais que já foram processadas e finalizadas com sucesso.
        </Typography>
      </Box>

      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Erro ao carregar notas processadas:{" "}
          {error instanceof Error ? error.message : "Erro desconhecido"}
        </Alert>
      )}

      {!isLoading && !error && data !== undefined && (
        <>
          <FiltrosNotasProcessadasComponent
            filtros={filtros}
            onFiltrosChange={handleFiltrosChange}
            onPesquisar={handlePesquisar}
            isLoading={isLoading}
          />
          <Paper elevation={2} sx={{ p: 3 }}>
            <TabelaNotasProcessadas
              data={data.data || []}
              total={data.total || 0}
              page={page}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              isLoading={isLoading}
            />
          </Paper>
        </>
      )}

      {!isLoading && !error && data === undefined && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Aguardando dados da API...
        </Alert>
      )}
    </Container>
  );
}

