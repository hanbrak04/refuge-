const Refuge = (() => {
  const BASE = 90;          // score d'un animal sans aucun souci
  const BONUS_MAX = 10;     // bonus d'ancienneté maximal (+10 pts)
  const SEUIL_ABSENCE = 4;  // à partir de 4 h, la solitude compte
  const ABSENCE_LONGUE = 8; // au-delà, vigilance même si l'animal tolère

  // Données du dossier. jourDemo = nombre de jours au refuge (valeurs fictives)
  const animaux = [
    { nom: 'Rex',   espece: 'Chien',   sexe: 'inconnu', energie: 'forte',   seul: false, enfants: true,  jourDemo: 120, disponible: true },
    { nom: 'Mia',   espece: 'Chatte',  sexe: 'femelle', energie: 'faible',  seul: true,  enfants: false, jourDemo: 200, disponible: true },
    { nom: 'Bouba', espece: 'Chien',   sexe: 'inconnu', energie: 'moyenne', seul: true,  enfants: true,  jourDemo: 30,  disponible: true },
    { nom: 'Pixel', espece: 'Chat',    sexe: 'inconnu', energie: 'forte',   seul: true,  enfants: true,  jourDemo: 10,  disponible: true },
    { nom: 'Nala',  espece: 'Chienne', sexe: 'femelle', energie: 'faible',  seul: false, enfants: false, jourDemo: 150, disponible: true },
  ];

  // Candidats du dossier
  const profils = {
    famille:  { logement: 'jardin',      enfants: 'oui', absence: '8', experience: 'confirme' },
    retraite: { logement: 'appartement', enfants: 'non', absence: '1', experience: 'confirme' },
  };

  function dateLocale(d = new Date()) {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const j = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + j;
  }

  // Nombre de jours depuis la date d'arrivée ; null si vide, invalide ou dans le futur
  function joursAuRefuge(date) {
    if (!date) return null;
    const [y, m, j] = date.split('-').map(Number);
    const arrivee = new Date(y, m - 1, j);
    if (arrivee.getFullYear() !== y || arrivee.getMonth() !== m - 1 || arrivee.getDate() !== j) return null;
    const auj = new Date(); auj.setHours(0, 0, 0, 0);
    const diff = Math.round((auj - arrivee) / 86400000);
    return diff < 0 ? null : diff;
  }

  function classer(profil, liste) {
    const absence = Number(profil.absence);
    if (!['appartement', 'maison', 'jardin'].includes(profil.logement) ||
        !['oui', 'non'].includes(profil.enfants) ||
        !['debutant', 'confirme', 'inconnue'].includes(profil.experience) ||
        profil.absence === '' || profil.absence == null ||
        !Number.isFinite(absence) || absence < 0 || absence > 24) {
      throw new Error('Renseigne les quatre critères du candidat.');
    }

    const resultats = liste.map(a => {
      const chien = a.espece.startsWith('Chien');
      let score = BASE;
      const alertes = [], raisons = [], risques = [];

      // Enfants
      if (profil.enfants === 'oui') {
        if (a.enfants) raisons.push('Cohabite bien avec des enfants');
        else { score -= 40; alertes.push('Ne supporte pas les enfants, or il y en a au foyer'); }
      }

      // Solitude
      if (absence >= SEUIL_ABSENCE) {
        if (a.seul) {
          raisons.push('Tolère la solitude (absence de ' + absence + ' h)');
          if (absence > ABSENCE_LONGUE) { score -= 10; risques.push('Absence très longue : prévoir une solution de garde'); }
        } else {
          score -= 40;
          alertes.push('A besoin de présence, or le candidat est absent ' + absence + ' h par jour');
        }
      } else {
        raisons.push('Candidat très présent');
      }

      // Énergie, logement, expérience
      if (a.energie === 'forte') {
        if (chien && profil.logement === 'appartement') { score -= 15; risques.push('Chien très énergique en appartement : sorties longues nécessaires'); }
        else if (chien && profil.logement === 'maison') { score -= 10; risques.push('Chien très énergique sans jardin'); }
        else if (chien && profil.logement === 'jardin') raisons.push('Jardin adapté à un chien énergique');
        if (profil.experience === 'debutant') { score -= 10; risques.push('Animal exigeant pour une première adoption'); }
      } else if (a.energie === 'faible' && chien && profil.logement === 'appartement') {
        raisons.push('Énergie faible : adapté à un appartement');
      }

      // Ancienneté : bonus seulement si aucune alerte
      const anciennete = joursAuRefuge(a.arrivee);
      const bonus = (!alertes.length && anciennete !== null) ? Math.min(BONUS_MAX, Math.floor(anciennete / 20)) : 0;
      score = Math.max(0, Math.min(100, score + bonus));

      return { ...a, score, anciennete, bonus, alertes, raisons, risques };
    });

    return resultats.sort((x, y) => y.score - x.score || (y.anciennete ?? -1) - (x.anciennete ?? -1));
  }

  return { animaux, profils, classer, dateLocale, joursAuRefuge };
})();