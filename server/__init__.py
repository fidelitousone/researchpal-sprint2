import os

from dotenv import load_dotenv
from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy


# Environment variables
load_dotenv()
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8080"))
DATABASE_URL = os.getenv("DATABASE_URL", None)

# Flask app extensions
socketio = SocketIO()
db = SQLAlchemy()


def create_app(
    static_folder: str = "static", template_folder: str = "templates"
) -> Flask:
    app = Flask(__name__, static_folder=static_folder, template_folder=template_folder)
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    socketio.init_app(app, cors_allowed_origins="*")
    db.init_app(app)
    return app


def run_app(app: Flask) -> None:
    socketio.run(app, host=HOST, port=PORT)
