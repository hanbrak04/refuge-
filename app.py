from flask import Flask, render_template, request
from matching import recommander

app = Flask(__name__)


def lire_entier(valeur, defaut=0):
    try:
        return int(valeur)
    except (TypeError, ValueError):
        return defaut


@app.route("/", methods=["GET", "POST"])
def index():
    # Candidat par défaut pour afficher une recommandation dès l'ouverture
    candidat = {
        "logement": "appartement",
        "enfants": "non",
        "absence": 2,
        "experience": "confirme",
    }

    if request.method == "POST":
        candidat = {
            "logement": request.form.get("logement", "appartement"),
            "enfants": request.form.get("enfants", "non"),
            "absence": lire_entier(request.form.get("absence")),
            "experience": request.form.get("experience", "inconnue"),
        }

    resultats = recommander(candidat)
    return render_template("index.html", candidat=candidat, resultats=resultats)


if __name__ == "__main__":
    app.run(debug=True)