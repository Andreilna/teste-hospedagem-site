# Funcionalidade de Edição de Hortaliças

## Descrição
Esta funcionalidade permite editar hortaliças cadastradas no banco de dados, seguindo o mesmo design e padrão da aplicação.

## Arquivos Criados

### 1. Componente de Edição
- **Arquivo**: `src/components/VegetableEdit/VegetableEdit.js`
- **Descrição**: Componente React para edição de hortaliças
- **Funcionalidades**:
  - Carrega dados da hortaliça pelo ID
  - Formulário pré-preenchido com dados existentes
  - Validação de campos
  - Estados de loading, erro e salvamento
  - Navegação de volta para a lista

### 2. Estilos
- **Arquivo**: `src/components/VegetableEdit/VegetableEdit.module.css`
- **Descrição**: Estilos CSS para o componente de edição
- **Características**:
  - Design consistente com o resto da aplicação
  - Layout responsivo
  - Estados visuais para diferentes situações
  - Animações e transições suaves

### 3. Página de Edição
- **Arquivo**: `src/pages/editVegetable.js`
- **Descrição**: Página Next.js que renderiza o componente de edição
- **Estrutura**: Usa o mesmo layout da aplicação (Sidebar + Header)

### 4. Integração com Lista
- **Arquivo**: `src/components/VegetableList/VegetableList.js` (atualizado)
- **Descrição**: Adicionada funcionalidade de edição na lista
- **Funcionalidades**:
  - Botão de editar em cada card
  - Navegação para página de edição
  - Passagem do ID da hortaliça via query parameter

## Como Usar

### 1. Acessar a Edição
- Na lista de hortaliças (`/vegetableList`)
- Clique no botão de editar (ícone de lápis) em qualquer hortaliça
- Será redirecionado para `/editVegetable?id={ID_DA_HORTALICA}`

### 2. Editar Dados
- Todos os campos são pré-preenchidos com os dados atuais
- Modifique os campos desejados:
  - Nome da hortaliça
  - Tipo da hortaliça
  - Tempo estimado
  - Tempo real
  - Nível de água (slider)
  - Fertilizantes (adicionar/remover)

### 3. Salvar Alterações
- Clique em "Salvar" para confirmar as alterações
- Ou clique em "Restaurar" para voltar aos dados originais
- Após salvar, será redirecionado de volta para a lista

## Funcionalidades Implementadas

### ✅ Carregamento de Dados
- Busca automática dos dados da hortaliça pelo ID
- Pré-preenchimento do formulário
- Tratamento de erros de carregamento

### ✅ Validação
- Validação de campos obrigatórios
- Validação de tipos de dados
- Mensagens de erro claras

### ✅ Interface
- Design consistente com o resto da aplicação
- Layout responsivo
- Estados visuais (loading, erro, salvamento)
- Botão de voltar para a lista

### ✅ Navegação
- Navegação automática após salvar
- Botão de voltar sempre disponível
- Tratamento de erros de navegação

## Estados da Interface

### Loading
- Exibe spinner e mensagem "Carregando dados da hortaliça..."
- Aparece durante a busca dos dados

### Erro
- Exibe ícone de erro e mensagem de erro
- Botão "Tentar novamente" para recarregar
- Botão "Voltar para lista" para sair

### Formulário
- Campos pré-preenchidos com dados atuais
- Validação em tempo real
- Botões de ação (Salvar/Restaurar)

### Salvamento
- Botão "Salvar" fica desabilitado
- Spinner no botão durante o salvamento
- Texto "Salvando..." no botão

## Integração com Backend

- **Endpoint**: `GET /hortalicas/:id` (buscar dados)
- **Endpoint**: `PUT /hortalicas/:id` (atualizar dados)
- **Autenticação**: Usa token do localStorage
- **Validação**: Validação tanto no frontend quanto no backend

## Responsividade

- **Desktop**: Layout em grid com múltiplas colunas
- **Tablet**: Layout adaptativo
- **Mobile**: Uma coluna única com layout otimizado

## Próximos Passos

1. Adicionar confirmação antes de sair sem salvar
2. Implementar histórico de alterações
3. Adicionar validação de permissões
4. Implementar edição em lote

## Dependências

- React Icons (FaLeaf, FaClock, etc.)
- Next.js Router para navegação
- Serviço de API (`@/services/api`)
- CSS Modules para estilização

## Exemplo de Uso

```javascript
// Navegação para edição
router.push(`/editVegetable?id=${hortalicaId}`);

// O componente automaticamente:
// 1. Busca os dados da hortaliça
// 2. Pré-preenche o formulário
// 3. Permite edição
// 4. Salva as alterações
// 5. Redireciona para a lista
```

A funcionalidade de edição está completa e integrada com o sistema existente! 🎉
