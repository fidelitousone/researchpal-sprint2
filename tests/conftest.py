import uuid

import pytest

from app import AuthType, Projects, Sources, Users


# pylint: disable = redefined-outer-name
@pytest.fixture(scope="session")
def app():
    from app import app  # pylint: disable = import-outside-toplevel

    return app


@pytest.fixture(scope="session")
def client(app):
    app.config["TESTING"] = True
    app.config["PRESERVE_CONTEXT_ON_EXCEPTION"] = False

    return app.test_client()


@pytest.fixture(scope="session")
def socketio_client(app, client):
    from app import socketio  # pylint: disable = import-outside-toplevel

    return socketio.test_client(app, flask_test_client=client)


@pytest.fixture(scope="session")
def _db(app):  # pylint: disable = invalid-name
    from app import db  # pylint: disable = import-outside-toplevel

    with app.app_context():
        yield db
        db.drop_all()  # This fixes a weird DetachedInstanceError with pytest-flask-sqlalchemy


@pytest.fixture
def mocked_uuid(mocker):
    mock_uuid = mocker.patch.object(uuid, "uuid4", autospec=True)
    mock_uuid.return_value = uuid.UUID(hex="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
    return mock_uuid


@pytest.fixture
def mocked_user_model(mocked_uuid):
    mocked_uuid = mocked_uuid()
    return Users(
        "fake@e.mail",
        str(mocked_uuid),
        "A Name",
        AuthType.GOOGLE,
        "link",
    )


@pytest.fixture
def mocked_project_model(mocked_uuid):
    mocked_uuid = mocked_uuid()
    return Projects(
        str(mocked_uuid),
        str(mocked_uuid),
        "Test",
        [],
    )


@pytest.fixture
def mocked_source_model(mocked_uuid):
    mocked_uuid = mocked_uuid()
    return Sources(str(mocked_uuid), "link")


@pytest.fixture
def mocked_project_request():
    mocked_request = {"project_name": "Test"}
    return mocked_request
