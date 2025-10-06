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
import AlertaNotasSemVinculo from "../alocacao/components/AlertaNotasSemVinculo";
import type { DetalheNota } from "@/lib/api/api_info";

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
        <Typography sx={{ ml: 2 }}>Carregando notas de saída...</Typography>
      </Box>
    );
  
  if (error)
    return (
      <Typography color="error" align="center" sx={{ my: 4 }}>
        ❌ Falha ao carregar notas de saída: {error.message}
      </Typography>
    );

  const notasPendentes = data?.pendentes?.rows || [];
  const notasSemVinculo = data?.sem_vinculo?.rows || [];
  const totalPendentes = data?.pendentes?.count || 0;
  const totalSemVinculo = data?.sem_vinculo?.count || 0;

  // Handler para ver detalhes de nota sem vínculo
  const handleVerDetalhes = (nota: DetalheNota) => {
    console.log('Ver detalhes da nota:', nota);
    // TODO: Implementar modal ou navegação para detalhes
  };

  if (totalPendentes === 0 && totalSemVinculo === 0) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 6, 
          textAlign: 'center',
          border: '1px solid #e5e5e7',
          borderRadius: '12px',
          backgroundColor: '#fafafa'
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '2rem'
          }}
        >
          ✓
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '1.125rem',
            color: '#1d1d1f',
            mb: 1
          }}
        >
          Tudo em dia
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#86868b',
            fontSize: '0.9375rem'
          }}
        >
          Nenhuma nota pendente de alocação no momento.
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
    <Box>
      {/* Alerta para notas SEM vínculo - Monochrome */}
      {notasSemVinculo.length > 0 && (
        <AlertaNotasSemVinculo notas={notasSemVinculo} />
      )}

      {/* Tabela de notas PENDENTES - Estilo Apple */}
      {notasPendentes.length > 0 && (
        <Paper 
          elevation={0}
          sx={{ 
            border: '1px solid #e5e5e7',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#fff'
          }}
        >
          {/* Header da Tabela */}
          <Box sx={{ 
            p: 3, 
            borderBottom: '1px solid #e5e5e7',
            backgroundColor: '#fafafa'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: '1.125rem',
                color: '#1d1d1f',
                letterSpacing: '-0.01em',
                mb: 0.5
              }}
            >
              Notas pendentes
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#86868b',
                fontSize: '0.875rem'
              }}
            >
              {totalPendentes} {totalPendentes === 1 ? 'nota pronta' : 'notas prontas'} para alocação
            </Typography>
          </Box>
          
          {/* Tabela Minimalista */}
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ 
                  '& th': { 
                    borderBottom: '1px solid #e5e5e7',
                    py: 2,
                    px: 3,
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    color: '#86868b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }
                }}>
                  <TableCell>Nota</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Emissão</TableCell>
                  <TableCell align="center">Itens</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notasPendentes.map((ns, index) => (
                  <TableRow 
                    key={ns.docCod}
                    sx={{ 
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: '#fafafa'
                      },
                      '& td': {
                        borderBottom: index === notasPendentes.length - 1 ? 'none' : '1px solid #f0f0f0',
                        py: 2.5,
                        px: 3
                      }
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            color: '#1d1d1f',
                            mb: 0.25
                          }}
                        >
                          #{ns.docEspNumero}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#86868b',
                            fontSize: '0.8125rem'
                          }}
                        >
                          Doc {ns.docCod}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: '0.9375rem',
                          color: '#1d1d1f',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '250px'
                        }}
                      >
                        {ns.dpeNomPessoa}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: '0.9375rem',
                          color: '#1d1d1f',
                          fontVariantNumeric: 'tabular-nums'
                        }}
                      >
                        {formatCurrency(ns.docMnyValor)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: '0.875rem',
                          color: '#86868b',
                          fontVariantNumeric: 'tabular-nums'
                        }}
                      >
                        {new Date(ns.docDtaEmissao).toLocaleDateString('pt-BR')}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 32,
                          height: 24,
                          borderRadius: '6px',
                          backgroundColor: '#f0f0f0',
                          px: 1,
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: '#1d1d1f'
                        }}
                      >
                        {ns.qtdItens || 0}
                      </Box>
                    </TableCell>
                    
                    <TableCell align="right">
                      <Link href={`/alocacao/${ns.docCod}`} style={{ textDecoration: 'none' }}>
                        <Button 
                          variant="contained" 
                          size="small"
                          sx={{
                            backgroundColor: '#1d1d1f',
                            color: '#fff',
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            borderRadius: '8px',
                            px: 2.5,
                            py: 0.75,
                            boxShadow: 'none',
                            '&:hover': {
                              backgroundColor: '#2c2c2e',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                            }
                          }}
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
        </Paper>
      )}
    </Box>
  );
};

