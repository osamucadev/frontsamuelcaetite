# 🎬 Como Funciona o Sistema de Build

Este documento mostra visualmente como o sistema de build funciona.

## 📁 Você Edita em `src/`

```
src/home/
├── index.html      👈 Você escreve aqui
├── styles.scss     👈 Você escreve aqui
└── script.js       👈 Você escreve aqui
```

## ⚙️ O Build Processa Automaticamente

```
npm run build  (ou npm start)
         │
         ├──> Compila styles.scss ──> public/css/home.min.css
         │
         ├──> Minifica script.js ──> public/js/home.min.js
         │
         └──> Processa index.html ──> public/index.html
                                      (com links CSS/JS injetados)
```

## 📤 Resultado Final em `public/`

```
public/
├── index.html              👈 HTML minificado + links injetados
├── css/
│   └── home.min.css       👈 CSS compilado e minificado
└── js/
    └── home.min.js        👈 JavaScript minificado
```

---

## 🔄 Exemplo Prático

### ANTES (você escreve):

**src/home/index.html**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Minha Página</title>
  <!-- CSS será injetado aqui automaticamente -->
</head>
<body>
  <h1>Olá Mundo</h1>
  <!-- JS será injetado aqui automaticamente -->
</body>
</html>
```

**src/home/styles.scss**
```scss
$primary: #3b82f6;

body {
  color: $primary;
  font-size: 16px;
}
```

**src/home/script.js**
```javascript
console.log('Olá!');

function sayHello() {
  alert('Hello World!');
}
```

### DEPOIS (gerado automaticamente):

**public/index.html**
```html
<!DOCTYPE html><html><head><title>Minha Página</title><link rel="stylesheet" href="/css/home.min.css"></head><body><h1>Olá Mundo</h1><script src="/js/home.min.js"></script></body></html>
```

**public/css/home.min.css**
```css
body{color:#3b82f6;font-size:16px}
```

**public/js/home.min.js**
```javascript
console.log("Olá!");function sayHello(){alert("Hello World!")}
```

---

## 🎯 Adicionando Nova Página

### 1. Crie a pasta:
```bash
src/
└── projetos/
    ├── index.html
    ├── styles.scss
    └── script.js
```

### 2. Escreva seu código normalmente

### 3. Execute:
```bash
npm run build
# ou
npm start
```

### 4. Resultado:
```bash
public/
└── projetos/
    └── index.html  (com CSS e JS já linkados!)
```

### 5. Acesse:
```
http://localhost:3000/projetos
```

---

## 💡 Fluxo de Desenvolvimento

```
┌──────────────────────────────────────────────────────┐
│ 1. npm start                                         │
│    Inicia todos os watchers + servidor local         │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│ 2. Edite arquivos em src/                           │
│    - src/home/styles.scss                            │
│    - src/home/script.js                              │
│    - src/home/index.html                             │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│ 3. Watcher detecta mudança                           │
│    ✓ Compila automaticamente                         │
│    ✓ Gera novo arquivo em public/                    │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│ 4. Browser-sync detecta mudança                      │
│    ✓ Recarrega página automaticamente                │
│    ✓ Você vê o resultado instantaneamente! ✨        │
└──────────────────────────────────────────────────────┘
```

---

## 🚀 Fluxo de Deploy

```
┌──────────────────────────────────────────────────────┐
│ 1. npm run deploy                                    │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│ 2. npm run build                                     │
│    ✓ Limpa public/                                   │
│    ✓ Compila SCSS                                    │
│    ✓ Minifica JS                                     │
│    ✓ Processa HTML                                   │
│    ✓ Copia assets                                    │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│ 3. firebase deploy                                   │
│    ✓ Envia public/ para Firebase Hosting             │
│    ✓ Site fica online em segundos!                   │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│ 4. 🎉 Seu site está no ar!                           │
│    https://reactsamuelcaetite.web.app                │
└──────────────────────────────────────────────────────┘
```

---

## 📦 Assets (Imagens, PDFs, etc)

### Você coloca em:
```
src/assets/
├── images/
│   ├── logo.png
│   └── profile.jpg
└── documents/
    └── cv.pdf
```

### O build copia para:
```
public/assets/
├── images/
│   ├── logo.png
│   └── profile.jpg
└── documents/
    └── cv.pdf
```

### Você usa no HTML:
```html
<img src="/assets/images/logo.png" alt="Logo">
<a href="/assets/documents/cv.pdf">Download CV</a>
```

---

## ✅ Checklist Rápido

**Antes de commitar:**
- [ ] Editei apenas arquivos em `src/`
- [ ] `npm run build` rodou sem erros
- [ ] Testei localmente com `npm start`
- [ ] Não commitei a pasta `public/` (ela é gerada!)
- [ ] Usei commit convencional (veja COMMITS.md)

**Antes de fazer deploy:**
- [ ] `npm run build` rodou sem erros
- [ ] Testei todas as páginas localmente
- [ ] Verifiquei que CSS e JS estão funcionando
- [ ] Confirme que assets foram copiados

---

## 🎓 Resumo

1. **Você só edita em `src/`**
2. **O build gera tudo em `public/` automaticamente**
3. **Você NÃO commita `public/` (está no .gitignore)**
4. **No deploy, `public/` é gerado e enviado para Firebase**

É simples assim! 🚀
