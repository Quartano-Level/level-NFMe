'use client';

import { useState } from 'react';
import { Box, Collapse, IconButton, Paper, Typography } from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material';
import type { DetalheNota } from '@/lib/api/api_info';

interface AlertaNotasSemVinculoProps {
  notas: DetalheNota[];
}

export default function AlertaNotasSemVinculo({ notas }: AlertaNotasSemVinculoProps) {
  const [expanded, setExpanded] = useState(false);

  if (!notas || notas.length === 0) {
    return null;
  }

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
              Notas sem vínculo
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#86868b',
                fontSize: '0.875rem',
                mt: 0.25
              }}
            >
              {notas.length} {notas.length === 1 ? 'nota não encontrada' : 'notas não encontradas'} no Conexos
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
            As notas abaixo referenciam NEs que não foram encontradas no sistema Conexos.
            Verifique os registros para entender a origem da inconsistência.
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
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      NS #{nota.docCod} • {nota.dpeNomPessoa || 'Cliente não informado'}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#86868b',
                        fontSize: '0.8125rem',
                        display: 'block'
                      }}
                    >
                      NF {nota.fisNumDocumento} • Série {nota.espSerie} • {new Date(nota.docDtaEmissao).toLocaleDateString('pt-BR')}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 32,
                      height: 24,
                      borderRadius: '6px',
                      backgroundColor: '#f0f0f0',
                      px: 1.5,
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: '#86868b',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {nota.qtdItens || 0} {nota.qtdItens === 1 ? 'item' : 'itens'}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}
