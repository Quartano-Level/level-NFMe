"use client";

import useSWR from "swr";
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
} from "@mui/material";
import { getNotasSaidaFront, getNotaSaidaComProdutos } from "@/lib/api/notas-saida";
import type { NotaSaida as NotaSaidaAPI } from "@/lib/types/notas";

// Tipos atualizados
type ProdutoDemanda = {
  id: string;
  prdCod: number;
  dprCodSeq: number;
  nome: string;
  quantidadeExigida: number;
};

type NotaSaida = {
  id: string;
  numero: string;
  cliente: string;
  dataEmissao: string;
  produtos: ProdutoDemanda[];
  docCod: number;
  docTip: number;
  valor: number;
  status: number;
};

/**
 * Converte NotaSaidaAPI para o formato esperado pelo componente
 * TODO: Quando tivermos a rota de detalhes, buscar produtos reais
 */
const converterNotaSaida = (nota: NotaSaidaAPI): NotaSaida => {
  return {
    id: `${nota.docTip}-${nota.docCod}`,
    numero: nota.docEspNumero,
    cliente: nota.dpeNomPessoa,
    dataEmissao: new Date(nota.docDtaEmissao).toISOString(),
    produtos: [], // TODO: Buscar da rota de detalhes
    docCod: nota.docCod,
    docTip: nota.docTip,
    valor: nota.docMnyValor,
    status: nota.vldStatus,
  };
};

const fetcher = async () => {
  const notasAPI = await getNotasSaidaFront();
  
  // Filtrar apenas notas que precisam de processamento (status 1 = Em Digitação)
  const notasPendentes = notasAPI.filter(nota => nota.vldStatus === 1 && nota.docVldFinalizado === 0);
  
  return notasPendentes.map(converterNotaSaida);
};

interface TabelaNotasSaidaProps {
  onAlocar: (ns: NotaSaida) => void;
}

export const TabelaNotasSaida = ({ onAlocar }: TabelaNotasSaidaProps) => {
  const { data, error, isLoading } = useSWR<NotaSaida[]>(
    "notasSaidaPendentes",
    fetcher,
    { 
      refreshInterval: 30000, // Atualiza a cada 30 segundos
      revalidateOnFocus: true,
    }
  );

  /**
   * Handler para carregar produtos e iniciar alocação
   */
  const handleAlocar = async (ns: NotaSaida) => {
    try {
      console.log('[TabelaNotasSaida] Carregando produtos da nota:', ns.docCod);
      
      // Busca produtos da nota
      const notaDetalhada = await getNotaSaidaComProdutos(ns.docCod);
      
      if (notaDetalhada) {
        // Converte produtos para o formato esperado
        const produtosFormatados: ProdutoDemanda[] = notaDetalhada.produtos.rows.map(p => ({
          id: `prod_${p.prdCod}`,
          prdCod: p.prdCod,
          dprCodSeq: p.dprCodSeq,
          nome: p.prdDesNome,
          quantidadeExigida: p.dprQtdQuantidade,
        }));
        
        // Atualiza a nota com produtos reais
        const notaComProdutos: NotaSaida = {
          ...ns,
          produtos: produtosFormatados,
        };
        
        console.log('[TabelaNotasSaida] ✅ Produtos carregados:', produtosFormatados.length);
        onAlocar(notaComProdutos);
      } else {
        alert('❌ Não foi possível carregar os produtos desta nota.');
      }
    } catch (error) {
      console.error('[TabelaNotasSaida] ❌ Erro ao carregar produtos:', error);
      alert('❌ Erro ao carregar produtos da nota. Tente novamente.');
    }
  };

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando notas de saída pendentes...</Typography>
      </Box>
    );
  
  if (error)
    return (
      <Typography color="error" align="center" sx={{ my: 4 }}>
        ❌ Falha ao carregar notas de saída: {error.message}
      </Typography>
    );

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          ✅ Nenhuma nota de saída pendente de alocação!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Todas as notas foram processadas.
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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Número da NS</strong></TableCell>
            <TableCell><strong>Cliente/Destino</strong></TableCell>
            <TableCell><strong>Valor</strong></TableCell>
            <TableCell><strong>Data de Emissão</strong></TableCell>
            <TableCell><strong>Itens</strong></TableCell>
            <TableCell><strong>Ação</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((ns) => (
            <TableRow key={ns.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {ns.numero}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Doc: {ns.docCod}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{ns.cliente}</Typography>
              </TableCell>
              <TableCell>{formatCurrency(ns.valor)}</TableCell>
              <TableCell>
                {new Date(ns.dataEmissao).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell align="center">
                <Chip 
                  label="Carregar detalhes" 
                  color="default" 
                  size="small" 
                />
              </TableCell>
              <TableCell>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleAlocar(ns)}
                  size="small"
                >
                  Alocar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
