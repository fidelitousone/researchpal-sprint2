/* eslint-disable react/no-array-index-key */
import React, { useRef, useState } from "react";
import { Button, Col, Container, Form, Row, Alert, ListGroup } from 'react-bootstrap';
import validator from 'validator';
import PropTypes from 'prop-types';
import Socket from './Socket';
import { BsFillDashCircleFill } from 'react-icons/bs'

export default function CreateSource(props) {
  const [sourcesList, setSourcesList] = useState([]);
  const [sourcesMapList, setSourcesMapList] = useState([]);
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const myRef = useRef(null)
  const { usingProject } = props;

  function displayError(message) {
    setShow(true)
    setErrorMessage(message)
  }

  function handleSubmit(event) {
    const sourceLink = myRef.current.value;
    console.log(sourceLink);
    console.log("SOURCES", sourcesList);
    if (validator.isEmpty(validator.trim(sourceLink))) {
      displayError("Source name was empty or only whitespace. Please try again with a valid project name.")
    } else if (sourcesList.some(name => sourceLink === name)) {
      displayError("Source name is taken. Please try again with a unique project name.")
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
      <div style={{display:"flex", justifyContent:"center", marginTop:"1.5%"}}>
            <Alert show={show} style={{width: "40%"}} variant="danger" onClose={() => setShow(false)} dismissible>
              <Alert.Heading>Error!</Alert.Heading>
                <p>
                  {errorMessage}
                </p>
           </Alert>
      </div>
      <Row xs={1}>
        <Col>
            <h3>{usingProject}</h3>
        </Col>
        <ListGroup style={{paddingTop: "2%", paddingBottom: "2%" ,alignItems: "center"}}>
          {Object.entries(sourcesMapList).map(([sourceID, sourceName]) => (
            <ListGroup.Item key={sourceID}>{sourceName}<Button onClick={() => deleteSource(sourceID, usingProject)} variant="danger" style={{float: "right", marginLeft: "20px"}}><BsFillDashCircleFill /></Button></ListGroup.Item>
          ))}
        </ListGroup>
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
