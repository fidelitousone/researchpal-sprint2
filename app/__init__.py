import os

from dotenv import load_dotenv
from flask import Flask, render_template, request
from flask_socketio import SocketIO

from database import db


# Environment variables
load_dotenv()
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8080"))
DATABASE_URL = os.getenv("DATABASE_URL", None)

# Setup Flask app
STATIC_FOLDER = "../static"
TEMPLATE_FOLDER = "../templates"
app = Flask(__name__, static_folder=STATIC_FOLDER, template_folder=TEMPLATE_FOLDER)

# Setup SocketIO
socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

# Setup SQLAlchemy and database tables
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
with app.app_context():
    db.create_all()
    db.session.commit()


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    socketio.run(app, host=HOST, port=PORT)
