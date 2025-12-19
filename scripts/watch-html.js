const chokidar = require('chokidar');
const { execSync } = require('child_process');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

console.log('👀 Assistindo mudanças em HTML...\n');

const watcher = chokidar.watch(`${srcDir}/**/index.html`, {
  ignored: /node_modules/,
  persistent: true
});

watcher
  .on('change', (filePath) => {
    const relativePath = path.relative(srcDir, filePath);
    console.log(`🔄 ${relativePath} modificado`);
    
    try {
      execSync('node scripts/build-html.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('Erro ao processar HTML');
    }
  })
  .on('add', (filePath) => {
    const relativePath = path.relative(srcDir, filePath);
    console.log(`✨ ${relativePath} adicionado`);
    
    try {
      execSync('node scripts/build-html.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('Erro ao processar HTML');
    }
  });
