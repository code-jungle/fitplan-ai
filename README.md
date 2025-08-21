# 🚀 FitPlanAI - Assistente Fitness Inteligente

**FitPlanAI** é uma aplicação PWA (Progressive Web App) que funciona como seu assistente pessoal de saúde e fitness com **IA adaptativa usando o modelo Gemini**.

## ✨ **Funcionalidades Principais**

### 🧠 **IA Adaptativa com Gemini**
- **Planos personalizados** de dieta e treino gerados por IA
- **Ajustes automáticos diários** baseados no progresso
- **Insights inteligentes** e recomendações personalizadas
- **Aprendizado contínuo** com base nos hábitos do usuário

### 📱 **PWA (Progressive Web App)**
- ✅ **Instalável** como aplicativo nativo
- ✅ **Funciona offline** com cache inteligente
- ✅ **Notificações push** para lembretes
- ✅ **Responsivo** para todos os dispositivos
- ✅ **Sincronização** automática de dados

### 💳 **Sistema de Assinatura**
- **7 dias de teste gratuito** sem compromisso
- **Assinatura mensal** de R$ 14,90 via Stripe
- **Cancelamento** a qualquer momento
- **Controle completo** da assinatura

### 🎯 **Dashboard Completo**
- **Visão geral** com estatísticas em tempo real
- **Planos alimentares** personalizados com IA
- **Planos de treino** adaptativos
- **Acompanhamento de progresso** detalhado
- **Gráficos** e métricas de evolução

### 👤 **Perfil do Usuário**
- **Informações pessoais** completas
- **Metas de fitness** personalizáveis
- **Preferências** de dieta e treino
- **Restrições** e limitações médicas
- **Configurações** de notificações

### 🔒 **Segurança e Privacidade**
- **Autenticação** segura com Supabase
- **Criptografia** de dados sensíveis
- **Validação** robusta de inputs
- **Headers de segurança** implementados
- **Rate limiting** para proteção

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes
- **React Router** para navegação

### **Backend & IA**
- **Supabase** para autenticação e banco
- **Gemini AI** para geração de planos
- **Stripe** para pagamentos
- **Edge Functions** para APIs

### **PWA & Performance**
- **Service Worker** para cache offline
- **Manifest** para instalação
- **Notificações push** nativas
- **Lazy loading** de componentes

## 🚀 **Como Executar**

### **1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/genius-fit-plan.git
cd genius-fit-plan
```

### **2. Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
bun install
```

### **3. Configure as variáveis de ambiente**
Crie um arquivo `.env` baseado no `env.example`:
```bash
cp env.example .env
```

Configure as seguintes variáveis:
```env
# Supabase
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=sua_chave_publica_do_stripe
VITE_STRIPE_PRICE_ID=seu_price_id_do_stripe

# Gemini AI
VITE_GEMINI_API_KEY=sua_chave_api_do_gemini
```

### **4. Execute o projeto**
```bash
npm run dev
# ou
yarn dev
# ou
bun dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📱 **Como Instalar como PWA**

1. **Acesse** a aplicação no navegador
2. **Clique** no ícone de instalação na barra de endereços
3. **Confirme** a instalação
4. **Acesse** como um aplicativo nativo

## 🎨 **Design System**

### **Paleta de Cores**
- **Primária**: Azul escuro (#6366f1)
- **Secundária**: Roxo (#8b5cf6)
- **Background**: Preto tech (#0a0a0f)
- **Glassmorphism**: Translúcido com blur

### **Tipografia**
- **Fonte principal**: Orbitron (futurista)
- **Hierarquia clara** e legível
- **Responsiva** para todos os tamanhos

### **Componentes**
- **Cartões glassmorphism** translúcidos
- **Botões** com gradientes e hover modernos
- **Ícones** Lucide React
- **Animações** suaves e elegantes

## 🔧 **Estrutura do Projeto**

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de UI base
│   ├── Hero.tsx        # Seção principal da landing
│   ├── Logo.tsx        # Logo da aplicação
│   └── ...
├── pages/              # Páginas da aplicação
│   ├── Index.tsx       # Landing page
│   ├── Auth.tsx        # Login/Cadastro
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── Profile.tsx     # Perfil do usuário
│   ├── Progress.tsx    # Acompanhamento de progresso
│   └── Subscription.tsx # Página de assinatura
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── hooks/              # Hooks customizados
│   ├── use-pwa.ts      # Hook para funcionalidades PWA
│   └── use-toast.ts    # Hook para notificações
├── lib/                # Utilitários e configurações
│   ├── stripe.ts       # Integração com Stripe
│   ├── validation.ts   # Validações e schemas
│   ├── security.ts     # Configurações de segurança
│   └── utils.ts        # Funções utilitárias
├── types/              # Tipos TypeScript
│   └── user.ts         # Tipos do usuário
└── integrations/       # Integrações externas
    └── supabase/       # Configuração do Supabase
```

## 🔐 **Funcionalidades de Segurança**

### **Implementadas**
- ✅ **Validação de inputs** com Zod
- ✅ **Sanitização** de strings
- ✅ **Rate limiting** básico
- ✅ **Headers de segurança** (CORS, CSP)
- ✅ **Validação JWT** nas APIs
- ✅ **Criptografia** de dados sensíveis

### **Recomendações para Produção**
- 🔒 **HTTPS** obrigatório
- 🔒 **Firewall** de aplicação
- 🔒 **Monitoramento** de segurança
- 🔒 **Backup** regular dos dados
- 🔒 **Logs** de auditoria

## 📊 **Funcionalidades da IA**

### **Planos Alimentares**
- **Análise nutricional** completa
- **Preferências** do usuário
- **Restrições** alimentares
- **Objetivos** de peso e saúde
- **Adaptação** baseada no progresso

### **Planos de Treino**
- **Nível** de condicionamento
- **Objetivos** específicos
- **Equipamento** disponível
- **Tempo** disponível
- **Progressão** gradual

### **Insights Inteligentes**
- **Análise** de tendências
- **Recomendações** personalizadas
- **Alertas** de saúde
- **Motivação** baseada em dados
- **Ajustes** automáticos

## 🚀 **Roadmap Futuro**

### **Versão 2.0**
- 📱 **App nativo** iOS/Android
- 🏃 **Integração com wearables**
- 🥗 **Base de dados de alimentos**
- 📊 **Gráficos avançados**
- 🌍 **Múltiplos idiomas**

### **Versão 3.0**
- 🤖 **Chat com IA** em tempo real
- 📸 **Reconhecimento de alimentos**
- 🎯 **Desafios e gamificação**
- 👥 **Comunidade e social**
- 📈 **Machine Learning avançado**

## 🤝 **Contribuindo**

1. **Fork** o projeto
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 **Suporte**

- **Email**: suporte@fitplanai.com
- **Documentação**: [docs.fitplanai.com](https://docs.fitplanai.com)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/genius-fit-plan/issues)

## 🙏 **Agradecimentos**

- **Google Gemini** pela IA
- **Supabase** pela infraestrutura
- **Stripe** pelos pagamentos
- **Comunidade open source** pelo suporte

---

**Transforme sua saúde com IA adaptativa! 🚀💪**
