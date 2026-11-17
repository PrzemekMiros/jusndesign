const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const sharp = require('sharp');
const workspace = process.cwd();
const safe = p => {const resolved=path.resolve(p); if(!resolved.startsWith(workspace+path.sep)) throw new Error('Outside workspace'); return resolved;};
const drafts='src/content/products/drafts';
const files=fs.readdirSync(drafts).filter(f=>f.endsWith('.md'));
const inventory=[];
const notes=[];
const groups={
  'Systemy przechowywania ładunku':'Systemy przechowywania ładunku',
  'Pick up Truck Bed Organizer':'Systemy przechowywania ładunku',
  'Zabudowy do pickupów':'Zabudowy do pickupow',
  'Pickup Truck Canopies':'Zabudowy do pickupow',
  'Uchwyty na dach':'Uchwyty na dach','Grab Handles':'Uchwyty na dach',
  'Zderzaki przednie':'Zderzaki przednie','Front Bumpers':'Zderzaki przednie',
  'Akcesoria':'Akcesoria','Other Off Road Accessories':'Akcesoria'
};
const newDescriptions={
  'zabudowa-jd19':['Zabudowa paki JUSN JD19 do pickupa. Skontaktuj się z nami, aby dobrać wariant do swojego samochodu.','JUSN JD19 pickup canopy. Contact us to select a configuration for your vehicle.'],
  'zderzak-przedni-jd20':['Tłoczony zderzak przedni JUSN JD20 do pickupa. Dopasowanie i wyposażenie ustalamy indywidualnie.','JUSN JD20 stamped front bumper for pickup trucks. Fitment and equipment are confirmed individually.'],
  'zderzak-przedni-jd21':['Zderzak przedni JUSN JD21 do pickupa. Skontaktuj się z nami w sprawie wersji odpowiedniej do Twojego samochodu.','JUSN JD21 pickup front bumper. Contact us for the version suitable for your vehicle.'],
  'system-paki-jd16':['Wyposażenie paki JUSN JD16. Zapytaj o dostępne konfiguracje i dopasowanie do swojego pickupa.','JUSN JD16 truck bed equipment. Ask about available configurations and fitment for your pickup.'],
  'bagaznik-modulowy-jd11':['Modułowy bagażnik paki JUSN JD11. Zapytaj o dostępność i dobór wariantu do samochodu.','JUSN JD11 modular bed rack. Ask about availability and the configuration for your vehicle.'],
  'system-przechowywania-jd1':['Rodzina systemów przechowywania JUSN JD1 do paki pickupa. Pomożemy dobrać konfigurację do pojazdu i sposobu użytkowania.','JUSN JD1 pickup bed storage system range. Contact us to select a configuration for your vehicle and intended use.']
};
(async()=>{
 for(const file of files){
  const original=safe(path.join(drafts,file));const parsed=matter.read(original);const d=parsed.data;
  if(d.draft!==true)throw new Error('Unexpected published file '+file);
  const en=d.lang==='en',slug=file.replace(/(?:\.en)?\.md$/,'');
  const folder=slug.startsWith('basr-')?'BASR':groups[d.categories[0]];
  if(!folder)throw new Error('Unknown category '+file);
  const target=safe(path.join('src/content/products',folder,file));if(fs.existsSync(target))throw new Error('Existing file '+target);
  notes.push({file:target.replace(workspace+path.sep,'').replaceAll('\\','/'),title:d.title,notes:d.reviewNotes});
  if(d.draftImage){
   const source=safe(path.join(drafts,d.draftImage));const dest=safe(path.join('src/content/products/img',path.basename(d.draftImage)));
   if(!fs.existsSync(dest))fs.copyFileSync(source,dest);
   d.productImage='/content/products/img/'+path.basename(dest);
  }else{
   const model=(slug.match(/jd\d+/)||['JUSN'])[0].toUpperCase();
   const name=`${slug}-placeholder${en?'-en':''}.png`;
   const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="750"><rect width="1000" height="750" fill="#ecece8"/><text x="500" y="300" text-anchor="middle" font-family="Arial,sans-serif" font-size="38" fill="#62645f">JUSN DESIGN</text><text x="500" y="405" text-anchor="middle" font-family="Arial,sans-serif" font-size="100" font-weight="bold" fill="#262925">${model}</text><text x="500" y="500" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" fill="#62645f">${en?'Image coming soon':'Zdjęcie w przygotowaniu'}</text></svg>`;
   await sharp(Buffer.from(svg)).png().toFile(safe('src/content/products/img/'+name));
   d.productImage='/content/products/img/'+name;d.imagePending=true;
  }
  d.layout=d.publicationLayout;d.permalink=d.publicationPermalink;d.draft=false;d.inquiryOnly=true;
  d.categories=d.categories.map(c=>({'Akcesoria':'Inne akcesoria','Zderzaki przednie':'Inne akcesoria','Front Bumpers':'Other Off Road Accessories','Pickup Truck Canopies':'Pick up Canopy'}[c]||c));
  if(slug.startsWith('basr-'))d.categories=[en?'BASR Canopys':'Zabudowy BASR',...d.categories];
  let body=parsed.content.trim();
  if(newDescriptions[slug]){d.description=newDescriptions[slug][en?1:0];body=d.description;}
  body=body.replace(/\n(?:Źródło|Source): \[JUSN DESIGN\]\([^\n]*\)\.?\s*$/,'');
  body += en?'\n\n## Availability and fitment\n\nContact us for pricing, availability and the exact equipment included. Please provide your vehicle model, year and intended use so we can confirm compatibility.\n':'\n\n## Dostępność i dopasowanie\n\nZapytaj o cenę, dostępność i dokładne wyposażenie zestawu. Podaj model samochodu, rocznik oraz planowane zastosowanie, abyśmy mogli potwierdzić dopasowanie.\n';
  for(const k of ['publicationLayout','publicationPermalink','eleventyExcludeFromCollections','draftImage','novelty','reviewNotes'])delete d[k];
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,'---\n'+Object.entries(d).map(([k,v])=>k+': '+JSON.stringify(v)).join('\n')+'\n---\n\n'+body);
  inventory.push({file:target.replace(workspace+path.sep,'').replaceAll('\\','/'),url:(en?'/en':'')+d.permalink,title:d.title,image:d.productImage,lang:d.lang});
 }
 // Remove only the exact draft files and assets promoted above, within the verified workspace.
 for(const file of files)fs.unlinkSync(safe(path.join(drafts,file)));
 for(const file of fs.readdirSync(path.join(drafts,'assets')))fs.unlinkSync(safe(path.join(drafts,'assets',file)));
 fs.rmdirSync(safe(path.join(drafts,'assets')));fs.rmdirSync(safe(drafts));
 fs.writeFileSync('.work-publish/inventory.json',JSON.stringify(inventory,null,2));
 fs.writeFileSync('docs/uwagi-redakcyjne-produktow.md','# Uwagi redakcyjne do opublikowanych kart\n\nNa polecenie użytkownika wszystkie 22 pozycje otrzymały status publiczny. Niepotwierdzone szczegóły nie są deklarowane na stronie; cena i dostępność są ustalane w kontakcie.\n\n'+notes.filter(n=>!n.file.endsWith('.en.md')).map(n=>`## ${n.title}\n\n${n.notes}\n`).join('\n'));
 let report=fs.readFileSync('docs/nowe-produkty-jusn-2026-11-16.md','utf8');
 for(const item of inventory){const name=path.basename(item.file);report=report.replaceAll('../src/content/products/drafts/'+name,'../'+item.file);}
 report=report.replaceAll('../src/content/products/drafts/assets/','../src/content/products/img/');
 report='> Aktualizacja: użytkownik zlecił publikację wszystkich 22 pozycji. Karty przeniesiono do katalogu publicznego, a notatki redakcyjne do uwagi-redakcyjne-produktow.md. Poniżej zachowano historyczny raport utworzenia szkiców.\n\n'+report;
 fs.writeFileSync('docs/nowe-produkty-jusn-2026-11-16.md',report);
 console.log('Promoted '+inventory.length+' language pages.');
})();
