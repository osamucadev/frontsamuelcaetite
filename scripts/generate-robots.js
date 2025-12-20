const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");
const configPath = path.join(__dirname, "..", "config.json");

// Carregar configuração
let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

const baseUrl = config.site?.url || "https://example.com";

function generateRobots() {
  console.log("🤖 Gerando robots.txt...");

  // Template do robots.txt
  const robots = `# robots.txt gerado automaticamente
# ${new Date().toISOString()}

User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay (opcional - descomente se necessário)
# Crawl-delay: 1

# Bloquear pastas específicas (exemplo)
# Disallow: /admin/
# Disallow: /private/
`;

  // Salvar no public/
  const outputPath = path.join(publicDir, "robots.txt");
  fs.writeFileSync(outputPath, robots);

  console.log(`✓ robots.txt gerado`);
  console.log(`  Sitemap: ${baseUrl}/sitemap.xml\n`);
}

generateRobots();
