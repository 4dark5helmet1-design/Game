// Базовая регрессия: игра поднимается, копает, уезжает в штрек и обратно.
// Гонять ПЕРЕД КАЖДЫМ коммитом. Запуск:
//   NODE_PATH=/opt/node22/lib/node_modules node tools/tests/regression.js [файл]
const { chromium } = require('playwright');
const path = require('path');
const file = process.argv[2] || path.resolve(__dirname, '../../docs/demo.html');

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 900, height: 700 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + file);
  await p.evaluate(() => localStorage.clear());
  await p.reload();
  await p.waitForTimeout(2800);

  const fail = await p.evaluate(() => document.getElementById('fail').textContent);
  console.log('ошибка запуска:', fail || 'нет');

  await p.locator('#gl').scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  await p.click('#gl');
  await p.mouse.down(); await p.waitForTimeout(6000); await p.mouse.up();
  await p.keyboard.press('KeyE'); await p.waitForTimeout(4500);
  console.log('штрек открылся:', await p.evaluate(() => document.getElementById('hub').classList.contains('on')));

  await p.evaluate(() => document.getElementById('hubgo').click());
  await p.waitForTimeout(4500);
  console.log('вернулись в забой:', await p.evaluate(() => !document.getElementById('hub').classList.contains('on')));

  const fps = await p.evaluate(() => new Promise(r => {
    let c = 0; const t0 = performance.now();
    const f = () => { c++; performance.now() - t0 < 4000 ? requestAnimationFrame(f) : r(c / 4); };
    requestAnimationFrame(f);
  }));
  console.log('fps на SwiftShader:', fps.toFixed(1), '(1-4 это норма, тут нет видеокарты)');
  console.log('ОШИБКИ СТРАНИЦЫ:', errs.length ? errs.join(' | ') : 'нет');
  await b.close();
  process.exit(errs.length || fail ? 1 : 0);
})();
