import json

import pytest


# pylint: disable = redefined-outer-name,too-few-public-methods,too-many-arguments
@pytest.fixture
def mocked_source_request(mocked_project_request):
    mocked_request = mocked_project_request
    mocked_request["source_link"] = "link"
    return mocked_request


@pytest.fixture
def microlink_api():
    return "https://api.microlink.io?url="


def mocked_microlink_response_success_null():
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
class TestSourceFlow:
    @pytest.mark.parametrize(
        "mocked_microlink_response",
        [
            mocked_microlink_response_success_null,
            mocked_microlink_response_success,
            mocked_microlink_response_fail,
        ],
    )
    def test_add_source(
        self,
        db,
        socketio_client,
        mocked_project_model,
        mocked_source_request,
        requests_mock,
        microlink_api,
        mocked_microlink_response,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("add_source_to_project")

        mocked_microlink_response = mocked_microlink_response()
        mocked_source_request["source_link"] = mocked_microlink_response["data"]["url"]
        requests_mock.get(
            microlink_api + mocked_source_request["source_link"],
            text=json.dumps(mocked_microlink_response),
        )

        db.session.add(mocked_project_model)
        db.session.commit()

        socketio_client.emit("add_source_to_project", mocked_source_request)
        recieved = socketio_client.get_received()
        assert recieved[0]["name"] == "all_sources"

        [all_sources] = recieved[0]["args"]
        assert all_sources == mocked_project_model.json()

    def test_get_all_sources(
        self, db, socketio_client, mocked_project_model, mocked_project_request
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("get_all_sources")

        db.session.add(mocked_project_model)
        db.session.commit()

        socketio_client.emit("get_all_sources", mocked_project_request)
        recieved = socketio_client.get_received()
        assert recieved[0]["name"] == "all_sources"

        [all_sources] = recieved[0]["args"]
        assert all_sources == mocked_project_model.json()
