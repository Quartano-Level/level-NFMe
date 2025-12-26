"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getNotasProcessadas } from "@/lib/api/notas-processadas";
import TabelaNotasProcessadas from "./components/TabelaNotasProcessadas";

export default function NotasProcessadasPage() {
  // Query para buscar as notas processadas
  const { data, isLoading, error } = useQuery({
    queryKey: ["notasProcessadas"],
    queryFn: async () => await getNotasProcessadas(),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

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
        <Paper elevation={2} sx={{ p: 3 }}>
          <TabelaNotasProcessadas data={data || []} isLoading={isLoading} />
        </Paper>
      )}

      {!isLoading && !error && data === undefined && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Aguardando dados da API...
        </Alert>
      )}
    </Container>
  );
}

