const chokidar = require('chokidar');
const { execSync } = require('child_process');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

console.log('👀 Assistindo mudanças em SCSS...\n');

const watcher = chokidar.watch(`${srcDir}/**/styles.scss`, {
  ignored: /node_modules/,
  persistent: true
});

watcher
  .on('change', (filePath) => {
    const relativePath = path.relative(srcDir, filePath);
    console.log(`🔄 ${relativePath} modificado`);
    
    try {
      execSync('node scripts/build-scss.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('Erro ao compilar SCSS');
    }
  })
  .on('add', (filePath) => {
    const relativePath = path.relative(srcDir, filePath);
    console.log(`✨ ${relativePath} adicionado`);
    
    try {
      execSync('node scripts/build-scss.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('Erro ao compilar SCSS');
    }
  });
