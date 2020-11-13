import uuid
from flask import render_template, session

from server import create_app, run_app, db, socketio, join_room
from server.models import AuthType, Users, Projects, Sources


def emit_projects(email,owner_id):
    with app.app_context():
        user_info = db.session.query(Projects).filter(Projects.owner_id == owner_id).all()
    response={}
    for x in user_info:
        response[x.project_id]={
            'project_id':x.project_id,
            'owner_id':x.owner_id,
            'project_name':x.project_name
        }
    socketio.emit('all_projects', response, room=email)


def new_google_user(profile):
    email = profile["email"]
    user_name = profile["name"]
    profile_picture = profile["imageUrl"]
    auth_type = AuthType.GOOGLE
    user_id = uuid.uuid4()
    with app.app_context():
        new_user = Users(email, user_id, user_name, auth_type, profile_picture)
        db.session.add(new_user)
        db.session.commit()


def new_facebook_user(profile):
    email = profile["email"]
    user_name = profile["name"]
    profile_picture = profile["picture"]["data"]["url"]
    auth_type = AuthType.FACEBOOK
    user_id = uuid.uuid4()
    with app.app_context():
        new_user = Users(email, user_id, user_name, auth_type, profile_picture)
        db.session.add(new_user)
        db.session.commit()


def new_microsoft_user(profile):
    email = profile["userName"]
    user_name = profile["name"]
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
app.config['SECRET_KEY'] = 'secret key'
app.config['SESSION_TYPE'] = 'memcache'

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
        email = profile["email"]
        print(email)
        with app.app_context():
            user_info = db.session.query(Users).filter(Users.email == email).first()
        if user_info:
            print("user exists")
        else:
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
    print(email, " from Facebook button")
    print("session set")
    session['user'] = email
    print("In login_request", session.get('user'))
    join_room(email);
    with app.app_context():
        user_info = db.session.query(Users).filter(Users.email == email).one().json()
    socketio.emit("login_response", user_info, room=email)

@socketio.on("logout")
def on_logout():
    if not session.get('user') is None:
        socketio.close_room(session.get('user'))

@socketio.on("request_user_info")
def on_request_user_data():
    print("In request_user_info", session.get('user'))
    if not session.get('user') is None:
        email = session.get('user')
        print('session:' + str(session.get('user')))
        with app.app_context():
            user_info = db.session.query(Users).filter(Users.email == email).one().json()
        socketio.emit("user_info", user_info, room=email)
        emit_projects(email,user_info['user_id'])
    else:
        print("not logged in")

@socketio.on("create_project")
def on_new_project(data):
    if not session.get('user') is None:
        email = session.get('user')
        with app.app_context():
            user_info = db.session.query(Users).filter(Users.email == email).one().json()
        owner_id=user_info['user_id']
        project_id = uuid.uuid4()
        project_name = data["project_name"]
        sources = []
        with app.app_context():
            new_project = Projects(project_id, owner_id, project_name, sources)
            db.session.add(new_project)
            db.session.commit()
        emit_projects(email,owner_id)
    else:
        print("not logged in")
        

@app.route("/")
@app.route("/home")
@app.route("/project")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    run_app(app)
