# FitPlan AI 🚀

**Seu assistente de saúde e fitness com IA adaptativa**

Uma PWA (Progressive Web App) moderna e futurista que combina inteligência artificial com monitoramento de saúde e fitness para criar planos personalizados e adaptativos.

## ✨ Características

- 🎨 **Design Futurista**: Interface dark com gradientes slate/graphite e acentos mint/lavanda
- 🔮 **Glassmorphism**: Cards com efeito de vidro e blur para uma experiência visual única
- 📱 **PWA Completa**: Instalável como app nativo com service worker e manifest
- 🧠 **IA Adaptativa**: Sistema inteligente que aprende com seus hábitos e ajusta planos
- 📊 **Dashboard Interativo**: Métricas em tempo real com gráficos e insights
- 🎯 **Acompanhamento de Progresso**: Gráficos detalhados e sistema de conquistas
- 🔐 **Sistema de Autenticação**: Login e cadastro com navegação protegida
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS com tema personalizado
- **PWA**: Vite PWA Plugin
- **Fonts**: Orbitron (futurista) + Inter (legível)
- **Icons**: Heroicons (SVG inline)

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd fitplan-ai
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute em modo desenvolvimento**
```bash
npm run dev
```

4. **Abra no navegador**
```
http://localhost:3000
```

## 📦 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Verificação de código

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button.tsx      # Botão com gradiente mint→lavanda
│   ├── Card.tsx        # Card com glassmorphism
│   └── Header.tsx      # Header fixo do app
├── pages/              # Páginas principais
│   ├── Home.tsx        # Página inicial com boas-vindas
│   ├── Login.tsx       # Autenticação
│   ├── Cadastro.tsx    # Criação de conta
│   ├── Dashboard.tsx   # Dashboard principal
│   └── Progresso.tsx   # Acompanhamento de progresso
├── services/           # Serviços e APIs
│   └── api.ts         # Mock API com TypeScript
├── styles/             # Estilos globais
│   └── globals.css    # Tailwind + estilos customizados
├── types/              # Tipos TypeScript
│   └── index.ts       # Interfaces e tipos globais
├── App.tsx             # Componente principal
└── main.tsx           # Ponto de entrada
```

## 🎨 Sistema de Design

### Cores
- **Slate/Graphite**: Fundos escuros (#0f172a, #111827)
- **Mint**: Acentos primários (#14b8a6, #2dd4bf)
- **Lavanda**: Acentos secundários (#a855f7, #c084fc)
- **Branco**: Textos e bordas com transparência

### Tipografia
- **Orbitron**: Títulos e elementos futuristas
- **Inter**: Texto do corpo e interface

### Componentes
- **Glass Cards**: `bg-white/10 backdrop-blur-md border border-white/20`
- **Gradient Buttons**: `from-mint-400 to-lavanda-500`
- **Animations**: Float, glow e hover effects

## 🔧 Configuração PWA

O projeto está configurado como PWA com:

- **Manifest**: Configuração completa para instalação
- **Service Worker**: Cache e funcionalidades offline
- **Meta Tags**: Otimizado para iOS e Android
- **Icons**: Múltiplos tamanhos para diferentes dispositivos

## 📱 Funcionalidades

### 🏠 Página Inicial
- Apresentação do app com card de boas-vindas
- Grid de características principais
- Botões de call-to-action

### 🔐 Autenticação
- Login com email/senha
- Cadastro com dados pessoais e objetivos
- Navegação entre páginas de auth

### 📊 Dashboard
- Métricas principais (peso, calorias, exercícios)
- Ações rápidas para registro
- Insights da IA
- Próximos treinos agendados

### 📈 Progresso
- Gráficos de evolução (peso, calorias, exercícios)
- Sistema de conquistas
- Metas e progresso
- Histórico detalhado

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Deploy na Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy no Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🔮 Próximas Funcionalidades

- [ ] Integração com APIs reais de fitness
- [ ] Sistema de notificações push
- [ ] Sincronização com wearables
- [ ] Comunidade e social features
- [ ] Chat com IA para dúvidas
- [ ] Exportação de relatórios
- [ ] Integração com calendário

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Email**: suporte@fitplan-ai.com
- **Documentação**: [docs.fitplan-ai.com](https://docs.fitplan-ai.com)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/fitplan-ai/issues)

---

**Desenvolvido com ❤️ para revolucionar o fitness com IA**
