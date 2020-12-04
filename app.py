import logging
import sys
import uuid

import requests as python_requests
from flask import render_template, request, session

from server import create_app, run_app, db, socketio
from server.models import AuthType, Users, Projects, Sources, Citations


# Setup logging
FORMAT = "[%(asctime)s] [%(levelname)s] %(name)s::%(funcName)s: %(message)s"
DATEFMT = "%m-%d-%Y %I:%M:%S %p %Z"
logFormat = logging.Formatter(fmt=FORMAT, datefmt=DATEFMT)
logging.basicConfig(
    level=logging.DEBUG,
    format=FORMAT,
    datefmt=DATEFMT,
    filename="server_debug.log",
    filemode="w",
)
consoleLogger = logging.StreamHandler(sys.stdout)
consoleLogger.setFormatter(logFormat)
logging.getLogger().addHandler(consoleLogger)
log = logging.getLogger("app")

logging.getLogger("engineio").setLevel(logging.ERROR)
logging.getLogger("socketio").setLevel(logging.ERROR)
logging.getLogger("urllib3").setLevel(logging.ERROR)
logging.getLogger("werkzeug").setLevel(logging.ERROR)

# pylint: disable = no-member
def create_source_map(source_ids: list) -> dict:
    source_map = {}
    for source_id in source_ids:
        log.debug("Adding source with ID <%s> to source_map", source_id)
        with app.app_context():
            source_info = (
                db.session.query(Sources).filter(Sources.source_id == source_id).one()
            )
        source_map[source_id] = source_info.url
    return source_map


def emit_projects(owner_id: str) -> None:
    log.debug("Sending all projects created by user with ID <%s>", owner_id)
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
    log.debug("Sending these IDs via all_projects: %s", list(response.keys()))
    socketio.emit("all_projects", response, room=request.sid)


def add_new_user(
    email: str,
    user_id: str,
    user_name: str,
    auth_type: AuthType,
    profile_picture: str = None,
) -> None:
    with app.app_context():
        user_info = db.session.query(Users).filter(Users.email == email).first()
        if not user_info:
            log.info("New user added to database")
            new_user = Users(email, user_id, user_name, auth_type, profile_picture)
            db.session.add(new_user)
            db.session.commit()
        else:
            log.warning("User already found in database")


def get_source_info(source_id: str, url: str) -> bool:
    microlink_api = "https://api.microlink.io"
    request_url = "{}?url={}".format(microlink_api, url)

    log.info("Getting source information with url <%s>", url)
    response = python_requests.get(request_url)
    if response.status_code == 200:
        response = response.json()
        status = response["status"]
        if status == "success":
            data = response["data"]
            author = data["author"]
            date = data["date"]
            description = data["description"]
            if data["image"]:
                image = data["image"]["url"]
            else:
                image = None
            publisher = data["publisher"]
            title = data["title"]
            with app.app_context():
                log.info("Adding new source to database with ID <%s>", source_id)
                new_source = Sources(
                    source_id, url, author, date, description, image, publisher, title
                )
                db.session.add(new_source)
                db.session.commit()
            return True
        log.error("Microlink API responded with code: %s", response["code"])
        return False
    log.error("Microlink API request failed with HTTP %s", response.status_code)
    return False


def create_citation(source_id: str, project_id: str, project_name):
    with app.app_context():
        source_info = (
            db.session.query(Sources).filter(Sources.source_id == source_id).one()
        )

    if source_info.author:
        name = source_info.author.split(" ")
        if len(name) > 2:
            middle = name[1]
        else:
            middle = None
        last = name[-1]
        first = name[0]
        mla_name = last + ", " + first + ". "
        if middle:
            apa_name = last + ", " + first[0] + ". " + middle[0] + ". "
        else:
            apa_name = last + ", " + first[0] + ". "
    else:
        mla_name = ""
        apa_name = ""
        last = ""

    if source_info.title:
        title = source_info.title + " "
    else:
        title = ""

    if source_info.publisher:
        mla_publisher = source_info.publisher + ", "
    else:
        mla_publisher = ""

    if source_info.date:
        mla_date = source_info.date.strftime("%d %b. %Y") + ", "
        apa_date = "(" + source_info.date.strftime("%Y, %B %d") + "). "
    else:
        mla_date = ""
        apa_date = ""

    mla_citation = mla_name + title + mla_publisher + mla_date + source_info.url + "."
    if apa_name == "":
        apa_citation = title + apa_date + source_info.url + "."
    else:
        apa_citation = apa_name + apa_date + title + source_info.url + "."

    with app.app_context():
        log.info("Added new citation to project <%s>", project_name)
        new_citation = Citations(
            project_id, source_id, last, mla_citation, apa_citation
        )
        db.session.add(new_citation)
        db.session.commit()


