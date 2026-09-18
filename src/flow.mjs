import { chromium } from 'playwright';
const file = 'file://' + process.cwd() + '/build/odds-field.html';
const browser = await chromium.launch();
for (const [w, h, tag] of [[390, 844, 'flow-mobile'], [1440, 900, 'flow-desktop']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(file, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  await page.fill('.bmslider__in', '25');
  await page.click('.bmgo');
  await page.waitForTimeout(1600);
  const st = await page.evaluate(() => ({
    sheetOpen: !!document.querySelector('.sheet.show'),
    legs: document.querySelectorAll('.sheet .bsrow, .sheet__body > *').length,
    sheetRect: (r => r ? { l: Math.round(r.left), w: Math.round(r.width) } : null)(document.querySelector('.sheet')?.getBoundingClientRect()),
    hSpill: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }));
  console.log(tag, JSON.stringify(st), errs.length ? 'ERR ' + errs.join(' | ') : 'clean');
  await page.screenshot({ path: `shots/${tag}.png` });
  await ctx.close();
}
await browser.close();
