import json

import pytest

from app import AuthType, Users


# pylint: disable = redefined-outer-name,too-few-public-methods,too-many-arguments
@pytest.fixture
def mocked_google_response():
    mocked_response = {
        "response": {
            "profileObj": {
                "email": "fake@e.mail",
                "name": "A Name",
                "imageUrl": "link",
            }
        }
    }
    return mocked_response


@pytest.fixture
def mocked_facebook_response():
    mocked_response = {
        "response": {
            "email": "fake@e.mail",
            "name": "A Name",
            "picture": {
                "data": {
                    "url": "link",
                }
            },
        }
    }
    return mocked_response


@pytest.fixture
def mocked_microsoft_response():
    mocked_response = {
        "response": {
            "account": {
                "userName": "fake@e.mail",
                "name": "A Name",
                "imageUrl": "link",
            }
        }
    }
    return mocked_response


@pytest.fixture
def mocked_invalid_response():
    mocked_response = {"invalid": "response"}
    return mocked_response


@pytest.fixture
def mocked_login_request():
    mocked_request = {"email": "fake@e.mail"}
    return mocked_request


@pytest.fixture
def mocked_new_project():
    mocked_project = {"project_name": "Test"}
    return mocked_project


@pytest.fixture
def mocked_add_source():
    mocked_request = {"project_name": "Test", "source_link": "link"}
    return mocked_request


@pytest.fixture
def mocked_create_project_response(mocked_uuid, mocked_project_model):
    mocked_uuid = mocked_uuid()
    return {str(mocked_uuid): mocked_project_model.json()}


# pylint: disable = invalid-name,no-self-use,unused-argument
class TestRenderTemplate:
    def test_main_page(self, client):
        page = client.get("/")
        assert b"ResearchPal" in page.data

    def test_dashboard_page(self, client):
        page = client.get("/home")
        assert b"ResearchPal" in page.data

    def test_project_page(self, client):
        page = client.get("/project")
        assert b"ResearchPal" in page.data


