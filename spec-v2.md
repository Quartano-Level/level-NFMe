# Savixx - Frontend de Alocação de Estoque (v3)

## 1. Visão Geral do Projeto

Este documento é a fonte da verdade para o desenvolvimento da interface de alocação de estoque da Savixx. O objetivo é criar uma página única e eficiente onde um analista possa selecionar uma Nota Fiscal de Saída (NS) pendente e alocar as quantidades necessárias a partir de Notas Fiscais de Entrada (NE) disponíveis em estoque.

- **Framework:** Next.js
- **Deployment:** Vercel
- **Linguagem:** TypeScript
- **UI Components:** **Material-UI (MUI)** - Escolhido para uma base de componentes robusta e um sistema de design consistente.
- **Data Fetching:** SWR

---

## 2. Modo de Desenvolvimento com Dados Mockados

Para permitir o desenvolvimento e a validação completa da interface sem a necessidade de um backend funcional, **a aplicação opera com dados mockados**. As chamadas de API são interceptadas e retornam dados estáticos que simulam a resposta do servidor.

- **Simulação de Latência:** Uma pequena latência artificial é adicionada às respostas para simular o comportamento de uma requisição de rede real.
- **Consistência dos Dados:** Os dados mocados seguem exatamente os contratos de API definidos na seção 5.

---

## 3. Fluxo do Usuário (v2 - Múltiplos Produtos)

A principal mudança é a capacidade de lidar com **múltiplos produtos em uma única Nota de Saída**.

1.  **Acesso e Visualização:** O analista visualiza a tabela de NS. Se uma NS tiver múltiplos produtos, eles serão listados na célula "Produtos".
2.  **Seleção da Demanda:** Ao clicar em "Alocar", o analista é levado à tela de alocação.
3.  **Tela de Alocação com Abas:** A interface de alocação agora exibe uma **interface de abas**, onde cada aba corresponde a um produto da Nota de Saída.
    *   **Painel de Resumo Geral (Topo):** Um painel fixo exibe o progresso **total** da alocação (soma de todos os produtos) e o botão "Processar Alocação".
    *   **Abas de Produtos:**
        *   Cada aba contém o fluxo de alocação para um produto específico: detalhes da demanda daquele item, a tabela de estoque disponível para ele, e a área para alocar as quantidades.
4.  **Execução da Alocação:** O analista navega entre as abas e aloca a quantidade necessária para cada produto.
5.  **Processamento:** O botão "Processar Alocação" só é **habilitado** quando as quantidades de **todos os produtos** nas abas tiverem sido totalmente alocadas.
6.  **Confirmação e Feedback:** (Inalterado)

---

## 4. Estrutura da Página e Componentes (`app/alocacao/page.tsx`)

A estrutura de componentes será adaptada para suportar a lógica de abas. O `PainelAlocacaoDetalhada` agora orquestrará as abas e o estado de alocação por produto.

---

## 5. Contratos de API e Dados Mockados (v2)

A estrutura da `NotaSaida` foi atualizada para suportar um array de produtos.

### 5.1. Busca de Notas de Saída Pendentes
  - **Nova Estrutura `NotaSaida`:**
    ```typescript
    type ProdutoDemanda = {
      id: string;
      nome: string;
      quantidadeExigida: number;
    };

    type NotaSaida = {
      id: string;
      numero: string;
      cliente: string;
      dataEmissao: string;
      produtos: ProdutoDemanda[];
    };
    ```
  - **Mock Data Atualizado:**
    ```json
    [
      {
        "id": "NS-MULTI-01",
        "numero": "998877",
        "cliente": "Cliente Exemplo C (Multi)",
        "dataEmissao": "2025-09-18T09:00:00Z",
        "produtos": [
          { "id": "prod_malte_1", "nome": "Malte Pilsen", "quantidadeExigida": 300 },
          { "id": "prod_malte_2", "nome": "Malte Pale Ale", "quantidadeExigida": 150 }
        ]
      },
      {
        "id": "NS-12345",
        "numero": "12345",
        "cliente": "Cliente Exemplo A",
        "dataEmissao": "2025-09-10T10:00:00Z",
        "produtos": [
          { "id": "prod_malte_1", "nome": "Malte Pilsen", "quantidadeExigida": 250 }
        ]
      }
    ]
    ```

### 5.2. Busca de Notas de Entrada Disponíveis por Produto
  - **Query Params:** `product_id={id_do_produto}`
  - **Mock Data (Ex: para `prod_malte_1`):**
    ```json
    [
      {
        "id": "NE-A",
        "numero": "NF-ENT-001",
        "dataEntrada": "2025-08-01T09:00:00Z",
        "quantidadeDisponivel": 500
      },
      {
        "id": "NE-B",
        "numero": "NF-ENT-002",
        "dataEntrada": "2025-08-15T14:00:00Z",
        "quantidadeDisponivel": 300
      }
    ]
    ```

### 5.3. Processamento da Alocação
  - **Simulação:** A função `onProcessar` irá simular uma chamada de API com um `setTimeout`. Após 1.5 segundos, retornará uma resposta de sucesso, acionando o modal de feedback e o redirecionamento para a lista.
