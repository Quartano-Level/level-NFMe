"use client";

import { useState, useMemo } from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Link,
    CircularProgress,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useQuery } from "@tanstack/react-query";
import { getNotasPendentes, NotaPendente } from "@/lib/api/notas-pendentes";

type Order = 'asc' | 'desc';
type OrderBy = 'doc_esp_num' | 'sharepoint_name' | 'motivo' | 'created_at' | 'docCod';

export const TabelaNotasComErro = () => {
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<OrderBy>('created_at');
    const [searchTerm, setSearchTerm] = useState('');
    const [motivoFilter, setMotivoFilter] = useState<string>('');

    const { data: notas = [], isLoading, error } = useQuery({
        queryKey: ['notasPendentes'],
        queryFn: getNotasPendentes,
        staleTime: 1000 * 60 * 5,
    });

    // Get unique motivos for the dropdown
    const uniqueMotivos = useMemo(() => {
        const motivos = notas.map((nota) => nota.motivo);
        return [...new Set(motivos)].sort();
    }, [notas]);

    // Filter and sort notes
    const filteredAndSortedNotas = useMemo(() => {
        let result = [...notas];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter((nota) =>
                nota.doc_esp_num?.toLowerCase().includes(term) ||
                nota.docCod?.toLowerCase().includes(term)
            );
        }

        // Apply motivo filter
        if (motivoFilter) {
            result = result.filter((nota) => nota.motivo === motivoFilter);
        }

        // Sort
        result.sort((a, b) => {
            let aValue: string | number = '';
            let bValue: string | number = '';

            switch (orderBy) {
                case 'doc_esp_num':
                    aValue = a.doc_esp_num || '';
                    bValue = b.doc_esp_num || '';
                    break;
                case 'sharepoint_name':
                    aValue = a.sharepoint_name || '';
                    bValue = b.sharepoint_name || '';
                    break;
                case 'motivo':
                    aValue = a.motivo || '';
                    bValue = b.motivo || '';
                    break;
                case 'created_at':
                    aValue = new Date(a.created_at).getTime();
                    bValue = new Date(b.created_at).getTime();
                    break;
                case 'docCod':
                    aValue = a.docCod || '';
                    bValue = b.docCod || '';
                    break;
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return order === 'asc' ? aValue - bValue : bValue - aValue;
            }

            const comparison = String(aValue).localeCompare(String(bValue));
            return order === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [notas, searchTerm, motivoFilter, order, orderBy]);

    const handleSort = (property: OrderBy) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress size={24} />
                <Typography sx={{ ml: 2, color: '#86868b' }}>
                    Carregando notas com erro...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return null;
    }

    if (notas.length === 0) {
        return null;
    }

    return (
        <Paper
            elevation={0}
            sx={{
                mb: 3,
                border: '1px solid #ff3b30',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#fff',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 3,
                    borderBottom: '1px solid rgba(255, 59, 48, 0.2)',
                    backgroundColor: '#fff5f5',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            backgroundColor: 'rgba(255, 59, 48, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ErrorOutlineIcon sx={{ color: '#ff3b30', fontSize: '1.4rem' }} />
                    </Box>
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 600,
                                fontSize: '1.125rem',
                                color: '#1d1d1f',
                                letterSpacing: '-0.01em',
                            }}
                        >
                            Notas com erro
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '0.875rem',
                                color: '#86868b',
                            }}
                        >
                            {notas.length} {notas.length === 1 ? 'nota apresentou' : 'notas apresentaram'} erro ao processar
                            {filteredAndSortedNotas.length !== notas.length && (
                                <Chip
                                    label={`${filteredAndSortedNotas.length} exibidas`}
                                    size="small"
                                    sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                                />
                            )}
                        </Typography>
                    </Box>
                </Box>

                {/* Filters */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        size="small"
                        placeholder="Buscar por Nota ou DocCod..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            minWidth: 280,
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: '#e5e5e7',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#86868b',
                                },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#86868b', fontSize: '1.2rem' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel sx={{ backgroundColor: '#fff5f5', px: 0.5 }}>
                            Filtrar por Motivo
                        </InputLabel>
                        <Select
                            value={motivoFilter}
                            onChange={(e) => setMotivoFilter(e.target.value)}
                            label="Filtrar por Motivo"
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#e5e5e7',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#86868b',
                                },
                            }}
                        >
                            <MenuItem value="">
                                <em>Todos os motivos</em>
                            </MenuItem>
                            {uniqueMotivos.map((motivo) => (
                                <MenuItem key={motivo} value={motivo}>
                                    {motivo}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {(searchTerm || motivoFilter) && (
                        <Chip
                            label="Limpar filtros"
                            onClick={() => {
                                setSearchTerm('');
                                setMotivoFilter('');
                            }}
                            onDelete={() => {
                                setSearchTerm('');
                                setMotivoFilter('');
                            }}
                            sx={{
                                height: 40,
                                backgroundColor: '#1d1d1f',
                                color: '#fff',
                                '& .MuiChip-deleteIcon': {
                                    color: '#fff',
                                },
                                '&:hover': {
                                    backgroundColor: '#2c2c2e',
                                },
                            }}
                        />
                    )}
                </Box>
            </Box>

            {/* Table */}
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow
                            sx={{
                                '& th': {
                                    borderBottom: '1px solid rgba(255, 59, 48, 0.2)',
                                    py: 1.5,
                                    px: 2.5,
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    color: '#86868b',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    backgroundColor: 'rgba(255, 59, 48, 0.03)',
                                },
                            }}
                        >
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'doc_esp_num'}
                                    direction={orderBy === 'doc_esp_num' ? order : 'asc'}
                                    onClick={() => handleSort('doc_esp_num')}
                                >
                                    Nota
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'docCod'}
                                    direction={orderBy === 'docCod' ? order : 'asc'}
                                    onClick={() => handleSort('docCod')}
                                >
                                    DocCod
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'sharepoint_name'}
                                    direction={orderBy === 'sharepoint_name' ? order : 'asc'}
                                    onClick={() => handleSort('sharepoint_name')}
                                >
                                    Arquivo
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'motivo'}
                                    direction={orderBy === 'motivo' ? order : 'asc'}
                                    onClick={() => handleSort('motivo')}
                                >
                                    Motivo do Erro
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'created_at'}
                                    direction={orderBy === 'created_at' ? order : 'asc'}
                                    onClick={() => handleSort('created_at')}
                                >
                                    Data
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">Link</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAndSortedNotas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography sx={{ color: '#86868b' }}>
                                        Nenhuma nota encontrada com os filtros aplicados.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAndSortedNotas.map((nota: NotaPendente, index: number) => (
                                <TableRow
                                    key={nota.id}
                                    sx={{
                                        transition: 'background-color 0.2s',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 59, 48, 0.03)',
                                        },
                                        '& td': {
                                            borderBottom:
                                                index === filteredAndSortedNotas.length - 1
                                                    ? 'none'
                                                    : '1px solid rgba(255, 59, 48, 0.1)',
                                            py: 2,
                                            px: 2.5,
                                        },
                                    }}
                                >
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '0.9375rem',
                                                color: '#1d1d1f',
                                            }}
                                        >
                                            #{nota.doc_esp_num}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            sx={{
                                                fontSize: '0.8125rem',
                                                color: '#86868b',
                                            }}
                                        >
                                            {nota.docCod || '-'}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            sx={{
                                                fontSize: '0.8125rem',
                                                color: '#86868b',
                                                maxWidth: '200px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                            title={nota.sharepoint_name}
                                        >
                                            {nota.sharepoint_name}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: '6px',
                                                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '0.8125rem',
                                                    color: '#ff3b30',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {nota.motivo}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            sx={{
                                                fontSize: '0.8125rem',
                                                color: '#86868b',
                                                fontVariantNumeric: 'tabular-nums',
                                            }}
                                        >
                                            {new Date(nota.created_at).toLocaleDateString('pt-BR')}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="center">
                                        <Link
                                            href={nota.sharepoint_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 32,
                                                height: 32,
                                                borderRadius: '8px',
                                                backgroundColor: '#1d1d1f',
                                                color: '#fff',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    backgroundColor: '#2c2c2e',
                                                    transform: 'scale(1.05)',
                                                },
                                            }}
                                        >
                                            <OpenInNewIcon sx={{ fontSize: '1rem' }} />
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default TabelaNotasComErro;
