# Refuge des Quatre Vents · Prototype d’aide à l’adoption

**[▶ Ouvrir la démo V5](https://refuge-quatre-vents-demo.vercel.app/)** · Données fictives, sans installation.

Pour utiliser le prototype hors ligne, extraire le dossier et ouvrir `index.html`. Aucun compte, serveur ni installation n’est nécessaire. La saisie libre n’est pas enregistrée ; les fiches et les profils fictifs enregistrés restent dans ce navigateur. Ne pas saisir d’informations personnelles.

## Démo (1 minute)

1. Sélectionner **Famille Martin** dans la liste : Bouba arrive en tête. Montrer la vigilance sur 8 h d’absence et les alertes de Rex (solitude), de Mia (enfants) et de Nala (les deux).
2. Sélectionner **M. Petit** dans la liste : dans la V5, Nala et Mia ont le même score, et Nala passe devant grâce à son séjour plus long. L’absence quotidienne de 1 h et l’absence d’enfants au foyer sont des hypothèses pour la démo ; modifier le profil si besoin.
3. Conclure : ce classement prépare la rencontre. Il ne décide ni d’approuver ni de refuser l’adoption.

Les cinq animaux sont les exemples fictifs du dossier. Le test dans le chat gratuit n’en utilise que trois : faire ce test séparément, coller son résultat réel et ne pas l’appeler un test du prototype.

## Logique et limites

Le moteur applique des règles explicables. Il pénalise fortement une incompatibilité connue avec les enfants et le besoin de présence non satisfait ; il fait passer les animaux signalés après les autres, sans les masquer. Il ajoute des vigilances selon l’absence prévue, l’énergie et le profil. Les seuils et pondérations ne sont pas validés par le refuge. Un score n’est pas une probabilité de réussite. L’âge, le nom et les coordonnées ne sont pas utilisés. Une capacité à rester seul n’implique pas une tolérance de 8 h. L’usage d’un appartement n’est jamais une exclusion automatique.

## Vérifier et déposer

- Lancer `node --test tests.cjs` si Node.js est installé.
- Dans votre dépôt GitHub de groupe, téléverser `index.html`, `moteur.js`, `tests.cjs` et `README.md` ensemble, après extraction. Ne téléverser aucune donnée réelle.
- Ouvrir `index.html`, sélectionner **Famille Martin**, prendre une capture du navigateur et l’ajouter à la diapo 4, avec le vrai lien du dépôt.

## V2 · Catalogue animaux

L’onglet **Animaux** liste les cinq fiches. **Modifier** ouvre le formulaire avec le nom, l’espèce, l’énergie, la tolérance à la solitude et la cohabitation avec des enfants. Après enregistrement, le classement déjà affiché se recalcule. Les fiches sont sauvegardées dans ce navigateur via localStorage, mais jamais les profils des candidats. Si le navigateur bloque le stockage (possible lors de l’ouverture d’un fichier local), les changements restent visibles pour la session. Aucun partage entre bénévoles ni serveur.

Intégration avec le Dev IA : l’interface passe les fiches courantes à `Refuge.classer(profil, catalogue)`. Sans second argument, le moteur utilise les fiches initiales. Les règles et le format de sortie sont inchangés.

## V3 · Candidats, animaux et compatibilités

- **Candidats** : lister, ajouter et modifier des profils fictifs avec un pseudonyme. Le bouton « Voir les compatibilités » charge le profil directement.
- **Animaux** : lister, ajouter ou modifier les fiches, avec une illustration par espèce.
- **Compatibilités** : sélectionner un profil existant lance le classement de tous les animaux actuels. La saisie libre n’est pas sauvegardée sans passer par « Ajouter un candidat ». Modifier le candidat sélectionné ou le catalogue met à jour le classement.
- Les deux listes sont locales au navigateur, sans serveur ni synchronisation. Ne saisir que des données de démonstration, sans identité réelle ni coordonnées. Les profils de V2 n’étaient pas enregistrés. Les fiches animaux V2 sont conservées si la démo est ouverte à la même adresse/origine avec le même navigateur.
- Filtres d’espèce (chiens, chats) et de disponibilité dans **Animaux** et **Compatibilités**. Le matching exclut les indisponibles par défaut. Toutes les fiches initiales sont supposées disponibles pour la démo ; le statut se règle sur chaque fiche.

## V4 · Comparaison groupée et icônes

Dans Compatibilités, **Comparer tous les candidats** calcule un classement indépendant pour chaque profil enregistré, avec les filtres d’espèce et de disponibilité actifs. La première liste est ouverte, les autres se déplient. Un même animal peut convenir à plusieurs candidats : aucune adoption ni attribution n’est effectuée. Le mode individuel reste accessible via le sélecteur ou le bouton de classement.

Sur les cartes et les résultats, 🐶 ou 🐱 indique l’espèce, et ♀ ou ♂ indique le sexe s’il est renseigné. Le sexe se modifie indépendamment de l’espèce et n’influence pas le score. Les anciennes mentions « Chienne » et « Chatte » sont reprises comme « Chien + Femelle » et « Chat + Femelle » ; les autres fiches sans sexe restent non renseignées.

## V4.1
Les quatre champs obligatoires de la recherche en saisie libre sont signalés par un astérisque.

## V5 · 60 nouvelles arrivées et priorité d’ancienneté

La nouvelle contrainte est l’arrivée de 60 animaux suite à la fermeture d’une fourrière. Chaque fiche a une date d’arrivée dans le refuge, que l’on peut saisir ou modifier. La démo comporte cinq fiches avec des dates fictives ; le test de charge utilise 60 nouvelles fiches synthétiques et vérifie que les 65 restent classables. Les vraies fiches n’ont pas été inventées ni importées.

Le score de compatibilité reste la base. Pour un animal sans alerte, ajouter 2 points par tranche complète de 30 jours, jusqu’à +10. À score final égal entre animaux sans alerte, le séjour le plus long passe d’abord. Une date manquante ne donne pas de bonus, et les animaux avec alertes restent après les autres. Le score total est plafonné à 100. L’équipe du refuge valide la rencontre, pas l’outil.

Pour intégrer le front dans le code du groupe, le champ de fiche est `arrivee` (AAAA-MM-JJ) et le moteur renvoie en plus `compatibilite`, `anciennete` et `bonus`. Le simulateur local ne change pas les dossiers du refuge.
