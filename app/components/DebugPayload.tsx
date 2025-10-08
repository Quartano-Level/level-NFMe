"use client";

import { Card, CardContent, CardHeader, Paper } from "@mui/material";

interface DebugPayloadProps {
  payload: unknown;
}

export function DebugPayload({ payload }: DebugPayloadProps) {
  return (
    <Card variant="outlined">
      <CardHeader title="🔍 Debug: Payload de Referência" />
      <CardContent>
        <Paper sx={{ p: 2, bgcolor: "grey.900", color: "grey.100", fontFamily: "monospace", fontSize: "0.875rem", overflow: "auto", maxHeight: "400px" }}>
          <pre>{JSON.stringify(payload, null, 2)}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
}


