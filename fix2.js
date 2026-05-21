const fs = require('fs');
const file = 'src/components/landing/NewHero.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\s*bis_skin_checked="1"/g, '');
fs.writeFileSync(file, content);
