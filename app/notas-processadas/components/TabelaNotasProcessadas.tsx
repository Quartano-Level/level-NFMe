"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Typography,
  Chip,
  TableSortLabel,
  InputAdornment,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { NotaProcessada } from "@/lib/api/notas-processadas";

interface TabelaNotasProcessadasProps {
  data: NotaProcessada[];
  isLoading?: boolean;
}

type Order = "asc" | "desc";
type OrderBy = "docCod" | "conexos_status" | "pesCod";

export default function TabelaNotasProcessadas({
  data,
  isLoading = false,
}: TabelaNotasProcessadasProps) {
  const [searchDocCod, setSearchDocCod] = useState("");
  const [orderBy, setOrderBy] = useState<OrderBy>("docCod");
  const [order, setOrder] = useState<Order>("desc");

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Filtro por docCod
    if (searchDocCod.trim()) {
      filtered = filtered.filter((nota) =>
        nota.docCod?.toString().toLowerCase().includes(searchDocCod.toLowerCase())
      );
    }

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (orderBy) {
        case "docCod":
          aValue = a.docCod?.toString() || "";
          bValue = b.docCod?.toString() || "";
          break;
        case "conexos_status":
          aValue = a.conexos_status || "";
          bValue = b.conexos_status || "";
          break;
        case "pesCod":
          aValue = a.pesCod?.toString() || "";
          bValue = b.pesCod?.toString() || "";
          break;
      }

      if (orderBy === "docCod" || orderBy === "pesCod") {
        // Ordenação numérica
        const aNum = Number(aValue) || 0;
        const bNum = Number(bValue) || 0;
        return order === "asc" ? aNum - bNum : bNum - aNum;
      } else {
        // Ordenação alfabética
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        if (order === "asc") {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      }
    });

    return sorted;
  }, [data, searchDocCod, orderBy, order]);

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="text.secondary">
          Carregando notas processadas...
        </Typography>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Nenhuma nota processada encontrada.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Filtros */}
      <Box mb={3}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <TextField
              label="Buscar por Código da Nota"
              variant="outlined"
              size="small"
              value={searchDocCod}
              onChange={(e) => setSearchDocCod(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            <Box flexGrow={1} />
            <Typography variant="body2" color="text.secondary">
              {filteredAndSortedData.length} nota{filteredAndSortedData.length !== 1 ? "s" : ""} encontrada{filteredAndSortedData.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Tabela */}
      <TableContainer component={Paper} elevation={2}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "docCod"}
                  direction={orderBy === "docCod" ? order : "asc"}
                  onClick={() => handleRequestSort("docCod")}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    Código da Nota
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "conexos_status"}
                  direction={orderBy === "conexos_status" ? order : "asc"}
                  onClick={() => handleRequestSort("conexos_status")}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    Status
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "pesCod"}
                  direction={orderBy === "pesCod" ? order : "asc"}
                  onClick={() => handleRequestSort("pesCod")}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    Código da Pessoa
                  </Typography>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedData.map((nota) => (
              <TableRow
                key={nota.id}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {nota.docCod || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={nota.conexos_status || "FINALIZADA"}
                    color="success"
                    size="small"
                    sx={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      fontWeight: 600,
                      "& .MuiChip-label": {
                        px: 1.5,
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {nota.pesCod || "-"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