class TestNewUser:
    def test_on_new_google_user(
        self,
        db,
        socketio_client,
        mocked_google_response,
        mocked_invalid_response,
        mocked_user_model,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("new_google_user")

        socketio_client.emit("new_google_user", mocked_google_response)
        mocked_user_model.auth_type = AuthType.GOOGLE.value
        user_info = (
            db.session.query(Users)
            .filter(Users.email == mocked_user_model.email)
            .first()
        )
        assert user_info.json() == mocked_user_model.json()

        socketio_client.emit("new_google_user", mocked_invalid_response)

    def test_on_new_facebook_user(
        self,
        db,
        socketio_client,
        mocked_facebook_response,
        mocked_invalid_response,
        mocked_user_model,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("new_facebook_user")

        socketio_client.emit("new_facebook_user", mocked_facebook_response)
        mocked_user_model.auth_type = AuthType.FACEBOOK.value
        user_info = (
            db.session.query(Users)
            .filter(Users.email == mocked_user_model.email)
            .first()
        )
        assert user_info.json() == mocked_user_model.json()

        socketio_client.emit("new_facebook_user", mocked_invalid_response)

    def test_on_new_microsoft_user(
        self,
        db,
        socketio_client,
        mocked_microsoft_response,
        mocked_invalid_response,
        mocked_user_model,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("new_microsoft_user")

        socketio_client.emit("new_microsoft_user", mocked_microsoft_response)
        mocked_user_model.auth_type = AuthType.MICROSOFT.value
        user_info = (
            db.session.query(Users)
            .filter(Users.email == mocked_user_model.email)
            .first()
        )
        assert user_info.json() == mocked_user_model.json()

        socketio_client.emit("new_microsoft_user", mocked_invalid_response)


class TestLoginFlow:
    def test_on_login_request(
        self, db, socketio_client, mocked_user_model, mocked_login_request
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("login_request")

        db.session.add(mocked_user_model)
        socketio_client.emit("login_request", mocked_login_request)

        recieved = socketio_client.get_received()
        assert recieved[0]["name"] == "login_response"

        [login_response] = recieved[0]["args"]
        assert login_response == mocked_user_model.json()


class TestLogoutFlow:
    def test_on_logout_no_login(self, db, socketio_client):
        socketio_client.emit("logout")
        recieved = socketio_client.get_received()
        assert recieved == []

    def test_on_logout(
        self, client, db, socketio_client, mocked_user_model, mocked_login_request
    ):
        # Simulate login
        with client.session_transaction() as sess:
            sess["user"] = mocked_user_model.email
        db.session.add(mocked_user_model)
        db.session.commit()

        # Test original flow
        socketio_client.emit("logout")
        recieved = socketio_client.get_received()
        assert recieved == []


class TestProjectFlow:
    def test_on_create_project_no_login(self, db, socketio_client, mocked_new_project):
        with pytest.raises(TypeError):
            socketio_client.emit("create_project")

        socketio_client.emit("create_project", mocked_new_project)
        recieved = socketio_client.get_received()
        assert recieved == []

    def test_on_create_project(
        self,
        client,
        db,
        socketio_client,
        mocked_user_model,
        mocked_new_project,
        mocked_create_project_response,
    ):
        # Simulate login
        with client.session_transaction() as sess:
            sess["user"] = mocked_user_model.email
        db.session.add(mocked_user_model)
        db.session.commit()

        # Test original flow
        socketio_client.emit("create_project", mocked_new_project)
        recieved = socketio_client.get_received()
        assert recieved[0]["name"] == "all_projects"

        [all_projects] = recieved[0]["args"]
        assert all_projects == mocked_create_project_response

    def test_on_select_project(self, client, db, socketio_client, mocked_new_project):
        with pytest.raises(TypeError):
            socketio_client.emit("select_project")

        socketio_client.emit("select_project", mocked_new_project)
        with client.session_transaction() as sess:
            assert sess["selected_project"] == mocked_new_project["project_name"]

    def test_on_request_project_no_login(
        self, client, db, socketio_client, mocked_new_project
    ):
        with client.session_transaction() as sess:
            sess["selected_project"] = mocked_new_project["project_name"]

        socketio_client.emit("request_selected_project")
        recieved = socketio_client.get_received()
        assert recieved == []

    def test_on_request_project(self, client, db, socketio_client, mocked_new_project):
        with client.session_transaction() as sess:
            sess["user"] = "fake@e.mail"
            sess["selected_project"] = mocked_new_project["project_name"]

        socketio_client.emit("request_selected_project")
        recieved = socketio_client.get_received()
        assert recieved[0]["name"] == "give_project_name"

        [give_project_name] = recieved[0]["args"]
        assert give_project_name == mocked_new_project


class TestSourceFlow:
    def test_add_source(
        self,
        db,
        socketio_client,
        mocked_project_model,
        mocked_add_source,
        requests_mock,
        mocked_microlink_api,
        mocked_microlink_response_success_null,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("add_source_to_project")

        db.session.add(mocked_project_model)
        db.session.commit()

        mocked_add_source["source_link"] = mocked_microlink_response_success_null[
            "data"
        ]["url"]
        requests_mock.get(
            mocked_microlink_api + mocked_add_source["source_link"],
            text=json.dumps(mocked_microlink_response_success_null),
        )
        socketio_client.emit("add_source_to_project", mocked_add_source)
        recieved = socketio_client.get_received()
        assert recieved[0]["name"] == "all_sources"

        [all_sources] = recieved[0]["args"]
        assert all_sources == mocked_project_model.json()

    def test_get_all_sources(
        self, db, socketio_client, mocked_project_model, mocked_new_project
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("get_all_sources")

        db.session.add(mocked_project_model)
        db.session.commit()

        socketio_client.emit("get_all_sources", mocked_new_project)
        recieved = socketio_client.get_received()
        assert recieved[0]["name"] == "all_sources"

        [all_sources] = recieved[0]["args"]
        assert all_sources == mocked_project_model.json()


class TestUserInfo:
    def test_on_request_user_info_no_login(self, db, socketio_client):
        socketio_client.emit("request_user_info")
        recieved = socketio_client.get_received()
        assert recieved == []

    def test_on_request_user_info(
        self, client, db, socketio_client, mocked_user_model, mocked_login_request
    ):
        # Simulate login
        with client.session_transaction() as sess:
            sess["user"] = mocked_user_model.email
        db.session.add(mocked_user_model)
        db.session.commit()

        # Test original flow
        socketio_client.emit("request_user_info")
        recieved = socketio_client.get_received()
        assert recieved[0]["name"] == "user_info"

        [user_info] = recieved[0]["args"]
        assert user_info == mocked_user_model.json()
