import pytest

from app import Citations


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


class TestBibliographyFlow:
    def test_add_to_bibliography(
        self,
        client,
        db_session,
        socketio_client,
        mocked_citation_model,
        mocked_source_model,
        mocked_project_with_sources,
        mocked_user_model,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("add_to_bibliography")

        # Simulate login
        with client.session_transaction() as sess:
            sess["user"] = mocked_user_model.email
        mocked_citation_model.is_cited = False
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
        socketio_client.emit(
            "add_to_bibliography", {"source_id": mocked_citation_model.source_id}
        )
        citation_state = (
            db_session.query(Citations)
            .filter(Citations.source_id == mocked_citation_model.source_id)
            .one()
        )
        assert citation_state.is_cited

    def test_remove_from_bibliography(
        self,
        client,
        db_session,
        socketio_client,
        mocked_citation_model,
        mocked_source_model,
        mocked_project_with_sources,
        mocked_user_model,
    ):
        with pytest.raises(TypeError):
            socketio_client.emit("remove_from_bibliography")

        # Simulate login
        with client.session_transaction() as sess:
            sess["user"] = mocked_user_model.email
        mocked_citation_model.is_cited = True
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
        socketio_client.emit(
            "remove_from_bibliography", {"source_id": mocked_citation_model.source_id}
        )
        citation_state = (
            db_session.query(Citations)
            .filter(Citations.source_id == mocked_citation_model.source_id)
            .one()
        )
        assert not citation_state.is_cited
