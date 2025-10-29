# Lista de Hortaliças

## Descrição
Esta funcionalidade permite visualizar todas as hortaliças cadastradas no banco de dados em uma interface amigável e organizada.

## Arquivos Criados

### 1. Componente Principal
- **Arquivo**: `src/components/VegetableList/VegetableList.js`
- **Descrição**: Componente React que exibe a lista de hortaliças
- **Funcionalidades**:
  - Busca automática das hortaliças ao carregar
  - Exibição em cards organizados
  - Botões de ação (editar e excluir)
  - Estados de loading, erro e lista vazia
  - Formatação de datas e dados

### 2. Estilos
- **Arquivo**: `src/components/VegetableList/VegetableList.module.css`
- **Descrição**: Estilos CSS para o componente
- **Características**:
  - Design responsivo
  - Cards com hover effects
  - Cores e tipografia consistentes
  - Estados visuais para diferentes situações

### 3. Página
- **Arquivo**: `src/pages/vegetableList.js`
- **Descrição**: Página Next.js que renderiza o componente
- **Estrutura**: Usa o mesmo layout da aplicação (Sidebar + Header)

### 4. Navegação
- **Arquivo**: `src/components/Sidebar/Sidebar.js` (atualizado)
- **Descrição**: Adicionado link para a nova página no menu lateral

## Como Usar

1. **Acessar a Lista**:
   - Clique em "Lista de Hortaliças" no menu lateral
   - Ou navegue diretamente para `/vegetableList`

2. **Visualizar Hortaliças**:
   - Cada hortaliça é exibida em um card individual
   - Informações mostradas:
     - Nome da hortaliça
     - Tipo da hortaliça
     - Tempo estimado (dias)
     - Tempo real (dias)
     - Nível de água (%)
     - Lista de fertilizantes
     - Data de cadastro

3. **Ações Disponíveis**:
   - **Editar**: Botão com ícone de lápis (funcionalidade em desenvolvimento)
   - **Excluir**: Botão com ícone de lixeira (funcionalidade ativa)

## Estados da Interface

### Loading
- Exibe spinner e mensagem "Carregando hortaliças..."
- Aparece durante a busca dos dados

### Erro
- Exibe ícone de erro e mensagem de erro
- Botão "Tentar novamente" para recarregar

### Lista Vazia
- Exibe ícone de planta e mensagem informativa
- Aparece quando não há hortaliças cadastradas

### Lista com Dados
- Exibe os cards das hortaliças em grid responsivo
- Contador de hortaliças no cabeçalho

## Responsividade

- **Desktop**: Grid com múltiplas colunas
- **Tablet**: Grid adaptativo
- **Mobile**: Uma coluna única com layout otimizado

## Dependências

- React Icons (FaLeaf, FaClock, etc.)
- Serviço de API (`@/services/api`)
- CSS Modules para estilização

## Integração com Backend

- **Endpoint**: `GET /hortalicas`
- **Autenticação**: Usa token do localStorage
- **Resposta**: Array de hortaliças com estrutura completa

## Próximos Passos

1. Implementar funcionalidade de edição
2. Adicionar filtros e busca
3. Implementar paginação para grandes listas
4. Adicionar ordenação por diferentes campos
