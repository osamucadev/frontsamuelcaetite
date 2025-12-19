const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

function cleanDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('✓ Pasta public/ limpa');
  }
  fs.mkdirSync(dir, { recursive: true });
  
  // Cria subpastas necessárias
  fs.mkdirSync(path.join(dir, 'css'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'js'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
  
  console.log('✓ Estrutura de pastas criada');
}

cleanDirectory(publicDir);
