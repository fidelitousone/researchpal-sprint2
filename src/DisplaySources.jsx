/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Container, ListGroup, Button, Card, Spinner,
} from 'react-bootstrap';
import { BsFillDashCircleFill } from 'react-icons/bs';
import Socket from './Socket';
import DeleteConfirmation from './DeleteConfirmation';

export default function DisplaySources(props) {
  const [sourcesList, setSourcesList] = useState([]);
  const [sourcesMapList, setSourcesMapList] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [delSource, setDelSource] = useState('');
  const [confirm, setConfirm] = useState(false);

  const { usingProject } = props;

  const handleConfirmation = () => (
    setConfirm(true)
  );

  const triggerConfirmation = () => (
    <DeleteConfirmation />
  );

  const GetSourcesFromServer = () => (
    useEffect(() => {
      Socket.on('all_sources_server', (data) => {
        setSpinning(false);
        setSourcesList(data.source_list);
        setSourcesMapList(data.source_map);
      });
      return () => {
        Socket.off('all_sources_server');
      };
    })
  );

  const handleShow = () => setConfirm(true);
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
        setSourcesList(data.source_list);
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
      <DeleteConfirmation showState={confirm} />
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
                onClick={handleConfirmation}
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
      </Card>

    </Container>
  );
}
