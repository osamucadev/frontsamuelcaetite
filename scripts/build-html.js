const fs = require("fs");
const path = require("path");
const { minify } = require("html-minifier-terser");

const srcDir = path.join(__dirname, "..", "src");
const publicDir = path.join(__dirname, "..", "public");
const configPath = path.join(__dirname, "..", "config.json");
const hashMapPath = path.join(publicDir, "hash-map.json");
const imageMapPath = path.join(publicDir, "image-map.json");

// Carregar configuração
let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

// Carregar hash map (se existir)
let hashMap = {};
if (fs.existsSync(hashMapPath)) {
  hashMap = JSON.parse(fs.readFileSync(hashMapPath, "utf-8"));
}

// Carregar image map (se existir)
let imageMap = {};
if (fs.existsSync(imageMapPath)) {
  imageMap = JSON.parse(fs.readFileSync(imageMapPath, "utf-8"));
}

const baseUrl = config.site?.url || "https://react.samuelcaetite.dev";

// Template de Preconnect
function getPreconnectLinks() {
  return `
  <!-- Preconnect - conecta com domínios externos ANTES de precisar -->
  <link rel="preconnect" href="https://www.googletagmanager.com">
  <link rel="preconnect" href="https://www.google-analytics.com">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">`;
}

// Template de Structured Data / JSON-LD
function getStructuredData(meta, folder) {
  if (!meta || !meta.structuredData) return "";

  const sd = meta.structuredData;
  const pageUrl = folder === "home" ? baseUrl : `${baseUrl}/${folder}`;

  // Montar objeto base
  const data = {
    "@context": "https://schema.org",
    "@type": sd.type,
  };

  // Adicionar campos específicos baseado no tipo
  if (sd.type === "Person") {
    Object.assign(data, {
      name: sd.name,
      jobTitle: sd.jobTitle,
      description: sd.description || meta.description,
      url: pageUrl,
      image: sd.image
        ? `${baseUrl}${sd.image}`
        : meta.image
        ? `${baseUrl}${meta.image}`
        : undefined,
      sameAs: sd.sameAs || [],
      knowsAbout: sd.knowsAbout || [],
      address: sd.address,
    });
  } else if (sd.type === "SoftwareApplication") {
    Object.assign(data, {
      name: sd.name,
      applicationCategory: sd.applicationCategory,
      description: sd.description || meta.description,
      url: pageUrl,
      operatingSystem: sd.operatingSystem || "Web Browser",
      offers: sd.offers || {
        "@type": "Offer",
        price: "0",
        priceCurrency: "BRL",
      },
    });
  } else if (sd.type === "WebPage") {
    Object.assign(data, {
      name: sd.name || meta.title,
      description: sd.description || meta.description,
      url: pageUrl,
    });
  } else if (sd.type === "FAQPage") {
    Object.assign(data, {
      mainEntity: sd.mainEntity || [],
    });
  } else {
    // Para outros tipos, copia todos os campos
    Object.assign(data, sd);
    delete data.type; // Remove o "type" duplicado
  }

  // Remover campos undefined
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) {
      delete data[key];
    }
  });

  return `
  <!-- Structured Data / JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(data, null, 2)}
  </script>`;
}

// Template do Google Analytics
function getGoogleAnalyticsScript(measurementId) {
  if (!measurementId) return "";

  return `
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  </script>`;
}

// Template dos Favicons
function getFaviconsLinks(basePath = "/assets") {
  return `
  <!-- Favicons -->
  <link rel="icon" type="image/png" href="${basePath}/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="${basePath}/favicon.svg" />
  <link rel="shortcut icon" href="${basePath}/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="${basePath}/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="SC Dev" />
  <link rel="manifest" href="${basePath}/site.webmanifest" />
  <meta name="theme-color" content="#3b82f6">`;
}

