import logging
import os

from dotenv import load_dotenv
from flask import Flask, render_template, request
import requests

from projects.snake.routes import snake_bp
from projects.flashcard.routes import flashcard_bp
from projects.flight.routes import flight_bp

load_dotenv()
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
app.register_blueprint(snake_bp)
app.register_blueprint(flashcard_bp)
app.register_blueprint(flight_bp)

SHEETY_ENDPOINT = "https://api.sheety.co/d9b4a027842556a51be022c30ac92c1e/contact/工作表1"

POSTS_API_URL = os.environ.get("posts_api_url", "https://api.npoint.io/c790b4d5cab58020d391")


def get_posts():
    """Fetch blog posts from npoint; return an empty list on failure."""
    try:
        response = requests.get(POSTS_API_URL, timeout=10)
        response.raise_for_status()
        return response.json()
    except (requests.exceptions.RequestException, ValueError) as e:
        logging.error(f"讀取文章失敗: {e}")
        return []


def add_data_to_sheety(name, email, phone, message):
    headers = {}
    sheet_data = {
        "contact": {
            "name": name,
            "email": email,
            "phone": phone,
            "message": message
        }
    }

    try:
        response = requests.post(SHEETY_ENDPOINT, json=sheet_data, headers=headers, timeout=10)
        response.raise_for_status()
        logging.info("成功寫入 Sheety 試算表！")
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"寫入 Sheety 失敗: {e}")
        return None


@app.route('/')
def get_all_posts():
    return render_template("index.html", all_posts=get_posts())


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        phone = request.form.get("phone")
        message = request.form.get("message")
        add_data_to_sheety(name, email, phone, message)
        return render_template("contact.html", msg_sent=True)
    return render_template("contact.html", msg_sent=False)


@app.route("/post/<int:index>")
def show_post(index):
    requested_post = None
    for blog_post in get_posts():
        if blog_post.get("id") == index:
            requested_post = blog_post
    return render_template("post.html", post=requested_post)

#@app.route("/projects//snake")
#def snake():
#    return render_template("projects/snake/index.html")

#@app.route("/flight")
#def flight():
#    return render_template("flight.html")

#@app.route("/projects/flight")
#def flight():
#    return render_template("projects/flight/index.html")

#@app.route("/projects//flashcard")
#def flashcard():
#    return render_template("projects/flashcard/index.html")


if __name__ == "__main__":
    app.run(debug=True)
