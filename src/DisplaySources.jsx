/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Container, ListGroup, Button, Card, Spinner, Modal,
} from 'react-bootstrap';
import Socket from './Socket';

export default function DisplaySources(props) {
  const [sourcesMapList, setSourcesMapList] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [delSource, setDelSource] = useState('');
  const [confirm, setConfirm] = useState(false);

  const { usingProject } = props;

  const handleClose = () => setConfirm(false);
  const handleShow = () => setConfirm(true);

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

  const confirmDelete = () => (
    <Modal show={confirm} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete source
        </p>
        <p>
          {' '}
          {sourcesMapList[delSource]}
        </p>
        <p>This will also delete its related citation information</p>
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

  const GetSourcesFromServer = () => (
    useEffect(() => {
      Socket.on('all_sources_server', (data) => {
        setSpinning(false);
        setSourcesMapList(data.source_map);
      });
      return () => {
        Socket.off('all_sources_server');
      };
    })
  );

  function SpinnerObject() {
    if (spinning) {
      return <Spinner animation="border" variant="primary" />;
    }
    return null;
  }

  GetSourcesFromServer();

  const GetAllSources = () => {
    useEffect(() => {
      Socket.emit('get_all_sources', {
        project_name: usingProject,
      });
    }, []);
    useEffect(() => {
      Socket.on('all_sources', (data) => {
        setSourcesMapList(data.source_map);
      });
      return () => {
        Socket.off('all_sources');
      };
    });
  };
  GetAllSources();

  return (
    <Container>
      {confirmDelete()}
      <Card style={{ height: '600px' }}>
        <Card.Header>
          {usingProject}
          {' '}
          Sources
        </Card.Header>
        <ListGroup style={{ textAlign: 'left' }} variant="flush">
          {Object.entries(sourcesMapList).map(([sourceID, sourceName]) => (
            <ListGroup.Item key={sourceID}>
              {sourceName}
              <Button
                onClick={
                  () => {
                    setDelSource(sourceID);
                    handleShow();
                  }
                }
                variant="danger"
                style={
                  { float: 'right', marginLeft: '20px' }
                }
              >
                DELETE
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <SpinnerObject spinning={spinning} />
      </Card>
    </Container>
  );
}
