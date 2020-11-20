import uuid

from flask import render_template, request, session

from server import create_app, run_app, db, socketio
from server.models import AuthType, Users, Projects, Sources, Citations


# pylint: disable = no-member
def emit_projects(owner_id):
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
            "citation_type": project.citation_type,
        }
        for project in user_projects
    }
    socketio.emit("all_projects", response, room=request.sid)


def add_new_user(email, user_id, user_name, auth_type, profile_picture):
    with app.app_context():
        user_info = db.session.query(Users).filter(Users.email == email).first()
        if not user_info:
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
    socketio.emit("login_response", user_info, room=request.sid)


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
        socketio.emit("user_info", user_info, room=request.sid)
        emit_projects(user_info["user_id"])
    else:
        print("not logged in")


@socketio.on("create_project")
def on_create_project(data):
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
        emit_projects(owner_id)
    else:
        print("not logged in")


@socketio.on("add_source_to_project")
def add_source(data):
    name = data["project_name"]
    source_link = data["source_link"]
    source_ids = uuid.uuid4()
    with app.app_context():
        new_source = Sources(source_ids, source_link, None, None, None, None, None, None)
        db.session.add(new_source)
        db.session.commit()
        
    with app.app_context():
        project_info = (
            db.session.query(Projects).filter(Projects.project_name == name).first()
        )
        
        project_info.sources = list(project_info.sources)
        
        sources = project_info.sources
        
        source_map = {}
        
        print(sources)
        for source in sources:
            source_info = ( 
                db.session.query(Sources).filter(Sources.source_id == source).one().json()
            )
            source_map[source] = source_info["url"]
        
        source_map[str(source_ids)] = source_link
        
        print("MAP:", source_map)
        
        #print("New source: ", source_link, "with id: ", source_ids)
        project_info.sources = list(project_info.sources)
        project_info.sources.append(source_ids)
        db.session.merge(project_info)
        db.session.commit()
        project_info = (
            db.session.query(Projects)
            .filter(Projects.project_name == name)
            .first()
            .json()
        )
        
        
        
        print(project_info)
    socketio.emit("all_sources_server", {
        "source_list": project_info["sources"],
        "source_map": source_map
    }, room=request.sid)


@socketio.on("get_all_sources")
def get_all_sources(data):
    name = data["project_name"]
    with app.app_context():
        project_info = (
            db.session.query(Projects)
            .filter(Projects.project_name == name)
            .first()
        )
    
    sources = project_info.sources
    print(sources)
    
    source_map = {}
    
    for source in sources:
        print(source)
        with app.app_context():
            source_info = ( 
                db.session.query(Sources).filter(Sources.source_id == source).one().json()
            )
        source_map[source] = source_info["url"]
        
    socketio.emit("all_sources", {
        "source_list": sources,
        "source_map": source_map
    }, room=request.sid)


@socketio.on("select_project")
def on_select_project(data):
    project_name = data["project_name"]
    session["selected_project"] = project_name

@socketio.on("delete_source")
def on_delete_source(data):
    source_id = data["source_id"]
    email = session.get("user")
    project_name = data["project_name"]
    
    with app.app_context():    
        #db.session.delete(Sources).where()
        #DELETE PROJECT
        user_info = (
            db.session.query(Users)
            .filter(Users.email == email)
            .one()
            .json()
        )
        owner_id = user_info["user_id"]
        
        ## DELETE FROM PROJECT ARRAY
        project_info = (
            db.session.query(Projects).filter(Projects.owner_id == owner_id, Projects.project_name == project_name).one()
        )
        project_info.sources = list(project_info.sources)
        project_info.sources.remove(source_id)
        db.session.merge(project_info)
        db.session.commit()
        
        #db.session.delete(Citations).where(Citations.project_id == project_id)
        Citations.query.filter(Citations.source_id == source_id).delete()
        print("DELETE citations for ", source_id)
        db.session.commit()
        
      
        #db.session.delete(Sources).where(Sources.source.id in sources)
        ## CHECK SOURCE_ID IN SOURCES
        Sources.query.filter(Sources.source_id == source_id).delete()
        print("DELETE sources for ", source_id)
        db.session.commit()
        
        with app.app_context():
            project_info = (
                db.session.query(Projects)
                .filter(Projects.project_name == project_name)
                .first()
                .json()
            )
        
        with app.app_context():
            project_info = (
                db.session.query(Projects)
                .filter(Projects.project_name == project_name)
                .first()
            )
        
        sources = project_info.sources
        print(sources)
        
        source_map = {}
        
        for source in sources:
            print(source)
            with app.app_context():
                source_info = ( 
                    db.session.query(Sources).filter(Sources.source_id == source).one().json()
                )
            source_map[source] = source_info["url"]
            
        socketio.emit("all_sources_server", {
            "source_list": sources,
            "source_map": source_map
        }, room=request.sid)
    

@socketio.on("delete_project")
def on_delete_project(data):
    name = data["project_name"]
    email = session.get("user")
    print("IN DELETE PROJECT")
    
    with app.app_context():    
        #db.session.delete(Sources).where()
        #DELETE PROJECT
        project_info = (
            db.session.query(Projects)
            .filter(Users.email == email, Projects.project_name == name)
            .one()
            .json()
        )
        project_id = project_info["project_id"]
        #db.session.delete(Citations).where(Citations.project_id == project_id)
        Citations.query.filter(Citations.project_id == project_id).delete()
        print("DELETE citations for ", project_info["project_name"])
        db.session.commit()
        
      
        project_info = (
            db.session.query(Projects)
            .filter(Users.email == email, Projects.project_name == name)
            .one()
            .json()
        )
        sources = project_info["sources"]
        print(sources)
        #db.session.delete(Sources).where(Sources.source.id in sources)
        ## FIX SOURCE_ID IN SOURCES
        for source in sources:
            Sources.query.filter(Sources.source_id == source).delete()
            print("DELETE source ", source, " for ", project_info["project_name"])
            db.session.commit()
    
    
        
        project_info = (
            db.session.query(Projects)
            .filter(Users.email == email, Projects.project_name == name)
            .one()
            .json()
        )
        project_id = project_info["project_id"]
        # db.session.delete(Projects).where(Projects.project_id == project_id)
        Projects.query.filter(Projects.project_id == project_id).delete()
        print("DELETE project: ", project_info["project_name"])
        db.session.commit()
    
        user_info = ( db.session.query(Users).filter(Users.email == email).first().json() )
        print(user_info["user_id"])
        emit_projects(user_info["user_id"])

@socketio.on("request_selected_project")
def on_request_project():
    if "user" in session:
        socketio.emit(
            "give_project_name", {"project_name": session.get("selected_project")}
        )


@app.route("/")
@app.route("/home")
@app.route("/project")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    run_app(app)
