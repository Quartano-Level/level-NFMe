"use client";

import { useState } from "react";
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
    Link,
    Collapse,
    IconButton,
    CircularProgress,
    Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useQuery } from "@tanstack/react-query";
import { getNotasPendentes, NotaPendente } from "@/lib/api/notas-pendentes";

export const AlertaNotasPendentes = () => {
    const [expandido, setExpandido] = useState(false);

    const { data: notas = [], isLoading, error } = useQuery({
        queryKey: ['notasPendentes'],
        queryFn: getNotasPendentes,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <CircularProgress size={24} />
                <Typography sx={{ ml: 2, color: '#86868b' }}>
                    Carregando notas com erro...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return null; // Silenciosamente não exibe se houver erro
    }

    if (notas.length === 0) {
        return null; // Não exibe se não houver notas pendentes
    }

    return (
        <Paper
            elevation={0}
            sx={{
                mb: 3,
                border: '1px solid #ff3b30',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#fff5f5',
            }}
        >
            {/* Header Clicável */}
            <Box
                onClick={() => setExpandido(!expandido)}
                sx={{
                    p: 2.5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 59, 48, 0.05)',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                                fontSize: '1rem',
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
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                        label={notas.length}
                        size="small"
                        sx={{
                            backgroundColor: '#ff3b30',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                        }}
                    />
                    <IconButton size="small">
                        {expandido ? (
                            <ExpandLessIcon sx={{ color: '#86868b' }} />
                        ) : (
                            <ExpandMoreIcon sx={{ color: '#86868b' }} />
                        )}
                    </IconButton>
                </Box>
            </Box>

            {/* Conteúdo Expandível */}
            <Collapse in={expandido}>
                <Box sx={{ borderTop: '1px solid rgba(255, 59, 48, 0.2)' }}>
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
                                    <TableCell>Nota</TableCell>
                                    <TableCell>Arquivo</TableCell>
                                    <TableCell>Motivo do Erro</TableCell>
                                    <TableCell>Data</TableCell>
                                    <TableCell align="center">Link</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {notas.map((nota: NotaPendente, index: number) => (
                                    <TableRow
                                        key={nota.id}
                                        sx={{
                                            transition: 'background-color 0.2s',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 59, 48, 0.03)',
                                            },
                                            '& td': {
                                                borderBottom:
                                                    index === notas.length - 1
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
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default AlertaNotasPendentes;
