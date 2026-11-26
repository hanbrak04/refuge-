/* Règles de démonstration, à valider par le refuge. Aucun modèle entraîné. */
(function () {
  const animaux = Object.freeze([
    {nom:'Rex', jourDemo:160, espece:'Chien', energie:'forte', seul:false, enfants:true},
    {nom:'Mia', jourDemo:190, espece:'Chatte', energie:'faible', seul:true, enfants:false},
    {nom:'Bouba', jourDemo:95, espece:'Chien', energie:'moyenne', seul:true, enfants:true},
    {nom:'Pixel', jourDemo:25, espece:'Chat', energie:'forte', seul:true, enfants:true},
    {nom:'Nala', jourDemo:220, espece:'Chienne', energie:'faible', seul:false, enfants:false},
  ].map(Object.freeze));
  const profils = Object.freeze({
    famille:{logement:'jardin', enfants:'oui', absence:'8', experience:'inconnue'},
    retraite:{logement:'appartement', enfants:'non', absence:'1', experience:'inconnue'},
  });
  const jourMs=86400000;
  function dateLocale(d=new Date()) {
    return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  }
  function dateValide(iso) {
    if(typeof iso!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(iso))return false;
    const ms=Date.parse(iso+'T00:00:00Z');
    return Number.isFinite(ms)&&new Date(ms).toISOString().slice(0,10)===iso;
  }
  function joursAuRefuge(arrivee, aujourdHui=dateLocale()) {
    if(!dateValide(arrivee)||!dateValide(aujourdHui)||arrivee>aujourdHui)return null;
    return (Date.parse(aujourdHui)-Date.parse(arrivee))/jourMs;
  }
  function classer(p, catalogue = animaux, aujourdHui=dateLocale()) {
    if (!['appartement','maison','jardin'].includes(p.logement) ||
      !['oui','non'].includes(p.enfants) ||
      !['debutant','confirme','inconnue'].includes(p.experience) ||
      !/^\d+(\.\d+)?$/.test(String(p.absence)) || Number(p.absence)>24) {
      throw new TypeError('Complétez les quatre critères. L’absence doit être comprise entre 0 et 24 h.');
    }
    const h=Number(p.absence);
    return catalogue.map(a=>{
      let score=72;
      const raisons=[], risques=[], alertes=[];
      if(p.enfants==='oui') {
        if(a.enfants) {score+=8; raisons.push('Cohabitation avec des enfants indiquée');}
        else {score-=45; alertes.push('Cohabitation avec des enfants déconseillée');}
      }
      if(h>=4 && !a.seul) {
        score-=45; alertes.push('Tolère mal la solitude : '+h+' h d’absence déclarées');
      } else if(h>=6) {
        score-=9; risques.push('Confirmer la durée de solitude tolérée : '+h+' h prévues');
      } else if(h<=2) {
        score+=8; raisons.push('Présence quotidienne importante');
      }
      if(a.energie==='forte') {
        score-=8; risques.push('Besoin important d’activité et de stimulation');
        if(p.logement==='appartement') {
          score-=6; risques.push('En appartement, vérifier le plan d’activité avec le candidat');
        }
        if(p.experience==='debutant') {
          score-=8; risques.push('Prévoir un accompagnement pour une première adoption');
        }
      }
      if(a.energie==='faible' && p.enfants==='non') {
        score+=5; raisons.push('Animal calme, pas d’enfants déclarés');
      }
      if(!raisons.length) raisons.push('Pas de point favorable confirmé par les critères saisis');
      if(p.experience==='inconnue') risques.push('Expérience du candidat à préciser');
      const compatibilite=Math.min(100,Math.max(0,score));
      const anciennete=joursAuRefuge(a.arrivee,aujourdHui);
      const bonus=alertes.length||anciennete===null?0:Math.min(10,2*Math.floor(anciennete/30));
      const scoreFinal=Math.min(100,compatibilite+bonus);
      return {...a,score:scoreFinal,compatibilite,anciennete,bonus,raisons,risques,alertes};
    }).sort((a,b)=>Number(a.alertes.length>0)-Number(b.alertes.length>0)||
      b.score-a.score||(!a.alertes.length?((b.anciennete??-1)-(a.anciennete??-1)):0)||a.nom.localeCompare(b.nom,'fr'));
  }
  const api = {animaux,profils,classer,dateLocale,joursAuRefuge};
  if(typeof module!=='undefined') module.exports=api;
  else globalThis.Refuge=api;
})();
