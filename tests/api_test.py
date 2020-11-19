import pytest


@pytest.fixture
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


@pytest.fixture
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


@pytest.fixture
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
