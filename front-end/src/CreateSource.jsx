/* eslint-disable react/no-array-index-key */
import React, { useRef, useState } from "react";
import { Button, Col, Container, Form, Row, Alert } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import validator from 'validator';
import PropTypes from 'prop-types';
import Socket from './Socket';
import AlertMessage from './AlertMessage';

export default function CreateSource(props) {
  const [sourcesList, setSourcesList] = useState([]);
  const [sourcesMapList, setSourcesMapList] = useState([]);
  const [show, setShow] = useState(false);
  const myRef = useRef(null)
  const { usingProject } = props;

  function handleSubmit(event) {
    const sourceLink = myRef.current.value;
    console.log(sourceLink);
    event.preventDefault();
    console.log("SOURCES", sourcesList);
    if (validator.isEmpty(validator.trim(sourceLink))) {
      setShow(true)
      event.preventDefault();
    } else if (sourcesList.some(name => sourceLink === name)) {
      setShow(true)
    } else {
      console.log(`Got source link: ${sourceLink}`);
      Socket.emit('add_source_to_project', {
        project_name: usingProject,
        source_link: sourceLink,
      });
      myRef.current.value='';
    }
    event.preventDefault();
  }
  
  function deleteSource(index, projectName){
    console.log("DELETE");
    console.log(index);
    Socket.emit(
      'delete_source',
      {
        source_id: index,
        project_name: projectName
      }
    );
  }
  
  function GetSourcesFromServer(){
    React.useEffect(() => {
      Socket.on('all_sources_server', (data) => {
        console.log(`Received projects from server: ${data}`);
        setSourcesList(data.source_list);
        setSourcesMapList(data.source_map);
      });
    });
    console.log(sourcesList)
    console.log(sourcesMapList)
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
        console.log(`Received projects from server: ${data}`);
        setSourcesList(data.source_list);
        setSourcesMapList(data.source_map);
      });
    });
    console.log(sourcesList)
  }

  GetAllSources();

  return (
    <Container style={{textAlign:"center"}}>
      <div style={{display:"flex", justifyContent:"center"}} id="notif_project" />
      <Row xs={1}>
        <Col>
          <Alert show={show} style={{width: "40%"}} variant="danger" onClose={() => setShow(false)} dismissible>
              <Alert.Heading>Error!</Alert.Heading>
                <p>
                  Error Test
                </p>
           </Alert>
        </Col>
        <Col>
            <h3>{usingProject}</h3>
        </Col>
        <Col>
          {/* TODO: Add code to list all sources here */}
        </Col>
        <Col>
          <Form inline onSubmit={handleSubmit} style={{justifyContent:"center"}}>
            <Form.Group id="name_input">
              <Form.Label>Source</Form.Label>
              <Form.Control ref={myRef} type="text" placeholder="Enter Source name" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

CreateSource.propTypes = {
  usingProject: PropTypes.string.isRequired,
};
