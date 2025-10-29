# Seletor de Hortaliças no Dashboard

## Funcionalidade Implementada

Foi implementado um sistema completo de seleção de hortaliças no dashboard principal, permitindo que o usuário escolha qual hortaliça deseja visualizar e monitorar.

## Componentes Criados/Modificados

### 1. VegetableSelector (Novo Componente)
- **Localização**: `front-end/src/components/VegetableSelector/`
- **Funcionalidade**: 
  - Busca todas as hortaliças cadastradas via API
  - Exibe cards com ícones específicos para cada tipo de hortaliça
  - Permite seleção visual com feedback
  - Estados de loading, erro e lista vazia
  - Design responsivo

### 2. Dashboard Principal (index.js)
- **Modificações**:
  - Adicionado estado para hortaliça selecionada
  - Integrado o componente VegetableSelector
  - Passa a hortaliça selecionada para todos os componentes filhos

### 3. Componentes Atualizados
Todos os componentes do dashboard foram atualizados para receber e usar a prop `selectedVegetable`:

#### GrowthChart
- Mostra o nome da hortaliça selecionada no título
- Exibe informações específicas de tempo de crescimento
- Atualiza subtítulo com contexto da hortaliça

#### Indicators
- Nível de água baseado nos dados da hortaliça selecionada
- Status inteligente baseado no nível de água
- Cálculo de crescimento baseado no tempo estimado/real

#### Alerts
- Alertas dinâmicos baseados nos dados da hortaliça
- Alertas específicos para nível de água crítico/baixo/alto
- Notificação de prontidão para colheita
- Fallback para alertas padrão quando não há hortaliça selecionada

#### CameraPreview
- Título atualizado com nome da hortaliça
- Subtítulo contextual

#### SensorDetails
- Informações específicas da hortaliça selecionada
- Nível de água atual e status
- Tipo de hortaliça e tempo de crescimento

#### RecentReports
- Relatórios específicos da hortaliça selecionada
- Status baseado nos dados reais da hortaliça

## Mapeamento de Ícones por Tipo

- **Folhosa**: 🍃 FaLeaf (Verde)
- **Fruto**: 🍎 FaAppleAlt (Laranja)
- **Raiz**: 🥕 FaCarrot (Vermelho)
- **Bulbo**: 🧅 FaOnion (Roxo)
- **Leguminosa**: 🫛 FaPeas (Verde claro)
- **Outros**: 🌱 FaSeedling (Cinza)

## Funcionalidades Implementadas

### ✅ Seleção Visual
- Cards interativos com hover effects
- Indicador visual de seleção
- Feedback imediato ao clicar

### ✅ Integração com API
- Busca automática das hortaliças cadastradas
- Tratamento de estados de loading e erro
- Retry automático em caso de falha

### ✅ Responsividade
- Grid adaptativo para diferentes tamanhos de tela
- Cards otimizados para mobile
- Layout flexível

### ✅ Estados Inteligentes
- Alertas baseados nos dados reais da hortaliça
- Cálculos dinâmicos de crescimento
- Status contextual dos sensores

## Como Usar

1. **Acesse o Dashboard**: Navegue para a página principal (`/`)
2. **Selecione uma Hortaliça**: Clique em qualquer card de hortaliça no seletor
3. **Visualize os Dados**: Todos os componentes do dashboard se atualizarão automaticamente
4. **Monitore**: Os alertas e indicadores mostrarão informações específicas da hortaliça selecionada

## Estrutura de Dados

O componente espera que as hortaliças tenham a seguinte estrutura:

```javascript
{
  _id: "string",
  nome_hortalica: "string",
  tipo_hortalica: "string",
  tempo_estimado: number,
  tempo_real: number,
  nivel: {
    nivel_agua: number
  },
  fertilizantes: [
    { fertilizante: "string" }
  ]
}
```

## Estilos CSS

Todos os componentes incluem estilos CSS modulares com:
- Cores consistentes para diferentes tipos de hortaliças
- Animações suaves
- Design responsivo
- Estados visuais claros (hover, selected, loading, error)

## Próximos Passos Sugeridos

1. **Persistência**: Salvar a hortaliça selecionada no localStorage
2. **Filtros**: Adicionar filtros por tipo de hortaliça
3. **Busca**: Implementar busca por nome de hortaliça
4. **Favoritos**: Sistema de hortaliças favoritas
5. **Comparação**: Comparar múltiplas hortaliças simultaneamente
