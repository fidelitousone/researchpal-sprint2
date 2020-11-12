import pytest

from app import app, socketio


@pytest.fixture
def client():
    app.config["TESTING"] = True

    with app.test_client() as test_client:
        yield test_client


@pytest.fixture
def socketio_client():
    yield socketio.test_client(app)


def test_main_page(client):
    page = client.get("/")
    assert b"ResearchPal" in page.data


def test_dashboard_page(client):
    page = client.get("/home")
    assert b"ResearchPal" in page.data


def test_project_page(client):
    page = client.get("/project")
    assert b"ResearchPal" in page.data
