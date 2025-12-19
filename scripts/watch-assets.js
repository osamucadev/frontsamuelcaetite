const chokidar = require('chokidar');
const { execSync } = require('child_process');
const path = require('path');

const srcAssetsDir = path.join(__dirname, '..', 'src', 'assets');

console.log('👀 Assistindo mudanças em Assets...\n');

const watcher = chokidar.watch(srcAssetsDir, {
  ignored: /node_modules/,
  persistent: true
});

watcher
  .on('change', (filePath) => {
    const relativePath = path.relative(srcAssetsDir, filePath);
    console.log(`🔄 assets/${relativePath} modificado`);
    
    try {
      execSync('node scripts/copy-assets.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('Erro ao copiar assets');
    }
  })
  .on('add', (filePath) => {
    const relativePath = path.relative(srcAssetsDir, filePath);
    console.log(`✨ assets/${relativePath} adicionado`);
    
    try {
      execSync('node scripts/copy-assets.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('Erro ao copiar assets');
    }
  })
  .on('unlink', (filePath) => {
    const relativePath = path.relative(srcAssetsDir, filePath);
    console.log(`🗑️  assets/${relativePath} removido`);
    
    try {
      execSync('node scripts/copy-assets.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('Erro ao copiar assets');
    }
  });
