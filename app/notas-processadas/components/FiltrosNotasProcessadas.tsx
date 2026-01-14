"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { FiltrosNotasProcessadas } from "@/lib/api/notas-processadas";

interface FiltrosNotasProcessadasProps {
  filtros: FiltrosNotasProcessadas;
  onFiltrosChange: (filtros: FiltrosNotasProcessadas) => void;
  onPesquisar: () => void;
  isLoading?: boolean;
}

export default function FiltrosNotasProcessadasComponent({
  filtros,
  onFiltrosChange,
  onPesquisar,
  isLoading = false,
}: FiltrosNotasProcessadasProps) {
  const [localFiltros, setLocalFiltros] = useState<FiltrosNotasProcessadas>(filtros);

  // Sincronizar filtros locais quando os filtros externos mudarem
  useEffect(() => {
    setLocalFiltros(filtros);
  }, [filtros]);

  const handleFiltroChange = (campo: keyof FiltrosNotasProcessadas, valor: string) => {
    const novosFiltros = {
      ...localFiltros,
      [campo]: valor || undefined,
    };
    setLocalFiltros(novosFiltros);
  };

  const handlePesquisar = () => {
    onFiltrosChange(localFiltros);
    onPesquisar();
  };

  const handleLimpar = () => {
    const filtrosVazios: FiltrosNotasProcessadas = {};
    setLocalFiltros(filtrosVazios);
    onFiltrosChange(filtrosVazios);
    onPesquisar();
  };

  const temFiltrosAtivos = Object.values(localFiltros).some(
    (valor) => valor !== undefined && valor !== null && valor !== ""
  );

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Box mb={2}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <SearchIcon color="primary" />
          <Box component="h3" sx={{ m: 0, fontSize: "1.1rem", fontWeight: 600 }}>
            Filtros de Pesquisa
          </Box>
        </Box>
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Código da Nota"
            variant="outlined"
            size="small"
            fullWidth
            value={localFiltros.docCod || ""}
            onChange={(e) => handleFiltroChange("docCod", e.target.value)}
            placeholder="Ex: 96755"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Número da Nota"
            variant="outlined"
            size="small"
            fullWidth
            value={localFiltros.numero_nota || ""}
            onChange={(e) => handleFiltroChange("numero_nota", e.target.value)}
            placeholder="Ex: 123456"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Cliente"
            variant="outlined"
            size="small"
            fullWidth
            value={localFiltros.cliente || ""}
            onChange={(e) => handleFiltroChange("cliente", e.target.value)}
            placeholder="Nome do cliente"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Código da Pessoa"
            variant="outlined"
            size="small"
            fullWidth
            value={localFiltros.pesCod || ""}
            onChange={(e) => handleFiltroChange("pesCod", e.target.value)}
            placeholder="Ex: 8961"
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleLimpar}
              disabled={!temFiltrosAtivos || isLoading}
            >
              Limpar Filtros
            </Button>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handlePesquisar}
              disabled={isLoading}
            >
              Pesquisar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
