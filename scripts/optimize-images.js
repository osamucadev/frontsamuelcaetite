const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");

const srcAssetsDir = path.join(__dirname, "..", "src", "assets");
const publicAssetsDir = path.join(__dirname, "..", "public", "assets");

// Função para gerar hash do arquivo
function generateHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(content).digest("hex").substring(0, 8);
}

// Função para processar uma imagem
async function processImage(srcPath, destDir) {
  const ext = path.extname(srcPath).toLowerCase();
  const baseName = path.basename(srcPath, ext);

  // Apenas processar imagens
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    return null;
  }

  try {
    // Gerar hash do arquivo original
    const hash = generateHash(srcPath);

    const results = [];

    // Se não for WebP, criar versão WebP
    if (ext !== ".webp") {
      const webpName = `${baseName}.${hash}.webp`;
      const webpPath = path.join(destDir, webpName);

      await sharp(srcPath).webp({ quality: 85 }).toFile(webpPath);

      results.push({
        type: "webp",
        original: path.basename(srcPath),
        optimized: webpName,
        path: webpPath,
      });
    }

    // Criar versão otimizada do formato original
    const optimizedName = `${baseName}.${hash}${ext}`;
    const optimizedPath = path.join(destDir, optimizedName);

    if (ext === ".jpg" || ext === ".jpeg") {
      await sharp(srcPath)
        .jpeg({ quality: 85, progressive: true })
        .toFile(optimizedPath);
    } else if (ext === ".png") {
      await sharp(srcPath)
        .png({ quality: 85, compressionLevel: 9 })
        .toFile(optimizedPath);
    } else if (ext === ".webp") {
      await sharp(srcPath).webp({ quality: 85 }).toFile(optimizedPath);
    }

    results.push({
      type: ext.replace(".", ""),
      original: path.basename(srcPath),
      optimized: optimizedName,
      path: optimizedPath,
    });

    return results;
  } catch (error) {
    console.error(
      `  ✗ Erro ao processar ${path.basename(srcPath)}:`,
      error.message
    );
    return null;
  }
}

// Função para processar diretório recursivamente
async function processDirectory(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    return { count: 0, imageMap: {} };
  }

  fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  let processedCount = 0;
  const imageMap = {};

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      // Processar subdiretório recursivamente
      const subResult = await processDirectory(srcPath, destPath);
      processedCount += subResult.count;
      Object.assign(imageMap, subResult.imageMap);
    } else {
      const ext = path.extname(entry.name).toLowerCase();

      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        // Processar imagem
        const results = await processImage(srcPath, destDir);

        if (results) {
          processedCount++;

          // Mapear nome original para versões otimizadas
          const relativeSrcPath = path
            .relative(srcAssetsDir, srcPath)
            .replace(/\\/g, "/");
          const relativeDestDir = path
            .relative(publicAssetsDir, destDir)
            .replace(/\\/g, "/");

          imageMap[`/assets/${relativeSrcPath}`] = results.map((r) => ({
            type: r.type,
            url: `/assets/${relativeDestDir ? relativeDestDir + "/" : ""}${
              r.optimized
            }`,
          }));

          const fileSize = fs.statSync(srcPath).size;
          const optimizedSizes = results.map((r) => fs.statSync(r.path).size);
          const savedPercent = Math.round(
            (1 - Math.min(...optimizedSizes) / fileSize) * 100
          );

          console.log(
            `  ✓ ${entry.name} → ${results
              .map((r) => r.optimized)
              .join(", ")} (${savedPercent}% menor)`
          );
        }
      } else {
        // Copiar arquivo não-imagem normalmente
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  return { count: processedCount, imageMap };
}

async function optimizeImages() {
  console.log("🖼️  Otimizando imagens...");

  const result = await processDirectory(srcAssetsDir, publicAssetsDir);

  if (result.count > 0) {
    console.log(`✓ ${result.count} imagem(ns) otimizada(s)\n`);

    // Salvar mapa de imagens
    const imageMapPath = path.join(__dirname, "..", "public", "image-map.json");
    fs.writeFileSync(imageMapPath, JSON.stringify(result.imageMap, null, 2));
  } else {
    console.log("⚠️  Nenhuma imagem encontrada em src/assets/\n");
  }
}

optimizeImages().catch((error) => {
  console.error("Erro ao otimizar imagens:", error);
  process.exit(1);
});