# Setup Flask app and create tables
STATIC_URL_PATH = ""
PUBLIC_FOLDER = "../build"
app = create_app(STATIC_URL_PATH, PUBLIC_FOLDER, PUBLIC_FOLDER)
with app.app_context():
    db.create_all()
    db.session.commit()


@socketio.on("new_google_user")
def on_new_google_user(data):
    try:
        log.info("Attempting to add new user")
        profile = data["response"]["profileObj"]

        email = profile["email"]
        user_name = profile["name"]
        profile_picture = profile["imageUrl"]
        user_id = uuid.uuid4()
        auth_type = AuthType.GOOGLE

        add_new_user(email, user_id, user_name, auth_type, profile_picture)
    except KeyError:
        log.warning("Unknown JSON format received from client")


@socketio.on("new_facebook_user")
def on_new_facebook_user(data):
    try:
        log.info("Attempting to add new user")
        profile = data["response"]
        email = profile["email"]
        user_name = profile["name"]
        profile_picture = profile["picture"]["data"]["url"]
        user_id = uuid.uuid4()
        auth_type = AuthType.FACEBOOK

        print(email)
        add_new_user(email, user_id, user_name, auth_type, profile_picture)
    except KeyError:
        log.warning("Unknown JSON format received from client")


@socketio.on("new_microsoft_user")
def on_new_microsoft_user(data):
    try:
        log.info("Attempting to add new user")
        profile = data["response"]
        email = profile["userPrincipalName"]
        user_name = profile["displayName"]
        try:
            profile_picture = (
                "https://storage.live.com/Users/0x"
                + profile["id"]
                + "/MyProfile/ExpressionProfile/ProfilePhoto:Win8Static,UserTileMedium,UserTileStatic"
            )
        except KeyError:
            profile_picture = None
        user_id = uuid.uuid4()
        auth_type = AuthType.MICROSOFT

        add_new_user(email, user_id, user_name, auth_type, profile_picture)
    except KeyError:
        log.warning("Unknown JSON format received from client")


@socketio.on("login_request")
def on_login_request(data):
    email = data["email"]
    log.info("Logging in <%s>", email)
    with app.app_context():
        user_info = db.session.query(Users).filter(Users.email == email).one().json()
    session["user"] = email
    socketio.emit("login_response", user_info, room=request.sid)


@socketio.on("logout")
def on_logout():
    email = session.get("user")
    if email:
        session.pop("user")
        log.info("Logging out <%s>", email)
    else:
        log.warning("No login found")


@socketio.on("request_user_info")
def on_request_user_info():
    email = session.get("user")
    if email:
        log.info("Sending user info of <%s>", email)
        with app.app_context():
            user_info = (
                db.session.query(Users).filter(Users.email == email).one().json()
            )
        socketio.emit("user_info", user_info, room=request.sid)
        emit_projects(user_info["user_id"])
    else:
        log.warning("No login found")


@socketio.on("create_project")
def on_create_project(data):
    email = session.get("user")
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
        log.info("Creating new project for <%s> with name <%s>", email, project_name)
        emit_projects(owner_id)
    else:
        log.warning("No login found")


@socketio.on("add_source_to_project")
def add_source(data):
    email = session.get("user")
    project_name = data["project_name"]
    source_link = data["source_link"]
    source_id = str(uuid.uuid4())
    source_found = get_source_info(source_id, source_link)

    with app.app_context():
        user_info = db.session.query(Users).filter(Users.email == email).one()
        project_info = (
            db.session.query(Projects)
            .filter(
                Projects.owner_id == user_info.user_id,
                Projects.project_name == project_name,
            )
            .first()
        )
        log.debug("Before adding new source: %s", project_info.sources)

        source_map = create_source_map(project_info.sources)
        if source_found:
            log.info("Added new source to project <%s>", project_name)
            create_citation(source_id, project_info.project_id, project_name)
            source_map[source_id] = source_link
            project_info.sources = list(project_info.sources)
            project_info.sources.append(source_id)
            db.session.merge(project_info)
            db.session.commit()
        else:
            log.warning("Failed to add source to project <%s>", project_name)
            socketio.emit(
                "invalid_url",
                {"source_link": source_link},
                room=request.sid,
            )
        log.debug("After adding new source: %s", project_info.sources)

    socketio.emit(
        "all_sources_server",
        {"source_list": list(project_info.sources), "source_map": source_map},
        room=request.sid,
    )


