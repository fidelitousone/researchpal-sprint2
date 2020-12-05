/* eslint-disable react/no-array-index-key */
import React, { useRef, useState } from 'react';
import {
  Button, Col, Container, Form, Row, Alert, ListGroup, Modal, Spinner,
} from 'react-bootstrap';
import validator from 'validator';
import PropTypes from 'prop-types';
import { BsFillDashCircleFill } from 'react-icons/bs';
import Socket from './Socket';

export default function CreateSource(props) {
  const [sourcesList, setSourcesList] = useState([]);
  const [sourcesMapList, setSourcesMapList] = useState([]);
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const myRef = useRef(null);
  const { usingProject } = props;

  const [confirm, setConfirm] = useState(false);
  const [delSource, setDelSource] = useState('');

  const handleShow = () => setConfirm(true);
  const handleClose = () => setConfirm(false);

  const [spinning, setSpinning] = useState(false);

  function displayError(message) {
    setShow(true);
    setErrorMessage(message);
  }

  function SpinnerObject() {
    if (spinning) {
      return <Spinner animation="border" variant="primary" />;
    }
    return null;
  }

  function handleUpload(event) {
    const reader = new FileReader();
    event.preventDefault();
    // console.log(event.target.files);
    const file = document.getElementById('bulk-import');
    console.log(file.value);
    console.log(file.files[0].slice());

    reader.readAsText(file.files[0]);

    reader.onload = function () {
      console.log(reader.result);
    };

    reader.onerror = function () {
      console.log(reader.error);
    };

    // console.log(file);
  }

  function handleSubmit(event) {
    const sourceLink = myRef.current.value;
    console.log(sourceLink);
    console.log(sourcesList);
    console.log(sourcesMapList);
    if (validator.isEmpty(validator.trim(sourceLink))) {
      displayError('Source URL was empty or only whitespace. Please try again with a valid source URL.');
    } else if (Object.values(sourcesMapList).some((name) => sourceLink === name)) {
      displayError('Source URL is already exists. Please try again with a unique source URL.');
    } else {
      setSpinning(true);
      Socket.emit('add_source_to_project', {
        project_name: usingProject,
        source_link: sourceLink,
      });
      myRef.current.value = '';
    }
    event.preventDefault();
  }

  function deleteSource(index, projectName) {
    handleClose();
    Socket.emit(
      'delete_source',
      {
        source_id: index,
        project_name: projectName,
      },
    );
  }

  function InvalidURLError() {
    React.useEffect(() => {
      Socket.on('invalid_url', (data) => {
        setSpinning(false);
        displayError(`Invalid URL: [ ${data.source_link} ]  Please ensure that you have copied the entire URL (including the protocol)`);
      });
    });
  }

  InvalidURLError();

  function GetSourcesFromServer() {
    React.useEffect(() => {
      Socket.on('all_sources_server', (data) => {
        setSpinning(false);
        setSourcesList(data.source_list);
        setSourcesMapList(data.source_map);
      });
    });
  }

  GetSourcesFromServer();

  function GetAllSources() {
    React.useEffect(() => {
      Socket.emit('get_all_sources', {
        project_name: usingProject,
      });
    }, []);
    React.useEffect(() => {
      Socket.on('all_sources', (data) => {
        setSourcesList(data.source_list);
        setSourcesMapList(data.source_map);
      });
    });
  }

  GetAllSources();

  function ConfirmDelete() {
    // eslint-disable-next-line
    console.log('IN CONFIRM DELETE');

    return (
      <Modal show={confirm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete source
          {' '}
          <b>
            {sourcesMapList[delSource]}
          </b>
          ?
          <br />
          <br />
          This will also delete its associated citation information.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={
              () => {
                deleteSource(delSource, usingProject);
              }
            }
          >
            Delete Source
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Container style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5%' }}>
        <Alert show={show} style={{ width: '40%' }} variant="danger" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Error!</Alert.Heading>
          <p>
            {errorMessage}
          </p>
        </Alert>
      </div>

      <ConfirmDelete />

      <Row xs={1}>
        <Col>
          <h3>{usingProject}</h3>
        </Col>
        <ListGroup style={{ paddingTop: '2%', paddingBottom: '2%', alignItems: 'center' }}>
          {Object.entries(sourcesMapList).map(([sourceID, sourceName]) => (
            <ListGroup.Item key={sourceID}>
              {sourceName}
              <Button
                onClick={
                  () => {
                    setDelSource(sourceID);
                    // eslint-disable-next-line
                    console.log('CLICK');
                    handleShow();
                  }
                }
                variant="danger"
                style={
                  { float: 'right', marginLeft: '20px' }
                }
              >
                <BsFillDashCircleFill />
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Col>
          <Form inline onSubmit={handleSubmit} style={{ justifyContent: 'center' }}>
            <Form.Group id="name_input">
              <Form.Label>Source</Form.Label>
              <Form.Control ref={myRef} type="text" placeholder="Enter Source name" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          <br />
          <Form inline onSubmit={handleUpload} style={{ justifyContent: 'center' }}>
            <Form.File>
              <Form.File.Input id="bulk-import" />
            </Form.File>
            <Button variant="primary" type="submit">
              Upload
            </Button>
          </Form>
          <br />
          <SpinnerObject spinning={spinning} />
        </Col>
      </Row>
    </Container>
  );
}

CreateSource.propTypes = {
  usingProject: PropTypes.string.isRequired,
};
