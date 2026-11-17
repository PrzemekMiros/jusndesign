const fs=require('fs'),assert=require('assert/strict'),{parse}=require('node-html-parser');
const entries=JSON.parse(fs.readFileSync('.work-publish/inventory.json','utf8'));
const origin='https://jusndesigneurope.com';
(async()=>{
 const sitemapResponse=await fetch(origin+'/sitemap.xml',{signal:AbortSignal.timeout(30000)});
 assert(sitemapResponse.ok);const sitemap=await sitemapResponse.text();
 let verified=0;const errors=[];
 for(let i=0;i<entries.length;i+=4){
  await Promise.all(entries.slice(i,i+4).map(async item=>{
   try{
    const r=await fetch(origin+item.url,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);
    const doc=parse(await r.text());assert.equal(doc.querySelector('h1').text.trim(),item.title);
    assert.equal(doc.querySelector('.actions a').getAttribute('href'),item.lang==='en'?'/en/contact/':'/kontakt/');
    assert(sitemap.includes(origin+item.url));
    const image=await fetch(origin+item.image,{method:'HEAD',signal:AbortSignal.timeout(30000)});assert(image.ok);
    verified++;
   }catch(e){errors.push({url:item.url,error:e.message});}
  }));
 }
 console.log(JSON.stringify({verified,total:entries.length,errors}));
 if(errors.length)process.exitCode=1;
})();
