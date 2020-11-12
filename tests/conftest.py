import uuid

import pytest

from app import AuthType, Projects, Users


# pylint: disable = redefined-outer-name
@pytest.fixture(scope="module")
def app():
    from app import app  # pylint: disable = import-outside-toplevel

    yield app


@pytest.fixture()
def client(app):
    app.config["TESTING"] = True

    with app.test_client() as test_client:
        yield test_client


@pytest.fixture()
def socketio_client(app):
    from app import socketio  # pylint: disable = import-outside-toplevel

    yield socketio.test_client(app)


@pytest.fixture()
def db(app):
    from app import db  # pylint: disable = import-outside-toplevel

    with app.app_context():
        db.create_all()
        yield db
        db.drop_all()


@pytest.fixture()
def mocked_uuid(mocker):
    mock_uuid = mocker.patch.object(uuid, "uuid4", autospec=True)
    mock_uuid.return_value = uuid.UUID(hex="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
    return mock_uuid


@pytest.fixture()
def mocked_user_model(mocked_uuid):
    mocked_uuid = mocked_uuid()
    return Users(
        "fake@e.mail",
        str(mocked_uuid),
        "A Name",
        AuthType.GOOGLE,
        "link",
    )


@pytest.fixture()
def mocked_project_model(mocked_uuid):
    mocked_uuid = mocked_uuid()
    return Projects(
        str(mocked_uuid),
        str(mocked_uuid),
        "Test",
        [],
    )
