'use client';

import { useState } from 'react';
import { Box, Collapse, IconButton, Paper, Typography, Button } from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ErrorOutline as ErrorOutlineIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import type { DetalheNota } from '@/lib/api/api_info';
import { formatCurrency } from '@/lib/utils/formatters';

interface AlertaContaOrdemTerceirosProps {
  notas: DetalheNota[];
}

export default function AlertaContaOrdemTerceiros({ notas }: AlertaContaOrdemTerceirosProps) {
  const [expanded, setExpanded] = useState(false);

  if (!notas || notas.length === 0) {
    return null;
  }

  const abrirNoConexos = (numeroNota: string) => {
    const url = `https://level.conexos.cloud/com297#/?pageNumber=1&pageSize=20&searchOnLoad=true&orderBy=desc&sortBy=docCod&docEspNumero!LIKE=${encodeURIComponent(numeroNota)}&vldStatus!IN=1&vldStatus!IN=2&vldStatus!IN=3&vldStatus!IN=7`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        mb: 3,
        border: '1px solid',
        borderColor: '#e5e5e7',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: '#d1d1d6',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
        }
      }}
    >
      {/* Header - Always Visible */}
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2.5,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: '#fafafa'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
              transform: expanded ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <ErrorOutlineIcon sx={{ color: '#1d1d1f', fontSize: 24 }} />
          </Box>
          
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: '1rem',
                color: '#1d1d1f',
                letterSpacing: '-0.01em'
              }}
            >
              Remessa por conta e ordem de terceiros
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#86868b',
                fontSize: '0.875rem',
                mt: 0.25
              }}
            >
              {notas.length} {notas.length === 1 ? 'nota pronta' : 'notas prontas'} para finalização
            </Typography>
          </Box>
        </Box>

        <IconButton
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            color: '#86868b'
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>

      {/* Expandable Content */}
      <Collapse in={expanded} timeout={300}>
        <Box sx={{ px: 2.5, pb: 2.5 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#86868b',
              fontSize: '0.875rem',
              mb: 2,
              lineHeight: 1.5
            }}
          >
            Notas de saída classificadas como remessa por conta e ordem de terceiros.
            Estas operações seguem regime especial de tributação.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {notas.map((nota) => (
              <Box
                key={`${nota.docCod}-${nota.docTip}`}
                sx={{
                  p: 2,
                  borderRadius: '10px',
                  backgroundColor: '#fafafa',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    borderColor: '#e0e0e0',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#1d1d1f',
                        fontSize: '0.9375rem',
                        mb: 0.25
                      }}
                    >
                      {nota.docEspNumero || `NS-${nota.docCod}`}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#86868b',
                        fontSize: '0.8125rem',
                        display: 'block'
                      }}
                    >
                      #{nota.docCod}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 2, minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.9375rem',
                        color: '#1d1d1f',
                        mb: 0.25,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {nota.dpeNomPessoa || 'Cliente não informado'}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#86868b',
                        fontSize: '0.8125rem',
                        display: 'block'
                      }}
                    >
                      {formatCurrency(nota.docMnyValor)} • {nota.qtdItens || 0} {nota.qtdItens === 1 ? 'item' : 'itens'} • {new Date(nota.docDtaEmissao).toLocaleDateString('pt-BR')}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<OpenInNewIcon sx={{ fontSize: '16px !important' }} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirNoConexos(nota.docEspNumero || `${nota.docCod}`);
                    }}
                    sx={{
                      backgroundColor: '#1d1d1f',
                      color: '#fff',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      borderRadius: '6px',
                      px: 2,
                      py: 0.75,
                      boxShadow: 'none',
                      minWidth: '110px',
                      '&:hover': {
                        backgroundColor: '#2c2c2e',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    Ver no Conexos
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}
