const fs = require('fs');
const file = 'src/components/landing/NewHero.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/fontVariationSettings:\s*''FILL'\s*1'/g, 'fontVariationSettings: "\\'FILL\\' 1"');
fs.writeFileSync(file, content);
