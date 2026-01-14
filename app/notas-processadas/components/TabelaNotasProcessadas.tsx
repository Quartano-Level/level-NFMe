"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Chip,
  TableSortLabel,
  Paper,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Button,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { NotaProcessada } from "@/lib/api/notas-processadas";

interface TabelaNotasProcessadasProps {
  data: NotaProcessada[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
}

type Order = "asc" | "desc";
type OrderBy = "docCod" | "conexos_status" | "pesCod";

export default function TabelaNotasProcessadas({
  data,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  isLoading = false,
}: TabelaNotasProcessadasProps) {
  const [orderBy, setOrderBy] = useState<OrderBy>("docCod");
  const [order, setOrder] = useState<Order>("desc");

  // Calcular número total de páginas
  const totalPages = Math.ceil(total / limit);

  // Ordenação local (os filtros são feitos no backend)
  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
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
  }, [data, orderBy, order]);

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
      {/* Controles de paginação */}
      <Box mb={3}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Itens por página</InputLabel>
              <Select
                value={limit}
                label="Itens por página"
                onChange={(e) => {
                  onLimitChange(Number(e.target.value));
                  onPageChange(1); // Resetar para primeira página ao mudar limit
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
            <Box flexGrow={1} />
            <Typography variant="body2" color="text.secondary">
              Mostrando {data.length} de {total} nota{total !== 1 ? "s" : ""}
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
                <Typography variant="subtitle2" fontWeight="bold">
                  Número da Nota
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Cliente
                </Typography>
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
                <Typography variant="subtitle2" fontWeight="bold">
                  Link
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((nota) => (
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
                  <Typography variant="body2">
                    {nota.numero_nota || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {nota.cliente || "-"}
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
                  {nota.docCod ? (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<OpenInNewIcon />}
                      onClick={() => {
                        window.open(
                          `https://level.conexos.cloud/com297#/cadastro/${nota.docCod}`,
                          "_blank"
                        );
                      }}
                      sx={{
                        textTransform: "none",
                      }}
                    >
                      Abrir
                    </Button>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginação */}
      {totalPages > 1 && (
        <Box mt={3} display="flex" justifyContent="center">
          <Stack spacing={2} alignItems="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, newPage) => onPageChange(newPage)}
              color="primary"
              showFirstButton
              showLastButton
              size="large"
            />
            <Typography variant="body2" color="text.secondary">
              Página {page} de {totalPages}
            </Typography>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

