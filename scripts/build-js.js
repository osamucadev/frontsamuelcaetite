const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const srcDir = path.join(__dirname, '..', 'src');
const publicDir = path.join(__dirname, '..', 'public');

async function buildJs() {
  console.log('⚡ Minificando JavaScript...');
  
  // Procura por todas as pastas em src/
  const folders = fs.readdirSync(srcDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'assets')
    .map(dirent => dirent.name);
  
  let compiledCount = 0;
  
  for (const folder of folders) {
    const jsPath = path.join(srcDir, folder, 'script.js');
    
    if (fs.existsSync(jsPath)) {
      try {
        const outputPath = path.join(publicDir, 'js', `${folder}.min.js`);
        
        await esbuild.build({
          entryPoints: [jsPath],
          bundle: false,
          minify: true,
          target: 'es2020',
          outfile: outputPath
        });
        
        compiledCount++;
        console.log(`  ✓ ${folder}/script.js → js/${folder}.min.js`);
      } catch (error) {
        console.error(`  ✗ Erro ao minificar ${folder}/script.js:`, error.message);
      }
    }
  }
  
  console.log(`✓ ${compiledCount} arquivo(s) JavaScript minificado(s)\n`);
}

buildJs();
