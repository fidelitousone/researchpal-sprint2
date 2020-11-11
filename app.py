from flask import render_template

from server import create_app, run_app, db, socketio
from server.models import AuthType, Users, Projects, Sources


# Setup Flask app
STATIC_FOLDER = "../static"
TEMPLATE_FOLDER = "../templates"
app = create_app(STATIC_FOLDER, TEMPLATE_FOLDER)
with app.app_context():
    db.create_all()
    db.session.commit()


@socketio.on("new_google_user")
def on_new_google_user(data):
    print(data["response"]["profileObj"])


@socketio.on("new_microsoft_user")
def on_new_microsoft_user(data):
    print(data["response"]["account"]["name"])
    print(data["response"]["account"]["userName"])


@socketio.on("new_facebook_user")
def on_new_facebook_user(data):
    print(data["response"]["name"])
    print(data["response"]["picture"]["data"]["url"])


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login")
def login():
    pass


if __name__ == "__main__":
    run_app(app)
