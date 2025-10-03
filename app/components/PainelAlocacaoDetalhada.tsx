"use client";

import { useState, SyntheticEvent } from "react";
import {
  Button,
  Card,
  Box,
  Stack,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  CircularProgress,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// API
import {
  processarAlocacao,
  type PayloadProcessamentoAlocacao,
} from "@/lib/api/alocacao";
import {
  DetailNotaSaidaResponse,
  DetalheNota,
  ProdutoRow,
} from "@/lib/api/api_info";
import { TabPanel } from "./TabPanel";
import { AlocacaoPorProduto } from "./AlocacaoPorProduto";
import { ResumoAlocacao } from "./ResumoAlocacao";
import { DebugPayload } from "./DebugPayload";
import Link from "next/link";

// ==================== TIPOS ====================

type AlocacaoItem = {
  docCodEntrada: number;
  numeroNE: string;
  dataEntrada: string;
  quantidade: number;
  dprCodSeqEntrada: number;
};

// ==================== PROPS ====================

interface PainelAlocacaoDetalhadaProps {
  detalheNotaSaida: DetailNotaSaidaResponse;
  // onAlocacaoChange removido - não precisa sincronizar com pai
  // quantidadeTotalAlocada e quantidadeTotalExigida calculados localmente
  onProcessar: () => void;
  isLoading: boolean;
}

// Removido: componentes internos migrados para arquivos próprios

// ==================== COMPONENTE PRINCIPAL ====================

export const PainelAlocacaoDetalhada = ({
  detalheNotaSaida,
  onProcessar,
  isLoading,
}: PainelAlocacaoDetalhadaProps) => {
  const [abaAtual, setAbaAtual] = useState(0);
  const [alocacoesPorProduto, setAlocacoesPorProduto] = useState<
    Record<string, AlocacaoItem[]>
  >({});
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState<{
    sucesso: boolean;
    mensagem: string;
  } | null>(null);

  const produtos = detalheNotaSaida?.produtos?.rows || [];

  // Calcular totais localmente
  const quantidadeTotalExigida = produtos.reduce(
    (acc, p) => acc + p.dprQtdQuantidade,
    0
  );
  const quantidadeTotalAlocada = Object.values(alocacoesPorProduto)
    .flat()
    .reduce((acc, a) => acc + a.quantidade, 0);

  const handleSelecaoNE = (
    produtoId: string,
    ne: DetalheNota,
    selecionado: boolean
  ) => {
    setAlocacoesPorProduto((prev) => {
      const alocacoesAtuais = prev[produtoId] || [];
      if (selecionado) {
        return {
          ...prev,
          [produtoId]: [
            ...alocacoesAtuais,
            {
              docCodEntrada: ne.docCod,
              numeroNE: ne.docEspNumero || `NE-${ne.docCod}`,
              dataEntrada: new Date(ne.docDtaEmissao).toISOString(),
              quantidade: 0,
              dprCodSeqEntrada: 1,
            },
          ],
        };
      } else {
        return {
          ...prev,
          [produtoId]: alocacoesAtuais.filter(
            (item) => item.docCodEntrada !== ne.docCod
          ),
        };
      }
    });
  };

  const handleQuantidadeChange = (
    produtoId: string,
    docCodEntrada: number,
    quantidade: number
  ) => {
    setAlocacoesPorProduto((prev) => {
      const alocacoesAtuais = prev[produtoId] || [];
      return {
        ...prev,
        [produtoId]: alocacoesAtuais.map((item) =>
          item.docCodEntrada === docCodEntrada ? { ...item, quantidade } : item
        ),
      };
    });
  };

  const handleMudarAba = (event: SyntheticEvent, novoValor: number) =>
    setAbaAtual(novoValor);

  const handleProcessarAlocacao = async () => {
    setProcessando(true);
    setResultado(null);

    try {
      const payload: PayloadProcessamentoAlocacao = {
        docCodSaida: detalheNotaSaida.detalheNota.docCod,
        produtos: [],
      };

      produtos.forEach((produto) => {
        const chaveUnica = `${produto.prdCod}-${produto.dprCodSeq}`;
        const alocacoes = alocacoesPorProduto[chaveUnica] || [];
        alocacoes.forEach((alocacao) => {
          if (alocacao.quantidade > 0) {
            payload.produtos.push({
              docCodEntrada: alocacao.docCodEntrada,
              prdCod: produto.prdCod,
              quantidade: alocacao.quantidade,
              dprCodSeqEntrada: alocacao.dprCodSeqEntrada,
              dprCodSeqSaida: produto.dprCodSeq,
            });
          }
        });
      });

      console.log("📤 Payload gerado:", JSON.stringify(payload, null, 2));

      const resposta = await processarAlocacao(payload);
      setResultado({
        sucesso: true,
        mensagem: resposta.message || "Alocação processada com sucesso!",
      });
      onProcessar();
    } catch (error: unknown) {
      console.error("❌ Erro ao processar:", error);
      setResultado({
        sucesso: false,
        mensagem:
          error instanceof Error ? error.message : "Erro ao processar alocação",
      });
    } finally {
      setProcessando(false);
    }
  };

  const isProcessamentoHabilitado =
    quantidadeTotalAlocada === quantidadeTotalExigida &&
    quantidadeTotalAlocada > 0;
  const progresso =
    quantidadeTotalExigida > 0
      ? (quantidadeTotalAlocada / quantidadeTotalExigida) * 100
      : 0;

  if (isLoading) {
    return (
      <Stack spacing={3}>
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>
            Carregando detalhes da nota de saída...
          </Typography>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Link href="/" style={{ width: "100%" }}>
        <Button variant="outlined" fullWidth startIcon={<ArrowBackIcon />}>
          Voltar para a lista
        </Button>
      </Link>

      {resultado && (
        <Alert
          severity={resultado.sucesso ? "success" : "error"}
          onClose={() => setResultado(null)}
        >
          <AlertTitle>{resultado.sucesso ? "Sucesso!" : "Erro"}</AlertTitle>
          {resultado.mensagem}
        </Alert>
      )}

      {!isLoading &&  (
        <ResumoAlocacao
          subheader={`NS nº ${detalheNotaSaida.detalheNota.docEspNumero}`}
          cliente={detalheNotaSaida.detalheNota.dpeNomPessoa}
          dataEmissao={detalheNotaSaida.detalheNota.docDtaEmissao}
          totalExigido={quantidadeTotalExigida}
          totalAlocado={quantidadeTotalAlocada}
          progresso={progresso}
          isLoading={processando || isLoading}
          onProcessar={handleProcessarAlocacao}
          processarHabilitado={isProcessamentoHabilitado}
          infoAdicional={detalheNotaSaida.infosAdicionais}
        />
      )}

      <Card variant="outlined">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={abaAtual}
            onChange={handleMudarAba}
            aria-label="abas de produtos"
            variant="scrollable"
            scrollButtons="auto"
          >
            {produtos.map((p, index) => (
              <Tab
                label={`${p.prdDesNome}`}
                key={`tab-${p.prdCod}-${p.dprCodSeq}`}
                id={`product-tab-${index}`}
              />
            ))}
          </Tabs>
        </Box>
        {produtos.map((p, index) => (
          <TabPanel
            value={abaAtual}
            index={index}
            key={`panel-${p.prdCod}-${p.dprCodSeq}`}
          >
            <AlocacaoPorProduto
              produto={p}
              docCodSaida={detalheNotaSaida.detalheNota.docCod}
              alocacoesProduto={
                alocacoesPorProduto[`${p.prdCod}-${p.dprCodSeq}`] || []
              }
              onSelecaoNE={(ne: DetalheNota, sel: boolean) =>
                handleSelecaoNE(`${p.prdCod}-${p.dprCodSeq}`, ne, sel)
              }
              onQuantidadeChange={(docCodEntrada: number, qtd: number) =>
                handleQuantidadeChange(
                  `${p.prdCod}-${p.dprCodSeq}`,
                  docCodEntrada,
                  qtd
                )
              }
            />
          </TabPanel>
        ))}
      </Card>

      <DebugPayload
        payload={{
          docCodSaida: detalheNotaSaida.detalheNota.docCod,
          produtos: produtos.flatMap((produto) => {
            const chaveUnica = `${produto.prdCod}-${produto.dprCodSeq}`;
            const alocacoes = alocacoesPorProduto[chaveUnica] || [];
            return alocacoes
              .filter((a) => a.quantidade > 0)
              .map((a) => ({
                docCodEntrada: a.docCodEntrada,
                prdCod: produto.prdCod,
                quantidade: a.quantidade,
                dprCodSeqEntrada: a.dprCodSeqEntrada,
                dprCodSeqSaida: produto.dprCodSeq,
              }));
          }),
        }}
      />
    </Stack>
  );
};
