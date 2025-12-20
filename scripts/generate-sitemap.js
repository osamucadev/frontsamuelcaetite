const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "..", "src");
const publicDir = path.join(__dirname, "..", "public");
const configPath = path.join(__dirname, "..", "config.json");

// Carregar configuração
let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

const baseUrl = config.site?.url || "https://react.samuelcaetite.dev";

function generateSitemap() {
  console.log("🗺️  Gerando sitemap.xml...");

  // Procura por todas as pastas em src/ (páginas)
  const folders = fs
    .readdirSync(srcDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== "assets")
    .map((dirent) => dirent.name);

  if (folders.length === 0) {
    console.log("⚠️  Nenhuma página encontrada em src/\n");
    return;
  }

  // Data atual em formato ISO
  const today = new Date().toISOString().split("T")[0];

  // Gerar URLs com informações do meta.json (se existir)
  const urls = folders
    .map((folder) => {
      const metaPath = path.join(srcDir, folder, "meta.json");

      // Valores padrão
      let priority = folder === "home" ? "1.0" : "0.8";
      let changefreq = "weekly";

      // Se tiver meta.json, usa os valores de lá
      if (fs.existsSync(metaPath)) {
        try {
          const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
          if (meta.sitemap) {
            priority = meta.sitemap.priority || priority;
            changefreq = meta.sitemap.changefreq || changefreq;
          }
        } catch (error) {
          console.error(
            `  ⚠️  Erro ao ler meta.json de ${folder}:`,
            error.message
          );
        }
      }

      const loc = folder === "home" ? baseUrl : `${baseUrl}/${folder}`;

      return {
        folder,
        xml: `  <url>
    <loc>${loc}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
        url: `${loc}/`,
        priority: parseFloat(priority),
      };
    })
    .sort((a, b) => b.priority - a.priority); // Ordena por prioridade (maior primeiro)

  // Template do sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => u.xml).join("\n")}
</urlset>`;

  // Salvar no public/
  const outputPath = path.join(publicDir, "sitemap.xml");
  fs.writeFileSync(outputPath, sitemap);

  console.log(`✓ sitemap.xml gerado com ${folders.length} página(s)\n`);

  // Mostrar URLs geradas (ordenadas por prioridade)
  urls.forEach((item) => {
    console.log(`  • ${item.url} (prioridade: ${item.priority})`);
  });

  console.log("");
}

generateSitemap();
