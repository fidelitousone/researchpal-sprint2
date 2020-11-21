import pytest

from app import AuthType, Users


# pylint: disable = redefined-outer-name,too-few-public-methods,too-many-arguments
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


def mocked_invalid_response():
    mocked_response = {"invalid": "response"}
    return mocked_response


@pytest.fixture
def microlink_api():
    return "https://api.microlink.io?url="


@pytest.fixture
def mocked_login_request():
    mocked_request = {"email": "fake@e.mail"}
    return mocked_request


# pylint: disable = invalid-name,no-self-use,unused-argument
class TestRenderTemplate:
    @pytest.mark.parametrize("route", ["/", "/home", "/project"])
    def test_routes(self, client, route):
        page = client.get(route)
        assert b"ResearchPal" in page.data


class TestNewUser:
    @pytest.mark.parametrize(
        "emit_name,mocked_response,auth_type",
        [
            ("new_google_user", mocked_google_response, AuthType.GOOGLE),
            ("new_facebook_user", mocked_facebook_response, AuthType.FACEBOOK),
            ("new_microsoft_user", mocked_microsoft_response, AuthType.MICROSOFT),
        ],
    )
    def test_on_new_user(
        self,
        db,
        socketio_client,
        mocked_user_model,
        emit_name,
        mocked_response,
        auth_type,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit(emit_name)

        socketio_client.emit(emit_name, mocked_response())
        user_info = (
            db.session.query(Users)
            .filter(Users.email == mocked_user_model.email)
            .first()
        )

        mocked_user_model.auth_type = auth_type.value
        assert user_info.json() == mocked_user_model.json()

    @pytest.mark.parametrize(
        "emit_name,mocked_response,auth_type",
        [
            ("new_google_user", mocked_invalid_response, AuthType.GOOGLE),
            ("new_facebook_user", mocked_invalid_response, AuthType.FACEBOOK),
            ("new_microsoft_user", mocked_invalid_response, AuthType.MICROSOFT),
        ],
    )
    def test_on_new_user_invalid(
        self,
        db,
        socketio_client,
        mocked_user_model,
        emit_name,
        mocked_response,
        auth_type,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit(emit_name)

        socketio_client.emit(emit_name, mocked_response())
        user_info = (
            db.session.query(Users)
            .filter(Users.email == mocked_user_model.email)
            .first()
        )

        assert user_info is None


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
