import { chromium } from 'playwright';
const file = 'file://' + process.cwd() + '/build/odds-field.html';
const browser = await chromium.launch();
const errs = [];
for (const [w, h, tag] of [[390, 844, 'mobile'], [768, 1024, 'tablet'], [1440, 900, 'desktop'], [360, 640, 'small'], [740, 400, 'landscape']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errs.push(`[${tag}] console: ${m.text()}`); });
  page.on('pageerror', e => errs.push(`[${tag}] pageerror: ${e.message}`));
  await page.goto(file, { waitUntil: 'load' });
  await page.waitForTimeout(900);
  const info = await page.evaluate(() => {
    const ph = document.querySelector('#app > .phone');
    const sc = document.querySelector('#app > .scroll, #app > .phone > .scroll');
    return {
      mounted: !!ph,
      icons: document.querySelectorAll('#app svg use').length,
      hSpill: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      phoneH: ph ? Math.round(ph.getBoundingClientRect().height) : 0,
      hasInput: !!document.querySelector('.bmslider__in'),
      hasGo: !!document.querySelector('.bmgo'),
      scrollable: sc ? sc.scrollHeight > sc.clientHeight : null,
    };
  });
  console.log(tag, w + 'x' + h, JSON.stringify(info));
  await page.screenshot({ path: `shots/${tag}.png`, fullPage: false });
  await ctx.close();
}
await browser.close();
console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no console/page errors');
