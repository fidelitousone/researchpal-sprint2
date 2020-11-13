import pytest


# pylint: disable = redefined-outer-name
@pytest.fixture()
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


@pytest.fixture()
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


@pytest.fixture()
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


@pytest.fixture()
def mocked_invalid_response():
    mocked_response = {"invalid": "response"}
    return mocked_response


@pytest.fixture()
def mocked_login_request():
    mocked_request = {"email": "fake@e.mail"}
    return mocked_request


@pytest.fixture()
def mocked_new_project():
    mocked_project = {"project_name": "Test"}
    return mocked_project
 
@pytest.fixture()   
def mocked_session_get():
    return mock_get

@pytest.fixture()
def mocked_create_project_response(mocked_uuid, mocked_project_model):
    mocked_uuid = mocked_uuid()
    return {str(mocked_uuid): mocked_project_model.json()}


# pylint: disable = no-self-use
# pylint: disable = unused-argument
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
        self, db, socketio_client, mocked_google_response, mocked_invalid_response
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("new_google_user")

        socketio_client.emit("new_google_user", mocked_google_response)
        socketio_client.emit("new_google_user", mocked_invalid_response)

    def test_on_new_facebook_user(
        self, db, socketio_client, mocked_facebook_response, mocked_invalid_response
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("new_facebook_user")

        socketio_client.emit("new_facebook_user", mocked_facebook_response)
        socketio_client.emit("new_facebook_user", mocked_invalid_response)

    def test_on_new_microsoft_user(
        self, db, socketio_client, mocked_microsoft_response, mocked_invalid_response
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("new_microsoft_user")

        socketio_client.emit("new_microsoft_user", mocked_microsoft_response)
        socketio_client.emit("new_microsoft_user", mocked_invalid_response)


class TestLoginFlow:
    def test_on_login_request(
        self, db, socketio_client, mocked_login_request, mocked_user_model
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("login_request")

        db.session.add(mocked_user_model)
        socketio_client.emit("login_request", mocked_login_request)

        recieved = socketio_client.get_received()
        assert recieved[0]["name"] == "login_response"

        [login_response] = recieved[0]["args"]
        assert login_response == mocked_user_model.json()


"""class TestProjectFlow:
    def test_on_create_project(
        self, db, socketio_client, mocked_new_project, mocked_create_project_response, mocked_session_get
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("create_project")
        
        if not mocked_session_get is None:
            socketio_client.emit("create_project", mocked_new_project)
            recieved = socketio_client.get_received()
            print("HERE:" + str(recieved))
            assert recieved[0]["name"] == "all_projects"
    
            [all_projects] = recieved[0]["args"]
            assert all_projects == mocked_create_project_response"""
