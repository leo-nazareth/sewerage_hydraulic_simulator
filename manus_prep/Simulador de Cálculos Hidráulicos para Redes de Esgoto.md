# Simulador de Cálculos Hidráulicos para Redes de Esgoto

## Análise dos Requisitos

### Objetivo
Transformar a planilha Excel de cálculos hidráulicos em um simulador web interativo que permita:
1. Entrada de parâmetros hidráulicos
2. Cálculos automáticos em tempo real
3. Visualização gráfica da seção da tubulação
4. Animação do perfil da rede com escoamento e sedimentação

### Parâmetros de Entrada

#### Parâmetros de Consumo e População
- **Consumo per capita de água**: 150-200 l/hab/dia (padrão: 200)
- **Taxa de ocupação**: 4-5 hab/casa (padrão: 5)
- **Coeficiente de retorno C**: 0.8 (quanto da água consumida retorna como esgoto)
- **K1 (Coef. máximo diário)**: 1.2
- **K2 (Coef. máximo horário)**: 1.5
- **Quantidade de residências conectadas**: variável (padrão: 100)

#### Parâmetros Hidráulicos
- **Coeficiente de Manning (n)**: 0.013 (rugosidade do tubo)
- **Força trativa mínima**: 1.0 Pa (padrão)
- **Lâmina líquida máxima**: 75% (0.75)
- **Vazão mínima**: 1.5 l/s
- **Declividade do trecho**: m/m ou %
- **Diâmetro da tubulação**: mm

### Cálculos Implementados

#### 1. Cálculo da Vazão
```
Vazão estimada (l/s) = (Consumo per capita × Taxa ocupação × C × K1 × K2 / 86400) × Qtde residências

Vazão calculada (Qcalc) = MAX(Vazão estimada, Vazão mínima)
```

#### 2. Cálculo do Ângulo Teta (θ) - Método Iterativo
```
E = (n × Qcalc/1000) / ((Declividade^0.5) × (Diâmetro/1000)^(8/3))

E' = 8 × (((E^3)/4)^0.2)

Iteração inicial: θ₁ = E' × π^0.4 + sin(π)
Iterações subsequentes: θₙ₊₁ = E' × θₙ^0.4 + sin(θₙ)

Continuar até convergência (diferença < 0.01) ou máximo 15 iterações
```

#### 3. Elementos Geométricos da Seção Hidráulica

**Área Hidráulica (A) em m²:**
```
A = (Diâmetro/1000)² / 8 × (θ - sin(θ))
```

**Perímetro Molhado (P) em m:**
```
P = θ / 2 × Diâmetro/1000
```

**Raio Hidráulico (Rh) em m:**
```
Rh = (Diâmetro/1000/4) × (θ - sin(θ)) / θ
```

**Altura Molhada (y) em m:**
```
y = (1 - cos(θ/2)) × Diâmetro/1000/2
```

#### 4. Verificações Hidráulicas

**Lâmina Líquida (y/D):**
```
Lâmina líquida = y / (Diâmetro/1000)
```

**Força Trativa em Pascal:**
```
Força Trativa = 1000 × Rh × Declividade × 10
```

**Velocidade em m/s:**
```
Velocidade = (Rh^(2/3) × Declividade^0.5) / n
```

### Especificações da Interface

#### Seção de Entrada de Parâmetros
- Formulário organizado em grupos lógicos
- Campos com valores padrão
- Validação em tempo real
- Unidades claramente indicadas

#### Seção de Resultados
- Exibição automática dos valores calculados
- Indicadores visuais para valores fora dos limites
- Formatação adequada das unidades

#### Visualizações Gráficas

**1. Seção da Tubulação:**
- Círculo representando o diâmetro da tubulação
- Área preenchida mostrando a fração líquida
- Indicação da altura molhada (y)
- Escala e dimensões

**2. Perfil da Rede (Animado):**
- Vista lateral da tubulação com declividade
- Animação do fluxo de água
- Partículas sólidas em movimento
- Acúmulo de sedimentos quando força trativa < mínima
- Indicação de obstrução progressiva

### Critérios de Validação

#### Limites Operacionais
- Lâmina líquida ≤ 75% (máximo configurável)
- Força trativa ≥ 1.0 Pa (mínimo configurável)
- Velocidade > 0 m/s

#### Indicadores Visuais
- Verde: Parâmetros dentro dos limites
- Amarelo: Próximo aos limites
- Vermelho: Fora dos limites aceitáveis

### Tecnologias a Utilizar

#### Frontend
- HTML5 + CSS3 + JavaScript
- Canvas ou SVG para visualizações
- CSS Grid/Flexbox para layout responsivo
- Animações CSS/JavaScript

#### Cálculos
- JavaScript puro para máxima compatibilidade
- Funções matemáticas nativas
- Algoritmo iterativo para convergência

#### Responsividade
- Design mobile-first
- Breakpoints para tablet e desktop
- Touch-friendly para dispositivos móveis

### Estrutura de Arquivos Planejada
```
simulador-hidraulico/
├── index.html
├── css/
│   ├── styles.css
│   └── responsive.css
├── js/
│   ├── calculations.js
│   ├── visualizations.js
│   ├── animations.js
│   └── main.js
└── assets/
    └── icons/
```

### Funcionalidades Avançadas

#### Exportação de Resultados
- Geração de relatório em PDF
- Exportação de dados em CSV
- Captura de tela das visualizações

#### Presets e Configurações
- Salvamento de configurações favoritas
- Presets para diferentes tipos de projeto
- Histórico de cálculos

#### Validação Educacional
- Explicações dos cálculos
- Tooltips informativos
- Links para referências técnicas

