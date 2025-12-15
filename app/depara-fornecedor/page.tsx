"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getDeparaFornecedor, 
  createDeparaFornecedor, 
  updateDeparaFornecedor, 
  deleteDeparaFornecedor,
  DeparaFornecedorRow 
} from "@/lib/api/depara-fornecedor";
import TabelaDeparaFornecedor from "./components/TabelaDeparaFornecedor";

export default function DeparaFornecedorPage() {
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Query para buscar a tabela
  const { data, isLoading, error } = useQuery({
    queryKey: ['deparaFornecedor'],
    queryFn: async () => await getDeparaFornecedor(),
  });

  // Debug logs
  console.log('[DeparaFornecedorPage] Estado:', { isLoading, error, dataLength: data?.length });

  // Mutation para criar
  const createMutation = useMutation({
    mutationFn: createDeparaFornecedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deparaFornecedor'] });
      setSnackbar({
        open: true,
        message: "Linha adicionada com sucesso!",
        severity: "success",
      });
    },
    onError: (error: Error) => {
      setSnackbar({
        open: true,
        message: `Erro ao adicionar linha: ${error.message}`,
        severity: "error",
      });
    },
  });

  // Mutation para atualizar
  const updateMutation = useMutation({
    mutationFn: updateDeparaFornecedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deparaFornecedor'] });
      setSnackbar({
        open: true,
        message: "Linha(s) atualizada(s) com sucesso!",
        severity: "success",
      });
    },
    onError: (error: Error) => {
      setSnackbar({
        open: true,
        message: `Erro ao atualizar linha(s): ${error.message}`,
        severity: "error",
      });
    },
  });

  // Mutation para deletar
  const deleteMutation = useMutation({
    mutationFn: deleteDeparaFornecedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deparaFornecedor'] });
      setSnackbar({
        open: true,
        message: "Linha(s) removida(s) com sucesso!",
        severity: "success",
      });
    },
    onError: (error: Error) => {
      setSnackbar({
        open: true,
        message: `Erro ao remover linha(s): ${error.message}`,
        severity: "error",
      });
    },
  });

  const handleCreate = (row: DeparaFornecedorRow) => {
    createMutation.mutate(row);
  };

  const handleUpdate = (rows: DeparaFornecedorRow | DeparaFornecedorRow[]) => {
    updateMutation.mutate(rows);
  };

  const handleDelete = (ids: (number | string) | (number | string)[]) => {
    deleteMutation.mutate(ids);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciamento de Depara Fornecedor
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie a tabela de depara de fornecedores. Você pode adicionar, editar e remover registros.
        </Typography>
      </Box>

      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Erro ao carregar a tabela: {error instanceof Error ? error.message : "Erro desconhecido"}
        </Alert>
      )}

      {!isLoading && !error && data !== undefined && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <TabelaDeparaFornecedor
            data={data || []}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isCreating={createMutation.isPending}
            isUpdating={updateMutation.isPending}
            isDeleting={deleteMutation.isPending}
          />
        </Paper>
      )}

      {!isLoading && !error && data === undefined && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Aguardando dados da API...
        </Alert>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

