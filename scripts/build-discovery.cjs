const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('node-html-parser');

const origin = 'https://jusndesigneurope.com';

function toMarkdown(html, url) {
  const document = parse(html);
  const main = document.querySelector('main');
  if (!main) throw new Error(`Missing main content: ${url}`);
  main.querySelectorAll('script, style, svg, noscript, button, form, [aria-hidden="true"]').forEach(node => node.remove());
  const render = node => {
    if (node.nodeType === 3) return node.text.replace(/\s+/g, ' ');
    const tag = (node.tagName || '').toLowerCase();
    const text = node.childNodes.map(render).join('');
    if (/^h[1-6]$/.test(tag)) return `\n\n${'#'.repeat(Number(tag[1]))} ${text.trim().replace(/\s+/g, ' ')}\n\n`;
    if (tag === 'a') {
      const href = node.getAttribute('href');
      if (href && text.trim() && /^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
        const label = text.trim().replace(/^#+\s*/, '').replace(/\s+/g, ' ');
        return `[${label}](${new URL(href, url).href})`;
      }
    }
    if (tag === 'li') return `\n- ${text.trim()}\n`;
    if (tag === 'br') return '\n';
    if (['p', 'section', 'div', 'ul', 'ol'].includes(tag)) return `\n\n${text.trim()}\n\n`;
    return text;
  };
  return `<!-- Source: ${url} -->\n\n${render(main).replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

function buildDiscovery(output = 'public') {
  for (const lang of ['', 'en']) {
    const directory = path.join(output, lang);
    const url = `${origin}/${lang ? `${lang}/` : ''}`;
    fs.writeFileSync(path.join(directory, 'index.md'), toMarkdown(fs.readFileSync(path.join(directory, 'index.html'), 'utf8'), url));
    fs.writeFileSync(path.join(directory, 'index.var'), 'URI: index.html\nContent-Type: text/html; charset=UTF-8; qs=1.0\n\nURI: index.md\nContent-Type: text/markdown; charset=UTF-8; qs=0.9\n');
  }
  fs.writeFileSync(path.join(output, 'llms.txt'), `# JUSN Design Europe

> Zabudowy i akcesoria do pickupów / Pickup canopies and accessories.

## Website
- [Polski](${origin}/index.md): Polish homepage in Markdown.
- [English](${origin}/en/index.md): English homepage in Markdown.
- [Oferta](${origin}/oferta/): Products and accessories.
- [Poradnik](${origin}/poradnik/): Guides.
- [Do pobrania](${origin}/do-pobrania/): Downloads and installation instructions.
- [Kontakt](${origin}/kontakt/): Contact the distributor to confirm compatibility and availability.
- [Sitemap](${origin}/sitemap.xml): Public page index.

## Access
Public content can be read without authentication. This website does not expose a public OAuth API, MCP server or A2A agent. Use the contact page for enquiries.
`);
}

module.exports = { buildDiscovery, toMarkdown };
