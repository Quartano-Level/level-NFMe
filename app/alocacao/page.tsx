"use client";

import { useState } from "react";
import { TabelaNotasSaida } from "./components/TabelaNotasSaida";
import { PainelAlocacaoDetalhada } from "./components/PainelAlocacaoDetalhada";
import { Container, Typography, Box } from "@mui/material";

// Tipos de Dados (Atualizados)
type ProdutoDemanda = {
  id: string;
  prdCod: number;
  dprCodSeq: number;
  nome: string;
  quantidadeExigida: number;
};

type NotaSaida = {
  id: string;
  docCod: number;
  numero: string;
  cliente: string;
  dataEmissao: string;
  produtos: ProdutoDemanda[];
};

export default function AlocacaoPage() {
  // Estados a serem gerenciados em page.tsx
  const [telaAtual, setTelaAtual] = useState<"lista" | "alocacao">("lista");
  const [notaSaidaSelecionada, setNotaSaidaSelecionada] =
    useState<NotaSaida | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Funções
  const handleIniciarAlocacao = (ns: NotaSaida) => {
    setNotaSaidaSelecionada(ns);
    setTelaAtual("alocacao");
  };

  const handleProcessar = async () => {
    setIsLoading(true);
    console.log("Processando Alocação:", {
      notaSaidaId: notaSaidaSelecionada?.id,
    });

    // Simula uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    alert(`Alocação para a NS ${notaSaidaSelecionada?.numero} processada com sucesso!`);
    
    // Resetar estado e voltar para a lista
    handleVoltar();
  };

  const handleVoltar = () => {
    setNotaSaidaSelecionada(null);
    setTelaAtual("lista");
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Alocação de Estoque
        </Typography>
      </Box>

      <Box>
        {telaAtual === "lista" ? (
          <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', mt: { xs: 4, md: 8 } }}>
            <TabelaNotasSaida onAlocar={handleIniciarAlocacao} />
          </Box>
        ) : (
          <Box sx={{ width: '100%' }}>
            <PainelAlocacaoDetalhada
              notaSaidaSelecionada={notaSaidaSelecionada!}
              onVoltar={handleVoltar}
              onProcessar={handleProcessar}
              isLoading={isLoading}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}
