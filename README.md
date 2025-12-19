# Samuel Caetité - Professional Landing Page

Landing page profissional mostrando expertise em React e React Native.

## 📁 Estrutura do Projeto

```
frontsamuelcaetite/
│
├── src/                    # Código-fonte (commitar)
│   ├── home/
│   │   ├── index.html     # HTML da home
│   │   ├── styles.scss    # Estilos da home
│   │   └── script.js      # JavaScript da home
│   │
│   ├── outra-pagina/      # Outras páginas seguem o mesmo padrão
│   │   ├── index.html
│   │   ├── styles.scss
│   │   └── script.js
│   │
│   └── assets/            # Assets estáticos
│       ├── images/
│       └── documents/
│
├── public/                 # Gerado automaticamente (NÃO commitar)
│   ├── index.html         # HTML minificado
│   ├── css/               # CSS minificado
│   ├── js/                # JavaScript minificado
│   └── assets/            # Assets copiados
│
├── scripts/               # Scripts de build
└── firebase.json          # Config Firebase Hosting
```

## 🛠️ Tecnologias

- **SCSS** → CSS minificado
- **JavaScript ES6+** → JS minificado (esbuild)
- **HTML5** → HTML minificado com injeção automática de assets
- **Firebase Hosting** → Deploy
- **Browser-sync** → Live reload em desenvolvimento

## 📦 Instalação

```bash
npm install
```

## 🚀 Comandos Disponíveis

### Desenvolvimento Local

```bash
npm start
```

**O que acontece:**
- ✅ Compila SCSS em tempo real
- ✅ Minifica JavaScript em tempo real
- ✅ Processa HTML em tempo real
- ✅ Copia assets automaticamente
- ✅ Inicia servidor local em `http://localhost:5000`
- ✅ Live reload automático

### Build de Produção

```bash
npm run build
```

**O que acontece:**
- ✅ Limpa pasta `public/`
- ✅ Compila todo SCSS → CSS minificado
- ✅ Minifica todo JavaScript
- ✅ Processa e minifica HTML
- ✅ Copia todos os assets

### Deploy Firebase

```bash
npm run deploy
```

**O que acontece:**
- ✅ Executa `npm run build`
- ✅ Faz deploy para Firebase Hosting
- 🚀 Site no ar!

## 📝 Como Adicionar Nova Página

1. Crie uma pasta em `src/` com o nome da rota:

```bash
src/
└── minha-pagina/
    ├── index.html
    ├── styles.scss
    └── script.js
```

2. Escreva seu código normalmente

3. Execute `npm start` ou `npm run build`

4. A página estará disponível em:
   - Desenvolvimento: `http://localhost:5000/minha-pagina`
   - Produção: `https://seusite.web.app/minha-pagina`

**Nota:** Se a pasta for `home`, o HTML vai para `public/index.html` (página inicial)

## 🎨 Como Funciona o Build

### SCSS → CSS

```
src/home/styles.scss → public/css/home.min.css
```

Os estilos são compilados e minificados automaticamente.

### JavaScript → JS Minificado

```
src/home/script.js → public/js/home.min.js
```

JavaScript é minificado com esbuild.

### HTML com Injeção Automática

```html
<!-- src/home/index.html -->
<!DOCTYPE html>
<html>
<head>
  <!-- O build injeta automaticamente -->
</head>
<body>
  <h1>Olá Mundo</h1>
  <!-- O build injeta automaticamente -->
</body>
</html>
```

Vira:

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/css/home.min.css">
</head>
<body>
  <h1>Olá Mundo</h1>
  <script src="/js/home.min.js"></script>
</body>
</html>
```

## 📸 Assets Estáticos

Coloque imagens, PDFs e outros assets em `src/assets/`:

```
src/assets/
├── images/
│   ├── logo.png
│   └── projects/
│       └── project1.jpg
└── documents/
    └── cv.pdf
```

Referencia no HTML:

```html
<img src="/assets/images/logo.png" alt="Logo">
<a href="/assets/documents/cv.pdf">Baixar CV</a>
```

## 🔧 Scripts Individuais

```bash
npm run clean          # Limpa pasta public/
npm run build:scss     # Compila SCSS
npm run build:js       # Minifica JavaScript
npm run build:html     # Processa HTML
npm run copy:assets    # Copia assets
```

## 📋 Convenções de Commit

Use commits semânticos:

```
feat: adiciona nova página de projetos
fix: corrige responsividade no mobile
style: melhora espaçamento do header
docs: atualiza README com instruções
refactor: reorganiza estrutura de pastas
```

## 📄 Licença

MIT © Samuel Caetité