// Template de SEO Meta Tags
function getSEOMetaTags(meta, folder) {
  if (!meta) return "";

  const pageUrl = folder === "home" ? baseUrl : `${baseUrl}/${folder}`;
  const imageUrl = meta.image
    ? `${baseUrl}${meta.image}`
    : `${baseUrl}${
        config.site?.defaultImage || "/assets/images/og-default.jpg"
      }`;

  let metaTags = `
  <!-- SEO Meta Tags -->
  <meta name="description" content="${meta.description || ""}">
  <meta name="keywords" content="${meta.keywords || ""}">
  <meta name="author" content="${meta.author || config.site?.name || ""}">`;

  // Open Graph
  if (config.seo?.includeOpenGraph !== false) {
    metaTags += `
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${meta.type || "website"}">
  <meta property="og:url" content="${pageUrl}/">
  <meta property="og:title" content="${meta.title || ""}">
  <meta property="og:description" content="${meta.description || ""}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:site_name" content="${
    meta.siteName || config.site?.name || ""
  }">
  <meta property="og:locale" content="${meta.locale || "pt_BR"}">`;
  }

  // Twitter Card
  if (config.seo?.includeTwitterCard !== false) {
    metaTags += `
  
  <!-- Twitter -->
  <meta name="twitter:card" content="${
    meta.twitterCard || "summary_large_image"
  }">
  <meta name="twitter:url" content="${pageUrl}/">
  <meta name="twitter:title" content="${meta.title || ""}">
  <meta name="twitter:description" content="${meta.description || ""}">
  <meta name="twitter:image" content="${imageUrl}">`;

    if (meta.twitterCreator) {
      metaTags += `
  <meta name="twitter:creator" content="${meta.twitterCreator}">`;
    }
  }

  // Canonical URL
  metaTags += `
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${pageUrl}/">`;

  return metaTags;
}

