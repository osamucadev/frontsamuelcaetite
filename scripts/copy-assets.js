const fs = require('fs');
const path = require('path');

const srcAssetsDir = path.join(__dirname, '..', 'src', 'assets');
const publicAssetsDir = path.join(__dirname, '..', 'public', 'assets');

function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) {
    console.log('⚠️  Pasta src/assets/ não encontrada. Pulando...\n');
    return 0;
  }
  
  fs.mkdirSync(dest, { recursive: true });
  
  let copiedCount = 0;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copiedCount += copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      copiedCount++;
    }
  }
  
  return copiedCount;
}

function copyAssets() {
  console.log('📦 Copiando assets...');
  
  const copiedCount = copyDirectory(srcAssetsDir, publicAssetsDir);
  
  if (copiedCount > 0) {
    console.log(`✓ ${copiedCount} arquivo(s) copiado(s)\n`);
  }
}

copyAssets();
