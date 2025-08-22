# 🏋️‍♂️ FitPlan AI - Plataforma de Fitness Inteligente

## ✨ Sobre o Projeto

FitPlan AI é uma plataforma completa de fitness que utiliza inteligência artificial para criar planos personalizados de treino e nutrição, adaptando-se às necessidades específicas de cada usuário.

## 🚀 Funcionalidades Principais

- **🤖 IA Personalizada**: Planos de treino e nutrição adaptativos
- **📱 PWA**: Aplicação web progressiva com funcionalidades offline
- **📊 Acompanhamento**: Monitoramento de progresso e metas
- **🔐 Autenticação**: Sistema seguro de login e cadastro
- **📱 Responsivo**: Design adaptável para todos os dispositivos

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Estado**: React Query + Context API
- **Roteamento**: React Router DOM
- **PWA**: Service Workers + Manifest

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/fitplan-ai.git
cd fitplan-ai
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase
```

4. **Execute o projeto**
```bash
npm run dev
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run lint` - Executa o linter
- `npm run preview` - Visualiza o build de produção

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   └── ...             # Componentes específicos
├── contexts/           # Contextos React (Auth, etc.)
├── hooks/              # Hooks customizados
├── integrations/       # Integrações externas (Supabase)
├── lib/                # Utilitários e configurações
├── pages/              # Páginas da aplicação
└── types/              # Definições de tipos TypeScript
```

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- Login/Registro com Supabase Auth
- Proteção de rotas
- Gerenciamento de sessão

### ✅ Dashboard Principal
- Visão geral do progresso
- Estatísticas personalizadas
- Geração de planos com IA

### ✅ Perfil do Usuário
- Dados pessoais e fitness
- Preferências de treino e dieta
- Configurações de notificação

### ✅ Geração de Planos
- Planos de treino personalizados
- Planos alimentares adaptativos
- Consideração de restrições e objetivos

### ✅ Acompanhamento de Progresso
- Registro de peso
- Gráficos de evolução
- Metas e conquistas

## 🔒 Segurança

- **Autenticação**: JWT tokens com Supabase
- **Autorização**: Middleware de proteção de rotas
- **Validação**: Validação de entrada em todos os formulários
- **CORS**: Configuração restritiva para APIs
- **Sanitização**: Tratamento seguro de dados do usuário

## 📱 PWA Features

- **Instalação**: Pode ser instalado como app nativo
- **Offline**: Funcionalidades básicas sem internet
- **Notificações**: Push notifications para lembretes
- **Cache**: Armazenamento inteligente de recursos

## 🧪 Qualidade do Código

### ✅ Correções Realizadas
- **TypeScript**: Removidos todos os tipos `any`
- **Linting**: 0 erros críticos, apenas 9 warnings menores
- **Performance**: Implementado `useCallback` e `useMemo`
- **Tratamento de Erro**: Error boundaries e fallbacks
- **Console Logs**: Removidos logs de produção
- **Dependências**: Corrigidas dependências de `useEffect`

### 📊 Métricas de Qualidade
- **Erros críticos**: 0 (vs 24 anteriores)
- **Warnings**: 9 (vs 12 anteriores)
- **Cobertura de tipos**: 100%
- **Performance**: Otimizada com memoização

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
# Conecte com Vercel e faça deploy automático
```

### Outras Plataformas
- **Netlify**: Compatível com Vite
- **Railway**: Suporte completo
- **Heroku**: Requer configuração adicional

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/fitplan-ai/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/seu-usuario/fitplan-ai/wiki)
- **Email**: suporte@fitplan-ai.com

## 🎉 Agradecimentos

- **shadcn/ui** pela biblioteca de componentes
- **Supabase** pela infraestrutura backend
- **Vite** pela ferramenta de build
- **Tailwind CSS** pelo framework de estilos

---

**Desenvolvido com ❤️ para transformar vidas através do fitness inteligente**
