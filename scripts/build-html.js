const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

const srcDir = path.join(__dirname, '..', 'src');
const publicDir = path.join(__dirname, '..', 'public');

async function buildHtml() {
  console.log('📄 Processando HTML...');
  
  // Procura por todas as pastas em src/
  const folders = fs.readdirSync(srcDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'assets')
    .map(dirent => dirent.name);
  
  let processedCount = 0;
  
  for (const folder of folders) {
    const htmlPath = path.join(srcDir, folder, 'index.html');
    
    if (fs.existsSync(htmlPath)) {
      try {
        let html = fs.readFileSync(htmlPath, 'utf-8');
        
        // Define os caminhos dos assets baseado na pasta
        const cssPath = `/css/${folder}.min.css`;
        const jsPath = `/js/${folder}.min.js`;
        
        // Injeta CSS no <head> se existir
        const cssExists = fs.existsSync(path.join(srcDir, folder, 'styles.scss'));
        if (cssExists && !html.includes(cssPath)) {
          html = html.replace(
            '</head>',
            `  <link rel="stylesheet" href="${cssPath}">\n</head>`
          );
        }
        
        // Injeta JS antes do </body> se existir
        const jsExists = fs.existsSync(path.join(srcDir, folder, 'script.js'));
        if (jsExists && !html.includes(jsPath)) {
          html = html.replace(
            '</body>',
            `  <script src="${jsPath}"></script>\n</body>`
          );
        }
        
        // Minifica HTML
        const minified = await minify(html, {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true
        });
        
        // Define o caminho de saída
        let outputPath;
        if (folder === 'home') {
          outputPath = path.join(publicDir, 'index.html');
        } else {
          const outputDir = path.join(publicDir, folder);
          fs.mkdirSync(outputDir, { recursive: true });
          outputPath = path.join(outputDir, 'index.html');
        }
        
        fs.writeFileSync(outputPath, minified);
        
        processedCount++;
        const outputName = folder === 'home' ? 'index.html' : `${folder}/index.html`;
        console.log(`  ✓ ${folder}/index.html → ${outputName}`);
      } catch (error) {
        console.error(`  ✗ Erro ao processar ${folder}/index.html:`, error.message);
      }
    }
  }
  
  console.log(`✓ ${processedCount} arquivo(s) HTML processado(s)\n`);
}

buildHtml();
