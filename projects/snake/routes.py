from pathlib import Path

from flask import Blueprint, current_app, jsonify, render_template, request

# ① 建立 Blueprint：名字叫 "snake"，所有路由自動掛在 /projects/snake 底下
snake_bp = Blueprint("snake", __name__, url_prefix="/projects/snake")


def _data_file() -> Path:
    """回傳 highscore 檔案路徑（相對於 Snake Blueprint 自己的資料夾）。"""
    path = Path(snake_bp.root_path) / "data" / "highscore.txt"
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def load_highscore() -> int:
    path = _data_file()
    if not path.exists():
        path.write_text("0", encoding="utf-8")
        return 0
    try:
        return int(path.read_text(encoding="utf-8").strip())
    except ValueError:
        # 檔案被亂改或寫壞時，歸零而不是整站崩潰
        path.write_text("0", encoding="utf-8")
        return 0


def save_highscore(score: int) -> None:
    _data_file().write_text(str(score), encoding="utf-8")


# ② 注意路徑是 "/"，實際 URL 會是 /projects/snake/
@snake_bp.route("/")
def index():
    return render_template("projects/snake/index.html", highscore=load_highscore())


@snake_bp.route("/submit_score", methods=["POST"])
def submit_score():
    # ③ 用 get_json(silent=True) 而非 request.json，前端送錯格式時不會直接 500
    data = request.get_json(silent=True) or {}
    try:
        score = int(data.get("score", 0))
    except (TypeError, ValueError):
        return jsonify({"error": "invalid score"}), 400

    if score < 0:
        return jsonify({"error": "invalid score"}), 400

    high = load_highscore()
    if score > high:
        save_highscore(score)
        high = score

    return jsonify({"highscore": high})