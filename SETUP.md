# 🎬 Setup Inicial e Primeiro Commit

Siga este guia para inicializar o projeto corretamente.

## 📋 Pré-requisitos

- Node.js instalado (v18+)
- Firebase CLI instalado (`npm install -g firebase-tools`)
- Git instalado
- Conta no GitHub

## 🚀 Passo a Passo

### 1. Instalar Dependências

```bash
cd frontsamuelcaetite
npm install
```

**O que vai instalar:**
- sass (compilação SCSS)
- esbuild (minificação JS)
- html-minifier-terser (minificação HTML)
- chokidar (watch de arquivos)
- browser-sync (live reload)
- concurrently (rodar múltiplos scripts)
- sharp (otimização de imagens - futuro)

### 2. Testar Build Local

```bash
npm run build
```

**Deve criar:**
- `public/index.html` (home minificada)
- `public/cpf-cnpj-generator/index.html` (página exemplo)
- `public/css/home.min.css`
- `public/css/cpf-cnpj-generator.min.css`
- `public/js/home.min.js`
- `public/js/cpf-cnpj-generator.min.js`

### 3. Testar Desenvolvimento

```bash
npm start
```

**Deve abrir automaticamente:**
- Firebase serve em `http://localhost:5000`
- Browser-sync em `http://localhost:3000` (com live reload)

**Teste:**
1. Abra `http://localhost:3000`
2. Edite `src/home/styles.scss`
3. Salve
4. O browser deve recarregar automaticamente ✨

### 4. Configurar Firebase

```bash
firebase login
firebase init hosting
```

**Respostas:**
- Use an existing project? → Sim (escolha seu projeto)
- What do you want to use as your public directory? → `public`
- Configure as a single-page app? → No
- Set up automatic builds with GitHub? → No (por enquanto)
- File public/404.html already exists. Overwrite? → No

### 5. Testar Deploy

```bash
npm run deploy
```

Se tudo funcionar, seu site estará no ar! 🎉