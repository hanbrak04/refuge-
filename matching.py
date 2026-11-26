BASE = 90           # score d'un animal sans aucun souci
BONUS_MAX = 10      # bonus d'ancienneté maximal (+10 pts)
SEUIL_ABSENCE = 4   # à partir de 4 h, la solitude compte
ABSENCE_LONGUE = 8  # au-delà, vigilance même si l'animal tolère

ANIMAUX = [
    {
        "nom": "Rex",
        "espece": "Chien",
        "sexe": "inconnu",
        "energie": "forte",
        "seul": False,
        "enfants": True,
        "jourDemo": 120,
        "disponible": True,
    },
    {
        "nom": "Mia",
        "espece": "Chatte",
        "sexe": "femelle",
        "energie": "faible",
        "seul": True,
        "enfants": False,
        "jourDemo": 200,
        "disponible": True,
    },
    {
        "nom": "Bouba",
        "espece": "Chien",
        "sexe": "inconnu",
        "energie": "moyenne",
        "seul": True,
        "enfants": True,
        "jourDemo": 30,
        "disponible": True,
    },
    {
        "nom": "Pixel",
        "espece": "Chat",
        "sexe": "inconnu",
        "energie": "forte",
        "seul": True,
        "enfants": True,
        "jourDemo": 10,
        "disponible": True,
    },
    {
        "nom": "Nala",
        "espece": "Chienne",
        "sexe": "femelle",
        "energie": "faible",
        "seul": False,
        "enfants": False,
        "jourDemo": 150,
        "disponible": True,
    },
]


def recommander(candidat, liste=None):
    """Classe les animaux selon le profil candidat."""
    if liste is None:
        liste = ANIMAUX

    logement = candidat.get("logement", "appartement")

    enfants_raw = candidat.get("enfants", "non")
    if isinstance(enfants_raw, bool):
        enfants = enfants_raw
    else:
        enfants = str(enfants_raw).lower() in ("oui", "true", "1", "on")

    absence_raw = candidat.get("absence", candidat.get("absence_heures", 0))
    try:
        absence = float(absence_raw)
    except (TypeError, ValueError):
        absence = 0

    experience = candidat.get("experience", "inconnue")
    if isinstance(experience, bool):
        experience = "confirme" if experience else "debutant"

    resultats = []

    for animal in liste:
        if not animal.get("disponible", True):
            continue

        espece = animal.get("espece", "")
        chien = espece.startswith("Chien")
        score = BASE
        alertes = []
        raisons = []
        risques = []

        # Enfants
        if enfants:
            if animal.get("enfants"):
                raisons.append("Cohabite bien avec des enfants")
            else:
                score -= 40
                alertes.append("Ne supporte pas les enfants, or il y en a au foyer")

        # Solitude
        if absence >= SEUIL_ABSENCE:
            if animal.get("seul"):
                raisons.append(f"Tolère la solitude (absence de {absence:g} h)")
                if absence > ABSENCE_LONGUE:
                    score -= 10
                    risques.append("Absence très longue : prévoir une solution de garde")
            else:
                score -= 40
                alertes.append(f"A besoin de présence, or le candidat est absent {absence:g} h par jour")
        else:
            raisons.append("Candidat très présent")

        # Énergie, logement, expérience
        energie = animal.get("energie")
        if energie == "forte":
            if chien and logement == "appartement":
                score -= 15
                risques.append("Chien très énergique en appartement : sorties longues nécessaires")
            elif chien and logement == "maison":
                score -= 10
                risques.append("Chien très énergique sans jardin")
            elif chien and logement == "jardin":
                raisons.append("Jardin adapté à un chien énergique")

            if experience == "debutant":
                score -= 10
                risques.append("Animal exigeant pour une première adoption")
        elif energie == "faible" and chien and logement == "appartement":
            raisons.append("Énergie faible : adapté à un appartement")

        # Ancienneté (bonus uniquement s'il n'y a aucune alerte)
        anciennete = animal.get("jourDemo")
        bonus = (
            min(BONUS_MAX, int(anciennete) // 20)
            if (not alertes and isinstance(anciennete, (int, float)) and anciennete >= 0)
            else 0
        )

        score_final = max(0, min(100, int(score + bonus)))

        resultats.append({
            **animal,
            "score": score_final,
            "anciennete": anciennete,
            "bonus": bonus,
            "alertes": alertes,
            "raisons": raisons,
            "risques": risques,
        })

    resultats.sort(
        key=lambda x: (x["score"], x["anciennete"] if isinstance(x["anciennete"], (int, float)) else -1),
        reverse=True,
    )
    return resultats