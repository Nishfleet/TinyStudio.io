import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
});
const pages = ['/', '/audit', '/pricing', '/specimen', '/agents', '/brief-requested'];
const out = [];
for (const path of pages) {
  const page = await context.newPage();
  const cons = [];
  const failed = [];
  const resp = [];
  page.on('console', m => { if (m.type()==='error') cons.push(m.text()); });
  page.on('requestfailed', r => failed.push({url:r.url(), err:r.failure()?.errorText}));
  page.on('response', r => {
    const u = r.url();
    if (u.includes('cdn-cgi/rum') || u.includes('gtag') || u.includes('favicon')) resp.push({url:u, status:r.status()});
  });
  await page.goto('https://tinystudio.io'+path, { waitUntil: 'networkidle', timeout: 45000 });
  const metrics = await page.evaluate(() => {
    const box = (el) => {
      const r = el.getBoundingClientRect();
      return {text:(el.innerText||el.value||'').trim().slice(0,50), w:Math.round(r.width), h:Math.round(r.height)};
    };
    return {
      title: document.title,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      canonical: document.querySelector('link[rel=canonical]')?.href || null,
      ld: document.querySelectorAll('script[type="application/ld+json"]').length,
      navLinks: [...document.querySelectorAll('nav a, header a')].map(box),
      buttons: [...document.querySelectorAll('button, a.button, .button, [type=submit], .cta')].map(box).slice(0,8)
    };
  });
  out.push({path, cons, failed: failed.slice(0,8), resp, ...metrics});
  await page.close();
}
console.log(JSON.stringify(out, null, 2));
await browser.close();
