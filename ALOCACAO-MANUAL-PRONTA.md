# ✅ Referência MANUAL IMPLEMENTADA

## 📦 O que foi feito:

### 1. **Criado novo componente**: `PainelAlocacaoDetalhadaNovo.tsx`
   - ✅ **Remove todos os mocks**
   - ✅ **Carrega NEs reais** da API via `getNotasEntrada()`
   - ✅ **Ordena por FIFO** (data de emissão mais antiga primeiro)
   - ✅ **Permite seleção manual** de quais NEs alocar
   - ✅ **Campos de quantidade** para cada NE selecionada
   - ✅ **Validação** de quantidade total
   - ✅ **Geração de payload** no formato especificado
   - ✅ **Debug visual** do payload em tempo real

### 2. **Criado módulo de API**: `lib/api/alocacao.ts`
   - ✅ `processarAlocacao()` - Chama POST de processamento
   - ✅ `gerarPayloadAlocacao()` - Helper para gerar payload
   - ✅ Tipos TypeScript completos

### 3. **Atualizado**: `api-routes.json`
   - ✅ Adicionado endpoint `alocacao.processar` (POST)
   - ✅ Documentação completa do body/response

---

## 🔄 Como substituir o componente antigo:

### Opção 1: Via VS Code (Recomendado)

1. **Delete** o arquivo antigo:
   ```
   app/alocacao/components/PainelAlocacaoDetalhada.tsx
   ```

2. **Renomeie** o novo arquivo:
   ```
   PainelAlocacaoDetalhadaNovo.tsx → PainelAlocacaoDetalhada.tsx
   ```

### Opção 2: Via Terminal

```powershell
cd c:\Users\yurit\OneDrive\Documentos\agencia\projetos\gestao_de_estoque\savixx\app\alocacao\components

# Deletar o antigo
Remove-Item PainelAlocacaoDetalhada.tsx -Force

# Renomear o novo
Rename-Item PainelAlocacaoDetalhadaNovo.tsx PainelAlocacaoDetalhada.tsx
```

---

## 🎯 Como funciona o fluxo:

### 1. **Usuário seleciona NS** (já implementado em `TabelaNotasSaida.tsx`)
   - Carrega produtos da NS via `getNotaSaidaComProdutos()`

### 2. **Para cada produto da NS**:
   - **Carrega todas as NEs** do sistema (9 notas no seu caso)
   - **Ordena por FIFO**: Mais antigas primeiro (docDtaEmissao crescente)
   - **Exibe tabela** com checkbox + campo quantidade

### 3. **Usuário aloca manualmente**:
   - ✅ Marca checkbox da NE que quer usar
   - ✅ Digita quantidade a alocar daquela NE
   - ✅ Sistema valida: `total alocado ≤ total exigido`
   - ✅ Progresso visual em tempo real

### 4. **Ao clicar "Processar Referência"**:
   - ✅ Gera payload no formato:
     ```json
     {
       "docCodSaida": 46,
       "produtos": [
         {
           "docCodEntrada": 1973,
           "prdCod": 16,
           "quantidade": 1000,
           "dprCodSeqEntrada": 1,
           "dprCodSeqSaida": 1
         }
       ]
     }
     ```
   - ✅ Chama `POST /alocacao/processar` (quando você configurar a URL)
   - ✅ Exibe resultado (sucesso/erro)

---

## 🔍 Debug Visual:

O componente tem um **card de debug** no final que mostra:
- ✅ Payload em tempo real
- ✅ Atualiza conforme você seleciona NEs e digita quantidades
- ✅ JSON formatado (pretty-print)

---

## 📝 Próximos passos:

### 1. **Substitua o componente** (instruções acima)

### 2. **Configure o endpoint POST** no `api-routes.json`:
   ```json
   "alocacao": {
     "processar": {
       "endpoint": "https://savixx-clonex-mp.app.n8n.cloud/webhook/SEU-ID-AQUI"
     }
   }
   ```

### 3. **Teste o fluxo completo**:
   1. Acesse `/alocacao`
   2. Clique em "Alocar" em uma NS
   3. Selecione NEs e digite quantidades
   4. Veja o payload no card de debug
   5. Clique "Processar Referência"

### 4. **Ajuste conforme necessário**:
   - `dprCodSeqEntrada` está fixo em `1` (placeholder)
   - Se precisar buscar o valor real, teremos que chamar a API `getProduto` da NE

---

## 🎨 Funcionalidades implementadas:

✅ **Seleção manual** de NEs (checkboxes)
✅ **Campos de quantidade** (TextField com validação)
✅ **Ordenação FIFO** automática
✅ **Validação** de totais por produto
✅ **Progress bars** visuais
✅ **Alertas** de falta de quantidade
✅ **Ícones de status** (✓ quando completo)
✅ **Tabs** para navegar entre produtos
✅ **Loading states** para API calls
✅ **Error handling** completo
✅ **Debug panel** com JSON do payload
✅ **Botão desabilitado** até completar Referência
✅ **Feedback visual** de sucesso/erro

---

## 🆚 Diferenças do componente antigo:

| Funcionalidade | Antigo | Novo |
|----------------|--------|------|
| Fonte de dados | Mock hardcoded | API real (`getNotasEntrada()`) |
| Seleção de NEs | Automática (FIFO) | Manual (usuário escolhe) |
| Referência automática | ✅ Sim | ❌ Não (controle total do usuário) |
| Quantidade | Auto-calculada | Digitada manualmente |
| POST | Não implementado | ✅ Implementado (`processarAlocacao()`) |
| Debug | Não tinha | ✅ Card de debug com payload |
| FIFO | Sim (implícito) | ✅ Sim (visual - ordena tabela) |

---

## 💡 Exemplo de uso:

### Cenário:
- **NS #46** pede:
  - **Produto A**: 1500 unidades

### Referência manual:
1. Usuário vê **9 NEs** ordenadas por data
2. Marca **NE #1973** (mais antiga)
3. Digita **1000** unidades
4. Marca **NE #1980** (segunda mais antiga)
5. Digita **500** unidades
6. **Total**: 1500 ✅ (completo!)
7. Clica **"Processar Referência"**

### Payload gerado:
```json
{
  "docCodSaida": 46,
  "produtos": [
    {
      "docCodEntrada": 1973,
      "prdCod": 16,
      "quantidade": 1000,
      "dprCodSeqEntrada": 1,
      "dprCodSeqSaida": 1
    },
    {
      "docCodEntrada": 1980,
      "prdCod": 16,
      "quantidade": 500,
      "dprCodSeqEntrada": 1,
      "dprCodSeqSaida": 1
    }
  ]
}
```

---

## ⚠️ Observações:

1. **dprCodSeqEntrada**: Atualmente fixo em `1`. Se precisar do valor real:
   - Teria que chamar `getProduto` da NE para descobrir a sequência
   - Ou backend aceita `1` como placeholder?

2. **Validação de estoque**: 
   - O componente **não verifica** se a NE tem estoque disponível
   - Apenas limita quantidade à `quantidadeExigida` do produto na NS
   - Se quiser validar estoque real, precisa chamar `getProduto` da NE

3. **Múltiplos produtos por NE**:
   - Se uma NE tem vários produtos, usuário pode alocar do mesmo `docCodEntrada` em produtos diferentes da NS
   - Backend deve validar se há estoque para isso

---

## 🚀 Está pronto!

Substitua o componente e teste. Qualquer ajuste, é só avisar!
