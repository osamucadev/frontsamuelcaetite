const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const publicDir = path.join(__dirname, "..", "public");

// Função para gerar hash do conteúdo
function generateHash(content) {
  return crypto.createHash("md5").update(content).digest("hex").substring(0, 8);
}

// Função para adicionar hash no nome do arquivo
function addHashToFile(filePath) {
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath);
  const hash = generateHash(content);

  const ext = path.extname(filePath);
  const nameWithoutExt = path.basename(filePath, ext);
  const dir = path.dirname(filePath);

  // Remove .min se existir para inserir hash antes
  const baseName = nameWithoutExt.replace(".min", "");
  const newName = `${baseName}.min.${hash}${ext}`;
  const newPath = path.join(dir, newName);

  // Renomeia o arquivo
  fs.renameSync(filePath, newPath);

  return {
    oldName: path.basename(filePath),
    newName: newName,
    hash: hash,
  };
}

function hashAssets() {
  console.log("🔐 Adicionando hash em assets...");

  const hashMap = {};

  // Hash CSS
  const cssDir = path.join(publicDir, "css");
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter((f) => f.endsWith(".css"));

    cssFiles.forEach((file) => {
      const filePath = path.join(cssDir, file);
      const result = addHashToFile(filePath);

      if (result) {
        hashMap[`/css/${result.oldName}`] = `/css/${result.newName}`;
        console.log(`  ✓ CSS: ${result.oldName} → ${result.newName}`);
      }
    });
  }

  // Hash JS
  const jsDir = path.join(publicDir, "js");
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir).filter((f) => f.endsWith(".js"));

    jsFiles.forEach((file) => {
      const filePath = path.join(jsDir, file);
      const result = addHashToFile(filePath);

      if (result) {
        hashMap[`/js/${result.oldName}`] = `/js/${result.newName}`;
        console.log(`  ✓ JS: ${result.oldName} → ${result.newName}`);
      }
    });
  }

  // Salvar mapa de hash para o build-html.js usar
  const hashMapPath = path.join(publicDir, "hash-map.json");
  fs.writeFileSync(hashMapPath, JSON.stringify(hashMap, null, 2));

  console.log(
    `✓ Hash adicionado em ${Object.keys(hashMap).length} arquivo(s)\n`
  );

  return hashMap;
}

hashAssets();
