from enum import Enum

from server import db


class AuthType(Enum):
    GOOGLE = "google"
    FACEBOOK = "facebook"
    MICROSOFT = "microsoft"


class Users(db.Model):
    email = db.Column(db.String(128), primary_key=True)
    user_id = db.Column(db.String(36))
    user_name = db.Column(db.Text)
    auth_type = db.Column(db.String(32))
    profile_picture = db.Column(db.Text, nullable=True)

    def __init__(  # pylint: disable=too-many-arguments
        self,
        email: str,
        user_id: str,
        user_name: str,
        auth_type: AuthType,
        profile_picture: str = None,
    ):
        self.email = email
        self.user_id = user_id
        self.user_name = user_name
        self.auth_type = auth_type.value
        self.profile_picture = profile_picture

    def __repr__(self):
        return "User(email={}, user_id={}, user_name={}, auth_type={}, profile_picture={})".format(
            self.email,
            self.user_id,
            self.user_name,
            self.auth_type,
            self.profile_picture,
        )

    def json(self) -> dict:
        data = {
            "email": self.email,
            "user_id": self.user_id,
            "user_name": self.user_name,
            "auth_type": self.auth_type,
            "profile_picture": self.profile_picture,
        }
        return data


class Projects(db.Model):
    project_id = db.Column(db.String(36), primary_key=True)
    owner_id = db.Column(db.String(36))
    project_name = db.Column(db.Text)
    sources = db.Column(db.ARRAY(db.String))

    def __init__(
        self, project_id: str, owner_id: str, project_name: str, sources: list
    ):
        self.project_id = project_id
        self.owner_id = owner_id
        self.project_name = project_name
        self.sources = []
        self.sources.extend(sources)

    def __repr__(self):
        return (
            "Project(project_id={}, owner_id={}, project_name={}, sources={})".format(
                self.project_id,
                self.owner_id,
                self.project_name,
                self.sources,
            )
        )

    def json(self) -> dict:
        data = {
            "project_id": self.project_id,
            "owner_id": self.owner_id,
            "project_name": self.project_name,
            "sources": self.sources,
        }
        return data


class Sources(db.Model):  # pylint: disable = too-many-instance-attributes
    source_id = db.Column(db.String(36), primary_key=True)
    url = db.Column(db.Text, nullable=True)
    author = db.Column(db.Text, nullable=True)
    date = db.Column(db.DateTime, nullable=True)
    description = db.Column(db.Text, nullable=True)
    image = db.Column(db.Text, nullable=True)
    publisher = db.Column(db.Text, nullable=True)
    title = db.Column(db.Text, nullable=True)

    def __init__(  # pylint: disable=too-many-arguments
        self,
        source_id: str,
        url: str = None,
        author: str = None,
        date: str = None,
        description: str = None,
        image: str = None,
        publisher: str = None,
        title: str = None,
    ):
        self.source_id = source_id
        self.url = url
        self.author = author
        self.date = date
        self.description = description
        self.image = image
        self.publisher = publisher
        self.title = title

    def __repr__(self):
        return "Source(source_id={}, url={}, author={}, title={})".format(
            self.source_id,
            self.url,
            self.author,
            self.title,
        )

    def json(self) -> dict:
        data = {
            "source_id": self.source_id,
            "url": self.url,
            "author": self.author,
            "date": self.date,
            "description": self.description,
            "image": self.image,
            "publisher": self.publisher,
            "title": self.title,
        }
        return data
