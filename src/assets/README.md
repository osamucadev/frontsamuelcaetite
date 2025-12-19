# 📦 Assets

Coloque aqui todos os seus arquivos estáticos:

## 🖼️ Imagens

```
assets/images/
├── logo.png
├── profile.jpg
├── favicon.ico
└── projects/
    ├── project-1.png
    └── project-2.png
```

**Como usar no HTML:**

```html
<img src="/assets/images/profile.jpg" alt="Samuel Caetité">
```

## 📄 Documentos

```
assets/documents/
├── cv-samuel-caetite-br.pdf
└── cv-samuel-caetite-en.pdf
```

**Como usar no HTML:**

```html
<a href="/assets/documents/cv-samuel-caetite-br.pdf" download>Baixar CV</a>
```

## 📝 Observações

- Os assets são copiados automaticamente para `public/assets/` durante o build
- No futuro, as imagens serão otimizadas automaticamente (WebP, compressão)
- Mantenha a organização em subpastas (images/, documents/, icons/, etc.)
