# Savixx - Frontend de Referência de Estoque (v2)

## 1. Visão Geral do Projeto

Este documento é a fonte da verdade para o desenvolvimento da interface de Referência de estoque da Savixx. O objetivo é criar uma página única e eficiente onde um analista possa selecionar uma Nota Fiscal de Saída (NS) pendente e alocar as quantidades necessárias a partir de Notas Fiscais de Entrada (NE) disponíveis em estoque.

- **Framework:** Next.js
- **Deployment:** Vercel
- **Linguagem:** TypeScript
- **Estilo Sugerido:** Tailwind CSS
- **UI Components:** Shadcn/UI, Material UI, ou similar (para tabelas, botões, inputs, modais).
- **Data Fetching:** SWR ou React Query (essencial para lidar com caching, revalidação e estados de loading/error).

---

## 2. Fluxo do Usuário

1.  **Acesso e Visualização:** O analista acessa a página e visualiza imediatamente uma tabela com **todas** as Notas de Saída com status "Pendente de Referência".
2.  **Seleção da Demanda:** O analista clica no botão "Alocar" na linha da NS desejada para iniciar o processo.
3.  **Tela de Referência:** A interface exibe a tela de Referência com três seções principais:
    * **Painel de Demanda (Topo):** Detalhes da NS selecionada (Produto, Quantidade Total Exigida, Destino).
    * **Painel de Estoque Disponível (Meio):** Uma tabela com todas as NEs disponíveis para aquele produto específico. O usuário pode selecionar as NEs que deseja usar (ex: via checkboxes).
    * **Painel de Referência (Abaixo):** Conforme as NEs são selecionadas, elas aparecem nesta área, cada uma com um campo de input para que o analista digite a quantidade a ser alocada daquele lote.
4.  **Execução da Referência:** O analista preenche as quantidades nos inputs das NEs selecionadas. Um painel de resumo é atualizado em tempo real.
5.  **Processamento:** O botão "Processar Referência" só é **habilitado** quando a `Quantidade Total Alocada` é exatamente igual à `Quantidade Exigida` pela NS.
6.  **Confirmação:** Ao clicar no botão, uma requisição é enviada ao backend (n8n). Um estado de "loading" é exibido no botão ou na tela.
7.  **Feedback e Redirecionamento:**
    * **Sucesso:** Um **modal de sucesso** é exibido. Ao fechar o modal, o usuário é **redirecionado de volta à tela inicial** (a lista de NS pendentes), que agora deve estar atualizada (sem a nota que acabou de ser alocada).
    * **Erro:** Uma mensagem de erro informa o analista sobre o problema, permitindo que ele corrija os dados e tente novamente.

---

## 3. Estrutura da Página e Componentes (`app/alocacao/page.tsx`)

A interface funcionará como uma Single Page Application, com o estado controlando a visualização (lista de NS vs. tela de Referência).

```

/app
└── /alocacao
├── page.tsx            \# Componente principal que gerencia o estado geral
└── /components
├── TabelaNotasSaida.tsx
├── PainelAlocacaoDetalhada.tsx
└── ResumoAlocacao.tsx

````

### 3.1. `TabelaNotasSaida.tsx` (Visualização Inicial)

-   **Responsabilidade:** Exibir a lista de NS pendentes.
-   **Colunas:** `Número da NS`, `Cliente/Destino`, `Produto`, `Quantidade Exigida`, `Data de Emissão`, `Ação` (Botão "Alocar").
-   **Lógica:**
    -   Faz a chamada à API `GET http://localhost:5678/webhook-test/2e4eb9ad-667d-4073-b0b3-6f9c2b90aedf?pescod=801`.
    -   O botão "Alocar" em cada linha chama uma função no componente pai (`page.tsx`) para mudar para a tela de Referência, passando o objeto da NS selecionada.

### 3.2. `PainelAlocacaoDetalhada.tsx` (Visualização de Referência)

-   **Responsabilidade:** Orquestrar a seleção e Referência de NEs.
-   **Props:** Recebe o objeto da `notaSaidaSelecionada`.
-   **Estrutura Interna:**
    1.  **Cabeçalho da Demanda:** Exibe os dados da NS (Produto, Quantidade Exigida).
    2.  **Tabela de NEs Disponíveis:**
        -   Faz a chamada à API `GET http://localhost:5678/webhook-test/359e545e-7939-48e3-82d3-b4370323c39b?product_id={id_do_produto}`.
        -   **Colunas:** `Checkbox de Seleção`, `Número da NE`, `Data de Entrada`, `Quantidade Disponível`.
    3.  **Área de Referência (Itens Selecionados):**
        -   Exibe **apenas** as NEs que foram selecionadas na tabela acima.
        -   **Colunas:** `Número da NE`, `Quantidade Disponível`, `Campo de Input: Quantidade a Alocar`.