@socketio.on("get_all_sources")
def get_all_sources(data):
    email = session.get("user")
    project_name = data["project_name"]
    with app.app_context():
        user_info = db.session.query(Users).filter(Users.email == email).one()
        project_info = (
            db.session.query(Projects)
            .filter(
                Projects.owner_id == user_info.user_id,
                Projects.project_name == project_name,
            )
            .first()
        )
    if project_info:
        log.info(
            "Getting source information for <%s> owned by <%s>", project_name, email
        )
        source_map = create_source_map(project_info.sources)
        socketio.emit(
            "all_sources",
            {"source_list": list(project_info.sources), "source_map": source_map},
            room=request.sid,
        )
    else:
        log.warning("No project named <%s> is owned by <%s>", project_name, email)


@socketio.on("get_all_citations")
def get_all_citations(data):
    email = session.get("user")
    project_name = data["project_name"]
    mla_citation_list = []
    apa_citation_list = []
    with app.app_context():
        user_info = db.session.query(Users).filter(Users.email == email).one()
        project_info = (
            db.session.query(Projects)
            .filter(
                Projects.owner_id == user_info.user_id,
                Projects.project_name == project_name,
            )
            .first()
        )
    if project_info:
        log.info("Getting citations for <%s> owned by <%s>", project_name, email)
        project_id = project_info.project_id
        with app.app_context():
            citations = (
                db.session.query(Citations)
                .filter(Citations.project_id == project_id)
                .order_by(Citations.author.asc())
                .all()
            )
            for c in citations:
                mla_citation_list.append(c.mla_citation)
                apa_citation_list.append(c.apa_citation)
            socketio.emit(
                "all_citations",
                {
                    "mla_citation_list": mla_citation_list,
                    "apa_citation_list": apa_citation_list,
                },
                room=request.sid,
            )
    else:
        log.warning("No project named <%s> is owned by <%s>", project_name, email)


@socketio.on("select_project")
def on_select_project(data):
    email = session.get("user")
    project_name = data["project_name"]

    session["selected_project"] = project_name
    log.info("Selecting project with name <%s> for <%s>", project_name, email)


@socketio.on("delete_source")
def on_delete_source(data):
    email = session.get("user")
    project_name = data["project_name"]
    source_id = data["source_id"]

    with app.app_context():
        user_info = db.session.query(Users).filter(Users.email == email).one()
        project_info = (
            db.session.query(Projects)
            .filter(
                Projects.owner_id == user_info.user_id,
                Projects.project_name == project_name,
            )
            .one()
        )

        project_info.sources = list(project_info.sources)
        project_info.sources.remove(source_id)
        db.session.merge(project_info)
        db.session.commit()
        log.debug("Source list after removing: <%s>", project_info.sources)

        Citations.query.filter(Citations.source_id == source_id).delete()
        log.debug("Deleting citation that matches the source ID <%s>", source_id)

        Sources.query.filter(Sources.source_id == source_id).delete()
        db.session.commit()
        log.info("Deleting source that matches the ID <%s>", source_id)

        source_map = create_source_map(project_info.sources)
        socketio.emit(
            "all_sources_server",
            {"source_list": list(project_info.sources), "source_map": source_map},
            room=request.sid,
        )


@socketio.on("delete_project")
def on_delete_project(data):
    email = session.get("user")
    project_name = data["project_name"]
    session["selected_project"] = project_name

    with app.app_context():
        user_info = db.session.query(Users).filter(Users.email == email).one()
        project_info = (
            db.session.query(Projects)
            .filter(
                Projects.owner_id == user_info.user_id,
                Projects.project_name == project_name,
            )
            .one()
        )

        Citations.query.filter(Citations.project_id == project_info.project_id).delete()
        log.debug(
            "Deleting all citations for project with ID <%s>", project_info.project_id
        )

        for source in project_info.sources:
            Sources.query.filter(Sources.source_id == source).delete()
        log.debug(
            "Deleting all sources for project with ID <%s>", project_info.project_id
        )

        Projects.query.filter(Projects.project_id == project_info.project_id).delete()
        db.session.commit()
        log.info(
            "Deleting project <%s> with ID <%s>",
            project_info.project_name,
            project_info.project_id,
        )
        session.pop("selected_project")
        log.debug("Session after popping: <%s>", session)

        user_info = db.session.query(Users).filter(Users.email == email).one()
        emit_projects(user_info.user_id)


@socketio.on("request_selected_project")
def on_request_project():
    if "user" in session:
        email = session.get("user")
        selected_project = session.get("selected_project")
        socketio.emit(
            "give_project_name", {"project_name": selected_project}, room=request.sid
        )
        log.info("Returning project name <%s> for <%s>", selected_project, email)
    else:
        log.warning("No login found")


@app.route("/")
@app.route("/login")
@app.route("/about")
@app.route("/pricing")
@app.route("/future")
@app.route("/home")
@app.route("/project")
@app.route("/bibliography")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    run_app(app)
