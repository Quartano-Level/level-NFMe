# 📋 Fluxo Detalhado de Alocação - Lógica Completa

## 🎯 Objetivo
Documentar a lógica completa de geração do payload de alocação para automatização no N8N, considerando o cenário **1 para 1** (cada produto da NS vem de apenas uma NE).

---

## 📊 Estrutura do Payload Final

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
    }
  ]
}
```

### Campos do Payload:
- **docCodSaida**: Código da Nota de Saída (NS)
- **produtos**: Array de alocações, onde cada item contém:
  - **docCodEntrada**: Código da Nota de Entrada (NE) de onde o produto será retirado
  - **prdCod**: Código do produto
  - **quantidade**: Quantidade a ser alocada (deve ser igual à quantidade exigida na NS)
  - **dprCodSeqEntrada**: Sequência do produto na NE (posição do item na nota de entrada)
  - **dprCodSeqSaida**: Sequência do produto na NS (posição do item na nota de saída)

---

## 🔄 Fluxo Completo Passo a Passo

### **PASSO 1: Obter Detalhes da Nota de Saída**

**Rota:** `GET /notas-saida/detail?docCod={docCodSaida}`

**Endpoint:** `https://level-nfse.app.n8n.cloud/webhook/06ce0737-0d9d-4a7c-b050-b2684913cdey?docCod=113819`

**Response:**
```json
{
  "detalheNota": {
    "docCod": 113819,
    "docEspNumero": "12345",
    "docDtaEmissao": 1729468800000,
    "dpeNomPessoa": "Cliente XYZ",
    ...
  },
  "produtos": {
    "rows": [
      {
        "prdCod": 183043,
        "prdDesNome": "Produto A",
        "dprQtdQuantidade": 8400,
        "dprCodSeq": 1  // ← Sequência na NS
      },
      {
        "prdCod": 183044,
        "prdDesNome": "Produto B",
        "dprQtdQuantidade": 5600,
        "dprCodSeq": 2  // ← Sequência na NS
      },
      {
        "prdCod": 183045,
        "prdDesNome": "Produto C",
        "dprQtdQuantidade": 4200,
        "dprCodSeq": 3  // ← Sequência na NS
      },
      {
        "prdCod": 183046,
        "prdDesNome": "Produto D",
        "dprQtdQuantidade": 4200,
        "dprCodSeq": 4  // ← Sequência na NS
      }
    ]
  }
}
```

**O que fazer:**
- Extrair `docCodSaida` = `113819`
- Extrair array de produtos com:
  - `prdCod` (código do produto)
  - `dprQtdQuantidade` (quantidade exigida)
  - `dprCodSeq` (sequência na NS - será usado como `dprCodSeqSaida`)

---

### **PASSO 2: Para Cada Produto da NS, Buscar NEs Vinculadas**

**Rota:** `GET /notas-entrada/match?docCodSaida={docCodSaida}`

**Endpoint:** `https://level-nfse.app.n8n.cloud/webhook/06ce0737-0d9d-4a7c-b050-b2684913cdes?docCodSaida=113819`

**Response:**
```json
{
  "data": [
    {
      "detalheNota": {
        "docCod": 289188,
        "docEspNumero": "NE-289188",
        "docDtaEmissao": 1729000000000,  // ← Usado para FIFO
        "dpeNomPessoa": "Fornecedor ABC",
        ...
      },
      "produtos": {
        "rows": [
          {
            "prdCod": 183043,
            "prdDesNome": "Produto A",
            "dprQtdQuantidade": 10000,
            "dprCodSeq": 1  // ← Sequência na NE (dprCodSeqEntrada)
          },
          {
            "prdCod": 183044,
            "prdDesNome": "Produto B",
            "dprQtdQuantidade": 6000,
            "dprCodSeq": 2
          },
          {
            "prdCod": 183045,
            "prdDesNome": "Produto C",
            "dprQtdQuantidade": 5000,
            "dprCodSeq": 1
          },
          {
            "prdCod": 183046,
            "prdDesNome": "Produto D",
            "dprQtdQuantidade": 4500,
            "dprCodSeq": 3
          }
        ]
      }
    }
  ]
}
```

**Observações Importantes:**
1. A API já retorna **apenas NEs vinculadas** à NS
2. A API já retorna **apenas produtos que existem na NS**
3. Cada NE pode ter múltiplos produtos
4. Cada produto na NE tem seu próprio `dprCodSeq` (sequência na NE)

