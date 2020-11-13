import uuid

from flask import render_template, session
from flask_socketio import join_room

from server import create_app, run_app, db, socketio
from server.models import AuthType, Users, Projects, Sources


def emit_projects(email, owner_id):
    with app.app_context():
        user_projects = (
            db.session.query(Projects).filter(Projects.owner_id == owner_id).all()
        )
    response = {
        project.project_id: {
            "project_id": project.project_id,
            "owner_id": project.owner_id,
            "project_name": project.project_name,
            "sources": project.sources,
        }
        for project in user_projects
    }
    socketio.emit("all_projects", response, room=email)


def add_new_user(email, user_id, user_name, auth_type, profile_picture):
    with app.app_context():
        user_info = db.session.query(Users).filter(Users.email == email).first()
        if user_info:
            print("user exists")
        else:
            new_user = Users(email, user_id, user_name, auth_type, profile_picture)
            db.session.add(new_user)
            db.session.commit()


# Setup Flask app and create tables
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
        user_name = profile["name"]
        profile_picture = profile["imageUrl"]
        user_id = uuid.uuid4()
        auth_type = AuthType.GOOGLE

        add_new_user(email, user_id, user_name, auth_type, profile_picture)
    except KeyError:
        print("invalid user object")


@socketio.on("new_facebook_user")
def on_new_facebook_user(data):
    try:
        profile = data["response"]
        email = profile["email"]
        user_name = profile["name"]
        profile_picture = profile["picture"]["data"]["url"]
        user_id = uuid.uuid4()
        auth_type = AuthType.FACEBOOK

        print(email)
        add_new_user(email, user_id, user_name, auth_type, profile_picture)
    except KeyError:
        print("invalid user object")


@socketio.on("new_microsoft_user")
def on_new_microsoft_user(data):
    try:
        profile = data["response"]["account"]
        email = profile["userName"]
        user_name = profile["name"]
        try:
            profile_picture = profile["imageUrl"]
        except KeyError:
            profile_picture = None
        user_id = uuid.uuid4()
        auth_type = AuthType.MICROSOFT

        add_new_user(email, user_id, user_name, auth_type, profile_picture)
    except KeyError:
        print("invalid user object")


@socketio.on("login_request")
def on_login_request(data):
    email = data["email"]
    print("login_request:", email)
    with app.app_context():
        user_info = db.session.query(Users).filter(Users.email == email).one().json()
    session["user"] = email
    join_room(email)
    socketio.emit("login_response", user_info, room=email)


@socketio.on("logout")
def on_logout():
    email = session.get("user")
    if email:
        socketio.close_room(email)
        session.pop("user")
        print("logout:", email)
    else:
        print("logout:", "not logged in")


@socketio.on("request_user_info")
def on_request_user_info():
    email = session.get("user")
    print("request_user_info:", email)
    if email:
        with app.app_context():
            user_info = (
                db.session.query(Users).filter(Users.email == email).one().json()
            )
        socketio.emit("user_info", user_info, room=email)
        emit_projects(email, user_info["user_id"])
    else:
        print("not logged in")


@socketio.on("create_project")
def on_new_project(data):
    email = session.get("user")
    print("create_project:", email)
    if email:
        with app.app_context():
            user_info = (
                db.session.query(Users).filter(Users.email == email).one().json()
            )
        owner_id = user_info["user_id"]
        project_id = uuid.uuid4()
        project_name = data["project_name"]
        sources = []
        with app.app_context():
            new_project = Projects(project_id, owner_id, project_name, sources)
            db.session.add(new_project)
            db.session.commit()
        emit_projects(email, owner_id)
    else:
        print("not logged in")


@socketio.on("select_project")
def on_select_project(data):
    project_name = data["project_name"]
    session["selected_project"] = project_name

@socketio.on("request_selected_project")
def on_request_project():
    socketio.emit(
        "give_project_name",
        {
            "project_name": session.get("selected_project")
        }
    )

@app.route("/")
@app.route("/home")
@app.route("/project")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    run_app(app)
