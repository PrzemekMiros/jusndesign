const assert = require('node:assert/strict');
const base = process.argv[2];
if (!base) throw new Error('Usage: node scripts/verify-aeo.cjs https://your-origin');

async function check(path, accept, type) {
  const response = await fetch(new URL(path, base), { headers: { Accept: accept }, signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  assert.ok(response.headers.get('content-type')?.startsWith(type), `${path}: expected ${type}`);
  return response;
}

(async () => {
  for (const home of ['/', '/en/']) {
    for (const [accept, type] of [
      ['text/html', 'text/html'],
      ['*/*', 'text/html'],
      ['text/markdown', 'text/markdown'],
      ['text/markdown;q=0, text/html;q=1', 'text/html'],
      ['text/markdown;q=0.2, text/html;q=1', 'text/html'],
      ['text/markdown;q=1, text/html;q=0.1', 'text/markdown'],
    ]) {
      const response = await check(home, accept, type);
      assert.match(response.headers.get('vary') || '', /\bAccept\b/i);
      assert.match(response.headers.get('link') || '', /llms\.txt/);
      const body = await response.text();
      assert.ok(body.length > 100);
      if (type === 'text/markdown') {
        assert.match(body, /^#{1,6} /m);
        assert.doesNotMatch(body, /<!doctype|<script/i);
      }
    }
    await check(`${home}index.md`, '*/*', 'text/markdown');
  }
  await check('/llms.txt', '*/*', 'text/plain');
  const sitemap = await check('/sitemap.xml', '*/*', 'application/xml');
  assert.match(await sitemap.text(), /<urlset/);
  const robots = await check('/robots.txt', '*/*', 'text/plain');
  assert.match(await robots.text(), /Content-Signal: search=yes, ai-input=yes, ai-train=no/);
  console.log('AEO HTTP checks passed. Re-run the external AEO scan.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