---

### **PASSO 3: Aplicar Lógica FIFO (First In, First Out)**

**Regra:** Ordenar NEs por `docDtaEmissao` (data de emissão) - **mais antigas primeiro**

**Algoritmo:**
```javascript
// Ordenar NEs por data de emissão (FIFO)
nesOrdenadas = nes.sort((a, b) => 
  a.detalheNota.docDtaEmissao - b.detalheNota.docDtaEmissao
);
```

---

### **PASSO 4: Alocação 1 para 1 (Automatizada)**

**Cenário:** Cada produto da NS vem de **apenas uma NE**

**Para cada produto da NS:**

1. **Filtrar NEs que contêm o produto:**
   ```javascript
   nesComProduto = nesOrdenadas.filter(ne => 
     ne.produtos.rows.some(p => p.prdCod === produtoNS.prdCod)
   );
   ```

2. **Pegar a primeira NE (FIFO):**
   ```javascript
   neSelecionada = nesComProduto[0];
   ```

3. **Encontrar o produto na NE:**
   ```javascript
   produtoNE = neSelecionada.produtos.rows.find(
     p => p.prdCod === produtoNS.prdCod
   );
   ```

4. **Verificar disponibilidade:**
   ```javascript
   quantidadeDisponivel = produtoNE.dprQtdQuantidade;
   quantidadeExigida = produtoNS.dprQtdQuantidade;
   
   if (quantidadeDisponivel < quantidadeExigida) {
     // ERRO: Não há estoque suficiente
     throw new Error(`Produto ${produtoNS.prdCod} não tem estoque suficiente na NE ${neSelecionada.detalheNota.docCod}`);
   }
   ```

5. **Montar item de alocação:**
   ```javascript
   alocacao = {
     docCodEntrada: neSelecionada.detalheNota.docCod,
     prdCod: produtoNS.prdCod,
     quantidade: produtoNS.dprQtdQuantidade,  // Quantidade completa exigida
     dprCodSeqEntrada: produtoNE.dprCodSeq,  // Sequência na NE
     dprCodSeqSaida: produtoNS.dprCodSeq     // Sequência na NS
   };
   ```

---

### **PASSO 5: Montar Payload Final**

**Estrutura:**
```javascript
payload = {
  docCodSaida: 113819,
  produtos: [
    // Array com todas as alocações geradas no PASSO 4
  ]
};
```

**Exemplo Completo:**
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
    },
    {
      "docCodEntrada": 289188,
      "prdCod": 183045,
      "quantidade": 4200,
      "dprCodSeqEntrada": 1,
      "dprCodSeqSaida": 3
    },
    {
      "docCodEntrada": 289188,
      "prdCod": 183046,
      "quantidade": 4200,
      "dprCodSeqEntrada": 3,
      "dprCodSeqSaida": 4
    }
  ]
}
```

---

## 🔍 Detalhes Importantes

### **1. Como encontrar `dprCodSeqEntrada`?**

**Resposta:** Está no campo `dprCodSeq` do produto dentro da NE retornada pela API.

**Exemplo:**
- NS pede produto `prdCod: 183043`
- NE `289188` tem esse produto com `dprCodSeq: 1`
- Logo: `dprCodSeqEntrada = 1`

### **2. Como encontrar `dprCodSeqSaida`?**

**Resposta:** Está no campo `dprCodSeq` do produto na NS.

**Exemplo:**
- Produto `prdCod: 183043` na NS tem `dprCodSeq: 1`
- Logo: `dprCodSeqSaida = 1`

### **3. A API já filtra produtos?**

**Sim!** A rota `getNotasEntradaByNotaSaida` retorna:
- Apenas NEs **vinculadas** à NS
- Apenas produtos que **existem na NS**

**Mas atenção:** Ainda é necessário filtrar por `prdCod` específico se você quiser apenas NEs que têm o produto exato que você está processando.

### **4. E se uma NE não tiver estoque suficiente?**

**No cenário 1 para 1:** Deve dar erro, pois não é possível dividir a alocação entre múltiplas NEs.

**Validação necessária:**
```javascript
if (quantidadeDisponivel < quantidadeExigida) {
  throw new Error(`Estoque insuficiente para produto ${prdCod}`);
}
```

### **5. E se houver múltiplas NEs com o mesmo produto?**

**FIFO:** Sempre usar a NE mais antiga (menor `docDtaEmissao`).

---

## 📝 Pseudocódigo Completo para N8N

```javascript
// PASSO 1: Obter detalhes da NS
const detalheNS = await GET(`/notas-saida/detail?docCod=${docCodSaida}`);
const produtosNS = detalheNS.produtos.rows;
const docCodSaida = detalheNS.detalheNota.docCod;

