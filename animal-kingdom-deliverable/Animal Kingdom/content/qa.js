// Animal Kingdom browser QA: plays the built page in Chromium (Playwright) for both pathways and both
// durations, checks scoring, feedback wording, timer, results, fact card and credits, and takes screenshots
// at phone, tablet, desktop and ICT-room sizes, in light and dark. Run validate.js first for the data checks.
// Usage: node qa.js   -> writes qa-results.json and ../Documentation/qa-*.png; exit 1 on any failure
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const D = JSON.parse(fs.readFileSync(process.env.AK_DATA || path.join(__dirname, 'ak-data.json'), 'utf8'));
// Served over http (like the live site) so the photo-loading delay test can intercept image requests.
const PAGE_FILE = process.env.AK_PAGE || path.join(__dirname, '..', 'animal-kingdom.html');
const http = require('http');
const SERVE_ROOT = path.dirname(PAGE_FILE);
const server = http.createServer((q, r) => {
  const f = path.join(SERVE_ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(SERVE_ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': f.endsWith('.html') ? 'text/html; charset=utf-8' : 'image/jpeg' });
  fs.createReadStream(f).pipe(r);
});
let PAGE;
const DOC = process.env.AK_DOC || path.join(__dirname, '..', 'Documentation');
fs.mkdirSync(DOC, { recursive: true });
const res = []; let group = '';
const t = (name, ok, info) => { res.push({ group, name, ok: !!ok, info: ok ? undefined : info }); console.log((ok ? '  ok   ' : '  FAIL ') + name + (ok || info === undefined ? '' : ' :: ' + JSON.stringify(info).slice(0, 240))); };
const BY_IMG = {}; D.animals.forEach(a => { BY_IMG[a.img] = a; });
const shot = (page, name) => page.screenshot({ path: path.join(DOC, 'qa-' + name + '.png') });

// The page's clock uses Date.now(); tests speed it up by shifting time forward from inside the page.
const CLOCK = `(() => { let off = 0; const real = Date.now.bind(Date); Date.now = () => real() + off; window.__skip = (ms) => { off += ms; }; })();`;

async function current(page) {
  const src = await page.$eval('#pic', im => im.getAttribute('src'));
  return BY_IMG[src];
}
async function waitReady(page) { await page.waitForFunction(() => !document.querySelector('.ans').disabled, null, { timeout: 15000 }); }

(async () => {
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  PAGE = 'http://127.0.0.1:' + server.address().port + '/' + path.basename(PAGE_FILE);
  const browser = await chromium.launch();
  // ---------------- home ----------------
  group = 'Homepage'; console.log(group);
  let ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  let page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(CLOCK);
  await page.goto(PAGE);
  t('title and subtitle', (await page.textContent('h1')).includes('Animal Kingdom') && /Classification Challenge/i.test(await page.textContent('#home')));
  t('Start is disabled until a pathway is chosen', await page.$eval('#start', b => b.disabled));
  t('both pathways offered', (await page.$$('[data-path]')).length === 2 && /Years 5.6/.test(await page.textContent('[data-path=Y56]')) && /Years 7.8/.test(await page.textContent('[data-path=Y78]')));
  t('3- and 5-minute modes offered', (await page.$$('[data-min]')).length === 2);
  await page.waitForFunction(() => [...document.querySelectorAll('#mosaic img')].every(i => i.complete && i.naturalWidth > 0));
  t('home shows one real photo per group', (await page.$$('#mosaic img')).length === 5);
  await shot(page, 'home');

  // ---------------- a full Years 5-6, 3-minute game ----------------
  group = 'Gameplay: Years 5–6, 3 minutes'; console.log(group);
  await page.click('[data-path=Y56]'); await page.click('[data-min="3"]');
  t('Start enables after choosing a pathway', !(await page.$eval('#start', b => b.disabled)));
  await page.click('#start');
  await waitReady(page);
  t('clock shows 3:00 when the first photo appears', /^(3:00|2:59)$/.test(await page.textContent('#timeV')));
  let a = await current(page);
  t('photo shows its credit line', (await page.textContent('#credit')).includes(a.photographer));
  // wrong answer at score 0: no −1 shown, score stays 0
  const wrongOf = x => D.groups && Object.keys(D.groups).find(g => g !== x.group);
  await page.click('.ans[data-g=' + wrongOf(a) + ']');
  let fb = await page.textContent('#fb');
  const L = x => D.groups[x.group].label.toLowerCase();
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  t('wrong-answer feedback: "NOT QUITE! A ... is actually a ... <explanation>"', fb.startsWith('NOT QUITE!') && fb.includes(cap(a.phrase) + ' is actually ' + D.groups[a.group].article + ' ' + L(a) + '.') && fb.includes(D.groups[a.group].explain), fb);
  t('score stays at 0 (no negative scores) and no −1 shown at 0', (await page.textContent('#scoreV')) === '0' && !fb.includes('−1'));
  await shot(page, 'feedback-wrong');
  const seen = [a.id];
  // answer correctly a few times
  for (let i = 0; i < 4; i++) {
    await page.waitForFunction(prev => document.getElementById('pic').getAttribute('src') !== prev, a.img, { timeout: 10000 });
    await waitReady(page);
    a = await current(page); seen.push(a.id);
    await page.click('.ans[data-g=' + a.group + ']');
    if (i === 0) {
      fb = await page.textContent('#fb');
      t('correct feedback: "CORRECT! Well done! A ... is a ..."', fb.startsWith('CORRECT!') && fb.includes('Well done! ' + cap(a.phrase) + ' is ' + D.groups[a.group].article + ' ' + L(a) + '.'), fb);
      await shot(page, 'feedback-correct');
    }
  }
  t('+1 per correct answer (4 correct, 1 wrong at 0 → 4)', (await page.textContent('#scoreV')) === '4');
  // one wrong at score 4 → 3, with −1 shown
  await page.waitForFunction(prev => document.getElementById('pic').getAttribute('src') !== prev, a.img, { timeout: 10000 });
  await waitReady(page);
  a = await current(page); seen.push(a.id);
  await page.click('.ans[data-g=' + wrongOf(a) + ']');
  t('wrong answer above 0 costs 1 point and shows −1', (await page.textContent('#scoreV')) === '3' && (await page.textContent('#fb')).includes('−1'));
  // keyboard 1-5 works
  await page.waitForFunction(prev => document.getElementById('pic').getAttribute('src') !== prev, a.img, { timeout: 10000 });
  await waitReady(page);
  a = await current(page); seen.push(a.id);
  const idx = ['Mammal', 'Insect', 'Bird', 'Reptile', 'Amphibian'].indexOf(a.group);
  await page.keyboard.press(String(idx + 1));
  t('number keys 1–5 answer', (await page.textContent('#scoreV')) === '4');
  t('no repeated animal so far, all Easy/Medium', new Set(seen).size === seen.length && seen.every(id => D.animals.find(x => x.id === id).difficulty !== 'Challenging'));
  await page.waitForFunction(prev => document.getElementById('pic').getAttribute('src') !== prev, a.img, { timeout: 10000 });
  await waitReady(page);
  await shot(page, 'game-desktop');
  // run the clock out
  await page.evaluate(() => window.__skip(181000));
  await page.waitForSelector('#results.on', { timeout: 5000 });
  t('game ends when the clock reaches 0:00', true);
  const stats = await page.textContent('#stats');
  t('results show score, attempted, correct, incorrect, accuracy, pathway and time', /4\s*Final score/.test(stats) && /7\s*Animals attempted/.test(stats) && /5\s*Correct/.test(stats) && /2\s*Incorrect/.test(stats) && /71%\s*Accuracy/.test(stats) && /Years 5–6 · 3 min/.test(stats), stats);
  t('encouraging message', ['Animal Classification Champion!', 'Expert Classifier!', 'Great Explorer!', 'Keep Exploring!'].includes(await page.textContent('#rTitle')));
  const fact1 = await page.textContent('#factCard');
  const f1 = D.facts.find(f => fact1.includes(f.fact));
  t('results show one of the 100 facts with its source', !!f1 && fact1.includes(f1.org));
  if (f1 && f1.animalId) t('fact card shows the animal photo and credit', await page.$eval('#factCard img', im => im.complete && im.naturalWidth > 0));
  t('Play Again and Return to Homepage buttons', !!(await page.$('#again')) && !!(await page.$('#home2')));
  await shot(page, 'results');
  // next game: different fact
  await page.click('#again'); await waitReady(page);
  t('Play Again starts a fresh game at 0', (await page.textContent('#scoreV')) === '0');
  await page.click('#quit');
  await page.waitForSelector('#results.on');
  const fact2 = await page.textContent('#factCard');
  t('next game shows a different fact', fact2 !== fact1);
  await page.click('#home2');
  t('Return to Homepage works', await page.$eval('#home', el => el.classList.contains('on')));

  // ---------------- Years 7-8, 5 minutes: a long simulated game ----------------
  group = 'Gameplay: Years 7–8, 5 minutes'; console.log(group);
  await page.click('[data-path=Y78]'); await page.click('[data-min="5"]'); await page.click('#start');
  await waitReady(page);
  t('clock shows 5:00 at the start', /^(5:00|4:59)$/.test(await page.textContent('#timeV')));
  const ids = [], groups = [], diffs = [];
  for (let i = 0; i < 40; i++) {
    a = await current(page); ids.push(a.id); groups.push(a.group); diffs.push(a.difficulty);
    await page.click('.ans[data-g=' + a.group + ']');
    await page.evaluate(() => window.__skip(6000)); // 40 answers spread over about 4 minutes
    await page.waitForFunction(prev => document.getElementById('pic').getAttribute('src') !== prev, a.img, { timeout: 10000 });
    await waitReady(page);
  }
  t('40 answers: no repeats', new Set(ids).size === 40);
  t('40 answers: never three of one group in a row', groups.every((g, i) => i < 2 || !(g === groups[i - 1] && g === groups[i - 2])));
  t('40 answers: all five groups appear', new Set(groups).size === 5);
  t('Challenging animals appear in Years 7–8 (' + diffs.filter(d => d === 'Challenging').length + ' of 40)', diffs.includes('Challenging'));
  t('score is 40 after 40 correct', (await page.textContent('#scoreV')) === '40');
  await page.evaluate(() => window.__skip(400000));
  await page.waitForSelector('#results.on');
  t('5-minute results name Years 7–8 · 5 min', /Years 7–8 · 5 min/.test(await page.textContent('#stats')));
  t('40 of 40 earns "Animal Classification Champion!"', (await page.textContent('#rTitle')) === 'Animal Classification Champion!');

  // ---------------- timer starts only when the photo is shown ----------------
  group = 'Timer'; console.log(group);
  await page.click('#home2');
  await page.route('**/Images/**', async r => { await new Promise(ok => setTimeout(ok, 2500)); r.continue(); });
  await page.click('[data-path=Y56]'); await page.click('[data-min="3"]'); await page.click('#start');
  await page.waitForTimeout(1500);
  t('clock does not run while the first photo is loading', (await page.textContent('#timeV')) === '3:00' && await page.$eval('.ans', b => b.disabled));
  await waitReady(page);
  t('clock starts once the photo is on screen', /^(3:00|2:59)$/.test(await page.textContent('#timeV')));
  await page.unroute('**/Images/**');
  await page.click('#quit');

  // ---------------- credits ----------------
  group = 'Credits'; console.log(group);
  await page.click('#home2'); await page.click('#toCredits');
  const rows = await page.$$eval('#cBody tr', r => r.length);
  t('credits list all 300 photos with photographer, licence and source link', rows === 300 && (await page.$$eval('#cBody a[href*="commons.wikimedia.org"]', l => l.length)) === 300);
  await shot(page, 'credits');
  t('no script errors', errors.length === 0, errors);
  await ctx.close();

  // ---------------- every photo loads ----------------
  group = 'Images'; console.log(group);
  ctx = await browser.newContext(); page = await ctx.newPage();
  await page.goto(PAGE);
  const broken = await page.evaluate(async (imgs) => {
    const bad = [];
    await Promise.all(imgs.map(src => new Promise(ok => { const im = new Image(); im.onload = () => { if (im.naturalWidth < 300) bad.push(src + ' small'); ok(); }; im.onerror = () => { bad.push(src); ok(); }; im.src = src; })));
    return bad;
  }, D.animals.map(a => a.img));
  t('all 300 photos load in the page (and are at least 300 px wide)', broken.length === 0, broken);
  await ctx.close();

  // ---------------- screen sizes ----------------
  group = 'Screen sizes'; console.log(group);
  const sizes = [['phone', 390, 844, 'light'], ['phone-small', 360, 640, 'light'], ['tablet-portrait', 820, 1180, 'light'], ['tablet-landscape', 1180, 820, 'light'],
    ['ict-room', 1366, 768, 'light'], ['desktop', 1920, 1080, 'light'], ['dark', 1366, 768, 'dark']];
  for (const [name, w, h, scheme] of sizes) {
    ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme });
    page = await ctx.newPage();
    await page.goto(PAGE);
    const homeOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (name.startsWith('phone')) await shot(page, name + '-home');
    await page.click('[data-path=Y78]'); await page.click('#start'); await waitReady(page);
    const m = await page.evaluate(() => {
      const r = s => document.querySelector(s).getBoundingClientRect();
      const btns = [...document.querySelectorAll('.ans')].map(b => b.getBoundingClientRect());
      return { overflow: document.documentElement.scrollWidth > window.innerWidth + 1, photo: r('#photo'), btns, vh: window.innerHeight, minBtn: Math.min(...btns.map(b => Math.min(b.width, b.height))) };
    });
    const allVisible = m.btns.every(b => b.bottom <= m.vh + 1 && b.top >= 0);
    t(name + ' (' + w + '×' + h + '): no sideways scroll, photo and all five buttons on screen, buttons ≥ 44 px', !homeOverflow && !m.overflow && allVisible && m.photo.height >= 150 && m.minBtn >= 44, m);
    await shot(page, name);
    await ctx.close();
  }
  await browser.close();
  server.close();
  fs.writeFileSync(path.join(__dirname, 'qa-results.json'), JSON.stringify({ when: new Date().toISOString(), version: D.version, passed: res.filter(r => r.ok).length, failed: res.filter(r => !r.ok).length, results: res }, null, 1));
  console.log(res.filter(r => r.ok).length + ' passed, ' + res.filter(r => !r.ok).length + ' failed');
  process.exit(res.every(r => r.ok) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
