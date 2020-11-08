from flask import render_template

from server import create_app, run_app, db, socketio
# TODO: import database models here from server.models


# Setup Flask app
STATIC_FOLDER = "../static"
TEMPLATE_FOLDER = "../templates"
app = create_app(STATIC_FOLDER, TEMPLATE_FOLDER)
with app.app_context():
    db.create_all()
    db.session.commit()

@socketio.on("new_google_user")
def on_new_username(data):
    print(data["response"]["profileObj"])

@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    run_app(app)
