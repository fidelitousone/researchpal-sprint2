import pytest


# pylint: disable = redefined-outer-name,too-few-public-methods,too-many-arguments
# pylint: disable = invalid-name,no-self-use,unused-argument
@pytest.fixture
def mocked_create_project_response(mocked_uuid, mocked_project_model):
    mocked_uuid = mocked_uuid()
    return {str(mocked_uuid): mocked_project_model.json()}


# This fixes a bug with the session not initializing properly
class TestFix:
    def test_session(self, client, db):
        with client.session_transaction() as sess:
            assert sess is not None


class TestProjectFlow:
    def test_on_create_project_no_login(
        self, db, socketio_client, mocked_project_request
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("create_project")

        socketio_client.emit("create_project", mocked_project_request)
        recieved = socketio_client.get_received()
        assert recieved == []

    def test_on_create_project(
        self,
        client,
        db,
        socketio_client,
        mocked_user_model,
        mocked_project_request,
        mocked_create_project_response,
    ):
        # Simulate login
        with client.session_transaction() as sess:
            sess["user"] = mocked_user_model.email
        db.session.add(mocked_user_model)
        db.session.commit()

        # Test original flow
        socketio_client.emit("create_project", mocked_project_request)
        recieved = socketio_client.get_received()
        assert recieved[0]["name"] == "all_projects"

        [all_projects] = recieved[0]["args"]
        assert all_projects == mocked_create_project_response

    def test_on_select_project(
        self, client, db, socketio_client, mocked_project_request
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("select_project")

        socketio_client.emit("select_project", mocked_project_request)
        with client.session_transaction() as sess:
            assert sess["selected_project"] == mocked_project_request["project_name"]

    def test_on_request_project_no_login(
        self, client, db, socketio_client, mocked_project_request
    ):
        with client.session_transaction() as sess:
            sess["selected_project"] = mocked_project_request["project_name"]

        socketio_client.emit("request_selected_project")
        recieved = socketio_client.get_received()
        assert recieved == []

    def test_on_request_project(
        self, client, db, socketio_client, mocked_project_request
    ):
        with client.session_transaction() as sess:
            sess["user"] = "fake@e.mail"
            sess["selected_project"] = mocked_project_request["project_name"]

        socketio_client.emit("request_selected_project")
        recieved = socketio_client.get_received()
        assert recieved[0]["name"] == "give_project_name"

        [give_project_name] = recieved[0]["args"]
        assert give_project_name == mocked_project_request
