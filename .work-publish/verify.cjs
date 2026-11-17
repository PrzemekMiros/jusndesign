const fs=require('fs'),path=require('path'),assert=require('assert/strict'),matter=require('gray-matter'),{parse}=require('node-html-parser');
const inventory=JSON.parse(fs.readFileSync('.work-publish/inventory.json','utf8'));
const root='.work-publish/build';
const sitemap=fs.readFileSync(root+'/sitemap.xml','utf8');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const categoryFiles=walk(root).filter(p=>p.endsWith('.html')&&fs.readFileSync(p,'utf8').includes('products-category'));
assert.equal(inventory.length,44);
for(const item of inventory){
 const d=matter.read(item.file).data;
 assert.equal(d.draft,false);assert(!d.eleventyExcludeFromCollections);assert.equal(d.price,null);
 const html=fs.readFileSync(path.join(root,item.url,'index.html'),'utf8'),doc=parse(html);
 assert.equal(doc.querySelector('h1').text.trim(),item.title);
 assert(sitemap.includes('https://jusndesigneurope.com'+item.url),'Missing sitemap entry '+item.url);
 assert(fs.existsSync(path.join(root,item.image)),'Missing image '+item.image);
 const action=doc.querySelector('.actions a');assert.equal(action.getAttribute('href'),item.lang==='en'?'/en/contact/':'/kontakt/');
 assert(action.text.includes(item.lang==='en'?'Request a quote':'Zapytaj o ofertę'));
 assert(!html.includes('reviewNotes'));assert(!html.includes('publicationLayout'));
 assert(categoryFiles.some(p=>fs.readFileSync(p,'utf8').includes('href="'+item.url+'"')),'Unlisted product '+item.url);
 for(const s of doc.querySelectorAll('script[type="application/ld+json"]')){const obj=JSON.parse(s.text);const flat=JSON.stringify(obj);assert(!flat.includes('"price":"null"'));}
}
assert(!fs.existsSync('src/content/products/drafts'));
console.log('PASS: all 44 pages render, appear in categories and sitemap, have images and working inquiry links.');
