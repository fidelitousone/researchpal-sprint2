/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react';
import {
  Button, Container, Row, Col, Form, Alert,
} from 'react-bootstrap';
import validator from 'validator';
import Socket from './Socket';

export default function CreateProject({ projects }) {
  /* TODO: Validate the props for project props */
  const myRef = useRef(null);
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function displayError(message) {
    setShow(true);
    setErrorMessage(message);
  }

  function handleSubmit(event) {
    const projectName = myRef.current.value;
    const projectList = Object.values(projects).map((obj) => obj.project_name);

    if (validator.isEmpty(validator.trim(projectName))) {
      displayError('Project name was empty or only whitespace.  Please try again with a valid project name.');
    } else if (projectList.some((name) => projectName === name)) {
      displayError('Project name is taken.  Please try again with a unique project name.');
    } else {
      Socket.emit('create_project', {
        project_name: projectName,
        socketid: Socket.id,
      });
    }
    myRef.current.value = '';
    event.preventDefault();
  }

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5%' }}>
        <Alert show={show} style={{ width: '40%' }} variant="danger" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Error!</Alert.Heading>
          <p>
            {errorMessage}
          </p>
        </Alert>
      </div>
      <Row>
        <Col>
          <Form inline onSubmit={handleSubmit} style={{ justifyContent: 'center' }}>
            <Form.Group controlId="formProjectInput">
              <Form.Control ref={myRef} type="text" placeholder="Enter new project name" />
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
