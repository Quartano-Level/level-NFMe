"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { DeparaFornecedorRow } from "@/lib/api/depara-fornecedor";
import { formatColumnName } from "@/lib/utils/formatters";

interface TabelaDeparaFornecedorProps {
  data: DeparaFornecedorRow[];
  onCreate: (row: DeparaFornecedorRow) => void;
  onUpdate: (rows: DeparaFornecedorRow | DeparaFornecedorRow[]) => void;
  onDelete: (ids: (number | string) | (number | string)[]) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

interface EditingRow {
  index: number;
  data: DeparaFornecedorRow;
}

export default function TabelaDeparaFornecedor({
  data,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
  isDeleting,
}: TabelaDeparaFornecedorProps) {
  const [editingRow, setEditingRow] = useState<EditingRow | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [newRowDialog, setNewRowDialog] = useState(false);
  const [newRowData, setNewRowData] = useState<DeparaFornecedorRow>({});
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState<(number | string)[]>([]);

  const columns = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const allKeys = new Set<string>();
    data.forEach((row) => {
      if (row && typeof row === "object") {
        Object.keys(row).forEach((key) => {
          if (key !== "id") {
            allKeys.add(key);
          }
        });
      }
    });

    return Array.from(allKeys).sort();
  }, [data]);

  const getIdField = (row: DeparaFornecedorRow): string | number | undefined => {
    return row.id;
  };

  const handleEdit = (index: number) => {
    setEditingRow({
      index,
      data: { ...data[index] },
    });
  };

  const handleSaveEdit = () => {
    if (editingRow) {
      onUpdate(editingRow.data);
      setEditingRow(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
  };

  const handleFieldChange = (field: string, value: unknown) => {
    if (editingRow) {
      setEditingRow({
        ...editingRow,
        data: {
          ...editingRow.data,
          [field]: value,
        },
      });
    }
  };

  const handleNewRowFieldChange = (field: string, value: unknown) => {
    setNewRowData({
      ...newRowData,
      [field]: value,
    });
  };

  const handleCreateNewRow = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...dataWithoutId } = newRowData;
    onCreate(dataWithoutId);
    setNewRowData({});
    setNewRowDialog(false);
  };

  const handleToggleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((_, index) => index)));
    }
  };

  const handleDeleteSelected = () => {
    const ids = Array.from(selectedRows)
      .map((index) => getIdField(data[index]))
      .filter((id): id is number | string => id !== undefined);

    if (ids.length > 0) {
      setRowsToDelete(ids);
      setDeleteDialog(true);
    }
  };

  const confirmDelete = () => {
    onDelete(rowsToDelete.length === 1 ? rowsToDelete[0] : rowsToDelete);
    setSelectedRows(new Set());
    setDeleteDialog(false);
    setRowsToDelete([]);
  };

  const handleDeleteSingle = (index: number) => {
    const id = getIdField(data[index]);
    if (id !== undefined) {
      setRowsToDelete([id]);
      setDeleteDialog(true);
    }
  };

  if (!data || data.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Nenhum registro encontrado na tabela.
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setNewRowDialog(true)}
          sx={{ mt: 2 }}
        >
          Adicionar Primeira Linha
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Tabela de Depara ({data.length} registro{data.length !== 1 ? "s" : ""})
        </Typography>
        <Box gap={1} display="flex">
          {selectedRows.size > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSelected}
              disabled={isDeleting}
            >
              Excluir Selecionados ({selectedRows.size})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setNewRowDialog(true)}
            disabled={isCreating}
          >
            Adicionar Linha
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedRows.size === data.length && data.length > 0}
                  indeterminate={selectedRows.size > 0 && selectedRows.size < data.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {formatColumnName(column)}
                  </Typography>
                </TableCell>
              ))}
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              const isEditing = editingRow?.index === index;
              const isSelected = selectedRows.has(index);

              return (
                <TableRow key={index} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleToggleSelectRow(index)}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {isEditing ? (
                        <TextField
                          size="small"
                          fullWidth
                          value={editingRow.data[column] ?? ""}
                          onChange={(e) => handleFieldChange(column, e.target.value)}
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2">
                          {String(row[column] ?? "")}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    {isEditing ? (
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <Tooltip title="Salvar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={handleSaveEdit}
                            disabled={isUpdating}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancelar">
                          <IconButton
                            size="small"
                            onClick={handleCancelEdit}
                            disabled={isUpdating}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(index)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteSingle(index)}
                            disabled={isDeleting}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={newRowDialog}
        onClose={() => setNewRowDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Adicionar Nova Linha</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={2}>
            {columns.map((column) => (
              <TextField
                key={column}
                label={formatColumnName(column)}
                fullWidth
                value={String(newRowData[column] ?? "")}
                onChange={(e) => handleNewRowFieldChange(column, e.target.value)}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewRowDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleCreateNewRow}
            variant="contained"
            disabled={isCreating}
            startIcon={<AddIcon />}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir {rowsToDelete.length} registro(s)?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
