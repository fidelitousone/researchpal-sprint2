import pytest


# pylint: disable = redefined-outer-name,too-few-public-methods,too-many-arguments
@pytest.fixture
def mocked_citation_list(mocked_citation_model):
    return {
        "citation_list": [
            {
                "source_id": mocked_citation_model.source_id,
                "is_cited": mocked_citation_model.is_cited,
                "mla": mocked_citation_model.mla_citation,
                "apa": mocked_citation_model.apa_citation,
            },
        ],
    }


# pylint: disable = invalid-name,no-self-use,unused-argument
class TestCitationFlow:
    def test_get_all_citatons(
        self,
        client,
        db_session,
        socketio_client,
        mocked_citation_model,
        mocked_source_model,
        mocked_project_with_sources,
        mocked_user_model,
        mocked_project_request,
        mocked_citation_list,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("get_all_citations")

        # Simulate login
        with client.session_transaction() as sess:
            sess["user"] = mocked_user_model.email
        db_session.add_all(
            [
                mocked_citation_model,
                mocked_source_model,
                mocked_user_model,
                mocked_project_with_sources,
            ]
        )
        db_session.commit()

        # Test original flow
        socketio_client.emit("get_all_citations", mocked_project_request)
        recieved = socketio_client.get_received()
        assert recieved[0]["name"] == "all_citations"

        [all_citations] = recieved[0]["args"]
        assert all_citations == mocked_citation_list

    def test_get_all_citatons_no_project(
        self,
        client,
        db_session,
        socketio_client,
        mocked_user_model,
        mocked_project_request,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("get_all_citations")

        # Simulate login
        with client.session_transaction() as sess:
            sess["user"] = mocked_user_model.email
        db_session.add(mocked_user_model)
        db_session.commit()

        # Test original flow
        socketio_client.emit("get_all_citations", mocked_project_request)
        recieved = socketio_client.get_received()
        assert recieved == []
