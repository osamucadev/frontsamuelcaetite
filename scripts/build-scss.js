const fs = require('fs');
const path = require('path');
const sass = require('sass');

const srcDir = path.join(__dirname, '..', 'src');
const publicDir = path.join(__dirname, '..', 'public');

function buildScss() {
  console.log('🎨 Compilando SCSS...');
  
  // Procura por todas as pastas em src/
  const folders = fs.readdirSync(srcDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'assets')
    .map(dirent => dirent.name);
  
  let compiledCount = 0;
  
  folders.forEach(folder => {
    const scssPath = path.join(srcDir, folder, 'styles.scss');
    
    if (fs.existsSync(scssPath)) {
      try {
        const result = sass.compile(scssPath, {
          style: 'compressed',
          sourceMap: false
        });
        
        const outputPath = path.join(publicDir, 'css', `${folder}.min.css`);
        fs.writeFileSync(outputPath, result.css);
        
        compiledCount++;
        console.log(`  ✓ ${folder}/styles.scss → css/${folder}.min.css`);
      } catch (error) {
        console.error(`  ✗ Erro ao compilar ${folder}/styles.scss:`, error.message);
      }
    }
  });
  
  console.log(`✓ ${compiledCount} arquivo(s) SCSS compilado(s)\n`);
}

buildScss();
