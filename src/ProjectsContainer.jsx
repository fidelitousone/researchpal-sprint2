/* eslint-disable react/prop-types */
import React from 'react';
import { Container, Card, ListGroup } from 'react-bootstrap';

export default function ProjectsContainer(props) {
  const { projects } = props;

  return (
    <Container>
      <Card style={{ height: '600px' }}>
        <Card.Header style={{ textAlign: 'center' }}>My Projects</Card.Header>
        <ListGroup
          variant="flush"
          style={{
            float: 'left', overflow: 'auto',
          }}
        >
          {Object.keys(projects).map((id) => (
            <ListGroup.Item key={id} action style={{ width: '100%', textAlign: 'center' }}>
              <p>{projects[id].project_name}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </Container>
  );
}
