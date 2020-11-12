import uuid
import json
from flask import render_template, session


from server import create_app, run_app, db, socketio
from server.models import AuthType, Users, Projects, Sources


def emit_projects(user_id):
    with app.app_context():
        user_info = db.session.query(Projects).filter(Projects.owner_id == user_id).all()
    response={}
    for x in user_info:
        response[x.project_id]={
            'project_id':x.project_id,
            'owner_id':x.owner_id,
            'project_name':x.project_name
        }
    print(response)
    socketio.emit('all_projects', response)


def new_google_user(profile):
    user_name = profile["name"]
    email = profile["email"]
    profile_picture = profile["imageUrl"]
    auth_type = AuthType.GOOGLE
    user_id = uuid.uuid4()
    with app.app_context():
        db.session.add(Users(user_id, user_name, auth_type, email, profile_picture))
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
        db.session.add(Users(user_id, user_name, auth_type, email, profile_picture))
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
        new_user = Users(user_id, user_name, auth_type, email, profile_picture)
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
        email = profile["email"]
        with app.app_context():
            user_info = db.session.query(Users).filter(Users.email == email).first()
        if user_info:
            print("user exists")
        else:
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
        email = profile["userName"]
        with app.app_context():
            user_info = db.session.query(Users).filter(Users.email == email).first()
        if user_info:
            print("user exists")
        else:
            new_microsoft_user(profile)
    except KeyError:
        print("invalid user object")


@socketio.on("login_request")
def on_login_request(data):
    email = data["email"]
    with app.app_context():
        user_info = db.session.query(Users).filter(Users.email == email).one().json()
    socketio.emit("login_response", user_info)
    


@socketio.on("create_project")
def on_new_project(data):
    project_id = uuid.uuid4()
    project_name = data["project_name"]
    owner_id="8aa7fcb2-8c5a-4c45-8336-d4eb8b8a03c4"#TODO get owner_id somehow
    sources = []
    with app.app_context():
        new_project = Projects(project_id, owner_id, project_name, sources)
        db.session.add(new_project)
        db.session.commit()
    emit_projects(owner_id)

@app.route("/")
@app.route("/home")
@app.route("/project")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    run_app(app)
