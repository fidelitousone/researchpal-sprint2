import os

from dotenv import load_dotenv
from flask import Flask
from flask_session import Session
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy


# Environment variables
load_dotenv()
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8080"))
DATABASE_URL = os.getenv("DATABASE_URL", None)
SECRET_KEY = os.getenv("SECRET_KEY", None)

# Flask app extensions
session = Session()
socketio = SocketIO()
db = SQLAlchemy(session_options={"expire_on_commit": False})


def create_app(
    static_url_path: str = None,
    static_folder: str = "static",
    template_folder: str = "templates",
) -> Flask:
    app = Flask(
        __name__,
        static_url_path=static_url_path,
        static_folder=static_folder,
        template_folder=template_folder,
    )
    app.config["SECRET_KEY"] = SECRET_KEY
    app.config["SESSION_PERMANENT"] = True
    app.config["SESSION_TYPE"] = "sqlalchemy"
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    socketio.init_app(app, cors_allowed_origins="*", manage_session=False)
    db.init_app(app)
    app.config["SESSION_SQLALCHEMY"] = db
    session.init_app(app)
    return app


def run_app(app: Flask) -> None:
    socketio.run(app, host=HOST, port=PORT)
