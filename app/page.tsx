"use client";

import { TabelaNotasSaida } from "./components/TabelaNotasSaida";
import { Container, Typography, Box } from "@mui/material";

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: '2rem',
            color: '#1d1d1f',
            letterSpacing: '-0.02em'
          }}
        >
          Alocação de Estoque
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
          mt: { xs: 4, md: 8 },
        }}
      >
        <TabelaNotasSaida />
      </Box>
    </Container>
  );
}
