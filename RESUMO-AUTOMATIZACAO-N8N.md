# 🚀 Resumo: Automatização de Alocação no N8N

## 📋 Fluxo Simplificado

```
┌─────────────────────────────────────────────────────────────┐
│ 1. OBTER NOTA DE SAÍDA (NS)                                 │
│    GET /notas-saida/detail?docCod=113819                    │
│    ↓                                                         │
│    Extrair: docCodSaida, produtos (prdCod, quantidade, seq) │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. BUSCAR NOTAS DE ENTRADA (NEs) VINCULADAS                 │
│    GET /notas-entrada/match?docCodSaida=113819              │
│    ↓                                                         │
│    Retorna: NEs com produtos que existem na NS              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. APLICAR FIFO (ORDENAR POR DATA)                          │
│    Ordenar NEs por docDtaEmissao (menor = mais antiga)     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. PARA CADA PRODUTO DA NS:                                 │
│                                                              │
│    a) Filtrar NEs que têm este prdCod                       │
│    b) Pegar primeira NE (FIFO)                                │
│    c) Encontrar produto na NE                               │
│    d) Validar: quantidade disponível >= quantidade exigida  │
│    e) Criar alocação:                                       │
│       - docCodEntrada: NE.docCod                            │
│       - prdCod: produto.prdCod                              │
│       - quantidade: produtoNS.dprQtdQuantidade               │
│       - dprCodSeqEntrada: produtoNE.dprCodSeq               │
│       - dprCodSeqSaida: produtoNS.dprCodSeq                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. MONTAR PAYLOAD                                           │
│    {                                                         │
│      "docCodSaida": 113819,                                 │
│      "produtos": [array de alocações]                       │
│    }                                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. ENVIAR PARA PROCESSAMENTO                                │
│    POST /alocacao/processar                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Campos Importantes

### Da Nota de Saída (NS):
- `docCod` → `docCodSaida` no payload
- `produtos.rows[].prdCod` → `prdCod` no payload
- `produtos.rows[].dprQtdQuantidade` → `quantidade` no payload
- `produtos.rows[].dprCodSeq` → `dprCodSeqSaida` no payload

### Da Nota de Entrada (NE):
- `detalheNota.docCod` → `docCodEntrada` no payload
- `produtos.rows[].dprCodSeq` → `dprCodSeqEntrada` no payload
- `detalheNota.docDtaEmissao` → usado para ordenação FIFO

---

## ⚡ Lógica Rápida (1 para 1)

```javascript
// Para cada produto da NS:
1. Filtrar NEs que têm este produto
2. Ordenar por data (FIFO)
3. Pegar primeira NE
4. Verificar se tem estoque suficiente
5. Alocar quantidade completa da NS nesta NE
```

---

## 📝 Exemplo Prático

**NS #113819 tem:**
- Produto 183043, quantidade 8400, seq 1
- Produto 183044, quantidade 5600, seq 2

**NE #289188 tem:**
- Produto 183043, quantidade 10000, seq 1
- Produto 183044, quantidade 6000, seq 2

**Resultado:**
```json
{
  "docCodSaida": 113819,
  "produtos": [
    {
      "docCodEntrada": 289188,
      "prdCod": 183043,
      "quantidade": 8400,
      "dprCodSeqEntrada": 1,
      "dprCodSeqSaida": 1
    },
    {
      "docCodEntrada": 289188,
      "prdCod": 183044,
      "quantidade": 5600,
      "dprCodSeqEntrada": 2,
      "dprCodSeqSaida": 2
    }
  ]
}
```

---

## ⚠️ Validações Obrigatórias

1. ✅ NE deve ter o produto (`prdCod` igual)
2. ✅ Quantidade disponível na NE >= quantidade exigida na NS
3. ✅ NE deve estar vinculada à NS (API já filtra isso)
4. ✅ Aplicar FIFO (sempre pegar NE mais antiga)

---

## 🎯 Endpoints N8N

1. **Detalhe NS:** `GET https://level-nfse.app.n8n.cloud/webhook/06ce0737-0d9d-4a7c-b050-b2684913cdey?docCod={docCodSaida}`
2. **Match NEs:** `GET https://level-nfse.app.n8n.cloud/webhook/06ce0737-0d9d-4a7c-b050-b2684913cdes?docCodSaida={docCodSaida}`
3. **Processar:** `POST https://level-nfse.app.n8n.cloud/webhook/6ce267f3-3048-4ed9-994b-16ba1567b7ef`

---

## 📚 Documentação Completa

- **`FLUXO-ALOCACAO-DETALHADO.md`** - Detalhes completos e pseudocódigo
- **`EXEMPLOS-RESPONSES-API.md`** - Exemplos completos de responses de todas as requisições

