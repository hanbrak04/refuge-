const {test} = require('node:test');
const assert = require('node:assert/strict');
const {classer,profils,animaux}=require('./moteur');
test('Famille Martin : Bouba en tête, Rex et Mia à revoir',()=>{
 const r=classer(profils.famille);
 assert.equal(r[0].nom,'Bouba');
 assert.match(r[0].risques.join(),/8 h/);
 assert.match(r.find(x=>x.nom==='Rex').alertes.join(),/solitude/);
 assert.match(r.find(x=>x.nom==='Mia').alertes.join(),/enfants/);
});
test('M. Petit : Mia en tête, les cinq animaux et des scores bornés',()=>{
 const r=classer(profils.retraite);
 assert.equal(r[0].nom,'Mia');
 assert.deepEqual(r.map(x=>x.nom).sort(),animaux.map(x=>x.nom).sort());
 assert.ok(r.every(x=>x.score>=0&&x.score<=100&&x.raisons.length));
});
test('Un profil incomplet ou une absence impossible est refusé',()=>{
 for(const absence of ['',25,-1,'NaN']) assert.throws(()=>classer({...profils.famille,absence}),TypeError);
});
test('Alerte enfants toujours visible, et profil à risque jamais prioritaire',()=>{
 const r=classer({...profils.famille,absence:'0'});
 assert.ok(r.at(-1).alertes.length);
 assert.equal(r.find(x=>x.nom==='Mia').alertes.length,1);
 assert.ok(r.slice(0,3).every(x=>!x.alertes.length));
});

test('Le classement utilise le catalogue modifié sans changer les fiches initiales',()=>{
 const modifie=animaux.map(a=>a.nom==='Bouba'?{...a,nom:'Bouba test',seul:false}:a);
 const r=classer(profils.famille,modifie);
 assert.equal(r.length,5);
 assert.equal(r[0].nom,'Pixel');
 assert.match(r.find(a=>a.nom==='Bouba test').alertes.join(),/solitude/);
 assert.equal(classer(profils.famille)[0].nom,'Bouba');
});

test('Privilégie un long séjour compatible, sans compenser une alerte',()=>{
 const d='2026-11-26';
 const b=animaux.find(a=>a.nom==='Bouba'), r=animaux.find(a=>a.nom==='Rex');
 const fiches=[{...b,nom:'Long séjour',arrivee:'2026-04-15'},{...b,nom:'Arrivée',arrivee:d},{...r,arrivee:'2025-01-01'}];
 const c=classer(profils.famille,fiches,d);
 assert.deepEqual(c.map(a=>a.nom),['Long séjour','Arrivée','Rex']);
 assert.deepEqual(c.map(a=>a.bonus),[10,0,0]);
 assert.ok(c[2].alertes.length);
});
test('Dates inconnues, futures et non valides : aucun bonus',()=>{
 const b=animaux.find(a=>a.nom==='Bouba');
 const d='2026-11-26';
 const c=classer(profils.famille,[b,{...b,arrivee:'2026-11-27'},{...b,arrivee:'2026-02-30'}],d);
 assert.ok(c.every(x=>x.bonus===0&&x.anciennete===null));
});
test('Le classement traite les 60 nouvelles fiches sans masquer les cinq anciennes',()=>{
 const d='2026-11-26', b=animaux.find(a=>a.nom==='Bouba');
 const fiches=[...animaux.map(a=>({...a,arrivee:'2026-05-01'})),...Array.from({length:60},(_,i)=>({...b,nom:'Nouvel arrivant '+(i+1),arrivee:d}))];
 const c=classer(profils.famille,fiches,d);
 assert.equal(c.length,65);assert.equal(c[0].nom,'Bouba');assert.ok(c.filter(a=>a.nom.startsWith('Nouvel')).every(a=>a.bonus===0));
});
