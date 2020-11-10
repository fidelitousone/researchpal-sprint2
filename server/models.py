from enum import Enum

from server import db


class AuthType(Enum):
    GOOGLE = "google"
    FACEBOOK = "facebook"
    MICROSOFT = "microsoft"


class Users(db.Model):
    user_id = db.Column(db.String(36), primary_key=True)
    user_name = db.Column(db.Text)
    auth_type = db.Column(db.String(32))
    email = db.Column(db.String(128), nullable=True)
    profile_picture = db.Column(db.Text, nullable=True)

    def __init__(  # pylint: disable=too-many-arguments
        self,
        user_id: str,
        user_name: str,
        auth_type: AuthType,
        email: str=None,
        profile_picture: str=None,
    ):
        self.user_id = user_id
        self.user_name = user_name
        self.auth_type = auth_type.value
        self.email = email
        self.profile_picture = profile_picture

    def __repr__(self):
        return "User(user_id={}, user_name={}, auth_type={}, email={}, profile_picture={})".format(
            self.user_id, self.user_name, self.auth_type, self.email, self.profile_picture,
        )

    def json(self) -> dict:
        data = {
            "user_id": self.user_id,
            "user_name": self.user_name,
            "auth_type": self.auth_type,
            "email": self.email,
            "profile_picture": self.profile_picture,
        }
        return data


class Projects(db.Model):
    project_id = db.Column(db.String(36), primary_key=True)
    owner_id = db.Column(db.String(36))
    project_name = db.Column(db.Text)
    sources = db.Column(db.ARRAY(db.String))

    def __init__(self, project_id: str, owner_id: str, project_name: str, sources: list):
        self.project_id = project_id
        self.owner_id = owner_id
        self.project_name = project_name
        self.sources = []
        self.sources.extend(sources)

    def __repr__(self):
        return "Project(project_id={}, owner_id={}, project_name={}, sources={}".format(
            self.project_id, self.owner_id, self.project_name, self.sources,
        )

    def json(self) -> dict:
        data = {
            "project_id": self.project_id,
            "owner_id": self.owner_id,
            "project_name": self.project_name,
            "sources": self.sources,
        }
        return data


class Sources(db.Model):
    pass
