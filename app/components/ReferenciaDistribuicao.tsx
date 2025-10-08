'use client';

import { Box, Paper, Typography } from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';

interface ReferenciaDistribuicaoProps {
  texto: string;
}

export function ReferenciaDistribuicao({ texto }: ReferenciaDistribuicaoProps) {
  if (!texto || texto.trim() === '') {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'sticky',
        top: 16,
        zIndex: 100,
        mb: 3,
        border: '2px solid #1d1d1f',
        borderRadius: '12px',
        backgroundColor: '#fafafa',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: '#1d1d1f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <InfoIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.125rem',
              color: '#1d1d1f',
              letterSpacing: '-0.02em',
            }}
          >
            Informações Adicionais DANFE
          </Typography>
        </Box>

        {/* Content */}
        <Box
          sx={{
            pl: 7, // Alinha com o texto do header (40px icon + 12px gap + padding)
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#1d1d1f',
              fontSize: '0.9375rem',
              lineHeight: 1.7,
              fontWeight: 500,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {texto}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
