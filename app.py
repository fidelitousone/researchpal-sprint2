import os
from os.path import join, dirname

from dotenv import load_dotenv
from flask import Flask, render_template, request
from flask_socketio import SocketIO

import flask_sqlalchemy
from sqlalchemy.exc import SQLAlchemyError


load_dotenv()

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8080"))

# Setup Flask app
app = Flask(__name__)
socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

DOTENV_PATH = join(dirname(__file__), "sql.env")
load_dotenv(DOTENV_PATH)

# Configure psql database
DATABASE_URI = os.environ["DATABASE_URL"]
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
DB = flask_sqlalchemy.SQLAlchemy(app)
DB.init_app(app)
DB.app = app

# Create a table
try:
    DB.session.execute(
        "CREATE TABLE users (email VARCHAR(255) PRIMARY KEY,username VARCHAR(255) NOT NULL);"
    )
    DB.session.commit()
    print("creating table:users")
except SQLAlchemyError:
    print("user table exists")
    

@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    socketio.run(app, host=HOST, port=PORT)
