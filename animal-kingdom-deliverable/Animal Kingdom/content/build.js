// Builds ../animal-kingdom.html: inlines the workbook export (ak-data.json) and engine.js into game-src.html.
// The content lives only in the two workbooks; ak-data.json is generated from them by export_data.py.
// Photos are not inlined: the page loads them from Images/<Group plural>/ next to it.
const fs = require('fs'), path = require('path');
const rd = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');
const safe = (s) => s.replace(/<\/script/gi, '<\\/script');
let out = rd('game-src.html');
const data = JSON.parse(rd('ak-data.json'));
for (const [m, v] of [['/*DATA*/', 'window.AK_DATA = ' + JSON.stringify(data) + ';'], ['/*ENGINE*/', rd('engine.js')]]) {
  if (out.indexOf(m) < 0) throw new Error('marker missing ' + m);
  out = out.replace(m, () => safe(v));
}
const dest = process.argv[2] || path.join(__dirname, '..', 'animal-kingdom.html');
fs.writeFileSync(dest, out);
console.log('wrote', path.basename(dest), out.length, 'bytes,', data.animals.length, 'animals,', data.facts.length, 'facts, data', data.version);
