# BookTok Studio — Deploy no Railway

## Arquivos do projeto
```
booktok-generator/
├── package.json       ← dependências Node.js
├── server.js          ← servidor com login e proxy da API
├── public/
│   ├── login.html     ← tela de login
│   └── app.html       ← o gerador de chamadas
└── .env.example       ← variáveis de ambiente (referência)
```

## Passo a passo no Railway

### 1. Suba o projeto no GitHub
1. Acesse github.com → New repository → nome: `booktok-generator`
2. Marque como **Private**
3. Faça upload de todos os arquivos desta pasta

### 2. No Railway
1. Clique em **GitHub Repository**
2. Conecte sua conta GitHub e selecione o repositório `booktok-generator`
3. Railway detecta automaticamente que é Node.js e faz o deploy

### 3. Configure as variáveis de ambiente
No Railway, vá em **Variables** e adicione:

| Variável | Valor |
|---|---|
| `ANTHROPIC_API_KEY` | sua chave da Anthropic (console.anthropic.com) |
| `LOGIN_EMAIL` | correia.njaqueline@gmail.com |
| `LOGIN_PASS` | sua senha |
| `SESSION_SECRET` | qualquer string aleatória longa |

### 4. Acesse
Railway gera uma URL automática tipo `booktok-generator.up.railway.app`
Abra, coloque e-mail + senha e pronto!

## Para trocar a senha depois
Só atualizar a variável `LOGIN_PASS` nas configurações do Railway.