// Função para substituir referências de imagens por versões otimizadas
function replaceImageReferences(html) {
  let updatedHtml = html;

  // Para cada imagem no mapa
  for (const [originalPath, versions] of Object.entries(imageMap)) {
    // Encontrar a versão WebP e a versão original otimizada
    const webpVersion = versions.find((v) => v.type === "webp");
    const originalOptimized = versions.find((v) => v.type !== "webp");

    if (webpVersion && originalOptimized) {
      // Substituir <img src="..."> por <picture> com WebP
      const imgRegex = new RegExp(
        `<img([^>]*?)src=["']${originalPath.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}["']([^>]*?)>`,
        "gi"
      );

      updatedHtml = updatedHtml.replace(imgRegex, (match, before, after) => {
        // Extrair alt, class, etc
        const altMatch = match.match(/alt=["']([^"']*)["']/i);
        const classMatch = match.match(/class=["']([^"']*)["']/i);
        const alt = altMatch ? altMatch[1] : "";
        const className = classMatch ? classMatch[1] : "";

        return `<picture>
  <source srcset="${webpVersion.url}" type="image/webp">
  <img src="${originalOptimized.url}"${alt ? ` alt="${alt}"` : ""}${
          className ? ` class="${className}"` : ""
        }${before}${after}>
</picture>`;
      });
    } else if (originalOptimized) {
      // Se não tiver WebP, só substituir a URL
      updatedHtml = updatedHtml.replace(
        new RegExp(originalPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        originalOptimized.url
      );
    }
  }

  return updatedHtml;
}

async function buildHtml() {
  console.log("📄 Processando HTML...");

  // Procura por todas as pastas em src/
  const folders = fs
    .readdirSync(srcDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== "assets")
    .map((dirent) => dirent.name);

  let processedCount = 0;
  let structuredDataCount = 0;

  for (const folder of folders) {
    const htmlPath = path.join(srcDir, folder, "index.html");
    const metaPath = path.join(srcDir, folder, "meta.json");

    if (fs.existsSync(htmlPath)) {
      try {
        let html = fs.readFileSync(htmlPath, "utf-8");

        // Carregar meta.json se existir
        let meta = null;
        if (fs.existsSync(metaPath)) {
          meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
        }

        // Define os caminhos dos assets (SEM hash ainda)
        const cssPath = `/css/${folder}.min.css`;
        const jsPath = `/js/${folder}.min.js`;

        // Buscar versões com hash
        const cssPathWithHash = hashMap[cssPath] || cssPath;
        const jsPathWithHash = hashMap[jsPath] || jsPath;

        // 0. Injeta Preconnect PRIMEIRO (Performance)
        const preconnectLinks = getPreconnectLinks();
        if (!html.includes('rel="preconnect"')) {
          html = html.replace(/<head>/i, `<head>${preconnectLinks}`);
        }

        // 1. Injeta Google Analytics (se configurado)
        if (config.googleAnalytics && config.googleAnalytics.measurementId) {
          const gaScript = getGoogleAnalyticsScript(
            config.googleAnalytics.measurementId
          );

          if (!html.includes("googletagmanager.com/gtag/js")) {
            html = html.replace(/<head>/i, `<head>${gaScript}`);
          }
        }

        // 2. Injeta/Atualiza o <title> (se tiver meta.json)
        if (meta && meta.title) {
          html = html.replace(/<title>.*?<\/title>/i, "");
          html = html.replace(
            /<head>/i,
            `<head>\n  <title>${meta.title}</title>`
          );
        }

        // 3. Injeta SEO Meta Tags (se configurado e tiver meta.json)
        if (config.seo?.autoInject !== false && meta) {
          const seoTags = getSEOMetaTags(meta, folder);

          if (!html.includes("og:title")) {
            html = html.replace(/<\/title>/i, `</title>${seoTags}`);
          }
        }

        // 4. Injeta Favicons (se configurado)
        if (config.favicons && config.favicons.enabled) {
          const faviconsLinks = getFaviconsLinks(
            config.favicons.basePath || "/assets"
          );

          if (!html.includes("favicon.ico")) {
            html = html.replace("</head>", `${faviconsLinks}\n</head>`);
          }
        }

        // 5. Substitui referências de imagens por versões otimizadas
        html = replaceImageReferences(html);

        // 5.5 Injeta Structured Data / JSON-LD (SEO avançado)
        if (meta && meta.structuredData) {
          const jsonLD = getStructuredData(meta, folder);

          if (!html.includes("application/ld+json")) {
            html = html.replace("</head>", `${jsonLD}\n</head>`);
            structuredDataCount++;
          }
        }

        // 6. Injeta CSS COM HASH (se existir)
        const cssExists = fs.existsSync(
          path.join(srcDir, folder, "styles.scss")
        );
        if (cssExists && !html.includes(cssPathWithHash)) {
          html = html.replace(
            "</head>",
            `  <link rel="stylesheet" href="${cssPathWithHash}">\n</head>`
          );
        }

        // 7. Injeta JS COM HASH antes do </body> (se existir)
        const jsExists = fs.existsSync(path.join(srcDir, folder, "script.js"));
        if (jsExists && !html.includes(jsPathWithHash)) {
          html = html.replace(
            "</body>",
            `  <script src="${jsPathWithHash}"></script>\n</body>`
          );
        }

        // Minifica HTML
        const minified = await minify(html, {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true,
        });

        // Define o caminho de saída
        let outputPath;
        if (folder === "home") {
          outputPath = path.join(publicDir, "index.html");
        } else if (folder === "404") {
          // Página 404 fica na raiz: public/404.html
          outputPath = path.join(publicDir, "404.html");
        } else {
          const outputDir = path.join(publicDir, folder);
          fs.mkdirSync(outputDir, { recursive: true });
          outputPath = path.join(outputDir, "index.html");
        }

        fs.writeFileSync(outputPath, minified);

        processedCount++;
        const outputName =
          folder === "home"
            ? "index.html"
            : folder === "404"
            ? "404.html"
            : `${folder}/index.html`;
        const hasMeta = meta ? "+ SEO" : "";
        const hasHash = Object.keys(hashMap).length > 0 ? "+ Hash" : "";
        console.log(
          `  ✓ ${folder}/index.html → ${outputName} ${hasMeta} ${hasHash}`
        );
      } catch (error) {
        console.error(
          `  ✗ Erro ao processar ${folder}/index.html:`,
          error.message
        );
      }
    }
  }

  console.log(`✓ ${processedCount} arquivo(s) HTML processado(s)\n`);

  // Mensagens de confirmação
  console.log(`⚡ Preconnect links injetados (Google Analytics)\n`);

  if (config.googleAnalytics && config.googleAnalytics.measurementId) {
    console.log(
      `📊 Google Analytics (${config.googleAnalytics.measurementId}) injetado\n`
    );
  }

  if (config.favicons && config.favicons.enabled) {
    console.log(
      `🎨 Favicons injetados automaticamente (${config.favicons.basePath})\n`
    );
  }

  if (config.seo?.autoInject !== false) {
    console.log(`🔍 SEO Meta Tags (Open Graph + Twitter Card) injetados\n`);
  }

  if (structuredDataCount > 0) {
    console.log(
      `📋 Structured Data (JSON-LD) injetado em ${structuredDataCount} página(s)\n`
    );
  }

  if (Object.keys(hashMap).length > 0) {
    console.log(`🔐 Assets com hash de cache injetados\n`);
  }

  if (Object.keys(imageMap).length > 0) {
    console.log(`🖼️  Imagens otimizadas (WebP) injetadas\n`);
  }
}

buildHtml();
