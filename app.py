import uuid
from flask import render_template, session


from server import create_app, run_app, db, socketio
from server.models import AuthType, Users, Projects, Sources


def new_google_user(profile):
    user_name = profile["name"]
    email = profile["email"]
    profile_picture = profile["imageUrl"]
    auth_type = AuthType.GOOGLE
    user_id = uuid.uuid4()
    with app.app_context():
        new_user = Users(email, user_id, user_name, auth_type, profile_picture)
        db.session.add(new_user)
        db.session.commit()


def new_facebook_user(profile):
    user_name = profile["name"]
    try:
        email = profile["email"]
    except KeyError:
        email = None
    profile_picture = profile["picture"]["data"]["url"]
    auth_type = AuthType.FACEBOOK
    user_id = uuid.uuid4()
    with app.app_context():
        new_user = Users(email, user_id, user_name, auth_type, profile_picture)
        db.session.add(new_user)
        db.session.commit()


def new_microsoft_user(profile):
    user_name = profile["name"]
    email = profile["userName"]
    try:
        profile_picture = profile["imageUrl"]
    except KeyError:
        profile_picture = None
    auth_type = AuthType.MICROSOFT
    user_id = uuid.uuid4()
    with app.app_context():
        new_user = Users(email, user_id, user_name, auth_type, profile_picture)
        db.session.add(new_user)
        db.session.commit()


# Setup Flask app
STATIC_FOLDER = "../static"
TEMPLATE_FOLDER = "../templates"
app = create_app(STATIC_FOLDER, TEMPLATE_FOLDER)
with app.app_context():
    db.create_all()
    db.session.commit()


@socketio.on("new_google_user")
def on_new_google_user(data):
    try:
        profile = data["response"]["profileObj"]
        new_google_user(profile)
    except KeyError:
        print("invalid user object")


@socketio.on("new_facebook_user")
def on_new_facebook_user(data):
    try:
        profile = data["response"]
        new_facebook_user(profile)
    except KeyError:
        print("invalid user object")


@socketio.on("new_microsoft_user")
def on_new_microsoft_user(data):
    try:
        profile = data["response"]["account"]
        new_microsoft_user(profile)
    except KeyError:
        print("invalid user object")


@socketio.on("login_request")
def on_login_request(data):
    user_id = data["user_id"]

    with app.app_context():
        user_info = db.session.query(Users).filter(Users.user_id == user_id).one()

    socketio.emit("login_response", user_info.json())


@app.route("/")
@app.route("/home")
@app.route("/project")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    run_app(app)
