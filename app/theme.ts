'use client';
import { createTheme } from '@mui/material/styles';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#142d4c', // Azul Escuro
    },
    secondary: {
      main: '#9fd3c7', // Verde Água (Destaque)
      contrastText: '#142d4c',
    },
    background: {
      default: '#f4f6f8', // Um cinza um pouco mais claro
      paper: '#ffffff',
    },
    text: {
        primary: '#142d4c',
        secondary: '#385170',
    }
  },
  shape: {
    borderRadius: 12, // Bordas mais arredondadas
  },
  typography: {
    fontFamily: dmSans.style.fontFamily,
    button: {
      textTransform: 'none', // Botões sem caixa alta
      fontWeight: '500',
    },
    h4: {
        fontWeight: 700,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Sombra mais sutil
        }
      }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }
        }
    }
  }
});

export default theme;
