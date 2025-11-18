# Simulador de Cálculos Hidráulicos - Redes de Esgoto

🌐 **[Acesse o simulador online](https://leo-nazareth.github.io/sewerage_hydraulic_simulator/)**

Um simulador interativo para cálculos hidráulicos em redes de esgoto, com suporte a três idiomas (Português, Inglês e Espanhol).

## 🚀 Funcionalidades

- **Cálculos Hidráulicos Completos**: Vazões, velocidades, força trativa, lâmina líquida
- **Visualizações Interativas**: 
  - Seção transversal da tubulação
  - Perfil longitudinal da rede
- **Suporte Multilíngue**: Português, Inglês e Espanhol
- **Interface Responsiva**: Funciona em desktop e mobile
- **Persistência de Idioma**: Sua escolha de idioma é salva automaticamente

## 🌍 Idiomas Disponíveis

- 🇧🇷 **Português** (PT)
- 🇺🇸 **English** (EN)
- 🇪🇸 **Español** (ES)

## 📊 Parâmetros de Entrada

### Parâmetros de Consumo
- Consumo per capita (l/hab.dia)
- Taxa de ocupação (hab/residência)
- Coeficiente de retorno
- Coeficientes K1 e K2
- Quantidade de residências

### Parâmetros Hidráulicos
- Diâmetro da tubulação (mm)
- Declividade (m/m)
- Coeficiente de Manning

### Critérios de Verificação
- Lâmina máxima (%)
- Força trativa mínima (Pa)
- Vazão mínima (l/s)

## 🛠️ Tecnologias Utilizadas

- **React** - Framework JavaScript
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **i18n** - Internacionalização

## 💻 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/leo-nazareth/sewerage_hydraulic_simulator.git

# Entre no diretório
cd sewerage_hydraulic_simulator

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para Produção

```bash
# Gerar build de produção
npm run build

# Testar build localmente
npm run preview
```

## 🌐 Deploy

O projeto está configurado para deploy automático no GitHub Pages. Qualquer push para a branch `main` dispara automaticamente o workflow de deployment.

Para mais detalhes sobre configuração, consulte [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md)

## 🔧 Adicionando Novos Idiomas

Para adicionar suporte a um novo idioma:

1. Crie um novo arquivo em `src/i18n/locales/` (ex: `fr.json` para francês)
2. Copie a estrutura de um arquivo existente (ex: `pt.json`)
3. Traduza todos os textos mantendo as mesmas chaves
4. Adicione o novo idioma em `src/i18n/LanguageProvider.jsx`:
   ```javascript
   import fr from './locales/fr.json'
   
   const translations = {
     pt,
     en,
     es,
     fr  // Novo idioma
   }
   ```
5. Adicione o botão no `LanguageSelector.jsx`:
   ```jsx
   <Button onClick={() => changeLanguage('fr')}>FR</Button>
   ```

### Estrutura dos Arquivos de Tradução

```json
{
  "app": {
    "title": "Título do Aplicativo",
    "subtitle": "Subtítulo"
  },
  "parameters": {
    "title": "Parâmetros",
    "consumption": { ... },
    "hydraulic": { ... },
    "verification": { ... }
  },
  "results": { ... },
  "visualization": { ... },
  "status": { ... },
  "language": { ... }
}
```

## 📝 Terminologia Técnica

O simulador utiliza terminologia técnica padronizada em engenharia sanitária:

| Português | English | Español |
|-----------|---------|---------|
| Rede de esgoto | Sewer network | Red de alcantarillado |
| Vazão | Flow rate | Caudal |
| Força trativa | Tractive force | Fuerza tractiva |
| Lâmina líquida | Liquid depth | Lámina líquida |
| Declividade | Slope | Pendiente |

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Leonardo Nazareth**
- GitHub: [@leo-nazareth](https://github.com/leo-nazareth)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no GitHub.

---

Desenvolvido com ❤️ para a comunidade de engenharia sanitária
