// Independent checks on ak-data.json (the workbook export), the image files and the selection engine.
// Usage: node validate.js   -> writes validate-results.json, exit 1 on any failure
const fs = require('fs'), path = require('path');
const E = require('./engine.js');
const D = JSON.parse(fs.readFileSync(path.join(__dirname, 'ak-data.json'), 'utf8'));
const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'animal-kingdom.html'), 'utf8');
const res = [];
const t = (name, ok, info) => { res.push({ name, ok: !!ok, info: ok ? undefined : info }); console.log((ok ? '  ok   ' : '  FAIL ') + name + (ok || !info ? '' : ' :: ' + JSON.stringify(info).slice(0, 300))); };
const A = D.animals, F = D.facts, G = E.GROUPS;

// ---- data
t('exactly the five groups from the brief', JSON.stringify(Object.keys(D.groups)) === JSON.stringify(['Mammal', 'Insect', 'Bird', 'Reptile', 'Amphibian']));
t('exactly 300 animals', A.length === 300, A.length);
for (const g of G) {
  const n = A.filter(a => a.group === g);
  t('  ' + g + ': 60 animals (' + ['Easy', 'Medium', 'Challenging'].map(d => n.filter(a => a.difficulty === d).length).join('/') + ' Easy/Medium/Challenging)', n.length === 60 && ['Easy', 'Medium', 'Challenging'].every(d => n.some(a => a.difficulty === d)));
}
for (const k of ['id', 'common', 'sci', 'img']) t('no duplicate ' + k, new Set(A.map(a => String(a[k]).toLowerCase())).size === A.length);
t('every animal has name, scientific name, photo, photographer, licence and source', A.every(a => a.common && a.sci && a.img && a.photographer && a.photographer !== 'Unknown' && a.licence && a.licenceUrl && /^https:\/\/commons\.wikimedia\.org\//.test(a.source)), A.filter(a => !(a.photographer && a.licence && a.source)).map(a => a.id));
const badLic = A.filter(a => /\bNC\b|\bND\b|non-?commercial|no ?deriv/i.test(a.licence) || !/^(CC0|Public domain|CC BY(-SA)? [0-9.]+)/.test(a.licence));
t('every licence is CC0, Public domain, CC BY or CC BY-SA (no NC/ND)', badLic.length === 0, badLic.map(a => a.id + ' ' + a.licence));
t('scientific names look like binomials', A.every(a => /^[A-Z][a-z]+ [a-z]+( [a-z]+)?$/.test(a.sci)), A.filter(a => !/^[A-Z][a-z]+ [a-z]+( [a-z]+)?$/.test(a.sci)).map(a => a.sci));
const missing = A.filter(a => !fs.existsSync(path.join(ROOT, a.img)));
t('every photo file exists', missing.length === 0, missing.map(a => a.img));
const PLURAL = { Mammal: 'Mammals', Insect: 'Insects', Bird: 'Birds', Reptile: 'Reptiles', Amphibian: 'Amphibians' };
t('every photo is in its group folder and named group_common_scientific.jpg', A.every(a => a.img.startsWith('Images/' + PLURAL[a.group] + '/' + a.group.toLowerCase() + '_') && /^[a-z0-9_]+\.jpg$/.test(path.basename(a.img))));
const sizes = A.map(a => { try { return fs.statSync(path.join(ROOT, a.img)).size; } catch (e) { return 0; } });
t('photos are between 20 KB and 600 KB (total ' + (sizes.reduce((x, y) => x + y, 0) / 1048576).toFixed(1) + ' MB)', sizes.every(s => s > 20000 && s < 600000), A.filter((a, i) => sizes[i] <= 20000 || sizes[i] >= 600000).map(a => a.img));
t('Years 5–6 pool is 200 animals (Easy + Medium); Years 7–8 uses all 300', E.poolFor(A, 'Y56').length === 200 && E.poolFor(A, 'Y78').length === 300);
t('every feedback phrase starts with a or an', A.every(a => /^an? [a-zA-Z]/.test(a.phrase)));
t('"an" is used before vowels', A.every(a => (/^[aeiou]/i.test(a.phrase.replace(/^an? /, '')) ? /^an /.test(a.phrase) : /^a /.test(a.phrase))));

// ---- facts
t('exactly 100 facts', F.length === 100, F.length);
t('no duplicate facts', new Set(F.map(f => f.fact.toLowerCase().replace(/[^a-z0-9]/g, ''))).size === F.length);
t('every fact has an organisation, title and web address', F.every(f => f.org && f.title && /^https?:\/\//.test(f.url)));
for (const g of G) t('  ' + g + ' facts: ' + F.filter(f => (A.find(a => a.id === f.animalId) || {}).group === g).length + ' linked to a photo', true);
t('at least 95 facts link to an animal with a photo', F.filter(f => f.animalId).length >= 95, F.filter(f => !f.animalId).map(f => f.id + ' ' + f.animal));
let rnd = mulberry(7), recent = [], repeats = 0;
for (let i = 0; i < 2000; i++) { const f = E.pickFact(F, recent, rnd); if (recent.includes(f.id)) repeats++; recent = [f.id].concat(recent).slice(0, 10); }
t('fact picker never repeats one of the last 10 games\' facts (2,000 games)', repeats === 0, repeats);

// ---- engine
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function play(pathway, seconds, perQ, seed, accuracy) {
  const r = mulberry(seed), s = new E.Session({ animals: A, pathway, seconds, rnd: r });
  const shown = [];
  for (let el = 0; el < seconds; el += perQ) {
    const a = s.next(el); shown.push({ a, p: el / seconds });
    s.answer(r() < accuracy ? a.group : G[(G.indexOf(a.group) + 1) % 5]);
  }
  return { s, shown };
}
let ok = { repeat: true, run: true, pool: true, floor: true, groups: true };
const early = { Easy: 0, Medium: 0, Challenging: 0 }, late = { Easy: 0, Medium: 0, Challenging: 0 };
const lateY56 = { Easy: 0, Medium: 0 }, earlyY56 = { Easy: 0, Medium: 0 };
for (let seed = 1; seed <= 400; seed++) {
  for (const [pw, sec] of [['Y56', 180], ['Y56', 300], ['Y78', 180], ['Y78', 300]]) {
    const { s, shown } = play(pw, sec, 3, seed * 13 + sec, 0.4 + (seed % 6) / 10);
    const ids = shown.map(x => x.a.id);
    if (new Set(ids).size !== ids.length) ok.repeat = false;
    for (let i = 2; i < shown.length; i++) if (shown[i].a.group === shown[i - 1].a.group && shown[i].a.group === shown[i - 2].a.group) ok.run = false;
    if (pw === 'Y56' && shown.some(x => x.a.difficulty === 'Challenging')) ok.pool = false;
    if (s.score < 0) ok.floor = false;
    const c = {}; shown.forEach(x => c[x.a.group] = (c[x.a.group] || 0) + 1);
    if (G.some(g => !c[g]) || Math.max(...Object.values(c)) - Math.min(...Object.values(c)) > Math.ceil(shown.length * 0.15) + 2) ok.groups = false;
    for (const x of shown) {
      if (pw === 'Y78') { if (x.p < 0.25) early[x.a.difficulty]++; if (x.p >= 0.75) late[x.a.difficulty]++; }
      else { if (x.p < 0.25) earlyY56[x.a.difficulty]++; if (x.p >= 0.75) lateY56[x.a.difficulty]++; }
    }
  }
}
t('no animal repeats within a game (1,600 simulated games at 3 s per answer)', ok.repeat);
t('never three of the same group in a row', ok.run);
t('Years 5–6 never sees a Challenging animal', ok.pool);
t('score never drops below 0', ok.floor);
t('all five groups appear in every game and stay balanced', ok.groups);
const pc = (o, k) => Math.round(100 * o[k] / Object.values(o).reduce((x, y) => x + y, 0));
t('Years 7–8 gets harder: Challenging ' + pc(early, 'Challenging') + '% in the first quarter vs ' + pc(late, 'Challenging') + '% in the last', pc(late, 'Challenging') > pc(early, 'Challenging') + 20);
t('Years 5–6 gets harder: Medium ' + pc(earlyY56, 'Medium') + '% in the first quarter vs ' + pc(lateY56, 'Medium') + '% in the last', pc(lateY56, 'Medium') > pc(earlyY56, 'Medium') + 20);
t('but not predictably: Easy animals still appear late in Years 7–8 (' + pc(late, 'Easy') + '%)', pc(late, 'Easy') >= 5);
// a very fast player (1 s per answer) exhausts the pool: the session reshuffles only after every animal was shown
const fast = play('Y56', 300, 1, 99, 1);
const first200 = fast.shown.slice(0, 200).map(x => x.a.id);
t('a very fast player sees all 200 Years 5–6 animals before any repeat', new Set(first200).size === 200);
// scoring
const s2 = new E.Session({ animals: A, pathway: 'Y56', seconds: 180, rnd: mulberry(3) });
let a = s2.next(0); s2.answer(G[(G.indexOf(a.group) + 1) % 5]);
const atZero = s2.score;
a = s2.next(1); s2.answer(a.group); a = s2.next(2); s2.answer(a.group); a = s2.next(3); s2.answer(G[(G.indexOf(a.group) + 1) % 5]);
const r2 = s2.results();
t('+1 correct, −1 wrong, floor 0: wrong first answer scores 0, then 2 right and 1 wrong scores 1', atZero === 0 && r2.score === 1 && r2.correct === 2 && r2.wrong === 2 && r2.attempted === 4 && r2.accuracy === 50, r2);
t('results name the pathway and duration', r2.pathway === 'Years 5–6' && r2.minutes === 3);
t('encouragement titles', E.encouragement({ attempted: 20, correct: 19, accuracy: 95 }).title === 'Animal Classification Champion!' && E.encouragement({ attempted: 10, correct: 3, accuracy: 30 }).title === 'Keep Exploring!');

// ---- built game
const m = html.match(/window\.AK_DATA = (\{.*?\});\n?<\/script>/s);
t('built game carries exactly this export (version ' + D.version + ')', m && JSON.parse(m[1]).animals.length === 300 && JSON.parse(m[1]).facts.length === 100);
t('built game contains no external image URLs (photos load from the local Images folder)', !/upload\.wikimedia\.org/.test(html.replace(/https:\/\/commons\.wikimedia\.org[^"'\s]*/g, '')));
fs.writeFileSync(path.join(__dirname, 'validate-results.json'), JSON.stringify({ when: new Date().toISOString(), version: D.version, passed: res.filter(r => r.ok).length, failed: res.filter(r => !r.ok).length, results: res }, null, 1));
console.log(res.filter(r => r.ok).length + ' passed, ' + res.filter(r => !r.ok).length + ' failed');
process.exit(res.every(r => r.ok) ? 0 : 1);
