from flask import Blueprint, render_template

flashcard_bp = Blueprint("flashcard", __name__, url_prefix="/projects/flashcard")


@flashcard_bp.route("/")
def index():
    return render_template("projects/flashcard/index.html")