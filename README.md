# 🔒 CifraCesar - Sistema de Criptografia

Trabalho prático de **Cibersegurança** — Implementação da Cifra de César com interface web e persistência em banco de dados.

## 📋 Sobre o Projeto

Sistema web que implementa a técnica de criptografia **Cifra de César**, permitindo criptografar e descriptografar mensagens com autenticação segura via JWT.

### Funcionalidades

- **Tela de Login** — Autenticação com JWT (Autenticidade, Integridade e Confidencialidade)
- **Tela de Cadastro** — Registro de novos usuários com senha protegida por bcrypt
- **Tela de Criptografar** — Cifra de César com passo configurável, gera hash (chave privada) de uso único
- **Tela de Descriptografar** — Valida o hash, descriptografa a mensagem e marca o hash como usado

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Função |
|---|---|
| React + Vite | Frontend (interface do usuário) |
| Node.js + Express | Backend (API REST) |
| SQLite (better-sqlite3) | Banco de dados |
| JWT (jsonwebtoken) | Autenticação por tokens |
| Bcrypt (bcryptjs) | Hash seguro de senhas |
| React Router DOM | Navegação entre páginas |

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)

### Passo a passo

1. **Clone o repositório:**
```bash
git clone https://github.com/Adejarbas/TrabalhoCyberSeguranca.git
cd TrabalhoCyberSeguranca
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o projeto (frontend + backend):**
```bash
npm run dev
```

4. **Acesse no navegador:**
```
http://localhost:5173
```

> O backend roda automaticamente na porta `3001`.

## 📁 Estrutura do Projeto

```
trabalhoCyberSeguranca/
├── server/                        # Backend (API)
│   ├── index.cjs                  # Servidor Express
│   ├── database.cjs               # Configuração do SQLite
│   ├── middleware/
│   │   └── auth.cjs               # Middleware JWT
│   └── routes/
│       ├── auth.cjs               # Rotas de login/cadastro
│       └── crypto.cjs             # Rotas de criptografar/descriptografar
├── src/                           # Frontend (React)
│   ├── App.jsx                    # Componente principal + rotas
│   ├── App.css                    # Estilos da aplicação
│   ├── context/
│   │   └── AuthContext.jsx        # Gerenciamento de autenticação
│   ├── components/
│   │   └── Navbar.jsx             # Barra de navegação
│   └── pages/
│       ├── Login.jsx              # Tela de login
│       ├── Cadastro.jsx           # Tela de cadastro
│       ├── Criptografar.jsx       # Tela de criptografia
│       └── Descriptografar.jsx    # Tela de descriptografia
├── doc_cifracesar_alteracoes.html # Documentação detalhada
└── package.json
```

## 🔐 Como Funciona

1. **Cadastre-se** com usuário e senha
2. **Faça login** — o sistema gera um token JWT
3. **Criptografe** uma mensagem informando o texto e o passo (deslocamento)
4. O sistema retorna a **mensagem criptografada** + um **hash (chave privada)**
5. Para **descriptografar**, informe a mensagem cifrada e o hash
6. O hash é marcado como **usado** — só funciona uma vez!

## 📄 Documentação

A documentação completa está no arquivo `doc_cifracesar_alteracoes.html`. Abra no navegador e use `Ctrl+P` → **Salvar como PDF** para gerar o PDF.
