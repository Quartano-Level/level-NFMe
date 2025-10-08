"use client";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import { formatQuantity } from "@/lib/utils/formatters";

interface ResumoAlocacaoProps {
  titulo?: string;
  subheader?: string;
  cliente: string;
  dataEmissao: number;
  totalExigido: number;
  totalAlocado: number;
  progresso: number; // 0..100
  isLoading?: boolean;
  onProcessar: () => void;
  processarHabilitado: boolean;
}

export function ResumoAlocacao({
  titulo = "Resumo Geral da Referência",
  subheader,
  cliente,
  dataEmissao,
  totalExigido,
  totalAlocado,
  progresso,
  isLoading,
  onProcessar,
  processarHabilitado,
}: ResumoAlocacaoProps) {
  return (
    <Card variant="outlined">
      <CardHeader title={titulo} subheader={subheader} />
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 4 }}
          justifyContent="space-between"
          alignItems={{ sm: "flex-end" }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Cliente
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {cliente}
            </Typography>
          </Box>
          <Box sx={{ textAlign: { sm: "right" } }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Data Emissão
            </Typography>
            <Typography variant="body1">
              {new Date(dataEmissao).toLocaleDateString("pt-BR")}
            </Typography>
          </Box>
          <Box sx={{ textAlign: { sm: "right" } }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total Exigido
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {formatQuantity(totalExigido)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: { sm: "right" } }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total Alocado
            </Typography>
            <Typography
              variant="h6"
              color={processarHabilitado ? "success.main" : "text.primary"}
              sx={{ fontWeight: "bold" }}
            >
              {formatQuantity(totalAlocado)}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 3 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            <Typography variant="body2" color="text.secondary">
              Progresso Total
            </Typography>
            <Typography variant="body2" color="text.secondary">{`${Math.round(
              progresso
            )}%`}</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(progresso, 100)}
            color={processarHabilitado ? "success" : "primary"}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, justifyContent: "flex-end" }}>
        <LoadingButton
          loading={isLoading}
          onClick={onProcessar}
          variant="contained"
          disabled={!processarHabilitado}
          startIcon={<SendIcon />}
          size="large"
        >
          Processar Referência
        </LoadingButton>
      </CardActions>
    </Card>
  );
}
