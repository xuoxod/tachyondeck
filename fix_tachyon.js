const fs = require('fs');
let code = fs.readFileSync('/home/emhcet/private/projects/desktop/mobile/tachyondeck/src/hooks/useTachyon.ts', 'utf8');
console.log(code.match(/catch\s*\([^)]*\)\s*\{[^}]*e\.data[^}]*\}/g));
