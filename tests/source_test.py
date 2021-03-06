import json

import pytest


# pylint: disable = redefined-outer-name,too-few-public-methods,too-many-arguments
@pytest.fixture
def mocked_source_request(mocked_project_request):
    mocked_request = mocked_project_request
    mocked_request["source_link"] = "link"
    return mocked_request


@pytest.fixture
def mocked_delete_source_request(mocked_project_request, mocked_uuid):
    mocked_request = mocked_project_request
    mocked_request["source_id"] = str(mocked_uuid())
    return mocked_request


def mocked_source_map(mocked_uuid: str = None, link: str = None):
    if mocked_uuid and link:
        return {
            "source_list": [str(mocked_uuid)],
            "source_map": {str(mocked_uuid): link},
        }
    return {"source_list": [], "source_map": {}}


@pytest.fixture
def microlink_api():
    return "https://api.microlink.io?url="


def mocked_microlink_response_success_mostly_null():
    mocked_response = {
        "status": "success",
        "data": {
            "title": None,
            "description": None,
            "lang": None,
            "author": "First M. Last",
            "publisher": None,
            "image": None,
            "date": None,
            "url": "https://www.blank.org",
            "logo": {
                "url": "https://www.blank.org/favicon.ico",
                "type": "ico",
                "size": 326,
                "height": 32,
                "width": 32,
                "size_pretty": "326 B",
            },
        },
    }
    return mocked_response


def mocked_microlink_response_success_some_null():
    mocked_response = {
        "status": "success",
        "data": {
            "title": "10.1.1.83.5248.pdf",
            "description": None,
            "lang": "es",
            "author": None,
            "publisher": "cogprints.org",
            "image": None,
            "date": "2018-01-17T16:03:57.000Z",
            "url": "http://cogprints.org/7150/1/10.1.1.83.5248.pdf",
            "logo": {
                "url": "http://cogprints.org/favicon.ico",
                "type": "ico",
                "size": 2238,
                "height": 32,
                "width": 32,
                "size_pretty": "2.24 kB",
            },
        },
    }
    return mocked_response


def mocked_microlink_response_success():
    mocked_response = {
        "status": "success",
        "data": {
            "title": "Ethics of AI: how should we treat rational, sentient robots â€“ if they existed?",
            "description": "In the future, consciously aware robots could be part of our everyday world, deserving of moral respect and consideration.",
            "lang": "en",
            "author": "Hugh McLachlan",
            "publisher": "The Conversation",
            "image": {
                "url": "https://images.theconversation.com/files/279424/original/file-20190613-32327-1vzyd0q.png?ixlib=rb-1.1.0&q=45&auto=format&w=1356&h=668&fit=crop",
                "type": "png",
                "size": 1349603,
                "height": 668,
                "width": 1356,
                "size_pretty": "1.35 MB",
            },
            "date": "2020-09-16T11:42:58.000Z",
            "url": "http://theconversation.com/ethics-of-ai-how-should-we-treat-rational-sentient-robots-if-they-existed-118647",
            "logo": {
                "url": "https://logo.clearbit.com/theconversation.com",
                "type": "png",
                "size": 7483,
                "height": 128,
                "width": 128,
                "size_pretty": "7.48 kB",
            },
        },
    }
    return mocked_response


def mocked_microlink_response_fail():
    mocked_response = {
        "status": "fail",
        "data": {
            "url": "The URL `no` is not valid. Ensure it has protocol, hostname and is reachable."
        },
        "code": "EINVALURL",
        "more": "https://microlink.io/einvalurl",
        "report": "mailto:hello@microlink.io?subject=trimmed",
        "message": "The request has been not processed. See the errors above to know why.",
    }
    return mocked_response


# pylint: disable = invalid-name,no-self-use,unused-argument
class TestSourceDataFlow:
    @pytest.mark.parametrize(
        "mocked_microlink_response",
        [
            mocked_microlink_response_success_mostly_null,
            mocked_microlink_response_success_some_null,
            mocked_microlink_response_success,
            mocked_microlink_response_fail,
        ],
    )
    def test_add_source(
        self,
        client,
        db_session,
        socketio_client,
        mocked_uuid,
        mocked_project_model,
        mocked_source_request,
        mocked_user_model,
        requests_mock,
        microlink_api,
        mocked_microlink_response,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("add_source_to_project")

        # Mock Microlink requests
        mocked_microlink_response = mocked_microlink_response()
        mocked_source_request["source_link"] = mocked_microlink_response["data"]["url"]
        requests_mock.get(
            microlink_api + mocked_source_request["source_link"],
            text=json.dumps(mocked_microlink_response),
        )

        # Simulate login
        with client.session_transaction() as sess:
            sess["user"] = mocked_user_model.email
        db_session.add_all([mocked_user_model, mocked_project_model])
        db_session.commit()

        # Test original flow
        socketio_client.emit("add_source_to_project", mocked_source_request)
        recieved = socketio_client.get_received()

        # 1 emit for successful call, 2 emits for failed call
        emit_order = 0
        if mocked_microlink_response["status"] == "fail":
            assert recieved[emit_order]["name"] == "invalid_url"
            emit_order += 1
        assert recieved[emit_order]["name"] == "all_sources_server"

        [all_sources_server] = recieved[emit_order]["args"]
        if mocked_microlink_response["status"] == "success":
            assert all_sources_server == mocked_source_map(
                str(mocked_uuid()), mocked_source_request["source_link"]
            )
        else:
            assert all_sources_server == mocked_source_map()

    def test_delete_source(
        self,
        client,
        db_session,
        socketio_client,
        mocked_user_model,
        mocked_source_model,
        mocked_project_with_sources,
        mocked_delete_source_request,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("delete_source")

        with client.session_transaction() as sess:
            sess["user"] = mocked_user_model.email
        db_session.add_all(
            [mocked_user_model, mocked_source_model, mocked_project_with_sources]
        )
        db_session.commit()

        socketio_client.emit("delete_source", mocked_delete_source_request)
        recieved = socketio_client.get_received()
        assert recieved[0]["name"] == "all_sources_server"

        [all_sources_server] = recieved[0]["args"]
        assert all_sources_server == mocked_source_map()

        # Cannot add a test to check if the entry is still in the database
        # Doing so will cause a notorious pytest-flask-sqlalchemy bug and prevent this test from passing


class TestSourceInfoFlow:
    def test_get_all_sources(
        self,
        client,
        db_session,
        socketio_client,
        mocked_uuid,
        mocked_project_model,
        mocked_user_model,
        mocked_project_request,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("get_all_sources")

        # Simulate login
        with client.session_transaction() as sess:
            sess["user"] = mocked_user_model.email
        db_session.add_all([mocked_user_model, mocked_project_model])
        db_session.commit()

        # Test original flow
        socketio_client.emit("get_all_sources", mocked_project_request)
        recieved = socketio_client.get_received()
        assert recieved[0]["name"] == "all_sources"

        [all_sources] = recieved[0]["args"]
        assert all_sources == mocked_source_map()

    def test_get_all_sources_no_project(
        self,
        client,
        db_session,
        socketio_client,
        mocked_uuid,
        mocked_user_model,
        mocked_project_request,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("get_all_sources")

        # Simulate login
        with client.session_transaction() as sess:
            sess["user"] = mocked_user_model.email
        db_session.add(mocked_user_model)
        db_session.commit()

        # Test original flow
        socketio_client.emit("get_all_sources", mocked_project_request)
        recieved = socketio_client.get_received()
        assert recieved == []
