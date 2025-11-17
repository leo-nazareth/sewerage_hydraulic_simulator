# Simulador de Cálculos Hidráulicos - Redes de Esgoto

## 🎯 Visão Geral

O **Simulador de Cálculos Hidráulicos** é uma aplicação web interativa desenvolvida para auxiliar engenheiros e técnicos no dimensionamento de redes de esgoto do sistema condominial. A ferramenta realiza cálculos hidráulicos complexos em tempo real e fornece visualizações gráficas intuitivas para análise do comportamento do sistema.

## 🌐 Acesso Online

**URL do Simulador:** https://ltrnrvem.manus.space

## ✨ Funcionalidades Principais

### 📊 Cálculos Hidráulicos Automatizados
- **Vazão estimada e calculada** baseada em parâmetros populacionais
- **Algoritmo iterativo** para cálculo preciso do ângulo θ (teta)
- **Elementos geométricos**: área hidráulica, perímetro molhado, raio hidráulico
- **Verificações hidráulicas**: lâmina líquida, força trativa, velocidade
- **Validação automática** dos critérios de projeto

### 🎨 Visualizações Gráficas Interativas
- **Seção da Tubulação**: Representação circular com área molhada em tempo real
- **Perfil da Rede**: Vista lateral mostrando declividade e fluxo
- **Indicadores visuais** de status do sistema (OK/Problemas)
- **Simulação de sedimentação** quando força trativa é insuficiente

### 🔧 Interface Intuitiva
- **Formulário responsivo** com validação em tempo real
- **Parâmetros organizados** por categoria (consumo, hidráulicos, critérios)
- **Resultados detalhados** com precisão adequada para engenharia
- **Design moderno** com Tailwind CSS e componentes shadcn/ui

## 📋 Parâmetros de Entrada

### Parâmetros de Consumo
- **Consumo per capita** (l/hab/dia): Consumo médio de água por habitante
- **Taxa de ocupação** (hab/casa): Número médio de habitantes por residência
- **Coeficiente de retorno** (C): Fração da água consumida que retorna como esgoto
- **K1** (máx. diário): Coeficiente do dia de maior consumo
- **K2** (máx. horário): Coeficiente da hora de maior consumo
- **Quantidade de residências**: Número total de residências atendidas

### Parâmetros Hidráulicos
- **Diâmetro** (mm): Diâmetro interno da tubulação
- **Declividade** (%): Inclinação da tubulação
- **Coeficiente de Manning** (n): Rugosidade da tubulação

### Critérios de Verificação
- **Lâmina máxima** (%): Percentual máximo de preenchimento da tubulação
- **Força trativa mínima** (Pa): Força mínima para autolimpeza
- **Vazão mínima** (l/s): Vazão mínima de projeto

## 📊 Resultados Fornecidos

### Vazões
- Vazão estimada (l/s)
- Vazão calculada (l/s)

### Elementos Geométricos
- Área hidráulica (m²)
- Perímetro molhado (m)
- Raio hidráulico (m)
- Altura molhada (m)

### Verificações Hidráulicas
- Lâmina líquida (%) com indicador de conformidade
- Força trativa (Pa) com indicador de conformidade
- Velocidade (m/s)

### Parâmetros Técnicos
- Ângulo θ (rad)
- Status geral do sistema (OK/Problemas)

## 🔬 Base Técnica

### Fórmulas Implementadas

**Vazão Estimada:**
```
Q_est = (C_pc × T_oc × C × K1 × K2 / 86400) × N_res
```

**Algoritmo Iterativo para θ:**
```
E = (n × Q) / (√i × D^(8/3))
ε = 8 × (E³/4)^0.2
θ_n+1 = ε × θ_n^0.4 + sin(θ_n)
```

**Área Hidráulica:**
```
A = (D²/8) × (θ - sin(θ))
```

**Força Trativa:**
```
τ = γ × Rh × i
```

### Validação
- Comparado com planilha Excel original
- Testado em múltiplos cenários (normal, problemas, extremos)
- Algoritmo iterativo converge com precisão de 1e-8

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Ícones**: Lucide React
- **Visualizações**: SVG nativo
- **Deploy**: Manus Platform

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- **Desktop**: Layout em 3 colunas (parâmetros + resultados + visualizações)
- **Tablet**: Layout adaptativo com reorganização automática
- **Mobile**: Layout em coluna única com navegação otimizada

## 🎯 Casos de Uso

### 1. Dimensionamento de Redes Novas
- Inserir parâmetros do projeto
- Verificar se critérios são atendidos
- Ajustar diâmetro/declividade conforme necessário

### 2. Verificação de Redes Existentes
- Validar capacidade hidráulica atual
- Identificar problemas de sedimentação
- Propor melhorias no sistema

### 3. Ensino e Treinamento
- Demonstrar impacto de diferentes parâmetros
- Visualizar comportamento hidráulico
- Compreender critérios de projeto

## ⚠️ Limitações e Considerações

- Aplicável especificamente ao **sistema condominial** de esgoto
- Baseado na **equação de Manning** para escoamento uniforme
- Considera escoamento em **regime permanente**
- Não inclui efeitos de **remanso** ou **escoamento não-uniforme**
- Força trativa calculada para **autolimpeza** de sedimentos

## 📞 Suporte

Para dúvidas técnicas ou sugestões de melhorias, o simulador foi desenvolvido com base nas melhores práticas de engenharia sanitária e pode ser facilmente adaptado para diferentes contextos e normas locais.

## 🏆 Conclusão

O Simulador de Cálculos Hidráulicos representa uma ferramenta moderna e eficiente para o dimensionamento de redes de esgoto, combinando precisão técnica com interface intuitiva. A aplicação facilita o trabalho de engenheiros e contribui para o desenvolvimento de sistemas de saneamento mais eficientes e sustentáveis.

---

**Desenvolvido com tecnologias modernas para máxima performance e usabilidade.**