// PASSO 2: Buscar NEs vinculadas
const nesResponse = await GET(`/notas-entrada/match?docCodSaida=${docCodSaida}`);
const nes = nesResponse.data;

// PASSO 3: Ordenar por FIFO
const nesOrdenadas = nes.sort((a, b) => 
  a.detalheNota.docDtaEmissao - b.detalheNota.docDtaEmissao
);

// PASSO 4: Para cada produto da NS, alocar
const alocacoes = [];

for (const produtoNS of produtosNS) {
  // Filtrar NEs que têm este produto
  const nesComProduto = nesOrdenadas.filter(ne => 
    ne.produtos.rows.some(p => p.prdCod === produtoNS.prdCod)
  );
  
  if (nesComProduto.length === 0) {
    throw new Error(`Nenhuma NE encontrada para produto ${produtoNS.prdCod}`);
  }
  
  // Pegar primeira NE (FIFO)
  const neSelecionada = nesComProduto[0];
  
  // Encontrar produto na NE
  const produtoNE = neSelecionada.produtos.rows.find(
    p => p.prdCod === produtoNS.prdCod
  );
  
  if (!produtoNE) {
    throw new Error(`Produto ${produtoNS.prdCod} não encontrado na NE ${neSelecionada.detalheNota.docCod}`);
  }
  
  // Validar estoque
  if (produtoNE.dprQtdQuantidade < produtoNS.dprQtdQuantidade) {
    throw new Error(
      `Estoque insuficiente: Produto ${produtoNS.prdCod} ` +
      `requer ${produtoNS.dprQtdQuantidade} mas NE ${neSelecionada.detalheNota.docCod} ` +
      `tem apenas ${produtoNE.dprQtdQuantidade}`
    );
  }
  
  // Criar alocação
  alocacoes.push({
    docCodEntrada: neSelecionada.detalheNota.docCod,
    prdCod: produtoNS.prdCod,
    quantidade: produtoNS.dprQtdQuantidade,
    dprCodSeqEntrada: produtoNE.dprCodSeq,
    dprCodSeqSaida: produtoNS.dprCodSeq
  });
}

// PASSO 5: Montar payload final
const payload = {
  docCodSaida: docCodSaida,
  produtos: alocacoes
};

// PASSO 6: Enviar para processamento
await POST('/alocacao/processar', payload);
```

---

## 🎯 Resumo Executivo

1. **Buscar NS:** Obter produtos e suas quantidades exigidas
2. **Buscar NEs:** Obter NEs vinculadas com seus produtos
3. **FIFO:** Ordenar NEs por data de emissão (mais antigas primeiro)
4. **Alocar 1:1:** Para cada produto da NS, pegar primeira NE que tem o produto
5. **Montar payload:** Criar array com todas as alocações
6. **Validar:** Verificar se há estoque suficiente em cada NE
7. **Enviar:** POST do payload para processamento

---

## ⚠️ Pontos de Atenção

1. **`dprCodSeqEntrada`** vem do campo `dprCodSeq` do produto na NE
2. **`dprCodSeqSaida`** vem do campo `dprCodSeq` do produto na NS
3. **FIFO** é aplicado ordenando por `docDtaEmissao` (menor = mais antiga)
4. **Validação de estoque** é obrigatória antes de montar o payload
5. **Cenário 1:1** significa que cada produto vem de apenas uma NE (não divide entre múltiplas)

---

## 📚 Referências de Código

- **Geração de payload:** `app/components/PainelAlocacaoDetalhada.tsx` (linhas 140-159)
- **Busca de NEs:** `lib/api/notas-entrada.ts` (função `getNotasEntradaByNotaSaida`)
- **Estrutura do payload:** `lib/api/alocacao.ts` (interface `PayloadProcessamentoAlocacao`)
- **FIFO automático:** `app/components/AlocacaoPorProduto.tsx` (linhas 85-102)



