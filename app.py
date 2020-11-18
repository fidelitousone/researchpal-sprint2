import uuid
import re
import json
import requests as python_requests
from flask import render_template, request, session

from server import create_app, run_app, db, socketio
from server.models import AuthType, Users, Projects, Sources


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


def get_new_citation(url):
    if re.match(regex, url) is not None:
        # response=python_requests.get(url)
        # ---Sample of a successful response with null values
        responseNull = """{
           "status":"success",
           "data":{
              "title":"10.1.1.83.5248.pdf",
              "description":null,
              "lang":"es",
              "author":null,
              "publisher":"cogprints.org",
              "image":null,
              "date":"2018-01-17T16:03:57.000Z",
              "url":"http://cogprints.org/7150/1/10.1.1.83.5248.pdf",
              "logo":{
                 "url":"http://cogprints.org/favicon.ico",
                 "type":"ico",
                 "size":2238,
                 "height":32,
                 "width":32,
                 "size_pretty":"2.24 kB"
              }
           }
        }"""
        # ---Sample of a successful response with no null values
        responseFull = """{
               "status":"success",
               "data":{
                  "title":"Ethics of AI: how should we treat rational, sentient robots â€“ if they existed?",
                  "description":"In the future, consciously aware robots could be part of our everyday world, deserving of moral respect and consideration.",
                  "lang":"en",
                  "author":"Hugh McLachlan",
                  "publisher":"The Conversation",
                  "image":{
                     "url":"https://images.theconversation.com/files/279424/original/file-20190613-32327-1vzyd0q.png?ixlib=rb-1.1.0&q=45&auto=format&w=1356&h=668&fit=crop",
                     "type":"png",
                     "size":1349603,
                     "height":668,
                     "width":1356,
                     "size_pretty":"1.35 MB"
                  },
                  "date":"2020-09-16T11:42:58.000Z",
                  "url":"http://theconversation.com/ethics-of-ai-how-should-we-treat-rational-sentient-robots-if-they-existed-118647",
                  "logo":{
                     "url":"https://logo.clearbit.com/theconversation.com",
                     "type":"png",
                     "size":7483,
                     "height":128,
                     "width":128,
                     "size_pretty":"7.48 kB"
                  }
               }
            }"""
        # ---Sample of a fail response
        responseFail = """{
               "status":"fail",
               "data":{
                  "url":"The URL `no` is not valid. Ensure it has protocol, hostname and is reachable."
               },
               "code":"EINVALURL",
               "more":"https://microlink.io/einvalurl",
               "report":"mailto:hello@microlink.io?subject=%5Bmicrolink%5D%20Request%20failed&body=Hello%2C%20The%20following%20API%20request%20wasn't%20processed%20properly%3A%0A%0A%20%20-%20request%20id%20%20%3A%20bAC1aDoYaFvOw4wwo2pLE%0A%20%20-%20request%20uri%20%3A%20https%3A%2F%2F138.197.58.27%3A80%2F%3Furl%3Dno%0A%20%20-%20error%20code%20%20%3A%20EINVALURL%20(https%3A%2F%2Fmicrolink.io%2Feinvalurl).%0A%0ACan%20you%20take%20a%20look%3F%20Thanks!%0A",
               "message":"The request has been not processed. See the errors above to know why."
            }"""
        response = responseFull
        status = json.loads(response)["status"]
        if status != "fail":
            data = json.loads(response)["data"]
            source_id = uuid.uuid4()
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
                new_Source = Sources(
                    source_id, url, author, date, description, image, publisher, title
                )
                db.session.add(new_Source)
                db.session.commit()
        else:
            print(response)
    else:
        print("invalid url")


# Setup Flask app and create tables
STATIC_FOLDER = "../static"
TEMPLATE_FOLDER = "../templates"
app = create_app(STATIC_FOLDER, TEMPLATE_FOLDER)
with app.app_context():
    db.create_all()
    db.session.commit()

regex = re.compile(
    r"^(?:http|ftp)s?://"  # http:// or https://
    r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|"  # domain...
    r"localhost|"  # localhost...
    r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"  # ...or ip
    r"(?::\d+)?"  # optional port
    r"(?:/?|[/?]\S+)$",
    re.IGNORECASE,
)


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
    get_new_citation(source_link)
    with app.app_context():
        project_info = (
            db.session.query(Projects).filter(Projects.project_name == name).first()
        )
        project_info.sources = list(project_info.sources)
        project_info.sources.append(source_link)
        db.session.merge(project_info)
        db.session.commit()
        project_info = (
            db.session.query(Projects)
            .filter(Projects.project_name == name)
            .first()
            .json()
        )
        print(project_info)
    socketio.emit("all_sources", project_info, room=request.sid)


@socketio.on("get_all_sources")
def get_all_sources(data):
    name = data["project_name"]
    with app.app_context():
        project_info = (
            db.session.query(Projects)
            .filter(Projects.project_name == name)
            .first()
            .json()
        )
    socketio.emit("all_sources", project_info, room=request.sid)


@socketio.on("select_project")
def on_select_project(data):
    project_name = data["project_name"]
    session["selected_project"] = project_name


@socketio.on("request_selected_project")
def on_request_project():
    socketio.emit(
        "give_project_name", {"project_name": session.get("selected_project")}
    )


@app.route("/")
@app.route("/home")
@app.route("/project")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    get_new_citation(
        "https://theconversation.com/ethics-of-ai-how-should-we-treat-rational-sentient-robots-if-they-existed-118647"
    )
    run_app(app)