-   **Lógica:**
    -   Gerencia um estado interno para as NEs selecionadas e para as quantidades alocadas em cada input.
    -   A cada mudança nos inputs, emite um evento para o componente pai (`page.tsx`) com o estado atual das alocações para que o resumo possa ser atualizado.
    -   O input de "Quantidade a Alocar" deve ser validado para não permitir valor maior que a "Quantidade Disponível" daquela NE.

### 3.3. `ResumoAlocacao.tsx`

-   **Responsabilidade:** Exibir o progresso da Referência e o botão de ação principal.
-   **Props:** Recebe `quantidadeExigida`, `quantidadeTotalAlocada`, e a função `onProcessar`.
-   **Estrutura:**
    -   Texto de status: `Alocado: {quantidadeTotalAlocada} / {quantidadeExigida} ton`.
    -   Uma barra de progresso visual (opcional, mas recomendado).
    -   Botão `Processar Referência`:
        -   **Estado Desabilitado:** `quantidadeTotalAlocada !== quantidadeExigida`.
        -   **Estado Habilitado:** `quantidadeTotalAlocada === quantidadeExigida` e `quantidadeTotalAlocada > 0`.
        -   Ao ser clicado, chama a função `onProcessar` recebida via props.

---

## 4. Gestão de Estado e Tipos (`app/alocacao/page.tsx`)

O componente `page.tsx` será o orquestrador principal.

```typescript
// Tipos de Dados
type NotaSaida = { id: string; numero: string; cliente: string; produto: { id: string; nome: string }; quantidadeExigida: number; dataEmissao: string; };
type Alocacao = { notaEntradaId: string; quantidade: number; };

// Estados a serem gerenciados em page.tsx
const [telaAtual, setTelaAtual] = useState<'lista' | 'alocacao'>('lista');
const [notaSaidaSelecionada, setNotaSaidaSelecionada] = useState<NotaSaida | null>(null);
const [alocacoes, setAlocacoes] = useState<Alocacao[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(false);

// Derivar estado para o resumo
const quantidadeTotalAlocada = alocacoes.reduce((acc, curr) => acc + curr.quantidade, 0);

// Funções
const handleIniciarAlocacao = (ns: NotaSaida) => {
  setNotaSaidaSelecionada(ns);
  setTelaAtual('alocacao');
};

const handleProcessar = async () => {
  setIsLoading(true);
  // Lógica de chamada à API POST
  // Em caso de sucesso: exibir modal e depois chamar setTelaAtual('lista'); setNotaSaidaSelecionada(null);
  // Em caso de erro: exibir notificação de erro.
  setIsLoading(false);
};
````

-----

## 5\. Contratos de API (Frontend \<\> Backend n8n)

### 5.1. Busca de Notas de Saída Pendentes

  - **Método:** `GET`
  - **Endpoint:** `http://localhost:5678/webhook-test/2e4eb9ad-667d-4073-b0b3-6f9c2b90aedf?pescod=801`
  - **Resposta de Sucesso (200 OK):**
    ```json
    [
      {
        "id": "NS-12345",
        "numero": "12345",
        "cliente": "Cliente Exemplo A",
        "produto": { "id": "prod_malte_1", "nome": "Malte 1" },
        "quantidadeExigida": 200,
        "dataEmissao": "2025-09-10T10:00:00Z"
      }
    ]
    ```

### 5.2. Busca de Notas de Entrada Disponíveis por Produto

  - **Método:** `GET`
  - **Endpoint:** `http://localhost:5678/webhook-test/359e545e-7939-48e3-82d3-b4370323c39b`
  - **Query Params:** `product_id={id_do_produto}` (Ex: `?product_id=prod_malte_1`)
  - **Resposta de Sucesso (200 OK):**
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

### 5.3. Processamento da Referência

  - **Status:** **Endpoint a ser definido pelo time de backend.**
  - **Método:** `POST`
  - **Endpoint Sugerido:** `/api/processar-alocacao`
  - **Corpo da Requisição (Body):**
    ```json
    {
      "notaSaidaId": "NS-12345",
      "alocacoes": [
        { "notaEntradaId": "NE-A", "quantidade": 100 },
        { "notaEntradaId": "NE-B", "quantidade": 100 }
      ]
    }
    ```
  - **Resposta de Sucesso (200 OK):**
    ```json
    {
      "status": "sucesso",
      "mensagem": "Referência para a NS 12345 processada com sucesso.",
      "transacaoId": "xyz-789"
    }
    ```

<!-- end list -->
