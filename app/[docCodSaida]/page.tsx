"use client";

import { Container, Typography, Box } from "@mui/material";
import { useParams } from "next/navigation";
import { getNotaSaidaDetalhada } from "@/lib/api/notas-saida";
import { useQuery } from "@tanstack/react-query";
import { PainelAlocacaoDetalhada } from "../components/PainelAlocacaoDetalhada";
import { useRouter } from "next/navigation";

export default function AlocacaoNotaPage() {
  const { docCodSaida } = useParams<{ docCodSaida: string }>();
  const router = useRouter();

  const query = useQuery({
    queryKey: ["detalheNotaSaida", docCodSaida],
    queryFn: async () => await getNotaSaidaDetalhada(Number(docCodSaida)),
  });

  const { data, error, isLoading } = query;

  const handleProcessar = async () => {
    console.log("Processando Alocação:", {
      notaSaidaId: data?.detalheNota.docCod,
    });

    // Simula uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // TODO: Integrar com a API de processamento de alocação

    alert(
      `Alocação para a NS ${data?.detalheNota.docEspNumero} processada com sucesso!`
    );

    // Resetar estado e voltar para a lista
    router.push("/");
  };

  if (!isLoading && (data === null || error !== null)) {
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
            Erro ao carregar detalhes da nota de saída
          </Typography>
        </Box>
      </Container>
    );
  }

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

      <Box>
        <Box sx={{ width: "100%" }}>
          <PainelAlocacaoDetalhada
            detalheNotaSaida={data!}
            onProcessar={handleProcessar}
            isLoading={isLoading}
          />
        </Box>
      </Box>
    </Container>
  );
}
