const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { toMarkdown } = require('./build-discovery.cjs');

const sample = toMarkdown('<main><h1>Hello<br>World</h1><a href="/oferta/">Offer</a><script>secret()</script></main>', 'https://jusndesigneurope.com/');
assert.match(sample, /# Hello World/);
assert.match(sample, /\[Offer\]\(https:\/\/jusndesigneurope.com\/oferta\/\)/);
assert.doesNotMatch(sample, /secret/);
for (const directory of ['public', 'public/en']) {
  const markdown = fs.readFileSync(path.join(directory, 'index.md'), 'utf8');
  assert.ok(markdown.length > 1000);
  assert.match(markdown, /^# /m);
  assert.doesNotMatch(markdown, /<script|<svg|<!doctype/i);
  for (const match of markdown.matchAll(/\]\((https:\/\/jusndesigneurope\.com\/[^)]*)\)/g)) {
    const pathname = decodeURIComponent(new URL(match[1]).pathname);
    const target = path.join('public', pathname, pathname.endsWith('/') ? 'index.html' : '');
    assert.ok(fs.existsSync(target), `Broken generated link: ${match[1]}`);
  }
  assert.match(fs.readFileSync(path.join(directory, 'index.var'), 'utf8'), /text\/markdown/);
}
assert.equal(fs.readFileSync('public/.htaccess', 'utf8'), fs.readFileSync('src/.htaccess', 'utf8'));
assert.match(fs.readFileSync('public/robots.txt', 'utf8'), /Content-Signal: search=yes, ai-input=yes, ai-train=no/);
assert.ok(fs.existsSync('public/llms.txt'));
console.log('Discovery artifact checks passed. Apache HTTP verification is still required after deployment.');
