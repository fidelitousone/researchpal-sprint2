from dataclasses import dataclass
from enum import Enum
from typing import List

from server import db


class AuthType(Enum):
    GOOGLE = "google"
    FACEBOOK = "facebook"
    MICROSOFT = "microsoft"


@dataclass
class Users(db.Model):
    user_id: str
    user_name: str
    auth_type: AuthType
    email: str = None
    profile_picture: str = None

    user_id = db.Column(db.String(36), primary_key=True)
    user_name = db.Column(db.Text)
    auth_type = db.Column(db.String(32))
    email = db.Column(db.String(128), nullable=True)
    profile_picture = db.Column(db.Text, nullable=True)


@dataclass
class Projects(db.Model):
    project_id: str
    owner_id: str
    project_name: str
    sources: List[str]

    project_id = db.Column(db.String(36), primary_key=True)
    owner_id = db.Column(db.String(36))
    project_name = db.Column(db.Text)
    sources = db.Column(db.ARRAY(db.String))

    def __post_init__(self):
        if self.sources:
            copied = []
            copied.extend(self.sources)
            self.sources = copied
        else:
            self.sources = []


@dataclass
class Sources(db.Model):  # pylint: disable = too-many-instance-attributes
    source_id: str
    url: str = None
    author: str = None
    date: str = None
    description: str = None
    image: str = None
    publisher: str = None
    title: str = None

    source_id = db.Column(db.String(36), primary_key=True)
    url = db.Column(db.Text, nullable=True)
    author = db.Column(db.Text, nullable=True)
    date = db.Column(db.DateTime, nullable=True)
    description = db.Column(db.Text, nullable=True)
    image = db.Column(db.Text, nullable=True)
    publisher = db.Column(db.Text, nullable=True)
    title = db.Column(db.Text, nullable=True)
