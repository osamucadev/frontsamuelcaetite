const fs = require("fs");
const path = require("path");
const { minify } = require("html-minifier-terser");

const srcDir = path.join(__dirname, "..", "src");
const publicDir = path.join(__dirname, "..", "public");
const configPath = path.join(__dirname, "..", "config.json");

// Carregar configuração
let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
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

async function buildHtml() {
  console.log("📄 Processando HTML...");

  // Procura por todas as pastas em src/
  const folders = fs
    .readdirSync(srcDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== "assets")
    .map((dirent) => dirent.name);

  let processedCount = 0;

  for (const folder of folders) {
    const htmlPath = path.join(srcDir, folder, "index.html");

    if (fs.existsSync(htmlPath)) {
      try {
        let html = fs.readFileSync(htmlPath, "utf-8");

        // Define os caminhos dos assets baseado na pasta
        const cssPath = `/css/${folder}.min.css`;
        const jsPath = `/js/${folder}.min.js`;

        // Injeta Google Analytics PRIMEIRO (se configurado)
        if (config.googleAnalytics && config.googleAnalytics.measurementId) {
          const gaScript = getGoogleAnalyticsScript(
            config.googleAnalytics.measurementId
          );

          // Injeta logo após <head> (antes de tudo)
          if (!html.includes("googletagmanager.com/gtag/js")) {
            html = html.replace(/<head>/i, `<head>${gaScript}`);
          }
        }

        // Injeta Favicons DEPOIS do GA (se configurado)
        if (config.favicons && config.favicons.enabled) {
          const faviconsLinks = getFaviconsLinks(
            config.favicons.basePath || "/assets"
          );

          // Injeta após o GA mas antes do </head>
          if (!html.includes("favicon.ico")) {
            html = html.replace("</head>", `${faviconsLinks}\n</head>`);
          }
        }

        // Injeta CSS (se existir)
        const cssExists = fs.existsSync(
          path.join(srcDir, folder, "styles.scss")
        );
        if (cssExists && !html.includes(cssPath)) {
          html = html.replace(
            "</head>",
            `  <link rel="stylesheet" href="${cssPath}">\n</head>`
          );
        }

        // Injeta JS antes do </body> (se existir)
        const jsExists = fs.existsSync(path.join(srcDir, folder, "script.js"));
        if (jsExists && !html.includes(jsPath)) {
          html = html.replace(
            "</body>",
            `  <script src="${jsPath}"></script>\n</body>`
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
        } else {
          const outputDir = path.join(publicDir, folder);
          fs.mkdirSync(outputDir, { recursive: true });
          outputPath = path.join(outputDir, "index.html");
        }

        fs.writeFileSync(outputPath, minified);

        processedCount++;
        const outputName =
          folder === "home" ? "index.html" : `${folder}/index.html`;
        console.log(`  ✓ ${folder}/index.html → ${outputName}`);
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
}

buildHtml();
